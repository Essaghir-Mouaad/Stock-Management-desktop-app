// Hybrid service that works with both Tauri backend and mock data
import { invoke } from '@tauri-apps/api/tauri';
import { LocalStorageService } from './localStorage';
import {
    mockUsers,
    mockProducts,
    mockInvoices,
    mockAnalytics,
    mockDailyMovements,
    mockMonthlySummary,
    mockUSBDrives,
    simulateApiDelay,
    simulateRandomError
} from './mockData';

// Check if Tauri is available
const isTauriAvailable = () => {
    try {
        // Check for Tauri v1
        const hasTauri = typeof window !== 'undefined' && (
            '__TAURI__' in (window as any) ||
            'Tauri' in window
        );

        console.log('🔍 Tauri check details:', {
            windowDefined: typeof window !== 'undefined',
            hasTauri: hasTauri,
            __TAURI__: typeof window !== 'undefined' ? typeof (window as any).__TAURI__ : 'undefined',
            Tauri: typeof window !== 'undefined' ? 'Tauri' in window : false
        });

        return hasTauri;
    } catch (error) {
        console.log('🔍 Tauri check error:', error);
        return false;
    }
};

// Test Tauri integration
export const testTauriIntegration = async () => {
    console.log('🧪 Testing Tauri integration...');

    if (!isTauriAvailable()) {
        console.log('❌ Tauri not available');
        return false;
    }

    try {
        // Try to call a simple Tauri command
        const result = await invoke('verify_token', { token: 'test' });
        console.log('✅ Tauri integration test successful:', result);
        return true;
    } catch (error) {
        console.log('❌ Tauri integration test failed:', error);
        return false;
    }
};

// Hybrid authentication service
export class HybridAuthService {
    static async login(credentials: { username: string; password: string }) {
        console.log('🔐 Login attempt with credentials:', credentials);
        console.log('🚀 Tauri available:', isTauriAvailable());

        try {
            if (isTauriAvailable()) {
                console.log('📡 Calling Tauri backend...');
                // Try Tauri backend first - pass credentials directly, not wrapped
                const result = await invoke('login_user', credentials);
                console.log('📡 Tauri backend response:', result);

                if (result && (result as any).success) {
                    const userData = (result as any).user;
                    const token = (result as any).token;

                    console.log('✅ Login successful via Tauri backend');
                    console.log('👤 User data:', userData);
                    console.log('🔑 Token:', token);

                    // Store in localStorage
                    LocalStorageService.setUser(userData);
                    LocalStorageService.setToken(token);

                    return result;
                } else {
                    console.log('❌ Tauri backend login failed:', result);
                }
            }

            console.log('🔄 Falling back to mock data...');
            // Fallback to mock data
            await simulateApiDelay();

            const mockUser = mockUsers.find(u =>
                u.username === credentials.username
                // Remove password check for mock users - accept any password
            );

            if (mockUser) {
                console.log('✅ Mock login successful');
                const mockToken = `mock_token_${Date.now()}`;
                const result = {
                    success: true,
                    user: mockUser,
                    token: mockToken
                };

                // Store in localStorage
                LocalStorageService.setUser(mockUser);
                LocalStorageService.setToken(mockToken);

                return result;
            }

            console.log('❌ Mock login failed - no matching user');
            return { success: false, message: 'Invalid credentials' };
        } catch (error) {
            console.error('💥 Login error:', error);

            // Fallback to mock data on error
            return this.loginWithMock(credentials);
        }
    }

    static async register(userData: { username: string; email?: string; password: string; name?: string; role?: string }) {
        console.log('📝 Registration attempt with data:', userData);
        console.log('🚀 Tauri available:', isTauriAvailable());

        try {
            if (isTauriAvailable()) {
                console.log('📡 Calling Tauri backend for registration...');
                // Try Tauri backend first - pass userData directly, not wrapped
                const result = await invoke('register_user', userData);
                console.log('📡 Tauri backend registration response:', result);

                if (result && (result as any).success) {
                    console.log('✅ Registration successful via Tauri backend');
                    return result;
                } else {
                    console.log('❌ Tauri backend registration failed:', result);
                }
            }

            console.log('🔄 Falling back to mock registration...');
            // Fallback to mock data
            await simulateApiDelay();

            // Check if user already exists
            const existingUser = mockUsers.find(u => u.username === userData.username);
            if (existingUser) {
                console.log('❌ Mock registration failed - user already exists');
                return { success: false, message: 'Username already exists' };
            }

            // Create mock user with correct role type
            const mockUser = {
                id: `mock_${Date.now()}`,
                username: userData.username,
                email: userData.email || '',
                name: userData.name || '',
                role: (userData.role || 'WORKER') as 'ADMIN' | 'WORKER'
            };

            mockUsers.push(mockUser);
            console.log('✅ Mock registration successful');

            return { success: true, message: 'User created successfully' };
        } catch (error) {
            console.error('💥 Registration error:', error);

            // Fallback to mock data on error
            return this.registerWithMock(userData);
        }
    }

    private static async loginWithMock(credentials: { username: string; password: string }) {
        console.log('🔄 Using mock login fallback...');
        await simulateApiDelay();

        const mockUser = mockUsers.find(u =>
            u.username === credentials.username
        );

        if (mockUser) {
            console.log('✅ Mock fallback login successful');
            const mockToken = `mock_token_${Date.now()}`;
            const result = {
                success: true,
                user: mockUser,
                token: mockToken
            };

            LocalStorageService.setUser(mockUser);
            LocalStorageService.setToken(mockToken);

            return result;
        }

        console.log('❌ Mock fallback login failed');
        return { success: false, message: 'Invalid credentials' };
    }

    private static async registerWithMock(userData: { username: string; email?: string; password: string; name?: string; role?: string }) {
        console.log('🔄 Using mock registration fallback...');
        await simulateApiDelay();

        // Check if user already exists
        const existingUser = mockUsers.find(u => u.username === userData.username);
        if (existingUser) {
            console.log('❌ Mock fallback registration failed - user already exists');
            return { success: false, message: 'Username already exists' };
        }

        // Create mock user with correct role type
        const mockUser = {
            id: `mock_${Date.now()}`,
            username: userData.username,
            email: userData.email || '',
            name: userData.name || '',
            role: (userData.role || 'WORKER') as 'ADMIN' | 'WORKER'
        };

        mockUsers.push(mockUser);
        console.log('✅ Mock fallback registration successful');

        return { success: true, message: 'User created successfully' };
    }

    static async logout() {
        try {
            if (isTauriAvailable()) {
                await invoke('logout_user');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        // Always clear localStorage
        LocalStorageService.clearAuth();

        return { success: true, message: 'Logged out successfully' };
    }

    static async verifyToken(token: string) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('verify_token', { token });
                return result;
            }
        } catch (error) {
            console.error('Token verification error:', error);
        }

        // Fallback to mock verification
        const storedToken = LocalStorageService.getToken();
        if (storedToken === token) {
            const user = LocalStorageService.getUser();
            if (user) {
                return { success: true, user, token };
            }
        }

        return { success: false, message: 'Invalid token' };
    }
}

// Hybrid product service
export class HybridProductService {
    static async getProducts() {
        try {
            if (isTauriAvailable()) {
                console.log('📡 Calling Tauri backend for products...');
                const result = await invoke('get_products');
                console.log('📡 Tauri backend products response:', result);
                return result;
            }
        } catch (error) {
            console.error('💥 Tauri products error:', error);
        }

        console.log('🔄 Falling back to mock products...');
        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, products: mockProducts };
    }

    static async getProductById(id: string) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_product_by_id', { id });
                return result;
            }
        } catch (error) {
            console.error('Product fetch error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const product = mockProducts.find(p => p.id === id);
        return { success: true, product };
    }

    static async createProduct(productData: any) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('create_product', productData);
                return result;
            }
        } catch (error) {
            console.error('Product creation error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const newProduct = {
            id: `mock_${Date.now()}`,
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockProducts.push(newProduct);
        return { success: true, product: newProduct };
    }

    static async updateProduct(id: string, productData: any) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('update_product', { id, ...productData });
                return result;
            }
        } catch (error) {
            console.error('Product update error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts[index] = { ...mockProducts[index], ...productData, updatedAt: new Date() };
            return { success: true, product: mockProducts[index] };
        }
        return { success: false, message: 'Product not found' };
    }

    static async deleteProduct(id: string) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('delete_product', { id });
                return result;
            }
        } catch (error) {
            console.error('Product deletion error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const index = mockProducts.findIndex(p => p.id === id);
        if (index !== -1) {
            mockProducts.splice(index, 1);
            return { success: true, message: 'Product deleted' };
        }
        return { success: false, message: 'Product not found' };
    }
}

export class HybridInvoiceService {
    static async getInvoices() {
        try {
            if (isTauriAvailable()) {
                console.log('📡 Calling Tauri backend for invoices...');
                const result = await invoke('get_invoices');
                console.log('📡 Tauri backend invoices response:', result);
                return result;
            }
        } catch (error) {
            console.error('💥 Tauri invoices error:', error);
        }

        console.log('🔄 Falling back to mock invoices...');
        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, invoices: mockInvoices };
    }

    static async getInvoiceById(id: string) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_invoice_by_id', { id });
                return result;
            }
        } catch (error) {
            console.error('Invoice fetch error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const invoice = mockInvoices.find(inv => inv.id === id);
        return { success: true, invoice };
    }

    static async createInvoice(invoiceData: any) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('create_invoice', invoiceData);
                return result;
            }
        } catch (error) {
            console.error('Invoice creation error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const newInvoice = {
            id: `mock_${Date.now()}`,
            ...invoiceData,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockInvoices.push(newInvoice);
        return { success: true, invoice: newInvoice };
    }

    static async updateInvoice(id: string, invoiceData: any) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('update_invoice', { id, ...invoiceData });
                return result;
            }
        } catch (error) {
            console.error('Invoice update error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        const index = mockInvoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
            mockInvoices[index] = { ...mockInvoices[index], ...invoiceData, updatedAt: new Date() };
            return { success: true, invoice: mockInvoices[index] };
        }
        return { success: false, message: 'Invoice not found' };
    }
}

export class HybridAnalyticsService {
    static async getAnalytics() {
        try {
            if (isTauriAvailable()) {
                console.log('📡 Calling Tauri backend for analytics...');
                const result = await invoke('get_analytics');
                console.log('📡 Tauri backend analytics response:', result);
                return result;
            }
        } catch (error) {
            console.error('💥 Tauri analytics error:', error);
        }

        console.log('🔄 Falling back to mock analytics...');
        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, analytics: mockAnalytics };
    }

    static async getDailyMovements() {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_daily_movements');
                return result;
            }
        } catch (error) {
            console.error('Daily movements error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, movements: mockDailyMovements };
    }

    static async getMonthlySummary() {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_monthly_summary');
                return result;
            }
        } catch (error) {
            console.error('Monthly summary error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, summary: mockMonthlySummary };
    }

    static async getCategoryStats() {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_category_stats');
                return result;
            }
        } catch (error) {
            console.error('Category stats error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, stats: mockAnalytics.categoryStats };
    }
}

export class HybridBackupService {
    static async getUSBDrives() {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('get_usb_drives');
                return result;
            }
        } catch (error) {
            console.error('USB drives error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, drives: mockUSBDrives };
    }

    static async createBackup(backupData: any) {
        try {
            if (isTauriAvailable()) {
                const result = await invoke('create_backup', backupData);
                return result;
            }
        } catch (error) {
            console.error('Backup creation error:', error);
        }

        // Fallback to mock data
        await simulateApiDelay();
        return { success: true, message: 'Backup created successfully (mock)' };
    }
}

// Export all services
export const HybridServices = {
    Auth: HybridAuthService,
    Products: HybridProductService,
    Invoices: HybridInvoiceService,
    Analytics: HybridAnalyticsService,
    Backup: HybridBackupService
};
