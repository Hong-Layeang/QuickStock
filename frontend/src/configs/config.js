// src/config.js
const isProduction = import.meta.env.PROD; // import.meta.env.PROD — Vite sets it to true automatically when building for production.

export const API_BASE_URL = isProduction
  ? "https://quickstock-v0iv.onrender.com"  // Render backend
  : "http://localhost:5000";                // local dev backend
