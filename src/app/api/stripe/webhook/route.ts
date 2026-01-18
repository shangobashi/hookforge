import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing webhook configuration" },
      { status: 400 },
    );
  }

  const payload = await req.text();
  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    if (email) {
      const plan = session.metadata?.plan;
      const supabase = supabaseAdmin();
      const tier =
        plan === "studio" || plan === "creator" ? plan : "creator";
      await supabase
        .from("profiles")
        .upsert(
          { email, is_pro: plan === "studio", tier },
          { onConflict: "email" },
        );
    }
  }

  return NextResponse.json({ received: true });
}
