import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, gql } from '@apollo/client';
import './PaymentPage.css';

const RELEASE_SEATS = gql`
    mutation ReleaseSeats($rel: SeatReleaseInput!) {
        releaseSeats(rel: $rel) {
            rply
            msg
        }
    }
`;

const MAKE_PAYMENT = gql`
    mutation MakePayment($input: MakePaymentInput!) {
        makePayment(input: $input) {
            bookingID
            message
        }
    }
`;


function PaymentPage() {
    const navigate = useNavigate();
    const { state } = useLocation();

    // Safety check: If no booking ID, kick back to home
    useEffect(() => {
        if (!state?.bookingId) {
            navigate('/');
        }
    }, [state, navigate]);

    // Added showId to destructuring
    const { bookingId, expiresAt, totalPrice, movieTitle, theatreName, seats, showId } = state || {};

    // TIMER LOGIC
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!expiresAt) return;

        const end = new Date(expiresAt).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = Math.ceil((end - now) / 1000);

            if (diff <= 0) {
                // Time Expired!
                clearInterval(interval);
                handleReleaseAndExit("Time expired! Seats have been released.");
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    // Release Mutation
    const [releaseSeats] = useMutation(RELEASE_SEATS);
    const [makePayment, { loading: paying }] = useMutation(MAKE_PAYMENT);

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleReleaseAndExit = async (msg: string = "") => {
        try {
            await releaseSeats({
                variables: {
                    rel: {
                        showID: showId || 0, // Use the passed showId
                        BID: bookingId,
                        userID: "123e4567-e89b-12d3-a456-426614174000", // Valid UUID
                        seatIDs: state?.seatIDs || []
                    }
                }
            });
        } catch (e) {
            console.error("Release failed", e);
        }
        alert(msg || "Booking cancelled.");
        navigate('/');
    };

    // Handle Browser Back / Tab Close
    // Note: This is complex in SPA. We use 'popstate' for back button.
    useEffect(() => {
        const handlePopState = (e: PopStateEvent) => {
            // User pressed back button
            // We can't strictly block it, but we can trigger clean up
            e.preventDefault();
            handleReleaseAndExit("Booking Cancelled.");
        };

        window.history.pushState(null, "", window.location.pathname);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);


    const handlePayment = async () => {
        try {
            // 1. Call Backend to Initiate Payment
            const { data } = await makePayment({
                variables: {
                    input: {
                        bookingID: bookingId,
                        paymentMethodId: "upi_card_mock"
                    }
                }
            });

            if (data?.makePayment?.bookingID) {
                // 2. Simulate PSP Webhook Trigger (User Requirement)
                // Using fetch (POST) instead of axios to avoid dependency issues
                try {
                    await fetch('http://localhost:6001/mock-psp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "transaction_id": "TXN" + Math.floor(Math.random() * 100000), // Random Transaction ID
                            "booking_ref": bookingId, // Use REAL Booking ID
                            "status": "succeeded"
                        })
                    });
                } catch (pspError) {
                    console.warn("PSP Simulation Trigger failed (likely CORS or Network), but Booking confirmed.", pspError);
                }

                // Success!
                alert(`Payment Successful! Booking Confirmed: ${data.makePayment.bookingID}`);
                navigate('/');
            }
        } catch (e) {
            console.error(e);
            alert("Payment Failed. Try again.");
        }
    };

    return (
        <div className="payment-page">
            <div className="payment-container">
                <div className="timer-bar">
                    Complete payment in: <span>{formatTimer(timeLeft)}</span>
                </div>

                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Movie</span>
                        <span>{movieTitle}</span>
                    </div>
                    <div className="summary-row">
                        <span>Theatre</span>
                        <span>{theatreName}</span>
                    </div>
                    <div className="summary-row">
                        <span>Seats</span>
                        <span>{seats}</span>
                    </div>
                    <div className="summary-total">
                        <span>Total Amount</span>
                        <span>₹{totalPrice}</span>
                    </div>
                </div>

                <div className="payment-options">
                    <h3>Payment Valid (Mock)</h3>
                    <p>Click below to simulate successful payment.</p>
                </div>

                <div className="action-buttons">
                    <button className="cancel-btn" onClick={() => handleReleaseAndExit()}>Cancel</button>
                    <button className="pay-now-btn" onClick={handlePayment} disabled={paying}>
                        {paying ? 'Processing...' : `Pay ₹${totalPrice}`}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PaymentPage;
