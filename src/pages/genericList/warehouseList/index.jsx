import { createWarehouse, deleteWarehouse, getAllWarehouse } from "@/apis/warehouse.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { OnlyEditWithInsertCell } from "@/components/common/aggridreact/cellRender";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { actionGrantPermission } from "@/constants";
import useFetchData from "@/hooks/useRefetchData";
import { useSetData } from "@/hooks/useSetData";
import { fnAddRowsVer2, fnDeleteRows } from "@/lib/fnTable";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DetailWarehouse } from "./DetailWarehouse";
import { FormCreateWarehouse } from "./FormCreateWarehouse";
import { set } from "date-fns";

export function WarehouseList() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [detailWarehouse, setDetailData] = useState({});
  const { data: warehouses, revalidate } = useFetchData({ service: getAllWarehouse });
  const [rowData, setRowData] = useSetData(warehouses);

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 50,
      comparator: (nodeA, nodeB) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      },
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: "Mã kho *",
      field: "WAREHOUSE_CODE",
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: "Tên kho *",
      field: "WAREHOUSE_NAME",
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: "Diện tích (m2) *",
      field: "ACREAGE",
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 10000
      },
      flex: 1,
      editable: OnlyEditWithInsertCell
    },
    {
      flex: 0.6,
      minWidth: 100,
      cellRenderer: params => {
        if (params.data.status === "insert") return null;
        return (
          <Button
            variant="link"
            onClick={() => {
              setDetailData(params.data);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Xem
          </Button>
        );
      }
    }
  ];

  const handleDeleteData = deteleData => {
    let { deleteIdList } = fnDeleteRows(deteleData, rowData, "WAREHOUSE_CODE");
    deleteWarehouse({ data: deleteIdList })
      .then(res => {
        toast.success(res);
        revalidate();
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };
  const handleSaveRows = () => {
    dispatch(setGlobalLoading(true));
    const newData = rowData
      .filter(item => item.status === "insert")
      .map(({ key, status, ...rest }) => rest);

    createWarehouse({ data: { insert: newData, update: [] } })
      .then(res => {
        toast.success(res);
        revalidate();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  return (
    <Section>
      <Section.Header title="Danh sách các kho">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <FormCreateWarehouse revalidate={revalidate} />
        </GrantPermission>
      </Section.Header>

      <Section.Content>
        <LayoutTool>
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
        <AgGrid
          contextMenu
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          rowData={rowData}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteData(selectedRows);
          }}
        />
      </Section.Content>

      <DetailWarehouse
        onDeleteData={deteleData => {
          handleDeleteData(deteleData);
          setDetailData({});
        }}
        detailData={detailWarehouse}
        onOpenChange={() => {
          setDetailData({});
        }}
      />
    </Section>
  );
}
