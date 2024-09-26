import { getAllCustomerCanExportOrders } from "@/apis/export-order.api";
import { getAllVoyage } from "@/apis/voyage.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { dt_vessel_visit } from "@/components/common/aggridreact/dbColumns";
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

export function VesselInfoSelect({ onOpenChange, open, onSelectVesselInfo }) {
  const { data: customerCanExportOrdersList } = useFetchData({
    service: getAllCustomerCanExportOrders,
    dependencies: [open],
    shouldFetch: !!open
  });
  const toast = useCustomToast();
  const gridRef = useRef(null);
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
      headerName: "Mã chủ hàng",
      field: "CONSIGNEE_ID",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên chủ hàng",
      field: "FULLNAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Mã số thuế",
      field: "TAX_CODE",
      flex: 1,
      filter: true
    },
    {
      headerName: "Email",
      field: "EMAIL",
      flex: 1,
      filter: true
    },
    {
      headerName: "Địa chỉ",
      field: "ADDRESS",
      flex: 1,
      filter: true
    },
    {
      headerName: "Số kiện hàng",
      field: "num_of_pk_can_export",
      flex: 0.5,
      headerClass: "number-header",
      cellClass: "text-end"
    }
  ];

  const handleSelectRow = () => {
    let rowSelected = gridRef.current.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn khách hàng");
      return;
    }
    onSelectVesselInfo(rowSelected[0]);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Danh sách các khách hàng có thể làm lệnh xuất</div>
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
          rowData={customerCanExportOrdersList}
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
