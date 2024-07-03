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
} from "@/components/common/ui/context-menu";
import { actionGrantPermission } from "@/constants";
import { Trash2 } from "lucide-react";
import moment from "moment";
import { GrantPermission } from "../grant-permission";
import { Checkbox } from "../ui/checkbox";

const AgGrid = forwardRef(
  (
    {
      rowData = [],
      colDefs = [],
      className,
      defaultColDef,
      setRowData,
      contextMenu = false,
      onDeleteRow,
      showCountRowSelected = false,
      ...props
    },
    ref
  ) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const contextRef = useRef(null);
    const [checkBoxSelected, setCheckBoxSelected] = useState(false);
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
        },
        date: {
          baseDataType: "date",
          extendsDataType: "date",
          valueParser: params => {
            if (params.newValue == null) {
              return null;
            }
            return moment(params.newValue).format("DD/MM/YYYY");
          },
          valueFormatter: params => {
            return params.value == null ? "" : moment(params.value).format("DD/MM/YYYY");
          }
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
      const dataSelected = ref?.current?.api.getSelectedRows();
      if (ref?.current?.props?.rowData.length === dataSelected.length) {
        setCheckBoxSelected(true);
      } else if (dataSelected.length === 0) {
        setCheckBoxSelected(false);
      } else if (
        dataSelected.length > 0 &&
        dataSelected.length < ref?.current?.props?.rowData.length
      ) {
        setCheckBoxSelected("indeterminate");
      }

      setSelectedRows(dataSelected);
    }, []);

    const getRowClass = useCallback(
      params => {
        if (params.data.status) {
          return params.data.status === "update" ? "!bg-yellow-50" : "!bg-green-50";
        }
      },
      [selectedRows]
    );

    const handleCheckBoxSelected = () => {
      if (ref?.current?.props?.rowData.length === 0) return;
      let nextStatus;
      if (checkBoxSelected === "indeterminate") {
        ref.current.api.selectAll();
        nextStatus = true;
      } else if (checkBoxSelected === true) {
        ref.current.api.deselectAll();
        nextStatus = false;
      } else if (checkBoxSelected === false) {
        ref.current.api.selectAll();
        nextStatus = true;
      }
      setCheckBoxSelected(nextStatus);
    };

    return (
      <ContextMenu>
        <ContextMenuTrigger className=" h-full" disabled={contextMenu === true ? false : true}>
          <div className={cn("ag-theme-quartz custom-header relative h-full", className)}>
            {showCountRowSelected && (
              <div className="absolute -top-8 left-0 flex cursor-default">
                <Checkbox
                  className="mr-2 border-gray-600/50 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=indeterminate]:bg-gray-600/50"
                  checked={checkBoxSelected}
                  onCheckedChange={handleCheckBoxSelected}
                />
                {checkBoxSelected === "indeterminate"
                  ? `Đang chọn ${selectedRows.length} dòng`
                  : checkBoxSelected
                    ? `Đang chọn tất cả`
                    : `Chưa chọn dòng`}
              </div>
            )}

            <AgGridReact
              getRowClass={getRowClass}
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
              paginationPageSize={30}
              paginationPageSizeSelector={[10, 30, 50, 100]}
              overlayLoadingTemplate={
                '<span class="ag-overlay-loading-center">Đang tải dữ liệu...</span>'
              }
              overlayNoRowsTemplate={"Không có dữ liệu"}
              stopEditingWhenCellsLoseFocus={true}
              suppressDragLeaveHidesColumns={true} // không cho ẩn cột khi kéo ra khỏi grid
              {...props}
            />
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent ref={contextRef} className="w-64">
          <GrantPermission action={actionGrantPermission.DELETE}>
            <ContextMenuItem
              className={cn(
                "font-medium focus:text-red-500",
                selectedRows.length === 0 ? "text-red-500/50" : "text-red-500"
              )}
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
    );
  }
);

export { AgGrid };
