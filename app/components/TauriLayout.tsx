'use client';

import { useEffect, useState } from 'react';
import { initializeDatabase } from '@/lib/database-config';

interface TauriLayoutProps {
  children: React.ReactNode;
}

export default function TauriLayout({ children }: TauriLayoutProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function setupApp() {
      try {
        // Initialize database (works in both web and desktop modes)
        await initializeDatabase();
        
        // Try to set window title if in desktop mode
        if (typeof window !== 'undefined' && (window as any).__TAURI__) {
          try {
            // Tauri 2.x window API
            const { getCurrentWindow } = await import('@tauri-apps/api/window');
            const appWindow = getCurrentWindow();
            await appWindow.setTitle('Stock Management System');
          } catch (error) {
            console.log('Could not set window title:', error);
          }
        }
        
        setIsReady(true);
      } catch (error) {
        console.error('Setup error:', error);
        setIsReady(true); // Still show the app even if setup fails
      }
    }

    setupApp();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading Stock Management System...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}