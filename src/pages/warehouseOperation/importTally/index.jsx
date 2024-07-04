import {
  getAllImportTallyContainer,
  getAllJobQuantityCheckByPACKAGE_ID,
  getImportTallyContainerInfoByCONTAINER_ID
} from "@/apis/import-tally.api";
import { deliver_order } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/common/ui/card";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { ScrollArea } from "@/components/common/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import useFetchData from "@/hooks/useRefetchData";
import { cn } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";

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
  return (
    <Section>
      <Section.Header className="grid grid-cols-4 gap-3">
        <span>
          <Label htmlFor="CONTAINER_ID">Container kiểm đếm</Label>
          <SelectSearch
            id="CONTAINER_ID"
            className="w-full"
            labelSelect="Chọn container kiểm đếm"
            data={importTallyContainerList?.map(item => {
              return { value: item.CONTAINER_ID, label: item.CNTRNO };
            })}
            onSelect={handleChangeFilter}
          />
        </span>
        <span>
          <Label htmlFor="ISSUE_DATE">{DELIVER_ORDER.ISSUE_DATE.headerName}</Label>
          <Input
            value={filter.ISSUE_DATE ? moment(filter.ISSUE_DATE).format("DD/MM/YYYY HH:mm") : ""}
            readOnly
            className="hover:cursor-not-allowed"
            id="ISSUE_DATE"
            placeholder="Chọn container kiểm đếm"
          />
        </span>
        <span>
          <Label htmlFor="EXP_DATE">{DELIVER_ORDER.EXP_DATE.headerName}</Label>
          <Input
            value={filter.EXP_DATE ? moment(filter.EXP_DATE).format("DD/MM/YYYY HH:mm") : ""}
            readOnly
            className="hover:cursor-not-allowed"
            id="TRF_NAME"
            placeholder="Chọn container kiểm đếm"
          />
        </span>
      </Section.Header>
      <Section.Content className="grid min-h-0 grid-cols-2 gap-0 p-0">
        <div className="flex min-h-0 flex-col">
          <div className="py-4 text-center text-lg font-bold leading-5 text-gray-900">
            Danh sách các kiện hàng
          </div>
          <div className="mx-4 space-y-4 overflow-y-auto">
            {importTallyPackageList.map(item => (
              <div
                key={item.HOUSE_BILL}
                className={cn(
                  "flex cursor-pointer items-end justify-between rounded-md border p-4 hover:bg-primary-foreground",
                  selectedPackage?.PK_ROWGUID === item.PK_ROWGUID && "bg-primary-foreground"
                )}
                onClick={() => {
                  handleSelectPackage(item);
                }}
              >
                <span>
                  <div>Số Housebill: {item?.HOUSE_BILL}</div>
                  <div>Số tờ khai: {item?.DECLARE_NO}</div>
                  <div>Số Seal: {item?.SEALNO}</div>
                  <div>Loại hàng: {item?.PACKAGE_UNIT_NAME}</div>
                </span>
                <div>Tổng số lượng: {item?.CARGO_PIECE}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l p-4">
          {jobQuantityCheckList?.map(item => (
            <div key={item.ROWGUID} className="h-[1000px]">
              {item.ESTIMATED_CARGO_PIECE}-{item.ACTUAL_CARGO_PIECE}-{item.ROWGUID}
            </div>
          ))}
        </div>
      </Section.Content>
    </Section>
  );
}
