import { Upload, FileText, Activity } from "lucide-react";

export default function StartupDashboard() {
    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar - visual only for now, could be its own component */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900">Startup Portal</h2>
                </div>
                <nav className="px-4 space-y-1">
                    <a href="#" className="bg-indigo-50 text-indigo-600 group flex items-center px-4 py-2 text-sm font-medium rounded-md">
                        <Activity className="mr-3 h-5 w-5" />
                        Overview
                    </a>
                    <a href="#" className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-4 py-2 text-sm font-medium rounded-md">
                        <Upload className="mr-3 h-5 w-5" />
                        Submit Data
                    </a>
                </nav>
            </aside>

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Current Reliability Score</dt>
                                <dd className="mt-1 text-3xl font-semibold text-indigo-600">85%</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Data Submissions</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">12</dd>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <dt className="text-sm font-medium text-gray-500 truncate">Pending Reviews</dt>
                                <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                            </div>
                        </div>
                    </div>

                    {/* Submission Section */}
                    <div className="bg-white shadow sm:rounded-lg">
                        <div className="px-4 py-5 sm:p-6">
                            <h3 className="text-base font-semibold leading-6 text-gray-900">Submit Financial Data</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Upload your quarterly reports or API credentials to update your reliability score.</p>
                            </div>
                            <div className="mt-5">
                                <button type="button" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    <Upload className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                    Upload Files
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Placeholder */}
                    <div className="mt-8 bg-white shadow sm:rounded-lg p-6">
                        <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Reliability History</h3>
                        <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">Reliability Chart Placeholder</span>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
