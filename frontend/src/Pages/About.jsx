import React from "react";

function IconBase({ children }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            {children}
        </svg>
    );
}

function BackIcon() {
    return (
        <IconBase>
            <path d="M19 12H5M12 19l-7-7 7-7" />
        </IconBase>
    );
}

function ScreenHeader({ title, backTo, onNavigate }) {
    return (
        <header className="screen-header">
            <button className="icon-button back-button" aria-label="Back" onClick={() => onNavigate(backTo)}>
                <BackIcon />
            </button>
            <h2>{title}</h2>
        </header>
    );
}

export default function About({ onNavigate }) {
    const contacts = [
        ["P", "Phone", "074 558 4629"],
        ["W", "Whatsapp", "074 558 4629"],
        ["L", "Location", "District Six, Cape Town"],
        ["E", "Email", "info@brightstartenglish.co.za"]
    ];

    return (
        <section className="screen active-screen green-head">
            <ScreenHeader title="About Us" backTo="home" onNavigate={onNavigate} />
            <div className="screen-body about-body">
                <img src="/assets/hero-readers.svg" alt="Children learning English" className="about-image" />
                <p>
                    We are passionate about helping young learners build strong English skills in a fun and supportive
                    environment.
                </p>
                <div className="contact-card">
                    {contacts.map(([letter, title, value]) => (
                        <div key={title}>
                            <span className="contact-icon">{letter}</span>
                            <p>
                                <strong>{title}</strong>
                                {value}
                            </p>
                        </div>
                    ))}
                </div>
                <a className="success-action wide message-link" href="mailto:info@brightstartenglish.co.za">
                    Message us
                </a>
            </div>
        </section>
    );
}
