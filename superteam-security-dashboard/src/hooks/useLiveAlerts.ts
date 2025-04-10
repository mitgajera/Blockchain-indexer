import { useEffect, useState } from 'react';
import { fetchLiveAlerts } from '../lib/api';

const useLiveAlerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const data = await fetchLiveAlerts();
                setAlerts(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
        const intervalId = setInterval(fetchAlerts, 60000); // Fetch new alerts every minute

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return { alerts, loading, error };
};

export default useLiveAlerts;