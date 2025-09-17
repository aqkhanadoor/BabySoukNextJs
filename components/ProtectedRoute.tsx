"use client";

import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { currentUser, loading } = useAuth();

    useEffect(() => {
        if (!loading && !currentUser) {
            redirect('/admin000/login');
        }
    }, [currentUser, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-playful-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-playful-primary mx-auto mb-4"></div>
                    <p className="text-playful-foreground text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
};

export default ProtectedRoute;
