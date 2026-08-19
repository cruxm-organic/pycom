



import React, { useState, useRef, useEffect } from 'react';
// Fix: Add .tsx extension to module path
import { MicrophoneIcon, StopIcon, PlayIcon } from '../Icons.tsx';

const API_BASE = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000';

type AudioTool = 'live' | 'transcribe' | 'tts';

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
// --- End Audio Helper Functions ---

const AudioSuite: React.FC = () => {
  const [activeTool, setActiveTool] = useState<AudioTool>('live');

  const LiveChat = () => {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [status, setStatus] = useState('Idle. Press Start to talk.');
    const wsRef = useRef<WebSocket | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);

    const cleanup = () => {
      wsRef.current?.close();
      wsRef.current = null;
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      inputAudioContextRef.current?.close();
      inputAudioContextRef.current = null;
      sourcesRef.current.forEach(source => source.stop());
      sourcesRef.current.clear();
      outputAudioContextRef.current?.close();
      outputAudioContextRef.current = null;
      nextStartTimeRef.current = 0;
      setIsSessionActive(false);
    };

    const startSession = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        setIsSessionActive(true);
        setStatus('Connecting...');

        outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputAudioContextRef.current.createGain();
        outputNode.connect(outputAudioContextRef.current.destination);

        const wsProtocol = API_BASE.startsWith('https') ? 'wss' : 'ws';
        const wsUrl = API_BASE.replace(/^https?/, wsProtocol) + '/ws/live-chat';
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setStatus('Connection open. You can start talking now.');
          const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
          inputAudioContextRef.current = inputAudioContext;
          const source = inputAudioContext.createMediaStreamSource(stream);
          const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            if (ws.readyState !== WebSocket.OPEN) return;
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
            }
            ws.send(JSON.stringify({
              type: 'audio',
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            }));
          };
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContext.destination);
        };

        ws.onmessage = async (event) => {
          const message = JSON.parse(event.data);
          if (message.type === 'ready') return;
          if (message.type === 'error') {
            console.error('Live relay error:', message.message);
            setStatus(message.message || 'An error occurred.');
            cleanup();
            return;
          }
          if (message.type === 'audio' && outputAudioContextRef.current) {
            const ctx = outputAudioContextRef.current;
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
            const audioBuffer = await decodeAudioData(decode(message.data), ctx, 24000, 1);
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(outputNode);
            source.addEventListener('ended', () => sourcesRef.current.delete(source));
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
          }
          if (message.type === 'interrupted') {
            for (const source of sourcesRef.current.values()) {
              source.stop();
              sourcesRef.current.delete(source);
            }
            nextStartTimeRef.current = 0;
          }
        };

        ws.onerror = () => {
          setStatus('Connection error. Session closed.');
          cleanup();
        };

        ws.onclose = () => {
          setStatus('Session closed.');
          cleanup();
        };
      } catch (err) {
        console.error('Failed to get mic access:', err);
        setStatus('Microphone access denied.');
        setIsSessionActive(false);
      }
    };

    const stopSession = () => {
      wsRef.current?.send(JSON.stringify({ type: 'close' }));
      cleanup();
      setStatus('Idle. Press Start to talk.');
    };

    useEffect(() => () => cleanup(), []);

    return (
      <div className="text-center space-y-4">
        <p className="text-lg text-gray-300">Engage in a real-time voice conversation with Gemini.</p>
        <button onClick={isSessionActive ? stopSession : startSession} className={`px-8 py-4 font-bold rounded-full text-white flex items-center justify-center gap-3 mx-auto transition-colors ${isSessionActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>
          {isSessionActive ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
          {isSessionActive ? 'Stop Session' : 'Start Session'}
        </button>
        <div className="p-4 bg-gray-900/50 rounded-lg">
            <p className="font-semibold">Status:</p>
            <p className="text-purple-300">{status}</p>
        </div>
      </div>
    );
  };

  const Transcriber = () => (
      <div className="text-center p-8 bg-gray-900/50 rounded-lg">
        <h3 className="text-xl font-bold">Audio Transcription</h3>
        <p className="mt-2 text-gray-400">This feature is a demonstration. A full implementation would record audio, convert it to a suitable format, and send it to the Gemini API for transcription.</p>
        <button className="mt-4 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg cursor-not-allowed">
            Record & Transcribe (Coming Soon)
        </button>
    </div>
  );

  const TTS = () => {
    const [text, setText] = useState('Hello from PyCom! I can turn this text into speech.');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const audioCtxRef = useRef<AudioContext | null>(null);

    const handleSpeak = async () => {
        if (!text.trim()) return;
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE}/api/text-to-speech`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.substring(0, 500) }),
            });
            if (!response.ok) {
                const body = await response.json().catch(() => ({}));
                throw new Error(body.detail || `Backend returned ${response.status}`);
            }
            const audioBytes = new Uint8Array(await response.arrayBuffer());

            if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioCtx = audioCtxRef.current;
            // Decode and play the audio using AudioContext for reliable playback
            const audioBuffer = await decodeAudioData(audioBytes, audioCtx, 24000, 1);
            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();

        } catch (err: any) {
            setError(err.message || 'Failed to generate speech.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

     return (
        <div className="space-y-4">
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to convert to speech" className="w-full bg-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white h-32" />
            <button onClick={handleSpeak} disabled={isLoading} className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-500 flex items-center justify-center gap-2">
                <PlayIcon className="w-5 h-5" />
                {isLoading ? 'Generating Audio...' : 'Generate & Play'}
            </button>
            {error && <p className="text-red-400 text-center">{error}</p>}
            {isLoading && <div className="text-center animate-pulse">Synthesizing voice...</div>}
            <p className="text-sm text-gray-400 text-center mt-2">Audio will play automatically upon generation.</p>
        </div>
    );
  };

  return (
    <div>
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setActiveTool('live')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'live' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Live Chat</button>
        <button onClick={() => setActiveTool('transcribe')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'transcribe' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Transcribe</button>
        <button onClick={() => setActiveTool('tts')} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTool === 'tts' ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>Text-to-Speech</button>
      </div>
      <div>
        {activeTool === 'live' && <LiveChat />}
        {activeTool === 'transcribe' && <Transcriber />}
        {activeTool === 'tts' && <TTS />}
      </div>
    </div>
  );
};

export default AudioSuite;
