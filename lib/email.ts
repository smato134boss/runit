import { Resend } from "resend";

const getResend = () => new Resend(process.env.RESEND_API_KEY);
const FROM = "Runly <notifications@runly.ca>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://runly.ca";

export async function sendNewBidEmail({
  posterEmail, posterName, runnerName, taskTitle, taskId, amount,
}: {
  posterEmail: string; posterName: string; runnerName: string;
  taskTitle: string; taskId: string; amount: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: posterEmail,
    subject: `New offer on "${taskTitle}"`,
    html: emailHtml({
      title: "You got a new offer!",
      body: `<p>Hi ${posterName},</p>
<p><strong>${runnerName}</strong> sent an offer of <strong>$${amount.toFixed(0)} CAD</strong> on your task:</p>
<p style="font-size:18px;font-weight:700;color:#1C1917;">${taskTitle}</p>`,
      cta: { label: "Review the offer", url: `${APP_URL}/en/tasks/${taskId}` },
    }),
  });
}

export async function sendBidAcceptedEmail({
  runnerEmail, runnerName, posterName, taskTitle, taskId, amount,
}: {
  runnerEmail: string; runnerName: string; posterName: string;
  taskTitle: string; taskId: string; amount: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: runnerEmail,
    subject: `Your offer was accepted — "${taskTitle}"`,
    html: emailHtml({
      title: "Your offer was accepted! 🎉",
      body: `<p>Hi ${runnerName},</p>
<p><strong>${posterName}</strong> accepted your offer of <strong>$${amount.toFixed(0)} CAD</strong>.</p>
<p>Payment has been secured in escrow. Complete the task and the money is yours.</p>`,
      cta: { label: "Open task & chat", url: `${APP_URL}/en/tasks/${taskId}` },
    }),
  });
}

export async function sendPaymentReleasedEmail({
  runnerEmail, runnerName, taskTitle, amount,
}: {
  runnerEmail: string; runnerName: string; taskTitle: string; amount: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: runnerEmail,
    subject: `Payment released — $${amount.toFixed(0)} CAD`,
    html: emailHtml({
      title: "Payment released! 💸",
      body: `<p>Hi ${runnerName},</p>
<p>Great work! The poster confirmed the task is done.</p>
<p><strong>$${amount.toFixed(2)} CAD</strong> has been released for:</p>
<p style="font-size:18px;font-weight:700;color:#1C1917;">${taskTitle}</p>`,
      cta: { label: "View earnings", url: `${APP_URL}/earnings` },
    }),
  });
}

export async function sendPayoutRequestEmail({
  adminEmail, runnerName, runnerEmail, interacEmail, amount,
}: {
  adminEmail: string; runnerName: string; runnerEmail: string; interacEmail: string; amount: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: adminEmail,
    subject: `Payout request — $${amount.toFixed(2)} CAD from ${runnerName}`,
    html: emailHtml({
      title: `Payout request: $${amount.toFixed(2)} CAD`,
      body: `<p>Runner <strong>${runnerName}</strong> (${runnerEmail}) has requested a payout.</p>
<p><strong>Amount:</strong> $${amount.toFixed(2)} CAD</p>
<p><strong>Send Interac e-Transfer to:</strong> ${interacEmail}</p>
<p>Once sent, mark as paid in the admin panel: <a href="${APP_URL}/admin/payouts">admin panel</a></p>`,
      cta: { label: "View admin panel", url: `${APP_URL}/admin/payouts` },
    }),
  });
}

export async function sendPayoutSentEmail({
  email, name, amount,
}: {
  email: string; name: string; amount: number;
}) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: `Your payout of $${amount.toFixed(2)} CAD has been sent`,
    html: emailHtml({
      title: "Payout sent! 💸",
      body: `<p>Hi ${name},</p>
<p>We've sent your payout of <strong>$${amount.toFixed(2)} CAD</strong> via Interac e-Transfer. Check your inbox — it usually arrives within a few minutes.</p>
<p>Keep completing tasks to earn more!</p>`,
      cta: { label: "Browse tasks", url: `${APP_URL}/tasks/browse` },
    }),
  });
}

export async function sendVerificationApprovedEmail({
  email, name,
}: {
  email: string; name: string;
}) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Your identity has been verified ✓",
    html: emailHtml({
      title: "You're verified! 🎉",
      body: `<p>Hi ${name},</p>
<p>Your identity has been verified. You now have a <strong>✓ Verified</strong> badge on your profile — task posters can see you're a trusted runner.</p>
<p>Start browsing tasks and send your first offer!</p>`,
      cta: { label: "Browse tasks", url: `${APP_URL}/tasks/browse` },
    }),
  });
}

export async function sendVerificationRejectedEmail({
  email, name, reason,
}: {
  email: string; name: string; reason?: string;
}) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Identity verification — action required",
    html: emailHtml({
      title: "Verification was not approved",
      body: `<p>Hi ${name},</p>
<p>Unfortunately we could not verify your identity with the documents provided.</p>
${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
<p>Please resubmit with a clear photo of your government-issued ID. Make sure all details are legible.</p>`,
      cta: { label: "Resubmit documents", url: `${APP_URL}/verify` },
    }),
  });
}

function emailHtml({ title, body, cta }: { title: string; body: string; cta: { label: string; url: string } }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FAFAF8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #E7E5E4;">
    <div style="background:#F97316;padding:24px 32px;">
      <span style="font-size:28px;font-weight:800;color:white;letter-spacing:-1px;">Runly</span>
    </div>
    <div style="padding:32px;">
      <h1 style="font-size:22px;font-weight:800;color:#1C1917;margin:0 0 16px;letter-spacing:-0.5px;">${title}</h1>
      <div style="font-size:15px;color:#44403C;line-height:1.7;">${body}</div>
      <div style="margin-top:28px;">
        <a href="${cta.url}" style="display:inline-block;background:#F97316;color:white;text-decoration:none;padding:14px 28px;border-radius:999px;font-size:15px;font-weight:700;">${cta.label} →</a>
      </div>
    </div>
    <div style="padding:20px 32px;border-top:1px solid #F5F4F2;">
      <p style="font-size:12px;color:#A8A29E;margin:0;">Runly — Canada's task marketplace. <a href="${APP_URL}" style="color:#F97316;text-decoration:none;">runly.ca</a></p>
    </div>
  </div>
</body>
</html>`;
}
