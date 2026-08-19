
import React, { useState } from 'react';
import type { PageNavigationProps } from '../../types.ts';
import ServicesBanner from '../ServicesBanner.tsx';
import { BrainIcon, CodeBracketIcon, SparklesIcon, RectangleStackIcon, ChevronDownIcon } from '../Icons.tsx';

const AIMLPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
    
    const HFSection: React.FC<{ title: string, icon: any, children: React.ReactNode }> = ({ title, icon, children }) => {
        const [isOpen, setIsOpen] = useState(true);
        return (
            <div className="bg-gray-800/50 border border-purple-500/30 rounded-xl overflow-hidden mb-6">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-6 flex items-center justify-between bg-gray-800/80 hover:bg-gray-700 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        {icon}
                        <h2 className="text-2xl font-bold text-white">{title}</h2>
                    </div>
                    <ChevronDownIcon className={`w-6 h-6 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                    <div className="p-6 text-gray-300 space-y-4 animate-fade-in-up">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="animate-fade-in-up max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-4">
                    <span className="text-yellow-400 text-6xl">🤗</span> 
                    Hugging Face & AI/ML
                </h1>
                <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                    Master the open-source ecosystem of Artificial Intelligence. Learn how to create, host, and use state-of-the-art models.
                </p>
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => setActivePage('gamezone')}
                        className="bg-purple-600 text-white font-bold py-4 px-10 rounded-full hover:bg-purple-700 transition-all hover:scale-105 shadow-xl shadow-purple-900/50 flex items-center gap-3 border border-purple-400/50"
                    >
                        <span className="text-2xl">🎮</span>
                        <span>Play the Hugging Face Quest</span>
                    </button>
                </div>
            </div>

            <HFSection title="What is Hugging Face?" icon={<BrainIcon className="w-8 h-8 text-yellow-400" />}>
                <p>
                    Hugging Face is the "GitHub of Machine Learning". It is a platform that provides tools to build, train, and deploy ML models based on open-source code and technologies.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-white mb-2">Models</h3>
                        <p className="text-sm">Over 500,000 pre-trained models for NLP, Computer Vision, and Audio. These are the "brains" of AI.</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-white mb-2">Datasets</h3>
                        <p className="text-sm">Structured data used to train models. Without good data, models cannot learn effectively.</p>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                        <h3 className="font-bold text-white mb-2">Spaces</h3>
                        <p className="text-sm">A way to host and demo your ML applications easily using Streamlit, Gradio, or Docker.</p>
                    </div>
                </div>
            </HFSection>

            <HFSection title="How to Use a Model (The Pipeline)" icon={<CodeBracketIcon className="w-8 h-8 text-blue-400" />}>
                <p>
                    The easiest way to use a model from the Hub is the `pipeline()` function from the `transformers` library. It abstracts away the complex code (preprocessing, model inference, post-processing).
                </p>
                <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 overflow-x-auto">
{`# 1. Install the library
# pip install transformers

from transformers import pipeline

# 2. Create a pipeline for a specific task (e.g., sentiment analysis)
# This automatically downloads a default model
classifier = pipeline("sentiment-analysis")

# 3. Use it!
result = classifier("I love learning about AI with PyCom!")
print(result)
# Output: [{'label': 'POSITIVE', 'score': 0.99}]`}
                </div>
            </HFSection>

            <HFSection title="Creating & Sharing a Model" icon={<SparklesIcon className="w-8 h-8 text-purple-400" />}>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">1. The Concept: Fine-Tuning</h3>
                        <p>Rarely do you create a model from scratch. Usually, you take a pre-trained model (like BERT or GPT) and "fine-tune" it on your specific dataset. This is called Transfer Learning.</p>
                    </div>
                    
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">2. The Steps</h3>
                        <ol className="list-decimal list-inside space-y-2 ml-4">
                            <li><span className="font-semibold text-purple-300">Prepare Data:</span> Load a dataset using the `datasets` library.</li>
                            <li><span className="font-semibold text-purple-300">Tokenize:</span> Convert text into numbers the model understands.</li>
                            <li><span className="font-semibold text-purple-300">Train:</span> Use the `Trainer` API to adjust the model weights.</li>
                            <li><span className="font-semibold text-purple-300">Push to Hub:</span> Upload your model so others can use it.</li>
                        </ol>
                    </div>

                    <div className="bg-black p-4 rounded-lg font-mono text-sm text-blue-300 overflow-x-auto">
{`from transformers import Trainer, TrainingArguments

# Define arguments (where to save, learning rate, epochs)
training_args = TrainingArguments(output_dir="my_new_model", push_to_hub=True)

# Initialize Trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
)

# Train and Push
trainer.train()
trainer.push_to_hub()`}
                    </div>
                </div>
            </HFSection>

            <HFSection title="Hosting on Spaces" icon={<RectangleStackIcon className="w-8 h-8 text-green-400" />}>
                <p>
                    Once you have a model, you want to show it off! Hugging Face Spaces allows you to host web apps.
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <li className="flex items-start gap-3">
                        <span className="bg-orange-500/20 text-orange-400 p-2 rounded font-bold">Gradio</span>
                        <span className="text-sm pt-1">Best for quick demos. You define inputs (text box, image upload) and outputs, and Gradio builds the UI for you.</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="bg-red-500/20 text-red-400 p-2 rounded font-bold">Streamlit</span>
                        <span className="text-sm pt-1">More control over the UI. Great for data dashboards and more complex interactive applications.</span>
                    </li>
                </ul>
            </HFSection>

            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-8 mb-12 border border-purple-500/50 text-center relative overflow-hidden group shadow-2xl">
                 <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to test your skills?</h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto text-lg">
                        Put your new knowledge to the test in our interactive <strong>Hugging Face Quest</strong> game. 
                        Simulate pipelines, model loading, and training workflows in a safe, gamified terminal environment.
                    </p>
                    <button 
                        onClick={() => setActivePage('gamezone')}
                        className="bg-yellow-400 text-gray-900 font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition-transform hover:scale-105 flex items-center gap-2 mx-auto shadow-lg"
                    >
                        <CodeBracketIcon className="w-6 h-6" />
                        <span className="text-lg">Launch Gamezone Arcade</span>
                    </button>
                 </div>
            </div>

            <ServicesBanner onCTAClick={() => setActivePage('contact')} />
        </div>
    );
};

export default AIMLPage;
