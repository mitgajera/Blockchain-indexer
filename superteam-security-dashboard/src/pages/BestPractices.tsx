import React from 'react';

const BestPractices = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Best Practices for Security in the Solana Ecosystem</h1>
            <p className="mb-4">
                This section provides a curated list of resources and best practices for developers and users to enhance security in the Solana ecosystem.
            </p>
            <h2 className="text-xl font-semibold mb-2">Resources</h2>
            <ul className="list-disc list-inside mb-4">
                <li>
                    <a href="https://example.com/audit-checklist" className="text-blue-500 hover:underline">
                        Security Audit Checklist
                    </a>
                </li>
                <li>
                    <a href="https://example.com/toolkit" className="text-blue-500 hover:underline">
                        Security Toolkit for Developers
                    </a>
                </li>
                <li>
                    <a href="https://example.com/known-vectors" className="text-blue-500 hover:underline">
                        Known Vulnerability Vectors
                    </a>
                </li>
            </ul>
            <h2 className="text-xl font-semibold mb-2">Best Practices</h2>
            <ol className="list-decimal list-inside mb-4">
                <li>Regularly update dependencies and libraries.</li>
                <li>Conduct thorough security audits before deployment.</li>
                <li>Implement multi-signature wallets for fund management.</li>
                <li>Stay informed about the latest security threats and vulnerabilities.</li>
            </ol>
        </div>
    );
};

export default BestPractices;