import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ReminderProvider } from './contexts/ReminderContext';
import { WhatsAppProvider } from './contexts/WhatsAppContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { PaymentProvider } from './contexts/PaymentContext';
import { SidebarProvider } from './contexts/SidebarContext';
import AppContent from './components/AppContent';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppointmentProvider>
            <PaymentProvider>
              <WhatsAppProvider>
                <ReminderProvider>
                  <SidebarProvider>
                    <Layout>
                      <AppContent />
                    </Layout>
                  </SidebarProvider>
                </ReminderProvider>
              </WhatsAppProvider>
            </PaymentProvider>
          </AppointmentProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}