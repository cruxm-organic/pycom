import { GoogleGenAI, GenerateVideosOperation, Modality } from "@google/genai";
import type { GroundingChunk } from '../types.ts';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set for geminiLabService. AI Lab features will not work.");
}

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio,
        },
    });
    return response.generatedImages[0].image.imageBytes;
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { inlineData: { data: imageBase64, mimeType } },
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!part?.inlineData) {
        throw new Error("No image was returned from the edit operation.");
    }
    return part.inlineData.data;
};

export const analyzeImage = async (imageBase64: string, mimeType: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { inlineData: { data: imageBase64, mimeType } },
                { text: "Describe this image in detail." },
            ],
        },
    });
    return response.text;
};

export const generateVideo = async (
    prompt: string,
    image: { data: string, mimeType: string } | undefined,
    aspectRatio: '16:9' | '9:16'
): Promise<GenerateVideosOperation> => {
    const ai = getAI();
    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt,
        image: image ? { imageBytes: image.data, mimeType: image.mimeType } : undefined,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio,
        }
    });
    return operation;
};

export const getVideosOperation = async (operation: GenerateVideosOperation): Promise<GenerateVideosOperation> => {
    const ai = getAI();
    return ai.operations.getVideosOperation({ operation });
};

export const analyzeVideo = async (): Promise<string> => {
    return Promise.resolve("Video analysis is not yet implemented.");
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio data returned from TTS service.");
    }
    return base64Audio;
};

interface GroundedSearchResult {
    text: string;
    chunks: GroundingChunk[];
}

export const groundedSearch = async (prompt: string, type: 'web' | 'maps'): Promise<GroundedSearchResult> => {
    const ai = getAI();
    const config: any = {
        tools: type === 'web' ? [{ googleSearch: {} }] : [{ googleMaps: {} }],
    };

    if (type === 'maps') {
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
            });
            config.toolConfig = {
                retrievalConfig: {
                    latLng: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }
                }
            };
        } catch (error) {
            console.warn("Could not get user location for Maps search:", error);
        }
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config,
    });

    return {
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
    };
};

export const complexReasoning = async (prompt: string): Promise<string> => {
    const ai = getAI();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            temperature: 0.7,
        },
    });
    return response.text;
};
