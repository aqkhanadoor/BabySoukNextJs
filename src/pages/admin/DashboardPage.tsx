"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, Activity, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

const StatCard = ({ title, value, icon, description, loading }: { title: string, value: string, icon: React.ReactNode, description: string, loading: boolean }) => (
    <Card className="shadow-sm hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            {icon}
        </CardHeader>
        <CardContent>
            {loading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
                <>
                    <div className="text-2xl font-bold">{value}</div>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </>
            )}
        </CardContent>
    </Card>
);

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalProducts: 0,
        totalOrders: 0,
        activity: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const productsRef = ref(db, 'products');
        const unsub = onValue(productsRef, (snapshot) => {
            const products = snapshot.val() || {};
            const productCount = Object.keys(products).length;

            // This is a placeholder for revenue and orders logic
            // In a real app, you'd fetch and calculate this from an 'orders' collection
            const totalRevenue = productCount * 1250; // Placeholder
            const totalOrders = productCount * 5; // Placeholder

            setStats({
                totalProducts: productCount,
                totalRevenue: totalRevenue,
                totalOrders: totalOrders,
                activity: 573, // Placeholder
            });
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    description="+20.1% from last month"
                    loading={loading}
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts.toString()}
                    icon={<Package className="h-5 w-5 text-blue-500" />}
                    description="All available products"
                    loading={loading}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    icon={<Users className="h-5 w-5 text-purple-500" />}
                    description="+19% from last month"
                    loading={loading}
                />
                <StatCard
                    title="Recent Activity"
                    value="+573"
                    icon={<Activity className="h-5 w-5 text-red-500" />}
                    description="+201 since last hour"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default DashboardPage;
