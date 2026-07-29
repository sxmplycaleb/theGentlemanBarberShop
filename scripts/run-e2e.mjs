import { spawn } from "node:child_process";

const port = 3100;
const healthUrl = `http://127.0.0.1:${port}/api/health`;

function spawnCommand(command, args, options = {}) {
  return spawn(command, args, {
    shell: false,
    stdio: "inherit",
    ...options,
  });
}

async function waitForHealth(deadlineMs = 120_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < deadlineMs) {
    try {
      const response = await fetch(healthUrl, { cache: "no-store" });

      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error(`Timed out waiting for ${healthUrl}.`);
}

function waitForExit(child) {
  return new Promise((resolve) => {
    child.once("exit", (code, signal) => {
      resolve({ code, signal });
    });
  });
}

async function stopServer(server) {
  if (server.exitCode !== null || server.signalCode !== null) {
    return;
  }

  server.kill("SIGTERM");

  const stopped = await Promise.race([
    waitForExit(server).then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), 5_000)),
  ]);

  if (!stopped) {
    server.kill("SIGKILL");
  }
}

const server = spawnCommand(
  process.execPath,
  [
    "./node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    String(port),
  ],
  {
    env: {
      ...process.env,
      CLERK_SECRET_KEY:
        process.env.CLERK_SECRET_KEY ?? "sk_test_playwright-placeholder",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ??
        "pk_test_cGxheXdyaWdodC5jbGVyay5hY2NvdW50cy5kZXYk",
    },
  },
);

let exitCode = 1;

try {
  await waitForHealth();

  const playwright = spawnCommand(
    process.execPath,
    ["./node_modules/@playwright/test/cli.js", "test"],
    {
      env: {
        ...process.env,
        E2E_EXTERNAL_SERVER: "1",
      },
    },
  );
  const result = await waitForExit(playwright);

  exitCode = result.code ?? (result.signal ? 1 : 0);
} finally {
  await stopServer(server);
}

process.exit(exitCode);
