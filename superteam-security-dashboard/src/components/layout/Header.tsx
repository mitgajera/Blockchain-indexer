import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../public/logo.svg';

const Header: React.FC = () => {
    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <div className="flex items-center">
                <img src={logo} alt="Superteam Security Dashboard" className="h-10 mr-3" />
                <h1 className="text-xl font-bold">Superteam Security Dashboard</h1>
            </div>
            <nav>
                <ul className="flex space-x-4">
                    <li>
                        <Link to="/" className="hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/resources" className="hover:underline">Resources</Link>
                    </li>
                    <li>
                        <Link to="/contribute" className="hover:underline">Contribute</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;