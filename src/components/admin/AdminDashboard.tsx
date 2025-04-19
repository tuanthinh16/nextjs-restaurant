'use client'
import { PopularDishes } from "@/components/admin/dashboard/PopularDishes";
import { RevenueChart } from "@/components/admin/dashboard/RevenueChart";
import { StatsGrid } from "@/components/admin/dashboard/StatsGrid";
import { DashboardData } from "@/types";
import { get } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const { data: session } = useSession();
    const [data, setDashboardData] = useState<DashboardData>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await get('/api/admin/dashboard');
                console.log(res)
                setDashboardData(res.data as DashboardData);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!data) return <div>No data</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

            <StatsGrid
                totalTables={data?.totalTables || 0}
                totalDishes={data?.totalDishes || 0}
                totalUsers={data?.totalUsers || 0}
                revenue={data?.revenue || "0"}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
                    <RevenueChart data={data?.revenueChart || []} />
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <PopularDishes dishes={data?.popularDishes || []} />
                </div>
            </div>
        </div>
    );
}