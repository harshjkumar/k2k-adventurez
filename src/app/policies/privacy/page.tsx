import { Metadata } from "next";
import { PrivacyPolicyClient } from "@/components/sections/policies/PrivacyPolicyClient";

export const metadata: Metadata = {
  title: "Privacy Policy | K2K Adventurez",
  description: "Learn how K2K Adventurez collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return <PrivacyPolicyClient />;
}
