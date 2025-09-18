"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Image from 'next/image';
import {
    ShoppingCart,
    Package,
    Users,
    DollarSign,
    TrendingUp,
    Activity,
    Eye,
    Plus,
    Loader2,
    RefreshCw,
    ImageIcon,
    Edit,
    Trash2,
    BarChart3
} from 'lucide-react';
import { realtimeDb } from '@/lib/firebase';
import { ref as dbRef, onValue, get } from "firebase/database";
import { ProductRecord } from '@/types/product';
import Link from 'next/link';

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    outOfStockProducts: number;
    totalRevenue: number;
    totalCategories: number;
    avgProductPrice: number;
}

const DashboardPage = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalProducts: 0,
        activeProducts: 0,
        outOfStockProducts: 0,
        totalRevenue: 0,
        totalCategories: 0,
        avgProductPrice: 0
    });
    const [products, setProducts] = useState<Array<{ key: string; data: ProductRecord }>>([]);
    const [loading, setLoading] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [heroStats, setHeroStats] = useState({ hero2Images: 0, hero3Images: 0 });
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // Load real-time dashboard data
    useEffect(() => {
        const loadDashboardData = () => {
            setLoading(true);
            const productsRef = dbRef(realtimeDb, "products");

            const unsub = onValue(productsRef, (snap) => {
                const val = snap.val() as Record<string, ProductRecord> | null;

                if (val) {
                    const productsList = Object.entries(val).map(([key, data]) => ({ key, data }));
                    setProducts(productsList);

                    // Calculate statistics
                    const totalProducts = productsList.length;
                    const activeProducts = productsList.filter(p => (p.data.stock || 0) > 0).length;
                    const outOfStockProducts = productsList.filter(p => (p.data.stock || 0) === 0).length;
                    const totalRevenue = productsList.reduce((sum, p) => sum + (p.data.price || 0), 0);
                    const categories = new Set(productsList.map(p => p.data.category)).size;
                    const avgPrice = totalProducts > 0 ? totalRevenue / totalProducts : 0;

                    setStats({
                        totalProducts,
                        activeProducts,
                        outOfStockProducts,
                        totalRevenue,
                        totalCategories: categories,
                        avgProductPrice: avgPrice
                    });
                } else {
                    setProducts([]);
                    setStats({
                        totalProducts: 0,
                        activeProducts: 0,
                        outOfStockProducts: 0,
                        totalRevenue: 0,
                        totalCategories: 0,
                        avgProductPrice: 0
                    });
                }
                setLoading(false);
            });

            unsubscribeRef.current = unsub;
        };

        loadDashboardData();

        // Load hero section stats
        const loadHeroStats = async () => {
            try {
                const [hero2Snap, hero3Snap] = await Promise.all([
                    get(dbRef(realtimeDb, 'homepage/hero2')),
                    get(dbRef(realtimeDb, 'homepage/hero3'))
                ]);

                const hero2Data = hero2Snap.val();
                const hero3Data = hero3Snap.val();

                const hero2Count = hero2Data?.desktop?.filter(Boolean).length || 0;
                const hero3Count = hero3Data?.desktop?.filter(Boolean).length || 0;

                setHeroStats({ hero2Images: hero2Count, hero3Images: hero3Count });
            } catch (error) {
                console.error('Error loading hero stats:', error);
            }
        };

        loadHeroStats();

        // Cleanup listener on unmount
        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    const recentProducts = products.slice(0, 5); // Get 5 most recent products

    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome to your Baby Souk admin dashboard
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin000/products">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            <TrendingUp className="inline mr-1 h-3 w-3" />
                            Products in catalog
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Stock</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeProducts}</div>
                        <p className="text-xs text-muted-foreground">
                            <Eye className="inline mr-1 h-3 w-3" />
                            Available products
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Catalog Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{Math.round(stats.totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                            <BarChart3 className="inline mr-1 h-3 w-3" />
                            Total product value
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Price</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{Math.round(stats.avgProductPrice)}</div>
                        <p className="text-xs text-muted-foreground">
                            <Activity className="inline mr-1 h-3 w-3" />
                            Average product price
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats Row */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <Package className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
                        <p className="text-xs text-muted-foreground">Products needing restock</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Categories</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalCategories}</div>
                        <p className="text-xs text-muted-foreground">Product categories</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hero Images</CardTitle>
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{heroStats.hero2Images + heroStats.hero3Images}</div>
                        <p className="text-xs text-muted-foreground">
                            Hero2: {heroStats.hero2Images} | Hero3: {heroStats.hero3Images}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs Section */}
            <Tabs defaultValue="products" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="products">Recent Products</TabsTrigger>
                    <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
                    <TabsTrigger value="analytics">Quick Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Products</CardTitle>
                            <CardDescription>
                                Latest products added to your catalog
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentProducts.length > 0 ? (
                                <div className="space-y-4">
                                    {recentProducts.map((product) => (
                                        <div key={product.key} className="flex items-center justify-between border-b pb-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                                                    {product.data.images?.[0] ? (
                                                        <Image
                                                            src={product.data.images[0]}
                                                            alt={`${product.data.name} - Product thumbnail`}
                                                            width={48}
                                                            height={48}
                                                            className="h-full w-full object-cover rounded-md"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium">{product.data.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.data.category} • Stock: {product.data.stock || 0}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge variant={(product.data.stock || 0) > 0 ? 'default' : 'destructive'}>
                                                    {(product.data.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                                </Badge>
                                                <div className="text-right">
                                                    <span className="font-medium">₹{product.data.price}</span>
                                                    {product.data.discountRate && (
                                                        <p className="text-xs text-green-600">{product.data.discountRate}% off</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="pt-4 text-center">
                                        <Link href="/admin000/products">
                                            <Button variant="outline">
                                                <Eye className="mr-2 h-4 w-4" />
                                                View All Products
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-2 text-sm font-medium">No products yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Get started by adding your first product.
                                    </p>
                                    <Link href="/admin000/products">
                                        <Button className="mt-4">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Product
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="inventory" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Inventory Status</CardTitle>
                            <CardDescription>
                                Products that need attention
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {products.filter(p => (p.data.stock || 0) === 0).length > 0 ? (
                                <div className="space-y-3">
                                    <h4 className="font-medium text-red-600">Out of Stock Products</h4>
                                    <div className="space-y-2">
                                        {products.filter(p => (p.data.stock || 0) === 0).slice(0, 5).map((product) => (
                                            <div key={product.key} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                                                        {product.data.images?.[0] ? (
                                                            <Image
                                                                src={product.data.images[0]}
                                                                alt={`${product.data.name} - Out of stock product`}
                                                                width={32}
                                                                height={32}
                                                                className="h-full w-full object-cover rounded-md"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{product.data.name}</p>
                                                        <p className="text-xs text-muted-foreground">{product.data.category}</p>
                                                    </div>
                                                </div>
                                                <Badge variant="destructive">Out of Stock</Badge>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-2">
                                        <Link href="/admin000/products">
                                            <Button variant="outline" size="sm">
                                                <Package className="mr-2 h-4 w-4" />
                                                Manage Inventory
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Package className="mx-auto h-12 w-12 text-green-500" />
                                    <h3 className="mt-2 text-sm font-medium text-green-600">All Products In Stock</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Great! All your products are currently available.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Breakdown</CardTitle>
                                <CardDescription>Products by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {Array.from(new Set(products.map(p => p.data.category)))
                                        .filter(Boolean)
                                        .map(category => {
                                            const count = products.filter(p => p.data.category === category).length;
                                            const percentage = stats.totalProducts > 0 ? Math.round((count / stats.totalProducts) * 100) : 0;

                                            return (
                                                <div key={category} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">{category}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-muted rounded-full h-2">
                                                            <div
                                                                className="bg-primary h-2 rounded-full"
                                                                style={{ width: `${percentage}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">{count}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Price Range Distribution</CardTitle>
                                <CardDescription>Products by price range</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {[
                                        { label: "Under ₹500", min: 0, max: 500 },
                                        { label: "₹500 - ₹1000", min: 500, max: 1000 },
                                        { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
                                        { label: "Above ₹2000", min: 2000, max: Infinity }
                                    ].map(range => {
                                        const count = products.filter(p =>
                                            (p.data.price || 0) >= range.min && (p.data.price || 0) < range.max
                                        ).length;
                                        const percentage = stats.totalProducts > 0 ? Math.round((count / stats.totalProducts) * 100) : 0;

                                        return (
                                            <div key={range.label} className="flex items-center justify-between">
                                                <span className="text-sm font-medium">{range.label}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-20 bg-muted rounded-full h-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{count}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default DashboardPage;