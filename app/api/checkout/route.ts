import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const PLATFORM_FEE = 0.15; // 15%

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bidId, taskId } = await req.json();

  // Verify poster owns this task
  const { data: task } = await supabase.from("tasks")
    .select("id, title, budget, poster_id, status")
    .eq("id", taskId).single();

  if (!task || task.poster_id !== user.id || task.status !== "open") {
    return NextResponse.json({ error: "Invalid task" }, { status: 400 });
  }

  const { data: bid } = await supabase.from("bids")
    .select("id, amount, runner_id")
    .eq("id", bidId).eq("task_id", taskId).single();

  if (!bid) return NextResponse.json({ error: "Invalid bid" }, { status: 400 });

  const amountCents = Math.round(bid.amount * 100);
  const feeCents = Math.round(amountCents * PLATFORM_FEE);
  const payoutCents = amountCents - feeCents;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "cad",
        product_data: {
          name: task.title,
          description: `runit task payment • platform fee 15% included`,
        },
        unit_amount: amountCents,
      },
      quantity: 1,
    }],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://runit-lake.vercel.app"}/tasks/${taskId}?payment=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://runit-lake.vercel.app"}/tasks/${taskId}?payment=cancelled`,
    metadata: {
      taskId,
      bidId,
      runnerId: bid.runner_id,
      posterId: user.id,
      feeCents: String(feeCents),
      payoutCents: String(payoutCents),
    },
  });

  // Store pending payment record
  await supabase.from("payments").upsert({
    task_id: taskId,
    bid_id: bidId,
    stripe_session_id: session.id,
    amount: bid.amount,
    fee: feeCents / 100,
    runner_payout: payoutCents / 100,
    status: "pending",
  }, { onConflict: "task_id" });

  return NextResponse.json({ url: session.url });
}
