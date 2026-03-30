import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6 relative">
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-charcoal/60 hover:text-accent transition-colors">
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden shadow-gray-200/50">
        <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <h2 className="font-serif text-3xl font-semibold text-charcoal tracking-wide mb-1">
            K2K<span className="text-accent">.</span>
          </h2>
          <p className="font-nav text-[10px] uppercase tracking-widest text-charcoal/40">Adventurez</p>
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
