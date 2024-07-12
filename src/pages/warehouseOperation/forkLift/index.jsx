import {
  changePalletPosition,
  getAllPalletPositionByWarehouseCode,
  getPalletByStatus,
  inputPalletToCell
} from "@/apis/pallet.api";
import { getAllWarehouse } from "@/apis/warehouse.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { Label } from "@/components/common/ui/label";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/common/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import useFetchData from "@/hooks/useRefetchData";
import { useEffect, useRef, useState } from "react";
import { CellList } from "./cellList";
import { JobList } from "./jobList";
import { Button } from "@/components/common/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { cn } from "@/lib/utils";
import { socket } from "@/config/socket";

export function ForkLift() {
  const { data: warehouseList } = useFetchData({ service: getAllWarehouse });
  const toast = useCustomToast();
  const cellRef = useRef(null);
  const dispacth = useDispatch();
  const menuIsCollapse = useSelector(state => state.menuIsCollapseSlice.menuIsCollapse);

  const [openDialogChangePosition, setOpenDialogChangePosition] = useState(false);
  const selectedWarehouseCode = useRef("");
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedCell, setSelectedCell] = useState({});
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [dataChangePosition, setDataChangePosition] = useState({});

  const handleSelectedWarehouse = value => {
    selectedWarehouseCode.current = value;
    getAllPalletPositionByWarehouseCode(value)
      .then(res => {
        toast.success(res);
        setWarehouseData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleSelectedCell = cell => {
    if (!cell.PALLET_NO && selectedCell.PALLET_NO) {
      setDataChangePosition({
        oldPALLET_NO: selectedCell.PALLET_NO,
        newPALLET_NO: cell.PALLET_NO,
        oldCell: `${selectedCell.BLOCK_CODE}-${selectedCell.TIER_ORDERED}-${selectedCell.SLOT_ORDERED}`,
        newCell: `${cell.BLOCK_CODE}-${cell.TIER_ORDERED}-${cell.SLOT_ORDERED}`,
        oldCellId: selectedCell.ROWGUID,
        newCellId: cell.ROWGUID
      });
      setOpenDialogChangePosition(true);
      return;
    }

    if (cell.ROWGUID === selectedCell.ROWGUID) {
      setSelectedCell({});
      return;
    }

    setSelectedCell(cell);
  };

  const handleSelectedJob = job => {
    if (job.PALLET_NO === selectedJob.PALLET_NO) {
      setSelectedJob({});
      return;
    }
    setSelectedJob(job);
  };

  const handleInputPallet = () => {
    if (!selectedCell.ROWGUID) {
      toast.warning("Vui lòng chọn ô cần chuyển hàng");
      return;
    }
    if (!selectedJob.PALLET_NO) {
      toast.warning("Vui lòng chọn pallet cần chuyển hàng");
      return;
    }
    dispacth(setGlobalLoading(true));
    const obj = {
      CELL_ID: selectedCell.ROWGUID,
      PALLET_NO: selectedJob.PALLET_NO,
      WAREHOUSE_CODE: selectedWarehouseCode.current
    };
    inputPalletToCell(obj)
      .then(res => {
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCode.current);
        getJob("I");
        socket.emit("inputPalletToCellSuccess");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
      });
  };

  const handleChangePalletPosition = () => {
    dispacth(setGlobalLoading(true));

    const obj = {
      CELL_ID: dataChangePosition.newCellId,
      PALLET_NO: dataChangePosition.oldPALLET_NO,
      WAREHOUSE_CODE: selectedWarehouseCode.current
    };
    changePalletPosition(obj)
      .then(res => {
        setOpenDialogChangePosition(false);
        socket.emit("inputPalletToCellSuccess");
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCode.current);
        getJob("I");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
      });
  };

  useEffect(() => {
    getJob("I");
  }, []);

  const getAllCellByWarehouseCode = warehouseCode => {
    getAllPalletPositionByWarehouseCode(warehouseCode)
      .then(res => {
        setWarehouseData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getJob = status => {
    getPalletByStatus(status)
      .then(res => {
        setJobList(res.data.metadata);
      })
      .catch(err => {
        toast.catch(err);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveCompleteJobQuantityCheck", message => {
        getJob("I");
      });
      socket.on("receiveInputPalletToCellSuccess", message => {
        getJob("I");
        getAllCellByWarehouseCode(selectedWarehouseCode.current);
      });
      return () => {
        socket.off("receiveCompleteJobQuantityCheck");
        socket.off("receiveInputPalletToCellSuccess");
      };
    }
  }, []);

  return (
    <Section>
      <Section.Header className="flex items-end justify-between">
        <span>
          <Label>Mã kho</Label>
          <Select onValueChange={handleSelectedWarehouse} value={selectedWarehouseCode.current}>
            <SelectTrigger className="min-w-56">
              <SelectValue placeholder="Mã kho" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {warehouseList?.map(warehouse => (
                  <SelectItem key={warehouse.WAREHOUSE_CODE} value={warehouse.WAREHOUSE_CODE}>
                    {warehouse.WAREHOUSE_CODE} - {warehouse.WAREHOUSE_NAME}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </span>
        <Button variant="blue" onClick={handleInputPallet}>
          Chuyển hàng
        </Button>
      </Section.Header>
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(menuIsCollapse ? "max-w-minusMenuIsCollapse" : "max-w-minusMenuNotCollapse")}
      >
        <ResizablePanel defaultSize={75} className="relative">
          {warehouseData.length === 0 ? (
            <div className="absolute-center text-sm opacity-50">Chưa chọn kho</div>
          ) : (
            <CellList
              ref={cellRef}
              warehouseData={warehouseData}
              onSelectedCell={handleSelectedCell}
              selectedCell={selectedCell}
            />
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} className="max-w-[50%]">
          <JobList jobList={jobList} selectedJob={selectedJob} onSelectedJob={handleSelectedJob} />
        </ResizablePanel>
      </ResizablePanelGroup>
      <Dialog
        open={openDialogChangePosition}
        onOpenChange={() => {
          setOpenDialogChangePosition(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có muốn di chuyển pallet ?</DialogTitle>
            <DialogDescription>
              Chuyển Pallet:<span className="font-bold"> {dataChangePosition.oldPALLET_NO} </span>từ
              ô<span className="font-bold"> {dataChangePosition.oldCell} </span>sang ô
              <span className="font-bold"> {dataChangePosition.newCell}</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialogChangePosition(false)}>
              Hủy
            </Button>
            <Button variant="blue" onClick={handleChangePalletPosition}>
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
