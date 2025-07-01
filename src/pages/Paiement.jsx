import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";

// Initialisation de Stripe avec la clé publique (production)
const stripePromise = loadStripe("pk_live_51Rg3yzKjn3k9Hmh5u5p0ERQB5nbmuBc0mXuOYenYrBvEi2jXa8sNhU6dUskAiYtqTxBTHx66UmNfRDYoCByqbztp00R2wpjJ9q");

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
      <Button onClick={handleClick} className="text-white bg-blue-600 hover:bg-blue-700">
        Payer avec Stripe
      </Button>
    </div>
  );
}
