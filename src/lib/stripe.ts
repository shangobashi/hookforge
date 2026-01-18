import Stripe from "stripe";

export const getStripe = () => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(stripeKey, { apiVersion: "2025-12-15.clover" });
};
