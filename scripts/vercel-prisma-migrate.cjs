"use strict";

const { execSync } = require("node:child_process");

if (!process.env.VERCEL) {
  process.exit(0);
}

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

if (!url || url.trim() === "") {
  process.exit(0);
}

process.env.DATABASE_URL = url.trim();
execSync("prisma migrate deploy", { stdio: "inherit", env: process.env });
