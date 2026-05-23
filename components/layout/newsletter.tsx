"use client";

import { useState } from "react";
import { toast } from "sonner";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        toast.success("Welcome to Maison Noyer", {
          description:
            "Look out for early access to new pieces and private sales.",
        });
        setEmail("");
      }}
      className="flex w-full max-w-sm items-center border-b border-bone/30 focus-within:border-bone"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        aria-label="Email address"
        className="w-full bg-transparent py-2 text-sm text-bone placeholder:text-bone/40 focus-visible:ring-0"
      />
      <button
        type="submit"
        className="shrink-0 py-2 pl-4 text-xs font-medium uppercase tracking-[0.2em] text-bone/70 transition-colors hover:text-bone"
      >
        Subscribe
      </button>
    </form>
  );
}
