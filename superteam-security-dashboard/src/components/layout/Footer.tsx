import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-4">
            <div className="container mx-auto text-center">
                <p>&copy; {new Date().getFullYear()} Superteam Security Dashboard. All rights reserved.</p>
                <p>
                    <a href="https://github.com/your-repo-link" className="text-blue-400 hover:underline">
                        Contribute on GitHub
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;