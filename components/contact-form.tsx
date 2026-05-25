"use client";

import { submitContact } from "lib/contact";
import { useState } from "react";
import { toast } from "sonner";

const inputClass =
  "w-full border border-sand bg-bone px-4 py-3 text-sm text-ink placeholder:text-clay/70 focus:border-ink";

export function ContactForm({
  topic = "Contact",
  messageLabel = "How can we help?",
  messagePlaceholder = "Tell us a little about what you need…",
  cta = "Send message",
}: {
  topic?: string;
  messageLabel?: string;
  messagePlaceholder?: string;
  cta?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-sand bg-cream p-10 text-center">
        <p className="font-serif text-2xl text-ink">Thank you.</p>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-walnut">
          Your message is on its way to our team. A Maison Noyer specialist will
          be in touch within one business day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        setBusy(true);
        const res = await submitContact({
          name,
          email,
          message: phone ? `${message}\n\nPhone: ${phone}` : message,
          topic,
        });
        setBusy(false);
        if (res.ok) {
          setSent(true);
          toast.success("Message sent", {
            description: "We'll be in touch within one business day.",
          });
        } else {
          toast.error("Please check your details and try again.");
        }
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-clay">
            Full name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-clay">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-clay">
          Phone <span className="lowercase tracking-normal">(optional)</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
          placeholder="(000) 000-0000"
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-clay">
          {messageLabel}
        </label>
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={inputClass}
          placeholder={messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={busy}
        className="w-full bg-ink py-4 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-forest disabled:opacity-60 sm:w-max sm:px-12"
      >
        {busy ? "Sending…" : cta}
      </button>
    </form>
  );
}
