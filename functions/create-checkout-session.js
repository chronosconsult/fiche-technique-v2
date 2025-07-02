const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("Netlify build test");

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Requête vide" }),
      };
    }

    const parsedBody = JSON.parse(event.body);
    const userEmail = parsedBody.userEmail;

    if (!userEmail) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email utilisateur manquant" }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.SITE_URL}/success`,
cancel_url: `${process.env.SITE_URL}/cancel`,

      customer_email: userEmail,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id }),
    };
  } catch (error) {
    console.error("Erreur Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur Stripe" }),
    };
  }
};
