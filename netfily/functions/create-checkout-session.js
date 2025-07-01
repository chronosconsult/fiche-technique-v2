import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { user_id, email } = await req.json();

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.VITE_SITE_URL}/paiement/validation`,
      cancel_url: `${process.env.VITE_SITE_URL}/paiement/erreur`,
      metadata: {
        user_id,
        email,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Erreur lors de la création de la session Stripe:", error);
    return NextResponse.json({ error: "Erreur de création de session" }, { status: 500 });
  }
}
