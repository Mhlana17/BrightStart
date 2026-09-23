import React from "react";

function IconBase({ children }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            {children}
        </svg>
    );
}

function BellIcon() {
    return (
        <IconBase>
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
            <path d="M13.7 21a2 2 0 0 1-3.4 0" />
        </IconBase>
    );
}
function UserIcon() {
    return (
        <IconBase>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 22a8 8 0 0 1 16 0" />
        </IconBase>
    );
}


function CalendarIcon() {
    return (
        <IconBase>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
        </IconBase>
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

function PhoneIcon() {
    return (
        <IconBase>
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.05 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92Z" />
        </IconBase>
    );
}

export default function Home({ onNavigate, currentUser }) {
    return (
        <section className="screen active-screen home-screen">
            <header className="home-top">
                <div className="home-profile">
                    <button
                        className="profile-button"
                        aria-label="User profile"
                    >
                        <UserIcon />
                    </button>

                    {currentUser && (
                        <span className="profile-name">
            {currentUser.name}
        </span>
                    )}
                </div>

            </header>

            <div className="center-brand">
                <img src="/assets/logo.svg" alt="" className="home-logo" />
                <h1>BrightStart</h1>
                <p>English Tutoring</p>
            </div>

            <div className="hero-copy">
                <h2>
                    Building strong English foundations for <span>Grade 1 - 3</span> learners.
                </h2>
                <p>We help children read, write and understand with confidence</p>
            </div>

            <img src="/assets/hero-readers.svg" alt="Children reading together" className="hero-image" />

            <div className="cta-stack">
                <button className="primary-action" onClick={() => onNavigate("booking")}>
                    <CalendarIcon /> Book a Session
                </button>
                <button className="success-action" onClick={() => onNavigate("programs")}>
                    <BookIcon /> View Programs
                </button>
                <button className="muted-action" onClick={() => onNavigate("about")}>
                    <PhoneIcon /> Contact us
                </button>
            </div>
        </section>
    );
}
