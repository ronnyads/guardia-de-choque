export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#F1F5F9] rounded-lg" />
          <div>
            <div className="h-5 w-48 bg-[#E2E8F0] rounded-lg mb-1.5" />
            <div className="h-3 w-32 bg-[#F1F5F9] rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-28 bg-[#F1F5F9] rounded-lg" />
          <div className="h-10 w-24 bg-[#E2E8F0] rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {[180, 260, 200].map((h, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <div className="h-4 w-40 bg-[#F1F5F9] rounded" />
              </div>
              <div className="p-6">
                <div className="bg-[#F8FAFC] rounded-lg" style={{ height: h }} />
              </div>
            </div>
          ))}
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-6">
          {[100, 140, 120, 140].map((h, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-[#F1F5F9]">
                <div className="h-4 w-24 bg-[#F1F5F9] rounded" />
              </div>
              <div className="p-6">
                <div className="bg-[#F8FAFC] rounded-lg" style={{ height: h }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
