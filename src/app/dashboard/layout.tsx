export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-[72px]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        {children}
      </div>
    </div>
  );
}
