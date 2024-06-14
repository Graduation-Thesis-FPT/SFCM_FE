import { AgGrid } from "@/components/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/aggridreact/cellRender";
import { dt_vessel_visit } from "@/components/aggridreact/dbColumns";
import { useCustomToast } from "@/components/custom-toast";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useRef } from "react";

export function VesselInfoSheet({ open, onOpenChange, vesselList, onChangeVesselInfo }) {
  const gridRef = useRef(null);
  const toast = useCustomToast();
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
      filter: true,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: DT_VESSEL_VISIT.ETD.headerName,
      field: DT_VESSEL_VISIT.ETD.field,
      flex: 1,
      filter: true,
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
    onChangeVesselInfo(rowSelected);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <span className="mx-10 my-3 flex items-end justify-between">
          <div className="text-lg font-bold">Chọn tàu chuyến</div>
          <Button onClick={handleSelectRow} variant="blue">
            Chọn
          </Button>
        </span>

        <AgGrid
          ref={gridRef}
          rowSelection={"single"}
          className="h-[50vh]"
          rowData={vesselList || []}
          colDefs={colDefs}
        />
      </SheetContent>
    </Sheet>
  );
}
