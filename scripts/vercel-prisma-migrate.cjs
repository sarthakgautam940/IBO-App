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

/** Prefer direct URL so migrate deploy works with pgBouncer-style poolers. */
const migrateUrl =
  pick(
    "POSTGRES_URL_NON_POOLING",
    "DATABASE_URL_UNPOOLED",
    "DIRECT_URL",
    "DATABASE_URL",
    "POSTGRES_PRISMA_URL",
    "POSTGRES_URL"
  ) || "";

if (!migrateUrl) {
  process.exit(0);
}

process.env.DATABASE_URL = migrateUrl;
execSync("prisma migrate deploy", { stdio: "inherit", env: process.env });
