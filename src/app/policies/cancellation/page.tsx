import { Metadata } from "next";
import { CancellationPolicyClient } from "@/components/sections/policies/CancellationPolicyClient";

export const metadata: Metadata = {
  title: "Cancellation Policy | K2K Adventurez",
  description: "Read our booking, cancellation, refund, and travel policies before booking your expedition with K2K Adventurez.",
};

export default function CancellationPage() {
  return <CancellationPolicyClient />;
}
