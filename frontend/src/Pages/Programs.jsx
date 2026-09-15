import React, { useEffect, useState } from "react";
import { api } from "../api";

// Local icons and simple ScreenHeader so this file is self-contained
function IconBase({ children }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
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

function PenIcon() {
    return (
        <IconBase>
            <path d="M12 20h9" />
            <path d="m16.5 3.5 4 4L7 21H3v-4L16.5 3.5Z" />
        </IconBase>
    );
}

function UsersIcon() {
    return (
        <IconBase>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        </IconBase>
    );
}

function ChatIcon() {
    return (
        <IconBase>
            <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
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

function ScreenHeader({ title, color, backTo, onNavigate }) {
    return (
        <header className="screen-header">
            <button className="icon-button back-button" aria-label="Back" onClick={() => onNavigate(backTo)}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
            </button>
            <h2>{title}</h2>
        </header>
    );
}

const iconByTitle = {
    "Reading Lessons": BookIcon,
    "Writing Skills": PenIcon,
    "Homework Help": UsersIcon,
    "Speaking Practice": ChatIcon
};

export default function Programs({ onNavigate }) {
    const [programs, setPrograms] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        api.getPrograms().then(setPrograms).catch((requestError) => setError(requestError.message));
    }, []);

    return (
        <section className="screen active-screen blue-head">
            <ScreenHeader title="Our Programs" color="blue" backTo="home" onNavigate={onNavigate} />
            <div className="screen-body">
                <p className="intro">We offer fun and effective English learning programs for Grade 1-3.</p>
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="program-list">
                    {programs.map((program) => {
                        const Icon = iconByTitle[program.title] || BookIcon;
                        return (
                            <article className="program-card" key={program.title}>
                                <div className={`program-icon ${program.color}`}>
                                    <Icon />
                                </div>
                                <div>
                                    <h3>{program.title}</h3>
                                    <p>{program.body}</p>
                                    <strong>R{program.price} / week</strong>
                                </div>
                            </article>
                        );
                    })}
                </div>
                <button className="primary-action wide" onClick={() => onNavigate("booking")}>
                    <CalendarIcon /> Book a Session
                </button>
            </div>
        </section>
    );
}
