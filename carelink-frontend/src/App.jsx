import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1A2B3C',
                color: '#F0F4F8',
                border: '1px solid #243447',
                fontSize: '13px',
                borderRadius: '10px'
              },
              success: {
                iconTheme: {
                  primary: '#00BFA6',
                  secondary: '#0D1B2A'
                }
              },
              error: {
                iconTheme: {
                  primary: '#FF4757',
                  secondary: '#0D1B2A'
                }
              }
            }}
          />
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
