import {
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
import { DndContext } from "@dnd-kit/core";

export function ForkLift() {
  const { data: warehouseList } = useFetchData({ service: getAllWarehouse });
  const toast = useCustomToast();
  const cellRef = useRef(null);
  const [selectedWarehouseCode, setSelectedWarehouseCode] = useState("");
  const [warehouseData, setWarehouseData] = useState([]);
  const [selectedCell, setSelectedCell] = useState({});
  const [jobList, setJobList] = useState([]);
  const [selectedJob, setSelectedJob] = useState({});

  const handleSelectedWarehouse = value => {
    setSelectedWarehouseCode(value);
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
    const obj = {
      CELL_ID: selectedCell.ROWGUID,
      PALLET_NO: selectedJob.PALLET_NO,
      WAREHOUSE_CODE: selectedWarehouseCode
    };
    inputPalletToCell(obj)
      .then(res => {
        toast.success(res);
        setSelectedCell({});
        setSelectedJob({});
        getAllCellByWarehouseCode(selectedWarehouseCode);
        getJob("I");
      })
      .catch(err => {
        toast.error(err);
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
  ///////////////////////////////

  const onDragEnd = event => {
    console.log("🚀 ~ onDragEnd ~ event:", event);
  };
  return (
    <Section>
      <Section.Header className="flex items-end justify-between">
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
        <Button variant="blue" onClick={handleInputPallet}>
          Chuyển hàng
        </Button>
      </Section.Header>
      <DndContext onDragEnd={onDragEnd}>
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={75}>
            <CellList
              ref={cellRef}
              warehouseData={warehouseData}
              onSelectedCell={handleSelectedCell}
              selectedCell={selectedCell}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} className="max-w-[50%]">
            <JobList
              jobList={jobList}
              selectedJob={selectedJob}
              onSelectedJob={handleSelectedJob}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </DndContext>
    </Section>
  );
}
