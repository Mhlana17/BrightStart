import React, { useEffect, useState } from "react";
import { api } from "../api";

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
    const [progress, setProgress] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const user = JSON.parse(
            localStorage.getItem("brightstart_user")
        );

        if (!user?.userId) {
            setError("User account could not be found.");
            return;
        }

        api.getProgress(user.userId)
            .then(setProgress)
            .catch((requestError) =>
                setError(requestError.message)
            );
    }, []);

    return (
        <section className="screen active-screen purple-head">
            <ScreenHeader title="My Child's Progress" backTo="home" onNavigate={onNavigate} />
            <div className="screen-body">
                {error && <p className="form-error" role="alert">{error}</p>}
                {!progress && !error && <p className="intro">Loading progress...</p>}
                {progress && <>
                <div className="learner-profile">
                    <img src="/assets/hero-readers.svg" alt="" className="avatar" />
                    <div>
                        <h3>{progress.learnerName}</h3>
                        <a href="#progress" onClick={(event) => event.preventDefault()}>
                            {progress.grade}
                        </a>
                    </div>
                </div>
                <article className="progress-card">
                    <div className="progress-top">
                        <strong>Overall Progress</strong>
                        <span>{progress.status}</span>
                    </div>
                    <div className="meter">
                        <span style={{ width: `${progress.overallProgress}%` }}></span>
                    </div>
                    <b>{progress.overallProgress}%</b>
                </article>
                <h3 className="subheading">Skills Overview</h3>
                <article className="skills-card">
                    {progress.skills.map((skill) => (
                        <div className="skill" key={skill.name}>
                            <span>{skill.name}</span>
                            <i>
                                <b className={skill.color} style={{ width: `${skill.value}%` }}></b>
                            </i>
                            <strong>{skill.value}%</strong>
                        </div>
                    ))}
                </article>
                <h3 className="subheading">Tutor Comments</h3>
                <article className="comment-card">
                    <p>{progress.comment}</p>
                    <span>{progress.tutor}</span>
                    <time>{progress.commentDate}</time>
                </article>
                </>}
            </div>
        </section>
    );
}
