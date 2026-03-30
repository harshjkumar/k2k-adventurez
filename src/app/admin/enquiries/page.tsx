"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, MessageSquare, Calendar, ChevronDown } from "lucide-react";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  interested_trip: string;
  group_size: string;
  message: string;
  status: string;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
  converted: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-50 text-gray-500 border-gray-200",
};

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchEnquiries(); }, [filterStatus]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/enquiries?status=${filterStatus}`);
      setEnquiries(await res.json());
    } catch {} finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/enquiries/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchEnquiries();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-charcoal">Enquiries</h1>
          <p className="text-sm text-charcoal/50 mt-1">{enquiries.length} enquiries</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {["all", "new", "contacted", "converted", "closed"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 text-xs font-medium rounded-md capitalize transition-colors ${
              filterStatus === s ? "bg-accent text-white" : "bg-white border border-gray-200 text-charcoal/60 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-charcoal/40">Loading...</div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-charcoal/40">No enquiries found.</div>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {/* Header Row */}
              <button
                onClick={() => setExpandedId(expandedId === enq.id ? null : enq.id)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs uppercase">
                    {enq.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-charcoal text-sm">{enq.name}</p>
                    <p className="text-xs text-charcoal/40 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} />
                      {new Date(enq.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider border ${STATUS_COLORS[enq.status] || STATUS_COLORS.new}`}>
                    {enq.status}
                  </span>
                  <ChevronDown size={16} className={`text-charcoal/30 transition-transform ${expandedId === enq.id ? "rotate-180" : ""}`} />
                </div>
              </button>

              {/* Expanded Content */}
              {expandedId === enq.id && (
                <div className="px-6 pb-5 border-t border-gray-100 pt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-charcoal/70">
                      <Mail size={14} className="text-accent" /> {enq.email}
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/70">
                      <Phone size={14} className="text-accent" /> {enq.phone || "—"}
                    </div>
                    <div className="flex items-center gap-2 text-charcoal/70">
                      <MessageSquare size={14} className="text-accent" /> Group: {enq.group_size || "—"}
                    </div>
                  </div>
                  {enq.interested_trip && (
                    <p className="text-sm"><span className="font-medium text-charcoal/60">Trip:</span> {enq.interested_trip}</p>
                  )}
                  {enq.message && (
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="text-sm text-charcoal/70 leading-relaxed">{enq.message}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-charcoal/40 mr-2">Update Status:</span>
                    {["new", "contacted", "converted", "closed"].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(enq.id, s)}
                        className={`px-3 py-1.5 text-[10px] font-medium rounded-md capitalize transition-colors border ${
                          enq.status === s ? "bg-accent text-white border-accent" : "bg-white border-gray-200 text-charcoal/50 hover:border-accent hover:text-accent"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
