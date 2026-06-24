import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentReleasedEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId } = await req.json();

  const { data: task } = await supabase
    .from("tasks")
    .select("id, title, poster_id, runner_id, status")
    .eq("id", taskId)
    .single();

  if (!task || task.poster_id !== user.id || task.status !== "in_progress") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await supabase.from("tasks").update({ status: "completed" }).eq("id", taskId);
  await supabase.from("payments").update({ status: "released" }).eq("task_id", taskId);

  // Email runner
  if (task.runner_id) {
    const { data: runner } = await supabase
      .from("profiles").select("full_name, email").eq("id", task.runner_id).single();
    const { data: payment } = await supabase
      .from("payments").select("runner_payout").eq("task_id", taskId).single();

    if (runner?.email) {
      await sendPaymentReleasedEmail({
        runnerEmail: runner.email,
        runnerName: runner.full_name || "there",
        taskTitle: task.title,
        amount: payment?.runner_payout ?? 0,
      }).catch(() => {});
    }
  }

  return NextResponse.json({ success: true });
}
