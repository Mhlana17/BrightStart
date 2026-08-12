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

export default function Progress({ onNavigate }) {
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
