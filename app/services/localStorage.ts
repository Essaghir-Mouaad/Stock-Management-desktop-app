// Local storage service for client-side data persistence
export class LocalStorageService {
    private static readonly PREFIX = 'stock_manager_';

    // Generic methods
    static setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.PREFIX + key, serializedValue);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    static getItem<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    static removeItem(key: string): void {
        try {
            localStorage.removeItem(this.PREFIX + key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    }

    static clear(): void {
        try {
            // Only clear our prefixed items
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }

    // Specific methods for our app
    static setUser(user: any): void {
        this.setItem('user', user);
    }

    static getUser(): any {
        return this.getItem('user');
    }

    static setToken(token: string): void {
        this.setItem('token', token);
    }

    static getToken(): string | null {
        return this.getItem('token');
    }

    static setProducts(products: any[]): void {
        this.setItem('products', products);
    }

    static getProducts(): any[] {
        return this.getItem('products') || [];
    }

    static setInvoices(invoices: any[]): void {
        this.setItem('invoices', invoices);
    }

    static getInvoices(): any[] {
        return this.getItem('invoices') || [];
    }

    static setAnalytics(analytics: any): void {
        this.setItem('analytics', analytics);
    }

    static getAnalytics(): any {
        return this.getItem('analytics');
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const token = this.getToken();
        const user = this.getUser();
        return !!(token && user);
    }

    // Clear authentication data
    static clearAuth(): void {
        this.removeItem('user');
        this.removeItem('token');
    }

    // Get storage usage info
    static getStorageInfo(): { used: number; available: number; percentage: number } {
        try {
            let used = 0;
            const keys = Object.keys(localStorage);

            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    used += localStorage.getItem(key)?.length || 0;
                }
            });

            // Estimate available storage (localStorage typically has 5-10MB limit)
            const available = 5 * 1024 * 1024; // 5MB estimate
            const percentage = (used / available) * 100;

            return {
                used,
                available,
                percentage: Math.min(percentage, 100)
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return { used: 0, available: 0, percentage: 0 };
        }
    }
}
