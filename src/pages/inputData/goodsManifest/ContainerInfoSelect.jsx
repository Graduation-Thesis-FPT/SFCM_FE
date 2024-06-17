import { getManifestLoadingListContByFilter } from "@/apis/cntr-mnf-ld.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { StatusOfGoodsByTextRender } from "@/components/common/aggridreact/cellRender";
import { dt_cntr_mnf_ld } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Button } from "@/components/common/ui/button";
import { Sheet, SheetContent } from "@/components/common/ui/sheet";
import useFetchData from "@/hooks/useRefetchData";
import { useEffect, useRef } from "react";

export function ContainerInfoSelect({ open, onOpenChange, VOYAGEKEY, onSelectContainerInfo }) {
  const { data: manifestLoadingList, revalidate } = useFetchData({
    service: getManifestLoadingListContByFilter,
    params: VOYAGEKEY
  });
  const toast = useCustomToast();
  const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();
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
      headerName: DT_CNTR_MNF_LD.STATUSOFGOOD.headerName,
      field: DT_CNTR_MNF_LD.STATUSOFGOOD.field,
      flex: 1,
      filter: true,
      cellRenderer: StatusOfGoodsByTextRender
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
      toast.warning("Vui lòng chọn container");
      return;
    }
    onSelectContainerInfo(rowSelected[0]);
  };
  useEffect(() => {
    revalidate();
  }, [VOYAGEKEY]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <span className="mx-10 my-3 flex items-end justify-between">
          <div className="text-lg font-bold">Chọn container</div>
          <Button onClick={handleSelectRow} variant="blue">
            Chọn
          </Button>
        </span>

        <AgGrid
          ref={gridRef}
          rowSelection={"single"}
          className="h-[50vh]"
          rowData={manifestLoadingList || []}
          colDefs={colDefs}
        />
      </SheetContent>
    </Sheet>
  );
}
