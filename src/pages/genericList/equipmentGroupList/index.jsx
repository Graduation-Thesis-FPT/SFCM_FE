import { createAndUpdateEquipType, deleteEquipType, getAllEquipType } from "@/apis/equipment-type.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { DateTimeRenderByText } from "@/components/aggridreact/cellRender";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import React, { useRef, useState } from "react";

export function EquipmentGroupList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [searchData, setSearchData] = useState("");
  const colDefs = [
    {
      cellStyle: { textAlign: "center", background: "rgb(249 250 251)" },
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: "Mã thiết bị *",
      field: "EQU_TYPE",
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "Tên thiết bị *",
      field: "EQU_TYPE_NAME",
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "Ngày cập nhật",
      field: "UPDATE_DATE",
      flex: 1,
      cellRenderer: DateTimeRenderByText
    }
  ];

  const handleAddRow = () => {
    let newRowData = fnAddRows(rowData);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);

    if (insertAndUpdateData.update.length > 0) {
      const columnUpdate = ["EQU_TYPE", "EQU_TYPE_NAME"];
      insertAndUpdateData.update = insertAndUpdateData.update.map(obj =>
        Object.fromEntries(columnUpdate.map(key => [key, obj[key]]))
      );
    }

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
    let rowTemps = [];
    let liseIdDetele = [];
    selectedRows.forEach(item => {
      if (item.key) {
        rowTemps.push(item.key);
      } else {
        liseIdDetele.push(item.EQU_TYPE);
      }
    });

    if (rowTemps.length > 0 && liseIdDetele.length === 0) {
      let newRowData = [...rowData].filter(row => !rowTemps.includes(row.key));
      setRowData(newRowData);
      return;
    }

    deleteEquipType(liseIdDetele)
      .then(resDelete => {
        getAllEquipType()
          .then(res => {
            toast.success(resDelete);
            setRowData(res.data.metadata);
          })
          .catch(err => {
            toast.error(err);
          });
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
