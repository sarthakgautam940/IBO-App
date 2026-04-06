import { notFound } from "next/navigation";

type Slug = "adhrit" | "sar";

export default async function ProfileAuthPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  if (slug !== "adhrit" && slug !== "sar") notFound();

  const { error } = await searchParams;
  const profileName = slug === "adhrit" ? "Adhrit" : "Sar";

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{profileName} Access</h1>
        {error === "database" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Could not reach the database. In Vercel, open <span className="font-medium">Settings → Environment
            Variables</span> and confirm a Postgres connection string exists for{" "}
            <span className="font-medium">Production</span> (e.g.{" "}
            <code className="font-mono text-xs">DATABASE_URL</code>,{" "}
            <code className="font-mono text-xs">POSTGRES_PRISMA_URL</code>,{" "}
            <code className="font-mono text-xs">POSTGRES_URL</code>, or{" "}
            <code className="font-mono text-xs">NEON_DATABASE_URL</code>
            ). Link Storage → Postgres to this project, then redeploy.
          </p>
        ) : null}
        {error === "migrations" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Database is connected but tables are missing. Open the latest <span className="font-medium">Deployment →
            Build logs</span> and check that <code className="font-mono text-xs">prisma migrate deploy</code> ran
            without errors, then redeploy.
          </p>
        ) : null}
        {error === "server" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Something went wrong while signing you in. Set <code className="font-mono text-xs">AUTH_SECRET</code> in
            Vercel (a long random string) and redeploy, then try again.
          </p>
        ) : null}
        {error === "validation" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Passwords must match and be at least 10 characters.
          </p>
        ) : null}
        {error === "already" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            This profile is already set up. Use <span className="font-medium">Continue</span> with your password.
          </p>
        ) : null}
        {error === "not_initialized" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            No password yet for this profile. Use <span className="font-medium">First-time setup</span> first.
          </p>
        ) : null}
        {error === "invalid" ? (
          <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            That password is incorrect. Try again.
          </p>
        ) : null}
        <p className="mt-2 text-sm text-slate-600">
          First visit creates password permanently. Returning visits require password login.
        </p>
        <form className="mt-6 space-y-3" action={`/api/auth/login`} method="post">
          <input type="hidden" name="slug" value={slug} />
          <input name="password" type="password" required placeholder="Password" className="w-full rounded-lg border px-3 py-2" />
          <button className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">Continue</button>
        </form>
        <form className="mt-4 space-y-3" action={`/api/auth/init`} method="post">
          <input type="hidden" name="slug" value={slug} />
          <input name="password" type="password" required minLength={10} placeholder="Create password" className="w-full rounded-lg border px-3 py-2" />
          <input name="confirmPassword" type="password" required minLength={10} placeholder="Confirm password" className="w-full rounded-lg border px-3 py-2" />
          <button className="w-full rounded-lg border border-indigo-300 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">
            First-time setup
          </button>
        </form>
      </div>
    </div>
  );
}
