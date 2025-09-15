import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Initialize Eruda for debugging in development
if (import.meta.env.DEV) {
  import('eruda').then((eruda) => {
    eruda.default.init();
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);