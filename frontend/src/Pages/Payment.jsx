import React, { useMemo, useState } from "react";

function CardIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
                x="2"
                y="5"
                width="20"
                height="14"
                rx="2"
            />

            <path d="M2 10h20" />
            <path d="M6 15h4" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect
                x="5"
                y="10"
                width="14"
                height="11"
                rx="2"
            />

            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
    );
}

export default function Payment({
                                    booking,
                                    onNavigate
                                }) {

    const [method, setMethod] =
        useState("card");

    const [processing, setProcessing] =
        useState(false);

    const [paid, setPaid] =
        useState(false);

    const [error, setError] =
        useState("");

    const amount =
        Number(booking?.totalPrice || 0);

    const reference = useMemo(() => {

        if (booking?.bookingId) {
            return `BS-${booking.bookingId}`;
        }

        return `BS-${Date.now()
            .toString()
            .slice(-6)}`;

    }, [booking]);

    function handleSubmit(event) {

        if (event) {
            event.preventDefault();
        }

        setError("");

        if (!booking) {

            setError(
                "No booking was found. Please create a booking first."
            );

            return;
        }

        if (method === "card") {

            const form =
                new FormData(
                    event.currentTarget
                );

            const cardNumber =
                String(
                    form.get("cardNumber") || ""
                ).replace(/\s/g, "");

            const expiry =
                String(
                    form.get("expiry") || ""
                );

            const cvv =
                String(
                    form.get("cvv") || ""
                );

            const name =
                String(
                    form.get("cardName") || ""
                ).trim();

            if (
                cardNumber.length !== 16 ||
                !/^\d{16}$/.test(cardNumber)
            ) {

                setError(
                    "Enter a valid 16-digit card number."
                );

                return;
            }

            if (
                !/^\d{2}\/\d{2}$/.test(expiry)
            ) {

                setError(
                    "Enter the expiry date as MM/YY."
                );

                return;
            }

            if (
                !/^\d{3,4}$/.test(cvv)
            ) {

                setError(
                    "Enter a valid 3 or 4 digit CVV."
                );

                return;
            }

            if (!name) {

                setError(
                    "Enter the cardholder name."
                );

                return;
            }
        }

        setProcessing(true);

        /*
         * DEMO PAYMENT PROCESSING
         *
         * No real card is charged.
         * This simulates successful payment
         * for the university presentation.
         */
        window.setTimeout(() => {

            setProcessing(false);
            setPaid(true);

        }, 900);
    }

    /*
     * PAYMENT SUCCESS
     */
    if (paid) {

        return (
            <section
                className="screen active-screen payment-screen"
            >

                <div className="payment-success">

                    <div className="success-icon">
                        ✓
                    </div>

                    <p className="eyebrow">
                        Payment successful
                    </p>

                    <h2>
                        You're all set! 🎉
                    </h2>

                    <p>
                        Your BrightStart payment has
                        been successfully recorded.
                    </p>

                    <div className="payment-receipt">

                        <div>
                            <span>
                                Reference
                            </span>

                            <strong>
                                {reference}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Program
                            </span>

                            <strong>
                                {booking.program ||
                                    "BrightStart Lesson"}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Amount
                            </span>

                            <strong>
                                R{amount.toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>
                                Payment Method
                            </span>

                            <strong>
                                {method === "card"
                                    ? "Card"
                                    : "EFT"}
                            </strong>
                        </div>

                    </div>

                    <button
                        className="primary-action wide"
                        onClick={() =>
                            onNavigate("progress")
                        }
                    >
                        Continue to My Progress
                    </button>

                    <button
                        className="secondary-action wide"
                        onClick={() =>
                            onNavigate("home")
                        }
                    >
                        Back to Home
                    </button>

                </div>

            </section>
        );
    }

    return (
        <section
            className="screen active-screen payment-screen"
        >

            <header className="plain-header">

                <button
                    className="icon-button back-button"
                    aria-label="Back to booking"
                    onClick={() =>
                        onNavigate("booking")
                    }
                >
                    ←
                </button>

                <h2>
                    Secure Payment
                </h2>

            </header>

            <div className="screen-body">

                <div className="payment-intro">

                    <div className="payment-icon">
                        <LockIcon />
                    </div>

                    <div>

                        <p className="eyebrow">
                            BrightStart Checkout
                        </p>

                        <h3>
                            Complete your payment
                        </h3>

                        <p>
                            Your booking is ready.
                            Choose how you'd like to pay.
                        </p>

                    </div>

                </div>

                <div className="payment-total-card">

                    <span>
                        Total to pay
                    </span>

                    <strong>
                        R{amount.toFixed(2)}
                    </strong>

                    <small>
                        Reference: {reference}
                    </small>

                </div>

                <div className="payment-methods">

                    <button
                        type="button"
                        className={
                            method === "card"
                                ? "payment-method active"
                                : "payment-method"
                        }
                        onClick={() =>
                            setMethod("card")
                        }
                    >

                        <CardIcon />

                        <span>
                            Card
                        </span>

                    </button>

                    <button
                        type="button"
                        className={
                            method === "eft"
                                ? "payment-method active"
                                : "payment-method"
                        }
                        onClick={() =>
                            setMethod("eft")
                        }
                    >

                        <span className="eft-icon">
                            🏦
                        </span>

                        <span>
                            EFT
                        </span>

                    </button>

                </div>

                {method === "card" ? (

                    <form
                        className="booking-form payment-form"
                        onSubmit={handleSubmit}
                    >

                        <label>

                            Cardholder name

                            <input
                                name="cardName"
                                type="text"
                                placeholder="Sisonke Mhlana"
                                autoComplete="cc-name"
                                required
                            />

                        </label>

                        <label>

                            Card number

                            <input
                                name="cardNumber"
                                inputMode="numeric"
                                maxLength="19"
                                placeholder="4242 4242 4242 4242"
                                autoComplete="cc-number"
                                required
                            />

                        </label>

                        <div className="payment-input-row">

                            <label>

                                Expiry

                                <input
                                    name="expiry"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    autoComplete="cc-exp"
                                    required
                                />

                            </label>

                            <label>

                                CVV

                                <input
                                    name="cvv"
                                    inputMode="numeric"
                                    maxLength="4"
                                    placeholder="123"
                                    autoComplete="cc-csc"
                                    required
                                />

                            </label>

                        </div>

                        {error && (
                            <p
                                className="form-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            className="primary-action wide"
                            type="submit"
                            disabled={processing}
                        >

                            {processing
                                ? "Processing payment..."
                                : `Pay R${amount.toFixed(2)}`}

                        </button>

                        <p className="payment-note">
                            🔒 Demo checkout:
                            no real card is charged.
                        </p>

                    </form>

                ) : (

                    <div className="eft-card">

                        <h3>
                            Pay by EFT
                        </h3>

                        <p>
                            Use the details below
                            for your BrightStart payment.
                        </p>

                        <div className="bank-details">

                            <div>
                                <span>
                                    Account
                                </span>

                                <strong>
                                    BrightStart Education
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Reference
                                </span>

                                <strong>
                                    {reference}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Amount
                                </span>

                                <strong>
                                    R{amount.toFixed(2)}
                                </strong>
                            </div>

                        </div>

                        <button
                            className="primary-action wide"
                            onClick={() =>
                                handleSubmit()
                            }
                            disabled={processing}
                        >

                            {processing
                                ? "Confirming..."
                                : "I've Made the Payment"}

                        </button>

                        <p className="payment-note">
                            This is a demo EFT flow
                            for the website presentation.
                        </p>

                    </div>

                )}

            </div>

        </section>
    );
}