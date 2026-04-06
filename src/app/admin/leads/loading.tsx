export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div>
        <div className="h-7 w-48 bg-[#E2E8F0] rounded-lg mb-2" />
        <div className="h-4 w-72 bg-[#F1F5F9] rounded-lg" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-[#F1F5F9] rounded" />
              <div className="h-3 w-24 bg-[#F1F5F9] rounded" />
            </div>
            <div className="h-8 w-16 bg-[#E2E8F0] rounded-lg" />
          </div>
        ))}
      </div>
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-3.5 border-b border-[#F1F5F9] flex gap-8">
          {[80, 80, 70, 60, 60, 60].map((w, i) => (
            <div key={i} className="h-3 bg-[#F1F5F9] rounded" style={{ width: w }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-[#F8FAFC] flex items-center gap-8">
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-32 bg-[#F1F5F9] rounded" />
              <div className="h-2.5 w-40 bg-[#F8FAFC] rounded" />
              <div className="h-2.5 w-28 bg-[#F8FAFC] rounded" />
            </div>
            <div className="h-3 w-28 bg-[#F1F5F9] rounded" />
            <div className="h-6 w-20 bg-[#F1F5F9] rounded-md" />
            <div className="h-3 w-20 bg-[#F8FAFC] rounded" />
            <div className="h-3 w-16 bg-[#F8FAFC] rounded" />
            <div className="h-8 w-24 bg-[#F1F5F9] rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
