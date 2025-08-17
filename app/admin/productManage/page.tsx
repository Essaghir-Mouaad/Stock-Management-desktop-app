"use client";

import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Package, TrendingUp, AlertTriangle } from 'lucide-react';

interface ProductLine {
    id: string;
    productName: string;
    category: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    lastUpdated: string;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    totalAmount: number;
    status: 'pending' | 'completed' | 'cancelled';
}

const ProductManagePage: React.FC = () => {
    const [selectedInvoice, setSelectedInvoice] = useState<string>('');
    const [products, setProducts] = useState<ProductLine[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for development
    useEffect(() => {
        const mockInvoices: Invoice[] = [
            { id: '1', invoiceNumber: 'INV-001', date: '2025-08-17', totalAmount: 1500.00, status: 'completed' },
            { id: '2', invoiceNumber: 'INV-002', date: '2025-08-16', totalAmount: 2300.00, status: 'pending' },
            { id: '3', invoiceNumber: 'INV-003', date: '2025-08-15', totalAmount: 1800.00, status: 'completed' },
        ];

        const mockProducts: ProductLine[] = [
            { id: '1', productName: 'Laptop', category: 'Electronics', quantity: 15, unitPrice: 999.99, totalValue: 14999.85, status: 'in-stock', lastUpdated: '2025-08-17' },
            { id: '2', productName: 'Mouse', category: 'Electronics', quantity: 50, unitPrice: 25.99, totalValue: 1299.50, status: 'in-stock', lastUpdated: '2025-08-17' },
            { id: '3', productName: 'Keyboard', category: 'Electronics', quantity: 5, unitPrice: 89.99, totalValue: 449.95, status: 'low-stock', lastUpdated: '2025-08-16' },
            { id: '4', productName: 'Monitor', category: 'Electronics', quantity: 0, unitPrice: 299.99, totalValue: 0, status: 'out-of-stock', lastUpdated: '2025-08-15' },
        ];

        setInvoices(mockInvoices);
        setProducts(mockProducts);
    }, []);

    const handleInvoiceSelect = async (invoiceId: string) => {
        setSelectedInvoice(invoiceId);
        setIsLoading(true);

        try {
            // TODO: Replace with actual Tauri invoke call
            // const productLines = await invoke('get_product_lines_by_invoice', { invoiceId });
            // setProducts(productLines);

            // For now, filter mock data
            const filteredProducts = products.filter(p => p.id === invoiceId);
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error fetching product lines:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesStatus = !statusFilter || product.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-stock': return 'bg-green-100 text-green-800';
            case 'low-stock': return 'bg-yellow-100 text-yellow-800';
            case 'out-of-stock': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'in-stock': return <Package className="w-4 h-4" />;
            case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
            case 'out-of-stock': return <AlertTriangle className="w-4 h-4 text-red-600" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-600 mt-2">Manage products and inventory across invoices</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Invoice Selection */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">Select Invoice</h2>
                </div>
                <select
                    value={selectedInvoice}
                    onChange={(e) => handleInvoiceSelect(e.target.value)}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">Choose an invoice to view products</option>
                    {invoices.map((invoice) => (
                        <option key={invoice.id} value={invoice.id}>
                            {invoice.invoiceNumber} - {invoice.date} (${invoice.totalAmount.toFixed(2)})
                        </option>
                    ))}
                </select>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5" />
                    <h2 className="text-xl font-semibold">Filters</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Books">Books</option>
                        </select>
                    </div>
                    <div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Statuses</option>
                            <option value="in-stock">In Stock</option>
                            <option value="low-stock">Low Stock</option>
                            <option value="out-of-stock">Out of Stock</option>
                        </select>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setCategoryFilter('');
                                setStatusFilter('');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2">
                        <Package className="w-8 h-8 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Stock</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {products.filter(p => p.status === 'in-stock').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-8 h-8 text-yellow-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Low Stock</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {products.filter(p => p.status === 'low-stock').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <div>
                            <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {products.filter(p => p.status === 'out-of-stock').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Products</h2>
                </div>
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No products found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Quantity</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Unit Price</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Total Value</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Last Updated</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product) => (
                                        <tr key={product.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-gray-900">{product.productName}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{product.category}</td>
                                            <td className="py-3 px-4 text-gray-600">{product.quantity}</td>
                                            <td className="py-3 px-4 text-gray-600">${product.unitPrice.toFixed(2)}</td>
                                            <td className="py-3 px-4 text-gray-600">${product.totalValue.toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`${getStatusColor(product.status)} flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium`}>
                                                    {getStatusIcon(product.status)}
                                                    {product.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{product.lastUpdated}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex space-x-2">
                                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">Edit</button>
                                                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">View</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductManagePage;
