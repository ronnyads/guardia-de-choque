export default function Loading() {
  return (
    <div className="flex flex-col gap-0 h-full animate-pulse">
      <div className="mb-6 pb-5 border-b border-[#E2E8F0]">
        <div className="h-7 w-40 bg-[#E2E8F0] rounded-lg mb-2" />
        <div className="h-4 w-72 bg-[#F1F5F9] rounded-lg" />
      </div>
      <div className="flex gap-0">
        <div className="w-52 shrink-0 border-r border-[#E2E8F0] pt-1 pr-4 flex flex-col gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#F1F5F9] rounded-xl" />
          ))}
        </div>
        <div className="flex-1 pl-8 flex flex-col gap-5">
          <div className="h-6 w-48 bg-[#E2E8F0] rounded-lg" />
          <div className="h-4 w-80 bg-[#F1F5F9] rounded" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl" />
          ))}
          <div className="h-10 w-32 bg-[#E2E8F0] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
