"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckoutProvider } from "@stripe/react-stripe-js";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CartItemsType, ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

interface StripePaymentFormProps {
  shippingForm: ShippingFormInputs;
}

const stripePromise = loadStripe(
  "pk_test_51KwUClGrIx0W8l91S75Zlqxwvs5GpUKHOJk2ALgq1rL8Qld4RDVsNEXmkgHEPZ2YbC3LeYQmdS1BghjydPNwYM2j00tLgmUQy5"
);

const fetchClientSecret = async (token: string, cart: CartItemsType) => {
  return fetch(
    `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cart }),
    }
  )
    .then((res) => res.json())
    .then((data) => data.checkoutSessionClientSecret);
};

const StripePaymentForm = ({ shippingForm }: StripePaymentFormProps) => {
  const [token, setToken] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { cart } = useCartStore();

  useEffect(() => {
    getToken().then((t) => setToken(t));
  }, [getToken]);

  if (!token) return <div>Loading...</div>;

  return (
    <CheckoutProvider
      stripe={stripePromise}
      options={{ fetchClientSecret: () => fetchClientSecret(token, cart) }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutProvider>
  );
};

export default StripePaymentForm;
