import {
  Activity,
  BriefcaseBusiness,
  Cable,
  Code2,
  Database,
  FileText,
  GitBranch,
  Github,
  Layers3,
  Mail,
  Network,
  ServerCog,
  ShieldCheck,
  Terminal,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Project = {
  title: string;
  eyebrow: string;
  summary: string;
  problem: string;
  impact: string;
  stack: string[];
  accent: "cyan" | "emerald" | "amber" | "blue";
  bullets: string[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  stack: string[];
  bullets: string[];
};

export type SkillGroup = {
  title: string;
  icon: LucideIcon;
  items: string[];
};

export const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Stack", href: "#stack" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { value: "3+", label: "Years building backend systems" },
  { value: "10+", label: "Production and client projects" },
  { value: "Go", label: "Primary backend language" },
];

export const systemNodes = [
  {
    title: "Client",
    description: "Mobile and web apps start the request.",
    icon: Terminal,
  },
  {
    title: "API Gateway",
    description: "Routes traffic, enriches requests, and applies middleware.",
    icon: Network,
  },
  {
    title: "Services",
    description: "Domain logic for HR, parking, assets, and operations.",
    icon: ServerCog,
  },
  {
    title: "Transactions",
    description: "Multi-step workflows stay consistent and retry-safe.",
    icon: ShieldCheck,
  },
  {
    title: "Cache",
    description: "Redis reduces repeated calls and improves response paths.",
    icon: Cable,
  },
  {
    title: "Observability",
    description: "Logs and metrics make production behavior visible.",
    icon: Activity,
  },
];

export const projects: Project[] = [
  {
    title: "NATA HR",
    eyebrow: "HRIS platform",
    summary:
      "Core backend services for a SaaS HRIS platform covering employee management, attendance, payroll, approvals, and mobile operations.",
    problem:
      "Payroll and attendance workflows can fail halfway or silently duplicate when consistency is not designed in from the start.",
    impact:
      "Applied transactions, idempotent processing, Redis caching, background workers, custom API Gateway, and full observability across services.",
    stack: ["Go", "PostgreSQL", "Redis", "Microservices", "Grafana", "Loki", "Prometheus"],
    accent: "cyan",
    bullets: [
    "Engineered core backend services for a SaaS-based HRIS platform using Go, PostgreSQL, Redis, and microservice architecture.",
    "Built Master Service as the single source of truth for authentication, company configuration, employee records, and payroll reference data.",
    "Built Transaction Service covering employee attendance, payroll processing, leave, overtime, work permit, and approval workflows.",
    "Developed a custom API Gateway from scratch in Go — implementing authentication middleware, request routing, identity enrichment (injecting User ID, Company ID, Employee ID into upstream requests), HMAC-based inter-service request signing, per-IP rate limiting, circuit breaker for upstream resilience, CORS, request ID propagation, and centralized logging.",
    "Designed and implemented a payroll calculation engine supporting formula-based component definitions, dependency resolution, multi-mode PPh21 tax calculation (GROSS, NET gross-up, TAX_BORNE) using TER rates per PMK 168/2023, and full audit snapshot of formula context per employee per cycle.",
    "Built an attendance interface process that converts raw daily attendance records into structured payroll-ready metrics — working days, absences, overtime, tardiness, and productive hours — with holiday-aware and schedule-aware day classification.",
    "Implemented transactional guarantees and idempotent upsert patterns across payroll and attendance workflows to prevent partial updates and duplicate data on re-runs.",
    "Delivered async background processing for payroll jobs using goroutine-based workers, with real-time process status tracking, per-employee error reporting, and progress visibility.",
    "Implemented full observability stack using Grafana, Loki, Alloy, and Prometheus — enabling centralized structured logs, service metrics, and correlation ID-based request tracing across all backend services.",
    "Maintained consistent clean architecture patterns across services: layered separation (domain → application → infrastructure → presentation), company-scoped data isolation, soft delete, Swagger documentation, and Docker-based deployment templates.",
  ],
  },
  {
    title: "MyNusapala",
    eyebrow: "Parking membership",
    summary:
      "Mobile APIs for parking memberships, transactions, user profiles, payments, and location-based data synchronization.",
    problem:
      "A Laravel-heavy flow needed faster APIs, clearer service boundaries, and reliable payment provider integration.",
    impact:
      "Refactored services into Go, integrated Xendit and Midtrans, and built bridge-based synchronization by location ID across multiple Laravel APIs.",
    stack: ["Go", "MySQL", "Laravel", "Xendit", "Midtrans", "GoPay"],
    accent: "emerald",
    bullets: [
      "Developed and optimized Go-based mobile APIs for a parking membership application, supporting membership packages, parking transactions, user profiles, and mobile app operations.",
      "Integrated Xendit and Midtrans payment services to support membership payments and GoPay account linking.",
      "Implemented bridge-based data synchronization to route requests by location ID to multiple Laravel APIs and sync parking location data into the local database.",
      "Refactored backend services from Laravel to Go, improving API performance, response time, and maintainability by restructuring API logic and database access.",
    ],
  },
  {
    title: "NATA Asset",
    eyebrow: "Asset management",
    summary:
      "Internal asset tracking backend for inventory workflows, asset registration, and reliable operational data management.",
    problem:
      "Asset lifecycle data needed structured tracking without duplication or drift across registration, assignment, and status updates.",
    impact:
      "Built Go service with PostgreSQL covering asset CRUD, inventory status tracking, and data integrity across team workflows.",
    stack: ["Go", "PostgreSQL", "REST API", "Docker"],
    accent: "blue",
    bullets: [
      "Built Go-based backend services for an Asset Management System using PostgreSQL, supporting asset tracking, inventory workflows, and reliable data management.",
    ],
  },
  {
    title: "Jangum",
    eyebrow: "Mobile backend",
    summary:
      "Backend APIs for a mobile application supporting general operational features and mobile-first user flows.",
    problem:
      "Mobile app needed stable, organized API endpoints covering operational logic without coupling to frontend implementation details.",
    impact:
      "Built Go backend with MySQL, structured API endpoints for mobile consumption, and delivered Swagger documentation for integration.",
    stack: ["Go", "MySQL", "REST API", "Swagger"],
    accent: "amber",
    bullets: [
      "Built backend APIs for the mobile application using Go and MySQL.",
      "Developed API endpoints to support general operational features and mobile integration.",
    ],
  },
  {
    title: "SEZ Solution",
    eyebrow: "Distributed operations",
    summary:
      "Microservice-based goods inflow and outflow system used by internal teams and external vendors.",
    problem:
      "Admin and vendor applications needed reliable communication across distributed service boundaries.",
    impact:
      "Contributed to microservice architecture and gained hands-on Kafka experience for inter-service communication across admin and client applications.",
    stack: ["Go", "Kafka", "Microservices", "REST API", "PostgreSQL"],
    accent: "cyan",
    bullets: [
      "Developed a microservice-based application for managing company goods inflow and outflow, used by both internal teams and vendors.",
      "Contributed to the distributed architecture, gaining practical experience with Kafka for inter-service communication across its microservices for admin and client applications.",
    ],
  },
  {
    title: "Tawada Budget Control",
    eyebrow: "Approval workflows",
    summary:
      "Internal request and budget control application for 1,000+ employees across operational divisions.",
    problem:
      "Submission requests, divisional approvals, ERP synchronization, and scheduled jobs had to stay organized and auditable at scale.",
    impact:
      "Built divisional approval routing, Epicor ERP synchronization, and cron-based scheduling for budget control across the full organization.",
    stack: ["Go", "Cron Jobs", "Epicor", "Approval Flow", "SQL"],
    accent: "emerald",
    bullets: [
      "Developed the backend for internal request and budget control application, designed to streamline processes for 1,000+ employees in creating various submission requests.",
      "Implemented a budget control system with divisional approval workflows and integrated with Epicor for data synchronization.",
      "Managed scheduled tasks and background processes using cron jobs to ensure efficient operations.",
    ],
  },
  {
    title: "Warehouse Management",
    eyebrow: "WMS + RFID",
    summary:
      "Warehouse Management System for tracking inbound and outbound goods shipments with RFID-based stock opname.",
    problem:
      "Manual stock tracking created discrepancies between physical inventory and system records, especially during stock opname.",
    impact:
      "Built WMS backend for goods shipment tracking and implemented RFID-based stock opname to automate and validate physical inventory counts.",
    stack: ["Go", "PostgreSQL", "RFID", "REST API"],
    accent: "blue",
    bullets: [
      "Developed a Warehouse Management System to manage inbound and outbound goods shipments.",
      "Implemented stock opname using RFID technology.",
    ],
  },
  {
    title: "Tawada Compro",
    eyebrow: "Company profile",
    summary:
      "Company profile website for Tawada with a built-in Content Management System for non-technical content management.",
    problem:
      "Client needed a public-facing digital presence where admins could update content independently without developer involvement.",
    impact:
      "Built company profile backend with CMS using GORM, enabling structured content management and consistent public-facing data delivery.",
    stack: ["Go", "PostgreSQL", "GORM", "CMS", "REST API"],
    accent: "amber",
    bullets: [
      "Developed a company profile website, including its Content Management System (CMS) and frontend interface.",
    ],
  },
  {
    title: "Conference Tool",
    eyebrow: "Event management",
    summary:
      "Backend for a conference management platform handling attendee data, session organization, and authentication.",
    problem:
      "Conference platform needed structured attendee and session management with secure auth — without standing up a full custom backend server.",
    impact:
      "Built Next.js API routes with Drizzle ORM for the data layer and Supertokens for authentication — fully typed, deployed as serverless functions.",
    stack: ["Next.js", "Drizzle ORM", "Supertokens", "TypeScript"],
    accent: "cyan",
    bullets: [
      "Built the backend for a Conference Management system using Next.js (API routes), Drizzle ORM, and Supertokens.",
    ],
  },
  {
    title: "Ilya Tours",
    eyebrow: "Travel operations",
    summary:
      "Backend for international travel operations — booking management, automated room assignment, and logistics coordination.",
    problem:
      "Travel workflow automation needed reliable customer-to-room assignment logic and structured management of complex, multi-step logistics.",
    impact:
      "Built comprehensive backend covering booking flows, automated room assignment, and travel logistics management for international tour operations.",
    stack: ["Go", "PostgreSQL", "REST API", "Laravel"],
    accent: "emerald",
    bullets: [
      "Developed a Travel Operations Management System for international travel.",
      "Engineered comprehensive backend functionalities, including automated customer to room assignments and streamlined management of travel logistics.",
    ],
  },
  {
    title: "Singgalang HS",
    eyebrow: "RFID inventory",
    summary:
      "RFID-based inventory management for a gold store — tracking stock in and out via hardware integration.",
    problem:
      "Gold store needed real-time, accurate stock tracking with RFID scanner integration and auditable inventory counts.",
    impact:
      "Maintained and extended the inventory backend with Go modules alongside Laravel for performance-critical RFID tracking paths.",
    stack: ["Go", "Laravel", "MySQL", "RFID"],
    accent: "blue",
    bullets: [
      "Maintained and supported an RFID Inventory Management app to manage the stock of a gold store.",
      "The backend primarily utilized Laravel, with Go implemented for specific modules to enhance performance.",
    ],
  },
  {
    title: "Endermo Compro",
    eyebrow: "Company profile",
    summary:
      "Company profile backend for a client platform, delivering structured content APIs and a built-in CMS.",
    problem:
      "Content needed to be manageable by non-technical admins while staying consistently structured for frontend consumption.",
    impact:
      "Built company profile backend with CMS using GORM, with clean separation between admin operations and public-facing data endpoints.",
    stack: ["Go", "PostgreSQL", "GORM", "CMS", "REST API"],
    accent: "amber",
    bullets: [
      "Developed a company profile website, including its Content Management System (CMS) and frontend interface, utilizing GORM for database interactions.",
    ],
  },
];

export const experiences: Experience[] = [
  {
    company: "PT Nusapala Berkah Autonomous",
    role: "Backend Developer",
    period: "Jul 2025 – Present",
    location: "Jakarta, Indonesia",
    summary:
      "Design and develop scalable Go backend services for HRIS and parking platforms. Own the full backend lifecycle from FSD translation to API design, transactions, unit tests, Swagger docs, and Docker-based project templates.",
    stack: ["Go", "PostgreSQL", "MySQL", "Redis", "Docker", "Grafana", "Loki", "Prometheus"],
    bullets: [
      "Design, develop, and maintain scalable backend systems using Go with MySQL and PostgreSQL.",
      "Translate Functional Specification Documents (FSD) into backend implementation: API design, service logic, database workflows, and integration requirements.",
      "Implement database transactions across multi-step business workflows to maintain data consistency and prevent partial updates.",
      "Implement unit tests, Swagger API documentation, and reusable backend patterns to improve code quality, maintainability, and API integration.",
      "Handle thousands of backend requests by optimizing API performance, database queries, and service reliability.",
      "Create and maintain reusable Go project templates with Docker and Docker Compose configurations to standardize project structure, middleware, routing, Swagger, and testing setup.",
      "Collaborate with Frontend Engineers, System Analysts, DevOps, and UI/UX Designers to deliver backend features aligned with requirements and usability.",
      "Mentor team members in Go development through code reviews, technical guidance, and backend best practice sharing.",
      "Debug and resolve backend issues by analyzing logs, API behavior, and database queries.",
    ],
  },
  {
    company: "PT Padjadjaran Teknologi Informasi (PLABS.ID)",
    role: "Software Engineer",
    period: "Feb 2024 – May 2025",
    location: "Bandung, Indonesia",
    summary:
      "Built and maintained backend systems across MySQL, PostgreSQL, SQL Server, and Oracle. Delivered FCM integrations, GCS file storage, goroutine-based background jobs, Redis caching, and query optimization across multiple client projects.",
    stack: ["Go", "PostgreSQL", "MySQL", "SQL Server", "Oracle", "Redis", "FCM", "GCS"],
    bullets: [
      "Designed, developed, and maintained backend systems using multiple database technologies: MySQL, PostgreSQL, Microsoft SQL Server, and Oracle.",
      "Integrated third-party services including Firebase Cloud Messaging (FCM) and Google Cloud Storage (GCS).",
      "Implemented cron jobs and goroutine-based concurrency in Go.",
      "Optimized database performance through schema design, query tuning, and implementing caching solutions with Redis.",
      "Collaborated with Project Managers (requirements), Frontend teams (API integration), DevOps (deployment pipelines), and UI/UX designers (system usability).",
      "Utilized Lark for daily task management and project tracking.",
    ],
  },
  {
    company: "PT Padjadjaran Teknologi Informasi (PLABS.ID)",
    role: "Junior Software Engineer",
    period: "Sep 2023 – Feb 2024",
    location: "Bandung, Indonesia",
    summary:
      "Developed Go backend systems with PostgreSQL, managed sprint deliverables with Jira, conducted code reviews, and mentored vocational high school interns from zero to functional CRUD APIs with JWT authentication within 3 months.",
    stack: ["Go", "PostgreSQL", "REST API", "Jira", "JWT"],
    bullets: [
      "Developed backend systems using Go and PostgreSQL, including database design and REST API implementation.",
      "Managed development tasks and sprint deliverables using Jira in an Agile environment.",
      "Contributed to code reviews and maintained technical documentation.",
      "Mentored vocational high school interns in backend development from scratch using Go and PostgreSQL, guiding them to build functional CRUD APIs with JWT authentication within 3 months.",
      "Continuously improved backend systems through active learning of performance optimization techniques.",
    ],
  },
  {
    company: "PT Padjadjaran Teknologi Informasi (PLABS.ID)",
    role: "Software Engineer Intern",
    period: "May 2023 – Sep 2023",
    location: "Bandung, Indonesia",
    summary:
      "Learned Go backend development from scratch and built a strong foundation in database concepts, API design, debugging, and code optimization through hands-on project work.",
    stack: ["Go", "PostgreSQL", "REST API", "Git", "Laravel"],
    bullets: [
      "Delved deep into Go, learning its intricacies for backend development.",
      "Gained a strong foundation in database concepts and their application in backend systems.",
      "Strengthened backend development fundamentals through hands-on experience in API development, database design, debugging, and code optimization.",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Backend Mindset",
    icon: Workflow,
    items: ["Go", "REST API", "Microservices", "API Gateway", "Transactions"],
  },
  {
    title: "Data Layer",
    icon: Database,
    items: ["PostgreSQL", "MySQL", "SQL Server", "Oracle", "MongoDB", "Redis"],
  },
  {
    title: "Delivery",
    icon: GitBranch,
    items: ["Git", "GitHub", "GitLab", "Docker", "Docker Compose", "CI/CD"],
  },
  {
    title: "Observability",
    icon: Activity,
    items: ["Grafana", "Loki", "Alloy", "Prometheus", "Structured Logs"],
  },
  {
    title: "Collaboration",
    icon: BriefcaseBusiness,
    items: ["Swagger", "Postman", "Jira", "Lark", "Code Review"],
  },
];

export const notes = [
  {
    title: "Idempotency in payroll workflows",
    description:
      "How retry-safe operations reduce duplicate processing when business flows span multiple steps.",
    icon: ShieldCheck,
  },
  {
    title: "Caching without hiding the truth",
    description:
      "Using Redis to reduce repeated calls while keeping source-of-truth data boundaries understandable.",
    icon: Layers3,
  },
  {
    title: "Making production visible",
    description:
      "A practical look at logs, metrics, correlation IDs, and the debugging path after release.",
    icon: FileText,
  },
  {
    title: "Unit testing Go services",
    description:
      "A minimal approach to writing Go tests that verify real behavior without over-engineering the test suite.",
    icon: Code2,
  },
];

export const contactLinks = [
  { label: "Email", value: "anggaragera@gmail.com", href: "mailto:anggaragera@gmail.com", icon: Mail },
  { label: "LinkedIn", value: "gera-anggara-putra", href: "https://linkedin.com/in/gera-anggara-putra", icon: Network },
  { label: "GitHub", value: "GeraAnggaraPutra", href: "https://github.com/GeraAnggaraPutra", icon: Github },
];
