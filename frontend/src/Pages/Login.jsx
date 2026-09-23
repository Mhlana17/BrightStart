
import React, { useState } from "react";
import { api } from "../api";

function PasswordToggle({ visible, onClick, label }) {
    return (
        <button
            type="button"
            className="password-toggle"
            onClick={onClick}
            aria-label={label}
            title={label}
        >
            {visible ? (
                // Eye with a slash = password is currently visible.
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58a2 2 0 0 0 2.83 2.83" />
                    <path d="M9.88 5.09A10.94 10.94 0 0 1 12 4.5c5.5 0 9 5.5 9 5.5a18.6 18.6 0 0 1-3.14 3.75" />
                    <path d="M6.61 6.61C4.36 8.14 3 10 3 10s3.5 5.5 9 5.5c1.06 0 2.06-.2 2.96-.54" />
                </svg>
            ) : (
                // Eye = password is hidden.
                <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path d="M2.5 12s3.5-5.5 9.5-5.5S21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
                    <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                    />
                </svg>
            )}
        </button>
    );
}

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

    // Controls password visibility.
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function updateField(event) {

        setForm({
            ...form,
            [event.target.name]:
            event.target.value
        });
    }

    async function handleSubmit(event) {

        event.preventDefault();

        setError("");

        /*
         * Password confirmation is only required
         * during normal user registration.
         */
        if (
            !isLogin &&
            form.password !==
            form.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        setLoading(true);

        try {

            /*
             * ==================================================
             * LOGIN
             * ==================================================
             */
            if (isLogin) {

                const email =
                    form.email
                        .trim()
                        .toLowerCase();

                /*
                 * BrightStart admin accounts are
                 * identified by the @brightstart.co.za
                 * email domain.
                 */
                const isAdmin =
                    email.endsWith(
                        "@brightstart.co.za"
                    );

                /*
                 * ==============================================
                 * ADMIN LOGIN
                 * ==============================================
                 */
                if (isAdmin) {

                    const response =
                        await api.adminLogin({
                            email,
                            password:
                            form.password
                        });

                    /*
                     * Store the JWT.
                     */
                    localStorage.setItem(
                        "brightstart_token",
                        response.token
                    );

                    /*
                     * Store the role.
                     */
                    localStorage.setItem(
                        "brightstart_role",
                        "ADMIN"
                    );

                    /*
                     * Store admin information.
                     */
                    localStorage.setItem(
                        "brightstart_admin",
                        JSON.stringify({
                            adminId:
                            response.adminId,
                            email:
                            response.email,
                            username:
                            response.username,
                            role:
                            "ADMIN"
                        })
                    );

                    /*
                     * Tell App.jsx that this
                     * was an ADMIN login.
                     */
                    onSuccess(
                        null,
                        "ADMIN"
                    );

                    return;
                }

                /*
                 * ==============================================
                 * NORMAL USER LOGIN
                 * ==============================================
                 */
                const response =
                    await api.login({
                        email,
                        password:
                        form.password
                    });

                /*
                 * Store normal-user JWT.
                 */
                localStorage.setItem(
                    "brightstart_token",
                    response.token
                );

                /*
                 * Store normal-user role.
                 */
                localStorage.setItem(
                    "brightstart_role",
                    "USER"
                );

                /*
                 * Send user information
                 * back to App.jsx.
                 */
                onSuccess(
                    response.user,
                    "USER"
                );

            } else {

                /*
                 * ==================================================
                 * NORMAL USER REGISTRATION
                 * ==================================================
                 *
                 * Admins do NOT register here.
                 */

                const email =
                    form.email
                        .trim()
                        .toLowerCase();

                await api.register({
                    firstName:
                    form.firstName,
                    lastName:
                    form.lastName,
                    email,
                    password:
                    form.password,
                    phoneNumber:
                    form.phoneNumber,
                    address:
                    form.address
                });

                /*
                 * Automatically log the user
                 * in after successful registration.
                 */
                const response =
                    await api.login({
                        email,
                        password:
                        form.password
                    });

                localStorage.setItem(
                    "brightstart_token",
                    response.token
                );

                localStorage.setItem(
                    "brightstart_role",
                    "USER"
                );

                onSuccess(
                    response.user,
                    "USER"
                );
            }

        } catch (err) {

            /*
             * Display the backend error.
             */
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
                                    value={
                                        form.firstName
                                    }
                                    onChange={
                                        updateField
                                    }
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
                                    value={
                                        form.lastName
                                    }
                                    onChange={
                                        updateField
                                    }
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
                            onChange={
                                updateField
                            }
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
                                value={
                                    form.phoneNumber
                                }
                                onChange={
                                    updateField
                                }
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
                                value={
                                    form.address
                                }
                                onChange={
                                    updateField
                                }
                                placeholder="Address"
                            />

                        </div>
                    )}

                    <div>

                        <label>
                            Password
                        </label>

                        <div className="password-input-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                value={
                                    form.password
                                }
                                onChange={
                                    updateField
                                }
                                required
                                minLength={8}
                                placeholder="Minimum 8 characters"
                            />

                            <PasswordToggle
                                visible={
                                    showPassword
                                }
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            />

                        </div>

                    </div>

                    {!isLogin && (
                        <div>

                            <label>
                                Confirm Password
                            </label>

                            <div className="password-input-wrapper">

                                <input
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    value={
                                        form.confirmPassword
                                    }
                                    onChange={
                                        updateField
                                    }
                                    required
                                    placeholder="Confirm password"
                                />

                                <PasswordToggle
                                    visible={
                                        showConfirmPassword
                                    }
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    label={
                                        showConfirmPassword
                                            ? "Hide confirm password"
                                            : "Show confirm password"
                                    }
                                />

                            </div>

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
                                    onModeChange(
                                        "signup"
                                    )
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
                                    onModeChange(
                                        "login"
                                    )
                                }
                            >
                                Log In
                            </button>
                        </>

                    )}

                </div>

                <button
                    type="button"
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
