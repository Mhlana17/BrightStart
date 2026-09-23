import React, { useEffect, useState } from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminDashboard from "./Pages/AdminDashboard";
import Login from "./Pages/Login.jsx";
import Home from "./Pages/Home";
import Programs from "./Pages/Programs";
import Booking from "./Pages/Bookings";
import Progress from "./Pages/Progress";
import About from "./Pages/About";

import { api } from "./api";

const pages = [
    "home",
    "programs",
    "booking",
    "progress",
    "about",
    "login",
    "signup",
    "admin-dashboard"
];

function isAdminSession() {
    return (
        !!localStorage.getItem("brightstart_token") &&
        localStorage.getItem("brightstart_role") === "ADMIN"
    );
}

function App() {

    const [page, setPage] = useState(getInitialPage);

    const [redirectAfterLogin, setRedirectAfterLogin] =
        useState("home");

    const [currentUser, setCurrentUser] = useState(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("brightstart_user")
                ) || null
            );
        } catch {
            return null;
        }
    });

    const [learners, setLearners] = useState(1);
    const [booked, setBooked] = useState(false);
    const [bookingSubmitting, setBookingSubmitting] =
        useState(false);
    const [bookingError, setBookingError] = useState("");

    const [admin, setAdmin] = useState(() => {
        try {
            return (
                JSON.parse(
                    localStorage.getItem("brightstart_admin")
                ) || null
            );
        } catch {
            return null;
        }
    });

    /*
     * Protect the admin dashboard.
     *
     * An admin must have:
     * 1. A BrightStart JWT
     * 2. The ADMIN role
     */
    useEffect(() => {

        if (
            page === "admin-dashboard" &&
            !isAdminSession()
        ) {
            setPage("login");
        }

    }, [page]);

    /*
     * Keep the URL hash synchronized with the current page.
     */
    useEffect(() => {
        window.location.hash = page;
    }, [page]);

    /*
     * Protect normal learner pages.
     */
    useEffect(() => {

        if (
            (page === "booking" ||
                page === "progress") &&
            !currentUser
        ) {

            setRedirectAfterLogin(page);
            setPage("login");
        }

    }, [page, currentUser]);

    /*
     * Main navigation function.
     */
    function navigate(nextPage) {

        if (!pages.includes(nextPage)) {
            return;
        }

        /*
         * Learner-only pages.
         */
        if (
            (nextPage === "booking" ||
                nextPage === "progress") &&
            !currentUser
        ) {

            setRedirectAfterLogin(nextPage);
            setPage("login");
            return;
        }

        /*
         * Admin dashboard protection.
         */
        if (
            nextPage === "admin-dashboard" &&
            !isAdminSession()
        ) {

            setPage("login");
            return;
        }

        setPage(nextPage);
        setBooked(false);
        setBookingError("");
    }

    /*
     * Handles BOTH learner and admin login.
     *
     * Login.jsx tells us which role was authenticated.
     */
    function handleAuthSuccess(
        authenticatedUser,
        role
    ) {

        /*
         * ADMIN LOGIN
         */
        if (role === "ADMIN") {

            const storedAdmin =
                JSON.parse(
                    localStorage.getItem(
                        "brightstart_admin"
                    )
                );

            setAdmin(storedAdmin);
            setCurrentUser(null);

            setPage("admin-dashboard");

            return;
        }

        /*
         * NORMAL USER LOGIN
         */
        setCurrentUser(authenticatedUser);

        localStorage.setItem(
            "brightstart_user",
            JSON.stringify(authenticatedUser)
        );

        setPage(redirectAfterLogin);

        setRedirectAfterLogin("home");
    }

    /*
     * ADMIN LOGOUT
     */
    function handleAdminLogout() {

        localStorage.removeItem(
            "brightstart_token"
        );

        localStorage.removeItem(
            "brightstart_role"
        );

        localStorage.removeItem(
            "brightstart_admin"
        );

        setAdmin(null);
        setPage("home");
    }

    /*
     * NORMAL USER LOGOUT
     */
    function handleLogout() {

        localStorage.removeItem(
            "brightstart_token"
        );

        localStorage.removeItem(
            "brightstart_role"
        );

        localStorage.removeItem(
            "brightstart_user"
        );

        setCurrentUser(null);
        setPage("home");
    }

    /*
     * Learner counter.
     */
    function changeLearners(step) {

        setLearners((current) =>
            Math.max(
                1,
                Math.min(
                    10,
                    current + step
                )
            )
        );
    }

    /*
     * Submit a booking.
     */
    async function submitBooking(booking) {

        setBookingSubmitting(true);
        setBookingError("");

        try {

            await api.createBooking({
                ...booking,
                pricePerWeek: 150,
                totalPrice:
                    booking.learners * 150
            });

            setBooked(true);

        } catch (error) {

            setBookingError(
                error.message
            );

        } finally {

            setBookingSubmitting(false);
        }
    }

    return (
        <div className="app-shell">

            <DesktopNav
                active={page}
                onNavigate={navigate}
                currentUser={currentUser}
                onLogout={handleLogout}
            />

            <main
                className="phone-frame"
                aria-live="polite"
            >

                {page === "home" && (
                    <Home
                        onNavigate={navigate}
                    />
                )}

                {page === "programs" && (
                    <Programs
                        onNavigate={navigate}
                    />
                )}

                {page === "booking" && (
                    <Booking
                        learners={learners}
                        booked={booked}
                        submitting={bookingSubmitting}
                        error={bookingError}
                        onLearnersChange={
                            changeLearners
                        }
                        onSubmit={submitBooking}
                        onNavigate={navigate}
                    />
                )}

                {page === "progress" && (
                    <Progress
                        onNavigate={navigate}
                    />
                )}

                {page === "about" && (
                    <About
                        onNavigate={navigate}
                    />
                )}

                {(page === "login" ||
                    page === "signup") && (

                    <Login
                        mode={page}
                        onModeChange={setPage}
                        onSuccess={
                            handleAuthSuccess
                        }
                        onNavigate={navigate}
                    />
                )}

                {page === "admin-dashboard" && (
                    <AdminDashboard
                        admin={admin}
                        onLogout={
                            handleAdminLogout
                        }
                    />
                )}

                <BottomNav
                    active={page}
                    onNavigate={navigate}
                />

            </main>

            {/*
             * ADMIN BUTTON
             *
             * It now opens the normal login page.
             *
             * Login.jsx automatically detects
             * @brightstart.co.za and calls /admin/signin.
             */}
            <button
                className="admin-login-link"
                onClick={() =>
                    navigate("login")
                }
            >
                Admin
            </button>

        </div>
    );
}

function DesktopNav({
                        active,
                        onNavigate,
                        currentUser,
                        onLogout
                    }) {

    return (
        <aside
            className="desktop-nav"
            aria-label="Desktop navigation"
        >

            <div className="brand-lockup">

                <img
                    src="/assets/logo.svg"
                    alt=""
                    className="brand-logo"
                />

                <div>
                    <strong>
                        BrightStart
                    </strong>

                    <span>
                        English Tutoring
                    </span>
                </div>

            </div>

            {[
                "home",
                "programs",
                "about"
            ].map((item) => (

                <button
                    key={item}
                    className={`nav-link ${
                        active === item
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        onNavigate(item)
                    }
                >
                    {labelFor(item)}
                </button>

            ))}

            <div className="auth-buttons">

                {currentUser ? (

                    <>

                        <button
                            className="nav-button"
                            onClick={() =>
                                onNavigate(
                                    "progress"
                                )
                            }
                        >
                            My Progress
                        </button>

                        <button
                            className="nav-button booking-button"
                            onClick={() =>
                                onNavigate(
                                    "booking"
                                )
                            }
                        >
                            Book a Lesson
                        </button>

                        <button
                            className="nav-button logout-button"
                            onClick={onLogout}
                        >
                            Logout
                        </button>

                    </>

                ) : (

                    <>

                        <button
                            className="nav-button login-button"
                            onClick={() =>
                                onNavigate(
                                    "login"
                                )
                            }
                        >
                            Log In
                        </button>

                        <button
                            className="nav-button register-button"
                            onClick={() =>
                                onNavigate(
                                    "signup"
                                )
                            }
                        >
                            Register
                        </button>

                    </>

                )}

            </div>

        </aside>
    );
}

function BottomNav({
                       active,
                       onNavigate
                   }) {

    const items = [
        ["home", HomeIcon],
        ["programs", BookIcon],
        ["booking", CalendarIcon],
        ["progress", BarsIcon],
        ["about", UserIcon]
    ];

    return (
        <nav
            className="bottom-nav"
            aria-label="Mobile navigation"
        >

            {items.map(
                ([item, Icon]) => (

                    <button
                        key={item}
                        className={
                            active === item
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            onNavigate(item)
                        }
                        aria-label={
                            labelFor(item)
                        }
                    >
                        <Icon />
                    </button>

                )
            )}

        </nav>
    );
}

function getInitialPage() {

    const hashPage =
        window.location.hash.replace(
            "#",
            ""
        );

    /*
     * If somebody manually enters
     * #admin-dashboard without a valid
     * admin session, the protection
     * in useEffect will redirect them.
     */
    return pages.includes(hashPage)
        ? hashPage
        : "home";
}

function labelFor(page) {

    return (
        page.charAt(0).toUpperCase() +
        page.slice(1)
    );
}

function IconBase({ children }) {

    return (
        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            {children}
        </svg>
    );
}

function BookIcon() {

    return (
        <IconBase>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" />
        </IconBase>
    );
}

function CalendarIcon() {

    return (
        <IconBase>
            <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
            />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </IconBase>
    );
}

function HomeIcon() {

    return (
        <IconBase>
            <path d="m3 10 9-7 9 7v11H3V10Z" />
            <path d="M9 21v-6h6v6" />
        </IconBase>
    );
}

function BarsIcon() {

    return (
        <IconBase>
            <path d="M4 19V5" />
            <path d="M8 17v-6M13 17V7M18 17v-3" />
        </IconBase>
    );
}

function UserIcon() {

    return (
        <IconBase>
            <circle
                cx="12"
                cy="8"
                r="4"
            />
            <path d="M4 22a8 8 0 0 1 16 0" />
        </IconBase>
    );
}

export default App;

