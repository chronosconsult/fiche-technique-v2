const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Requête vide" }),
      };
    }

    const parsedBody = JSON.parse(event.body);
    const email = parsedBody.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email requis" }),
      };
    }

    const customers = await stripe.customers.list({ email });
    if (!customers.data.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Aucun client trouvé pour cet email" }),
      };
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${process.env.URL}/dashboard`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: portalSession.url }),
    };
  } catch (error) {
    console.error("Erreur portail Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur Stripe" }),
    };
  }
};
