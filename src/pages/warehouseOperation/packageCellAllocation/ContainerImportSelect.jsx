import { getAllImportedContainer } from "@/apis/package-cell-allocation.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/common/ui/sheet";
import useFetchData from "@/hooks/useRefetchData";
import { useRef } from "react";

export function ContainerImportSelect({ open, onOpenChange, onSelectContainerInfo }) {
  const toast = useCustomToast();
  const gridRef = useRef(null);

  const { data: rowData } = useFetchData({
    service: getAllImportedContainer,
    dependencies: [open],
    shouldFetch: !!open
  });

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: "Số container",
      field: "CNTR_NO",
      flex: 1,
      filter: true
    },
    {
      headerName: "Mã đại lý",
      field: "SHIPPER_ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Mã chuyến tàu",
      field: "ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên tàu",
      field: "VESSEL_NAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Ngày tàu đến",
      field: "ETA",
      flex: 1,
      cellDataType: "date"
    }
  ];

  const handleSelectRow = () => {
    let rowSelected = gridRef.current.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn container");
      return;
    }
    onSelectContainerInfo(rowSelected[0]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Danh sách container đã làm lệnh nhập</div>
              <Button onClick={handleSelectRow} variant="blue">
                Chọn
              </Button>
            </span>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <AgGrid
          ref={gridRef}
          rowSelection={"single"}
          className="h-[50vh]"
          rowData={rowData}
          colDefs={colDefs}
          onRowDoubleClicked={handleSelectRow}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
