import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { FileDown, Loader2 } from "lucide-react";
import moment from "moment";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useCustomToast } from "../../custom-toast";
import { exportToExcel } from "@/lib/utils";

export function BtnExportExcel({ gridRef, isLoading, customExport, ...props }) {
  let { pathname } = useLocation();
  const menu = useSelector(state => state.menuSlice.menu);
  const toast = useCustomToast();

  const handleExportExcel = () => {
    const rowData = gridRef?.current?.props?.rowData;

    if (rowData.length === 0) {
      toast.warning("Không có dữ liệu để xuất Excel");
      return;
    }
    const check = rowData.filter(item => item.status);
    if (check.length > 0) {
      toast.warning("Dữ liệu thay đổi chưa được lưu. Vui lòng lưu trước khi in!");
      return;
    }

    if (customExport) {
      customExport();
      return;
    }

    let col = gridRef?.current?.props?.columnDefs
      ?.filter(item => item.field)
      .map(item => {
        return { field: item.field, headerName: item.headerName };
      });
    col = [{ field: "STT", headerName: "STT" }, ...col];
    const exportData = rowData.map((row, index) => {
      let newRow = { STT: index + 1 };
      col.forEach(col => {
        if (col.field !== "STT") {
          newRow[col.headerName] = row[col.field];
        }
      });
      return newRow;
    });

    let fileName = "";
    menu?.forEach(item =>
      item?.child?.forEach(child => {
        let isMenuSelected = pathname === `/${item.ID}/${child.ID}`;
        if (isMenuSelected) {
          fileName = `${child.NAME} (${moment().format("DD/MM/Y")}).xlsx`;
          return;
        }
      })
    );

    exportToExcel(exportData, fileName);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleExportExcel}
            disabled={isLoading}
            size="tool"
            variant="none-border"
            {...props}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileDown className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xuất Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
