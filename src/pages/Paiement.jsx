import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Initialisation de Stripe avec la clé publique (production)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);


export default function Paiement() {
  const handleClick = async () => {
    const stripe = await stripePromise;

    // Appel à la fonction Netlify qui va générer la session Stripe
    const response = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
    });
    const session = await response.json();

    // Redirection vers Stripe Checkout
    const result = await stripe.redirectToCheckout({ sessionId: session.id });
    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Souscrire à un abonnement</h1>
      <button onClick={handleClick} className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
  Payer avec Stripe
</button>

    </div>
  );
}
