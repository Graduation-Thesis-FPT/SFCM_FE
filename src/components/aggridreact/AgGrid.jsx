import { useCallback, useMemo, useState } from "react";
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

const AgGrid = forwardRef(
  ({ rowData, colDefs, className, defaultColDef, setRowData, contextMenu, ...props }, ref) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const style = useMemo(() => {
      return {
        flex: 1,
        editable: true
      };
    }, []);

    const onSelectionChanged = useCallback(() => {
      setSelectedRows(ref.current.api.getSelectedRows());
    }, []);

    return (
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
        <ContextMenuContent className="w-64">
          <GrantPermission action={actionGrantPermission.DELETE}>
            <ContextMenuItem
              inset
              disabled={selectedRows.length === 0 ? true : false}
              onClick={() => {
                console.log(selectedRows);
              }}
            >
              Xóa dòng
            </ContextMenuItem>
          </GrantPermission>

          <ContextMenuItem inset disabled>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuCheckboxItem checked disabled>
            Show Bookmarks Bar
            <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
          </ContextMenuCheckboxItem>

          <ContextMenuCheckboxItem disabled>Show Full URLs</ContextMenuCheckboxItem>

          <ContextMenuSeparator />

          <ContextMenuRadioGroup value="pedro">
            <ContextMenuRadioItem value="pedro" disabled>
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm" disabled>
              Colm Tuite
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    );
  }
);

export { AgGrid };
