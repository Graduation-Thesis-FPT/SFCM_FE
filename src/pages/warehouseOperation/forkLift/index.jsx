import { exportPallet } from "@/apis/pallet.api";
import { getAllWarehouse } from "@/apis/warehouse.api";
import {
  changePackageAllocatedPosition,
  getAllPackagePositionByWarehouseCode,
  placePackageAllocatedIntoCell,
  suggestCellByWarehouseCode
} from "@/apis/cell.api";
import {
  getPackageReadyToExport,
  getPackageReadyToWarehouse
} from "@/apis/package-cell-allocation.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { Label } from "@/components/common/ui/label";
import { useEffect, useRef, useState } from "react";
import { CellList } from "./cellList";
import { JobList } from "./jobList";
import { Button } from "@/components/common/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { cn } from "@/lib/utils";
import { socket } from "@/config/socket";
import { Download, Upload } from "lucide-react";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/common/ui/dialog";

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
    dispacth(setGlobalLoading(true));
    setSelectedJob({});
    setSelectedWarehouseCode(newWarehouseCode);
    selectedWarehouseCodeRef.current = newWarehouseCode;
    getAllPackagePositionByWarehouseCode(newWarehouseCode)
      .then(res => {
        setWarehouseData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
      });
  };

  const handleSelectedCell = cell => {
    if (selectedJobStatusRef.current === "S") {
      return;
    }

    if (!cell.IS_FILLED && selectedCell.IS_FILLED) {
      setDataChangePosition({
        old_packageCellAllocation_ROWGUID: selectedCell.packageCellAllocation_ROWGUID,
        new_packageCellAllocation_ROWGUID: cell.packageCellAllocation_ROWGUID,
        oldCell: `${selectedCell.BLOCK_ID}-${selectedCell.TIER_ORDERED}-${selectedCell.SLOT_ORDERED}`,
        newCell: `${cell.BLOCK_ID}-${cell.TIER_ORDERED}-${cell.SLOT_ORDERED}`,
        old_Cell_ROWGUID: selectedCell.ROWGUID,
        new_Cell_ROWGUID: cell.ROWGUID
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
    if (job.ROWGUID === selectedJob.ROWGUID) {
      setSelectedJob({});
      return;
    }
    setSelectedJob(job);
    //Xuất kho
    if (selectedJobStatusRef.current === "S") {
      if (job.WAREHOUSE_ID === selectedWarehouseCodeRef.current) {
        setTimeout(() => {
          scrollToElement(job.CELL_ID);
        }, 100);
        return;
      }
      setSelectedWarehouseCode(job.WAREHOUSE_ID);
      selectedWarehouseCodeRef.current = job.WAREHOUSE_ID;
      getAllPackagePositionByWarehouseCode(job.WAREHOUSE_ID)
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
    if (!selectedJob.ROWGUID) {
      toast.warning("Vui lòng chọn pallet cần chuyển hàng");
      return;
    }
    dispacth(setGlobalLoading(true));
    const obj = {
      CELL_ID: selectedCell.ROWGUID,
      PACKAGE_ROWGUID: selectedJob.ROWGUID,
      WAREHOUSE_ID: selectedWarehouseCodeRef.current
    };
    placePackageAllocatedIntoCell(obj)
      .then(res => {
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCodeRef.current);
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

  const handleExportPallet = () => {
    if (!selectedJob.ROWGUID) {
      toast.warning("Vui lòng chọn pallet cần xuất");
      return;
    }
    dispacth(setGlobalLoading(true));
    const dataReq = {
      PALLET_NO: selectedJob.PALLET_NO,
      CELL_ID: selectedJob.CELL_ID,
      ID: selectedWarehouseCodeRef.current
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
    setOpenDialogChangePosition(false);
    dispacth(setGlobalLoading(true));
    const obj = {
      CELL_ID: dataChangePosition.new_Cell_ROWGUID,
      PACKAGE_ROWGUID: dataChangePosition.old_packageCellAllocation_ROWGUID,
      WAREHOUSE_ID: selectedWarehouseCodeRef.current
    };
    changePackageAllocatedPosition(obj)
      .then(res => {
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
    dispacth(setGlobalLoading(true));
    setSelectedCell({});
    setSelectedJob({});
    setSelectedJobStatus(value);
    selectedJobStatusRef.current = value;
    getJob(value);
  };

  const getAllCellByWarehouseCode = warehouseCode => {
    getAllPackagePositionByWarehouseCode(warehouseCode)
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
        setSelectedWarehouseCode(res.data?.metadata[0]?.ID);
        selectedWarehouseCodeRef.current = res.data?.metadata[0]?.ID;
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
      getPackageReadyToWarehouse()
        .then(res => {
          setJobList(res.data.metadata);
        })
        .catch(err => {
          setJobList([]);
          toast.error(err);
        })
        .finally(() => {
          dispacth(setGlobalLoading(false));
        });
      return;
    }
    //get export job
    getPackageReadyToExport()
      .then(res => {
        setJobList(res.data.metadata);
      })
      .catch(err => {
        setJobList([]);
        toast.error(err);
      })
      .finally(() => {
        dispacth(setGlobalLoading(false));
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
      socket.on("receiveSaveExOrderSuccess", message => {
        getJob(selectedJobStatusRef.current);
      });
      return () => {
        socket.off("receiveCompleteJobQuantityCheck");
        socket.off("receiveInputPalletToCellSuccess");
        socket.off("receiveSaveExOrderSuccess");
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
                    <SelectItem key={warehouse.ID} value={warehouse.ID}>
                      {warehouse.ID} - {warehouse.NAME}
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
            <Upload className="mr-2 size-4" />
            Xuất hàng
          </Button>
        ) : (
          <Button variant="blue" onClick={handleImportPallet}>
            <Download className="mr-2 size-4" />
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
          <JobList
            selectedJobStatus={selectedJobStatus}
            jobList={jobList}
            selectedJob={selectedJob}
            onSelectedJob={handleSelectedJob}
          />
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
              Chuyển Pallet:
              <span className="font-bold">
                {" "}
                {dataChangePosition.old_packageCellAllocation_ROWGUID}{" "}
              </span>
              từ ô<span className="font-bold"> {dataChangePosition.oldCell} </span>sang ô
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
