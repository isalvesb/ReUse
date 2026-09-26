#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function runGit(args, options = {}) {
  const result = spawnSync("git", args, {
    cwd: options.cwd,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : "pipe",
  });

  if (result.status !== 0) {
    const detail = result.stderr?.trim() || result.stdout?.trim();
    throw new Error(detail || `git ${args.join(" ")} falhou.`);
  }

  return result.stdout?.trim() ?? "";
}

function loadContext() {
  const root = runGit(["rev-parse", "--show-toplevel"], { cwd: process.cwd() });
  const planPath = join(root, ".reuse", "commit-plan.json");

  if (!existsSync(planPath)) {
    throw new Error("Este repositorio nao possui .reuse/commit-plan.json.");
  }

  const plan = JSON.parse(readFileSync(planPath, "utf8"));
  const branch = runGit(["branch", "--show-current"], { cwd: root });

  if (branch !== plan.branch) {
    throw new Error(`Use a branch ${plan.branch}. Branch atual: ${branch || "HEAD destacado"}.`);
  }

  return { root, plan };
}

function changedInGroup(root, paths) {
  return runGit(
    ["status", "--porcelain=v1", "--untracked-files=all", "--", ...paths],
    { cwd: root },
  );
}

function nextCommit(root, plan) {
  return plan.commits.findIndex((commit) => changedInGroup(root, commit.paths));
}

function printPlan(root, plan) {
  const nextIndex = nextCommit(root, plan);
  console.log(`Plano da branch ${plan.branch}:`);

  plan.commits.forEach((commit, index) => {
    const dirty = Boolean(changedInGroup(root, commit.paths));
    const marker = index === nextIndex ? ">" : " ";
    const state = dirty ? "pendente" : "limpo/ja commitado";
    console.log(`${marker} ${index + 1}. ${commit.message} [${state}]`);
  });
}

function stageNext(root, plan) {
  const staged = runGit(["diff", "--cached", "--name-only"], { cwd: root });
  if (staged) {
    throw new Error(
      "Ja existem arquivos no stage. Commit ou retire-os do stage antes de usar reuse next.",
    );
  }

  const index = nextCommit(root, plan);
  if (index === -1) {
    console.log("Nao ha grupos pendentes no plano.");
    return;
  }

  const commit = plan.commits[index];
  runGit(["add", "--", ...commit.paths], { cwd: root });

  console.log(`\nProximo commit (${index + 1}/${plan.commits.length}):`);
  console.log(commit.message);
  console.log("\nArquivos preparados:");
  runGit(["diff", "--cached", "--stat"], { cwd: root, inherit: true });
  console.log("\nRevise com:");
  console.log("  git diff --cached");
  console.log("\nQuando estiver satisfeito, execute voce mesmo:");
  console.log(`  git commit -m ${JSON.stringify(commit.message)}`);
  console.log("\nO comando reuse nunca executa git commit.");
}

function unstage(root) {
  const staged = runGit(["diff", "--cached", "--name-only"], { cwd: root });
  if (!staged) {
    console.log("Nao ha arquivos no stage.");
    return;
  }

  runGit(["restore", "--staged", "--", ...staged.split("\n")], { cwd: root });
  console.log("Arquivos retirados do stage; as alteracoes locais foram preservadas.");
}

try {
  const command = process.argv[2] ?? "status";
  const { root, plan } = loadContext();

  if (command === "next") {
    stageNext(root, plan);
  } else if (command === "status" || command === "list") {
    printPlan(root, plan);
  } else if (command === "unstage") {
    unstage(root);
  } else {
    console.error("Uso: reuse <next|status|list|unstage>");
    process.exitCode = 2;
  }
} catch (error) {
  console.error(`reuse: ${error.message}`);
  process.exitCode = 1;
}
