import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createClient } from "@supabase/supabase-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function Paiement() {
  const handleClick = async () => {
    try {
      const stripe = await stripePromise;
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !user.email) {
        alert("Utilisateur non connecté ou email indisponible.");
        return;
      }

      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        alert("Échec de la création de la session Stripe.");
        return;
      }

      const session = await response.json();
      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) {
        console.error(result.error.message);
        alert("Erreur de redirection vers Stripe.");
      }
    } catch (err) {
      console.error("Erreur inattendue:", err);
      alert("Erreur technique. Consulte la console pour plus de détails.");
    }
  };

  const handlePortalRedirect = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !user.email) {
        alert("Utilisateur non connecté ou email indisponible.");
        return;
      }

      const response = await fetch("/.netlify/functions/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erreur API:", errorText);
        alert("Échec de la redirection vers le portail client.");
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la récupération du portail client.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur de redirection vers Stripe.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Souscrire à un abonnement</h1>
      <button
        onClick={handleClick}
        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
      >
        Payer avec Stripe
      </button>
      <button
        onClick={handlePortalRedirect}
        className="text-white bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded mt-4"
      >
        Gérer mon abonnement
      </button>
    </div>
  );
}
