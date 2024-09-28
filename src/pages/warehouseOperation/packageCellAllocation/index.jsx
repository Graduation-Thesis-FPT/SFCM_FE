import { voyage, voyage_container } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { cn, removeLastAsterisk } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { JobQuantityCheckList } from "./jobQuantityCheckList";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { v4 as uuidv4 } from "uuid";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/common/ui/resizable";
import { Button } from "@/components/common/ui/button";
import { CheckCircle, SquareCheckBig } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import {
  completePackageSeparate,
  getAllPackageByVoyageContainerId,
  getAllPackageCellAllocationByVoyContPkID,
  insertAndUpdatePackageCellAllocation
} from "@/apis/package-cell-allocation.api";
import { ContainerImportSelect } from "./ContainerImportSelect";
import { VoyContPackageStatusRender } from "@/components/common/aggridreact/cellRender";
import { Badge } from "@/components/common/ui/badge";
import { socket } from "@/config/socket";

const VOYAGE = new voyage();
const VOYAGE_CONTAINER = new voyage_container();

const containerFilter = [
  {
    name: VOYAGE_CONTAINER.CNTR_NO.headerName,
    field: VOYAGE_CONTAINER.CNTR_NO.field
  },
  {
    name: VOYAGE_CONTAINER.SHIPPER_ID.headerName,
    field: VOYAGE_CONTAINER.SHIPPER_ID.field
  },
  {
    name: VOYAGE.ID.headerName,
    field: VOYAGE.ID.field
  },
  {
    name: VOYAGE.VESSEL_NAME.headerName,
    field: VOYAGE.VESSEL_NAME.field
  },
  {
    name: VOYAGE.ETA.headerName,
    field: VOYAGE.ETA.field
  }
];

export function ImportTally() {
  const [openContainerImportSelect, setOpenContainerImportSelect] = useState(false);
  const [containerSelected, setContainerSelected] = useState({});

  const toast = useCustomToast();
  const dispatch = useDispatch();

  const [importTallyPackageList, setImportTallyPackageList] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [jobQuantityCheckList, setJobQuantityCheckList] = useState([]);

  const handleAddNewJobQuantityCheck = () => {
    if (!calculateEstimatedCargoPiece()) {
      return toast.warning("Đã tách hàng hết số lượng hàng");
    }

    let newRow = {
      key: uuidv4(),
      status: "insert",
      ITEMS_IN_CELL: calculateEstimatedCargoPiece(),
      VOYAGE_CONTAINER_PACKAGE_ID: selectedPackage.ID,
      SEQUENCE: jobQuantityCheckList.length + 1,
      SEPARATED_PACKAGE_LENGTH: 0,
      SEPARATED_PACKAGE_WIDTH: 0,
      SEPARATED_PACKAGE_HEIGHT: 0,
      NOTE: ""
    };
    setJobQuantityCheckList([newRow, ...jobQuantityCheckList]);
  };

  const calculateEstimatedCargoPiece = () => {
    let totalEstimatedCargoPiece = 0;
    jobQuantityCheckList.forEach(item => {
      totalEstimatedCargoPiece += item.ITEMS_IN_CELL;
    });
    return selectedPackage.TOTAL_ITEMS - totalEstimatedCargoPiece;
  };

  const isCompleteJobQuantityCheck = () => {
    if (
      jobQuantityCheckList.filter(item => item.IS_SEPARATED === true).length ===
        jobQuantityCheckList.length &&
      jobQuantityCheckList.length > 0
    ) {
      return true;
    }
    return false;
  };

  ///////////////////////////////

  const handleSelectContainer = selectedRow => {
    setSelectedPackage({});
    setJobQuantityCheckList([]);

    dispatch(setGlobalLoading(true));
    setOpenContainerImportSelect(false);
    setContainerSelected(selectedRow);
    getAllPackageByVoyageContainerId(selectedRow.VOYAGE_CONTAINER_ID)
      .then(res => {
        setImportTallyPackageList(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleSelectPackage = packageInfo => {
    dispatch(setGlobalLoading(true));
    setSelectedPackage(packageInfo);
    getAllPackageCellAllocationByVoyContPkID(packageInfo.ID)
      .then(res => {
        setJobQuantityCheckList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleSaveJobQuantityCheck = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(jobQuantityCheckList);

    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }

    if (insertAndUpdateData.update.length > 0) {
      insertAndUpdateData.update = insertAndUpdateData.update.map(({ CELL_ID, ...item }) => item);
    }

    if (calculateEstimatedCargoPiece() < 0) {
      return toast.warning("Số lượng hàng tách không chính xác. Vui lòng kiểm tra lại!");
    }

    dispatch(setGlobalLoading(true));
    insertAndUpdatePackageCellAllocation(selectedPackage.ID, insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getImportTallyContainerInfo(containerSelected.VOYAGE_CONTAINER_ID);
        getPackageCellAllocation(selectedPackage.ID);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleCompleteJobQuantityCheck = () => {
    if (isCompleteJobQuantityCheck()) {
      return toast.warning("Đã xác nhận hoàn thành tách hàng");
    }

    if (jobQuantityCheckList.filter(item => item.status).length > 0) {
      return toast.warning("Vui lòng lưu dữ liệu trước khi xác nhận hoàn thành tách hàng");
    }

    if (calculateEstimatedCargoPiece()) {
      return toast.warning("Vui lòng tách hết số lượng hàng");
    }

    dispatch(setGlobalLoading(true));
    completePackageSeparate(selectedPackage.ID)
      .then(res => {
        socket.emit("send-package-cell-allocation");
        toast.success(res);
        getPackageCellAllocation(selectedPackage.ID);
        getImportTallyContainerInfo(containerSelected.VOYAGE_CONTAINER_ID);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  ///////////////////////////////

  const getImportTallyContainerInfo = async VOYAGE_CONTAINER_ID => {
    getAllPackageByVoyageContainerId(VOYAGE_CONTAINER_ID)
      .then(res => {
        setImportTallyPackageList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getPackageCellAllocation = VOYAGE_CONTAINER_PACKAGE_ID => {
    getAllPackageCellAllocationByVoyContPkID(VOYAGE_CONTAINER_PACKAGE_ID)
      .then(res => {
        setJobQuantityCheckList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Section>
      <Section.Header className="grid grid-cols-3 gap-3 md:grid-cols-5">
        {containerFilter.map(item => (
          <div key={item.field}>
            <Label className="flex">{removeLastAsterisk(item.name)}</Label>
            <Input
              onClick={() => {
                setOpenContainerImportSelect(true);
              }}
              defaultValue={
                item.field === "ETA"
                  ? containerSelected[item.field]
                    ? moment(containerSelected[item.field]).format("DD/MM/YYYY")
                    : ""
                  : containerSelected[item.field] ?? ""
              }
              readOnly
              className={cn("hover:cursor-pointer")}
              id={item.field}
              placeholder="Chọn container"
            />
          </div>
        ))}
      </Section.Header>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="flex h-full flex-col px-4">
            <div className="pt-8 text-center text-lg font-bold leading-5 text-gray-900">
              Danh sách các kiện hàng
            </div>
            {importTallyPackageList.length === 0 ? (
              <div className="mt-10 text-center text-sm opacity-50">Không có dữ liệu</div>
            ) : (
              <div className="h-full space-y-4 overflow-y-auto pt-4 text-sm">
                {importTallyPackageList.map(item => (
                  <div
                    key={item.HOUSE_BILL}
                    className={cn(
                      "flex cursor-pointer justify-between rounded-md border px-8 py-6",
                      selectedPackage?.ID === item.ID && "bg-blue-50 ",
                      "m-auto w-[95%] overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    )}
                    onClick={() => {
                      handleSelectPackage(item);
                    }}
                  >
                    <div className="w-2/3 space-y-2">
                      <div>
                        Số House Bill: <b>{item?.HOUSE_BILL}</b>
                      </div>
                      <div>
                        Mã chủ hàng: <b>{item?.CONSIGNEE_ID}</b>
                      </div>
                      <div>
                        Mã loại hàng: <b>{item?.PACKAGE_TYPE_ID}</b>
                      </div>
                      <div>
                        Số khối: <b>{item?.CBM}</b>
                      </div>
                      <div>
                        Số Seal: <b>{item?.SEALNO}</b>
                      </div>
                      <div>
                        Ghi chú: <b>{item?.NOTE}</b>
                      </div>
                      <div className="flex space-x-2">
                        <span>Trạng thái:</span>
                        {item?.IS_SEPARATED && item?.STATUS !== "IN_WAREHOUSE" ? (
                          <div className="flex flex-col items-center justify-center font-bold text-green-600">
                            <Badge className="rounded-sm border-transparent bg-green-100 text-green-600 hover:bg-green-200">
                              Hoàn thành tách hàng
                            </Badge>
                          </div>
                        ) : (
                          VoyContPackageStatusRender({ value: item?.STATUS })
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-between text-center">
                      <div>
                        Tổng số lượng
                        <div className="font-bold">
                          {item?.TOTAL_ITEMS} ({item?.PACKAGE_UNIT})
                        </div>
                      </div>
                      {item?.IS_SEPARATED && (
                        <div className="flex flex-col items-center justify-center font-bold text-green-600">
                          <CheckCircle className="size-10" />
                          <div>Hoàn thành tách hàng</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <div className="flex h-full flex-col border-l px-4">
            <div className="pt-8 text-center text-lg font-bold leading-5 text-gray-900">
              Tách hàng
            </div>
            {!selectedPackage.HOUSE_BILL ? (
              <div className="mt-10 text-center text-sm opacity-50">Không có dữ liệu</div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <span className="mx-auto flex w-[95%] justify-between pt-4 text-sm">
                  <div className="flex flex-col justify-between">
                    <span>
                      Số lượng hàng chưa tách:{" "}
                      <b>
                        {calculateEstimatedCargoPiece()}/{selectedPackage.TOTAL_ITEMS}
                      </b>
                    </span>
                    <span>
                      Số House Bill: <b>{selectedPackage.HOUSE_BILL}</b>
                    </span>
                  </div>

                  <div>
                    {isCompleteJobQuantityCheck() ? (
                      <div className="flex flex-col items-center justify-center font-bold text-green-600">
                        <CheckCircle />
                        <div>Hoàn thành tách hàng</div>
                      </div>
                    ) : (
                      <LayoutTool>
                        <BtnAddRow onAddRow={handleAddNewJobQuantityCheck} />
                        <BtnSave onClick={handleSaveJobQuantityCheck} />
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                onClick={handleCompleteJobQuantityCheck}
                                size="tool"
                                variant="none-border"
                              >
                                <SquareCheckBig className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Xác nhận hoàn thành tách hàng</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </LayoutTool>
                    )}
                  </div>
                </span>

                <JobQuantityCheckList
                  selectedPackage={selectedPackage}
                  isCompleteJobQuantityCheck={isCompleteJobQuantityCheck}
                  jobQuantityCheckList={jobQuantityCheckList}
                  onChangeJobQuantityCheckList={newList => {
                    setJobQuantityCheckList(newList);
                  }}
                />
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <ContainerImportSelect
        open={openContainerImportSelect}
        onOpenChange={() => {
          setOpenContainerImportSelect(false);
        }}
        onSelectContainerInfo={selectedRow => {
          handleSelectContainer(selectedRow);
        }}
      />
    </Section>
  );
}
