import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendNewBidEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, amount, message } = await req.json();

  if (!taskId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { data: task } = await supabase
    .from("tasks")
    .select("id, title, status, poster_id, poster:profiles!poster_id(full_name, email)")
    .eq("id", taskId)
    .single();

  if (!task || task.status !== "open") {
    return NextResponse.json({ error: "Task not available" }, { status: 400 });
  }

  if (task.poster_id === user.id) {
    return NextResponse.json({ error: "Cannot bid on own task" }, { status: 400 });
  }

  const { data: runner } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const { error } = await supabase.from("bids").insert({
    task_id: taskId,
    runner_id: user.id,
    amount: parseFloat(amount),
    message: message?.trim() || null,
    status: "pending",
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already bid on this task" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email to poster
  const poster = task.poster as { full_name: string; email: string } | null;
  if (poster?.email) {
    await sendNewBidEmail({
      posterEmail: poster.email,
      posterName: poster.full_name || "there",
      runnerName: runner?.full_name || "A runner",
      taskTitle: task.title,
      taskId: task.id,
      amount: parseFloat(amount),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { bidId, amount, message } = await req.json();

  const { error } = await supabase
    .from("bids")
    .update({ amount: parseFloat(amount), message: message?.trim() || null })
    .eq("id", bidId)
    .eq("runner_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
