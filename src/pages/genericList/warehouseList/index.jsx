import { createWarehouse, deleteWarehouse, getAllWarehouse } from "@/apis/warehouse.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import useFetchData from "@/hooks/useRefetchData";
import { useSetData } from "@/hooks/useSetData";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { DetailWarehouse } from "./DetailWarehouse";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";

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
      }
    },
    {
      headerName: "Mã kho *",
      field: "WAREHOUSE_CODE",
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      onCellValueChanged: UpperCase
    },
    {
      headerName: "Tên kho *",
      field: "WAREHOUSE_NAME",
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "Ngày cập nhật",
      field: "UPDATED_AT",
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];

  const handleDeleteData = deteleData => {
    dispatch(setGlobalLoading(true));
    let { deleteIdList } = fnDeleteRows(deteleData, rowData, "WAREHOUSE_CODE");
    deleteWarehouse({ data: deleteIdList })
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

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }
    dispatch(setGlobalLoading(true));

    createWarehouse(insertAndUpdateData)
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
      <Section.Header title="Danh sách các kho"></Section.Header>
      <Section.Content>
        <LayoutTool>
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
        <Section.Table>
          <AgGrid
            showCountRowSelected={true}
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
        </Section.Table>
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
