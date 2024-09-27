import { cn } from "@/lib/utils";

export function JobList({ jobList = [], onSelectedJob, selectedJob = {}, selectedJobStatus = "" }) {
  const handleSelectedJob = job => {
    onSelectedJob(job);
  };
  return (
    <div className="relative flex h-full flex-col bg-gray-100 py-4">
      <div className="text-center font-bold">Danh sách công việc</div>
      <div
        className={cn(
          "m-auto my-2 flex w-fit rounded-sm border bg-slate-100 px-6 py-1 text-center",
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
        <div className="h-full overflow-hidden overflow-y-auto text-12">
          {jobList.map(job =>
            selectedJobStatus === "I" ? (
              <ImportItem
                key={job.ROWGUID}
                job={job}
                selectedJob={selectedJob}
                handleSelectedJob={handleSelectedJob}
              />
            ) : (
              <ExportItem
                key={job.ROWGUID}
                job={job}
                selectedJob={selectedJob}
                handleSelectedJob={handleSelectedJob}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}

const ExportItem = ({ job, selectedJob, handleSelectedJob }) => {
  return (
    <div
      className="flex w-full flex-col p-2"
      key={job.ROWGUID}
      onClick={() => {
        handleSelectedJob(job);
      }}
    >
      <div
        className={cn(
          "bg-orange-50",
          job.ROWGUID === selectedJob.ROWGUID && "bg-orange-200",
          "rounded-md border shadow-md transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer"
        )}
      >
        <div className="border-b border-gray-400 p-1 text-center font-bold">
          Mã lệnh: {job.ORDER_ID}
        </div>
        <div className="flex justify-between gap-x-1 p-2">
          <div className="space-y-1">
            <div>Mã kiện: {job.ID}</div>
            <div>
              Số house bill: {job.HOUSE_BILL} ({job.SEQUENCE})
            </div>
            <div>Chủ hàng: {job.CONSIGNEE_ID}</div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div>
              Số lượng: {job.ITEMS_IN_CELL} ({job.PACKAGE_UNIT})
            </div>
            <div>
              Kích thước: {job.SEPARATED_PACKAGE_LENGTH}x{job.SEPARATED_PACKAGE_WIDTH}x
              {job.SEPARATED_PACKAGE_HEIGHT} (m)
            </div>
          </div>
        </div>
        <div className="border-t border-gray-400 p-1 text-center text-10 font-bold">
          {job.ROWGUID}
        </div>
      </div>
    </div>
  );
};

const ImportItem = ({ job, selectedJob, handleSelectedJob }) => {
  return (
    <div
      className="flex flex-col p-2"
      key={job.ROWGUID}
      onClick={() => {
        handleSelectedJob(job);
      }}
    >
      <div
        className={cn(
          "bg-green-50",
          job.ROWGUID === selectedJob.ROWGUID && "bg-green-200",
          "rounded-md border shadow-md transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer"
        )}
      >
        <div className="border-b border-gray-400 p-1 text-center font-bold">
          Mã lệnh: {job.ORDER_ID}
        </div>
        <div className="flex justify-between gap-x-1 p-2">
          <div className="space-y-1">
            <div>Mã kiện: {job.ID}</div>
            <div>
              Số house bill: {job.HOUSE_BILL} ({job.SEQUENCE})
            </div>
            <div>Chủ hàng: {job.CONSIGNEE_ID}</div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <div>
              Số lượng: {job.ITEMS_IN_CELL} ({job.PACKAGE_UNIT})
            </div>
            <div>
              Kích thước: {job.SEPARATED_PACKAGE_LENGTH}x{job.SEPARATED_PACKAGE_WIDTH}x
              {job.SEPARATED_PACKAGE_HEIGHT} (m)
            </div>
          </div>
        </div>
        <div className="border-t border-gray-400 p-1 text-center text-10 font-bold">
          {job.ROWGUID}
        </div>
      </div>
    </div>
  );
};
