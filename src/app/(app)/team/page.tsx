import { AppShell } from "@/components/shell";

export default function TeamPage() {
  return (
    <AppShell title="Team Coordination">
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Shared Checkpoint Map</h2>
          <p className="mt-2 text-sm text-slate-600">Shows who is ready, waiting, or complete for each meeting checkpoint.</p>
        </section>
        <section className="rounded-xl border bg-white p-5">
          <h2 className="text-lg font-semibold">Meeting Log</h2>
          <p className="mt-2 text-sm text-slate-600">One-click "Meeting Done" updates both accounts in near real-time.</p>
        </section>
      </div>
    </AppShell>
  );
}
