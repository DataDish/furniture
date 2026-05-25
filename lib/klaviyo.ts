"use server";

// Server action: subscribe an email to a Klaviyo list with marketing consent.
// Uses Klaviyo's "Bulk Subscribe Profiles" endpoint. Configured via env:
//   KLAVIYO_PRIVATE_API_KEY  (private key, starts with `pk_...`)
//   KLAVIYO_LIST_ID          (the list to add subscribers to)
// When not configured (local/demo), it succeeds silently so the UI still works.

const KLAVIYO_ENDPOINT =
  "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/";
const KLAVIYO_REVISION = "2024-10-15";

const isEmail = (v: string) => /.+@.+\..+/.test(v);

export async function subscribeEmail(
  email: string,
  source = "Maison Noyer Signup",
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!email || !isEmail(email)) {
    return { ok: false, error: "invalid_email" };
  }

  // Not configured yet — don't block the customer experience.
  if (!apiKey || !listId) {
    console.warn("[klaviyo] not configured; skipping subscribe for", email);
    return { ok: true };
  }

  try {
    const res = await fetch(KLAVIYO_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        revision: KLAVIYO_REVISION,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            custom_source: source,
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: { marketing: { consent: "SUBSCRIBED" } },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: { data: { type: "list", id: listId } },
          },
        },
      }),
    });

    // Bulk subscribe returns 202 Accepted on success.
    if (res.status === 202 || res.ok) {
      return { ok: true };
    }

    const detail = await res.text();
    console.error("[klaviyo] subscribe failed", res.status, detail);
    return { ok: false, error: `status_${res.status}` };
  } catch (e) {
    console.error("[klaviyo] subscribe error", e);
    return { ok: false, error: "request_failed" };
  }
}
