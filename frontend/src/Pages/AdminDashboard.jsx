import React, {
    useEffect,
    useState
} from "react";

import { api } from "../api";

export default function AdminDashboard({
                                           onLogout
                                       }) {

    const [bookings, setBookings] =
        useState([]);

    const [learners, setLearners] =
        useState([]);

    const [selectedLearner, setSelectedLearner] =
        useState(null);

    const [progress, setProgress] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const [saving, setSaving] =
        useState(false);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            setLoading(true);
            setError("");

            const [
                bookingData,
                learnerData
            ] = await Promise.all([
                api.getBookingRequests(),
                api.getLearners()
            ]);

            setBookings(bookingData);
            setLearners(learnerData);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);
        }
    }

    async function approveBooking(id) {

        try {

            await api.approveBooking(id);

            setMessage(
                "Booking approved successfully."
            );

            await loadDashboard();

        } catch (err) {

            setError(err.message);
        }
    }

    async function rejectBooking(id) {

        try {

            await api.rejectBooking(id);

            setMessage(
                "Booking rejected. The learner can be notified that the session is overbooked."
            );

            await loadDashboard();

        } catch (err) {

            setError(err.message);
        }
    }

    async function selectLearner(learner) {

        try {

            setSelectedLearner(learner);

            const data =
                await api.getLearnerProgress(
                    learner.userId
                );

            setProgress(data);

        } catch (err) {

            setError(err.message);
        }
    }

    function updateProgressField(
        field,
        value
    ) {

        setProgress({
            ...progress,
            [field]: value
        });
    }
    function calculateOverallProgress(progress) {
        if (!progress) {
            return 0;
        }

        const reading = Number(progress.reading) || 0;
        const writing = Number(progress.writing) || 0;
        const comprehension = Number(progress.comprehension) || 0;
        const speaking = Number(progress.speaking) || 0;

        return Math.round(
            (
                reading +
                writing +
                comprehension +
                speaking
            ) / 4
        );
    }

    async function saveProgress(event) {

        event.preventDefault();

        if (!progress) {
            return;
        }

        try {

            setSaving(true);
            setError("");

            const updated =
                await api.updateLearnerProgress(
                    progress.learnerId,
                    {
                        reading:
                            Number(progress.reading),

                        writing:
                            Number(progress.writing),

                        comprehension:
                            Number(
                                progress.comprehension
                            ),

                        speaking:
                            Number(progress.speaking),

                        status:
                        progress.status,

                        comment:
                        progress.comment,

                        tutor:
                        progress.tutor
                    }
                );
            setProgress(updated);

            setMessage(
                "Learner progress updated successfully."
            );

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);
        }
    }


    return (
        <section className="admin-dashboard">

            <header className="admin-header">

                <div>

                    <h1>
                        BrightStart Admin
                    </h1>

                    <p>
                        Manage bookings and learner progress
                    </p>

                </div>

                <button
                    className="admin-logout"
                    onClick={onLogout}
                >
                    Logout
                </button>

            </header>

            {message && (
                <div className="admin-success">
                    {message}
                </div>
            )}

            {error && (
                <div className="admin-error">
                    {error}
                </div>
            )}

            {loading ? (
                <p className="admin-loading">
                    Loading dashboard...
                </p>
            ) : (
                <>

                    {/* BOOKING REQUESTS */}

                    <section className="admin-section">

                        <div className="admin-section-title">

                            <div>

                                <h2>
                                    Booking Requests
                                </h2>

                                <p>
                                    Review new lesson booking requests.
                                </p>

                            </div>

                            <span className="admin-count">
                                {bookings.length}
                            </span>

                        </div>

                        {bookings.length === 0 ? (

                            <div className="admin-empty">
                                No pending booking requests.
                            </div>

                        ) : (

                            <div className="booking-request-list">

                                {bookings.map(
                                    (booking) => (

                                        <article
                                            className="booking-request-card"
                                            key={
                                                booking.bookingId
                                            }
                                        >

                                            <div>

                                                <h3>
                                                    {booking.userName ||
                                                        "Learner"}
                                                </h3>

                                                <p>
                                                    {booking.userEmail}
                                                </p>

                                            </div>

                                            <div className="booking-request-details">

                                                <span>
                                                    <strong>
                                                        Grade:
                                                    </strong>{" "}
                                                    {booking.grade}
                                                </span>

                                                <span>
                                                    <strong>
                                                        Session:
                                                    </strong>{" "}
                                                    {booking.sessionType}
                                                </span>

                                                <span>
                                                    <strong>
                                                        Date:
                                                    </strong>{" "}
                                                    {booking.bookingDate}
                                                </span>

                                                <span>
                                                    <strong>
                                                        Time:
                                                    </strong>{" "}
                                                    {booking.bookingTime}
                                                </span>

                                                <span>
                                                    <strong>
                                                        Learners:
                                                    </strong>{" "}
                                                    {booking.learners}
                                                </span>

                                                <span>
                                                    <strong>
                                                        Total:
                                                    </strong>{" "}
                                                    R{booking.totalPrice}
                                                </span>

                                            </div>

                                            <div className="booking-actions">

                                                <button
                                                    className="approve-button"
                                                    onClick={() =>
                                                        approveBooking(
                                                            booking.bookingId
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject-button"
                                                    onClick={() =>
                                                        rejectBooking(
                                                            booking.bookingId
                                                        )
                                                    }
                                                >
                                                    Reject
                                                </button>

                                            </div>

                                        </article>

                                    )
                                )}

                            </div>

                        )}

                    </section>

                    {/* LEARNER PROGRESS */}

                    <section className="admin-section">

                        <div className="admin-section-title">

                            <div>

                                <h2>
                                    Learner Progress
                                </h2>

                                <p>
                                    View and update registered learners.
                                </p>

                            </div>

                            <span className="admin-count">
                                {learners.length}
                            </span>

                        </div>

                        <div className="learner-admin-layout">

                            <div className="learner-list">

                                {learners.map(
                                    (learner) => (

                                        <button
                                            key={
                                                learner.userId
                                            }
                                            className={
                                                `learner-list-item ${
                                                    selectedLearner?.userId ===
                                                    learner.userId
                                                        ? "selected"
                                                        : ""
                                                }`
                                            }
                                            onClick={() =>
                                                selectLearner(
                                                    learner
                                                )
                                            }
                                        >

                                            <strong>
                                                {learner.name}
                                            </strong>

                                            <span>
                                                {learner.email}
                                            </span>

                                        </button>

                                    )
                                )}

                            </div>

                            <div className="progress-editor">

                                {!progress ? (

                                    <div className="admin-empty">
                                        Select a learner to edit their progress.
                                    </div>

                                ) : (

                                    <form
                                        onSubmit={
                                            saveProgress
                                        }
                                    >

                                        <div className="progress-grid">

                                            {[
                                                ["reading", "Reading"],
                                                ["writing", "Writing"],
                                                ["comprehension", "Comprehension"],
                                                ["speaking", "Speaking"]
                                            ].map(
                                                ([field, label]) => (
                                                    <label key={field}>
                                                        {label}

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={
                                                                progress[field] ?? 0
                                                            }
                                                            onChange={(event) =>
                                                                updateProgressField(
                                                                    field,
                                                                    event.target.value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    </label>
                                                )
                                            )}

                                        </div>

                                        <div className="overall-progress-display">

                                            <div>
        <span>
            Overall Progress
        </span>

                                                <strong>
                                                    {calculateOverallProgress(progress)}%
                                                </strong>
                                            </div>

                                            <small>
                                                Automatically calculated from Reading,
                                                Writing, Comprehension and Speaking.
                                            </small>

                                        </div>
                                        <div className="overall-progress-display">
                                            <span>Overall Progress</span>

                                            <strong>
                                                {calculateOverallProgress(progress)}%
                                            </strong>

                                            <small>
                                                Automatically calculated from the four skill marks.
                                            </small>
                                        </div>

                                        <label>
                                            Status

                                            <select
                                                value={
                                                    progress.status
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateProgressField(
                                                        "status",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >

                                                <option>
                                                    Not started
                                                </option>

                                                <option>
                                                    In progress
                                                </option>

                                                <option>
                                                    Good progress
                                                </option>

                                                <option>
                                                    Excellent progress
                                                </option>

                                                <option>
                                                    Completed
                                                </option>

                                            </select>

                                        </label>

                                        <label>
                                            Tutor

                                            <input
                                                type="text"
                                                value={
                                                    progress.tutor
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateProgressField(
                                                        "tutor",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                        </label>

                                        <label>
                                            Tutor Comment

                                            <textarea
                                                rows="5"
                                                value={
                                                    progress.comment
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    updateProgressField(
                                                        "comment",
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                        </label>

                                        <button
                                            className="save-progress-button"
                                            type="submit"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Progress"}
                                        </button>

                                    </form>

                                )}

                            </div>

                        </div>

                    </section>

                </>
            )}

        </section>
    );
}