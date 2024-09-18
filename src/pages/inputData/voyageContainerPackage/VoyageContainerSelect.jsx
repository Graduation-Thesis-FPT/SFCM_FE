import { getVoyageContainerByVoyageID } from "@/apis/voyage-container.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { voyage_container } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/common/ui/sheet";
import useFetchData from "@/hooks/useRefetchData";
import { useEffect, useRef } from "react";

const VOYAGE_CONTAINER = new voyage_container();

export function VoyageContainerSelect({
  open,
  onOpenChange,
  VOYAGE_ID,
  onSelectContainerInfo,
  onGoBack
}) {
  const toast = useCustomToast();
  const gridRef = useRef(null);

  const { data: voyageContainerList, revalidate } = useFetchData({
    service: getVoyageContainerByVoyageID,
    params: VOYAGE_ID
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
      headerName: VOYAGE_CONTAINER.CNTR_NO.headerName,
      field: VOYAGE_CONTAINER.CNTR_NO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER.CNTR_SIZE.headerName,
      field: VOYAGE_CONTAINER.CNTR_SIZE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER.SHIPPER_ID.headerName,
      field: VOYAGE_CONTAINER.SHIPPER_ID.field,
      flex: 1,
      filter: true
      // cellRenderer: params => CustomerRender(params, shipperList)
    },
    {
      headerName: VOYAGE_CONTAINER.SEAL_NO.headerName,
      field: VOYAGE_CONTAINER.SEAL_NO.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER.NOTE.headerName,
      field: VOYAGE_CONTAINER.NOTE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: "Trạng thái cont",
      field: VOYAGE_CONTAINER.STATUS.field,
      flex: 1,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: params => {
        if (params.value === "IMPORTED") {
          return (
            <Badge className="rounded-sm border-transparent bg-red-100 text-red-800 hover:bg-red-200">
              Đã nhập
            </Badge>
          );
        }
        return (
          <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
            Chưa nhập
          </Badge>
        );
      }
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

  useEffect(() => {
    revalidate();
  }, [VOYAGE_ID]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 my-3 flex items-end justify-between">
              <div className="text-lg font-bold">Chọn container</div>
              <div className="space-x-3">
                <Button onClick={onGoBack} variant="outline">
                  Chọn lại tàu chuyến
                </Button>
                {voyageContainerList?.length > 0 && (
                  <Button onClick={handleSelectRow} variant="blue">
                    Chọn
                  </Button>
                )}
              </div>
            </span>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <AgGrid
          ref={gridRef}
          rowSelection={"single"}
          className="h-[50vh]"
          rowData={voyageContainerList || []}
          colDefs={colDefs}
          onRowDoubleClicked={handleSelectRow}
        />
      </SheetContent>
    </Sheet>
  );
}
