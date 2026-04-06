"use strict";

/**
 * Runs prisma migrate deploy on Vercel builds. Neon often needs sslmode=require
 * and a cold start can cause P1001 — we add query params, retry, and allow skip.
 */

const { execSync } = require("node:child_process");

if (!process.env.VERCEL) {
  process.exit(0);
}

if (process.env.SKIP_VERCEL_PRISMA_MIGRATE === "1") {
  console.log("SKIP_VERCEL_PRISMA_MIGRATE=1 — skipping prisma migrate deploy (run migrate locally or remove flag).");
  process.exit(0);
}

function pick(...names) {
  for (const n of names) {
    const v = process.env[n]?.trim();
    if (v) return v;
  }
  return "";
}

function composeFromParts() {
  const host = process.env.POSTGRES_HOST?.trim();
  const user = process.env.POSTGRES_USER?.trim();
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DATABASE?.trim();
  if (!host || !user || password === undefined || !database) return "";

  const port = process.env.POSTGRES_PORT?.trim() || "5432";
  const enc = encodeURIComponent;
  return `postgresql://${enc(user)}:${enc(password)}@${host}:${port}/${enc(database)}`;
}

/** Neon / managed Postgres: TCP from CI needs SSL; cold compute benefits from longer connect timeout. */
function withNeonTcpParams(url) {
  if (!url) return url;
  let u = url.trim();
  const lower = u.toLowerCase();
  const hasQuery = u.includes("?");
  const sep = hasQuery ? "&" : "?";
  const parts = [];
  if (!/[?&]sslmode=/i.test(lower)) parts.push("sslmode=require");
  if (!/[?&]connect_timeout=/i.test(lower)) parts.push("connect_timeout=60");
  if (parts.length === 0) return u;
  return u + sep + parts.join("&");
}

/** Prefer pooled Prisma URL first — Neon often tunes it for serverless; fall back to unpooled. */
const migrateUrlRaw =
  pick(
    "POSTGRES_PRISMA_URL",
    "DATABASE_URL",
    "POSTGRES_URL",
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "DIRECT_URL",
    "NEON_DATABASE_URL"
  ) || composeFromParts();

if (!migrateUrlRaw) {
  process.exit(0);
}

const migrateUrl = withNeonTcpParams(migrateUrlRaw);
process.env.DATABASE_URL = migrateUrl;

const attempts = Math.min(Math.max(parseInt(process.env.PRISMA_MIGRATE_ATTEMPTS || "4", 10) || 4, 1), 8);
const delaySec = Math.min(Math.max(parseInt(process.env.PRISMA_MIGRATE_RETRY_DELAY_SEC || "8", 10) || 8, 2), 60);

let lastErr;
for (let i = 0; i < attempts; i++) {
  try {
    execSync("prisma migrate deploy", { stdio: "inherit", env: process.env });
    process.exit(0);
  } catch (e) {
    lastErr = e;
    if (i < attempts - 1) {
      console.warn(
        `\nprisma migrate deploy failed (attempt ${i + 1}/${attempts}). Retrying in ${delaySec}s (Neon cold start / network)…\n`
      );
      try {
        execSync(`sleep ${delaySec}`);
      } catch {
        /* ignore */
      }
    }
  }
}

console.error(
  "\nprisma migrate deploy failed after retries. Fix: (1) In Neon dashboard, ensure the project is active / not restricted. " +
    "(2) Set SKIP_VERCEL_PRISMA_MIGRATE=1 on Vercel, redeploy, then run from your machine: npx prisma migrate deploy " +
    "(with DATABASE_URL in .env). (3) Or increase PRISMA_MIGRATE_ATTEMPTS / PRISMA_MIGRATE_RETRY_DELAY_SEC.\n"
);
process.exit(1);
