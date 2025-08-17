// Client-side API service layer for Tauri desktop app
import { invoke } from '@tauri-apps/api/core';

// Types for API responses
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'WORKER';
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
    name: string;
    role?: 'ADMIN' | 'WORKER';
}

// Authentication services
export class AuthService {
    static async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            // For Tauri, we'll use invoke to call Rust backend
            const result = await invoke('login_user', { credentials });
            return result as LoginResponse;
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Login failed'
            };
        }
    }

    static async register(userData: CreateUserRequest): Promise<ApiResponse<User>> {
        try {
            const result = await invoke('create_user', { userData });
            return result as ApiResponse<User>;
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed'
            };
        }
    }

    static async logout(): Promise<ApiResponse> {
        try {
            // Clear local storage/tokens
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Logout failed'
            };
        }
    }
}

// Product services
export interface Product {
    id: string;
    name: string;
    description?: string;
    category: string;
    price: number;
    stockQuantity: number;
    minStockLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateProductRequest {
    name: string;
    description?: string;
    category: string;
    price: number;
    stockQuantity: number;
    minStockLevel: number;
}

export class ProductService {
    static async getAllProducts(): Promise<ApiResponse<Product[]>> {
        try {
            const result = await invoke('get_all_products');
            return result as ApiResponse<Product[]>;
        } catch (error) {
            console.error('Get products error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch products'
            };
        }
    }

    static async getProduct(id: string): Promise<ApiResponse<Product>> {
        try {
            const result = await invoke('get_product', { id });
            return result as ApiResponse<Product>;
        } catch (error) {
            console.error('Get product error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch product'
            };
        }
    }

    static async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
        try {
            const result = await invoke('create_product', { productData });
            return result as ApiResponse<Product>;
        } catch (error) {
            console.error('Create product error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create product'
            };
        }
    }

    static async updateProduct(id: string, productData: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> {
        try {
            const result = await invoke('update_product', { id, productData });
            return result as ApiResponse<Product>;
        } catch (error) {
            console.error('Update product error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to update product'
            };
        }
    }

    static async deleteProduct(id: string): Promise<ApiResponse> {
        try {
            const result = await invoke('delete_product', { id });
            return result as ApiResponse;
        } catch (error) {
            console.error('Delete product error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to delete product'
            };
        }
    }
}

// Invoice services
export interface Invoice {
    id: string;
    invoiceNumber: string;
    customerName: string;
    totalAmount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateInvoiceRequest {
    customerName: string;
    products: Array<{
        productId: string;
        quantity: number;
        price: number;
    }>;
}

export class InvoiceService {
    static async getAllInvoices(): Promise<ApiResponse<Invoice[]>> {
        try {
            const result = await invoke('get_all_invoices');
            return result as ApiResponse<Invoice[]>;
        } catch (error) {
            console.error('Get invoices error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch invoices'
            };
        }
    }

    static async createInvoice(invoiceData: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> {
        try {
            const result = await invoke('create_invoice', { invoiceData });
            return result as ApiResponse<Invoice>;
        } catch (error) {
            console.error('Create invoice error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to create invoice'
            };
        }
    }
}

// Analytics services
export interface AnalyticsData {
    totalProducts: number;
    totalInvoices: number;
    totalRevenue: number;
    lowStockProducts: number;
    categoryStats: Array<{
        category: string;
        count: number;
        totalValue: number;
    }>;
}

export class AnalyticsService {
    static async getCurrentOverview(): Promise<ApiResponse<AnalyticsData>> {
        try {
            const result = await invoke('get_analytics_overview');
            return result as ApiResponse<AnalyticsData>;
        } catch (error) {
            console.error('Get analytics error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch analytics'
            };
        }
    }

    static async getDailyMovements(date: string): Promise<ApiResponse<any>> {
        try {
            const result = await invoke('get_daily_movements', { date });
            return result as ApiResponse<any>;
        } catch (error) {
            console.error('Get daily movements error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch daily movements'
            };
        }
    }

    static async getMonthlySummary(year: number, month: number): Promise<ApiResponse<any>> {
        try {
            const result = await invoke('get_monthly_summary', { year, month });
            return result as ApiResponse<any>;
        } catch (error) {
            console.error('Get monthly summary error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch monthly summary'
            };
        }
    }
}

// Backup services
export interface USBDrive {
    path: string;
    name: string;
    freeSpace: string;
    isWritable: boolean;
}

export class BackupService {
    static async detectUSBDrives(): Promise<ApiResponse<USBDrive[]>> {
        try {
            const result = await invoke('detect_usb_drives');
            return result as ApiResponse<USBDrive[]>;
        } catch (error) {
            console.error('Detect USB drives error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to detect USB drives'
            };
        }
    }

    static async testUSBDrive(usbPath: string): Promise<ApiResponse<any>> {
        try {
            const result = await invoke('test_usb_drive', { usbPath });
            return result as ApiResponse<any>;
        } catch (error) {
            console.error('Test USB drive error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to test USB drive'
            };
        }
    }

    static async performDailyBackup(analyticsData: any): Promise<ApiResponse<any>> {
        try {
            const result = await invoke('perform_daily_backup', { analyticsData });
            return result as ApiResponse<any>;
        } catch (error) {
            console.error('Daily backup error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to perform daily backup'
            };
        }
    }

    static async generateMonthlyReport(analyticsData: any, year: number, month: number): Promise<ApiResponse<any>> {
        try {
            const result = await invoke('generate_monthly_report', { analyticsData, year, month });
            return result as ApiResponse<any>;
        } catch (error) {
            console.error('Monthly report error:', error);
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Failed to generate monthly report'
            };
        }
    }
}
