import {
  changePalletPosition,
  exportPallet,
  getAllPalletPositionByWarehouseCode,
  getListJobImport,
  getListJobExport,
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
import { suggestCellByWarehouseCode } from "@/apis/cell.api";
import { set } from "date-fns";

const scrollToElement = cellID => {
  const element = document.getElementById(cellID);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    element.classList.add("pallet-blink");
  }
};

const removePalletBlinkClass = () => {
  const elements = document.querySelectorAll(".pallet-blink");
  elements?.forEach(element => {
    element.classList.remove("pallet-blink");
  });
};

export function ForkLift() {
  const toast = useCustomToast();
  const cellRef = useRef(null);
  const dispacth = useDispatch();
  const menuIsCollapse = useSelector(state => state.menuIsCollapseSlice.menuIsCollapse);

  const [warehouseList, setWarehouseList] = useState([]);

  const [openDialogChangePosition, setOpenDialogChangePosition] = useState(false);
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedCell, setSelectedCell] = useState({});
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});
  const [dataChangePosition, setDataChangePosition] = useState({});

  const selectedJobStatusRef = useRef("I");
  const [selectedJobStatus, setSelectedJobStatus] = useState("I");
  const selectedWarehouseCodeRef = useRef("");
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");

  const handleSelectedWarehouse = newWarehouseCode => {
    setSelectedJob({});
    setSelectedWarehouseCode(newWarehouseCode);
    selectedWarehouseCodeRef.current = newWarehouseCode;
    getAllPalletPositionByWarehouseCode(newWarehouseCode)
      .then(res => {
        setWarehouseData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleSelectedCell = cell => {
    if (selectedJobStatusRef.current === "S") {
      return;
    }
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
    if (selectedJobStatusRef.current === "S") {
      if (job.WAREHOUSE_CODE === selectedWarehouseCodeRef.current) {
        setTimeout(() => {
          scrollToElement(job.CELL_ID);
        }, 100);
        return;
      }
      setSelectedWarehouseCode(job.WAREHOUSE_CODE);
      selectedWarehouseCodeRef.current = job.WAREHOUSE_CODE;
      getAllPalletPositionByWarehouseCode(job.WAREHOUSE_CODE)
        .then(res => {
          setWarehouseData(res.data.metadata);
        })
        .then(() => {
          setTimeout(() => {
            scrollToElement(job.CELL_ID);
          }, 100);
        })
        .catch(err => {
          toast.error(err);
        });
      return;
    }

    suggestCellByWarehouseCode(selectedWarehouseCodeRef.current, job)
      .then(res => {
        scrollToElement(res.data.metadata?.matchedCell?.ROWGUID);
      })
      .catch(err => {
        toast.warning(err);
      });
  };

  useEffect(() => {
    removePalletBlinkClass();
  }, [selectedJob]);

  const handleImportPallet = () => {
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
      WAREHOUSE_CODE: selectedWarehouseCodeRef.current
    };
    inputPalletToCell(obj)
      .then(res => {
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        // getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
        // getJob("I");
        socket.emit("inputPalletToCellSuccess");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
      });
  };

  const handleExportPallet = () => {
    if (!selectedJob.PALLET_NO) {
      toast.warning("Vui lòng chọn pallet cần xuất");
      return;
    }
    dispacth(setGlobalLoading(true));
    const dataReq = {
      PALLET_NO: selectedJob.PALLET_NO,
      CELL_ID: selectedJob.CELL_ID,
      WAREHOUSE_CODE: selectedWarehouseCodeRef.current
    };
    exportPallet(dataReq)
      .then(res => {
        socket.emit("inputPalletToCellSuccess");
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
        getJob(selectedJobStatusRef.current);
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
      WAREHOUSE_CODE: selectedWarehouseCodeRef.current
    };
    changePalletPosition(obj)
      .then(res => {
        setOpenDialogChangePosition(false);
        socket.emit("inputPalletToCellSuccess");
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
        getJob("I");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
      });
  };

  const handleSelectedJobStatus = value => {
    setSelectedCell({});
    setSelectedJob({});
    setSelectedJobStatus(value);
    selectedJobStatusRef.current = value;
    getJob(value);
  };

  const getAllCellByWarehouseCode = warehouseCode => {
    getAllPalletPositionByWarehouseCode(warehouseCode)
      .then(res => {
        setWarehouseData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getJob(selectedJobStatusRef.current);
    getWarehouse();
  }, []);

  const getWarehouse = () => {
    getAllWarehouse()
      .then(res => {
        setWarehouseList(res.data.metadata);
        setSelectedWarehouseCode(res.data?.metadata[0]?.WAREHOUSE_CODE);
        selectedWarehouseCodeRef.current = res.data?.metadata[0]?.WAREHOUSE_CODE;
      })
      .then(() => {
        getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getJob = status => {
    //get import job
    if (status === "I") {
      getListJobImport(status)
        .then(res => {
          setJobList(res.data.metadata);
        })
        .catch(err => {
          setJobList([]);
          toast.error(err);
        });
      return;
    }
    //get export job
    getListJobExport()
      .then(res => {
        setJobList(res.data.metadata);
      })
      .catch(err => {
        setJobList([]);
        toast.error(err);
      });
  };

  //socket
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("receiveCompleteJobQuantityCheck", message => {
        getJob(selectedJobStatusRef.current);
      });
      socket.on("receiveInputPalletToCellSuccess", message => {
        getJob(selectedJobStatusRef.current);
        getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
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
        <span className="flex gap-4">
          <span>
            <Label>Mã kho</Label>
            <Select onValueChange={handleSelectedWarehouse} value={selectedWarehouseCode}>
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
          <span>
            <Label>Hướng</Label>
            <Select onValueChange={handleSelectedJobStatus} defaultValue={selectedJobStatus}>
              <SelectTrigger className="min-w-32">
                <SelectValue placeholder="Chọn" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="I">Nhập kho</SelectItem>
                  <SelectItem value="S">Xuất kho</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </span>

        {selectedJobStatus === "S" ? (
          <Button variant="blue" onClick={handleExportPallet}>
            Xuất hàng
          </Button>
        ) : (
          <Button variant="blue" onClick={handleImportPallet}>
            Nhập hàng
          </Button>
        )}
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
