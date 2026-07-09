// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "@/contexts/AuthContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Remove React.StrictMode entirely
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);