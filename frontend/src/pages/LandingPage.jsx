import { Link } from "react-router-dom";
import { ArrowRight, AlertTriangle, BarChart, ShieldCheck } from "lucide-react";

export default function LandingPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                        Financial intelligence that tells you when <span className="text-indigo-600">insights can’t be trusted.</span>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Modern capital markets generate drifting, unreliable data. Our platform makes reliability a first-class citizen, surfacing uncertainty before you make a move.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            to="/signup"
                            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Get Started
                        </Link>
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900">
                            Log in <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Problem Snapshot */}
            <div className="bg-gray-50 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">The Problem</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Data isn't just numbers. It's noise.
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Prices drift, narratives contradict, and signals desynchronize. Traditional dashboards ignore this, leading to silent failures during volatile market conditions.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                        <div className="rounded-lg bg-white p-8 shadow-lg border border-gray-100 flex flex-col items-center">
                            <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
                            <p className="text-gray-500 italic">"Visual illustration of unreliable data goes here"</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center mb-16">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">How It Works</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Reliability as a Service
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-3">
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <ArrowRight />
                            </div>
                            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Ingest Data</h3>
                            <p className="mt-2 text-base leading-7 text-gray-600">We process heterogeneous financial data from multiple sources.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <ShieldCheck />
                            </div>
                            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Analyze Reliability</h3>
                            <p className="mt-2 text-base leading-7 text-gray-600">Our engine computes time-varying reliability scores.</p>
                        </div>
                        <div className="text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                                <BarChart />
                            </div>
                            <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">Visualize Uncertainty</h3>
                            <p className="mt-2 text-base leading-7 text-gray-600">See trust scores directly alongside data.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Who Is It For */}
            <div className="bg-gray-900 py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:text-center text-white">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for the Modern Market</h2>
                    </div>
                    <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-16">
                        <div className="rounded-2xl bg-white/5 p-10 ring-1 ring-white/10">
                            <h3 className="text-2xl font-bold text-white">Startups</h3>
                            <p className="mt-4 text-gray-300">Submit your data and track its reliability score to build trust with investors.</p>
                        </div>
                        <div className="rounded-2xl bg-white/5 p-10 ring-1 ring-white/10">
                            <h3 className="text-2xl font-bold text-white">Investors</h3>
                            <p className="mt-4 text-gray-300">Consume insights with confidence, knowing exactly when to trust the numbers.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500">&copy; 2024 FinIntel. All rights reserved.</p>
                    </div>
                    <div className="flex justify-center space-x-6 md:order-2">
                        <span className="text-gray-400 hover:text-gray-500">About</span>
                        <span className="text-gray-400 hover:text-gray-500">Docs</span>
                        <span className="text-gray-400 hover:text-gray-500">GitHub</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
