"use server";

import { subscribeEmail } from "./klaviyo";

export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  topic?: string;
};

const isEmail = (v: string) => /.+@.+\..+/.test(v);

/**
 * Handles contact / custom-sourcing / trade form submissions.
 * For now it validates, captures the lead in Klaviyo (no-op until configured),
 * and logs server-side. Wire this to email/CRM/Shopify when ready.
 */
export async function submitContact(
  data: ContactPayload,
): Promise<{ ok: boolean; error?: string }> {
  const name = data.name?.trim();
  const email = data.email?.trim();
  const message = data.message?.trim();

  if (!name || !email || !message)
    return { ok: false, error: "missing_fields" };
  if (!isEmail(email)) return { ok: false, error: "invalid_email" };

  try {
    await subscribeEmail(email, `Maison Noyer — ${data.topic ?? "Contact"}`);
  } catch {
    // non-blocking
  }

  console.log("[contact] new submission", {
    topic: data.topic ?? "Contact",
    name,
    email,
    message,
  });

  return { ok: true };
}
