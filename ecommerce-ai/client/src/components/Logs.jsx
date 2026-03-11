import { useState, useEffect } from 'react';
import axios from 'axios';
import { Database, AlertCircle, Clock } from 'lucide-react';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/logs');
            setLogs(res.data.logs);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch logs from database.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12 text-gray-500">Loading audit logs...</div>;
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl flex items-center justify-center gap-3">
                <AlertCircle className="w-5 h-5" />
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Database className="w-6 h-6 text-primary-600" />
                    AI Audit Logs
                </h2>
                <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full font-medium">
                    {logs.length} Records found
                </span>
            </div>

            <div className="space-y-6">
                {logs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
                        No API interactions logged yet.
                    </div>
                ) : (
                    logs.map(log => (
                        <div key={log.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-b border-gray-200">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                    <Clock className="w-4 h-4" />
                                    {new Date(log.timestamp).toLocaleString()}
                                </div>
                                <div className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase ${log.status_code === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    Status {log.status_code}
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">User Input Filtered</h4>
                                    <pre className="text-xs bg-slate-900 text-slate-300 p-4 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
                                        {log.user_input}
                                    </pre>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Raw AI Response</h4>
                                    <pre className="text-xs bg-slate-900 text-emerald-400 p-4 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
                                        {log.raw_ai_response}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
}
