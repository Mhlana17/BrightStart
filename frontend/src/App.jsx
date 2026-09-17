import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./Pages/Home";
import Programs from "./Pages/Programs";
import Booking from "./Pages/Bookings";
import Progress from "./Pages/Progress";
import About from "./Pages/About";
import Auth from "./Pages/Auth";
import { api } from "./api";

const pages = ["home", "programs", "booking", "progress", "about", "login", "signup"];

function App() {
    const [page, setPage] = useState(getInitialPage);
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("brightstart_user")) || null;
        } catch {
            return null;
        }
    });
    const [learners, setLearners] = useState(1);
    const [booked, setBooked] = useState(false);
    const [bookingSubmitting, setBookingSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");

    useEffect(() => {
        window.location.hash = page;
    }, [page]);

    useEffect(() => {
        if (page === "booking" && !user) {
            setPage("login");
        }
    }, [page, user]);

    function navigate(nextPage) {
        if (pages.includes(nextPage)) {
            if (nextPage === "booking" && !user) {
                setPage("login");
                return;
            }
            setPage(nextPage);
            setBooked(false);
            setBookingError("");
        }
    }

    function handleAuthSuccess(authenticatedUser) {
        setUser(authenticatedUser);
        localStorage.setItem("brightstart_user", JSON.stringify(authenticatedUser));
        setPage("booking");
    }

    function logout() {
        localStorage.removeItem("brightstart_token");
        localStorage.removeItem("brightstart_user");
        setUser(null);
        setPage("home");
    }

    function changeLearners(step) {
        setLearners((current) => Math.max(1, Math.min(10, current + step)));
    }

    async function submitBooking(booking) {
        setBookingSubmitting(true);
        setBookingError("");
        try {
            await api.createBooking({
                ...booking,
                pricePerWeek: 150,
                totalPrice: booking.learners * 150
            });
            setBooked(true);
        } catch (error) {
            setBookingError(error.message);
        } finally {
            setBookingSubmitting(false);
        }
    }

    return (
        <div className="app-shell">
            <DesktopNav active={page} onNavigate={navigate} user={user} onLogout={logout} />
            <main className="phone-frame" aria-live="polite">
                {page === "home" && <Home onNavigate={navigate} />}
                {page === "programs" && <Programs onNavigate={navigate} />}
                {page === "booking" && (
                    <Booking
                        learners={learners}
                        booked={booked}
                        submitting={bookingSubmitting}
                        error={bookingError}
                        onLearnersChange={changeLearners}
                        onSubmit={submitBooking}
                        onNavigate={navigate}
                    />
                )}
                {page === "progress" && <Progress onNavigate={navigate} />}
                {page === "about" && <About onNavigate={navigate} />}
                {(page === "login" || page === "signup") && (
                    <Auth
                        mode={page}
                        onModeChange={setPage}
                        onSuccess={handleAuthSuccess}
                        onNavigate={navigate}
                    />
                )}
                <BottomNav active={page} onNavigate={navigate} />
            </main>
        </div>
    );
}

function DesktopNav({ active, onNavigate, user, onLogout }) {
    return (
        <aside className="desktop-nav" aria-label="Desktop navigation">
            <div className="brand-lockup">
                <img src="/assets/logo.svg" alt="" className="brand-logo" />
                <div>
                    <strong>BrightStart</strong>
                    <span>English Tutoring</span>
                </div>
            </div>
            {pages.filter((item) => item !== "login" && item !== "signup").map((item) => (
                <button
                    key={item}
                    className={`nav-link ${active === item ? "active" : ""}`}
                    onClick={() => onNavigate(item)}
                >
                    {labelFor(item)}
                </button>
            ))}
            {user ? (
                <button className="nav-link" onClick={onLogout}>Log out</button>
            ) : (
                <button className={`nav-link ${active === "login" ? "active" : ""}`} onClick={() => onNavigate("login")}>
                    Log in
                </button>
            )}
        </aside>
    );
}

function BottomNav({ active, onNavigate }) {
    const items = [
        ["home", HomeIcon],
        ["programs", BookIcon],
        ["booking", CalendarIcon],
        ["progress", BarsIcon],
        ["about", UserIcon]
    ];

    return (
        <nav className="bottom-nav" aria-label="Mobile navigation">
            {items.map(([item, Icon]) => (
                <button
                    key={item}
                    className={active === item ? "active" : ""}
                    onClick={() => onNavigate(item)}
                    aria-label={labelFor(item)}
                >
                    <Icon />
                </button>
            ))}
        </nav>
    );
}

function getInitialPage() {
    const hashPage = window.location.hash.replace("#", "");
    return pages.includes(hashPage) ? hashPage : "home";
}

function labelFor(page) {
    return page.charAt(0).toUpperCase() + page.slice(1);
}

function IconBase({ children }) {
    return <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>;
}

function BookIcon() {
    return <IconBase><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></IconBase>;
}

function CalendarIcon() {
    return <IconBase><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></IconBase>;
}

function HomeIcon() {
    return <IconBase><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M9 21v-6h6v6" /></IconBase>;
}

function BarsIcon() {
    return <IconBase><path d="M4 19V5" /><path d="M8 17v-6M13 17V7M18 17v-3" /></IconBase>;
}

function UserIcon() {
    return <IconBase><circle cx="12" cy="8" r="4" /><path d="M4 22a8 8 0 0 1 16 0" /></IconBase>;
}

createRoot(document.getElementById("root")).render(<App />);
