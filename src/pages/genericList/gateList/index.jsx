import { createAndUpdateGate, getAllGate } from "@/apis/gate.api";
import { getAllWarehouse } from "@/apis/warehouse.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { OnlyEditWithInsertCell } from "@/components/aggridreact/cellRender";
import { bs_gate } from "@/components/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
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
      headerName: BS_GATE.WAREHOUSE_CODE.headerName,
      field: BS_GATE.WAREHOUSE_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: warehouses.map(item => item.WAREHOUSE_CODE)
      }
    },
    {
      headerName: BS_GATE.GATE_CODE.headerName,
      field: BS_GATE.GATE_CODE.field,
      flex: 1,
      filter: true,
      editable: true
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
      editable: true
    },
    {
      flex: 0.5,
      cellRenderer: params => {
        return (
          <span
            onClick={() => {
              //   setDetailData(params.data);
              //   setIsOpenDetailWarehouse(true);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Xem
          </span>
        );
      }
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
    let newRowData = fnAddRows(rowData);
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

  const handleDeleteRows = () => {};

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
      <Section.Header title="Danh mục thiết bị"></Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <SearchInput
            handleSearch={value => {
              setSearchData(value);
            }}
          />
          <span>
            <div className="mb-2 text-xs font-medium">Công cụ</div>
            <div className="flex h-[42px] items-center gap-x-3 rounded-md bg-gray-100 px-6">
              <GrantPermission action={actionGrantPermission.CREATE}>
                <BtnAddRow onAddRow={handleAddRow} />
              </GrantPermission>
              <GrantPermission action={actionGrantPermission.UPDATE}>
                <BtnSave onClick={handleSaveRows} />
              </GrantPermission>
            </div>
          </span>
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
              item.WAREHOUSE_CODE?.toLowerCase().includes(searchData.toLowerCase()) ||
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
