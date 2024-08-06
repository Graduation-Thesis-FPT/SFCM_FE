import { getAllVessel } from "@/apis/vessel.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  StatusOfGoodsByTextRender
} from "@/components/common/aggridreact/cellRender";
import { dt_cntr_mnf_ld, dt_vessel_visit } from "@/components/common/aggridreact/dbColumns";
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

export function ContainerSelect({ onOpenChange, open, onSelectContainerInfo, contList }) {
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();
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
      headerName: DT_CNTR_MNF_LD.BILLOFLADING.headerName,
      field: DT_CNTR_MNF_LD.BILLOFLADING.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.CNTRNO.headerName,
      field: DT_CNTR_MNF_LD.CNTRNO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.CNTRSZTP.headerName,
      field: DT_CNTR_MNF_LD.CNTRSZTP.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.SEALNO.headerName,
      field: DT_CNTR_MNF_LD.SEALNO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.CONSIGNEE.headerName,
      field: DT_CNTR_MNF_LD.CONSIGNEE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName,
      field: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_CNTR_MNF_LD.COMMODITYDESCRIPTION.headerName,
      field: DT_CNTR_MNF_LD.COMMODITYDESCRIPTION.field,
      flex: 1,
      filter: true
    }
  ];

  const handleSelectRow = () => {
    let rowSelected = gridRef.current.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn tàu chuyến");
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
              <div className="text-lg font-bold">Chọn container</div>
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
          rowData={contList || []}
          colDefs={colDefs}
          onRowDoubleClicked={handleSelectRow}
        />
      </SheetContent>
    </Sheet>
  );
}
