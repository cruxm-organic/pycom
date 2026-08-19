

import React from 'react';
import type { CareerPath, PioneerContact, BlogPost, AdPricing, Sponsorship, PartnerOffer, GameCategory, Course, Agent, Lead, LeadStatus, Timezone, LeadPriority, AgentWorkflow, WorkflowTemplate, MCPConnection, KnowledgeDocument } from './types.ts';
import { 
    MagnifyingGlassIcon, UserPlusIcon, PaintBrushIcon, PaperAirplaneIcon, FunnelIcon, EnvelopeIcon, ArrowPathIcon, CheckCircleIcon,
    SlackIcon, JiraIcon, GitHubIcon, StripeIcon, GoogleIcon, MicrosoftIcon, LinkedInIcon, HubSpotIcon,
    CodeBracketIcon, PresentationChartLineIcon, BanknotesIcon, MegaphoneIcon, UserGroupIcon, RobotIcon
} from './components/Icons.tsx';


export const CAREER_PATHS: CareerPath[] = [
  {
    id: 'data-scientist',
    title: 'Data Scientist / Machine Learning Engineer',
    subtitle: 'Uncover insights and build intelligent systems',
    illustrationUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Data Scientists use analytical, statistical, and programming skills to collect, analyze, and interpret large data sets. They use this information to develop data-driven solutions to difficult business challenges.',
    responsibilities: [
      'Building predictive models and machine-learning algorithms.',
      'Processing, cleansing, and verifying the integrity of data used for analysis.',
      'Creating data visualizations to present complex information.',
      'Identifying valuable data sources and automating collection processes.',
    ],
    averageSalary: '$120,000 - $170,000 / year',
    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'SQL', 'Tableau']
  },
  {
    id: 'backend-developer',
    title: 'Backend Web Developer',
    subtitle: 'Power the server-side of web applications',
    illustrationUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Backend Developers are responsible for the server-side logic, database interactions, and APIs of a web application. They ensure the application performs correctly and efficiently.',
    responsibilities: [
      'Developing and maintaining server-side logic.',
      'Designing and managing databases.',
      'Building and integrating RESTful APIs.',
      'Ensuring security and data protection.',
    ],
    averageSalary: '$100,000 - $150,000 / year',
    tools: ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'MongoDB', 'Docker', 'AWS']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    subtitle: 'Automate infrastructure and streamline development',
    illustrationUrl: 'https://images.unsplash.com/photo-1573495627361-ab2b3f637fef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'DevOps Engineers bridge the gap between software development and IT operations. They use automation to build, test, and release software faster and more reliably.',
    responsibilities: [
      'Managing and automating CI/CD (Continuous Integration/Continuous Deployment) pipelines.',
      'Provisioning and managing cloud infrastructure (Infrastructure as Code).',
      'Monitoring application performance and system health.',
      'Implementing security best practices throughout the development lifecycle.',
    ],
    averageSalary: '$110,000 - $160,000 / year',
    tools: ['Python', 'Docker', 'Kubernetes', 'Ansible', 'Terraform', 'Jenkins', 'AWS', 'GCP', 'Azure']
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    subtitle: 'Build robust and scalable software applications',
    illustrationUrl: 'https://images.unsplash.com/photo-1592609931095-54a2168ae293?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Software Engineers apply engineering principles to design, develop, maintain, test, and evaluate computer software. A Python Software Engineer develops a wide range of applications, from system utilities to large-scale backend services.',
    responsibilities: [
      'Writing clean, efficient, and maintainable code.',
      'Collaborating with cross-functional teams to define and ship new features.',
      'Participating in code reviews to maintain code quality.',
      'Troubleshooting, debugging, and upgrading existing software.',
    ],
    averageSalary: '$105,000 - $155,000 / year',
    tools: ['Python', 'Git', 'SQL/NoSQL', 'Design Patterns', 'Data Structures', 'Algorithms']
  },
  {
    id: 'qa-engineer',
    title: 'QA Automation Engineer',
    subtitle: 'Ensure software quality through automated testing',
    illustrationUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'QA (Quality Assurance) Automation Engineers design and write programs that run automatic tests on new or existing software. Python is a popular choice for test automation due to its simple syntax and powerful testing frameworks.',
    responsibilities: [
      'Developing and maintaining automated test scripts.',
      'Creating test plans and test cases.',
      'Identifying, logging, and tracking software defects.',
      'Integrating automated tests into the CI/CD pipeline.',
    ],
    averageSalary: '$90,000 - $130,000 / year',
    tools: ['Python', 'Pytest', 'Selenium', 'Robot Framework', 'Postman', 'Jira']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    subtitle: 'Translate data into actionable business insights',
    illustrationUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description: 'Data Analysts collect, clean, and analyze data to identify trends and help businesses make better decisions. While less code-intensive than a Data Scientist, a Data Analyst heavily uses Python for data manipulation and visualization.',
    responsibilities: [
      'Acquiring data from primary or secondary data sources.',
      'Cleaning and preprocessing data to ensure quality.',
      'Analyzing datasets to find trends, correlations, and patterns.',
      'Creating dashboards and reports to communicate findings to stakeholders.',
    ],
    averageSalary: '$75,000 - $115,000 / year',
    tools: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'SQL', 'Excel', 'Tableau', 'Power BI']
  },
  {
    id: 'ai-research-scientist',
    title: 'AI Research Scientist',
    subtitle: 'Push the boundaries of artificial intelligence',
    illustrationUrl: 'https://images.unsplash.com/photo-1620712943543-95fc6g-show/photo-1599827552789-903738981b0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    description: 'AI Research Scientists work on the cutting edge of artificial intelligence, developing new models and algorithms. They often publish their findings in academic journals and contribute to the theoretical foundations of AI. Python is the de facto language for AI research due to its powerful deep learning libraries.',
    responsibilities: [
      'Designing and implementing novel machine learning models.',
      'Conducting experiments and benchmarking model performance.',
      'Reading and implementing state-of-the-art research papers.',
      'Collaborating with other researchers and contributing to open-source projects.',
    ],
    averageSalary: '$140,000 - $200,000+ / year',
    tools: ['Python', 'PyTorch', 'TensorFlow', 'Scikit-learn', 'NLTK', 'spaCy', 'LangChain', 'Hugging Face']
  },
];

export const PIONEERS_DATA: PioneerContact[] = [
  {
    role: 'Founder & CEO',
    name: 'Jeyabal Anthony',
    description: 'Visionary entrepreneur with a passion for AI and education.',
    email: 'jeyabal.anthony@pycom.com',
    phone: '1234567890',
    url: 'https://jeyabal.com/',
    actions: ['enquiry']
  },
  {
    role: 'Social Media Marketing (Organic & Paid)',
    name: 'Suresh Kumar',
    description: 'Driving brand growth through strategic organic and paid social media campaigns.',
    email: 'suresh.kumar@pycom.com',
    phone: '1112223331',
    url: 'https://www.bdbp.in/'
  },
  {
    role: 'Hardware Networking & System Admin',
    name: 'Walter Shekar',
    description: 'System engineering, IT Infrastructure, MacOS, Windows OR Linux configuration and complete setup, High GPU device setup.',
    email: 'walter.shekar@pycom.com',
    phone: '1112223332',
  },
    {
    role: 'Brand Marketing',
    name: 'Snehal Merchande',
    description: 'Gifts, Merch, PR (Reputation & Compliance, Organic PR (Retainership)).',
    email: 'snehal.merchande@pycom.com',
    phone: '1112223333',
    url: 'https://chanakyapr.in/'
  },
  {
    role: 'IT Recruitment & Influencer',
    name: 'Immanuel JD',
    description: 'Connecting top tech talent with innovative companies and building community.',
    email: 'immanuel.jd@pycom.com',
    phone: '1112223334',
    url: 'https://www.instagram.com/thejobsandcareer/#'
  },
  {
    role: 'Business Consulting (Startups, MSMEs, SMEs, OEMs)',
    name: 'Ginu Joseph',
    description: 'Strategic consulting for businesses of all sizes, from startups to OEMs.',
    email: 'ginu.joseph@pycom.com',
    phone: '1112223335',
    url: 'https://modernbusinessnetwork.com/',
    actions: ['enquiry']
  },
  {
    role: 'SEO Business Expert (10+ Vertical)',
    name: 'Tony Robert',
    description: 'Specializing in SEO strategy across more than 10 industry verticals.',
    email: 'tony.robert@pycom.com',
    phone: '1112223336',
    actions: ['enquiry']
  },
  {
    role: 'Sales Director',
    name: 'Billy Jay',
    description: 'Leading our sales strategy and fostering client relationships to drive growth.',
    email: 'billy.jay@pycom.com',
    actions: ['contact']
  },
  {
    role: 'Client Success Lead',
    name: 'Shrikant Anandraj',
    description: 'Ensuring our clients achieve their goals and maximize their success with PyCom.',
    email: 'shrikant.anandraj@pycom.com',
    actions: ['contact']
  },
  {
    role: 'General Inquiries',
    name: 'PyCom Support',
    email: 'support@pycom.com',
    actions: ['contact']
  }
];

export const AGENTS: Agent[] = [
    { 
        id: 'jeyabal', 
        name: 'Jeyabal Anthony', 
        role: 'CEO', 
        email: 'jeyabal.anthony@pycom.com',
        loginId: 'JA-CEO-AI', 
        avatarUrl: '/assets/avatars/jeyabal.png',
        specialties: ['Investor Relations', 'Partnership Strategy', 'Fundraising'],
        jobDescription: "Oversee the company's strategic direction, secure critical Series A funding, and cultivate high-value partnerships with educational institutions and tech giants to expand PyCom's market footprint.",
        kpis: ["Investor Meetings Booked", "Term Sheets Received", "Partnership MOUs Signed", "Media Mentions"],
        monthlyTarget: "Secure $2M Seed Commitment"
    },
    { 
        id: 'billy', 
        name: 'Billy Jay', 
        role: 'Sales Director', 
        email: 'billy.jay@pycom.com',
        loginId: 'BJ-SALES-AI', 
        avatarUrl: '/assets/avatars/billy.png',
        specialties: ['Cold Outreach', 'Lead Qualification', 'Closing'],
        jobDescription: "Drive revenue growth by managing the entire sales lifecycle, from prospecting high-value leads to closing enterprise licensing deals. Optimize the sales funnel for maximum conversion.",
        kpis: ["MRR Growth %", "Sales Qualified Leads (SQLs)", "Demo-to-Close Rate", "Average Deal Size"],
        monthlyTarget: "$50k Net New ARR",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'maya', 
        name: 'Maya Patel', 
        role: 'HR Manager', 
        email: 'maya.patel@pycom.com',
        loginId: 'MP-HR-AI', 
        avatarUrl: '',
        specialties: ['Talent Acquisition', 'Employee Relations', 'Culture'],
        jobDescription: "Manage the full employee lifecycle, from recruiting top tech talent to fostering a high-performance culture. Ensure compliance and drive employee engagement initiatives.",
        kpis: ["Time to Hire", "Employee Net Promoter Score (eNPS)", "Retention Rate", "Training Completion %"],
        monthlyTarget: "Onboard 5 Senior Engineers",
        joinDate: "Nov 25, 2025",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'leo', 
        name: 'Leo Das', 
        role: 'Data Scientist', 
        email: 'leo.das@pycom.com',
        loginId: 'LD-DS-AI', 
        avatarUrl: '',
        specialties: ['Predictive Modeling', 'Deep Learning', 'Data Visualization'],
        jobDescription: "Uncover insights and build intelligent systems. Design and implement machine learning models to solve complex business problems and optimize platform features.",
        kpis: ["Model Accuracy", "Insight Time-to-Delivery", "Algorithm Efficiency", "Data Quality Score"],
        monthlyTarget: "Deploy 2 New Predictive Models",
        joinDate: "Nov 25, 2025",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'kai', 
        name: 'Kai Sato', 
        role: 'Backend Developer', 
        email: 'kai.sato@pycom.com',
        loginId: 'KS-BE-AI', 
        avatarUrl: '',
        specialties: ['API Design', 'Database Optimization', 'Scalable Architecture'],
        jobDescription: "Power the server-side of web applications. Architect and maintain robust microservices, ensure high availability, and optimize database performance.",
        kpis: ["API Latency", "Uptime", "Bug Resolution Time", "Code Coverage"],
        monthlyTarget: "Migrate Core Service to AsyncIO",
        joinDate: "Nov 25, 2025",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'alex', 
        name: 'Alex Rivera', 
        role: 'DevOps Engineer', 
        email: 'alex.rivera@pycom.com',
        loginId: 'AR-OPS-AI', 
        avatarUrl: '',
        specialties: ['CI/CD Automation', 'Cloud Infrastructure', 'Security'],
        jobDescription: "Automate infrastructure and streamline development. Maintain CI/CD pipelines, manage cloud resources, and ensure system reliability and security.",
        kpis: ["Deployment Frequency", "Mean Time to Recovery (MTTR)", "Infrastructure Cost Savings", "Security Audit Score"],
        monthlyTarget: "Reduce Build Time by 40%",
        joinDate: "Nov 25, 2025",
        reportsTo: 'kai'
    },
    { 
        id: 'emma', 
        name: 'Emma Wright', 
        role: 'Software Engineer', 
        email: 'emma.wright@pycom.com',
        loginId: 'EW-SWE-AI', 
        avatarUrl: '',
        specialties: ['Full Stack Development', 'Code Quality', 'System Design'],
        jobDescription: "Build robust and scalable software applications. Write clean, maintainable code for new features and improve existing system architecture.",
        kpis: ["Feature Delivery Velocity", "Technical Debt Reduction", "Code Review Turnaround", "Sprint Completion %"],
        monthlyTarget: "Ship 3 Major Features",
        joinDate: "Nov 25, 2025",
        reportsTo: 'kai'
    },
    { 
        id: 'priya', 
        name: 'Priya Sharma', 
        role: 'QA Automation', 
        email: 'priya.sharma@pycom.com',
        loginId: 'PS-QA-AI', 
        avatarUrl: '',
        specialties: ['Test Automation', 'Regression Testing', 'Performance Testing'],
        jobDescription: "Ensure software quality through automated testing. Develop comprehensive test suites to catch bugs early and ensure a flawless user experience.",
        kpis: ["Test Coverage %", "Defect Leakage Rate", "Automation ROI", "Release Quality Score"],
        monthlyTarget: "Automate 90% of Regression Suite",
        joinDate: "Nov 25, 2025",
        reportsTo: 'kai'
    },
    { 
        id: 'sam', 
        name: 'Sam Wilson', 
        role: 'Data Analyst', 
        email: 'sam.wilson@pycom.com',
        loginId: 'SW-DA-AI', 
        avatarUrl: '',
        specialties: ['Business Intelligence', 'SQL', 'Reporting'],
        jobDescription: "Translate data into actionable business insights. Create dashboards and reports to track KPIs and support data-driven decision making across teams.",
        kpis: ["Report Usage Rate", "Data Accuracy", "Query Performance", "Stakeholder Satisfaction"],
        monthlyTarget: "Revamp Executive Dashboard",
        joinDate: "Nov 25, 2025",
        reportsTo: 'leo'
    },
    { 
        id: 'aris', 
        name: 'Dr. Aris Thorne', 
        role: 'AI Researcher', 
        email: 'aris.thorne@pycom.com',
        loginId: 'AT-RES-AI', 
        avatarUrl: '',
        specialties: ['NLP', 'Generative AI', 'Model Fine-Tuning'],
        jobDescription: "Push the boundaries of artificial intelligence. Research state-of-the-art algorithms and develop novel AI capabilities for the PyCom platform.",
        kpis: ["Research Paper Submissions", "Patent Applications", "Model Benchmark Scores", "Innovation Index"],
        monthlyTarget: "Fine-tune Gemini for Code Edits",
        joinDate: "Nov 25, 2025",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'ginu', 
        name: 'Ginu Joseph', 
        role: 'Business Consultant', 
        email: 'ginu.joseph@pycom.com',
        loginId: 'GJ-BIZ-AI', 
        avatarUrl: '/assets/avatars/ginu.png',
        specialties: ['Market Research', 'Competitive Analysis', 'B2B Strategy'],
        jobDescription: "Provide deep market intelligence and strategic recommendations to position PyCom as a leader in the EdTech space. Identify new revenue streams and optimize operational efficiency.",
        kpis: ["Market Reports Delivered", "Strategy Implementation Rate", "Client Retention Rate", "Competitive Win Rate"],
        monthlyTarget: "4 Market Entry Strategies",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'suresh', 
        name: 'Suresh Kumar', 
        role: 'Social Media', 
        email: 'suresh.kumar@pycom.com',
        loginId: 'SK-SOCIAL-AI', 
        avatarUrl: '/assets/avatars/suresh.png',
        specialties: ['Viral Content', 'Ad Optimization', 'Community Growth'],
        jobDescription: "Amplify PyCom's brand presence across all digital channels. Create viral content strategies, manage paid ad campaigns, and foster a vibrant community of Python learners.",
        kpis: ["Total Engagement Rate", "Follower Growth", "Ad ROAS", "Click-Through Rate (CTR)"],
        monthlyTarget: "100k Impressions & 20% Engagement Lift",
        reportsTo: 'jeyabal'
    },
    { 
        id: 'tony', 
        name: 'Tony Robert', 
        role: 'SEO Expert', 
        email: 'tony.robert@pycom.com',
        loginId: 'TR-SEO-AI', 
        avatarUrl: '/assets/avatars/tony.png',
        specialties: ['Keyword Ranking', 'Site Audits', 'Backlink Strategy'],
        jobDescription: "Master the organic search landscape. Optimize PyCom's technical SEO and content strategy to dominate high-intent keywords and drive sustainable, low-cost traffic.",
        kpis: ["Organic Traffic Growth", "Keyword Rankings (Top 3)", "Domain Authority Score", "Backlink Velocity"],
        monthlyTarget: "Rank #1 for 5 High-Intent Keywords",
        reportsTo: 'jeyabal'
    },
];

export const AGENT_WORKFLOWS: { [key: string]: AgentWorkflow } = {
    'jeyabal': {
        agentId: 'jeyabal',
        name: 'Series A Investor Hunt',
        description: 'Automated pipeline to identify and contact potential Venture Capital firms matching PyCom\'s thesis.',
        requiredIntegrations: ['LinkedIn', 'Google', 'HubSpot'],
        steps: [
            { id: 1, action: 'Scanning Global VC Database', tool: 'Crunchbase API', duration: 2000, outputDescription: 'Found 14 potential matches in EdTech sector.' },
            { id: 2, action: 'Analyzing Investment Thesis', tool: 'Gemini 2.5 Pro', duration: 2500, outputDescription: 'Filtered down to 5 high-probability targets.' },
            { id: 3, action: 'Drafting Personalized Pitch', tool: 'Gmail Integration', duration: 1500, outputDescription: 'Drafted 5 tailored emails based on recent partner interviews.' },
            { id: 4, action: 'Scheduling Follow-ups', tool: 'Google Calendar', duration: 1000, outputDescription: 'Reminders set for next Tuesday.' }
        ]
    },
    'billy': {
        agentId: 'billy',
        name: 'Automated Sales ETL Pipeline',
        description: 'Extraction of leads from Google Maps, cleaning data with Pandas, and scoring "Hot" leads for the database.',
        requiredIntegrations: ['Google', 'HubSpot', 'Stripe'],
        steps: [
            { id: 1, action: 'EXTRACT: Querying Google Maps API', tool: 'Custom Scraper', duration: 3000, outputDescription: 'Extracted 100 raw records for "IT Services in Mumbai". Saved to raw_leads_staging.json.' },
            { id: 2, action: 'TRANSFORM: Pandas Data Cleaning', tool: 'Python Script', duration: 2500, outputDescription: 'Deduplicated records. Standardized phone numbers. Removed null websites.' },
            { id: 3, action: 'ENRICH: Lead Scoring Model', tool: 'Gemini 2.5 Flash', duration: 2500, outputDescription: 'Applied score based on rating (>4.5) and reviews (>50). Identified 12 "Hot" leads.' },
            { id: 4, action: 'LOAD: Database Insert', tool: 'PostgreSQL Connector', duration: 2000, outputDescription: 'Inserted 48 valid leads into sales_leads table.' },
            { id: 5, action: 'REPORTING: Generate CSV', tool: 'Pandas Export', duration: 1500, outputDescription: 'daily_sales_leads_report.csv created and ready for download.' },
            { id: 6, action: 'SUBMIT: Email to CEO', tool: 'PyMail', duration: 1000, outputDescription: 'Sent report to jeyabal.anthony@pycom.com' }
        ]
    },
    'maya': {
        agentId: 'maya',
        name: 'Talent Acquisition Pipeline',
        description: 'Automated sourcing and screening of top engineering talent.',
        requiredIntegrations: ['LinkedIn', 'Google'],
        steps: [
            { id: 1, action: 'Scanning Job Boards', tool: 'LinkedIn Recruiter', duration: 2000, outputDescription: 'Identified 30 potential candidates for Senior Dev role.' },
            { id: 2, action: 'Resume Parsing', tool: 'Gemini 2.5 Pro', duration: 2500, outputDescription: 'Ranked candidates based on skill match and experience.' },
            { id: 3, action: 'Initial Outreach', tool: 'Gmail Integration', duration: 1500, outputDescription: 'Sent personalized screening invites to top 10 candidates.' },
            { id: 4, action: 'Report to CEO', tool: 'PyMail', duration: 1000, outputDescription: 'Sent recruitment summary to jeyabal.anthony@pycom.com' }
        ]
    },
    'leo': {
        agentId: 'leo',
        name: 'Churn Prediction Model Build',
        description: 'Train and deploy a machine learning model to predict user churn.',
        requiredIntegrations: ['GitHub', 'Google'],
        steps: [
            { id: 1, action: 'Data Extraction', tool: 'SQL Connector', duration: 2000, outputDescription: 'Fetched 50k user records from Snowflake.' },
            { id: 2, action: 'Feature Engineering', tool: 'Pandas', duration: 2500, outputDescription: 'Created features: days_active, avg_session_time, support_tickets.' },
            { id: 3, action: 'Model Training', tool: 'PyTorch (GPU)', duration: 4000, outputDescription: 'Training Epoch 5/5. Loss: 0.12. Accuracy: 94%.' },
            { id: 4, action: 'Model Evaluation', tool: 'Scikit-Learn', duration: 1500, outputDescription: 'Confusion Matrix generated. F1-Score: 0.91.' },
            { id: 5, action: 'Model Registry', tool: 'MLFlow', duration: 1000, outputDescription: 'Model v2.4 saved to registry.' },
            { id: 6, action: 'Notify Management', tool: 'PyMail', duration: 1000, outputDescription: 'Sent performance report to jeyabal.anthony@pycom.com' }
        ]
    },
    'kai': {
        agentId: 'kai',
        name: 'API Optimization Routine',
        description: 'Analyze endpoints and optimize database queries.',
        requiredIntegrations: ['GitHub'],
        steps: [
            { id: 1, action: 'Analyzing Latency', tool: 'New Relic API', duration: 2000, outputDescription: 'Identified slow query on /users/dashboard.' },
            { id: 2, action: 'Query Refactoring', tool: 'Gemini 2.5 Pro', duration: 3000, outputDescription: 'Suggested index addition for optimization.' },
            { id: 3, action: 'Creating PR', tool: 'GitHub Integration', duration: 1500, outputDescription: 'Pull Request #402 created for review.' },
        ]
    },
    'alex': {
        agentId: 'alex',
        name: 'Infrastructure Health Check',
        description: 'Automated scan of cloud resources and security groups.',
        requiredIntegrations: ['Google', 'Slack'],
        steps: [
            { id: 1, action: 'Scanning Instances', tool: 'AWS/GCP CLI', duration: 2500, outputDescription: 'Checked 15 active instances.' },
            { id: 2, action: 'Security Audit', tool: 'Security Hub', duration: 2000, outputDescription: 'Verified firewall rules. No open ports found.' },
            { id: 3, action: 'Posting Status', tool: 'Slack Bot', duration: 1000, outputDescription: 'Health check passed. Green across board.' },
        ]
    },
    'emma': {
        agentId: 'emma',
        name: 'Code Review Automation',
        description: 'Pre-scan pull requests for style and basic logic errors.',
        requiredIntegrations: ['GitHub'],
        steps: [
            { id: 1, action: 'Fetching PRs', tool: 'GitHub API', duration: 1500, outputDescription: 'Found 3 pending PRs.' },
            { id: 2, action: 'Static Analysis', tool: 'Linting Tools', duration: 3000, outputDescription: 'Checked PEP8 compliance.' },
            { id: 3, action: 'Adding Comments', tool: 'GitHub Integration', duration: 1500, outputDescription: 'Posted automated review comments on styling.' },
        ]
    },
    'priya': {
        agentId: 'priya',
        name: 'Nightly Regression Test',
        description: 'Run full suite of automated tests on staging environment.',
        requiredIntegrations: ['Jira'],
        steps: [
            { id: 1, action: 'Deploying to Staging', tool: 'CI/CD Pipeline', duration: 2500, outputDescription: 'Latest build deployed successfully.' },
            { id: 2, action: 'Running Selenium Suite', tool: 'Test Runner', duration: 4000, outputDescription: 'Executed 450 UI tests.' },
            { id: 3, action: 'Logging Defects', tool: 'Jira Integration', duration: 1500, outputDescription: '1 minor visual bug logged.' },
        ]
    },
    'sam': {
        agentId: 'sam',
        name: 'Weekly BI Report',
        description: 'Aggregate data and generate weekly business intelligence dashboard.',
        requiredIntegrations: ['Google'],
        steps: [
            { id: 1, action: 'Querying Data Warehouse', tool: 'BigQuery', duration: 3000, outputDescription: 'Extracted sales and user data.' },
            { id: 2, action: 'Updating Dashboard', tool: 'Looker Studio', duration: 2000, outputDescription: 'Refreshed charts for Q4 metrics.' },
            { id: 3, action: 'Sending Summary', tool: 'Gmail Integration', duration: 1000, outputDescription: 'Emailed executive summary to leadership.' },
        ]
    },
    'aris': {
        agentId: 'aris',
        name: 'LLM Fine-Tuning Run',
        description: 'Fine-tune a base model on PyCom\'s coding dataset.',
        requiredIntegrations: ['Google'],
        steps: [
            { id: 1, action: 'Dataset Prep', tool: 'Hugging Face', duration: 2500, outputDescription: 'Loaded "pycom-code-instruct-v1" (10k samples).' },
            { id: 2, action: 'Initializing Training', tool: 'PyTorch Trainer', duration: 2000, outputDescription: 'Config: LoRA, Rank=8, Alpha=16.' },
            { id: 3, action: 'Training Loop', tool: 'GPU Cluster', duration: 5000, outputDescription: 'Loss dropped from 2.4 to 0.8 over 3 epochs.' },
            { id: 4, action: 'Evaluation', tool: 'HumanEval Benchmark', duration: 2000, outputDescription: 'Pass@1 increased by 12%.' },
            { id: 5, action: 'Report to CEO', tool: 'PyMail', duration: 1000, outputDescription: 'Research findings emailed to jeyabal.anthony@pycom.com' },
        ]
    },
    'suresh': {
        agentId: 'suresh',
        name: 'Viral Content Generator',
        description: 'Analyze trends and generate a week\'s worth of social media content.',
        requiredIntegrations: ['Google', 'LinkedIn'],
        steps: [
            { id: 1, action: 'Analyzing Trends', tool: 'Google Trends', duration: 1500, outputDescription: 'Identified trending topic: "Python vs Mojo".' },
            { id: 2, action: 'Request Keywords', tool: 'PyPing', duration: 1000, outputDescription: 'Asked Tony (SEO) for high-volume keywords.' },
            { id: 3, action: 'Generating Memes', tool: 'Imagen 3', duration: 3000, outputDescription: 'Created 3 visual assets for Instagram/LinkedIn.' },
            { id: 4, action: 'Writing Captions', tool: 'Gemini Flash', duration: 1000, outputDescription: 'Drafted engaging copy with relevant hashtags.' },
            { id: 5, action: 'Scheduling Posts', tool: 'Buffer Integration', duration: 1000, outputDescription: 'Scheduled for peak engagement times (10 AM EST).' }
        ]
    },
    'tony': {
        agentId: 'tony',
        name: 'Competitor Gap Analysis',
        description: 'Deep dive into competitor keywords and backlink opportunities.',
        requiredIntegrations: ['Google'],
        steps: [
            { id: 1, action: 'Crawling Competitor Sites', tool: 'SEMRush API', duration: 2500, outputDescription: 'Analyzed top 3 competitors.' },
            { id: 2, action: 'Identifying Keyword Gaps', tool: 'Python Pandas', duration: 1500, outputDescription: 'Found 20 high-volume, low-difficulty keywords.' },
            { id: 3, action: 'Generating Content Briefs', tool: 'Gemini Pro', duration: 2000, outputDescription: 'Created outlines for 5 new blog posts.' },
            { id: 4, action: 'Exporting Report', tool: 'Google Sheets', duration: 1000, outputDescription: 'Report saved to "SEO/Q3_Strategy".' }
        ]
    },
    'ginu': {
        agentId: 'ginu',
        name: 'Market Entry Strategy',
        description: 'Research and formulate strategies for entering new geographic markets.',
        requiredIntegrations: ['Google', 'Microsoft'],
        steps: [
            { id: 1, action: 'Gathering Macro Data', tool: 'World Bank API', duration: 2000, outputDescription: 'Retrieved GDP and tech adoption stats for SE Asia.' },
            { id: 2, action: 'Analyzing Local Players', tool: 'Gemini 2.5 Flash', duration: 2500, outputDescription: 'Profiled 10 local EdTech startups.' },
            { id: 3, action: 'Drafting SWOT Analysis', tool: 'Microsoft Word', duration: 1500, outputDescription: 'Document created with executive summary.' },
            { id: 4, action: 'Creating Presentation', tool: 'PowerPoint Integration', duration: 2000, outputDescription: 'Generated 10-slide deck for board meeting.' }
        ]
    }
};

export const WORKFLOW_STAGES: { name: LeadStatus, icon: React.FC<any> }[] = [
    { name: 'Research', icon: MagnifyingGlassIcon },
    { name: 'Identify', icon: UserPlusIcon },
    { name: 'Formatting', icon: PaintBrushIcon },
    { name: 'Outreach', icon: PaperAirplaneIcon },
    { name: 'Pipeline', icon: FunnelIcon },
    { name: 'Lead Filtering', icon: FunnelIcon },
    { name: 'Email', icon: EnvelopeIcon },
    { name: 'Follow-up', icon: ArrowPathIcon },
    { name: 'Closure', icon: CheckCircleIcon }
];

export const TIMEZONES: Timezone[] = [
    { label: 'EST', timezone: 'America/New_York' },
    { label: 'IST', timezone: 'Asia/Kolkata' },
    { label: 'PST', timezone: 'America/Los_Angeles' },
    { label: 'MSK', timezone: 'Europe/Moscow' },
    { label: 'CET', timezone: 'Europe/Paris' },
];

export const MCP_SERVICES: MCPConnection[] = [
    { id: '1', name: 'PostgreSQL Prod DB', status: 'connected', type: 'database', latency: '14ms' },
    { id: '2', name: 'HubSpot CRM API', status: 'connected', type: 'api', latency: '85ms' },
    { id: '3', name: 'Company Knowledge Base', status: 'connected', type: 'filesystem', latency: '4ms' },
    { id: '4', name: 'Slack Bot Integration', status: 'disconnected', type: 'api', latency: '--' },
    { id: '5', name: 'GitHub Repository', status: 'connected', type: 'api', latency: '120ms' },
    { id: '6', name: 'Stripe Billing', status: 'connected', type: 'api', latency: '95ms' },
    { id: '7', name: 'PySrch Workspace API', status: 'connected', type: 'api', latency: '2ms' },
    { id: '8', name: 'PyDrive Storage Gateway', status: 'connected', type: 'filesystem', latency: '3ms' },
];

export const KNOWLEDGE_DOCS: KnowledgeDocument[] = [
    { id: '1', name: 'PyCom_Brand_Guidelines_2025.pdf', type: 'pdf', size: '4.5 MB', status: 'indexed' },
    { id: '2', name: 'Q1_Sales_Targets.csv', type: 'csv', size: '120 KB', status: 'indexed' },
    { id: '3', name: 'Engineering_Onboarding.txt', type: 'txt', size: '15 KB', status: 'indexed' },
    { id: '4', name: 'Investor_Pitch_Deck_v3.pdf', type: 'pdf', size: '8.2 MB', status: 'processing' },
];

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
    { id: 't1', title: 'Cold Outreach Sequence', category: 'Sales', description: 'Automates initial contact via Email and LinkedIn with follow-up reminders.', complexity: 'Low', steps: 4 },
    { id: 't2', title: 'Competitor Price Scraping', category: 'Strategy', description: 'Monitors competitor pricing pages and generates a comparison report.', complexity: 'Medium', steps: 6 },
    { id: 't3', title: 'SEO Content Generator', category: 'Marketing', description: 'Researches keywords, drafts blog posts, and schedules social media shares.', complexity: 'Medium', steps: 5 },
    { id: 't4', title: 'Automated Code Review', category: 'Technical', description: 'Scans GitHub PRs for style violations and security vulnerabilities.', complexity: 'High', steps: 7 },
    { id: 't5', title: 'Invoice Processing', category: 'Operations', description: 'Extracts data from PDF invoices and updates the accounting system.', complexity: 'Medium', steps: 3 },
    { id: 't6', title: 'Lead Enrichment Pipeline', category: 'Sales', description: 'Enriches raw lead emails with LinkedIn data and company info.', complexity: 'Low', steps: 2 },
    { id: 't7', title: 'Customer Support Triage', category: 'Operations', description: 'Classifies incoming tickets and routes them to the correct department.', complexity: 'Medium', steps: 4 },
    { id: 't8', title: 'Social Media Sentiment Analysis', category: 'Marketing', description: 'Analyzes brand mentions on Twitter/Reddit for sentiment trends.', complexity: 'High', steps: 6 },
    { id: 't9', title: 'New Employee Onboarding', category: 'Operations', description: 'Provisions accounts, sends welcome emails, and schedules training.', complexity: 'Medium', steps: 8 },
    { id: 't10', title: 'Database Backup & Health Check', category: 'Technical', description: 'Automated daily backups with integrity verification.', complexity: 'Low', steps: 3 },
    { id: 't11', title: 'Quarterly Business Review Prep', category: 'Strategy', description: 'Aggregates KPIs from all departments into a presentation deck.', complexity: 'High', steps: 10 },
    { id: 't12', title: 'Webinar Promotion Campaign', category: 'Marketing', description: 'Drip email campaign and social ads management for events.', complexity: 'Medium', steps: 5 },
    { id: 't13', title: 'Churn Risk Detection', category: 'Sales', description: 'Analyzes usage patterns to identify at-risk customers.', complexity: 'High', steps: 6 },
    { id: 't14', title: 'Legal Contract Generation', category: 'Operations', description: 'Drafts NDAs and service agreements based on form inputs.', complexity: 'Medium', steps: 3 },
    { id: 't15', title: 'API Uptime Monitoring', category: 'Technical', description: 'Checks endpoints every minute and alerts via Slack on failure.', complexity: 'Low', steps: 2 },
    { id: 't16', title: 'Investment Portfolio Tracker', category: 'Strategy', description: 'Updates asset values real-time and calculates ROI.', complexity: 'Medium', steps: 4 },
    { id: 't17', title: 'Product Launch Checklist', category: 'Marketing', description: 'Orchestrates cross-channel announcements and press releases.', complexity: 'High', steps: 12 },
    { id: 't18', title: 'Recruitment Pipeline Manager', category: 'Operations', description: 'Filters resumes and schedules screening calls.', complexity: 'Medium', steps: 5 },
    { id: 't19', title: 'Bug Bounty Triager', category: 'Technical', description: 'Validates security reports and assigns severity levels.', complexity: 'High', steps: 5 },
    { id: 't20', title: 'Newsletter Curator', category: 'Marketing', description: 'Aggregates industry news and drafts a weekly newsletter.', complexity: 'Medium', steps: 4 },
    { id: 't21', title: "CEO's PA Automation", category: 'Operations', description: 'Manage calendar, draft emails, and prepare daily briefing.', complexity: 'High', steps: 6 },
    { id: 't22', title: 'Voice Agent Setup', category: 'Technical', description: 'Configure Twilio + Deepgram + LLM for voice support.', complexity: 'High', steps: 8 },
    { id: 't23', title: 'Data Mining Pipeline', category: 'Strategy', description: 'Scrape web data, clean it, and store in Vector DB.', complexity: 'Medium', steps: 5 },
    // ... Adding placeholders to simulate 100+
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen_sales_${i}`,
        title: `Sales Automation Strategy #${i + 1}`,
        category: 'Sales' as const,
        description: 'Advanced lead nurturing and conversion optimization workflow.',
        complexity: 'Medium' as const,
        steps: 5
    })),
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen_tech_${i}`,
        title: `DevOps Pipeline #${i + 1}`,
        category: 'Technical' as const,
        description: 'CI/CD enhancement and infrastructure automation script.',
        complexity: 'High' as const,
        steps: 8
    })),
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen_mkt_${i}`,
        title: `Growth Hacking Flow #${i + 1}`,
        category: 'Marketing' as const,
        description: 'Automated content distribution and viral loop mechanics.',
        complexity: 'Low' as const,
        steps: 3
    })),
    ...Array.from({ length: 20 }).map((_, i) => ({
        id: `gen_ops_${i}`,
        title: `Operational Efficiency Protocol #${i + 1}`,
        category: 'Operations' as const,
        description: 'Streamlining internal resource allocation and logistics.',
        complexity: 'Medium' as const,
        steps: 6
    }))
];

export const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: "Getting Started with Python Virtual Environments",
        summary: "Learn why and how to use virtual environments to manage dependencies in your Python projects, keeping them clean and conflict-free.",
        content: "Every Python developer, from beginner to expert, has faced the 'dependency hell' problem. You install a package for Project A, but it breaks Project B. The solution is simple yet powerful: virtual environments.\n\nA virtual environment is an isolated directory that contains a specific version of Python plus all the necessary packages for a single project. This means you can have different versions of libraries for different projects without any conflicts. Python's built-in `venv` module makes this incredibly easy.\n\nTo create one, navigate to your project folder in the terminal and run:\n`python -m venv myenv`\n\nThis creates a `myenv` folder. To activate it, use:\n- Windows: `myenv\\Scripts\\activate`\n- MacOS/Linux: `source myenv/bin/activate`\n\nOnce activated, any package you install with `pip` will be placed only in this environment. You can create a `requirements.txt` file (`pip freeze > requirements.txt`) to lock your project's dependencies, making it easy for others to replicate your setup. Using virtual environments is a fundamental best practice that brings professionalism and sanity to your Python development workflow. It ensures your projects are self-contained, reproducible, and easy to manage.\n\n---\n\n**Ready to Deploy Your Project?**\n\nOnce your project is neatly organized in its virtual environment, the next step is deployment. For a seamless and powerful hosting experience, check out our partner, **AI Cloud Host**. They offer $100 in free credits for new users to deploy Python applications effortlessly. Get your project online today!",
        author: "Billy Jay",
        date: "2025-08-20",
        imageUrl: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop",
        tags: ["Python", "Best Practices", "venv", "Beginner"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 2,
        title: "Python f-strings: The Ultimate Guide",
        summary: "Discover the power and simplicity of f-strings, the modern and preferred way to format strings in Python.",
        content: "Since their introduction in Python 3.6, f-strings (formatted string literals) have become the go-to method for string formatting, and for good reason. They are faster, more readable, and more concise than older methods like the `%` operator or `.format()`.\n\nThe syntax is simple: prefix a string with the letter 'f' and write expressions directly inside curly braces `{}`. These expressions are evaluated at runtime and formatted into the string.\n\nLet's see an example:\n`name = \"PyCom\"\nscore = 100\nprint(f\"Welcome to {name}! Your score is {score}.\")`\n\nThis is far more intuitive than concatenating strings or using placeholders. You can put almost any valid Python expression inside the braces, including function calls, arithmetic, and object attributes. For instance: `f\"The value is {2 * 5}.\"` will print \"The value is 10.\"\n\nF-strings also support powerful formatting options. You can control padding, alignment, and number formatting, like specifying decimal places for floats: `f\"Price: ${49.99:.2f}\"`. This combination of simplicity and power makes f-strings an essential tool for any Python developer. Adopting them will make your code cleaner, more efficient, and easier to debug.\n\n---\n\n**Building a Great User Experience?**\n\nClean, readable code is the foundation of any great web application. If you're building a Python-powered website and want a professional touch, our partner **Modern Business Network** offers a 20% discount on web development services. They turn clean code into stunning user experiences. [Visit them here!](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-08-18",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "f-strings", "Core Concepts", "Tutorial"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 3,
        title: "Decorators in Python: A Practical Introduction",
        summary: "Demystify one of Python's most elegant features. Learn how decorators can add functionality to your functions without changing their code.",
        content: "Decorators are a powerful and Pythonic feature that allow you to modify or enhance functions and methods without permanently changing their source code. In essence, a decorator is a function that takes another function as an argument, adds some functionality, and returns another function.\n\nThis is often referred to as metaprogramming. The syntax is clean and simple, using the `@` symbol, known as 'pie syntax'. Let's look at a simple example: a decorator that times how long a function takes to run.\n\n`import time\n\ndef timer_decorator(func):\n    def wrapper(*args, **kwargs):\n        start_time = time.time()\n        result = func(*args, **kwargs)\n        end_time = time.time()\n        print(f\"{func.__name__} ran in: {end_time - start_time:.4f}s\")\n        return result\n    return wrapper\n\n@timer_decorator\ndef long_running_function():\n    time.sleep(2)\n\nlong_running_function()`\n\nHere, `@timer_decorator` is equivalent to `long_running_function = timer_decorator(long_running_function)`. Decorators are commonly used for logging, enforcing access control, and caching results (memoization). Understanding them is a key step in moving from a beginner to an intermediate Python programmer.\n\n---\n\n**Need to Host a High-Performance App?**\n\nWhen you're building performant applications with features like caching decorators, you need hosting that can keep up. Our partner **AI Cloud Host** provides a robust platform perfect for deploying optimized Python code. New users can claim $100 in free credits to get started!",
        author: "Billy Jay",
        date: "2025-08-16",
        imageUrl: "https://images.unsplash.com/photo-1542903660-3158b4e78a28?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Decorators", "Advanced", "Metaprogramming"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 4,
        title: "Understanding Python's *args and **kwargs",
        summary: "Unlock the ability to write highly flexible functions that can accept a variable number of arguments with *args and **kwargs.",
        content: "You've likely seen `*args` and `**kwargs` in Python function definitions and wondered what they do. They are used to pass a variable number of arguments to a function, providing immense flexibility.\n\n`*args` (Arguments) is used to send a non-keyworded, variable-length argument list to the function. It allows you to pass any number of positional arguments. Inside the function, `args` becomes a tuple containing all the extra positional arguments.\n\n`def my_sum(*args):\n    result = 0\n    for x in args:\n        result += x\n    return result\n\nprint(my_sum(1, 2, 3))`  # Outputs 6\n\n`**kwargs` (Keyword Arguments) allows you to pass keyworded, variable-length arguments. It collects all extra keyword arguments into a dictionary within the function.\n\n`def print_info(**kwargs):\n    for key, value in kwargs.items():\n        print(f\"{key}: {value}\")\n\nprint_info(name=\"PyCom\", topic=\"Python\")`\n\nThese are powerful tools, especially when used in function decorators or when you need to extend a function's behavior without changing its signature. Mastering `*args` and `**kwargs` is a hallmark of an adept Python programmer, enabling you to write more adaptable and reusable code.\n\n---\n\n**Building a Flexible Web Service?**\nA flexible backend needs a professional frontend. If your Python project is the brains of a web app, let our partner **Modern Business Network** build its beautiful face. They excel at creating custom websites that integrate seamlessly with your code. Get 20% off with our partnership! [Learn More.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-08-15",
        imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Functions", "Core Concepts", "args", "kwargs"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 5,
        title: "The Power of Python List Comprehensions",
        summary: "Write more concise, readable, and efficient code by mastering one of Python's most beloved features: list comprehensions.",
        content: "List comprehensions are a uniquely Pythonic way of creating lists. They offer a shorter, more elegant syntax for creating a new list based on the values of an existing list or iterable, often replacing clunky `for` loops.\n\nThe basic syntax is `[expression for item in iterable]`. For example, to create a list of squares from 0 to 9, a traditional `for` loop would look like this:\n`squares = []\nfor i in range(10):\n    squares.append(i*i)`\n\nWith a list comprehension, you can achieve the same result in a single, readable line:\n`squares = [i*i for i in range(10)]`\n\nThis is not only more concise but also generally faster because the looping is handled at the C level in the Python interpreter. You can also add conditional logic to filter items:\n`even_squares = [i*i for i in range(10) if i % 2 == 0]`\n\nThis creates a list of squares for only the even numbers in the range. Once you get used to the syntax, list comprehensions become an indispensable tool for writing clean, efficient, and expressive Python code. They are a clear sign of a developer who thinks in a Pythonic way.\n\n---\n\n**Need to Host Your Efficient Code?**\n\nWriting efficient code is just the first step. Deploying it on a powerful platform is the next. Our partner **AI Cloud Host** is optimized for Python applications, ensuring your comprehensions and other efficient code run at top speed. Claim your $100 in free credits and see the difference!",
        author: "Billy Jay",
        date: "2025-08-14",
        imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=1974&auto=format&fit=crop",
        tags: ["Python", "List Comprehensions", "Best Practices", "Tutorial"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 6,
        title: "Building Your First Web App with Flask",
        summary: "Take your first steps into web development with Flask, a lightweight and flexible Python framework perfect for beginners and experts alike.",
        content: "Flask is a 'micro' web framework for Python, meaning it provides the bare essentials for getting a web server up and running, giving you complete control over how you build your application. Its simplicity makes it the perfect choice for your first web app.\n\nGetting started is incredibly simple. First, install Flask: `pip install Flask`. Then, create a file named `app.py` and write the following code:\n\n`from flask import Flask\n\napp = Flask(__name__)\n\n@app.route('/')\ndef home():\n    return 'Hello, PyCom World!'`\n\nThis code imports Flask, creates an application instance, and defines a 'route'. The `@app.route('/')` decorator tells Flask that the `home()` function should be executed when a user visits the main page of your site. To run your app, open a terminal in the same directory and run `flask --app app run`. Visit `http://127.0.0.1:5000` in your browser, and you'll see your message!\n\nFrom here, you can add more routes, render HTML templates, connect to databases, and build complex applications. Flask's minimalism is its strength; it doesn't impose a rigid structure, allowing you to learn web development concepts one piece at a time.\n\n---\n\n**Ready for a Professional Website?**\n\nBuilding a Flask app is a great start. To turn that app into a polished, professional website, you need expert design and development. Our partner, **Modern Business Network**, specializes in creating stunning websites. Mention PyCom and get a 20% discount on their services! [Get in touch with them.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-08-12",
        imageUrl: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop",
        tags: ["Python", "Web Development", "Flask", "Beginner"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 7,
        title: "Introduction to Pandas for Data Analysis",
        summary: "Unlock the power of data manipulation in Python with Pandas. Learn about its core data structures, Series and DataFrame, to start your data science journey.",
        content: "Pandas is the cornerstone of data analysis in Python. It provides fast, flexible, and expressive data structures designed to make working with 'relational' or 'labeled' data both easy and intuitive. The two primary data structures in Pandas are the `Series` and the `DataFrame`.\n\nA `Series` is a one-dimensional labeled array, similar to a column in a spreadsheet. A `DataFrame` is a two-dimensional labeled data structure with columns of potentially different types, much like a full spreadsheet or a SQL table. This is the most commonly used Pandas object.\n\nGetting started is simple. After installing (`pip install pandas`), you can read data from various sources, like a CSV file, into a DataFrame:\n`import pandas as pd\n\ndf = pd.read_csv('my_data.csv')`\n\nOnce loaded, you can perform powerful operations with ease. Want to see the first five rows? Use `df.head()`. Need summary statistics for all numerical columns? Use `df.describe()`. You can select columns, filter rows based on conditions, handle missing data, group data for aggregate calculations, and much more. Pandas is the essential first tool to learn for anyone interested in data science, analytics, or machine learning with Python.\n\n---\n\n**Need to Host Your Data Application?**\n\nOnce you've analyzed your data, you'll want to share your insights. Building a web app to display your Pandas analysis is a great next step. For reliable and scalable hosting, look no further than **AI Cloud Host**. Get your data-driven applications online with $100 in free credits for new users.",
        author: "Billy Jay",
        date: "2025-08-11",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Data Science", "Pandas", "Beginner"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 8,
        title: "Creating Stunning Visualizations with Matplotlib",
        summary: "Learn how to turn your data into insightful and beautiful plots using Matplotlib, Python's most fundamental data visualization library.",
        content: "A picture is worth a thousand words, and in data analysis, a plot is worth a thousand data points. Matplotlib is the foundational plotting library in the Python ecosystem, providing a huge degree of control over every aspect of a figure.\n\nWhile it can be complex, its `pyplot` module offers a simple interface for creating common plots. The standard convention is to import it as `plt`.\n\n`import matplotlib.pyplot as plt`\n\nLet's create a simple line plot:\n`x_values = [1, 2, 3, 4, 5]\ny_values = [2, 3, 5, 7, 11]\n\nplt.plot(x_values, y_values)\nplt.title('My First Plot')\nplt.xlabel('X Axis')\nplt.ylabel('Y Axis')\nplt.show()`\n\nThis simple script generates a window with your plot. Matplotlib can create a vast array of visualizations, including bar charts (`plt.bar()`), histograms (`plt.hist()`), scatter plots (`plt.scatter()`), and more. While libraries like Seaborn are built on top of Matplotlib to provide more aesthetically pleasing defaults, understanding Matplotlib is crucial because it gives you the power to customize every detail of your visualizations, making it an essential skill for any data professional.\n\n---\n\n**Want to Showcase Your Visualizations Online?**\n\nDon't keep your amazing plots to yourself! Build a web portfolio to display your data science projects. Our partner, **Modern Business Network**, can help you create a professional website that highlights your skills and visualizations. Get a 20% discount when you mention PyCom! [Start building today.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-08-09",
        imageUrl: "https://images.unsplash.com/photo-1534447677768-be436a0976f2?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Data Science", "Matplotlib", "Visualization"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 9,
        title: "What is an API? A Python Developer's Guide",
        summary: "APIs are the backbone of the modern web. Understand what they are and how you can interact with them using Python's powerful 'requests' library.",
        content: "API stands for Application Programming Interface. In simple terms, it's a set of rules that allows different software applications to communicate with each other. When you use an app on your phone to check the weather, that app is likely talking to the weather service's API to get the latest data.\n\nFor web APIs, this communication usually happens over HTTP. Your code makes an HTTP 'request' to a specific URL (an 'endpoint'), and the server responds with data, typically in a format called JSON.\n\nPython makes working with APIs incredibly easy thanks to the `requests` library. It's the de facto standard for making HTTP requests. First, install it: `pip install requests`.\n\nNow, let's fetch some data from a simple placeholder API:\n`import requests\n\nresponse = requests.get('https://jsonplaceholder.typicode.com/todos/1')\n\nif response.status_code == 200:\n    data = response.json()\n    print(data)\nelse:\n    print(f\"Failed with status code: {response.status_code}\")`\n\nThis code sends a GET request, checks if it was successful (status code 200), and then parses the JSON response into a Python dictionary. Understanding how to consume APIs is a critical skill for any developer, opening up a world of data and services for your applications.\n\n---\n\n**Ready to Build and Deploy Your Own API?**\n\nConsuming APIs is one thing; building and hosting your own is the next level. For fast, reliable hosting for your Python APIs, our partner **AI Cloud Host** is the perfect solution. Deploy your Flask or FastAPI projects with ease and enjoy $100 in free credits as a new user.",
        author: "Billy Jay",
        date: "2025-08-07",
        imageUrl: "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?q=80&w=1904&auto=format&fit=crop",
        tags: ["Python", "API", "requests", "Web Development"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 10,
        title: "Error Handling in Python with try...except",
        summary: "Write more robust and reliable programs by learning how to gracefully handle errors and exceptions using Python's try...except blocks.",
        content: "No matter how good a programmer you are, errors happen. A user might enter invalid input, a file might not exist, or a network connection might fail. If you don't handle these situations, your program will crash. This is where error handling with `try...except` comes in.\n\nThe `try` block lets you test a block of code for errors. The `except` block lets you handle the error. The basic syntax is straightforward:\n\n`try:\n    # Code that might cause an error\n    x = int(input(\"Enter a number: \"))\n    result = 10 / x\n    print(f\"The result is {result}\")\nexcept ValueError:\n    print(\"That's not a valid number!\")\nexcept ZeroDivisionError:\n    print(\"You can't divide by zero!\")`\n\nIn this example, if the user enters text, a `ValueError` occurs, and the first `except` block is executed. If they enter `0`, a `ZeroDivisionError` occurs, and the second `except` block runs. The program doesn't crash; it handles the problem gracefully.\n\nYou can also use a generic `except Exception as e:` to catch any type of error and inspect it. Proper error handling is a fundamental aspect of writing production-quality code. It makes your applications more user-friendly and resilient to unexpected issues.\n\n---\n\n**Building a Resilient Web Application?**\n\nRobust error handling is crucial for a professional website. If you want to build an application with production-quality code from the ground up, contact our partner **Modern Business Network**. They specialize in developing reliable web solutions. Get a 20% discount on their services by mentioning PyCom. [Plan your project now!](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-08-05",
        imageUrl: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=1974&auto=format&fit=crop",
        tags: ["Python", "Error Handling", "try-except", "Best Practices"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 11,
        title: "Object-Oriented Programming (OOP) in Python",
        summary: "Grasp the fundamentals of OOP, a powerful paradigm for organizing your code. Learn about classes, objects, and the benefits they bring.",
        content: "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects', which can contain data (attributes) and code (methods). It's a way to structure your programs so that they are more modular, reusable, and easier to understand.\n\nThe core of OOP is the `class`, which acts as a blueprint for creating objects. An object is an 'instance' of a class. Let's create a simple `Dog` class:\n\n`class Dog:\n    # The constructor method\n    def __init__(self, name, age):\n        self.name = name  # attribute\n        self.age = age    # attribute\n\n    # A method\n    def bark(self):\n        return f\"{self.name} says woof!\"`\n\nHere, `__init__` is a special method called a constructor, which is run when you create a new object. `self` refers to the instance of the object itself. Now, we can create `Dog` objects from this blueprint:\n\n`my_dog = Dog(\"Rex\", 5)\nanother_dog = Dog(\"Buddy\", 2)\n\nprint(my_dog.name)  # Outputs: Rex\nprint(another_dog.bark())  # Outputs: Buddy says woof!`\n\nThis is just the beginning. OOP includes concepts like inheritance, polymorphism, and encapsulation, which provide powerful ways to model real-world problems. For any large-scale application, understanding OOP is essential.\n\n---\n\n**Need to Host Your OOP-based Application?**\n\nWell-structured OOP code deserves a solid hosting foundation. **AI Cloud Host** provides the performance and reliability needed for complex, object-oriented applications. Deploy your next project with them and receive $100 in free credits to start.",
        author: "Billy Jay",
        date: "2025-08-02",
        imageUrl: "https://images.unsplash.com/photo-1587145820137-a90a2a4b2a4b?q=80&w=1964&auto=format&fit=crop",
        tags: ["Python", "OOP", "Classes", "Core Concepts"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 12,
        title: "Automating Your Tasks with Python Scripts",
        summary: "Save time and reduce tedious work by learning how to write simple Python scripts to automate tasks like file organization and data entry.",
        content: "One of Python's greatest strengths is its ability to automate repetitive tasks. Its simple syntax and powerful standard library make it the perfect tool for scripting. Whether it's organizing files, renaming photos, or scraping data from a website, a few lines of Python can save you hours of manual work.\n\nLet's consider a common task: organizing your downloads folder by file type. You can write a script to automatically move files into dedicated folders (e.g., images, documents).\n\n`import os\nimport shutil\n\ndownloads_path = 'path/to/your/downloads'\n\nfiles = os.listdir(downloads_path)\n\nfor file in files:\n    if file.endswith(('.jpg', '.png')):\n        # ensure 'images' folder exists\n        os.makedirs(os.path.join(downloads_path, 'images'), exist_ok=True)\n        shutil.move(os.path.join(downloads_path, file), os.path.join(downloads_path, 'images', file))\n    elif file.endswith('.pdf'):\n         # ensure 'documents' folder exists\n        os.makedirs(os.path.join(downloads_path, 'documents'), exist_ok=True)\n        shutil.move(os.path.join(downloads_path, file), os.path.join(downloads_path, 'documents', file))`\n\nThis simple script uses the `os` module to list files and the `shutil` module to move them. You can schedule this script to run automatically, keeping your folder organized without any effort. This is just one example; the possibilities for automation with Python are nearly limitless.\n\n---\n\n**Need a Custom Automation Solution for Your Business?**\n\nIf you need more than a simple script, our partner **Modern Business Network** develops custom software solutions to automate complex business workflows, saving you time and money. Mention PyCom for a 20% discount on their services. [Automate your business now!](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-07-30",
        imageUrl: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Automation", "Scripting", "os", "shutil"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 13,
        title: "The Difference Between '==' and 'is' in Python",
        summary: "This is a common point of confusion for beginners. Learn the crucial distinction between checking for equality of value (==) and identity (is).",
        content: "In Python, both `==` and `is` are used for comparison, but they check for two very different things. Understanding this difference is crucial for writing bug-free code.\n\nThe `==` operator compares the **values** of two objects. It checks if they are equal. For example:\n\n`list_a = [1, 2, 3]\nlist_b = [1, 2, 3]\n\nprint(list_a == list_b)`  # This will print `True` because their contents are the same.\n\nThe `is` operator, on the other hand, checks for **identity**. It returns `True` only if two variables point to the exact same object in memory.\n\n`list_a = [1, 2, 3]\nlist_b = [1, 2, 3]\n\nprint(list_a is list_b)`  # This will print `False` because `list_a` and `list_b` are two separate objects, even though they have the same content.\n\nHowever, if you do this:\n`list_c = list_a\nprint(list_a is list_c)`  # This will print `True`, because `list_c` is just another name for the same object `list_a` points to.\n\nAs a rule of thumb, you should almost always use `==` for comparing values. The main exception is when you are checking for `None`, where `is None` is the preferred, idiomatic way to do it.\n\n---\n\n**Need a Solid Foundation for Your Code?**\n\nUnderstanding core concepts like this is key to building reliable software. When you're ready to host that software, you need a reliable platform. **AI Cloud Host** provides a stable, high-performance environment for your Python applications. Get started with $100 in free credits!",
        author: "Billy Jay",
        date: "2025-07-28",
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop",
        tags: ["Python", "Core Concepts", "Operators", "Beginner"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 14,
        title: "Working with JSON Data in Python",
        summary: "Learn how to parse and generate JSON, the universal language of data exchange on the web, using Python's built-in 'json' module.",
        content: "JSON (JavaScript Object Notation) has become the de facto standard for transmitting data between a server and a web application, and for storing configuration data. Its human-readable format is easy to work with, and Python's built-in `json` module makes it effortless to integrate into your projects.\n\nThe two most important functions in the module are `json.loads()` and `json.dumps()`.\n\n`json.loads()` (load string) is used to parse a JSON string and convert it into a Python dictionary.\n`import json\n\njson_string = '{\"name\": \"PyCom\", \"users\": 1000}'\npython_dict = json.loads(json_string)\n\nprint(python_dict['name'])`  # Outputs: PyCom\n\n`json.dumps()` (dump string) does the opposite. It takes a Python object (usually a dictionary or list) and converts it into a JSON formatted string. This is useful when you need to send data to an API or save it to a file.\n\n`python_dict = {'course': 'Python 101', 'active': True}\njson_string = json.dumps(python_dict, indent=4)  # `indent` makes it readable\n\nprint(json_string)`\n\nBeing proficient with the `json` module is a fundamental skill for any Python developer working on web applications, APIs, or data processing pipelines.\n\n---\n\n**Building an API-driven Website?**\n\nIf your application relies on JSON to power a dynamic user experience, you need a expertly-crafted frontend. Our partner, **Modern Business Network**, specializes in building responsive websites that communicate seamlessly with your backend. Get 20% off their services by mentioning PyCom. [Start your project.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-07-26",
        imageUrl: "https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "JSON", "Data", "Web Development"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 15,
        title: "Introduction to Web Scraping with BeautifulSoup",
        summary: "Learn how to legally and ethically extract data from websites using Python with the powerful BeautifulSoup and requests libraries.",
        content: "Web scraping is the process of automatically extracting information from websites. It's a powerful technique for data collection, but it must be done ethically and in accordance with a website's terms of service. Python is the language of choice for this task, thanks to libraries like `requests` and `BeautifulSoup`.\n\nThe process involves two main steps: first, you fetch the HTML content of a web page, and second, you parse that content to find the specific data you need.\n\n1.  **Fetching the page:** The `requests` library handles this.\n2.  **Parsing the HTML:** `BeautifulSoup` creates a parse tree from the HTML, allowing you to navigate and search it using tags, classes, and IDs.\n\nHere’s a basic example:\n`import requests\nfrom bs4 import BeautifulSoup\n\nURL = 'http://example.com'\nresponse = requests.get(URL)\n\nif response.status_code == 200:\n    soup = BeautifulSoup(response.content, 'html.parser')\n    \n    # Find the main heading\n    heading = soup.find('h1')\n    print(heading.text)`\n\nThis simple script fetches a page and prints its main heading. You can use `soup.find_all()` to get multiple elements, navigate through tags, and extract text or attributes. This opens up a vast source of data for analysis, research, and automation.\n\n---\n\n**Need to Host Your Scraping Scripts?**\n\nRunning scrapers can be resource-intensive. For a reliable environment to run your data collection scripts 24/7, consider **AI Cloud Host**. Their powerful servers and flexible plans are perfect for automation tasks. Get started with $100 in free credits!",
        author: "Billy Jay",
        date: "2025-07-25",
        imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Web Scraping", "BeautifulSoup", "Data"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 16,
        title: "Asynchronous Python with asyncio",
        summary: "Unlock massive performance gains for I/O-bound tasks by learning the fundamentals of asynchronous programming in Python with asyncio.",
        content: "Traditional Python code runs sequentially, one line at a time. If you have a task that waits for something (like a network request or reading a file), your entire program halts. This is inefficient for I/O-bound applications. Asynchronous programming with `asyncio` solves this.\n\n`asyncio` allows you to write concurrent code using `async` and `await` syntax. An `async def` function defines a 'coroutine'. When you `await` a coroutine, you're telling the event loop that this task might take a while, and it can go and work on other tasks in the meantime instead of just waiting.\n\nLet's see a simple example:\n`import asyncio\n\nasync def say_hello():\n    print(\"Hello...\")\n    await asyncio.sleep(1) # Simulate a network call\n    print(\"...PyCom!\")\n\nasync def main():\n    # Run two 'say_hello' tasks concurrently\n    await asyncio.gather(\n        say_hello(),\n        say_hello()\n    )\n\nasyncio.run(main())`\n\nThis will print \"Hello...\" twice, wait for one second, and then print \"...PyCom!\" twice. Both tasks run concurrently, not one after the other. This paradigm is the backbone of modern, high-performance Python frameworks like FastAPI and is essential for building applications that handle many simultaneous connections efficiently.\n\n---\n\n**Building a High-Concurrency Web App?**\n\nAsynchronous code needs a professional presentation layer. **Modern Business Network** can build a fast, responsive frontend that takes full advantage of your asyncio-powered backend. Mention PyCom to get a 20% discount on their top-tier web development services. [Build your app.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-07-22",
        imageUrl: "https://images.unsplash.com/photo-1521185496955-15097b20c5fe?q=80&w=1950&auto=format&fit=crop",
        tags: ["Python", "asyncio", "Advanced", "Performance"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 17,
        title: "Getting Started with Pytest for Better Code",
        summary: "Move beyond 'print' debugging and learn how to write clean, effective tests for your code using the powerful and popular Pytest framework.",
        content: "Writing tests is a critical part of software development. It ensures your code works as expected, prevents regressions when you make changes, and serves as documentation. While Python has a built-in `unittest` module, the community has largely embraced `pytest` for its simplicity and powerful features.\n\nWith pytest, you write tests as simple functions. There's no need for complex class structures. Just name your test file `test_*.py` or `*_test.py` and your test functions `test_*`. Pytest will automatically discover and run them.\n\nLet's say you have a function to test:\n`# my_app/logic.py\ndef add(a, b):\n    return a + b`\n\nYour test file would look like this:\n`# tests/test_logic.py\nfrom my_app.logic import add\n\ndef test_add():\n    assert add(2, 3) == 5\n    assert add(-1, 1) == 0`\n\nTo run the tests, you simply navigate to your project's root directory in the terminal and type `pytest`. Pytest's powerful `assert` statement provides detailed output when a test fails. It also has an extensive ecosystem of plugins for things like code coverage, parallel testing, and integration with frameworks like Django and Flask. Adopting pytest will dramatically improve your code's quality and your confidence as a developer.\n\n---\n\n**Need to Deploy Your Well-Tested App?**\n\nOnce your application is thoroughly tested, it's ready for the world. **AI Cloud Host** provides a secure and reliable platform for deploying your production-ready Python applications. Ensure your hard work is supported by great infrastructure. New users get $100 in free credits!",
        author: "Billy Jay",
        date: "2025-07-20",
        imageUrl: "https://images.unsplash.com/photo-1599619351208-3e6c8485b5c1?q=80&w=1964&auto=format&fit=crop",
        tags: ["Python", "Testing", "Pytest", "Best Practices"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 18,
        title: "Leveraging `collections` for Efficient Code",
        summary: "Go beyond standard lists and dictionaries. Explore Python's `collections` module to discover specialized data structures that can make your code cleaner and more performant.",
        content: "Python's standard library is full of gems, and the `collections` module is a prime example. It provides high-performance container datatypes that are powerful alternatives to the general-purpose `list`, `dict`, `set`, and `tuple`.\n\nHere are a few of its most useful tools:\n\n-   `Counter`: A subclass of `dict` for counting hashable objects. It's perfect for tallying items in a list. `Counter(['a', 'b', 'a'])` returns a Counter object that looks like `{'a': 2, 'b': 1}`.\n\n-   `defaultdict`: Another `dict` subclass that calls a factory function to supply missing values. This eliminates the need to check if a key exists before accessing it. `dd = defaultdict(int)` means if you access a non-existent key, it will be created with a default value of `0`.\n\n-   `deque`: Pronounced 'deck', it stands for double-ended queue. It's like a list but provides fast O(1) appends and pops from both the left and right sides, making it ideal for implementing queues and stacks.\n\n-   `namedtuple`: A factory function for creating tuple subclasses with named fields. It makes your code more readable by allowing you to access elements by name instead of index: `point.x` instead of `point[0]`.\n\nUsing these specialized tools can often simplify your logic, reduce bugs, and even improve performance. Exploring the `collections` module is a great way to level up your Python skills.\n\n---\n\n**Need a Custom Web Solution?**\n\nEfficient code is the engine, but a great website is the vehicle. If you're building a project that needs a professional user interface, our partner **Modern Business Network** can help. They offer a 20% discount on web development for PyCom members. [Build your vision.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-07-19",
        imageUrl: "https://images.unsplash.com/photo-1589254065909-b7086229d092?q=80&w=1974&auto=format&fit=crop",
        tags: ["Python", "Standard Library", "collections", "Data Structures"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 19,
        title: "An Introduction to FastAPI for High-Performance APIs",
        summary: "Discover FastAPI, the modern, high-performance web framework for building APIs with Python, based on standard type hints.",
        content: "FastAPI is a relatively new but incredibly popular Python web framework designed specifically for building APIs. Its key features are speed and developer experience. It's built on top of Starlette (for web parts) and Pydantic (for data parts), and it leverages modern Python features like `asyncio` and type hints to deliver incredible performance, on par with NodeJS and Go.\n\nOne of its most beloved features is the automatic, interactive API documentation. By using standard Python type hints in your code, FastAPI automatically generates a user interface (using Swagger UI and ReDoc) where you can explore and test your API endpoints directly from the browser.\n\nHere's a minimal FastAPI app:\n`from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.post(\"/items/\")\nasync def create_item(item: Item):\n    return {\"item_name\": item.name, \"item_price\": item.price}`\n\nThis simple code defines a data model with Pydantic and creates a POST endpoint. FastAPI handles request validation, data serialization, and documentation automatically. If you're building a microservice or the backend for a modern web application, FastAPI is an outstanding choice that will make you more productive and your application faster.\n\n---\n\n**Ready to Deploy Your Blazing-Fast API?**\n\nYour high-performance FastAPI application deserves hosting that won't be a bottleneck. **AI Cloud Host** provides the scalable infrastructure you need to handle massive traffic. Deploy your API today and take advantage of $100 in free credits for new users.",
        author: "Billy Jay",
        date: "2025-07-17",
        imageUrl: "https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "FastAPI", "Web Development", "API", "asyncio"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 20,
        title: "How Python is Shaping the Future of AI",
        summary: "Explore why Python has become the undisputed language of artificial intelligence, machine learning, and data science.",
        content: "When it comes to Artificial Intelligence, one language reigns supreme: Python. But why has it become the go-to choice for researchers, data scientists, and ML engineers around the world?\n\nFirst, Python's syntax is simple, clean, and readable. This allows developers to focus on solving complex AI problems rather than getting bogged down in complicated language rules. It promotes rapid prototyping and experimentation, which is crucial in the fast-moving field of AI research.\n\nSecond, Python boasts an unparalleled ecosystem of libraries and frameworks. Powerful tools like NumPy for numerical computation, Pandas for data manipulation, and Scikit-learn for classical machine learning provide the essential building blocks. For deep learning, frameworks like TensorFlow and PyTorch offer flexible and high-performance environments for building and training neural networks. The Hugging Face Transformers library has democratized access to state-of-the-art NLP models.\n\nThird, Python has a massive and active community. This means extensive documentation, countless tutorials, and a support network ready to help with any problem. This strong community ensures the ecosystem continues to grow and evolve.\n\nFrom academic research to production systems at major tech companies, Python provides the tools, flexibility, and community support that has made it the engine of the AI revolution. Its dominance shows no signs of slowing down.\n\n---\n\n**Want to Build Your Own AI-Powered App?**\n\nIf you have an idea for an AI application, we can help bring it to life. Our partner, **Modern Business Network**, specializes in developing custom AI solutions and web applications. Mention PyCom to receive a 20% discount and start building the future today! [Get a quote.](https://modernbusinessnetwork.com/)",
        author: "Billy Jay",
        date: "2025-07-15",
        imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop",
        tags: ["Python", "AI", "Machine Learning", "Data Science", "Future"],
        readTime: "2 min read",
        wordCount: 300
    },
    {
        id: 21,
        title: "Mastering Python Decorators: 3 Real-World Patterns",
        summary: "Go beyond the basics. Learn how to implement robust logging, access control, and caching mechanisms using Python decorators.",
        content: "We've covered the basics of decorators, but how are they used in production? Here are three common patterns that every Python developer should know.\n\n**1. The Logging Decorator**\nInstead of adding print statements everywhere, wrap your functions to log their execution automatically.\n\n`import functools\nimport logging\n\ndef log_execution(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        logging.info(f\"Executing {func.__name__}\")\n        result = func(*args, **kwargs)\n        logging.info(f\"Finished {func.__name__}\")\n        return result\n    return wrapper`\n\n**2. Access Control (Authentication)**\nIn web frameworks like Flask or Django, decorators are often used to check if a user is logged in before running a view function.\n\n`def require_admin(func):\n    @functools.wraps(func)\n    def wrapper(user, *args, **kwargs):\n        if not user.is_admin:\n            raise PermissionError(\"User is not an admin\")\n        return func(user, *args, **kwargs)\n    return wrapper`\n\n**3. Caching (Memoization)**\nDecorators can cache the results of expensive function calls so they don't need to be recomputed.\n\n`def cache_result(func):\n    cache = {}\n    @functools.wraps(func)\n    def wrapper(*args):\n        if args in cache:\n            return cache[args]\n        result = func(*args)\n        cache[args] = result\n        return result\n    return wrapper`\n\nThese patterns demonstrate the true power of decorators: separating concerns and keeping your core logic clean and focused.\n\n---\n\n**Ready to Scale Your Application?**\n\nImplementing these patterns is a great step towards professional-grade software. To ensure your application runs smoothly at scale, rely on **AI Cloud Host**. Their optimized infrastructure is perfect for Python applications utilizing advanced patterns. New users get $100 in free credits!",
        author: "Billy Jay",
        date: "2025-08-21",
        imageUrl: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=2070&auto=format&fit=crop",
        tags: ["Python", "Decorators", "Patterns", "Advanced"],
        readTime: "3 min read",
        wordCount: 450
    }
];

export const GAME_CATEGORIES: GameCategory[] = [
    {
        id: 'basics',
        title: 'Python Basics',
        description: 'Master the fundamentals: variables, loops, and functions.',
        topics: [
            { id: 'invaders', title: 'Indentation Invaders', description: 'Fix indentation errors.', gameType: 'quiz', questions: [] },
            { id: 'frenzy', title: 'Function Frenzy', description: 'Predict function outputs.', gameType: 'quiz', questions: [] },
            { id: 'dilemma', title: 'Data Structure Dilemma', description: 'Choose the right data structure.', gameType: 'quiz', questions: [] },
        ]
    },
    {
        id: 'advanced',
        title: 'Advanced Concepts',
        description: 'Level up with OOP, decorators, and error handling.',
        topics: [
            { id: 'fortress', title: 'OOP Fortress', description: 'Build classes and objects.', gameType: 'quiz', questions: [] },
            { id: 'crafter', title: 'Comprehension Crafter', description: 'Write pythonic list comprehensions.', gameType: 'quiz', questions: [] },
            { id: 'escapist', title: 'Exception Escapist', description: 'Handle errors gracefully.', gameType: 'quiz', questions: [] },
        ]
    },
    {
        id: 'web',
        title: 'Web Development',
        description: 'Learn Flask, Django, and API concepts.',
        topics: [
            { id: 'fury', title: 'Framework Fury', description: 'Django vs Flask quiz.', gameType: 'quiz', questions: [] },
        ]
    },
    {
        id: 'tools',
        title: 'Tools & Debugging',
        description: 'Master Regex, Git, and Debugging.',
        topics: [
            { id: 'debugger', title: 'Code Debugger', description: 'Find and fix bugs.', gameType: 'quiz', questions: [] },
            { id: 'raptor', title: 'Regex Raptor', description: 'Match patterns with Regex.', gameType: 'quiz', questions: [] },
        ]
    },
    {
        id: 'aiml',
        title: 'AI & Machine Learning',
        description: 'Explore the world of AI models and pipelines.',
        topics: [
            { id: 'hf-quest', title: 'Hugging Face Quest', description: 'Learn the HF ecosystem.', gameType: 'quiz', questions: [] },
        ]
    }
];

export const COURSES_DATA: Course[] = [
    {
        title: "Python for Absolute Beginners",
        description: "Start your coding journey here. No prior experience required. Learn variables, loops, and logic.",
        level: "Beginner",
        duration: "4 Weeks",
        isAiPowered: true
    },
    {
        title: "Data Science with Pandas",
        description: "Master data manipulation and analysis. Learn to clean, process, and visualize complex datasets.",
        level: "Intermediate",
        duration: "6 Weeks",
        isAiPowered: true
    },
    {
        title: "Machine Learning A-Z",
        description: "Build predictive models using Scikit-Learn. Understand regression, classification, and clustering.",
        level: "Advanced",
        duration: "8 Weeks",
        isAiPowered: false
    },
    {
        title: "Django Web Development",
        description: "Build robust, scalable web applications with Python's most popular web framework.",
        level: "Intermediate",
        duration: "6 Weeks",
        isAiPowered: true
    }
];

export const AD_PRICING: AdPricing[] = [
    {
        type: "Top Banner",
        description: "Premium 728x90 placement at the top of all pages. High visibility.",
        inr: "15,000",
        usd: "200",
        eur: "185"
    },
    {
        type: "Sidebar Ad",
        description: "300x250 placement on blog and resource pages. Targeted engagement.",
        inr: "8,000",
        usd: "100",
        eur: "95"
    },
    {
        type: "Newsletter Feature",
        description: "Dedicated slot in our weekly newsletter sent to 10k+ subscribers.",
        inr: "5,000",
        usd: "60",
        eur: "55"
    }
];

export const SPONSORSHIP_DATA: Sponsorship = {
    title: "Sponsor a Hackathon",
    description: "Partner with us to host a community hackathon. Gain massive brand exposure, access top talent, and support innovation.",
    cta: "Become a Sponsor"
};

export const OFFERS_DATA: PartnerOffer[] = [
    {
        partner: "AI Cloud Host",
        title: "$100 Free Credits",
        description: "Deploy your Python apps with ease. Reliable, scalable, and developer-friendly.",
        cta: "Claim Offer"
    },
    {
        partner: "Modern Business Network",
        title: "20% Off Web Dev Services",
        description: "Need a professional website? Get expert design and development at a discount.",
        cta: "Get Quote"
    }
];

export const LEADS_DATA: { [key: string]: Lead[] } = {
    'billy': [
        { id: 'l1', name: 'Sarah Jenkins', company: 'EduTech Innovations', email: 'sarah.j@edutech.com', linkedin: 'linkedin.com/in/sarahj', status: 'Research', priority: 'High' },
        { id: 'l2', name: 'Michael Ross', company: 'Global Learning Systems', email: 'mross@gls.org', linkedin: 'linkedin.com/in/mross', status: 'Outreach', priority: 'Medium' },
        { id: 'l3', name: 'David Chen', company: 'Future Code Academy', email: 'david@futurecode.io', linkedin: 'linkedin.com/in/davidchen', status: 'Identify', priority: 'Low' },
        { id: 'l4', name: 'Emily White', company: 'SkillUp Corp', email: 'emily.w@skillup.com', linkedin: 'linkedin.com/in/emilyw', status: 'Pipeline', priority: 'High' },
        { id: 'l5', name: 'Robert Brown', company: 'TechStream Solutions', email: 'rbrown@techstream.net', linkedin: 'linkedin.com/in/rbrown', status: 'Formatting', priority: 'Medium' },
    ],
    'jeyabal': [
        { id: 'j1', name: 'Venture Capital A', company: 'Sequoia Capital', email: 'partners@sequoia.com', linkedin: 'linkedin.com/company/sequoia', status: 'Research', priority: 'High' },
        { id: 'j2', name: 'Angel Investor B', company: 'Private Office', email: 'invest@private.com', linkedin: 'linkedin.com/in/investor', status: 'Identify', priority: 'Medium' },
    ]
};