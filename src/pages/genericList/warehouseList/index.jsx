import { deleteWarehouse, getAllWarehouse } from "@/apis/warehouse.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { SearchInput } from "@/components/common/search";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { actionGrantPermission } from "@/constants";
import { fnDeleteRows } from "@/lib/fnTable";
import { PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { DetailWarehouse } from "./DetailWarehouse";
import { FormCreateWarehouse } from "./FormCreateWarehouse";

let data = [
  { WAREHOUSE_CODE: "SFCM", WAREHOUSE_NAME: "SFCM", ACREAGE: 10000 },
  { WAREHOUSE_CODE: "CFS", WAREHOUSE_NAME: "CFS", ACREAGE: 10000 }
];

export function WarehouseList() {
  const gridRef = useRef(null);
  const [isOpenCreateWarehouse, setIsOpenCreateWarehouse] = useState(false);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [detailWarehouse, setDetailData] = useState({});
  const [isOpenDetailWarehouse, setIsOpenDetailWarehouse] = useState(false);
  const [searchData, setSearchData] = useState("");
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
      headerName: "Mã kho *",
      field: "WAREHOUSE_CODE",
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên kho *",
      field: "WAREHOUSE_NAME",
      flex: 1,
      filter: true
    },
    {
      headerName: "Diện tích (m2) *",
      field: "ACREAGE",
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 10000
      },
      flex: 1
    },
    {
      flex: 0.5,
      cellRenderer: params => {
        return (
          <span
            onClick={() => {
              setDetailData(params.data);
              setIsOpenDetailWarehouse(true);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Xem
          </span>
        );
      }
    }
  ];
  const handleAddRow = () => {};

  const handleSave = () => {};

  const handleDeleteData = deteleData => {
    let { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      [deteleData],
      rowData,
      "WAREHOUSE_CODE"
    );
    deleteWarehouse(deleteIdList)
      .then(res => {
        setIsOpenDetailWarehouse(false);
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleCreateWarehouse = newRows => {
    setRowData(prevRowData => [...newRows, ...prevRowData]);
  };
  return (
    <Section>
      <Section.Header title="Danh sách các kho">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <Button
            variant="blue"
            className="h-[36px] px-[16px] py-[8px] text-xs"
            onClick={() => {
              setIsOpenCreateWarehouse(true);
            }}
          >
            <PlusCircle className="mr-2 size-4" />
            Tạo kho mới
          </Button>
        </GrantPermission>
      </Section.Header>

      <Section.Content>
        <SearchInput
          handleSearch={value => {
            setSearchData(value);
          }}
        />
        <AgGrid
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          className="h-[50vh]"
          rowData={rowData?.filter(item => {
            if (searchData === "") return item;
            return (
              item.WAREHOUSE_CODE.toLowerCase().includes(searchData.toLowerCase()) ||
              item.WAREHOUSE_NAME.toLowerCase().includes(searchData.toLowerCase())
            );
          })}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRow(selectedRows);
          }}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            getAllWarehouse().then(res => {
              setRowData(res.data.metadata);
            });
          }}
        />
      </Section.Content>
      <FormCreateWarehouse
        open={isOpenCreateWarehouse}
        onOpenChange={() => {
          setIsOpenCreateWarehouse(false);
        }}
        onCreateData={newRows => {
          handleCreateWarehouse(newRows);
        }}
      />
      <DetailWarehouse
        onDeleteData={deteleData => {
          handleDeleteData(deteleData);
        }}
        open={isOpenDetailWarehouse}
        detailData={detailWarehouse}
        onOpenChange={() => {
          setIsOpenDetailWarehouse(false);
        }}
      />
    </Section>
  );
}
