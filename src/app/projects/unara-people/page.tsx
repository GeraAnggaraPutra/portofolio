import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Calculator,
  Database,
  Fingerprint,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { ProjectLinks } from "@/components/project-links";
import { projects } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "UNARA People — Backend Case Study",
  description:
    "A close look at the Go backend behind UNARA People: API security, online and offline attendance, patrol, payroll, leave balance, and observability.",
};

const project = projects[0];

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
      "The source of truth for companies, employees, organization, shifts, approval flows, payroll definitions, patrol setup, and leave balances.",
  },
  {
    number: "03",
    title: "Transaction Service",
    icon: ScanLine,
    purpose: "Events and outcomes",
    detail:
      "Runs attendance, requests, approvals, patrol inspections, and payroll. Business decisions use the current rules supplied by Master Service.",
  },
  {
    number: "04",
    title: "Observability",
    icon: Activity,
    purpose: "Operational evidence",
    detail:
      "Prometheus metrics, Grafana dashboards, Loki logs, Alloy collection, and alerts make failures traceable across the three application services.",
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

const payrollSteps = [
  ["01", "Select", "Choose the payroll period and employees; reject locked or already-running periods."],
  ["02", "Resolve", "Read effective-dated salary and PAYFIELD values against the pay date, plus attendance metrics and approved overrides."],
  ["03", "Evaluate", "Sort component dependencies, evaluate formulas, and apply configured rounding."],
  ["04", "Tax", "Calculate TER-based PPh21 with GROSS, NET gross-up, or TAX_BORNE treatment."],
  ["05", "Persist", "Save component-level results and the formula context as an auditable snapshot."],
  ["06", "Deliver", "Stream process progress through SSE, inspect per-employee failures, then generate reports, payslips, bank files, and Coretax exports."],
] as const;

function SectionHeading({ id, eyebrow, title, description }: { id: string; eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-3xl">
      <p className="mono text-[0.68rem] font-medium uppercase tracking-[0.24em] text-amber-400">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">{description}</p>
    </div>
  );
}

export default function UnaraPeopleCaseStudy() {
  return (
    <main className="relative z-10 min-h-screen overflow-hidden pb-20">
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
            I worked across its API Gateway, Master Service, Transaction Service, and observability stack. My end-to-end ownership included the patrol feature; I also contributed to online and offline attendance, leave balance, payroll accuracy, import/export, access control, and production visibility.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((item) => <span key={item} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300">{item}</span>)}
          </div>
          <div className="mt-8"><ProjectLinks links={project.links} projectTitle={project.title} /></div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="architecture-title">
          <SectionHeading id="architecture-title" eyebrow="System architecture" title="Four repositories, clear ownership." description="Rules and reference data stay in Master Service. Transaction Service owns events and results. The gateway protects access, while observability shows what happened when something goes wrong." />
          <div className="mt-9 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {services.map(({ number, title, icon: Icon, purpose, detail }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-[#111612]/80 p-6 transition-colors hover:border-amber-400/30">
                <div className="flex items-center justify-between text-amber-300"><Icon size={22} aria-hidden="true" /><span className="mono text-xs text-zinc-600">{number} / 04</span></div>
                <h3 className="mt-7 text-xl font-semibold text-white">{title}</h3>
                <p className="mono mt-1 text-[0.62rem] uppercase tracking-[0.16em] text-amber-400/80">{purpose}</p>
                <p className="mt-4 text-sm leading-6 text-zinc-400">{detail}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-zinc-500">Client request → Gateway → domain service → PostgreSQL / Redis · metrics and logs → observability stack</p>
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

        <section className="border-t border-white/10 py-16 sm:py-20" aria-labelledby="operations-title">
          <SectionHeading id="operations-title" eyebrow="Day-to-day operations" title="The context around every HR decision." description="Attendance and approvals depend on rules that change by employee, company, schedule, and effective date. The backend keeps those rules in one place while recording each operational decision where it happens." />
          <div className="mt-9 grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-white">Attendance with real shift context</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Master Service owns changing shift and location rules. Transaction Service applies them to online and offline clock events, preserves an audit trail for corrections, and turns attendance results into payroll inputs.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-7">
              <h3 className="text-xl font-semibold text-white">Approval driven by policy</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Master Service defines stages and eligible approvers, including cross-company cases. Transaction Service records leave, overtime, WFH, permit, and attendance correction requests and approver actions. Leave decisions trigger the corresponding balance transition.</p>
            </article>
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
              <h3 className="mt-5 text-xl font-semibold text-white">Leave balance as a ledger</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Submitting a leave request holds days; approval commits them; rejection or cancellation releases them. Revision adjusts allocations. Row locking and status-aware transitions keep concurrent requests and repeated actions from double-spending the balance.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <ArrowUpRight className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Bulk operations with a review step</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">Employee and HR reference imports use templates, row validation, and confirmation. Attendance, PAYFIELD, and payroll component uploads expose per-row outcomes and async progress so an uploaded file is not mistaken for a fully applied change.</p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-[#111612]/70 p-6 sm:p-7">
              <Activity className="text-amber-400" size={23} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-white">Evidence in production</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">I built a provisioned Grafana, Prometheus, Loki, and Alloy stack with service and host metrics, business panels for clock and payroll outcomes, searchable structured logs, and alerts for availability, errors, latency, and capacity.</p>
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
