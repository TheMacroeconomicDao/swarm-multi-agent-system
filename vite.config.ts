import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define environment variables for the browser
    'process.env': JSON.stringify({
      NODE_ENV: mode,
      VITE_OPENAI_API_KEY: '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',
      VITE_OPENAI_DEFAULT_MODEL: 'gpt-4',
      VITE_SWARM_MAX_PARALLEL_EXECUTIONS: '5',
      VITE_SWARM_QUALITY_THRESHOLD: '75',
      VITE_DAILY_COST_LIMIT: '50',
      VITE_MONTHLY_COST_LIMIT: '1000'
    })
  },
}));
