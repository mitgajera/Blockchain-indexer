import React from 'react';
import { Link } from 'react-router-dom';

const Contribute = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">How to Contribute</h1>
            <p className="mb-4">
                We welcome contributions from the community! Here’s how you can help:
            </p>
            <h2 className="text-xl font-semibold mb-2">1. Reporting Exploits</h2>
            <p className="mb-4">
                If you come across a new exploit, please submit it using our 
                <Link to="/submit-hack" className="text-blue-500 underline"> submission form</Link>.
            </p>
            <h2 className="text-xl font-semibold mb-2">2. Code Contributions</h2>
            <p className="mb-4">
                You can contribute code by forking the repository and submitting a pull request. 
                Make sure to follow our coding standards and include tests for new features.
            </p>
            <h2 className="text-xl font-semibold mb-2">3. Documentation</h2>
            <p className="mb-4">
                Help us improve our documentation! You can edit the README or add new guides in the 
                <Link to="/best-practices" className="text-blue-500 underline"> Best Practices</Link> section.
            </p>
            <h2 className="text-xl font-semibold mb-2">4. Join the Community</h2>
            <p className="mb-4">
                Join our discussions on Discord or Telegram to stay updated and connect with other contributors.
            </p>
            <h2 className="text-xl font-semibold mb-2">5. Contributor Leaderboard</h2>
            <p className="mb-4">
                Check out our <Link to="/leaderboard" className="text-blue-500 underline">contributor leaderboard</Link> to see how you can climb the ranks!
            </p>
            <p>
                Thank you for your interest in contributing to the Superteam Security Dashboard!
            </p>
        </div>
    );
};

export default Contribute;