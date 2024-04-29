import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";
export default function AgGrid({ rowData, colDefs, className, defaultColDef }) {
  const style = useMemo(() => {
    return {
      flex: 1,
      editable: true
    };
  }, []);
  return (
    <>
      <div className={cn("ag-theme-quartz h-[500px]", className)}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef ? style : null}
        />
      </div>
    </>
  );
}
