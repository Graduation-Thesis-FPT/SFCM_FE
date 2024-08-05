import {
  completeJobQuantityCheckByPackageId,
  getAllImportTallyContainer,
  getAllJobQuantityCheckByPACKAGE_ID,
  getImportTallyContainerInfoByCONTAINER_ID,
  insertAndUpdateJobQuantityCheck
} from "@/apis/import-tally.api";
import { deliver_order } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import useFetchData from "@/hooks/useRefetchData";
import { cn } from "@/lib/utils";
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
import { socket } from "@/config/socket";

export function ImportTally() {
  const { data: importTallyContainerList, revalidate } = useFetchData({
    service: getAllImportTallyContainer
  });
  const DELIVER_ORDER = new deliver_order();
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    CONTAINER_ID: "",
    CNTRNO: "",
    ISSUE_DATE: "",
    EXP_DATE: ""
  });
  const [importTallyPackageList, setImportTallyPackageList] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState({});
  const [jobQuantityCheckList, setJobQuantityCheckList] = useState([]);

  const handleChangeFilter = value => {
    if (!value) {
      setFilter({
        CONTAINER_ID: "",
        CNTRNO: "",
        ISSUE_DATE: "",
        EXP_DATE: ""
      });
      setImportTallyPackageList([]);
      setSelectedPackage({});
      setJobQuantityCheckList([]);
      return;
    }

    dispatch(setGlobalLoading(true));
    const importTallyContainerInfo = importTallyContainerList?.find(
      item => item.CONTAINER_ID === value
    );

    setFilter({
      CONTAINER_ID: value,
      CNTRNO: importTallyContainerInfo?.CNTRNO,
      ISSUE_DATE: importTallyContainerInfo?.ISSUE_DATE,
      EXP_DATE: importTallyContainerInfo?.EXP_DATE
    });

    getImportTallyContainerInfoByCONTAINER_ID(value)
      .then(res => {
        toast.success(res);
        setImportTallyPackageList(res.data.metadata);
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
    getAllJobQuantityCheckByPACKAGE_ID(packageInfo.PK_ROWGUID)
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

  const getJobQuantityCheckByPACKAGE_ID = () => {
    getAllJobQuantityCheckByPACKAGE_ID(selectedPackage.PK_ROWGUID)
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

  const calculateEstimatedCargoPiece = () => {
    let totalEstimatedCargoPiece = 0;
    jobQuantityCheckList.forEach(item => {
      totalEstimatedCargoPiece += item.ESTIMATED_CARGO_PIECE;
    });
    return selectedPackage.CARGO_PIECE - totalEstimatedCargoPiece;
  };

  const handleAddNewJobQuantityCheck = () => {
    if (!calculateEstimatedCargoPiece()) {
      return toast.warning("Đã kiểm đếm hết số lượng hàng");
    }
    let newRow = {
      key: uuidv4(),
      status: "insert",
      PACKAGE_ID: selectedPackage.PK_ROWGUID,
      SEQ: jobQuantityCheckList.length + 1,
      ESTIMATED_CARGO_PIECE: calculateEstimatedCargoPiece(),
      ACTUAL_CARGO_PIECE: selectedPackage.CARGO_PIECE,
      START_DATE: new Date(),
      JOB_STATUS: "I",
      PALLET_LENGTH: 0,
      PALLET_WIDTH: 0,
      PALLET_HEIGHT: 0,
      HOUSE_BILL: selectedPackage.HOUSE_BILL,
      NOTE: ""
    };
    setJobQuantityCheckList([newRow, ...jobQuantityCheckList]);
  };

  const handleSaveJobQuantityCheck = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(jobQuantityCheckList);

    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }

    if (calculateEstimatedCargoPiece() < 0) {
      return toast.warning("Số lượng hàng kiểm đếm không chính xác. Vui lòng kiểm tra lại!");
    }

    dispatch(setGlobalLoading(true));
    insertAndUpdateJobQuantityCheck(selectedPackage.PK_ROWGUID, insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getJobQuantityCheckByPACKAGE_ID();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const isCompleteJobQuantityCheck = () => {
    if (
      jobQuantityCheckList.filter(item => item.JOB_STATUS === "C").length ===
        jobQuantityCheckList.length &&
      jobQuantityCheckList.length > 0
    ) {
      return true;
    }
    return false;
  };

  const handleCompleteJobQuantityCheck = () => {
    if (isCompleteJobQuantityCheck()) {
      return toast.warning("Đã xác nhận hoàn thành kiểm đếm");
    }

    if (jobQuantityCheckList.filter(item => item.status).length > 0) {
      return toast.warning("Vui lòng lưu dữ liệu trước khi hoàn thành kiểm đếm");
    }

    if (calculateEstimatedCargoPiece()) {
      return toast.warning("Vui lòng kiểm đếm hết số lượng hàng");
    }

    dispatch(setGlobalLoading(true));
    completeJobQuantityCheckByPackageId(selectedPackage.PK_ROWGUID)
      .then(res => {
        toast.success(res);
        getJobQuantityCheckByPACKAGE_ID();
        getImportTallyContainerInfo(filter.CONTAINER_ID);
        socket.emit("completeJobQuantityCheck");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const getImportTallyContainerInfo = async CONTAINER_ID => {
    getImportTallyContainerInfoByCONTAINER_ID(CONTAINER_ID)
      .then(res => {
        setImportTallyPackageList(res.data.metadata);
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

  useEffect(() => {
    if (socket) {
      socket.on("receiveSaveInOrderSuccess", message => {
        revalidate();
      });
      return () => socket.off("receiveSaveInOrderSuccess");
    }
  }, []);

  return (
    <Section>
      <Section.Header className="flex flex-row gap-3">
        <div className="w-1/4 min-w-fit">
          <Label htmlFor="CONTAINER_ID">Container kiểm đếm</Label>
          <SelectSearch
            id="CONTAINER_ID"
            className="w-full"
            labelSelect="Chọn container kiểm đếm"
            value={filter.CONTAINER_ID}
            data={importTallyContainerList?.map(item => {
              return { value: item.CONTAINER_ID, label: item.CNTRNO };
            })}
            onSelect={handleChangeFilter}
          />
        </div>
        <div className="w-1/4 min-w-fit">
          <Label htmlFor="ISSUE_DATE">{DELIVER_ORDER.ISSUE_DATE.headerName}</Label>
          <Input
            value={filter.ISSUE_DATE ? moment(filter.ISSUE_DATE).format("DD/MM/YYYY HH:mm") : ""}
            readOnly
            className="hover:cursor-not-allowed"
            id="ISSUE_DATE"
            placeholder="Chọn container kiểm đếm"
          />
        </div>
        <div className="w-1/4 min-w-fit">
          <Label htmlFor="EXP_DATE">{DELIVER_ORDER.EXP_DATE.headerName}</Label>
          <Input
            value={filter.EXP_DATE ? moment(filter.EXP_DATE).format("DD/MM/YYYY HH:mm") : ""}
            readOnly
            className="hover:cursor-not-allowed"
            id="TRF_NAME"
            placeholder="Chọn container kiểm đếm"
          />
        </div>
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
                      selectedPackage?.PK_ROWGUID === item.PK_ROWGUID && "bg-blue-50 ",
                      "m-auto w-[95%] overflow-hidden shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    )}
                    onClick={() => {
                      handleSelectPackage(item);
                    }}
                  >
                    <div>
                      <div>Số Housebill: {item?.HOUSE_BILL}</div>
                      <div>Số tờ khai: {item?.DECLARE_NO}</div>
                      <div>Số Seal: {item?.SEALNO}</div>
                      <div>Loại hàng: {item?.PACKAGE_UNIT_NAME}</div>
                    </div>
                    <div className="flex flex-col justify-between text-center">
                      <div>Tổng số lượng: {item?.CARGO_PIECE}</div>
                      {item?.JOB_STATUS === "C" && (
                        <div className="flex flex-col items-center justify-center font-bold text-green-600">
                          <CheckCircle />
                          <div>Hoàn thành kiểm đếm</div>
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
              Kiểm đếm
            </div>
            {!selectedPackage.HOUSE_BILL ? (
              <div className="mt-10 text-center text-sm opacity-50">Không có dữ liệu</div>
            ) : (
              <div className="flex h-full min-h-0 flex-col">
                <span className="mx-auto flex w-[95%] justify-between pt-4 text-sm">
                  <div className="flex flex-col justify-between">
                    <div>
                      Số lượng hàng chưa kiểm đếm:{" "}
                      <span className="font-bold">
                        {calculateEstimatedCargoPiece()}/{selectedPackage.CARGO_PIECE}
                      </span>
                    </div>
                    <div>
                      Số Housebill: <span className="font-bold">{selectedPackage.HOUSE_BILL}</span>
                    </div>
                  </div>

                  <div>
                    {isCompleteJobQuantityCheck() ? (
                      <div className="flex flex-col items-center justify-center font-bold text-green-600">
                        <CheckCircle />
                        <div>Hoàn thành kiểm đếm</div>
                      </div>
                    ) : (
                      <LayoutTool>
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
                              <p>Xác nhận hoàn thành kiểm đếm</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <BtnAddRow onAddRow={handleAddNewJobQuantityCheck} />
                        <BtnSave onClick={handleSaveJobQuantityCheck} />
                      </LayoutTool>
                    )}
                  </div>
                </span>

                <JobQuantityCheckList
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
    </Section>
  );
}
