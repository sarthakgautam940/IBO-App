import { AppShell } from "@/components/shell";
import { fourMonthRoadmap } from "@/data/roadmap";

export default function RoadmapPage() {
  return (
    <AppShell title="4-Month Mastery Roadmap">
      <div className="space-y-4">
        {fourMonthRoadmap.map((phase) => (
          <article key={phase.id} className="rounded-xl border bg-white p-5">
            <p className="text-xs uppercase tracking-widest text-indigo-600">{phase.weeks}</p>
            <h2 className="mt-1 text-xl font-bold">{phase.title}</h2>
            <p className="mt-2 text-sm text-slate-700">{phase.goal}</p>
          </article>
        ))}
      </div>
    </AppShell>
  );
}
