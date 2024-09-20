import { getAllVoyage } from "@/apis/voyage.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { voyage } from "@/components/common/aggridreact/dbColumns";
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

const VOYAGEKEY = new voyage();

export function VesselInfoSheet({ open, onOpenChange, onChangeVesselInfo }) {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const { data: voyageList } = useFetchData({
    service: getAllVoyage,
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
      headerName: VOYAGEKEY.ID.headerName,
      field: VOYAGEKEY.ID.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGEKEY.VESSEL_NAME.headerName,
      field: VOYAGEKEY.VESSEL_NAME.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGEKEY.ETA.headerName,
      field: VOYAGEKEY.ETA.field,
      flex: 1,
      cellDataType: "date"
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
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Chọn chuyến tàu </div>
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
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
