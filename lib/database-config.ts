// Tauri 2.x compatible database configuration
export async function getDatabasePath(): Promise<string> {
  try {
    // Check if we're in Tauri environment
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      // Dynamic import for Tauri 2.x APIs
      const { appDataDir } = await import('@tauri-apps/api/path');
      const { join } = await import('@tauri-apps/api/path');
      
      const appDataDirPath = await appDataDir();
      const dbPath = await join(appDataDirPath, 'stock-management', 'database.db');
      return dbPath;
    } else {
      // Fallback for web development mode
      return './database.db';
    }
  } catch (error) {
    console.error('Error getting database path:', error);
    return './database.db';
  }
}

export async function initializeDatabase() {
  try {
    // Check if we're in Tauri environment
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
      // Dynamic import for Tauri 2.x APIs
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('create_database_dir');
      console.log('Database directory initialized');
    } else {
      console.log('Running in web mode - database initialization skipped');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    // Don't throw - let the app continue
  }
}