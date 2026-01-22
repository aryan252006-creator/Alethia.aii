import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TrendingUp, AlertTriangle, Shield, Eye, Activity } from "lucide-react";

export default function InvestorDashboard() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickers = async () => {
            try {
                // Fetch valid tickers from backend (which proxies ML service)
                const response = await axios.get("http://localhost:8000/api/intelligence/tickers");

                // Safely handle potentially 503/error object response
                if (!Array.isArray(response.data)) {
                    // If it's the "model loading" or "retraining" 503 but returned as 200 JSON with status
                    if (response.data.status === "training" || response.data.message) {
                        throw new Error(response.data.message || "System Initializing...");
                    }
                    console.warn("Unexpected response format:", response.data);
                    throw new Error("Invalid data format received.");
                }

                // Map to UI format
                const mapped = response.data.map((t, idx) => ({
                    id: idx,
                    name: `${t.ticker} Corp`, // Placeholder name logic
                    ticker: t.ticker,
                    price: `$${t.price}`,
                    change: `${t.change > 0 ? '+' : ''}${t.change}%`,
                    reliability: "Medium", // This would ideally come from batch intelligence check
                    score: 75, // Placeholder until batch endpoint exists or individual check
                    rawChange: t.change
                }));

                setCompanies(mapped);
            } catch (err) {
                console.error("Failed to fetch tickers:", err);
                setError("Failed to load market data.");
            } finally {
                setLoading(false);
            }
        };

        fetchTickers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <Activity className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
                Loading Market Data...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <div className="text-center">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">System Error</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 p-8 pt-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-white mb-6">Market Overview</h1>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.map((company) => (
                        <div key={company.id} className="bg-gray-900 overflow-hidden shadow-lg rounded-lg border border-white/5 hover:border-indigo-500/30 transition-colors">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-white">{company.name}</h3>
                                        <p className="text-sm text-gray-400">{company.ticker}</p>
                                    </div>
                                    <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20'
                                        }`}>
                                        <Shield className="w-3 h-3 mr-1" />
                                        Analyzed
                                    </div>
                                </div>

                                <div className="mt-4 flex items-baseline">
                                    <p className="text-2xl font-semibold text-white">{company.price}</p>
                                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${company.rawChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        <TrendingUp className={`h-4 w-4 mr-1 self-center shrink-0 ${company.rawChange < 0 && 'rotate-180'}`} />
                                        {company.change}
                                    </p>
                                </div>

                                <div className="mt-5">
                                    <Link to={`/company/${company.ticker}`} className="w-full justify-center inline-flex items-center rounded-md bg-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/10 hover:bg-white/10 transition-colors">
                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
