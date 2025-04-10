import React from 'react';
import { useLiveAlerts } from '../hooks/useLiveAlerts';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';

const LiveTracker: React.FC = () => {
    const { alerts, loading, error } = useLiveAlerts();

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error loading live alerts: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Live Hack Tracker</h2>
            {alerts.length === 0 ? (
                <Card>
                    <p>No live hacks reported at this time.</p>
                </Card>
            ) : (
                <ul className="space-y-2">
                    {alerts.map((alert) => (
                        <li key={alert.id} className="border p-2 rounded">
                            <strong>{alert.protocol}</strong> - {alert.description} <br />
                            <span className="text-sm text-gray-500">{new Date(alert.timestamp).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LiveTracker;