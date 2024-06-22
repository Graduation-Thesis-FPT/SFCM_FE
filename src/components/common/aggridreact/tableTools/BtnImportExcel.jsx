import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { FileUp, Loader2 } from "lucide-react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { useCustomToast } from "../../custom-toast";
import { useDispatch } from "react-redux";

export function BtnImportExcel({ isLoading, onFileUpload, gridRef, ...props }) {
  const fileInputRef = useRef(null);
  const toast = useCustomToast();

  const handleFileUpload = event => {
    const file = event.target.files[0];

    if (file) {
      if (
        (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
          file.type !== "application/vnd.ms-excel") ||
        (file.name.split(".").pop().toLowerCase() !== "xlsx" &&
          file.name.split(".").pop().toLowerCase() !== "xls")
      ) {
        fileInputRef.current.value = "";
        toast.error("File không đúng định dạng. Vui lòng chọn file excel (.xlsx, .xls)!");
        return;
      }
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        fileInputRef.current.value = "";
        const rowDataFileUpload = mapKeysFileUpload(jsonData);
        onFileUpload(rowDataFileUpload);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const mapKeysFileUpload = jsonData => {
    const colDefs = gridRef.current.props.columnDefs
      ?.filter(item => item.field)
      .map(item => {
        return { field: item.field, headerName: item.headerName };
      });

    const headerToFieldMap = {};
    colDefs.forEach(colDef => {
      headerToFieldMap[colDef.headerName] = colDef.field;
    });
    return jsonData.map(item => {
      const newItem = {};
      Object.keys(item).forEach(key => {
        if (headerToFieldMap[key]) {
          newItem[headerToFieldMap[key]] = item[key];
        }
      });
      return { ...newItem, status: "insert", key: uuidv4() };
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <input
        className="hidden"
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isLoading}
              size="tool"
              variant="none-border"
              onClick={handleClick}
              {...props}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileUp className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Nhập Excel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
