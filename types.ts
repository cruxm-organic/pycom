

export type Page = 'home' | 'careers' | 'gamezone' | 'lab' | 'sourcekit' | 'courses' | 'contact' | 'blog' | 'advertise' | 'agentic-ai' | 'resources' | 'partner' | 'aiml' | 'invest' | 'host' | 'docs';

export interface PageNavigationProps {
  setActivePage: (page: Page) => void;
}

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type GameStatus = 'Not Started' | 'In Progress' | 'Completed';

export interface Dilemma {
  problem: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface CareerPath {
  id: string;
  title: string;
  subtitle: string;
  illustrationUrl: string;
  description: string;
  responsibilities: string[];
  averageSalary: string;
  tools: string[];
}

interface GroundingSource {
  uri?: string;
  title?: string;
}

interface MapsSource extends GroundingSource {
    placeAnswerSources?: {
        reviewSnippets?: any[];
    }
}

export interface GroundingChunk {
  web?: GroundingSource;
  maps?: MapsSource;
}

export interface PioneerContact {
  role: string;
  name: string;
  description?: string;
  email: string;
  phone?: string;
  url?: string;
  actions?: ('enquiry' | 'contact')[];
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  readTime: string;
  wordCount: number;
}

export interface AdPricing {
  type: string;
  description: string;
  inr: string;
  usd: string;
  eur: string;
}

export interface Sponsorship {
  title:string;
  description: string;
  cta: string;
}

export interface PartnerOffer {
  partner: string;
  title: string;
  description: string;
  cta: string;
}

export interface Course {
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isAiPowered: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface GameTopic {
  id: string;
  title: string;
  description: string;
  gameType: 'quiz';
  questions: QuizQuestion[];
}

export interface GameCategory {
  id: string;
  title: string;
  description: string;
  topics: GameTopic[];
}

// Agentic AI Types
export type AgentRole = 
  | 'CEO' 
  | 'Sales Director' 
  | 'Social Media' 
  | 'SEO Expert' 
  | 'Business Consultant'
  | 'HR Manager'
  | 'Data Scientist'
  | 'Backend Developer'
  | 'DevOps Engineer'
  | 'Software Engineer'
  | 'QA Automation'
  | 'Data Analyst'
  | 'AI Researcher'
  | 'System Admin';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  email: string; // New field
  loginId: string;
  avatarUrl: string;
  specialties: string[];
  jobDescription: string;
  kpis: string[];
  monthlyTarget: string;
  joinDate?: string;
  reportsTo?: string; // New field: ID of the agent they report to
}

export interface WorkflowStep {
    id: number;
    action: string;
    tool: string; // e.g., "LinkedIn Sales Nav", "Google Ads", "SEMRush"
    duration: number; // ms to simulate
    outputDescription: string;
}

export interface AgentWorkflow {
    agentId: string;
    name: string;
    description: string;
    steps: WorkflowStep[];
    requiredIntegrations: ('Google' | 'Microsoft' | 'HubSpot' | 'LinkedIn' | 'GitHub' | 'Slack' | 'Jira' | 'Stripe' | 'Salesforce' | 'Zendesk' | 'Shopify')[];
}

export interface ActivityLog {
    id: number;
    timestamp: Date;
    agentId: string;
    description: string;
    type: 'info' | 'success' | 'error' | 'action';
}

export interface WorkflowTemplate {
    id: string;
    title: string;
    category: 'Sales' | 'Marketing' | 'Strategy' | 'Technical' | 'Operations';
    description: string;
    complexity: 'Low' | 'Medium' | 'High';
    steps: number;
}

export interface MCPConnection {
    id: string;
    name: string;
    status: 'connected' | 'disconnected' | 'error';
    type: 'database' | 'api' | 'filesystem';
    latency: string;
}

export interface KnowledgeDocument {
    id: string;
    name: string;
    type: 'pdf' | 'csv' | 'txt';
    size: string;
    status: 'indexed' | 'processing' | 'pending';
}

export interface Timezone {
    label: string;
    timezone: string;
}

export interface HFLessonStep {
    id: string;
    title: string;
    teachContent: string;
    practiceQuestion: string;
    options: string[];
    correctAnswer: string;
    logOutput: string[];
    codeSnippet?: string;
}

export interface CodeSnippet {
    id: string;
    title: string;
    language: 'python' | 'javascript' | 'html' | 'css' | 'sql' | 'bash';
    code: string;
    category: string;
    createdAt: number;
}

export interface GitFile {
  name: string;
  content: string;
  originalContent: string;
  status: 'unmodified' | 'modified';
}

export interface GitCommit {
  id: string;
  message: string;
  timestamp: number;
  author: string;
  changes: string[];
}

export interface GitRepo {
  url: string;
  name: string;
  files: GitFile[];
  commits: GitCommit[];
  branch: string;
  branches: string[];
}

export type LMSView = 'classroom' | 'chat' | 'files' | 'notes';

export interface LMSFile {
    id: string;
    name: string;
    type: 'pdf' | 'code' | 'image';
    size: string;
    date: string;
}

export interface LMSNote {
    id: string;
    title: string;
    content: string;
    timestamp: Date;
    isImportant: boolean;
}

// Lead Management Types
export type LeadPriority = 'High' | 'Medium' | 'Low';
export type LeadStatus = 'Research' | 'Identify' | 'Formatting' | 'Outreach' | 'Pipeline' | 'Lead Filtering' | 'Email' | 'Follow-up' | 'Closure';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  linkedin: string;
  status: LeadStatus;
  priority: LeadPriority;
}

// Hosting Types
export interface Deployment {
    id: string;
    name: string;
    repo: string;
    branch: string;
    status: 'building' | 'deployed' | 'failed';
    url?: string;
    lastBuilt: string;
    commitMessage: string;
}

export interface ServerMetrics {
    cpu: number; // Percentage 0-100
    ram: number; // Percentage 0-100
    diskIo: number; // MB/s
}

export interface ServerService {
    id: string;
    name: string;
    type: 'vector-db' | 'database' | 'cache';
    status: 'running' | 'stopped';
    port: number;
}

export interface ServerInstance {
    id: string;
    name: string;
    type: 'cloud' | 'local';
    ip: string;
    status: 'running' | 'stopped' | 'provisioning';
    region: string;
    mcpEnabled: boolean;
    metrics?: ServerMetrics;
    installedServices?: ServerService[];
}

export interface VPSInstance {
    id: string;
    name: string;
    os: 'Ubuntu 22.04' | 'Debian 12' | 'Alpine Linux';
    status: 'running' | 'stopped' | 'provisioning';
    ip: string;
    specs: {
        cpu: number;
        ram: number;
    };
}

export interface VPNPeer {
    id: string;
    name: string;
    ip: string;
    status: 'connected' | 'disconnected';
    lastHandshake: string;
}

export interface VPNConfig {
    status: 'active' | 'inactive';
    publicIp: string;
    port: number;
    publicKey: string;
    peers: VPNPeer[];
}

// Big Data Types
export interface Dataset {
    id: string;
    name: string;
    source: string;
    rows: number;
    columns: string[];
}

export interface BigDataQuery {
    id: string;
    prompt: string;
    sql: string;
    result: any[];
    chartType: 'bar' | 'line' | 'pie';
}

export type VectorStoreType = 'Milvus' | 'Qdrant' | 'Weaviate' | 'FAISS' | 'Pinecone' | 'PyCom Native';

// PyProd Types
export interface PyProdTask {
    id: string;
    title: string;
    assignee: string;
    tag: string;
}

export interface PyProdColumn {
    id: string;
    title: string;
    tasks: PyProdTask[];
}

export interface PyProdMessage {
    id: string;
    user: string;
    text: string;
    time: string;
}

export interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    rank?: number;
    authority?: number;
    type?: 'web' | 'image' | 'video' | 'forum';
    meta?: {
        views?: string;
        duration?: string;
        replies?: number;
        image?: string;
    };
}

// Admin Types
export interface ResourceAllocation {
  agentId: string;
  vpsId: string;
  accessLevel: 'Root' | 'User';
  storageQuota: string;
}

export interface SystemHealth {
  clusterId: string;
  status: 'Healthy' | 'Degraded' | 'Critical';
  uptime: string;
  activeAlerts: number;
}
