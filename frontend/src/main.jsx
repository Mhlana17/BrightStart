import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const pages = ["home", "programs", "booking", "progress", "about"];

const programs = [
    {
        title: "Reading Lesson",
        color: "green",
        icon: BookIcon,
        body: "Phonics, word recognition, reading fluency and comprehension."
    },
    {
        title: "Writing Skills",
        color: "yellow",
        icon: PenIcon,
        body: "Sentence building, handwriting, spelling and creative writing."
    },
    {
        title: "Homework Help",
        color: "purple",
        icon: UsersIcon,
        body: "Assistance with school homework and class activities."
    },
    {
        title: "Speaking Practice",
        color: "blue",
        icon: ChatIcon,
        body: "Improve pronunciation, confidence and everyday communication."
    }
];

function App() {
    const [page, setPage] = useState(getInitialPage);
    const [learners, setLearners] = useState(1);
    const [booked, setBooked] = useState(false);

    useEffect(() => {
        window.location.hash = page;
    }, [page]);

    function navigate(nextPage) {
        if (pages.includes(nextPage)) {
            setPage(nextPage);
            setBooked(false);
        }
    }

    function changeLearners(step) {
        setLearners((current) => Math.max(1, Math.min(10, current + step)));
    }

    return (
        <div className="app-shell">
            <DesktopNav active={page} onNavigate={navigate} />
            <main className="phone-frame" aria-live="polite">
                {page === "home" && <Home onNavigate={navigate} />}
                {page === "programs" && <Programs onNavigate={navigate} />}
                {page === "booking" && (
                    <Booking
                        learners={learners}
                        booked={booked}
                        onLearnersChange={changeLearners}
                        onSubmit={() => setBooked(true)}
                        onNavigate={navigate}
                    />
                )}
                {page === "progress" && <Progress onNavigate={navigate} />}
                {page === "about" && <About onNavigate={navigate} />}
                <BottomNav active={page} onNavigate={navigate} />
            </main>
        </div>
    );
}

function DesktopNav({ active, onNavigate }) {
    return (
        <aside className="desktop-nav" aria-label="Desktop navigation">
            <div className="brand-lockup">
                <img src="/assets/logo.svg" alt="" className="brand-logo" />
                <div>
                    <strong>BrightStart</strong>
                    <span>English Tutoring</span>
                </div>
            </div>
            {pages.map((item) => (
                <button
                    key={item}
                    className={`nav-link ${active === item ? "active" : ""}`}
                    onClick={() => onNavigate(item)}
                >
                    {labelFor(item)}
                </button>
            ))}
        </aside>
    );
}

function Home({ onNavigate }) {
    return (
        <section className="screen active-screen home-screen">
            <header className="home-top">
                <button className="icon-button menu-button" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <button className="icon-button" aria-label="Notifications">
                    <BellIcon />
                </button>
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

function Programs({ onNavigate }) {
    return (
        <section className="screen active-screen blue-head">
            <ScreenHeader title="Our Programs" color="blue" backTo="home" onNavigate={onNavigate} />
            <div className="screen-body">
                <p className="intro">We offer fun and effective English learning programs for Grade 1-3.</p>
                <div className="program-list">
                    {programs.map((program) => {
                        const Icon = program.icon;
                        return (
                            <article className="program-card" key={program.title}>
                                <div className={`program-icon ${program.color}`}>
                                    <Icon />
                                </div>
                                <div>
                                    <h3>{program.title}</h3>
                                    <p>{program.body}</p>
                                    <strong>R150 / week</strong>
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

function Booking({ learners, booked, onLearnersChange, onSubmit, onNavigate }) {
    return (
        <section className="screen active-screen booking-screen">
            <header className="plain-header">
                <button className="icon-button back-button" aria-label="Back" onClick={() => onNavigate("programs")}>
                    <BackIcon />
                </button>
                <h2>Book a Session</h2>
            </header>
            <div className="screen-body">
                <h3 className="section-label">Select Details</h3>
                <form
                    className="booking-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        onSubmit();
                    }}
                >
                    <label>
                        Select Grade
                        <select defaultValue="Grade 1">
                            <option>Grade 1</option>
                            <option>Grade 2</option>
                            <option>Grade 3</option>
                        </select>
                    </label>
                    <label>
                        Type of Session
                        <select defaultValue="Group Session">
                            <option>Group Session</option>
                            <option>Private Session</option>
                            <option>Online Session</option>
                        </select>
                    </label>
                    <label>
                        Select Date
                        <input type="date" defaultValue="2026-05-24" />
                    </label>
                    <label>
                        Select Time
                        <input type="time" defaultValue="15:00" />
                    </label>
                    <div className="learners-row">
                        <span>Number of learners</span>
                        <div className="stepper">
                            <button type="button" onClick={() => onLearnersChange(-1)} aria-label="Decrease learners">
                                -
                            </button>
                            <output>{learners}</output>
                            <button type="button" onClick={() => onLearnersChange(1)} aria-label="Increase learners">
                                +
                            </button>
                        </div>
                    </div>
                    <dl className="summary-card">
                        <div>
                            <dt>Session</dt>
                            <dd>Group Session</dd>
                        </div>
                        <div>
                            <dt>Price per week</dt>
                            <dd>R150</dd>
                        </div>
                        <div>
                            <dt>Total</dt>
                            <dd>R{learners * 150}</dd>
                        </div>
                    </dl>
                    <button className="primary-action wide" type="submit">
                        {booked ? "Booking Requested" : "Book Now"}
                    </button>
                </form>
            </div>
        </section>
    );
}

function Progress({ onNavigate }) {
    const skills = [
        ["Reading", "green-bar", 70],
        ["Writing", "blue-bar", 60],
        ["Comprehension", "yellow-bar", 65],
        ["Speaking", "purple-bar", 75]
    ];

    return (
        <section className="screen active-screen purple-head">
            <ScreenHeader title="My Child's Progress" backTo="home" onNavigate={onNavigate} />
            <div className="screen-body">
                <div className="learner-profile">
                    <img src="/assets/hero-readers.svg" alt="" className="avatar" />
                    <div>
                        <h3>Lerato Mongameli</h3>
                        <a href="#progress" onClick={(event) => event.preventDefault()}>
                            Grade 2
                        </a>
                    </div>
                </div>
                <article className="progress-card">
                    <div className="progress-top">
                        <strong>Overall Progress</strong>
                        <span>Improving</span>
                    </div>
                    <div className="meter">
                        <span style={{ width: "65%" }}></span>
                    </div>
                    <b>65%</b>
                </article>
                <h3 className="subheading">Skills Overview</h3>
                <article className="skills-card">
                    {skills.map(([skill, color, value]) => (
                        <div className="skill" key={skill}>
                            <span>{skill}</span>
                            <i>
                                <b className={color} style={{ width: `${value}%` }}></b>
                            </i>
                            <strong>{value}%</strong>
                        </div>
                    ))}
                </article>
                <h3 className="subheading">Tutor Comments</h3>
                <article className="comment-card">
                    <p>Lerato is showing great improvement in reading short stories. Keep practicing at home!</p>
                    <span>Teacher Amanda</span>
                    <time>20 May 2026</time>
                </article>
            </div>
        </section>
    );
}

function About({ onNavigate }) {
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
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            {children}
        </svg>
    );
}

function BackIcon() {
    return <IconBase><path d="M19 12H5M12 19l-7-7 7-7" /></IconBase>;
}

function BellIcon() {
    return <IconBase><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></IconBase>;
}

function BookIcon() {
    return <IconBase><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" /></IconBase>;
}

function PenIcon() {
    return <IconBase><path d="M12 20h9" /><path d="m16.5 3.5 4 4L7 21H3v-4L16.5 3.5Z" /></IconBase>;
}

function UsersIcon() {
    return <IconBase><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /></IconBase>;
}

function ChatIcon() {
    return <IconBase><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" /></IconBase>;
}

function CalendarIcon() {
    return <IconBase><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></IconBase>;
}

function PhoneIcon() {
    return <IconBase><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.35 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.05 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.31 1.85.53 2.81.66A2 2 0 0 1 22 16.92Z" /></IconBase>;
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
