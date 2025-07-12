import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App.tsx';
import './index.css';

// Ensure proper initialization order
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Add error boundary for initialization issues
try {
  createRoot(rootElement).render(
    <StrictMode>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </StrictMode>
  );
} catch (error) {
  console.error('Application initialization error:', error);
  // Fallback rendering
  rootElement.innerHTML = '<div style="padding: 20px; text-align: center;"><h1>Loading...</h1><p>Please refresh the page if this persists.</p></div>';
}
