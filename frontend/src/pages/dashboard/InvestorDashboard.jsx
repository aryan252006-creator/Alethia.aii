import { TrendingUp, AlertTriangle, Shield, Eye } from "lucide-react";

export default function InvestorDashboard() {
    const mockCompanies = [
        { id: 1, name: "Acme Corp", ticker: "ACME", price: "$124.50", change: "+2.4%", reliability: "High", score: 92 },
        { id: 2, name: "Globex Inc", ticker: "GLBX", price: "$45.20", change: "-0.8%", reliability: "Medium", score: 65 },
        { id: 3, name: "Soylent Corp", ticker: "SOYL", price: "$89.10", change: "+5.1%", reliability: "Low", score: 34, alert: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Market Overview</h1>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {mockCompanies.map((company) => (
                        <div key={company.id} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6 text-gray-900">{company.name}</h3>
                                        <p className="text-sm text-gray-500">{company.ticker}</p>
                                    </div>
                                    <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${company.reliability === 'High' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            company.reliability === 'Medium' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                                                'bg-red-50 text-red-700 ring-red-600/10'
                                        }`}>
                                        {company.reliability === 'High' ? <Shield className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                                        {company.score}% Trust
                                    </div>
                                </div>

                                <div className="mt-4 flex items-baseline">
                                    <p className="text-2xl font-semibold text-gray-900">{company.price}</p>
                                    <p className={`ml-2 flex items-baseline text-sm font-semibold ${company.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                        {company.change.startsWith('+') ? <TrendingUp className="h-4 w-4 mr-1 self-center shrink-0" /> : null}
                                        {company.change}
                                    </p>
                                </div>

                                {company.alert && (
                                    <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-2">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-xs text-red-700">
                                                    Narrative mismatch detected in latest filing.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-5">
                                    <button className="w-full justify-center inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        <Eye className="w-4 h-4 mr-2" /> View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
