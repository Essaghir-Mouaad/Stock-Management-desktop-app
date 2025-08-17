// Mock data service for development and offline scenarios
export const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@stockmanager.com',
        name: 'Administrator',
        role: 'ADMIN' as const
    },
    {
        id: '2',
        username: 'worker',
        email: 'worker@stockmanager.com',
        name: 'Worker User',
        role: 'WORKER' as const
    },
    {
        id: '3',
        username: 'mouad',
        email: 'mouad@stockmanager.com',
        name: 'Mouad User',
        role: 'ADMIN' as const
    },
    {
        id: '4',
        username: 'souad',
        email: 'souad@stockmanager.com',
        name: 'Souad User',
        role: 'WORKER' as const
    }
];

export const mockProducts = [
    {
        id: '1',
        name: 'Laptop Dell XPS 13',
        description: 'High-performance laptop for business use',
        category: 'Electronics',
        price: 1299.99,
        stockQuantity: 15,
        minStockLevel: 5,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
    },
    {
        id: '2',
        name: 'Wireless Mouse Logitech MX Master',
        description: 'Premium wireless mouse with ergonomic design',
        category: 'Accessories',
        price: 79.99,
        stockQuantity: 45,
        minStockLevel: 10,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
    },
    {
        id: '3',
        name: 'USB-C Cable',
        description: 'High-speed USB-C cable for data transfer',
        category: 'Cables',
        price: 19.99,
        stockQuantity: 8,
        minStockLevel: 20,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
    },
    {
        id: '4',
        name: 'External SSD 1TB',
        description: 'Fast external solid state drive',
        category: 'Storage',
        price: 149.99,
        stockQuantity: 12,
        minStockLevel: 8,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
    },
    {
        id: '5',
        name: 'Bluetooth Headphones',
        description: 'Noise-cancelling wireless headphones',
        category: 'Audio',
        price: 199.99,
        stockQuantity: 3,
        minStockLevel: 15,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
    }
];

export const mockInvoices = [
    {
        id: '1',
        invoiceNumber: 'INV-2024-001',
        customerName: 'Tech Solutions Inc.',
        totalAmount: 2599.98,
        status: 'COMPLETED' as const,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20')
    },
    {
        id: '2',
        invoiceNumber: 'INV-2024-002',
        customerName: 'Digital Marketing Agency',
        totalAmount: 159.98,
        status: 'PENDING' as const,
        createdAt: new Date('2024-01-21'),
        updatedAt: new Date('2024-01-21')
    },
    {
        id: '3',
        invoiceNumber: 'INV-2024-003',
        customerName: 'Startup XYZ',
        totalAmount: 299.97,
        status: 'COMPLETED' as const,
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-22')
    }
];

export const mockAnalytics = {
    totalProducts: mockProducts.length,
    totalInvoices: mockInvoices.length,
    totalRevenue: mockInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    lowStockProducts: mockProducts.filter(p => p.stockQuantity <= p.minStockLevel).length,
    categoryStats: [
        {
            category: 'Electronics',
            count: 1,
            totalValue: 1299.99
        },
        {
            category: 'Accessories',
            count: 1,
            totalValue: 79.99
        },
        {
            category: 'Cables',
            count: 1,
            totalValue: 19.99
        },
        {
            category: 'Storage',
            count: 1,
            totalValue: 149.99
        },
        {
            category: 'Audio',
            count: 1,
            totalValue: 199.99
        }
    ]
};

export const mockDailyMovements = [
    {
        id: '1',
        type: 'IN' as const,
        productId: '1',
        productName: 'Laptop Dell XPS 13',
        quantity: 5,
        timestamp: new Date('2024-01-20T10:00:00Z'),
        reason: 'Restock'
    },
    {
        id: '2',
        type: 'OUT' as const,
        productId: '1',
        productName: 'Laptop Dell XPS 13',
        quantity: 2,
        timestamp: new Date('2024-01-20T14:30:00Z'),
        reason: 'Sale'
    },
    {
        id: '3',
        type: 'IN' as const,
        productId: '2',
        productName: 'Wireless Mouse Logitech MX Master',
        quantity: 20,
        timestamp: new Date('2024-01-20T16:00:00Z'),
        reason: 'Restock'
    }
];

export const mockMonthlySummary = {
    year: 2024,
    month: 1,
    monthName: 'January',
    totalSales: 3059.93,
    totalProducts: 5,
    totalInvoices: 3,
    topSellingProduct: 'Laptop Dell XPS 13',
    lowStockAlerts: 1,
    revenueGrowth: 15.5
};

// Mock USB drives for backup functionality
export const mockUSBDrives = [
    {
        path: 'D:',
        name: 'USB_DRIVE_01',
        freeSpace: '15.2 GB',
        isWritable: true
    },
    {
        path: 'E:',
        name: 'BACKUP_DRIVE',
        freeSpace: '45.8 GB',
        isWritable: true
    }
];

// Helper function to generate mock data with timestamps
export function generateMockData() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
        users: mockUsers,
        products: mockProducts.map(product => ({
            ...product,
            updatedAt: Math.random() > 0.5 ? now : oneDayAgo
        })),
        invoices: mockInvoices.map(invoice => ({
            ...invoice,
            createdAt: Math.random() > 0.5 ? now : oneWeekAgo,
            updatedAt: Math.random() > 0.5 ? now : oneWeekAgo
        })),
        analytics: mockAnalytics,
        dailyMovements: mockDailyMovements,
        monthlySummary: mockMonthlySummary,
        usbDrives: mockUSBDrives
    };
}

// Function to simulate API delay
export function simulateApiDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to simulate random errors (for testing error handling)
export function simulateRandomError(probability: number = 0.1): boolean {
    return Math.random() < probability;
}
