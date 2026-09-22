import React, { useState } from "react";
import { api } from "../api";

export default function Login({
                                 mode,
                                 onModeChange,
                                 onSuccess,
                                 onNavigate
                             }) {
    const isLogin = mode === "login";

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function updateField(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (!isLogin &&
            form.password !== form.confirmPassword) {

            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {

            if (isLogin) {

                const response = await api.login({
                    email: form.email,
                    password: form.password
                });

                localStorage.setItem(
                    "brightstart_token",
                    response.token
                );

                onSuccess(response.user);

            } else {

                await api.register({
                    firstName: form.firstName,
                    lastName: form.lastName,
                    email: form.email,
                    password: form.password,
                    phoneNumber: form.phoneNumber,
                    address: form.address
                });

                // Automatically log the user in after registration
                const response = await api.login({
                    email: form.email,
                    password: form.password
                });

                localStorage.setItem(
                    "brightstart_token",
                    response.token
                );

                onSuccess(response.user);
            }

        } catch (err) {

            setError(
                err.message ||
                "Something went wrong. Please try again."
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
                        {isLogin
                            ? "Welcome Back"
                            : "Create Your Account"}
                    </h1>

                    <p>
                        {isLogin
                            ? "Log in to continue with BrightStart."
                            : "Register to start your BrightStart journey."}
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

                    {!isLogin && (
                        <div className="auth-row">

                            <div>
                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={updateField}
                                    required
                                    placeholder="First name"
                                />
                            </div>

                            <div>
                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={updateField}
                                    required
                                    placeholder="Last name"
                                />
                            </div>

                        </div>
                    )}

                    <div>
                        <label>
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={updateField}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={updateField}
                                placeholder="Phone number"
                            />
                        </div>
                    )}

                    {!isLogin && (
                        <div>
                            <label>
                                Address
                            </label>

                            <input
                                type="text"
                                name="address"
                                value={form.address}
                                onChange={updateField}
                                placeholder="Address"
                            />
                        </div>
                    )}

                    <div>
                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={updateField}
                            required
                            minLength={8}
                            placeholder="Minimum 8 characters"
                        />
                    </div>

                    {!isLogin && (
                        <div>
                            <label>
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={form.confirmPassword}
                                onChange={updateField}
                                required
                                placeholder="Confirm password"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isLogin
                                ? "Log In"
                                : "Create Account"}
                    </button>

                </form>

                <div className="auth-switch">

                    {isLogin ? (
                        <>
                            <span>
                                Don't have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onModeChange("signup")
                                }
                            >
                                Register
                            </button>
                        </>
                    ) : (
                        <>
                            <span>
                                Already have an account?
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    onModeChange("login")
                                }
                            >
                                Log In
                            </button>
                        </>
                    )}

                </div>

                <button
                    className="auth-back"
                    onClick={() => onNavigate("home")}
                >
                    ← Back to BrightStart
                </button>

            </div>

        </section>
    );
}