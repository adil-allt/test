import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppointmentProvider } from './contexts/AppointmentContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppointmentProvider>
      <App />
    </AppointmentProvider>
  </StrictMode>
);