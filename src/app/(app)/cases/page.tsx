import { AppShell } from "@/components/shell";

export default function CaseLabPage() {
  return (
    <AppShell title="Case Lab">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Interactive Objective Case</h2>
          <p className="mt-2 text-sm text-slate-600">MedPhara-style data interpretation, timing pressure, and logic explanation debrief.</p>
        </section>
        <section className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold">Open Case Analysis</h2>
          <p className="mt-2 text-sm text-slate-600">Coffee Busters-style market entry recommendation builder and board-style defense.</p>
        </section>
      </div>
    </AppShell>
  );
}
