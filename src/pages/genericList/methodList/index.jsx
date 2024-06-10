import { AgGrid } from "@/components/aggridreact/AgGrid";
import { bs_method } from "@/components/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRows } from "@/lib/fnTable";
import { useRef, useState } from "react";

export function MethodList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const BS_METHOD = new bs_method();

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
      headerName: BS_METHOD.METHOD_CODE.headerName,
      field: BS_METHOD.METHOD_CODE.field,
      flex: 1,
      filter: true,
      editable: true
    },

    {
      headerName: BS_METHOD.METHOD_NAME.headerName,
      field: BS_METHOD.METHOD_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_METHOD.IS_IN_OUT.headerName,
      field: BS_METHOD.IS_IN_OUT.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_METHOD.IS_SERVICE.headerName,
      field: BS_METHOD.IS_SERVICE.field,
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
