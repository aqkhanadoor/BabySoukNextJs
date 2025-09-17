"use client";

import AnimatedLogo from "@/components/AnimatedLogo";
import {
    LayoutDashboard,
    Package,
    Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="admin-panel flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-8">
                    <AnimatedLogo />
                </div>
                <nav className="space-y-2 flex-1">
                    <Link
                        href="/admin000/dashboard"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive("/admin000/dashboard")
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <LayoutDashboard className="h-5 w-5" />
                        <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                        href="/admin000/products"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive("/admin000/products")
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <Package className="h-5 w-5" />
                        <span className="font-medium">Products</span>
                    </Link>
                    <Link
                        href="/admin000/settings"
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive("/admin000/settings")
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        <Settings className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                    </Link>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
