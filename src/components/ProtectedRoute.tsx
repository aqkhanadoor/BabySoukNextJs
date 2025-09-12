import { useAuth } from '@/contexts/AuthContext';
import { Outlet } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    return currentUser ? <Outlet /> : <NotFound />;
};

export default ProtectedRoute;
