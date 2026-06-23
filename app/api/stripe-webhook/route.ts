import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createServerClient } from "@supabase/supabase-js";

// Admin client bypasses RLS
function adminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Skip signature check if webhook secret not yet configured (local dev)
  let event;
  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
  } else {
    event = JSON.parse(body);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { taskId, bidId, runnerId } = session.metadata;

    const supabase = adminClient();

    // Mark bid as accepted
    await supabase.from("bids").update({ status: "accepted" }).eq("id", bidId);

    // Reject other bids
    await supabase.from("bids").update({ status: "rejected" })
      .eq("task_id", taskId).neq("id", bidId);

    // Move task to in_progress
    await supabase.from("tasks").update({ status: "in_progress", runner_id: runnerId })
      .eq("id", taskId);

    // Update payment status
    await supabase.from("payments").update({ status: "paid" })
      .eq("stripe_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } };
