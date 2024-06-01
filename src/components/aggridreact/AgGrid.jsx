import { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
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
    const [open, setOpen] = useState(false);
    const style = useMemo(() => {
      return {
        flex: 1,
        editable: true
      };
    }, []);

    const handleDeleteRow = () => {
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
                defaultColDef={defaultColDef ? style : null}
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
