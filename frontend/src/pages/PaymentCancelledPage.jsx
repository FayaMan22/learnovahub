import usePageTitle from "../hooks/usePageTitle";

export default function PaymentCancelledPage() {
  usePageTitle("Payment Cancellation");
  return (
    <section className="payment-page">
      <div className="payment-card cancelled-card">
        <h1>Payment Cancelled</h1>
        <p>
          Your payment was cancelled. You can try again anytime.
        </p>
      </div>
    </section>
  );
}