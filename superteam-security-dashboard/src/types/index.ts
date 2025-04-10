// This file exports TypeScript types and interfaces used throughout the application.

export interface Exploit {
    id: string;
    protocol: string;
    date: string;
    type: string;
    fundsLost: number;
    responseTime: number;
}

export interface LiveAlert {
    id: string;
    message: string;
    timestamp: string;
}

export interface Resource {
    title: string;
    link: string;
    description: string;
}

export interface Contributor {
    username: string;
    contributions: number;
}