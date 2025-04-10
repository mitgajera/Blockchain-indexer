import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white h-full">
            <div className="p-4">
                <h2 className="text-lg font-bold">Superteam Security Dashboard</h2>
            </div>
            <nav className="mt-4">
                <ul>
                    <li>
                        <Link to="/" className="block p-4 hover:bg-gray-700">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="block p-4 hover:bg-gray-700">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/live-tracker" className="block p-4 hover:bg-gray-700">Live Tracker</Link>
                    </li>
                    <li>
                        <Link to="/best-practices" className="block p-4 hover:bg-gray-700">Best Practices</Link>
                    </li>
                    <li>
                        <Link to="/contribute" className="block p-4 hover:bg-gray-700">Contribute</Link>
                    </li>
                    <li>
                        <Link to="/submit-hack" className="block p-4 hover:bg-gray-700">Submit a Hack</Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;