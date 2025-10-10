"use client";

import { ShippingFormInputs } from "@repo/types";
import { PaymentElement, useCheckout } from "@stripe/react-stripe-js";
import { ConfirmError } from "@stripe/stripe-js";
import { useState } from "react";

interface ShippingFormProps {
  shippingForm: ShippingFormInputs;
}

function CheckoutForm({ shippingForm }: ShippingFormProps) {
  const checkout = useCheckout();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ConfirmError | null>(null);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await checkout.updateEmail(shippingForm.email);
    await checkout.updateShippingAddress({
      name: shippingForm.name,
      address: {
        line1: shippingForm.address,
        city: shippingForm.city,
        country: "US",
      },
    });

    const response = await checkout.confirm();

    if (response.type === "error") {
      setError(response.error);
    }
    setLoading(false);
  };

  return (
    <form>
      <PaymentElement options={{ layout: "accordion" }} />
      <button disabled={loading} onClick={handlePayment}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div>{error.message}</div>}
    </form>
  );
}

export default CheckoutForm;
