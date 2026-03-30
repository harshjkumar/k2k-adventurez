"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ChevronRight, Users, Calendar, ArrowLeft, Loader2, CreditCard, Minus, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Trip } from "@/types/trip";

interface BookTripClientProps {
  trip: Trip;
}

export default function BookTripClient({ trip }: BookTripClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateId = searchParams.get("date");

  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking details
  const [occupancyRule, setOccupancyRule] = useState<"DBL" | "TPL">("DBL");
  const [packageQuantities, setPackageQuantities] = useState<Record<string, number>>({});
  
  // Rider Details
  const [riders, setRiders] = useState([{ name: "", phone: "", age: "", emergencyContact: "" }]);

  // Payment Details
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [customPaymentAmount, setCustomPaymentAmount] = useState<string>("");

  const departure = trip.departures?.find(d => d.id === dateId) || trip.departures?.[0];
  
  const pricingOptions = trip.pricing || [];

  const totalPersons = Object.values(packageQuantities).reduce((a, b) => a + b, 0);
  
  const subtotal = pricingOptions.reduce((sum, pkg) => {
    return sum + (pkg.price * (packageQuantities[pkg.label] || 0));
  }, 0);
  const gst = Math.round(subtotal * 0.05);
  const netPayable = subtotal + gst;

  // Set default custom amount when netPayable changes
  useEffect(() => {
    if (netPayable > 0 && customPaymentAmount === "") {
      setCustomPaymentAmount(netPayable.toString());
    } else if (netPayable === 0) {
      setCustomPaymentAmount("");
    }
  }, [netPayable, customPaymentAmount]);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      if (session?.user) {
        setRiders([{ name: session.user.user_metadata?.full_name || "", phone: session.user.user_metadata?.phone || "", age: "", emergencyContact: "" }]);
      }
      setLoadingAuth(false);
    });
  }, []);

  // Update riders array when totalPersons count changes
  useEffect(() => {
    if (totalPersons === 0) return;
    const currentRiders = [...riders];
    if (totalPersons > currentRiders.length) {
      for (let i = currentRiders.length; i < totalPersons; i++) {
        currentRiders.push({ name: "", phone: "", age: "", emergencyContact: "" });
      }
    } else if (totalPersons < currentRiders.length) {
      currentRiders.splice(totalPersons);
    }
    setRiders(currentRiders);
  }, [totalPersons, riders]);

  const updateRider = (index: number, field: string, value: string) => {
    const updated = [...riders];
    updated[index] = { ...updated[index], [field]: value };
    setRiders(updated);
  };

  const updateQuantity = (label: string, delta: number) => {
    setPackageQuantities(prev => {
      const current = prev[label] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [label]: next };
    });
  };

  const handleBookingSubmit = async () => {
    if (!user || !departure || totalPersons === 0) return;
    
    let payingAmount = parseInt(customPaymentAmount);
    if (isNaN(payingAmount) || payingAmount < 99 || payingAmount > netPayable) {
      alert(`Payment amount must be between ₹99 and ₹${netPayable.toLocaleString("en-IN")}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const supabase = createClient();
      
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          trip_id: trip.id,
          departure_id: departure.id,
          total_amount: netPayable,
          payment_status: payingAmount === netPayable ? 'paid' : 'partial',
          status: 'confirmed'
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;

      const riderInserts = riders.slice(0, totalPersons).map(r => ({
        booking_id: booking.id,
        full_name: r.name,
        phone: r.phone,
        age: parseInt(r.age) || 0,
        emergency_contact: r.emergencyContact
      }));
      
      const { error: ridersError } = await supabase
        .from('booking_riders')
        .insert(riderInserts);
        
      if (ridersError) throw ridersError;

      setCurrentStep(4);
    } catch (error) {
      console.error("Booking error:", error);
      alert("There was an error processing your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingAuth) {
    return <div className="min-h-screen flex items-center justify-center pt-[72px]"><Loader2 className="animate-spin text-accent" size={32} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[72px] pb-24">
      <div className="bg-white border-b border-gray-100 py-6 sticky top-[72px] z-40">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2" />
            
            {[
              { num: 1, label: "Review" },
              { num: 2, label: "Riders" },
              { num: 3, label: "Payment" },
              { num: 4, label: "Confirm" }
            ].map(step => (
              <div key={step.num} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep === step.num ? "bg-charcoal text-white" : 
                  currentStep > step.num ? "bg-accent text-white" : 
                  "bg-gray-100 text-charcoal/40"
                }`}>
                  {currentStep > step.num ? <Check size={14} /> : step.num}
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-nav hidden md:block ${
                  currentStep >= step.num ? "text-charcoal" : "text-charcoal/40"
                }`}>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            {currentStep === 1 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-serif text-2xl text-charcoal mb-6">Review Booking</h2>
                
                <div className="flex items-center gap-3 text-charcoal border border-gray-200 rounded-lg p-4 mb-8 bg-gray-50">
                  <Calendar className="text-accent" size={20} />
                  {departure ? (
                    <span className="font-medium text-sm md:text-base">
                      {new Date(departure.startDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} 
                      &nbsp;—&nbsp; 
                      {new Date(departure.endDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  ) : (
                    <span className="font-medium text-amber-600 text-sm md:text-base">No date selected. Please go back.</span>
                  )}
                </div>

                <div className="mb-6 flex overflow-hidden rounded-lg border border-[#102a43] w-full max-w-sm">
                  <button 
                    onClick={() => setOccupancyRule("TPL")}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${occupancyRule === "TPL" ? "bg-gray-100 text-[#102a43]" : "bg-[#102a43] text-white hover:bg-[#1a3a5a]"}`}
                  >
                    TPL Share
                  </button>
                  <button 
                    onClick={() => setOccupancyRule("DBL")}
                    className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${occupancyRule === "DBL" ? "bg-[#102a43] text-white" : "bg-white text-[#102a43] hover:bg-gray-50"}`}
                  >
                    DBL Share
                  </button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 p-3 md:p-4 text-[10px] md:text-xs font-bold text-gray-600 uppercase">
                    <div className="col-span-5 md:col-span-6">Package / Rider Type</div>
                    <div className="col-span-4 text-center">{occupancyRule} Share</div>
                    <div className="col-span-3 md:col-span-2 text-right">Total</div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {pricingOptions.map(pkg => {
                      const qty = packageQuantities[pkg.label] || 0;
                      const lineTotal = pkg.price * qty;
                      return (
                        <div key={pkg.label} className="grid grid-cols-12 items-center p-3 md:p-4 gap-x-2 md:gap-x-0">
                          <div className="col-span-5 md:col-span-6">
                            <span className="block font-medium text-[11px] md:text-sm text-[#102a43] mb-1">{pkg.label}</span>
                            <span className="block text-[9px] md:text-xs text-gray-500 leading-tight">Includes motorcycle & gear</span>
                          </div>
                          <div className="col-span-4 flex flex-col items-center">
                            <span className="text-[9px] md:text-xs text-gray-500 mb-1 md:mb-2 text-center leading-tight">₹{pkg.price.toLocaleString("en-IN")} / pax</span>
                            <div className="flex items-center gap-1.5 md:gap-3 bg-white border border-gray-200 rounded">
                              <button onClick={() => updateQuantity(pkg.label, -1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-white bg-[#2A5C9A] hover:bg-[#1a4a8a] rounded-l transition-colors"><Minus size={12} /></button>
                              <span className="font-medium text-xs md:text-sm w-3 md:w-4 text-center select-none">{qty}</span>
                              <button onClick={() => updateQuantity(pkg.label, 1)} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-white bg-[#2A5C9A] hover:bg-[#1a4a8a] rounded-r transition-colors"><Plus size={12} /></button>
                            </div>
                          </div>
                          <div className="col-span-3 md:col-span-2 text-right font-medium text-charcoal text-[11px] md:text-sm font-serif">
                            ₹{lineTotal.toLocaleString("en-IN")}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-gray-50 border-t border-gray-200 divide-y divide-gray-200">
                    <div className="flex justify-between p-4 text-sm text-charcoal">
                      <span>Your Total</span>
                      <span className="font-medium font-serif w-24 text-right">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between p-4 text-sm text-charcoal">
                      <span>GST <span className="text-gray-500 text-xs ml-1">5%</span></span>
                      <span className="font-medium font-serif w-24 text-right">₹{gst.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between p-4 text-charcoal font-bold">
                      <span>Net Payable</span>
                      <span className="font-serif w-24 text-right">₹{netPayable.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                  {!user ? (
                    <button 
                      onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/trips/${trip.slug}/book?date=${dateId}`)}`)}
                      className="px-8 py-3 bg-[#2A5C9A] text-[#FAF9F6] font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors"
                    >
                      Log In to Continue
                    </button>
                  ) : (
                    <button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!departure || totalPersons === 0}
                      className="px-8 py-3 bg-[#2A5C9A] text-[#FAF9F6] font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      Continue to Riders <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setCurrentStep(1)} className="p-2 -ml-2 text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20} /></button>
                  <h2 className="font-serif text-2xl text-charcoal">Rider Details</h2>
                </div>

                <div className="space-y-8">
                  {riders.slice(0, totalPersons).map((rider, index) => (
                    <div key={index} className="p-6 border border-gray-100 rounded-lg bg-gray-50/50">
                      <h3 className="text-sm font-nav uppercase tracking-widest text-charcoal/60 mb-4 flex items-center gap-2">
                        <Users size={16} /> Rider {index + 1} {index === 0 && "(Primary)"}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-charcoal/60 block mb-1">Full Name</label>
                          <input type="text" value={rider.name} onChange={(e) => updateRider(index, 'name', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="John Doe" />
                        </div>
                        <div>
                          <label className="text-xs text-charcoal/60 block mb-1">Phone</label>
                          <input type="tel" value={rider.phone} onChange={(e) => updateRider(index, 'phone', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="+91..." />
                        </div>
                        <div>
                          <label className="text-xs text-charcoal/60 block mb-1">Age</label>
                          <input type="number" value={rider.age} onChange={(e) => updateRider(index, 'age', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="25" />
                        </div>
                        <div>
                          <label className="text-xs text-charcoal/60 block mb-1">Emergency Contact (Phone)</label>
                          <input type="tel" value={rider.emergencyContact} onChange={(e) => updateRider(index, 'emergencyContact', e.target.value)} className="w-full px-4 py-2 bg-white border border-gray-200 rounded text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all" placeholder="+91..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => setCurrentStep(3)}
                    disabled={riders.slice(0, totalPersons).some(r => !r.name || !r.phone || !r.age || !r.emergencyContact)}
                    className="px-8 py-3 bg-[#2A5C9A] text-[#FAF9F6] font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    Proceed to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 mb-6">
                  <button onClick={() => setCurrentStep(2)} className="p-2 -ml-2 text-charcoal/40 hover:text-charcoal"><ArrowLeft size={20} /></button>
                  <h2 className="font-serif text-2xl text-charcoal">Payment</h2>
                </div>

                <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                  <h3 className="text-sm font-bold text-charcoal mb-4">Payment Summary</h3>
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-charcoal/70">Total Net Payable</span>
                    <span className="font-serif text-xl">₹{netPayable.toLocaleString("en-IN")}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-medium text-charcoal mb-2">Amount to Pay Now</label>
                    <p className="text-xs text-gray-500 mb-3">You can reserve your spot by paying a partial amount (min ₹99).</p>
                    <div className="flex items-center">
                      <span className="h-10 px-4 bg-gray-100 border border-gray-200 border-r-0 flex items-center rounded-l text-gray-600 font-medium">₹</span>
                      <input 
                        type="number" 
                        min="99" 
                        max={netPayable}
                        value={customPaymentAmount}
                        onChange={(e) => setCustomPaymentAmount(e.target.value)}
                        className="h-10 w-full md:w-48 px-4 border border-gray-200 rounded-r focus:outline-none focus:border-accent text-charcoal font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <p className="text-charcoal/60 text-sm mb-4">Select your preferred payment method</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-6 rounded-lg border-2 text-left transition-all ${paymentMethod === 'upi' ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-gray-200'} flex items-center gap-4`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-accent' : 'border-gray-300'}`}>
                        {paymentMethod === 'upi' && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                      </div>
                      <div>
                        <span className="block font-medium text-charcoal">UPI / QR</span>
                        <span className="block text-xs text-charcoal/50">Google Pay, PhonePe, Paytm</span>
                      </div>
                    </button>
                    
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`p-6 rounded-lg border-2 text-left transition-all ${paymentMethod === 'card' ? 'border-accent bg-accent/5' : 'border-gray-100 hover:border-gray-200'} flex items-center gap-4`}
                    >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-accent' : 'border-gray-300'}`}>
                        {paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
                      </div>
                      <div>
                        <span className="block font-medium text-charcoal flex items-center gap-2"><CreditCard size={16} /> Credit / Debit Card</span>
                        <span className="block text-xs text-charcoal/50">Visa, Mastercard, Amex</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={handleBookingSubmit}
                    disabled={isSubmitting || parseInt(customPaymentAmount) < 99 || parseInt(customPaymentAmount) > netPayable}
                    className="px-8 py-3 w-full md:w-auto bg-[#2A5C9A] text-[#FAF9F6] font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : `Pay Securely ₹${parseInt(customPaymentAmount || "0").toLocaleString("en-IN")}`}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="font-serif text-3xl text-charcoal mb-4">Booking Confirmed!</h2>
                <p className="text-charcoal/60 mb-8 max-w-sm mx-auto">
                  Your adventure to {trip.title} is confirmed. We've sent the details to your email.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 bg-[#2A5C9A] text-white font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors"
                  >
                    Go to Dashboard
                  </button>
                  <button 
                    onClick={() => router.push('/')}
                    className="px-8 py-3 bg-transparent border border-charcoal/20 text-charcoal font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}

          </div>

          {currentStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-32">
                <h3 className="font-nav text-xs font-bold uppercase tracking-widest text-charcoal/40 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Trip</span>
                    <span className="font-serif text-charcoal text-right w-1/2 line-clamp-1">{trip.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/60">Total Persons</span>
                    <span className="font-medium text-charcoal">x{totalPersons}</span>
                  </div>
                </div>

                {totalPersons > 0 && (
                  <div className="pt-4 border-t border-gray-100 mb-6 space-y-2">
                    {Object.entries(packageQuantities).filter(([_, q]) => q > 0).map(([label, qty]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span className="text-charcoal/60">{label} x{qty}</span>
                        <span className="font-medium text-charcoal">
                          ₹{((trip.pricing?.find(p => p.label === label)?.price || 0) * qty).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 mb-6">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-medium text-charcoal">Subtotal</span>
                    <span className="text-charcoal">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-end mb-4 text-sm">
                    <span className="font-medium text-charcoal">GST (5%)</span>
                    <span className="text-charcoal">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-charcoal">Net Payable</span>
                    <span className="font-serif text-2xl text-accent">₹{netPayable.toLocaleString("en-IN")}</span>
                  </div>
                </div>
                
                {currentStep === 1 && user ? (
                  <button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!departure || totalPersons === 0}
                    className="w-full py-3 bg-[#2A5C9A] text-white font-nav text-xs uppercase tracking-widest font-medium rounded-full hover:bg-[#1a4a8a] transition-colors disabled:opacity-50"
                  >
                    Continue
                  </button>
                ) : currentStep === 1 && !user ? (
                  <div className="text-center text-xs text-amber-600 bg-amber-50 p-3 rounded border border-amber-100">
                    Log in required to book
                  </div>
                ) : null}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
