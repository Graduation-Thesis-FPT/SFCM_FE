import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

const AgGrid = forwardRef(
  ({ rowData, colDefs, className, defaultColDef, setRowData, ...props }, ref) => {
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
            ref={ref}
            rowData={rowData}
            columnDefs={colDefs.map((item, index) => {
              if (index === 0) {
                return { ...item, checkboxSelection: true, headerCheckboxSelection: true };
              } else {
                return item;
              }
            })}
            rowSelection={"multiple"}
            // onSelectionChanged={onSelectionChanged}
            suppressRowClickSelection={true}
            defaultColDef={defaultColDef ? style : null}
            onCellValueChanged={e => {
              e.data.status ? null : (e.data.status = "update");
            }}
            {...props}
          />
        </div>
      </>
    );
  }
);

export { AgGrid };
