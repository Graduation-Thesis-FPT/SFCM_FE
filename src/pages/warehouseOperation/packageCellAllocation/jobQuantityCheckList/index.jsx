import { dt_pallet_stock, job_quantity_check } from "@/components/common/aggridreact/dbColumns";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { cn } from "@/lib/utils";
import { PrintPallet } from "./PrintPallet";

export function JobQuantityCheckList({
  jobQuantityCheckList = [],
  onChangeJobQuantityCheckList,
  isCompleteJobQuantityCheck,
  selectedPackage = {}
}) {
  const JOB_QUANTITY_CHECK = new job_quantity_check();
  const DT_PALLET_STOCK = new dt_pallet_stock();
  const colDefs = [
    {
      field: "ITEMS_IN_CELL",
      headerName: JOB_QUANTITY_CHECK.ESTIMATED_CARGO_PIECE.headerName
    },
    {
      field: "SEPARATED_PACKAGE_LENGTH",
      headerName: DT_PALLET_STOCK.PALLET_LENGTH.headerName
    },
    {
      field: "SEPARATED_PACKAGE_WIDTH",
      headerName: DT_PALLET_STOCK.PALLET_WIDTH.headerName
    },
    {
      field: "SEPARATED_PACKAGE_HEIGHT",
      headerName: DT_PALLET_STOCK.PALLET_HEIGHT.headerName
    },
    {
      field: DT_PALLET_STOCK.NOTE.field,
      headerName: DT_PALLET_STOCK.NOTE.headerName
    }
  ];

  const handleOnChange = (key, newValue, item) => {
    if (key !== "NOTE") {
      newValue = Number(newValue);
    }
    const index = jobQuantityCheckList.findIndex(data => {
      if (data.ROWGUID) {
        return data.ROWGUID === item.ROWGUID;
      } else {
        return data.key === item.key;
      }
    });
    let newList = [...jobQuantityCheckList];
    newList[index][key] = newValue;
    newList[index].status ? null : (newList[index].status = "update");
    onChangeJobQuantityCheckList(newList);
  };

  if (!jobQuantityCheckList.length) {
    return <div className="mt-10 text-center text-sm opacity-50">Chưa thực hiện kiểm đếm</div>;
  }

  return (
    <div className="h-full space-y-4 overflow-auto pt-4">
      {jobQuantityCheckList?.map((item, index) => (
        <div
          key={index}
          className={cn(
            "m-auto w-[95%] shadow-lg transition-all duration-300 hover:scale-[1.02]",
            "rounded-md border bg-gray-50 px-8 py-6",
            item.status === "insert" && "bg-green-50",
            item.status === "update" && "bg-yellow-50"
          )}
        >
          <span className="mb-2 flex justify-between text-sm">
            <div>STT: {item.SEQUENCE}</div>
            <div className="font-bold">{item.ROWGUID}</div>
            <div>
              {isCompleteJobQuantityCheck() && (
                <PrintPallet selectedPackage={selectedPackage} data={item || {}} />
              )}
            </div>
          </span>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2">
            {colDefs.map((col, index) => (
              <span key={index} className={cn(col.field === "NOTE" && "col-span-4")}>
                <Label htmlFor={col.field}>{col.headerName}</Label>
                {col.field === "NOTE" ? (
                  <Textarea
                    readOnly={isCompleteJobQuantityCheck()}
                    className={cn(
                      "h-10 min-h-10 bg-white",
                      isCompleteJobQuantityCheck() && "cursor-not-allowed"
                    )}
                    id={col.field}
                    placeholder="Nhập ghi chú"
                    value={item[col.field] ?? ""}
                    onChange={e => {
                      handleOnChange(col.field, e.target.value, item);
                    }}
                  />
                ) : (
                  <Input
                    className={cn(isCompleteJobQuantityCheck() && "cursor-not-allowed")}
                    readOnly={isCompleteJobQuantityCheck()}
                    type="number"
                    min={col.field === "ITEMS_IN_CELL" ? 1 : 0}
                    id={col.field}
                    placeholder="Nhập số"
                    value={Number(item[col.field]).toString() ?? 0}
                    onChange={e => {
                      handleOnChange(col.field, e.target.value, item);
                    }}
                  />
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
