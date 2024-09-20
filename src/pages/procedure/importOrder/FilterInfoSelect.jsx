import { getAllVoyageWithCustomerCanImportOrder } from "@/apis/import-order.api";
import { getAllVoyage } from "@/apis/voyage.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { dt_vessel_visit, voyage } from "@/components/common/aggridreact/dbColumns";
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
import React, { useRef } from "react";

const VOYAGE = new voyage();

export function FilterInfoSelect({ onOpenChange, open, onSelectedFilterInfo }) {
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const { data: voyageList } = useFetchData({
    service: getAllVoyageWithCustomerCanImportOrder,
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
      headerName: VOYAGE.ID.headerName,
      field: VOYAGE.ID.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE.VESSEL_NAME.headerName,
      field: VOYAGE.VESSEL_NAME.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE.ETA.headerName,
      field: VOYAGE.ETA.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: "Mã đại lý",
      field: "SHIPPER_ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên đại lý",
      field: "FULLNAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Mã số thuế",
      field: "TAX_CODE",
      flex: 1,
      filter: true,
      headerClass: "number-header",
      cellClass: "text-end"
    },
    {
      headerName: "Số cont chưa nhập",
      field: "num_of_cont_can_import",
      flex: 1,
      headerClass: "number-header",
      cellClass: "text-end"
    }
  ];
  const handleSelectRow = () => {
    let rowSelected = gridRef.current.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn chuyến tàu");
      return;
    }
    onSelectedFilterInfo(rowSelected[0]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Danh sách các chuyến tàu có thể làm lệnh nhập</div>
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
          rowData={voyageList || []}
          colDefs={colDefs}
          onRowDoubleClicked={handleSelectRow}
        />
      </SheetContent>
    </Sheet>
  );
}
