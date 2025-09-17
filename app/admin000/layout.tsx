'use client';
import AdminLayout from '@/components/AdminLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { usePathname } from 'next/navigation';

export default function AdminRoot({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin000/login';

    if (isLoginPage) {
        // Login page should not be wrapped with ProtectedRoute or AdminLayout
        return <>{children}</>;
    }

    return (
        <ProtectedRoute>
            <AdminLayout>
                {children}
            </AdminLayout>
        </ProtectedRoute>
    );
}
