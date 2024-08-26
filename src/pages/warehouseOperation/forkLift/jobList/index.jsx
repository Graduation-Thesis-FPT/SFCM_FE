import { cn } from "@/lib/utils";

export function JobList({ jobList = [], onSelectedJob, selectedJob = {}, selectedJobStatus = "" }) {
  const handleSelectedJob = job => {
    onSelectedJob(job);
  };
  return (
    <div className="relative flex h-full flex-col bg-gray-50 p-4">
      <div className="text-center font-bold">Danh sách công việc</div>
      <div
        className={cn(
          "m-auto mt-2 flex w-fit rounded-sm border bg-slate-100 px-6 py-1 text-center",
          selectedJobStatus === "I" ? "bg-green-100" : "bg-orange-100"
        )}
      >
        <p className="text-14 text-gray-900">
          {selectedJobStatus === "I" ? "Nhập hàng" : "Xuất hàng"}
        </p>
      </div>
      {jobList.length === 0 ? (
        <div className="absolute-center text-center text-sm opacity-50">Không có công việc</div>
      ) : (
        <div className="h-full overflow-hidden overflow-y-auto text-sm">
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
              <div className="mb-2 text-center font-bold">{job.PALLET_NO}</div>

              <div className="flex justify-between gap-x-1">
                <div className="w-1/2 space-y-1">
                  <div>Tên tàu: {job.VESSEL_NAME}</div>
                  <div>Chuyến nhập: {job.INBOUND_VOYAGE}</div>
                  <div>Số container: {job.CNTRNO}</div>
                </div>
                <div className="flex w-1/2 flex-col items-end  space-y-1 align-bottom">
                  <div>Số lượng: {job.ESTIMATED_CARGO_PIECE}</div>
                  <div>
                    Kích thước: {job.PALLET_LENGTH}x{job.PALLET_WIDTH}x{job.PALLET_HEIGHT} (m)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
