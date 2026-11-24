import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  ClipboardCheck,
  Database,
  Fingerprint,
  FileText,
  GitBranch,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { ProjectLinks } from "@/components/project-links";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "UNARA People — Backend Case Study",
  description:
    "How I built UNARA People's Go HRIS backend: multi-company approvals, offline attendance, patrol, payroll, performance workers, reporting, and observability.",
};

const project = projects[0];

const caseSections = [
  ["Architecture", "architecture-title"],
  ["Approvals", "approvals-title"],
  ["Attendance", "attendance-title"],
  ["Patrol", "patrol-title"],
  ["Performance", "performance-title"],
  ["Payroll", "payroll-title"],
  ["Report", "report-title"],
  ["Decisions", "decisions-title"],
  ["Reliability", "integrity-title"],
] as const;

const services = [
  {
    number: "01",
    title: "API Gateway",
    icon: ShieldCheck,
    purpose: "Trust and traffic",
    detail:
      "A Go reverse proxy routes requests by longest prefix, validates sessions through Master Service, checks menu permissions, and signs requests sent upstream.",
  },
  {
    number: "02",
    title: "Master Service",
    icon: Database,
    purpose: "Rules and reference data",
    detail:
      "The source of truth for companies, employees and dated career transitions, organization, shifts, approval flows, payroll definitions, patrol setup, and leave balances.",
  },
  {
    number: "03",
    title: "Transaction Service",
    icon: ScanLine,
    purpose: "Transactional workflows",
    detail:
      "Runs attendance, leave, WFH, overtime, work permit and correction requests, approvals, patrol, payroll, and performance calculation using Master Service rules.",
  },
  {
    number: "04",
    title: "Report Service",
    icon: FileText,
    purpose: "Read models and documents",
    detail:
      "Stores performance results and published payslip snapshots in its own database. Serves dashboards, reports, and payslip documents.",
  },
  {
    number: "05",
    title: "Observability",
    icon: Activity,
    purpose: "Operational evidence",
    detail:
      "Prometheus metrics, Grafana dashboards, Loki logs, Alloy collection, and alerts support investigation across the services.",
  },
];

const approvalSteps = [
  {
    number: "01",
    title: "Configure the route",
    detail: "Master Service defines approval levels, eligible approvers, and scope. Transaction Service resolves the applicable flow when a request is submitted.",
  },
  {
    number: "02",
    title: "Submit the request",
    detail: "Employees can draft and submit leave, overtime, WFH, work permit, or attendance correction requests. Transaction Service stores the request and its approval steps.",
  },
  {
    number: "03",
    title: "Act at the right level",
    detail: "The approver is checked against the request's assigned step. Approve, reject, and revision actions move the request through its lifecycle; supported approval lists also offer batch actions.",
  },
  {
    number: "04",
    title: "Apply the outcome",
    detail: "For leave, submission holds balance, final approval commits it and updates eligible attendance days, while rejection or cancellation releases it. The next approver or employee is notified as appropriate.",
  },
];

const patrolSteps = [
  {
    number: "01",
    title: "Define the round",
    detail:
      "Master Service owns areas, asset checklists, QR codes, shift assignments, eligible employees, and location rules. Transaction Service takes a snapshot for the active round.",
  },
  {
    number: "02",
    title: "Inspect in the field",
    detail:
      "The mobile flow shows area progress, validates QR scans, and records checklists, location attempts, photos, found items, and notes. An area can be inspected more than once; its latest inspection drives the visible status.",
  },
  {
    number: "03",
    title: "Complete and reconcile",
    detail:
      "An offline package contains the authorized round snapshot. Sync validates ownership, shift time, package expiry, and QR membership; an idempotency key prevents duplicate inspections on retries.",
  },
];

const attendanceSteps = [
  {
    number: "01",
    title: "Resolve the working context",
    detail:
      "Master Service supplies the employee's current shift, schedule changes, OFF day, geolocation, and flexible-location rules before a clock action is evaluated.",
  },
  {
    number: "02",
    title: "Clock in, online or offline",
    detail:
      "The normal clock flow validates time and location. For a lost connection, the app can record an event with its capture time using a scoped offline token and a signed event payload.",
  },
  {
    number: "03",
    title: "Sync without double counting",
    detail:
      "On reconnect, Transaction Service checks the token, signature, event age, and employee identity; deduplicates the client event ID; then runs the shared clock processing path and keeps both capture and receipt times.",
  },
];

const performanceSteps = [
  {
    number: "01",
    title: "Capture changes",
    detail: "Master Service publishes employee changes through an outbox into Transaction Service's persistent inbox. Daily background sync keeps periods current; attendance and assignment changes also schedule recalculation.",
  },
  {
    number: "02",
    title: "Coalesce and calculate",
    detail: "One database job per employee and period merges repeated changes by date range and requested version. Workers claim batches with SKIP LOCKED, calculate attendance, discipline, absence, corrections, overtime, and early arrivals, then record results or failures.",
  },
  {
    number: "03",
    title: "Publish a versioned result",
    detail: "A single SQL statement saves each result and its delivery outbox entry. The dispatcher sends batches to Report Service through an internal API; Report accepts newer versions for dashboards and summaries. Queue and delivery metrics reveal backlog and failures.",
  },
];

const reportCapabilities = [
  {
    number: "01",
    title: "Performance read model",
    detail: "Transaction Service calculates and sends performance results. Report Service stores newer result versions in its own database, then serves summaries, dashboards, performance and attendance detail, and dashboard export without recalculating performance.",
  },
  {
    number: "02",
    title: "Payslip documents",
    detail: "A Transaction Service outbox publishes payslip snapshots and components through an internal API. Report Service saves them, then its document worker claims available work, builds a PDF, uploads it through the storage integration, updates its status and path, and triggers a notification.",
  },
  {
    number: "03",
    title: "Reports across boundaries",
    detail: "Overtime reporting combines employee and rule context from Master Service with overtime source data from Transaction Service through service APIs, without reading either service's database directly.",
  },
];

const payrollSteps = [
  ["01", "Select", "Choose the payroll period and employees; reject locked or already-running periods."],
  ["02", "Resolve", "Read effective-dated salary and PAYFIELD values against the pay date, plus attendance metrics and approved overrides."],
  ["03", "Evaluate", "Sort component dependencies, evaluate formulas, and apply configured rounding."],
  ["04", "Tax", "Calculate TER-based PPh21 with GROSS, NET gross-up, or TAX_BORNE treatment."],
  ["05", "Persist", "Save component-level results and the formula context as an auditable snapshot."],
  ["06", "Deliver", "Stream progress through SSE and inspect per-employee failures. Transaction Service retains payroll results for reports, bank files, and Coretax exports; a separate outbox publishes payslip data to Report Service."],
] as const;

const designDecisions = [
  {
    number: "01", category: "Domain ownership", title: "Keep policy in one place.",
    constraint: "An employee's shift, location rules, approval route, and company context can change. A transaction needs the rules effective for that decision.",
    decision: "Master Service owns policy and reference data. Transaction Service requests that context and stores the event or result it produces.",
    consequence: "Operational records do not depend on a second, drifting copy of HR policy.",
  },
  {
    number: "02", category: "Offline attendance", title: "Reconnect without rewriting the rules.",
    constraint: "A clock event may arrive after capture, out of network order, or more than once after a retry.",
    decision: "Use a scoped offline token, signed event data, time and identity checks, and a client event ID. Valid events enter the shared clock processing path.",
    consequence: "The system preserves when the action happened and when it was received, while rejecting duplicate submissions.",
  },
  {
    number: "03", category: "Payroll accuracy", title: "Make the result explainable.",
    constraint: "Effective-dated pay, attendance, dependent formulas, tax modes, and partial failures all affect the final amount.",
    decision: "Order formula dependencies, save calculated components and context as a snapshot, expose progress, and allow failed employees to be retried.",
    consequence: "Reports and exports use the stored payroll result instead of silently recalculating it later.",
  },
  {
    number: "04", category: "Performance processing", title: "Why PostgreSQL jobs instead of RabbitMQ?",
    constraint: "Repeated changes for one employee and period must merge into the latest requested calculation, while results and delivery state remain traceable.",
    decision: "Keep versioned jobs in PostgreSQL, claim batches with SKIP LOCKED, and save each calculated result with its outbox entry in one SQL statement.",
    consequence: "A broker could distribute messages, but would not replace the calculation state or the result-to-outbox consistency boundary. Queue age and delivery failures remain visible in metrics.",
  },
];

function SectionHeading({ id, eyebrow, title, description }: { id: string; eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mono text-[0.68rem] font-medium uppercase tracking-[0.24em] text-amber-400">{eyebrow}</p>
      <h2 id={id} className="mt-3 scroll-mt-28 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{description}</p>
    </div>
  );
}

export default function UnaraPeopleCaseStudy() {
  return (
    <main id="main-content" className="relative z-10 min-h-screen overflow-x-clip pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[660px] bg-[radial-gradient(ellipse_at_52%_0%,rgba(47,138,155,0.17),transparent_62%)]" aria-hidden="true" />

      <div className="container-x relative">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 py-6">
          <Link href="/#projects" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-300 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            <ArrowLeft size={16} aria-hidden="true" /> Back to selected work
          </Link>
          <span className="mono text-[0.65rem] uppercase tracking-[0.2em] text-zinc-500">Gera Anggara Putra / Case study</span>
        </header>

        <section className="max-w-5xl pb-16 pt-16 sm:pb-24 sm:pt-24" aria-labelledby="case-title">
          <p className="mono text-xs font-medium uppercase tracking-[0.25em] text-amber-400">Flagship backend project · Multi-company HRIS</p>
          <h1 id="case-title" className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-7xl">
            UNARA <span className="text-amber-300">People.</span>
          </h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">
            An HR platform where policy, daily operations, and payroll outcomes must stay consistent across company boundaries.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
            I designed, built, and integrated the API Gateway, Master Service, Transaction Service, Report Service, and observability stack. My work spans the approval lifecycle, online and offline attendance, patrol from setup to field evidence, payroll accuracy, data import/export, access control, reporting, and production visibility.
          </p>
          <div className="mt-8 grid max-w-4xl gap-3 rounded-2xl border border-amber-300/20 bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.12),transparent_55%)] p-5 sm:grid-cols-3 sm:p-6">
            <div><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300">My scope</span><p className="mt-2 text-sm font-medium text-zinc-200">Four application services</p></div>
            <div className="border-t border-white/10 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300">Operations</span><p className="mt-2 text-sm font-medium text-zinc-200">One observability stack</p></div>
            <div className="border-t border-white/10 pt-3 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0"><span className="mono text-[0.62rem] uppercase tracking-[0.18em] text-amber-300">End-to-end feature</span><p className="mt-2 text-sm font-medium text-zinc-200">Patrol across services</p></div>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">{item}</span>)}
          </div>
          <div className="mt-8"><ProjectLinks links={project.links} projectTitle={project.title} /></div>
        </section>

        <nav aria-label="Case study sections" className="sticky top-0 z-30 -mx-4 flex items-center gap-4 overflow-x-auto border-y border-white/10 bg-[#100e0b]/95 px-4 py-3 backdrop-blur-md scrollbar-hide sm:mx-0 sm:rounded-xl sm:border sm:px-5">
          <span className="mono shrink-0 text-[0.6rem] uppercase tracking-[0.17em] text-amber-300">Explore</span>
          {caseSections.map(([label, id]) => (
            <a key={id} href={`#${id}`} className="shrink-0 rounded-full px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300">{label}</a>
          ))}
        </nav>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="architecture-title">
          <SectionHeading id="architecture-title" eyebrow="System architecture" title="Four application services, one observability stack." description="The gateway controls public access. Master Service owns rules and reference data; Transaction Service owns business events and results. Report Service owns reporting read models and payslip documents, while observability monitors the service boundaries." />
          <div className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-6">
            {services.map(({ number, title, icon: Icon, purpose, detail }, index) => (
              <article key={title} className={`rounded-2xl border border-white/10 bg-[#111612]/80 p-6 transition-colors hover:border-amber-400/30 ${index < 3 ? "lg:col-span-2" : "lg:col-span-3"} ${index === 4 ? "md:col-span-2 lg:col-span-3" : ""}`}>
                <div className="flex items-center justify-between text-amber-300"><Icon size={22} aria-hidden="true" /><span className="mono text-xs text-zinc-600">{number} / 05</span></div>
                <h3 className="mt-7 text-xl font-semibold text-white">{title}</h3>
                <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-amber-400/80">{purpose}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-zinc-500">Client → API Gateway → domain service · Master outbox → Transaction inbox → recalculation job → result + outbox → Report read model · metrics and logs → observability</p>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="approvals-title">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] lg:items-end">
            <div className="flex items-start gap-4">
              <ClipboardCheck className="mt-1 shrink-0 text-amber-400" size={25} aria-hidden="true" />
              <SectionHeading id="approvals-title" eyebrow="Requests and approvals" title="A request is more than a status change." description="I built the workflows that connect employee requests, configured approvers, company boundaries, attendance, and leave balances. Master Service defines who may decide; Transaction Service records each request and action." />
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <p className="mono text-[0.65rem] uppercase tracking-[0.18em] text-zinc-400">Request types</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Leave", "Overtime", "WFH", "Work permit", "Attendance correction"].map((item) => <span key={item} className="rounded-full border border-amber-300/15 bg-amber-300/[0.07] px-3 py-1.5 text-xs font-medium text-amber-100/90">{item}</span>)}
              </div>
            </div>
          </div>
          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {approvalSteps.map(({ number, title, detail }) => (
              <article key={number} className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#14130f]/90 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-amber-400/35 motion-reduce:transform-none">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-300/70 via-amber-300/15 to-transparent" aria-hidden="true" />
                <span className="mono text-xs text-amber-400">{number} / 04</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.045] p-5 sm:p-6">
              <GitBranch size={20} className="text-cyan-300" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-white">The request owns its company context</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">An approver can belong to another company. Identity is checked against the assigned approval step, while leave and attendance changes use the request&apos;s company.</p>
            </article>
            <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.045] p-5 sm:p-6">
              <Database size={20} className="text-emerald-300" aria-hidden="true" />
              <h3 className="mt-4 text-base font-semibold text-white">Leave balance follows the decision</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">Master Service keeps the balance ledger: submitted days are held, final approval commits them, rejection or cancellation releases them, and revisions adjust the allocation.</p>
            </article>
          </div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="attendance-title">
          <SectionHeading id="attendance-title" eyebrow="Daily operations" title="Attendance that follows the real working day." description="Clock-in and clock-out use shift and location context, support connectivity gaps, and produce records that can be audited and used by payroll. Offline attendance follows the same business processing path when the device reconnects." />
          <div className="mt-9 grid gap-3 lg:grid-cols-3">
            {attendanceSteps.map(({ number, title, detail }) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <span className="mono text-xs text-cyan-400">{number} / 03</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-400">Daily summaries, attendance reports, and audited corrections complete the operational flow; attendance metrics also feed payroll calculation.</p>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="patrol-title">
          <SectionHeading id="patrol-title" eyebrow="End-to-end ownership" title="Patrol from setup to field evidence." description="I designed and implemented the patrol feature across master configuration, mobile inspections, offline synchronization, scheduled follow-up, and permission controls." />
          <div className="mt-9 grid gap-3 lg:grid-cols-3">
            {patrolSteps.map(({ number, title, detail }) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <span className="mono text-xs text-amber-400">{number} / 03</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.055] p-5 text-sm leading-7 text-zinc-300 sm:p-6">
            Scheduled work marks unfinished or missed rounds only for eligible, assigned employees. Inspection results distinguish safe conditions, findings, and missing items, making the latest field evidence visible to supervisors.
          </div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="performance-title">
          <SectionHeading id="performance-title" eyebrow="Transaction Service" title="Performance moves from events to evidence." description="The worker maintains performance periods and recalculates affected employees in the background. Its database-backed inbox, jobs, and outbox separate calculation from delivery; payroll follows its own processing path." />
          <div className="mt-9 grid gap-3 lg:grid-cols-3">
            {performanceSteps.map(({ number, title, detail }) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
                <span className="mono text-xs text-cyan-400">{number} / 03</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="payroll-title">
          <div className="flex items-start gap-4"><Calculator className="mt-1 shrink-0 text-amber-400" size={25} aria-hidden="true" /><SectionHeading id="payroll-title" eyebrow="Accuracy at scale" title="Payroll is a process, not a sum." description="The calculation path combines dated HR data, attendance, formulas, tax rules, and an auditable result. I worked on this flow and fixed cases that affected result accuracy, including attendance status interpretation and duplicate overtime payment." /></div>
          <ol className="mt-9 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {payrollSteps.map(([number, title, detail]) => (
              <li key={number} className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 sm:p-6">
                <span className="mono text-xs text-amber-400">{number} / 06</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">{detail}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-xs leading-6 text-zinc-500">NET mode iterates the tax allowance because gross-up can move taxable income into a different TER bracket. A failed employee can be inspected and reprocessed before the period is closed.</p>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="report-title">
          <SectionHeading id="report-title" eyebrow="Report Service" title="Calculated once. Presented where it matters." description="This service owns its reporting data and document workflow. It receives published results through internal contracts and also assembles overtime reports using service APIs." />
          <div className="mt-9 grid gap-3 lg:grid-cols-3">
            {reportCapabilities.map(({ number, title, detail }) => (
              <article key={number} className="rounded-2xl border border-white/10 bg-[#111612]/80 p-6">
                <span className="mono text-xs text-amber-400">{number} / 03</span>
                <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm leading-7 text-zinc-400">If a ready payslip file is missing, the file endpoint schedules regeneration and responds that the document is being recreated.</p>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="decisions-title">
          <SectionHeading id="decisions-title" eyebrow="Engineering decisions" title="What the implementation had to get right." description="These choices connect the architecture to the real constraints of multi-company HR workflows: changing policy, unreliable connections, and results that must be explainable." />
          <div className="mt-9 space-y-3">
            {designDecisions.map((item) => (
              <article key={item.number} className="overflow-hidden rounded-2xl border border-white/10 bg-[#14130f]/85">
                <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[0.8fr_1fr_1fr] lg:gap-8">
                  <div>
                    <p className="mono text-[0.65rem] uppercase tracking-[0.2em] text-amber-300">{item.number} / {item.category}</p>
                    <h3 className="mt-3 max-w-xs text-2xl font-semibold leading-tight tracking-tight text-white">{item.title}</h3>
                  </div>
                  <div><p className="mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-500">Constraint</p><p className="mt-2 text-sm leading-7 text-zinc-300">{item.constraint}</p></div>
                  <div><p className="mono text-[0.6rem] uppercase tracking-[0.2em] text-zinc-500">Decision</p><p className="mt-2 text-sm leading-7 text-zinc-300">{item.decision}</p></div>
                </div>
                <div className="border-t border-white/[0.07] bg-amber-300/[0.045] px-6 py-4 text-sm leading-6 text-amber-100/80 sm:px-8"><span className="mono mr-3 text-[0.6rem] uppercase tracking-[0.16em] text-amber-300">Why it matters</span>{item.consequence}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="integrity-title">
          <SectionHeading id="integrity-title" eyebrow="Cross-service consistency" title="The details behind a reliable HR workflow." description="Several smaller decisions matter as much as the headline features: who owns a rule, what happens on retry, and how an administrator investigates an exception." />
          <div className="mt-9 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <Fingerprint className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Trust at the service boundary</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">The gateway introspects sessions, enriches identity context, asks Master Service for menu-level RBAC decisions, and signs upstream requests. Rate limits, timeouts, upload limits, and a circuit breaker guard traffic when dependencies degrade.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <Database className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Employee history with effective dates</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Master Service records career transitions with effective dates and history. Employment endings and reinstatements publish events that can trigger performance recalculation in Transaction Service.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <ArrowUpRight className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Bulk operations with a review step</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Employee and HR reference imports use templates, row validation, and confirmation. Attendance, PAYFIELD, and payroll component uploads expose per-row outcomes and async progress so an uploaded file is not mistaken for a fully applied change.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <Activity className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Evidence in production</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">I built a provisioned Grafana, Prometheus, Loki, and Alloy stack with service and host metrics, clock and payroll panels, searchable logs, and alerts for availability, errors, latency, and capacity. Performance panels track ready jobs, oldest queue age, version lag, worker cycles, delivery outcomes, and calculation-to-delivery latency.</p>
            </article>
          </div>
        </section>

        <footer className="flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 sm:flex-row sm:items-end">
          <div>
            <p className="mono text-xs uppercase tracking-[0.2em] text-amber-400">From implementation to explanation</p>
            <p className="mt-3 max-w-xl text-lg leading-7 text-zinc-300">The work spans security, business correctness, mobile resilience, and the tools needed to understand a running system.</p>
          </div>
          <Link href="/#contact" className="inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-amber-400/10 px-5 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400">
            Let&apos;s talk backend <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </main>
  );
}
