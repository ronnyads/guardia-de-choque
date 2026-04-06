export default function Loading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-7 w-28 bg-[#E2E8F0] rounded-lg mb-2" />
          <div className="h-4 w-56 bg-[#F1F5F9] rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-[#E2E8F0] rounded-xl" />
      </div>
      <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex gap-4">
          {[120, 80, 60, 80, 60].map((w, i) => (
            <div key={i} className={`h-4 bg-[#F1F5F9] rounded`} style={{ width: w }} />
          ))}
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="px-6 py-4 border-b border-[#F8FAFC] flex items-center gap-4">
            <div className="w-10 h-10 bg-[#F1F5F9] rounded-xl shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-4 w-48 bg-[#F1F5F9] rounded" />
              <div className="h-3 w-24 bg-[#F8FAFC] rounded" />
            </div>
            <div className="h-6 w-16 bg-[#F1F5F9] rounded-full" />
            <div className="h-4 w-20 bg-[#F8FAFC] rounded" />
            <div className="h-4 w-20 bg-[#F8FAFC] rounded" />
            <div className="h-4 w-20 bg-[#F8FAFC] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
