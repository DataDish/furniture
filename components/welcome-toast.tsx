"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // ignore if screen height is too small
    if (window.innerHeight < 650) return;
    if (!document.cookie.includes("welcome-toast=2")) {
      toast("Welcome to Maison Noyer", {
        id: "welcome-toast",
        duration: Infinity,
        onDismiss: () => {
          document.cookie = "welcome-toast=2; max-age=31536000; path=/";
        },
        description: (
          <>
            Gallery-grade furniture, sourced direct from the ateliers behind the
            icons. Enjoy a 100-night trial and complimentary white-glove
            delivery on every order.
          </>
        ),
      });
    }
  }, []);

  return null;
}
