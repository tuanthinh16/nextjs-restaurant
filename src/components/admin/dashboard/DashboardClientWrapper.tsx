// app/dashboard/DashboardClientWrapper.tsx
'use client'
import { useSession } from 'next-auth/react';
import DashboardPage from '../AdminDashboard';

export default function DashboardClientWrapper() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <div>Loading session...</div>;
    }

    if (!session) {
        return <div>Please sign in to view dashboard</div>;
    }

    return <DashboardPage />;
}