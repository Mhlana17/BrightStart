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

export default function Booking({ learners, booked, onLearnersChange, onSubmit, onNavigate }) {
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
