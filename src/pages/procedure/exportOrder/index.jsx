import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { useCustomToast } from "@/components/common/custom-toast";
import { DatePicker } from "@/components/common/date-picker";
import { addDays, set } from "date-fns";
import { SelectSearch } from "@/components/common/select-search";
import { getExContainerByVoyagekey, getExManifest, getToBillEx } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { getConfigAttachSrvByMethodCode } from "@/apis/config-attach-srv.api";
import { getAllCustomer } from "@/apis/customer.api";
import { Button } from "@/components/common/ui/button";
import { DialogBillInfoEx } from "./dialogBillInfoEx";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { DialogSaveBillExSuccess } from "./dialogSaveBillExSuccess";
import { MultipleSelect } from "@/components/common/multiple-select";

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
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName,
      field: DT_PACKAGE_MNF_LD.HOUSE_BILL.field,
      flex: 1,
      filter: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.field,
      flex: 1
    },
    {
      headerName: DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.field,
      flex: 1
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName,
      field: DT_PACKAGE_MNF_LD.CARGO_PIECE.field,
      flex: 1
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: DT_PACKAGE_MNF_LD.CBM.headerName,
      field: DT_PACKAGE_MNF_LD.CBM.field,
      flex: 1
    },
    {
      headerName: DT_PACKAGE_MNF_LD.DECLARE_NO.headerName,
      field: DT_PACKAGE_MNF_LD.DECLARE_NO.field,
      flex: 1
    },
    {
      headerName: DT_PACKAGE_MNF_LD.NOTE.headerName,
      field: DT_PACKAGE_MNF_LD.NOTE.field,
      flex: 1
    }
  ];

  const [packageList, setPackageList] = useState([]);

  const [vesselInfo, setVesselInfo] = useState({});
  const [openVesselInfoSelect, setOpenVesselInfoSelect] = useState(false);
  const handleSelectVesselInfo = vesselInfo => {
    setVesselInfo(vesselInfo);
    setOpenVesselInfoSelect(false);
  };

  const [containerList, setContainerList] = useState([]);
  useEffect(() => {
    if (!vesselInfo.VOYAGEKEY) {
      return;
    }

    getExContainerByVoyagekey(vesselInfo.VOYAGEKEY)
      .then(res => {
        setContainerList(res.data.metadata);
        setPackageList([]);
        setPackageFilter({
          selectedAttachSrvList: [],
          CUSTOMER_CODE: "",
          CONTAINER_ID: "",
          HOUSE_BILL: "",
          EXP_DATE: addDays(new Date(), 2)
        });
      })
      .catch(err => {
        toast.error(err);
      });
  }, [vesselInfo]);

  const [packageFilter, setPackageFilter] = useState({
    selectedAttachSrvList: [],
    CUSTOMER_CODE: "",
    CONTAINER_ID: "",
    HOUSE_BILL: "",
    EXP_DATE: addDays(new Date(), 2)
  });

  const handleEnterPackageFilter = newHouseBill => {
    setPackageFilter({ ...packageFilter, HOUSE_BILL: newHouseBill });

    if (!vesselInfo.VOYAGEKEY) {
      return toast.warning("Vui lòng chọn tàu chuyến!");
    }
    if (!packageFilter.CONTAINER_ID) {
      return toast.warning("Vui lòng chọn số container!");
    }
    if (!newHouseBill) {
      setPackageList([]);
      return;
    }

    const params = {
      VOYAGEKEY: vesselInfo.VOYAGEKEY,
      CONTAINER_ID: packageFilter.CONTAINER_ID,
      HOUSE_BILL: newHouseBill
    };

    getExManifest(params)
      .then(res => {
        toast.success(res);
        setPackageList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const [billInfoEx, setBillInfoEx] = useState([]);
  const [openDialogBillInfoEx, setOpenDialogBillInfoEx] = useState(false);
  const handleGetToBillEx = () => {
    if (!packageFilter.CUSTOMER_CODE) {
      return toast.warning("Vui lòng chọn khách hàng!");
    }
    dispatch(setGlobalLoading(true));
    const packageListReq = packageList.map(item => ({
      ...item,
      CUSTOMER_CODE: item.CUSTOMER_CODE
    }));
    const servicesList = packageFilter?.selectedAttachSrvList?.map(item => item.value);
    getToBillEx(packageListReq, servicesList)
      .then(res => {
        setBillInfoEx(res.data.metadata);
        toast.success(res);
      })
      .then(() => {
        setOpenDialogBillInfoEx(true);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  useEffect(() => {
    getCustomerList();
    getConfigAttachSrv();
  }, []);

  const [customerList, setCustomerList] = useState([]);
  const getCustomerList = () => {
    getAllCustomer()
      .then(res => {
        setCustomerList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const [configAttachSrvList, setConfigAttachSrvList] = useState([]);
  const getConfigAttachSrv = async () => {
    getConfigAttachSrvByMethodCode("XK")
      .then(res => {
        setConfigAttachSrvList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const [dataBillAfterSave, setDataBillAfterSave] = useState({});
  const [openDialogSaveBillExSuccess, setOpenDialogSaveBillExSuccess] = useState(false);
  const handleSaveExOrderSuccess = data => {
    setOpenDialogBillInfoEx(false);
    setDataBillAfterSave(data);
    setOpenDialogSaveBillExSuccess(true);
  };

  const handleMakeNewExOrder = () => {
    setOpenDialogSaveBillExSuccess(false);
    setPackageList([]);
    setPackageFilter({
      selectedAttachSrvList: [],
      CUSTOMER_CODE: "",
      CONTAINER_ID: "",
      HOUSE_BILL: "",
      EXP_DATE: addDays(new Date(), 2)
    });
    setVesselInfo({});
    setDataBillAfterSave({});
    setBillInfoEx([]);
    setContainerList([]);
  };

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
        <span className="grid grid-cols-7 items-end gap-3">
          <div>
            <Label htmlFor="CONTAINER_ID">Số Container</Label>
            <SelectSearch
              id="CONTAINER_ID"
              className="w-full min-w-0"
              labelSelect="Chọn số container"
              value={packageFilter.CONTAINER_ID}
              data={containerList
                ?.map(item => ({ value: item.CONTAINER_ID, label: item.CNTRNO }))
                ?.reduce((a, b) => {
                  if (!a.find(item => item.value === b.value)) {
                    a.push(b);
                  }
                  return a;
                }, [])}
              onSelect={value => {
                setPackageList([]);
                setPackageFilter({
                  selectedAttachSrvList: [],
                  CUSTOMER_CODE: "",
                  CONTAINER_ID: value,
                  HOUSE_BILL: "",
                  EXP_DATE: addDays(new Date(), 2)
                });
              }}
            />
          </div>
          <div>
            <div>
              <Label htmlFor="HOUSE_BILL">{DT_PACKAGE_MNF_LD.HOUSE_BILL.headerName}</Label>
              <SelectSearch
                id="HOUSE_BILL"
                className="w-full min-w-0"
                labelSelect="Chọn số House Bill"
                value={packageFilter.HOUSE_BILL}
                data={containerList
                  ?.filter(item => item.CONTAINER_ID === packageFilter.CONTAINER_ID)
                  ?.map(item => ({ value: item.HOUSE_BILL, label: item.HOUSE_BILL }))}
                onSelect={handleEnterPackageFilter}
              />
            </div>
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
          <div>
            <Label htmlFor="CUSTOMER_CODE">Khách hàng</Label>
            <Select
              disabled={packageList.length === 0}
              id="CUSTOMER_CODE"
              value={packageFilter.CUSTOMER_CODE}
              onValueChange={value => {
                setPackageFilter({ ...packageFilter, CUSTOMER_CODE: value });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {customerList?.map(customer => (
                    <SelectItem key={customer.CUSTOMER_CODE} value={customer.CUSTOMER_CODE}>
                      {customer.CUSTOMER_CODE} - {customer.CUSTOMER_NAME}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="selectedAttachSrvList">Dịch vụ đính kèm</Label>
            <MultipleSelect
              id="selectedAttachSrvList"
              onChange={value => {
                setPackageFilter({ ...packageFilter, selectedAttachSrvList: value });
              }}
              value={packageFilter.selectedAttachSrvList}
              options={configAttachSrvList?.map(item => ({
                label: item.METHOD_NAME,
                value: item.ROWGUID
              }))}
              placeholder="Chọn dịch vụ đính kèm"
              hidePlaceholderWhenSelected
              emptyIndicator={
                <p className="text-center text-12 leading-10 text-gray-600 dark:text-gray-400">
                  Không có dữ liệu
                </p>
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleGetToBillEx}
              disabled={packageList.length > 0 ? false : true}
              variant="blue"
            >
              Tính tiền
            </Button>
          </div>
        </span>
      </Section.Header>
      <Section.Content>
        <span className="-mb-2 text-lg font-bold">Danh sách hàng hóa</span>
        <Section.Table>
          <AgGrid ref={gridRef} rowData={packageList} colDefs={colDefs} />
        </Section.Table>
      </Section.Content>
      <VesselInfoSelect
        open={openVesselInfoSelect}
        onOpenChange={() => {
          setOpenVesselInfoSelect(false);
        }}
        onSelectVesselInfo={handleSelectVesselInfo}
      />
      <DialogBillInfoEx
        selectedCustomer={customerList.find(
          customer => packageFilter.CUSTOMER_CODE === customer.CUSTOMER_CODE
        )}
        packageFilter={packageFilter}
        packageList={packageList}
        billInfoEx={billInfoEx}
        open={openDialogBillInfoEx}
        onOpenChange={() => {
          setOpenDialogBillInfoEx(false);
        }}
        onSaveExOrderSuccess={handleSaveExOrderSuccess}
      />

      <DialogSaveBillExSuccess
        selectedCustomer={customerList.find(
          customer => packageFilter.CUSTOMER_CODE === customer.CUSTOMER_CODE
        )}
        packageFilter={packageFilter}
        dataBillAfterSave={dataBillAfterSave}
        open={openDialogSaveBillExSuccess}
        onOpenChange={() => {
          setOpenDialogSaveBillExSuccess(false);
        }}
        onMakeNewExOrder={handleMakeNewExOrder}
      />
    </Section>
  );
}
