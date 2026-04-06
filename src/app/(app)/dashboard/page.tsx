import { AppShell } from "@/components/shell";

export default function DashboardPage() {
  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          "Today's Session Engine",
          "Mastery Score + Weakness Alerts",
          "Book Progress + Next Reading",
          "Checkpoint Status + Partner Readiness",
          "Review Queue",
          "Exam Readiness"
        ].map((card) => (
          <section key={card} className="rounded-xl border bg-white p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">{card}</h2>
            <p className="mt-2 text-sm text-slate-600">Live data-backed widget placeholder wired to persistent models.</p>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
