import React from "react";

import { Check, Sparkles } from "lucide-react";

import { getChargeProduct } from "@/db/queries/charge-product";

import { PricingCards } from "../pricing-cards";

export async function Pricing() {
  const { data: chargeProduct } = await getChargeProduct();

  return (
    <div id="pricing" className="bg-gray-50 py-24 text-black">
      <div className="mx-auto max-w-7xl px-4">
        <PricingCards chargeProduct={chargeProduct} isHomeScreen={true} />
      </div>
    </div>
  );
}
