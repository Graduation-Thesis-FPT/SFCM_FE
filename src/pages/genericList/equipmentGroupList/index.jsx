import {
  createAndUpdateEquipType,
  deleteEquipType,
  getAllEquipType
} from "@/apis/equipment-type.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/aggridreact/cellRender";
import { bs_equipment_type } from "@/components/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import React, { useRef, useState } from "react";

export function EquipmentGroupList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const BS_EQUIPMENT_TYPE = new bs_equipment_type();
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
      headerName: BS_EQUIPMENT_TYPE.EQU_TYPE.headerName,
      field: BS_EQUIPMENT_TYPE.EQU_TYPE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_EQUIPMENT_TYPE.EQU_TYPE_NAME.headerName,
      field: BS_EQUIPMENT_TYPE.EQU_TYPE_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_EQUIPMENT_TYPE.UPDATE_DATE.headerName,
      field: BS_EQUIPMENT_TYPE.UPDATE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);
    createAndUpdateEquipType(insertAndUpdateData)
      .then(resCreateAndUpdate => {
        toast.success(resCreateAndUpdate);
        getRowData();
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getRowData = () => {
    getAllEquipType()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleDeleteRows = selectedRows => {
    let { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "EQU_TYPE");

    deleteEquipType(deleteIdList)
      .then(resDelete => {
        toast.success(resDelete);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <>
      <Section>
        <Section.Header title="Danh mục loại thiết bị"></Section.Header>
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
                item.EQU_TYPE.toLowerCase().includes(searchData.toLowerCase()) ||
                item.EQU_TYPE_NAME.toLowerCase().includes(searchData.toLowerCase())
              );
            })}
            colDefs={colDefs}
            onDeleteRow={selectedRows => {
              handleDeleteRows(selectedRows);
            }}
            onGridReady={() => {
              gridRef.current.api.showLoadingOverlay();
              getAllEquipType()
                .then(res => {
                  setRowData(res.data.metadata);
                })
                .catch(err => {
                  gridRef.current.api.overlayNoRows();
                  toast.error(err);
                });
            }}
          />
        </Section.Content>
      </Section>
    </>
  );
}
