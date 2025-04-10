import React, { useEffect, useState } from 'react';
import { useLiveAlerts } from '../../hooks/useLiveAlerts';
import Loader from '../common/Loader';

const LiveTracker = () => {
    const { liveAlerts, loading, error } = useLiveAlerts();
    
    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error fetching live alerts: {error.message}</div>;
    }

    return (
        <div className="live-tracker">
            <h2 className="text-xl font-bold mb-4">Live Hack Tracker</h2>
            {liveAlerts.length === 0 ? (
                <p>No live hacks reported at the moment.</p>
            ) : (
                <ul className="space-y-2">
                    {liveAlerts.map((alert) => (
                        <li key={alert.id} className="border p-4 rounded shadow">
                            <h3 className="font-semibold">{alert.protocol}</h3>
                            <p>Date: {new Date(alert.date).toLocaleString()}</p>
                            <p>Type: {alert.type}</p>
                            <p>Funds Lost: {alert.fundsLost}</p>
                            <p>Response Time: {alert.responseTime} seconds</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LiveTracker;