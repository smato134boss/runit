import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { taskId, revieweeId, rating, comment } = await req.json();

  if (!taskId || !revieweeId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Verify task is completed and user participated
  const { data: task } = await supabase
    .from("tasks")
    .select("id, poster_id, runner_id, status")
    .eq("id", taskId)
    .single();

  if (!task || task.status !== "completed") {
    return NextResponse.json({ error: "Task not completed" }, { status: 400 });
  }

  const isPoster = task.poster_id === user.id;
  const isRunner = task.runner_id === user.id;

  if (!isPoster && !isRunner) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 });
  }

  // Reviewer must review the other party
  const expectedReviewee = isPoster ? task.runner_id : task.poster_id;
  if (revieweeId !== expectedReviewee) {
    return NextResponse.json({ error: "Invalid reviewee" }, { status: 400 });
  }

  const { error } = await supabase.from("reviews").insert({
    task_id: taskId,
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    rating,
    comment: comment?.trim() || null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already reviewed" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
