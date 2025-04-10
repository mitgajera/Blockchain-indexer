import React from 'react';
import ExploitTable from '../components/dashboard/ExploitTable';
import LiveTracker from '../components/dashboard/LiveTracker';
import StatsOverview from '../components/dashboard/StatsOverview';

const Dashboard: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Superteam Security Dashboard</h1>
            <StatsOverview />
            <LiveTracker />
            <ExploitTable />
        </div>
    );
};

export default Dashboard;