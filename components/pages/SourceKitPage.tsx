

import React, { useState } from 'react';
import type { PageNavigationProps } from '../../types.ts';
import { ChevronDownIcon, CodeBracketIcon, RectangleStackIcon, BookOpenIcon, GitBranchIcon } from '../Icons.tsx';
import ServicesBanner from '../ServicesBanner.tsx';
import SnippetLibrary from '../sourcekit/SnippetLibrary.tsx';
import GitManager from '../sourcekit/GitManager.tsx';

const sourceKitData = {
  general: {
    title: "General Ecosystem and Supported Languages",
    content: [
      {
        subtitle: "Core Libraries",
        text: "NumPy (numerical computing), pandas (data manipulation/analysis), SciPy (scientific computing), Matplotlib, Seaborn, Plotly (visualization)."
      },
      {
        subtitle: "Interoperability (Supported Languages)",
        text: "Python seamlessly integrates with high-performance languages for specific tasks:",
        points: [
          "C/C++: Primary integration via the Python/C API, ctypes, cffi, and Cython for performance-critical code sections.",
          "Java: The Jython implementation and libraries like JPype and Py4J allow interaction with the Java Virtual Machine (JVM).",
          "Rust: Growing support with tools like Maturin for writing safe, fast Python extensions.",
          "JavaScript: Tools like Brython and Transcrypt enable Python code to run in web browsers."
        ]
      }
    ]
  },
  domains: [
    {
      title: "Data Engineering",
      description: "Data engineers focus on building and maintaining robust data pipelines.",
      table: [
        { category: "Data Acquisition", tools: "requests, BeautifulSoup, Scrapy", useCases: "Web scraping and API interactions." },
        { category: "Workflow Mgmt", tools: "Apache Airflow", useCases: "Authoring, scheduling, and monitoring complex data pipelines." },
        { category: "Big Data Processing", tools: "PySpark, Dask, Vaex", useCases: "Distributed processing and scaling computations for large datasets." },
        { category: "Databases", tools: "SQLAlchemy (ORM), psycopg2", useCases: "Data storage and retrieval." },
        { category: "ETL/Data Wrangling", tools: "pandas, NumPy", useCases: "Cleaning, transforming, and validating raw data." },
      ]
    },
    {
      title: "Data Scientists",
      description: "Data scientists focus on data analysis, statistical modeling, and machine learning.",
      table: [
        { category: "Analysis/Modeling", tools: "scikit-learn, Statsmodels, XGBoost, LightGBM, CatBoost", useCases: "Classic ML algorithms, statistical testing, gradient boosting." },
        { category: "Visualization", tools: "Matplotlib, Seaborn, Plotly", useCases: "Exploring data, visualizing patterns, and presenting findings." },
        { category: "Experiment Tracking", tools: "Weights & Biases (W&B)", useCases: "Logging metrics, parameters, and outputs; hyperparameter tuning." },
        { category: "Automated ML", tools: "PyCaret, AutoViz", useCases: "Automating ML workflows and exploratory data analysis." },
      ]
    },
    {
        title: "ML/NLP Experts",
        description: "These experts specialize in advanced models, particularly deep learning and natural language processing.",
        table: [
            { category: "Deep Learning Fmwks", tools: "TensorFlow/Keras, PyTorch", useCases: "Building and training complex neural networks and deep learning models." },
            { category: "NLP Libraries", tools: "NLTK, spaCy, Gensim", useCases: "Text processing, linguistic analysis, topic modeling, named entity recognition." },
            { category: "Transformers/GenAI", tools: "Hugging Face Transformers", useCases: "Accessing pre-trained state-of-the-art transformer models (e.g., BERT, GPT-2)." },
            { category: "Model Deployment", tools: "Flask, Django, FastAPI", useCases: "Serving models as web APIs." },
        ]
    },
    {
        title: "Generative AI Experts & Chatbot Development",
        description: "Experts in this area leverage large language models (LLMs) to create sophisticated conversational agents.",
        table: [
            { category: "LLM Orchestration", tools: "LangChain, LlamaIndex, LangGraph", useCases: "Building LLM applications, integrating external data sources (RAG), managing conversational memory." },
            { category: "API Integration", tools: "openai SDK, anthropic SDK, Ollama", useCases: "Interacting with proprietary and open-source LLMs." },
            { category: "Vector Databases", tools: "Chroma, Pinecone, Weaviate", useCases: "Storing and retrieving vector embeddings for semantic search/RAG." },
            { category: "Chatbot Frameworks", tools: "Rasa, Microsoft Bot Framework", useCases: "End-to-end platforms for building, training, and deploying conversational AI." },
            { category: "Data Apps/UIs", tools: "Streamlit, Dash, Gradio", useCases: "Quickly creating web interfaces/dashboards for GenAI applications." },
        ]
    }
  ],
  guidelines: {
      title: "Supported Documents and Setup Guidelines",
      content: [
          {
              subtitle: "Supported Document Formats (for RAG systems)",
              text: "Python libraries (LangChain, LlamaIndex) support loaders for various document types:",
              points: [
                  "Text: .txt, .md",
                  "Structured: .pdf, .csv, .json, .xlsx",
                  "Databases: SQL and NoSQL databases",
                  "Web Data: URLs, sitemaps, and raw HTML (using tools like BeautifulSoup)."
              ]
          },
          {
              subtitle: "Setup Guidelines (for all experts)",
              points: [
                  "Environment Management: Always use virtual environments (venv or conda) to isolate project dependencies.",
                  "Installation: Use pip install <package_name> or conda install <package_name>.",
                  "Code Quality: Employ linters (flake8, pylint) and formatters (black) for consistent, clean code.",
                  "Version Control: Use Git and platforms like GitHub for collaborative development and tracking changes.",
                  "Compute Resources: For heavy deep learning and GenAI tasks, utilize GPUs or TPUs via cloud platforms (AWS, GCP, Azure) or local setups.",
                  "Documentation: Refer to the comprehensive documentation provided by the strong communities backing these libraries."
              ]
          }
      ]
  }
};

const installationGuidesData = [
    {
        title: "Django Setup",
        analogy: "The All-Inclusive Resort",
        description: "Setting up Django is like checking into an all-inclusive resort. Everything you need is already there—the restaurant (database), the front desk (admin panel), and the room service (ORM). You just need to get your key and start relaxing (or coding).",
        steps: [
            { title: "Get Your Resort Pass (Install Django)", command: "pip install Django" },
            { title: "Build the Resort (Start a Project)", command: "django-admin startproject myresort" },
            { title: "Check-In (Run the Server)", command: "cd myresort\npython manage.py runserver" },
        ]
    },
    {
        title: "Flask Setup",
        analogy: "The LEGO Set",
        description: "Flask is like a box of LEGOs. It gives you the essential bricks to build whatever you want, from a tiny car to a giant castle. It's lightweight and you only add the pieces you need.",
        steps: [
            { title: "Buy the LEGOs (Install Flask)", command: "pip install Flask" },
            { title: "Build a Tiny Car (Create app.py)", command: "from flask import Flask\napp = Flask(__name__)\n\n@app.route('/')\ndef hello():\n    return 'Hello, LEGO World!'" },
            { title: "Start Your Engine (Run the App)", command: "flask --app app run" },
        ]
    },
    {
        title: "FastAPI Setup",
        analogy: "The Sports Car",
        description: "FastAPI is the sleek, modern sports car of web frameworks. It's built for speed and comes with a fancy GPS (automatic docs) that tells everyone exactly how it works.",
        steps: [
            { title: "Get Car & Keys (Install FastAPI & Uvicorn)", command: 'pip install fastapi "uvicorn[standard]"' },
            { title: "Design the Car (Create main.py)", command: 'from fastapi import FastAPI\napp = FastAPI()\n\n@app.get("/")\ndef root():\n    return {"Hello": "Speed Racer"}' },
            { title: "Fire It Up (Run with Uvicorn)", command: "uvicorn main:app --reload" },
        ]
    },
    {
        title: "VS Code Setup for Python",
        analogy: "The Super-Powered Swiss Army Knife",
        description: "VS Code isn't just an editor; it's a workshop. Getting it ready for Python is like adding all the cool attachments to your Swiss Army knife.",
        steps: [
            { title: "Get the Knife (Install VS Code)", description: "Go to the official Visual Studio Code website and download it. It's free!" },
            { title: "Add the Python Tool (Install Extension)", description: "Open VS Code. Go to the Extensions view (the icon with stacked blocks), search for 'Python', and install the one by Microsoft." },
            { title: "Select Your Python (Choose Interpreter)", description: "Open a Python (.py) file. At the bottom-right, click on the Python version number and select the interpreter from your virtual environment. Now your tools are connected!" },
        ]
    }
];

const Section: React.FC<{ title: string; children: React.ReactNode, startOpen?: boolean }> = ({ title, children, startOpen = false }) => {
  const [isOpen, setIsOpen] = useState(startOpen);
  return (
    <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full p-4 flex justify-between items-center text-left hover:bg-slate-700/50 transition-colors">
        <h2 className="text-2xl font-bold text-purple-300">{title}</h2>
        <ChevronDownIcon className={`w-6 h-6 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-6 border-t border-slate-700/50 space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpertTable: React.FC<{ data: { category: string; tools: string; useCases: string; }[] }> = ({ data }) => (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs text-slate-400 uppercase bg-slate-800">
                <tr>
                    <th scope="col" className="px-6 py-3">Category</th>
                    <th scope="col" className="px-6 py-3">Packages/Tools</th>
                    <th scope="col" className="px-6 py-3">Key Use Cases</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                    <tr key={index} className="bg-slate-900/50 border-b border-slate-700 hover:bg-slate-800/50">
                        <td className="px-6 py-4 font-semibold">{item.category}</td>
                        <td className="px-6 py-4 font-mono text-sm text-purple-300">{item.tools}</td>
                        <td className="px-6 py-4">{item.useCases}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const GuideCard: React.FC<{ guide: typeof installationGuidesData[0] }> = ({ guide }) => (
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
        <h3 className="text-2xl font-bold text-white">{guide.title}</h3>
        <p className="text-yellow-400 font-semibold italic">Analogy: {guide.analogy}</p>
        <p className="text-slate-300 mt-2 mb-4 text-sm">{guide.description}</p>
        <div className="space-y-4">
            {guide.steps.map((step, index) => (
                <div key={index}>
                    <p className="font-bold text-slate-200">Step {index + 1}: {step.title}</p>
                    {step.command && (
                         <pre className="bg-black text-green-400 p-3 rounded-md mt-1 text-sm whitespace-pre-wrap font-mono">
                            <code>{step.command}</code>
                        </pre>
                    )}
                    {step.description && <p className="text-slate-400 mt-1 text-sm">{step.description}</p>}
                </div>
            ))}
        </div>
    </div>
);


const SourceKitPage: React.FC<PageNavigationProps> = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState<'reference' | 'snippets' | 'git'>('reference');

  return (
    <div className="animate-fade-in-up space-y-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 flex items-center justify-center gap-4">
            <CodeBracketIcon className="w-12 h-12" />
            SourceKit
        </h1>
        <p className="text-lg text-slate-400 max-w-4xl mx-auto">
          Your centralized hub for documentation, ecosystem guides, and development tools.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-xl inline-flex border border-gray-700 flex-wrap justify-center gap-2">
            <button 
                onClick={() => setActiveTab('reference')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab === 'reference' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <BookOpenIcon className="w-5 h-5" />
                <span>Reference Docs</span>
            </button>
            <button 
                onClick={() => setActiveTab('snippets')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab === 'snippets' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <RectangleStackIcon className="w-5 h-5" />
                <span>My Snippets</span>
            </button>
            <button 
                onClick={() => setActiveTab('git')}
                className={`px-4 sm:px-6 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 ${activeTab === 'git' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <GitBranchIcon className="w-5 h-5" />
                <span>Git Manager</span>
            </button>
        </div>
      </div>

      {activeTab === 'reference' && (
          <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
            <Section title="Installation Guides" startOpen={true}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {installationGuidesData.map(guide => <GuideCard key={guide.title} guide={guide} />)}
                </div>
            </Section>

            <Section title={sourceKitData.general.title}>
                {sourceKitData.general.content.map(c => (
                    <div key={c.subtitle}>
                        <h3 className="text-xl font-bold text-white mb-2">{c.subtitle}</h3>
                        <p className="text-slate-300">{c.text}</p>
                        {c.points && (
                            <ul className="list-disc list-inside mt-2 space-y-1 pl-4 text-slate-300">
                                {c.points.map(p => <li key={p}>{p}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </Section>

            {sourceKitData.domains.map(domain => (
                <Section key={domain.title} title={domain.title}>
                    <p className="text-slate-300 mb-4">{domain.description}</p>
                    <ExpertTable data={domain.table} />
                </Section>
            ))}
            
            <Section title={sourceKitData.guidelines.title}>
                {sourceKitData.guidelines.content.map(c => (
                    <div key={c.subtitle}>
                        <h3 className="text-xl font-bold text-white mb-2">{c.subtitle}</h3>
                        {c.text && <p className="text-slate-300">{c.text}</p>}
                        {c.points && (
                            <ul className="list-disc list-inside mt-2 space-y-1 pl-4 text-slate-300">
                                {c.points.map(p => <li key={p}>{p}</li>)}
                            </ul>
                        )}
                    </div>
                ))}
            </Section>
          </div>
      )}
      
      {activeTab === 'snippets' && (
          <div className="max-w-4xl mx-auto animate-fade-in-up">
              <SnippetLibrary />
          </div>
      )}

      {activeTab === 'git' && (
          <div className="max-w-7xl mx-auto animate-fade-in-up">
              <GitManager />
          </div>
      )}

      <ServicesBanner onCTAClick={() => setActivePage('contact')} />
    </div>
  );
};

export default SourceKitPage;
