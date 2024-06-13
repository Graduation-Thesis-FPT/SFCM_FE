import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "@/components/ui/context-menu";
import { GrantPermission } from "../common";
import { actionGrantPermission } from "@/constants";
import { Trash2 } from "lucide-react";

const AgGrid = forwardRef(
  (
    { rowData, colDefs, className, defaultColDef, setRowData, contextMenu, onDeleteRow, ...props },
    ref
  ) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const contextRef = useRef(null);
    const dataTypeDefinitions = useMemo(() => {
      return {
        email: {
          baseDataType: "text",
          extendsDataType: "text",
          // valueParser: params =>
          //   params.newValue != null && params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
          //     ? params.newValue
          //     : null,
          // valueFormatter: params => (params.value == null ? "" : params.value),
          dataTypeMatcher: value =>
            typeof value === "string" &&
            value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)
        }
      };
    }, []);

    const handleDeleteRow = () => {
      let keyInsert = [];
      let dataInDb = [];

      selectedRows.forEach(item => {
        if (item.status === "insert") {
          keyInsert.push(item.key);
        } else {
          dataInDb.push(item);
        }
      });

      //Chỉ xóa dòng chưa lưu vào database
      if (keyInsert.length > 0 && dataInDb.length === 0) {
        setRowData(rowData.filter(item => !keyInsert.includes(item.key)));
        return;
      }

      onDeleteRow(selectedRows);
    };

    const onSelectionChanged = useCallback(() => {
      setSelectedRows(ref.current.api.getSelectedRows());
    }, []);

    return (
      <>
        <ContextMenu>
          <ContextMenuTrigger disabled={contextMenu === true ? false : true}>
            <div className={cn("ag-theme-quartz custom-header h-[500px] ", className)}>
              <AgGridReact
                dataTypeDefinitions={dataTypeDefinitions}
                ref={ref}
                rowData={rowData}
                columnDefs={colDefs}
                rowSelection={"multiple"}
                onSelectionChanged={onSelectionChanged}
                onCellValueChanged={e => {
                  e.data.status ? null : (e.data.status = "update");
                }}
                pagination={true}
                paginationPageSize={10}
                paginationPageSizeSelector={[10, 30, 50, 100]}
                overlayLoadingTemplate={
                  '<span class="ag-overlay-loading-center">Đang tải dữ liệu...</span>'
                }
                overlayNoRowsTemplate={"Không có dữ liệu"}
                {...props}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent ref={contextRef} className="w-64">
            <GrantPermission action={actionGrantPermission.DELETE}>
              <ContextMenuItem
                className={`font-medium  focus:text-red-500 ${selectedRows.length === 0 ? "text-red-500/50" : "text-red-500"}`}
                disabled={selectedRows.length === 0 ? true : false}
                onClick={() => {
                  handleDeleteRow(selectedRows);
                }}
              >
                <Trash2 className="mr-2 size-4" />
                Xóa dòng
              </ContextMenuItem>
            </GrantPermission>
          </ContextMenuContent>
        </ContextMenu>
      </>
    );
  }
);

export { AgGrid };
