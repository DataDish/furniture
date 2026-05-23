"use client";

import { Dialog, Transition } from "@headlessui/react";
import { ShoppingBagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  return (
    <>
      <button aria-label="Open cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeCart} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-ink/40" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-sand bg-bone p-6 text-ink md:w-[420px]">
              <div className="flex items-center justify-between border-b border-sand pb-4">
                <p className="font-serif text-2xl">Your Cart</p>
                <button
                  aria-label="Close cart"
                  onClick={closeCart}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-sand transition-colors hover:bg-cream"
                >
                  <XMarkIcon className="h-5 transition-transform hover:scale-110" />
                </button>
              </div>

              {!cart || cart.lines.length === 0 ? (
                <div className="mt-24 flex w-full flex-col items-center justify-center overflow-hidden text-center">
                  <ShoppingBagIcon
                    className="h-14 text-stone"
                    strokeWidth={1}
                  />
                  <p className="mt-6 font-serif text-2xl">Your cart is empty</p>
                  <p className="mt-2 max-w-[24ch] text-sm text-clay">
                    Considered pieces, sourced direct. Start with something you
                    will keep for decades.
                  </p>
                  <Link
                    href="/search"
                    onClick={closeCart}
                    className="mt-6 border-b border-ink pb-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors hover:text-clay"
                  >
                    Browse the collection
                  </Link>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-between overflow-hidden">
                  <ul className="grow overflow-auto py-4">
                    {cart.lines
                      .sort((a, b) =>
                        a.merchandise.product.title.localeCompare(
                          b.merchandise.product.title,
                        ),
                      )
                      .map((item, i) => {
                        const merchandiseSearchParams =
                          {} as MerchandiseSearchParams;

                        item.merchandise.selectedOptions.forEach(
                          ({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] =
                                value;
                            }
                          },
                        );

                        const merchandiseUrl = createUrl(
                          `/product/${item.merchandise.product.handle}`,
                          new URLSearchParams(merchandiseSearchParams),
                        );

                        return (
                          <li
                            key={i}
                            className="flex w-full flex-col border-b border-sand"
                          >
                            <div className="relative flex w-full flex-row justify-between px-1 py-4">
                              <div className="absolute z-40 -ml-1 -mt-2">
                                <DeleteItemButton
                                  item={item}
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                              <div className="flex flex-row">
                                <div className="relative h-20 w-20 overflow-hidden border border-sand bg-cream">
                                  <Image
                                    className="h-full w-full object-cover"
                                    width={80}
                                    height={80}
                                    alt={
                                      item.merchandise.product.featuredImage
                                        .altText ||
                                      item.merchandise.product.title
                                    }
                                    src={
                                      item.merchandise.product.featuredImage.url
                                    }
                                  />
                                </div>
                                <Link
                                  href={merchandiseUrl}
                                  onClick={closeCart}
                                  className="z-30 ml-3 flex flex-row space-x-4"
                                >
                                  <div className="flex flex-1 flex-col">
                                    <span className="font-serif text-lg leading-tight">
                                      {item.merchandise.product.title}
                                    </span>
                                    {item.merchandise.title !==
                                    DEFAULT_OPTION ? (
                                      <p className="mt-1 text-xs uppercase tracking-wider text-clay">
                                        {item.merchandise.title}
                                      </p>
                                    ) : null}
                                  </div>
                                </Link>
                              </div>
                              <div className="flex h-20 flex-col justify-between">
                                <Price
                                  className="flex justify-end text-right text-sm"
                                  amount={item.cost.totalAmount.amount}
                                  currencyCode={
                                    item.cost.totalAmount.currencyCode
                                  }
                                />
                                <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-sand">
                                  <EditItemQuantityButton
                                    item={item}
                                    type="minus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                  <p className="w-6 text-center">
                                    <span className="w-full text-sm">
                                      {item.quantity}
                                    </span>
                                  </p>
                                  <EditItemQuantityButton
                                    item={item}
                                    type="plus"
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                  <div className="py-4 text-sm text-clay">
                    <div className="mb-3 flex items-center justify-between border-b border-sand pb-2">
                      <p>Shipping & assembly</p>
                      <p className="text-right text-ink">Complimentary</p>
                    </div>
                    <div className="mb-3 flex items-center justify-between border-b border-sand pb-2 pt-1">
                      <p>Taxes</p>
                      <p className="text-right">Calculated at checkout</p>
                    </div>
                    <div className="mb-1 flex items-center justify-between pt-1">
                      <p className="font-serif text-lg text-ink">Total</p>
                      <Price
                        className="text-right font-serif text-lg text-ink"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                  <form action={redirectToCheckout}>
                    <CheckoutButton />
                  </form>
                  <p className="mt-3 text-center text-xs text-clay">
                    100-night trial · Lifetime frame warranty
                  </p>
                </div>
              )}
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full bg-ink py-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-bone transition-colors hover:bg-forest disabled:opacity-60"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-bone" /> : "Proceed to Checkout"}
    </button>
  );
}
