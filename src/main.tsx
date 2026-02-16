import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { TooltipProvider } from "./components/ui/tooltip.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/sales-agent-order-system/">
      <TooltipProvider>
        <App />
      </TooltipProvider>
      <Toaster />
    </BrowserRouter>
  </StrictMode>,
);
