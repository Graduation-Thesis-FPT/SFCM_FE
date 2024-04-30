import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";
import BtnAddRow from "./BtnAddRow";
import { fnAddRows } from "@/lib/fnTable";
export default function AgGrid({ rowData, colDefs, className, defaultColDef, onChangeRowData }) {
  const style = useMemo(() => {
    return {
      flex: 1,
      editable: true
    };
  }, []);

  const handleAddNewRow = numOfNewRow => {
    let temp = fnAddRows(numOfNewRow, rowData);
    onChangeRowData(temp);
  };

  const onSelectionChanged = e => {
    console.log("🚀 ~ AgGrid ~ value:", e.api.getSelectedRows());
  };

  return (
    <>
      <div className="mb-2 flex justify-end">
        <BtnAddRow
          addNewRow={numOfNewRow => {
            handleAddNewRow(numOfNewRow);
          }}
        />
      </div>
      <div className={cn("ag-theme-quartz h-[500px]", className)}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          rowSelection={"multiple"}
          onSelectionChanged={onSelectionChanged}
          defaultColDef={defaultColDef ? style : null}
        />
      </div>
    </>
  );
}
