import React from 'react';

interface CardProps {
    title: string;
    content: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ title, content, className }) => {
    return (
        <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div>{content}</div>
        </div>
    );
};

export default Card;