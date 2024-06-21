import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { FileUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";

export function BtnImportExcel({ isLoading, onFileUpload, ...props }) {
  const fileInputRef = useRef(null);

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        fileInputRef.current.value = "";
        onFileUpload(jsonData);
      };
      reader.readAsArrayBuffer(file);
    }
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
