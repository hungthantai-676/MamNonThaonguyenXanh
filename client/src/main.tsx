import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Add error handling and debug info
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  console.error('Error message:', e.message);
  console.error('Error filename:', e.filename);
  console.error('Error lineno:', e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
});

console.log('Main.tsx loaded successfully');
console.log('React version:', React.version);
console.log('Document ready state:', document.readyState);

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, creating React root');
  const root = createRoot(rootElement);
  console.log('React root created, rendering App');
  root.render(<App />);
  console.log('App rendered successfully');
}
