# Stripe Integration: To Do

Start here. This file lists everything left to finish the Stripe Checkout setup on Netlify.

## Values to Replace

The following values are placeholders and must be updated before going live.

**Files containing placeholders:**
- [netlify/functions/create-checkout-session.js](netlify/functions/create-checkout-session.js)
- [public/index.html](public/index.html)

| Field | Current Value | What to Set |
|-------|--------------|-------------|
| mode | payment | Keep `"payment"` for one-time purchases (wigs and toppers). Use `"subscription"` only for recurring billing. |
| line_items[].price | price_... | Your actual Stripe Price ID from the Dashboard (https://dashboard.stripe.com/prices) or API. Create the Price in **CAD** to match your website prices. |
| STRIPE_PUBLISHABLE_KEY (in public/index.html) | pk_test_... | Your publishable key (starts with `pk_test_` or `pk_live_`). It is safe to put in the page. |
| STRIPE_SECRET_KEY (Netlify environment variable) | not set | Your secret key. Set it in Netlify under Site configuration > Environment variables. Never put it in index.html. |

## Configured Parameters

These parameters were configured in Checkout Studio and are already set correctly.

**Files containing these parameters:**
- [netlify/functions/create-checkout-session.js](netlify/functions/create-checkout-session.js)

| Parameter | Value |
|-----------|-------|
| ui_mode | form |
| billing_address_collection | auto |
| phone_number_collection | enabled: false |
| automatic_tax | enabled: false |
| submit_type | auto |
| integration_identifier | custom_embedded_web_0001 |
| payment_method_collection | always (only applied if mode is "subscription") |

The payment form look (appearance) is set in [public/index.html](public/index.html) inside `openCheckout()`.

## Project structure

```
public/index.html                              Your website (Stripe.js, Checkout button, payment form)
netlify/functions/create-checkout-session.js   Creates the Stripe Checkout Session
netlify.toml                                   Tells Netlify where the site and function are
package.json                                   Dependency (stripe)
.env.example                                   Template for local testing only
STRIPE_INTEGRATION_TODO.md
```

## Setup

1. Put this whole folder on GitHub (free), or install the Netlify CLI (`npm install -g netlify-cli`). The function needs the `stripe` package installed, and Netlify does that during a build from GitHub or the CLI. A plain drag-and-drop of only the site file will not include the checkout function.
2. In Netlify, add a new site from that GitHub repo (or run `netlify deploy --prod`). Netlify reads `netlify.toml` and sets everything up.
3. In Netlify: Site configuration > Environment variables > add `STRIPE_SECRET_KEY` with your secret key. Redeploy after adding it.
4. Replace `pk_test_...` in `public/index.html` (search for `STRIPE_PUBLISHABLE_KEY`) with your publishable key.
5. In Stripe, create a Product and a CAD Price, then put its Price ID in the function file (`line_items`).
6. To test on your own computer first: copy `.env.example` to `.env`, run `npm install`, then `netlify dev` and open the address it prints.

## How it works

1. The visitor clicks **Checkout** in the site header.
2. The page calls `POST /api/create-checkout-session`, which Netlify forwards to the function.
3. The function creates a Checkout Session with Stripe and returns its `client_secret`.
4. The page loads Stripe.js (`https://js.stripe.com/dahlia/stripe.js`) and shows the payment form in the `#checkout-form` box.
5. The visitor pays and the form confirms the payment.

Stripe is only started when **Checkout** is clicked, so a missing key never breaks the rest of the site.

## Testing

Use test keys (`pk_test_` / `sk_test_`). Test card: `4242 4242 4242 4242`, any future expiry date, any 3-digit CVC, any postal code. More test cards: https://docs.stripe.com/testing

## Next steps

- **Products:** right now the button charges one placeholder Price. Your site has 43 products with many colours and lengths. You will need a Stripe Price for each item you sell online, then send the customer's selection to the function so it can build `line_items`.
- **After payment:** nothing happens yet beyond Stripe recording the payment. To fulfill orders or send confirmation emails, add a webhook for `checkout.session.completed` (https://dashboard.stripe.com/workbench/webhooks).
- **Going live:** swap to live keys (publishable key in index.html, secret key in Netlify).
- **Pre-order / custom items:** decide whether those should be paid online or stay as enquiries.

## Resources

- https://support.stripe.com
- https://docs.stripe.com/mcp
