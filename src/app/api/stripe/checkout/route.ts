import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type Plan = "creator" | "studio";
type Interval = "monthly" | "yearly";

const priceMap: Record<Plan, Record<Interval, string | undefined>> = {
  creator: {
    monthly: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_CREATOR_YEARLY_PRICE_ID,
  },
  studio: {
    monthly: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID,
    yearly: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID,
  },
};

export async function POST(req: Request) {
  try {
    const { plan, interval } = (await req.json()) as {
      plan?: Plan;
      interval?: Interval;
    };
    const selectedPlan = plan ?? "creator";
    const selectedInterval = interval ?? "monthly";
    const priceId = priceMap[selectedPlan]?.[selectedInterval];
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing Stripe price configuration" },
        { status: 400 },
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/app?status=success`,
      cancel_url: `${appUrl}/app?status=cancel`,
      allow_promotion_codes: true,
      metadata: {
        plan: selectedPlan,
        interval: selectedInterval,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
