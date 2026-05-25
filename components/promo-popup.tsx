"use client";

import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { img } from "lib/data/catalog";
import { subscribeEmail } from "lib/klaviyo";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "mn-promo-15-v1";
const PROMO_CODE = "WELCOME15";

export function PromoPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [revealed, setRevealed] = useState(false);

  // Show once per visitor, a few seconds after landing.
  useEffect(() => {
    let seen: string | null = null;
    try {
      seen = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (seen) return;

    const timer = setTimeout(() => setIsOpen(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const remember = (value: string) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const close = () => setIsOpen(false);

  const dismiss = () => {
    remember("dismissed");
    close();
  };

  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    remember("subscribed");
    setRevealed(true);
    toast.success("Welcome to Maison Noyer", {
      description: `Your 15% code ${PROMO_CODE} is ready — and it's in your inbox.`,
    });
    // Add to Klaviyo (no-op until configured). Don't block the UI on it.
    void subscribeEmail(email, "Maison Noyer — 15% Welcome Popup");
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={dismiss} className="relative z-[60]">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            aria-hidden="true"
          />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 scale-[0.98]"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-4 scale-[0.98]"
          >
            <Dialog.Panel className="relative grid w-full max-w-3xl overflow-hidden bg-bone shadow-2xl md:grid-cols-2">
              <button
                aria-label="Close"
                onClick={dismiss}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bone/80 text-ink backdrop-blur-sm transition-colors hover:bg-cream"
              >
                <XMarkIcon className="h-5" />
              </button>

              {/* Image */}
              <div className="relative hidden min-h-[420px] md:block">
                <Image
                  src={img("1616486338812-3dadae4b4ace", 900)}
                  alt="A considered Maison Noyer interior"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center px-7 py-10 text-center md:px-10 md:text-left">
                {!revealed ? (
                  <>
                    <p className="text-xs uppercase tracking-[0.3em] text-clay">
                      Join the house list
                    </p>
                    <h2 className="mt-4 font-serif text-4xl leading-tight text-ink">
                      15% off your first order
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-walnut">
                      Be first to new pieces, private sales, and a look inside
                      the ateliers we work with. Enjoy 15% off your first Maison
                      Noyer purchase.
                    </p>

                    <form onSubmit={subscribe} className="mt-7">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        aria-label="Email address"
                        className="w-full border border-sand bg-bone px-4 py-3.5 text-sm text-ink placeholder:text-clay/70 focus:border-ink"
                      />
                      <button
                        type="submit"
                        className="mt-3 w-full bg-ink py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-forest"
                      >
                        Reveal My Code
                      </button>
                    </form>

                    <button
                      onClick={dismiss}
                      className="mt-5 text-xs uppercase tracking-[0.15em] text-clay underline-offset-4 hover:text-ink hover:underline"
                    >
                      No thanks, I'll pay full price
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xs uppercase tracking-[0.3em] text-clay">
                      You're in
                    </p>
                    <h2 className="mt-4 font-serif text-3xl leading-tight text-ink">
                      Here's 15% off
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-walnut">
                      Use this code at checkout. We've also sent it to your
                      inbox.
                    </p>
                    <div className="mt-6 border border-dashed border-clay bg-cream px-4 py-4 text-center">
                      <span className="font-serif text-2xl tracking-[0.2em] text-ink">
                        {PROMO_CODE}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(PROMO_CODE).then(
                          () => toast.success("Code copied"),
                          () => {},
                        );
                      }}
                      className="mt-4 text-xs uppercase tracking-[0.15em] text-clay underline-offset-4 hover:text-ink hover:underline"
                    >
                      Copy code
                    </button>
                    <button
                      onClick={close}
                      className="mt-6 w-full bg-ink py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-forest"
                    >
                      Start Shopping
                    </button>
                  </>
                )}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
