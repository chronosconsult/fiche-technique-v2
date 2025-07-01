import Stripe from "stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2022-11-15" });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const buf = Buffer.from(event.body, "utf8");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Erreur de vérification du webhook:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const session = stripeEvent.data.object;

  switch (stripeEvent.type) {
    case "checkout.session.completed":
      await supabase.from("abonnements").insert({
        user_id: session.metadata.user_id,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        status: "active",
        start_date: new Date().toISOString(),
      });
      break;

    case "customer.subscription.deleted":
      await supabase
        .from("abonnements")
        .update({ status: "canceled" })
        .eq("stripe_subscription_id", session.id);
      break;

    default:
      console.log(`Unhandled event type: ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
