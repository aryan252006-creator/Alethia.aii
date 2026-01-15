import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        // Simulate login - in real app, this would verify credentials
        // For mock, we'll just check if there's a user in local storage or just create a session based on email
        // But since the requirements say "Role read from token" (simulated), we will assume any login works
        // and we need to know the role... 
        // Wait, typically login implies the user exists. 
        // To support the flow "Signup -> Login", we should check if the user signed up? 
        // Or just let them pick a role on login for testing? 
        // The prompt says "Role read from token".
        // For simplicity in this mock, if the user doesn't exist, we'll default to Investor or fail.

        // BETTER MOCK: If user signed up, use that. If not, maybe just allow login as Investor for demo?
        // Let's rely on the previous signup. If no user in localstorage, warn them to signup.

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const u = JSON.parse(storedUser);
            if (u.email === email) { // Simple check
                login(u);
                return;
            }
        }

        // Fallback for testing if they didn't signup:
        // setError("User not found. Please sign up.");
        // Actually, to make it easier for the user to test without signing up every time:
        const mockUser = { name: "Test User", email, role: "Investor" }; // Default to Investor if ad-hoc login
        login(mockUser);
    };

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="mb-4">
                    <Link to="/" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                        &larr; Back to Home
                    </Link>
                </div>
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    Not a member?{" "}
                    <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                        Start a 14 day free trial
                    </Link>
                </p>
            </div>
        </div>
    );
}
