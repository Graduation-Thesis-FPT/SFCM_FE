import {
  getAllImportTallyContainer,
  getImportTallyContainerInfoByCONTAINER_ID
} from "@/apis/import-tally.api";
import { deliver_order } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { SelectSearch } from "@/components/common/select-search";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import useFetchData from "@/hooks/useRefetchData";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";

export function ExportTally() {
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
            id="EXP_DATE"
            placeholder="Chọn container kiểm đếm"
          />
        </span>
      </Section.Header>
      <Section.Content></Section.Content>
    </Section>
  );
}
