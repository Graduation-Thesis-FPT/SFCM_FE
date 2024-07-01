import { createAndUpdateGate, deleteGate, getAllGate } from "@/apis/gate.api";
import { getAllWarehouse } from "@/apis/warehouse.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  IsInOutGateRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { bs_gate } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { useCustomToast } from "@/components/common/custom-toast";
import { SearchInput } from "@/components/common/search";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRows, fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export function GateList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [searchData, setSearchData] = useState("");
  const dispatch = useDispatch();
  const BS_GATE = new bs_gate();
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
      headerName: BS_GATE.GATE_CODE.headerName,
      field: BS_GATE.GATE_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_GATE.GATE_NAME.headerName,
      field: BS_GATE.GATE_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_GATE.IS_IN_OUT.headerName,
      field: BS_GATE.IS_IN_OUT.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: IsInOutGateRender
    },
    {
      headerName: BS_GATE.UPDATE_DATE.headerName,
      field: BS_GATE.UPDATE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];
  const getRowData = () => {
    getAllGate()
      .then(res => {
        setRowData(res.data.metadata);
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
    let { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);
    createAndUpdateGate(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowData();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    dispatch(setGlobalLoading(true));
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      selectedRows,
      rowData,
      "GATE_CODE"
    );
    deleteGate(deleteIdList)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  useEffect(() => {
    getAllWarehouse()
      .then(res => {
        setWarehouses(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  }, []);
  return (
    <Section>
      <Section.Header title="Danh mục cổng"></Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <SearchInput
            handleSearch={value => {
              setSearchData(value);
            }}
          />
          <LayoutTool>
            <GrantPermission action={actionGrantPermission.CREATE}>
              <BtnAddRow onAddRow={handleAddRow} />
            </GrantPermission>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
        </span>

        <AgGrid
          contextMenu={true}
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          className="h-[50vh]"
          rowData={rowData?.filter(item => {
            if (searchData === "") return item;
            return (
              item.GATE_CODE?.toLowerCase().includes(searchData.toLowerCase()) ||
              item.GATE_NAME?.toLowerCase().includes(searchData.toLowerCase()) ||
              item.IS_IN_OUT?.toLowerCase().includes(searchData.toLowerCase())
            );
          })}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRows(selectedRows);
          }}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            getRowData();
          }}
        />
      </Section.Content>
    </Section>
  );
}
