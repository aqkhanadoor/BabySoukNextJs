import { redirect } from 'next/navigation';

// Server component: redirect /admin000 to /admin000/dashboard
export default function AdminIndex() {
    redirect('/admin000/dashboard');
}
