import { notFound } from "next/navigation";

type Slug = "adhrit" | "sar";

export default async function ProfileAuthPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== "adhrit" && slug !== "sar") notFound();

  const profileName = slug === "adhrit" ? "Adhrit" : "Sar";

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{profileName} Access</h1>
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
