import Link from "next/link";

const profiles = [
  { slug: "adhrit", name: "Adhrit" },
  { slug: "sar", name: "Sar" }
] as const;

export default function ProfileSelectPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-600">International Business Olympiad</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Select your profile</h1>
        <p className="mt-2 text-sm text-slate-600">Two locked profiles only. Choose your private workspace.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {profiles.map((profile) => (
            <Link
              key={profile.slug}
              href={`/profile/${profile.slug}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-indigo-400 hover:bg-white"
            >
              <p className="text-xs uppercase tracking-widest text-slate-500">Profile</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{profile.name}</p>
              <p className="mt-2 text-sm text-slate-600">Create password once, then sign in from any device.</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
