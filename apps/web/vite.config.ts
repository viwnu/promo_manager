import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

function loadApiEnv(mode: string) {
  const fileName = mode === "production" ? ".env.api.production" : ".env.api.development";
  const fullPath = path.resolve(configDir, "../../", fileName);
  if (!fs.existsSync(fullPath)) {
    return {} as Record<string, string>;
  }

  const raw = fs.readFileSync(fullPath, "utf-8");
  const env: Record<string, string> = {};

  raw.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) {
      return;
    }
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  });

  return env;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const apiEnv = loadApiEnv(mode);
  const baseUrl = apiEnv.VITE_API_BASE_URL || "";
  const apiBaseUrl = apiEnv.API_BASE_URL || ""

  return {
    plugins: [react()],
    define: {
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(baseUrl),
    },
    server: {
      proxy: {
        // Proxy requests from '/api' to backend
        "/api": {
          target: apiBaseUrl || "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
