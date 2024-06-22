import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { FileSpreadsheet, Loader2 } from "lucide-react";

export const BtnDownExcelGoodsMnfSample = ({
  gridRef,
  itemType = [],
  unit = [],
  isLoading = false
}) => {
  const createExcelFile = async () => {
    let firstRow = gridRef.current.props.columnDefs
      .filter(item => item.field)
      .map(item => {
        return { header: item.headerName, key: item.field, width: 15 };
      });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    worksheet.columns = [{ header: "STT", key: "STT", width: 10 }, ...firstRow];

    const itemTypeCodeOption = itemType.map(item => item.ITEM_TYPE_CODE).join(",");
    const unitCodeOption = unit.map(item => item.UNIT_CODE).join(",");

    worksheet.getCell("D2").dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${itemTypeCodeOption}"`]
    };

    worksheet.getCell("E2").dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${unitCodeOption}"`]
    };

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a blob from the buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    saveAs(blob, "Bảng kê hàng hóa (Mẫu).xlsx");
    return;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button disabled={isLoading} size="tool" variant="none-border" onClick={createExcelFile}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xuất file excel mẫu</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
