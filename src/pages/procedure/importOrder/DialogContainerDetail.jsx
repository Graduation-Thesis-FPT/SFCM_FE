import { getCustomerByCustomerType } from "@/apis/customer.api";
import { getVoyageContainerPackage } from "@/apis/voyage-container-package.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  CustomerRender,
  VoyContPackageStatusRender
} from "@/components/common/aggridreact/cellRender";
import { voyage_container_package } from "@/components/common/aggridreact/dbColumns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/common/ui/sheet";
import useFetchData from "@/hooks/useRefetchData";
import React, { useRef } from "react";

const VOYAGE_CONTAINER_PACKAGE = new voyage_container_package();

export function DialogContainerDetail({ onOpenChange, open, selectedContainer }) {
  const gridRef = useRef(null);
  const { data: consigneeList } = useFetchData({
    service: getCustomerByCustomerType,
    params: "CONSIGNEE"
  });
  const { data: voyageList } = useFetchData({
    service: getVoyageContainerPackage,
    params: selectedContainer?.ID,
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
      headerName: VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: params => CustomerRender(params, consigneeList)
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      }
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.field,
      flex: 1,
      filter: true
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.field,
      flex: 1,
      filter: true
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.CBM.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.CBM.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.NOTE.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.NOTE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.STATUS.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.STATUS.field,
      flex: 1,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: VoyContPackageStatusRender
    }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="top" hiddenIconClose={true} className="p-0">
        <SheetHeader>
          <SheetTitle>
            <span className="mx-10 mt-3 flex items-end justify-between">
              <div className="text-lg font-bold">
                Danh sách hàng hóa trong container {selectedContainer?.CNTR_NO}
              </div>
            </span>
          </SheetTitle>
          <SheetDescription />
        </SheetHeader>
        <AgGrid
          ref={gridRef}
          rowSelection={"single"}
          className="h-[50vh]"
          rowData={voyageList}
          colDefs={colDefs}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
          }}
        />
      </SheetContent>
    </Sheet>
  );
}
