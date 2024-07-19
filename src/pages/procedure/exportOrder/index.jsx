import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import moment from "moment";
import { useState } from "react";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePicker } from "@/components/common/date-picker";
import { addDays } from "date-fns";

const DT_VESSEL_VISIT = new dt_vessel_visit();
const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();
const DT_PACKAGE_MNF_LD = new dt_package_mnf_ld();

const vesselFilter = [
  {
    name: DT_VESSEL_VISIT.VESSEL_NAME.headerName,
    field: DT_VESSEL_VISIT.VESSEL_NAME.field
  },
  {
    name: DT_VESSEL_VISIT.INBOUND_VOYAGE.headerName,
    field: DT_VESSEL_VISIT.INBOUND_VOYAGE.field
  },
  {
    name: DT_VESSEL_VISIT.ETA.headerName,
    field: DT_VESSEL_VISIT.ETA.field
  }
];

export function ExportOrder() {
  const toast = useCustomToast();

  const [vesselInfo, setVesselInfo] = useState({});
  const [openVesselInfoSelect, setOpenVesselInfoSelect] = useState(false);
  const handleSelectVesselInfo = vesselInfo => {
    setVesselInfo(vesselInfo);
    setOpenVesselInfoSelect(false);
  };

  const [packageFilter, setPackageFilter] = useState({
    HOUSE_BILL: "",
    EXP_DATE: addDays(new Date(), 2)
  });
  const handleEnterPackageFilter = e => {};

  return (
    <Section>
      <Section.Header className="space-y-4">
        <span className="grid grid-cols-3 gap-3">
          {vesselFilter.map(item => (
            <div key={item.field}>
              <Label htmlFor={item.field}>{item.name}</Label>
              <Input
                onClick={() => {
                  setOpenVesselInfoSelect(true);
                }}
                defaultValue={
                  vesselInfo[item.field]
                    ? item.field === "ETA"
                      ? moment(vesselInfo[item.field]).format("DD/MM/YYYY HH:ss")
                      : vesselInfo[item.field]
                    : ""
                }
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn tàu chuyến"
              />
            </div>
          ))}
        </span>
        <span className="grid grid-cols-3 gap-3">
          <div>
            <Label htmlFor="HOUSE_BILL">{DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName}</Label>
            <Input
              id="HOUSE_BILL"
              placeholder="Nhập số House Bill"
              value={packageFilter.HOUSE_BILL}
              onChange={e => {
                if (!vesselInfo.VOYAGEKEY) {
                  return null;
                }
                setPackageFilter({ ...packageFilter, HOUSE_BILL: e.target.value?.trim() });
              }}
              onFocus={() => {
                if (!vesselInfo.VOYAGEKEY) {
                  return toast.warning("Vui lòng chọn tàu chuyến!");
                }
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  document.getElementById("HOUSE_BILL")?.blur();
                  return;
                }
              }}
              onBlur={handleEnterPackageFilter}
            />
          </div>
          <div>
            <Label htmlFor="EXP_DATE">Hạn lệnh</Label>
            <DatePicker
              id="EXP_DATE"
              date={packageFilter.EXP_DATE}
              onSelected={data => {
                if (moment(data).isBefore(moment(new Date()), "day")) {
                  return toast.error("Hạn lệnh tối thiểu phải là ngày hôm nay!");
                }
                setPackageFilter({ ...packageFilter, EXP_DATE: data });
              }}
            />
          </div>
        </span>
      </Section.Header>
      <VesselInfoSelect
        open={openVesselInfoSelect}
        onOpenChange={() => {
          setOpenVesselInfoSelect(false);
        }}
        onSelectVesselInfo={handleSelectVesselInfo}
      />
    </Section>
  );
}
