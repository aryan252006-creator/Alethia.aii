import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { AlertTriangle, ArrowLeft, CheckCircle, Brain, Activity, TrendingUp, Zap } from "lucide-react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, PolarAngleAxis
} from 'recharts';

export default function CompanyDetails() {
    const { ticker } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [systemStatus, setSystemStatus] = useState("live"); // live, training, cache

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from our Node backend
                const response = await axios.get(`http://localhost:8000/api/intelligence/${ticker}`);

                // Inject mock history if not present (for demo purposes)
                const enrichedData = {
                    ...response.data,
                    history: response.data.history || [], // Use real history
                    // Ensure we have a numeric regime ID for the bar
                    regime_id: typeof response.data.regime_id === 'number' ? response.data.regime_id : 0
                };

                setData(enrichedData);
                if (response.data.status === 'training') {
                    setSystemStatus('training');
                } else if (response.data.source === 'cache') {
                    setSystemStatus('cache');
                } else {
                    setSystemStatus('live');
                }
            } catch (err) {
                // Handle 503 (Initializing or Retraining) -> show Retraining UI
                if (err.response && (err.response.status === 503 || err.response.status === 202)) {
                    setSystemStatus('training');
                    // Note: We don't set error, so UI will fall through to 'loading' or 'training' view
                } else {
                    console.error("Failed to fetch intelligence data", err);
                    setError("Failed to load intelligence data.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (ticker) {
            fetchData();
        }
    }, [ticker]);





    // Auto-refresh when in training mode
    useEffect(() => {
        let interval;
        if (systemStatus === 'training') {
            interval = setInterval(() => {
                // Re-fetch data to see if training finished
                const fetchUpdate = async () => {
                    try {
                        const response = await axios.get(`http://localhost:8000/api/intelligence/${ticker}`);
                        if (response.data.status !== 'training') {
                            const enrichedData = {
                                ...response.data,
                                history: response.data.history || [],
                                regime_id: typeof response.data.regime_id === 'number' ? response.data.regime_id : 0
                            };
                            setData(enrichedData);
                            setSystemStatus(response.data.source === 'cache' ? 'cache' : 'live');
                        }
                    } catch (e) {
                        // Ignore errors during poll
                    }
                };
                fetchUpdate();
            }, 5000); // Check every 5 seconds
        }
        return () => clearInterval(interval);
    }, [systemStatus, ticker]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
                <Activity className="w-8 h-8 animate-spin text-indigo-500 mr-2" />
                Loading Intelligence...
            </div>
        );
    }

    // Training State View (Prioritized over error/data check for 503 case)
    if (systemStatus === 'training') {
        return (
            <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 pt-24 flex flex-col items-center justify-center">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="relative mx-auto w-24 h-24">
                        <Activity className="w-24 h-24 text-indigo-500 animate-pulse" />
                        <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping"></div>
                    </div>

                    <h1 className="text-3xl font-bold">AI Model Initializing</h1>
                    <p className="text-xl text-gray-400">
                        The system is synchronizing with the neural network. This may take a moment.
                    </p>

                    <div className="bg-gray-900 border border-white/10 rounded-xl p-6 text-left max-w-lg mx-auto">
                        <h3 className="text-white font-medium mb-2 flex items-center">
                            <Brain className="w-4 h-4 mr-2 text-indigo-400" /> Current Status
                        </h3>
                        <p className="text-gray-400 text-sm">
                            Loading high-dimensional market tensors and calibrating FinBERT embeddings for {ticker}.
                        </p>
                        <div className="mt-4 w-full bg-gray-800 rounded-full h-2">
                            <div className="bg-indigo-500 h-2 rounded-full animate-progress" style={{ width: '60%' }}></div>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">Auto-refreshing...</p>
                    </div>

                    <Link to="/dashboard/investor" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 mt-8">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
                    </Link>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-white p-4">
                <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
                <p className="text-gray-400 mb-6">{error || "Company not found."}</p>
                <Link to="/dashboard/investor" className="text-indigo-400 hover:text-indigo-300 flex items-center">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>
            </div>
        );
    }


    // Determine colors
    const scoreColor = data.reliability_score >= 80 ? "#4ade80" : // green-400
        data.reliability_score >= 50 ? "#facc15" : // yellow-400
            "#f87171"; // red-400

    const isBullish = data.prediction > 0;
    const chartColor = isBullish ? "#4ade80" : "#f87171";

    // Data for Radial Bar
    const reliabilityData = [
        {
            name: 'Reliability',
            value: data.reliability_score,
            fill: scoreColor,
        }
    ];

    // Regime Configuration
    const regimes = [
        { id: 0, label: "Stable", color: "from-green-500 to-emerald-600", shadow: "shadow-green-500/50" },
        { id: 1, label: "Volatile", color: "from-yellow-500 to-orange-600", shadow: "shadow-yellow-500/50" },
        { id: 2, label: "Crisis", color: "from-red-600 to-rose-700", shadow: "shadow-red-600/50" }
    ];
    // Fallback if data.regime_id is out of bounds
    const currentRegimeId = (data.regime_id >= 0 && data.regime_id < regimes.length) ? data.regime_id : 0;


    return (
        <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 pt-24">
            <div className="max-w-6xl mx-auto relative">
                <Link to="/dashboard/investor" className="absolute -top-16 left-0 inline-flex items-center text-gray-400 hover:text-white transition-colors bg-gray-900/50 px-4 py-2 rounded-lg border border-white/10 hover:bg-gray-800 backdrop-blur-sm shadow-lg">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
                </Link>

                <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">
                            {ticker} <span className="text-gray-500 font-normal text-2xl">Intelligence Report</span>
                        </h1>
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium ring-1 ring-inset ring-indigo-500/20">
                                AI Generated
                            </span>
                            {systemStatus === 'training' && (
                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-sm font-medium ring-1 ring-inset ring-yellow-500/20 flex items-center">
                                    <Activity className="w-4 h-4 mr-1 animate-pulse" /> Model Retraining
                                </span>
                            )}
                            {systemStatus === 'cache' && (
                                <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium ring-1 ring-inset ring-orange-500/20 flex items-center">
                                    <AlertTriangle className="w-4 h-4 mr-1" /> Using Cached Data
                                </span>
                            )}
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Column 1: Financial Performance (Chart) */}
                    <div className="md:col-span-2">
                        <div className="bg-gray-900 rounded-2xl p-6 border border-white/5 shadow-xl h-full flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-medium text-gray-300">Projected Performance</h3>
                                <div className={`flex items-center text-sm font-bold ${isBullish ? 'text-green-400' : 'text-red-400'}`}>
                                    <TrendingUp className={`w-4 h-4 mr-1 ${!isBullish && 'transform rotate-180'}`} />
                                    {isBullish ? 'Bullish Outlook' : 'Bearish Outlook'}
                                </div>
                            </div>

                            <div className="h-80 w-full flex-grow">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.history}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} vertical={false} />
                                        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [`$${value}`, 'Price']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke={chartColor}
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Right Side Stats (Reliability & Regime) */}
                    <div className="md:col-span-1 space-y-6">

                        {/* Reliability Score */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col items-center justify-center relative overflow-hidden h-64">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
                            <h3 className="text-lg font-medium text-gray-300 mb-4">Trust Score</h3>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="70%"
                                        outerRadius="100%"
                                        barSize={10}
                                        data={reliabilityData}
                                        startAngle={90}
                                        endAngle={-270}
                                    >
                                        <PolarAngleAxis
                                            type="number"
                                            domain={[0, 100]}
                                            angleAxisId={0}
                                            tick={false}
                                        />
                                        <RadialBar
                                            background={{ fill: '#374151' }}
                                            clockWise
                                            dataKey="value"
                                            cornerRadius={10}
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                    <span className="text-4xl font-bold" style={{ color: scoreColor }}>
                                        {Math.round(data.reliability_score)}
                                    </span>
                                    <span className="text-xs text-gray-500 uppercase tracking-wider mt-1 text-center">Zhang et al. (2024)<br />Consistency</span>
                                </div>
                            </div>
                        </div>

                        {/* Polished Market Regime Bar */}
                        <div className="bg-gray-900 rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
                            <div className="flex items-center mb-4">
                                <Zap className="w-5 h-5 text-indigo-400 mr-2" />
                                <h3 className="text-lg font-medium text-gray-300">Market Regime</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs text-gray-400 uppercase tracking-wide px-1">
                                    {regimes.map((regime) => (
                                        <span
                                            key={regime.id}
                                            className={`${currentRegimeId === regime.id ? "text-white font-bold scale-110" : "opacity-60"} transition-all duration-300`}
                                        >
                                            {regime.label}
                                        </span>
                                    ))}
                                </div>
                                <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden flex shadow-inner border border-gray-700">
                                    {/* Background Segments */}
                                    {regimes.map((regime, index) => (
                                        <div key={regime.id} className="flex-1 border-r border-gray-900/50 last:border-0 relative">
                                            {/* Active Indicator Glow */}
                                            {currentRegimeId === index && (
                                                <div className={`absolute inset-0 bg-gradient-to-r ${regime.color} animate-pulse opacity-20`}></div>
                                            )}
                                        </div>
                                    ))}

                                    {/* The Active Bar Overlay */}
                                    <div
                                        className={`absolute top-0 bottom-0 transition-all duration-700 ease-out bg-gradient-to-r shadow-lg ${regimes[currentRegimeId].color} ${regimes[currentRegimeId].shadow}`}
                                        style={{
                                            left: `${(currentRegimeId / regimes.length) * 100}%`,
                                            width: `${100 / regimes.length}%`,
                                            borderRadius: '9999px' // Rounded capsule
                                        }}
                                    >
                                        {/* Internal Shine */}
                                        <div className="absolute top-0 left-0 w-full h-[1px] bg-white opacity-40"></div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-center">
                                    System detects <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${regimes[currentRegimeId].color}`}>
                                        {regimes[currentRegimeId].label}
                                    </span> conditions.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Column 3: Narrative & Alerts (Full Width) */}
                    <div className="md:col-span-3 space-y-6">

                        {/* Alert Card if Inconsistent */}
                        {!data.is_consistent && (
                            <div className="bg-red-900/10 border border-red-500/30 rounded-xl p-4 flex items-start space-x-4 shadow-[0_0_15px_rgba(239,68,68,0.2)] animate-pulse-slow">
                                <div className="bg-red-500/20 p-2 rounded-full shrink-0 text-red-400">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-red-400 font-bold text-lg">Narrative Mismatch Detected</h3>
                                    <p className="text-red-300/80 text-sm mt-1">
                                        The sentiment of the generated narrative does not align with the underlying market data trends. Proceed with caution.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Narrative Card */}
                        <div className="bg-gray-900 rounded-2xl p-8 border border-white/5 shadow-xl">
                            <div className="flex items-center mb-6">
                                <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400 mr-4">
                                    <Brain className="w-6 h-6" />
                                </div>
                                <h2 className="text-xl font-semibold text-white">Narrative Analysis</h2>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    "{data.narrative_summary}"
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-sm text-gray-500">
                                <span>Source: Automated Market Analysis</span>
                                {data.is_consistent && (
                                    <span className="flex items-center text-green-400/80">
                                        <CheckCircle className="w-4 h-4 mr-1.5" /> Verified Consistent
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
