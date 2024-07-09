import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { Loader2, Printer } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useCustomToast } from "@/components/common/custom-toast";
import { ComponentPrintLabel } from "./ComponentPrintLabel";

export function BtnPrintLabel({ isLoading = false, gridRef, vesselInfo = {}, containerInfo = {} }) {
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const printRef = useRef(null);
  const toast = useCustomToast();

  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

  const handleOpenDialog = () => {
    if (gridRef.current.props.rowData.length === 0) {
      toast.warning("Không có dữ liệu để in. Vui lòng kiểm tra lại!");
      return;
    }

    if (gridRef.current.api.getSelectedRows().length === 0) {
      toast.warning("Vui lòng chọn dòng cần in!");
      return;
    }

    let check = gridRef.current.props.rowData.filter(item => item.status);
    if (check.length > 0) {
      toast.warning("Dữ liệu thay đổi chưa được lưu. Vui lòng lưu trước khi in!");
      return;
    }

    setSelectedRow(gridRef.current.api.getSelectedRows());

    setOpen(true);
  };
  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={isLoading}
              size="tool"
              variant="none-border"
              onClick={() => {
                handleOpenDialog();
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Printer className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>In label</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
        }}
      >
        <DialogContent
          hiddenIconClose={true}
          className="max-h-[80vh] max-w-[80vw] overflow-y-auto p-0"
          onOpenAutoFocus={e => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>
              <ComponentPrintLabel
                ref={printRef}
                selectedRow={selectedRow}
                vesselInfo={vesselInfo}
                containerInfo={containerInfo}
              />
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
          <DialogFooter className="p-5">
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="outline"
            >
              Đóng
            </Button>
            <Button onClick={handlePrint} variant="blue">
              In công văn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
