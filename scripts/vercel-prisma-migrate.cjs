"use strict";

const { execSync } = require("node:child_process");

if (!process.env.VERCEL) {
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

/** Prefer direct URL so migrate deploy works with pgBouncer-style poolers. */
const migrateUrl =
  pick(
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "DIRECT_URL",
    "DATABASE_URL",
    "NEON_DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL"
  ) || composeFromParts();

if (!migrateUrl) {
  process.exit(0);
}

process.env.DATABASE_URL = migrateUrl;
execSync("prisma migrate deploy", { stdio: "inherit", env: process.env });
