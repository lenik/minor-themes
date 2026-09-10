#!/usr/bin/env node
/**
 * Package generated app themes into dist/.
 * Run: node scripts/package-apps.mjs [eclipse|intellij|emacs|all]
 */

import { mkdirSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const target = (process.argv[2] || "all").toLowerCase();

function run(cmd, args, opts = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    shell: false,
    ...opts,
  });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

function ensureGenerated() {
  const markers = [
    join(root, "apps/eclipse/plugin.xml"),
    join(root, "apps/intellij/META-INF/plugin.xml"),
    join(root, "apps/emacs/themes"),
  ];
  if (markers.some((p) => !existsSync(p))) {
    console.log("Generating apps/ …");
    run(process.execPath, [join(__dirname, "generate-apps.mjs")]);
  }
}

function whichJar() {
  for (const c of ["jar", "fastjar"]) {
    const r = spawnSync(c, ["--version"], { stdio: "ignore" });
    if (r.status === 0) return c;
  }
  // fallback: zip is enough for jar (zip format)
  return null;
}

mkdirSync(dist, { recursive: true });
ensureGenerated();

const jarCmd = whichJar();

if (target === "all" || target === "eclipse") {
  const out = join(dist, "minor-themes-eclipse.jar");
  if (existsSync(out)) rmSync(out);
  if (jarCmd) {
    run(jarCmd, ["cf", out, "-C", "apps/eclipse", "."]);
  } else {
    run("zip", ["-qr", out, "."], { cwd: join(root, "apps/eclipse") });
  }
  console.log(`Wrote ${out}`);
}

if (target === "all" || target === "intellij") {
  const out = join(dist, "minor-themes-intellij.jar");
  if (existsSync(out)) rmSync(out);
  if (jarCmd) {
    // Include META-INF + colors only (plugin classpath); keep icls/ out of jar
    run(jarCmd, [
      "cf",
      out,
      "-C",
      "apps/intellij",
      "META-INF",
      "-C",
      "apps/intellij",
      "colors",
    ]);
  } else {
    run("zip", ["-qr", out, "META-INF", "colors"], {
      cwd: join(root, "apps/intellij"),
    });
  }
  console.log(`Wrote ${out}`);
}

if (target === "all" || target === "emacs") {
  const out = join(dist, "minor-themes-emacs.zip");
  if (existsSync(out)) rmSync(out);
  run("zip", ["-qr", out, "themes", "README.md"], {
    cwd: join(root, "apps/emacs"),
  });
  console.log(`Wrote ${out}`);
}
