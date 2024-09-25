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
              key={job.ROWGUID}
              onClick={() => {
                handleSelectedJob(job);
              }}
              className={cn(
                job.ROWGUID === selectedJob.ROWGUID && "bg-blue-100",
                "my-2 rounded-md border p-2 shadow-md transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer"
              )}
            >
              <div className="mb-2 text-center font-bold">{job.ROWGUID}</div>

              <div className="flex justify-between gap-x-1">
                <div className="w-1/2 space-y-1">
                  <div>Mã chuyến tàu: {job.voyage_ID}</div>
                  <div>Tên tàu: {job.VESSEL_NAME}</div>
                  <div>Số container: {job.CNTR_NO}</div>
                </div>
                <div className="flex w-1/2 flex-col items-end  space-y-1 align-bottom">
                  <div>Số lượng: {job.ITEMS_IN_CELL}</div>
                  <div>
                    Kích thước: {job.SEPARATED_PACKAGE_LENGTH}x{job.SEPARATED_PACKAGE_WIDTH}x
                    {job.SEPARATED_PACKAGE_HEIGHT} (m)
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
