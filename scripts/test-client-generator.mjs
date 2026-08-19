#!/usr/bin/env node

import { access, mkdir, mkdtemp, readFile, rm } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const temporaryRoot = resolve(repositoryRoot, ".tmp");

function run(command, args, cwd) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        CI: process.env.CI ?? "true",
        NEXT_TELEMETRY_DISABLED: "1",
        npm_config_update_notifier: "false",
        WRANGLER_SEND_METRICS: "false",
        PATH: `${resolve(repositoryRoot, "node_modules/.bin")}:${process.env.PATH ?? ""}`,
      },
      stdio: "inherit",
    });
    child.on("error", rejectRun);
    child.on("exit", (code) => {
      if (code === 0) resolveRun();
      else rejectRun(new Error(`${command} ${args.join(" ")} završio je kodom ${code}`));
    });
  });
}

await mkdir(temporaryRoot, { recursive: true });
const testRoot = await mkdtemp(join(temporaryRoot, "client-test-"));
const output = resolve(testRoot, "probni-ducan");

try {
  await run(
    process.execPath,
    [
      resolve(repositoryRoot, "scripts/create-client.mjs"),
      "--theme", "shop-plant-botanical",
      "--slug", "probni-ducan",
      "--name", "Probni Dućan",
      "--output", output,
    ],
    repositoryRoot,
  );

  const requiredFiles = [
    "app/page.tsx",
    "app/robots.ts",
    "app/sitemap.ts",
    "lib/client.ts",
    "docs/BRIEF.md",
    "wrangler.jsonc",
    ".github/workflows/check.yml",
  ];
  await Promise.all(requiredFiles.map((path) => access(resolve(output, path))));

  const config = await readFile(resolve(output, "lib/client.ts"), "utf8");
  if (!config.includes('"allowIndexing": false')) {
    throw new Error("Generirani projekt mora biti blokiran od indeksiranja.");
  }
  if (!config.includes('"shopUrl": "#ponuda"')) {
    throw new Error("Generirani projekt dućana mora imati primarnu poveznicu na ponudu.");
  }

  await run("npm", ["run", "lint"], output);
  await run("npm", ["run", "build"], output);
  const ranWrangler = process.env.SKIP_CLIENT_WRANGLER_DRY_RUN !== "true";
  if (ranWrangler) {
    await run(resolve(repositoryRoot, "node_modules/.bin/wrangler"), ["deploy", "--dry-run"], output);
  }

  process.stdout.write(
    ranWrangler
      ? "\nGenerator klijenta, build i Cloudflare dry-run su ispravni.\n"
      : "\nGenerator klijenta i produkcijski build su ispravni.\n",
  );
} finally {
  await rm(testRoot, { recursive: true, force: true });
}
