import React, { useState } from "react";
import { api } from "../api";

export default function AdminLogin({ onSuccess, onNavigate }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await api.adminLogin({
                    email,
                    password
                });

            localStorage.setItem(
                "brightstart_token",
                response.token
            );

            localStorage.setItem(
                "brightstart_admin",
                JSON.stringify({
                    email: response.email,
                    username: response.username,
                    role: "ADMIN"
                })
            );

            onSuccess();

        } catch (err) {

            setError(
                err.message ||
                "Invalid admin credentials."
            );

        } finally {

            setLoading(false);
        }
    }

    return (
        <section className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <img
                        src="/assets/logo.svg"
                        alt="BrightStart"
                        className="auth-logo"
                    />

                    <h1>
                        Admin Login
                    </h1>

                    <p>
                        BrightStart Administration
                    </p>

                </div>

                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div>

                        <label>
                            Admin Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            placeholder="name@brightstart.co.za"
                            required
                        />

                    </div>

                    <div>

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            placeholder="Admin password"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Admin Sign In"}
                    </button>

                </form>

                <button
                    className="auth-back"
                    onClick={() =>
                        onNavigate("home")
                    }
                >
                    ← Back to BrightStart
                </button>

            </div>

        </section>
    );
}