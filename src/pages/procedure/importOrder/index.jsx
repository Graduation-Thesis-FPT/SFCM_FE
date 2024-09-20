import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit,
  voyage
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { useCustomToast } from "@/components/common/custom-toast";
import { regexPattern } from "@/constants/regexPattern";
import { DatePicker } from "@/components/common/date-picker";
import { addDays } from "date-fns";
import moment from "moment";
import { getContList, getManifestPackage, getToBillIn } from "@/apis/order.api";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { DialogBillInfo } from "./dialogBillInfo";
import { DialogSaveBillSuccess } from "./dialogSaveBillSuccess";
import { MultipleSelect } from "@/components/common/multiple-select";
import { FilterInfoSelect } from "./FilterInfoSelect";
import { calculateImportContainer, getAllContainerByVoyIdAndCusId } from "@/apis/import-order.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { VoyContainerStatusRender } from "@/components/common/aggridreact/cellRender";

const DT_PACKAGE_MNF_LD = new dt_package_mnf_ld();

const VOYAGE = new voyage();

const filterList = [
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
  },
  {
    name: "Mã đại lý",
    field: "SHIPPER_ID"
  },
  {
    name: "Tên đại lý",
    field: "FULLNAME"
  },
  {
    name: "Mã số thuế",
    field: "TAX_CODE"
  }
];

export function ImportOrder() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispach = useDispatch();

  const [containerList, setContainerList] = useState([]);
  // const [configAttachSrvList, setConfigAttachSrvList] = useState([]);

  const [filterInfoSelected, setFilterInfoSelected] = useState({});
  const [openFilterInfoSelect, setOpenFilterInfoSelect] = useState(false);

  const [contList, setContList] = useState([]);
  const [openContainerSelect, setOpenContainerSelect] = useState(false);

  const [customerList, setCustomerList] = useState([]);

  const [selectedAttachSrvList, setSelectedAttachSrvList] = useState([]);
  const [CUSTOMER_CODE, setCUSTOMER_CODE] = useState("");
  const [BILLOFLADING, setBILLOFLADING] = useState("");
  const [CNTRNO, setCNTRNO] = useState("");
  const [EXP_DATE, setEXP_DATE] = useState(addDays(new Date(), 2));

  const [billInfoList, setBillInfoList] = useState([]);

  const [dataBillAfterSave, setDataBillAfterSave] = useState({});

  const [openDialogBillInfo, setOpenDialogBillInfo] = useState(false);
  const [openDialogSaveBillSuccess, setOpenDialogSaveBillSuccess] = useState(false);

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
      headerName: "Số container",
      field: "CNTR_NO",
      flex: 1,
      filter: true
    },
    {
      headerName: "Kích thước container",
      field: "CNTR_SIZE",
      flex: 1
    },
    {
      headerName: "Số seal",
      field: "SEAL_NO",
      flex: 1
    },
    {
      headerName: "Ghi chú",
      field: "NOTE",
      flex: 1
    },
    {
      headerName: "Trạng thái cont",
      field: "STATUS",
      flex: 1,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: VoyContainerStatusRender
    }
  ];

  const handleSelectedFilterInfo = voyage => {
    dispach(setGlobalLoading(true));
    setContainerList([]);
    setFilterInfoSelected(voyage);
    setOpenFilterInfoSelect(false);
    getAllContainerByVoyIdAndCusId(voyage.ID, voyage.SHIPPER_ID)
      .then(res => {
        setContainerList(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispach(setGlobalLoading(false));
      });
  };

  const handleSelectContainerInfo = cont => {
    setContainerList([]);
    setOpenContainerSelect(false);
    setCNTRNO(cont.CNTRNO);
    let dataSend = { VOYAGEKEY: filterInfoSelected.VOYAGEKEY, CNTRNO: cont.CNTRNO };
    getManifestPackage(dataSend)
      .then(res => {
        if (res.data.metadata.length === 0) {
          setContainerList([]);
          return toast.error("Không tìm thấy dữ liệu. Vui lòng kiểm tra lại!");
        }
        setContainerList(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleEnterBillOfLading = () => {
    if (!filterInfoSelected.VOYAGEKEY || !BILLOFLADING) {
      return;
    }
    let dataSend = { VOYAGEKEY: filterInfoSelected.VOYAGEKEY, BILLOFLADING: BILLOFLADING };
    getContList(dataSend)
      .then(res => {
        setCNTRNO("");
        setContainerList([]);
        if (res.data.metadata.length === 0) {
          return toast.error("Không tìm thấy dữ liệu. Vui lòng kiểm tra lại số vận đơn!");
        }
        setContList(res.data.metadata);
        setOpenContainerSelect(true);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleEnterCntrNo = () => {
    if (!filterInfoSelected.VOYAGEKEY || !CNTRNO) {
      return;
    }
    if (!regexPattern.CNTRNO.test(CNTRNO)) {
      setBILLOFLADING("");
      setContainerList([]);
      return toast.error("Số container không hợp lệ");
    }
    let dataSend = { VOYAGEKEY: filterInfoSelected.VOYAGEKEY, CNTRNO: CNTRNO };
    getManifestPackage(dataSend)
      .then(res => {
        setBILLOFLADING("");
        if (res.data.metadata.length === 0) {
          setContainerList([]);
          return toast.error("Không tìm thấy dữ liệu. Vui lòng kiểm tra lại số container!");
        }
        setContainerList(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  ///////

  const handleGetToBillIn = () => {
    if (!CUSTOMER_CODE) {
      return toast.warning("Vui lòng chọn khách hàng!");
    }
    const arrayPackage = containerList.map(item => ({ ...item, CUSTOMER_CODE }));
    const servicesList = selectedAttachSrvList.map(item => item.value);
    getToBillIn(arrayPackage, servicesList)
      .then(res => {
        setBillInfoList(res.data.metadata);
      })
      .then(() => {
        setOpenDialogBillInfo(true);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleSaveInOrderSuccess = data => {
    setDataBillAfterSave(data);
    setOpenDialogSaveBillSuccess(true);
  };

  const handleMakeNewOrder = () => {
    setOpenDialogSaveBillSuccess(false);
    setContainerList([]);
    setFilterInfoSelected({});
    setBILLOFLADING("");
    setCNTRNO("");
    setCUSTOMER_CODE("");
    setSelectedAttachSrvList([]);
    setBillInfoList([]);
    setDataBillAfterSave({});
  };

  const handleCalculateImportContainer = () => {
    const rowSelected = gridRef?.current?.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn container");
      return;
    }
    dispach(setGlobalLoading(true));
    const listContId = rowSelected?.map(item => item.ID);
    calculateImportContainer(listContId)
      .then(res => {
        toast.success(res);
        setBillInfoList(res.data.metadata);
        setOpenDialogBillInfo(true);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispach(setGlobalLoading(false));
      });
  };

  return (
    <Section>
      <Section.Header className="space-y-4">
        <div className="flex flex-row gap-3">
          {filterList.map(item => (
            <div className="w-full" key={item.field}>
              <Label htmlFor={item.field}>{item.name}</Label>
              <Input
                onClick={() => {
                  setOpenFilterInfoSelect(true);
                }}
                defaultValue={
                  filterInfoSelected[item.field]
                    ? item.field === "ETA"
                      ? moment(filterInfoSelected[item.field]).format("DD/MM/YYYY")
                      : filterInfoSelected[item.field]
                    : ""
                }
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn chuyến tàu "
              />
            </div>
          ))}
        </div>
        {/* <div className="flex flex-row flex-wrap items-end gap-3">
          <div>
            <Label htmlFor="BILLOFLADING">{DT_CNTR_MNF_LD.BILLOFLADING.headerName} *</Label>
            <Input
              id="BILLOFLADING"
              placeholder="Nhập số vận đơn"
              value={BILLOFLADING}
              onChange={e => {
                if (!filterInfoSelected.VOYAGEKEY) {
                  return null;
                }
                setBILLOFLADING(e.target.value?.trim());
              }}
              onFocus={() => {
                if (!filterInfoSelected.VOYAGEKEY) {
                  return toast.warning("Vui lòng chọn tàu chuyến!");
                }
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  document.getElementById("BILLOFLADING")?.blur();
                  return;
                }
              }}
              onBlur={handleEnterBillOfLading}
            />
          </div>
          <div>
            <Label htmlFor="CNTRNO">{DT_CNTR_MNF_LD.CNTRNO.headerName}</Label>
            <Input
              id="CNTRNO"
              placeholder="Nhập số container"
              value={CNTRNO}
              maxLength={11}
              onChange={e => {
                if (!filterInfoSelected.VOYAGEKEY) {
                  return null;
                }
                setCNTRNO(e.target.value?.trim()?.toUpperCase());
              }}
              onFocus={() => {
                if (!filterInfoSelected.VOYAGEKEY) {
                  return toast.warning("Vui lòng chọn tàu chuyến!");
                }
              }}
              onKeyPress={e => {
                if (e.key === "Enter") {
                  document.getElementById("CNTRNO")?.blur();
                  return;
                }
              }}
              onBlur={handleEnterCntrNo}
            />
          </div>
          <div>
            <Label htmlFor="EXP_DATE">Hạn lệnh</Label>
            <DatePicker
              id="EXP_DATE"
              onSelected={data => {
                if (moment(data).isBefore(moment(new Date()), "day")) {
                  return toast.error("Hạn lệnh tối thiểu phải là ngày hôm nay!");
                }
                setEXP_DATE(data);
              }}
              date={EXP_DATE}
            />
          </div>
          <div>
            <Label htmlFor="CUSTOMER_CODE">Khách hàng</Label>
            <Select
              disabled={containerList.length === 0}
              id="CUSTOMER_CODE"
              value={CUSTOMER_CODE}
              onValueChange={value => {
                setCUSTOMER_CODE(value);
              }}
            >
              <SelectTrigger className="min-w-48 max-w-48">
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
              onChange={setSelectedAttachSrvList}
              value={selectedAttachSrvList}
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
          <div className="flex h-9 items-center">
            <Button
              onClick={handleGetToBillIn}
              disabled={containerList.length > 0 ? false : true}
              variant="blue"
            >
              Tính tiền
            </Button>
          </div>
        </div> */}
      </Section.Header>
      <Section.Content>
        <span className="flex items-end justify-between">
          <span className="text-lg font-bold">
            Danh sách container của đại lý: {filterInfoSelected.FULLNAME}
          </span>
          <Button
            onClick={handleCalculateImportContainer}
            disabled={containerList.length > 0 ? false : true}
            variant="blue"
          >
            Tính tiền
          </Button>
        </span>
        <Section.Table>
          <AgGrid
            setContainerList={data => {
              setContainerList(data);
            }}
            ref={gridRef}
            rowData={containerList}
            colDefs={colDefs}
          />
        </Section.Table>
      </Section.Content>
      <FilterInfoSelect
        open={openFilterInfoSelect}
        onOpenChange={() => {
          setOpenFilterInfoSelect(false);
        }}
        onSelectedFilterInfo={handleSelectedFilterInfo}
      />
      <DialogBillInfo
        filterInfoSelected={filterInfoSelected}
        containerList={containerList}
        EXP_DATE={EXP_DATE}
        selectedCustomer={customerList.find(customer => customer.CUSTOMER_CODE === CUSTOMER_CODE)}
        billInfoList={billInfoList}
        open={openDialogBillInfo}
        onOpenChange={() => {
          setOpenDialogBillInfo(false);
        }}
        onSaveInOrderSuccess={handleSaveInOrderSuccess}
      />
      <DialogSaveBillSuccess
        CNTRNO={CNTRNO}
        selectedCustomer={customerList.find(customer => customer.CUSTOMER_CODE === CUSTOMER_CODE)}
        onMakeNewOrder={handleMakeNewOrder}
        data={dataBillAfterSave}
        open={openDialogSaveBillSuccess}
        onOpenChange={() => {
          setOpenDialogSaveBillSuccess(false);
        }}
      />
    </Section>
  );
}
