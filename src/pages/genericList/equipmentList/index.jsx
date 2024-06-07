import { AgGrid } from "@/components/aggridreact/AgGrid";
import { DateTimeRenderByText } from "@/components/aggridreact/cellRender";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRows } from "@/lib/fnTable";
import { useRef, useState } from "react";

export function EquipmentList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);

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
      headerName: "EQU_CODE",
      field: "EQU_CODE",
      flex: 1,
      filter: true,
      editable: true
    },

    {
      headerName: "EQU_TYPE",
      field: "EQU_TYPE",
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "EQU_CODE_NAME",
      field: "EQU_CODE_NAME",
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: "BLOCK",
      field: "BLOCK",
      flex: 1,
      filter: true,
      editable: true
    }
  ];

  const [searchData, setSearchData] = useState("");

  const handleAddRow = () => {
    let newRowData = fnAddRows(rowData);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {};

  const handleDeleteRows = () => {};

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
              item.EQU_CODE?.toLowerCase().includes(searchData.toLowerCase()) ||
              item.EQU_TYPE?.toLowerCase().includes(searchData.toLowerCase()) ||
              item.EQU_CODE_NAME?.toLowerCase().includes(searchData.toLowerCase()) ||
              item.EQU_BLOCK?.toLowerCase().includes(searchData.toLowerCase())
            );
          })}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRows(selectedRows);
          }}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            setRowData([]);
          }}
        />
      </Section.Content>
    </Section>
  );
}
