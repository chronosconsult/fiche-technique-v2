// 🔒 Version corrigée de webhook.js (ESModules, sécurisé, robuste)

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sig = event.headers["stripe-signature"];
  if (!sig) {
    return { statusCode: 400, body: "Signature Stripe manquante." };
  }

  let stripeEvent;
  try {
    const buf = Buffer.from(event.body, "utf8");
    stripeEvent = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Erreur de vérification du webhook:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const session = stripeEvent.data?.object;
  if (!session) {
    return { statusCode: 400, body: "Objet session manquant dans l'événement." };
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const { customer, subscription, metadata } = session;

        if (!metadata?.user_id) {
          return {
            statusCode: 400,
            body: "user_id manquant dans metadata Stripe",
          };
        }

        const { error } = await supabase.from("abonnements").insert({
          user_id: metadata.user_id,
          stripe_customer_id: customer,
          stripe_subscription_id: subscription,
          status: "active",
          start_date: new Date().toISOString(),
        });

        if (error) {
          console.error("Erreur Supabase INSERT:", error.message);
          return { statusCode: 500, body: "Erreur d'enregistrement abonnement" };
        }

        break;
      }

      case "customer.subscription.deleted": {
        const { id: subscriptionId } = session;

        const { error } = await supabase
          .from("abonnements")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscriptionId);

        if (error) {
          console.error("Erreur Supabase UPDATE:", error.message);
          return { statusCode: 500, body: "Erreur de mise à jour abonnement" };
        }

        break;
      }

      default:
        console.log(`Type d'événement non géré: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (err) {
    console.error("Erreur traitement webhook:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur interne webhook" }),
    };
  }
};