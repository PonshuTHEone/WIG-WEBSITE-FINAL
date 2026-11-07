const { Stripe } = require("stripe");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-03-25.dahlia" });

  // TODO: Set mode to "subscription" if selling recurring products.
  const mode = "payment";

  const sessionParams = {
    ui_mode: "form",
    billing_address_collection: "auto",
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false },
    submit_type: "auto",
    integration_identifier: "custom_embedded_web_0001",
    mode,
    line_items: [{ price: "price_...", quantity: 1 }], // TODO: your real Stripe Price ID
  };
  if (mode === "subscription") {
    sessionParams.payment_method_collection = "always";
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_secret: session.client_secret }),
    };
  } catch (err) {
    console.error("Stripe error:", err.message);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
