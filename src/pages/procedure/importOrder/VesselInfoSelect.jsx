import { getAllVessel } from "@/apis/vessel.api";
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
  const { data: vesselList } = useFetchData({ service: getAllVessel });
  const toast = useCustomToast();
  const gridRef = useRef(null);
  const DT_VESSEL_VISIT = new dt_vessel_visit();
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
      headerName: DT_VESSEL_VISIT.VESSEL_NAME.headerName,
      field: DT_VESSEL_VISIT.VESSEL_NAME.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName,
      field: DT_VESSEL_VISIT.INBOUND_VOYAGE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.headerName,
      field: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_VESSEL_VISIT.ETA.headerName,
      field: DT_VESSEL_VISIT.ETA.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: DT_VESSEL_VISIT.ETD.headerName,
      field: DT_VESSEL_VISIT.ETD.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: DT_VESSEL_VISIT.CallSign.headerName,
      field: DT_VESSEL_VISIT.CallSign.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_VESSEL_VISIT.IMO.headerName,
      field: DT_VESSEL_VISIT.IMO.field,
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
    onSelectVesselInfo(rowSelected[0]);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Chọn tàu chuyến</div>
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
          rowData={vesselList || []}
          colDefs={colDefs}
          onRowDoubleClicked={handleSelectRow}
        />
      </SheetContent>
    </Sheet>
  );
}
