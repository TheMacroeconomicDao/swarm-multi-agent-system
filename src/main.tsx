import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import PuterErrorHandler from "./lib/utils/puter-error-handler";

// Initialize Puter error handler gracefully
PuterErrorHandler.getInstance().initialize().catch((error) => {
  // Silently continue in demo mode
});

createRoot(document.getElementById("root")!).render(<App />);
