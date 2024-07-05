import { dt_pallet_stock, job_quantity_check } from "@/components/common/aggridreact/dbColumns";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { Textarea } from "@/components/common/ui/textarea";
import { cn } from "@/lib/utils";
import moment from "moment";

export function JobQuantityCheckList({ jobQuantityCheckList = [], onChangeJobQuantityCheckList }) {
  const JOB_QUANTITY_CHECK = new job_quantity_check();
  const DT_PALLET_STOCK = new dt_pallet_stock();
  const colDefs = [
    {
      field: JOB_QUANTITY_CHECK.ESTIMATED_CARGO_PIECE.field,
      headerName: JOB_QUANTITY_CHECK.ESTIMATED_CARGO_PIECE.headerName
    },
    {
      field: DT_PALLET_STOCK.PALLET_LENGTH.field,
      headerName: DT_PALLET_STOCK.PALLET_LENGTH.headerName
    },
    {
      field: DT_PALLET_STOCK.PALLET_HEIGHT.field,
      headerName: DT_PALLET_STOCK.PALLET_HEIGHT.headerName
    },
    {
      field: DT_PALLET_STOCK.PALLET_WIDTH.field,
      headerName: DT_PALLET_STOCK.PALLET_WIDTH.headerName
    },
    {
      field: JOB_QUANTITY_CHECK.NOTE.field,
      headerName: JOB_QUANTITY_CHECK.NOTE.headerName
    }
  ];

  const handleOnChange = (key, newValue, item) => {
    if (key !== "NOTE") {
      newValue = Number(newValue);
    }
    const index = jobQuantityCheckList.findIndex(data => data.ROWGUID === item.ROWGUID);
    let newList = [...jobQuantityCheckList];
    newList[index][key] = newValue;
    newList[index].status ? null : (newList[index].status = "update");
    onChangeJobQuantityCheckList(newList);
  };

  if (!jobQuantityCheckList.length) {
    return <div className="mt-10 text-center text-sm opacity-50">Chưa thực hiện kiểm đếm</div>;
  }

  return (
    <div className="space-y-4 overflow-auto pt-4">
      {jobQuantityCheckList?.map((item, index) => (
        <div
          key={index}
          className={cn(
            "m-auto w-[95%] overflow-hidden shadow-lg transition-all duration-300 hover:scale-105",
            "rounded-md border bg-gray-50 p-4",
            item.status === "insert" && "bg-green-50",
            item.status === "update" && "bg-yellow-50"
          )}
        >
          <span className="flex justify-between text-sm">
            <div>STT: {item.SEQ}</div>
            <div className="font-bold">{item.PALLET_NO}</div>
            <div>{item.START_DATE ? moment(item.START_DATE).format("DD/MM/Y HH:mm") : null}</div>
            {/* <Button size="tool" variant="none-border" className="bg-gray-200">
              <FileUp className="h-4 w-4" />
            </Button> */}
          </span>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2">
            {colDefs.map((col, index) => (
              <span key={index} className={cn(col.field === "NOTE" && "col-span-4")}>
                <Label htmlFor={col.field}>{col.headerName}</Label>
                {col.field === "NOTE" ? (
                  <Textarea
                    className="h-10 min-h-10 bg-white"
                    id={col.field}
                    placeholder="Nhập ghi chú"
                    value={item[col.field] ?? ""}
                    onChange={e => {
                      handleOnChange(col.field, e.target.value, item);
                    }}
                  />
                ) : (
                  <Input
                    type="number"
                    min={col.field === "ESTIMATED_CARGO_PIECE" ? 1 : 0}
                    id={col.field}
                    placeholder="Nhập số"
                    value={item[col.field] ?? 0}
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
