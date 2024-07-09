import { cn } from "@/lib/utils";

export function JobList({ jobList = [], onSelectedJob, selectedJob = {} }) {
  const handleSelectedJob = job => {
    onSelectedJob(job);
  };
  return (
    <div className="relative h-full bg-gray-50 p-4">
      <div className="text-center font-bold">Danh sách công việc</div>
      {jobList.length === 0 ? (
        <div className="absolute-center text-sm opacity-50">Không có công việc</div>
      ) : (
        <span className="text-sm">
          {jobList.map(job => (
            <div
              key={job.PALLET_NO}
              onClick={() => {
                handleSelectedJob(job);
              }}
              className={cn(
                job.PALLET_NO === selectedJob.PALLET_NO && "bg-blue-100",
                "my-2 rounded-md border p-2 shadow-md transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer"
              )}
            >
              <div>Mã pallet: {job.PALLET_NO}</div>
              <div>Số lượng: {job.ESTIMATED_CARGO_PIECE}</div>
              <div>
                Kích thước: {job.PALLET_LENGTH}x{job.PALLET_WIDTH}x{job.PALLET_HEIGHT} (m)
              </div>
            </div>
          ))}
        </span>
      )}
    </div>
  );
}
