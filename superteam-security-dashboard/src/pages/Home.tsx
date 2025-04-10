import React from 'react';
import { Link } from 'react-router-dom';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { ExploitFrequencyChart } from '../components/charts/ExploitFrequencyChart';
import { FundsLostChart } from '../components/charts/FundsLostChart';
import { ResponseTimeChart } from '../components/charts/ResponseTimeChart';
import { VulnerabilityTypesChart } from '../components/charts/VulnerabilityTypesChart';

const Home: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold">Superteam Security Dashboard</h1>
                <p className="text-lg mt-2">Visualizing Solana Ecosystem Exploits</p>
                <Link to="/dashboard" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
                    Go to Dashboard
                </Link>
            </header>
            <StatsOverview />
            <section className="mt-8">
                <h2 className="text-2xl font-semibold">Exploit Trends</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ExploitFrequencyChart />
                    <FundsLostChart />
                    <ResponseTimeChart />
                    <VulnerabilityTypesChart />
                </div>
            </section>
        </div>
    );
};

export default Home;