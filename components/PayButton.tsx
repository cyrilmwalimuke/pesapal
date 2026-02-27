"use client";

export default function PayButton() {
  const handlePay = async () => {
    const res = await fetch("/api/pesapal/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "okwomicyril@gmail.com",
        amount: 10,
      }),
    });

    const data = await res.json();

    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    }
  };

  return (
    <button
      onClick={handlePay}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg"
    >
      Pay with Card
    </button>
  );
}