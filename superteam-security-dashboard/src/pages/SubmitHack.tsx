import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Button from '../components/common/Button';

const SubmitHack = () => {
    const [hackDetails, setHackDetails] = useState({
        protocol: '',
        date: '',
        type: '',
        fundsLost: '',
        description: '',
    });
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHackDetails({
            ...hackDetails,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here you would typically send the data to your backend or API
        console.log('Submitting hack report:', hackDetails);
        // Redirect or show success message
        history.push('/dashboard');
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Submit a Hack Report</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="protocol"
                    placeholder="Protocol"
                    value={hackDetails.protocol}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    name="date"
                    value={hackDetails.date}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    name="type"
                    placeholder="Type of Exploit"
                    value={hackDetails.type}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <input
                    type="number"
                    name="fundsLost"
                    placeholder="Funds Lost"
                    value={hackDetails.fundsLost}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={hackDetails.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <Button type="submit">Submit Report</Button>
            </form>
        </div>
    );
};

export default SubmitHack;