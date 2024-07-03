import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { useCustomToast } from "@/components/common/custom-toast";
import { regexPattern } from "@/constants/regexPattern";
import { DatePicker } from "@/components/common/date-picker";
import { addDays } from "date-fns";
import moment from "moment";
import { getContList, getManifestPackage } from "@/apis/order.api";
import { ContainerSelect } from "./ContainerSelect";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { getAllCustomer } from "@/apis/customer.api";

export function ImportOrder() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [vesselInfo, setVesselInfo] = useState({});
  const [openVesselInfoSelect, setOpenVesselInfoSelect] = useState(false);

  const [contList, setContList] = useState([]);
  const [openContainerSelect, setOpenContainerSelect] = useState(false);

  const [customerList, setCustomerList] = useState([]);

  const [CUSTOMER_CODE, setCUSTOMER_CODE] = useState("");
  const [BILLOFLADING, setBILLOFLADING] = useState("");
  const [CNTRNO, setCNTRNO] = useState("");
  const [HANLENH, setHANLENH] = useState(addDays(new Date(), 2));

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
      name: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.headerName,
      field: DT_VESSEL_VISIT.OUTBOUND_VOYAGE.field
    }
  ];
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
      headerName: DT_PACKAGE_MNF_LD.LOT_NO.headerName,
      field: DT_PACKAGE_MNF_LD.LOT_NO.field,
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
      headerName: DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName,
      field: DT_PACKAGE_MNF_LD.CARGO_PIECE.field,
      flex: 1
    },
    {
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

  const handleSelectVesselInfo = vessel => {
    setRowData([]);
    setVesselInfo(vessel);
    setBILLOFLADING("");
    setCNTRNO("");
    setOpenVesselInfoSelect(false);
  };

  const handleSelectContainerInfo = cont => {
    setRowData([]);
    setOpenContainerSelect(false);
    setCNTRNO(cont.CNTRNO);
    let dataSend = { VOYAGEKEY: vesselInfo.VOYAGEKEY, CNTRNO: cont.CNTRNO };
    getManifestPackage(dataSend)
      .then(res => {
        if (res.data.metadata.length === 0) {
          setRowData([]);
          return toast.error("Không tìm thấy dữ liệu. Vui lòng kiểm tra lại!");
        }
        setRowData(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleEnterBillOfLading = () => {
    if (!vesselInfo.VOYAGEKEY || !BILLOFLADING) {
      return;
    }
    let dataSend = { VOYAGEKEY: vesselInfo.VOYAGEKEY, BILLOFLADING: BILLOFLADING };
    getContList(dataSend)
      .then(res => {
        setCNTRNO("");
        setRowData([]);
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
    if (!vesselInfo.VOYAGEKEY || !CNTRNO) {
      return;
    }
    if (!regexPattern.CNTRNO.test(CNTRNO)) {
      setBILLOFLADING("");
      setRowData([]);
      return toast.error("Số container không hợp lệ");
    }
    let dataSend = { VOYAGEKEY: vesselInfo.VOYAGEKEY, CNTRNO: CNTRNO };
    getManifestPackage(dataSend)
      .then(res => {
        setBILLOFLADING("");
        if (res.data.metadata.length === 0) {
          setRowData([]);
          return toast.error("Không tìm thấy dữ liệu. Vui lòng kiểm tra lại số container!");
        }
        setRowData(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = () => {
    getAllCustomer()
      .then(res => {
        setCustomerList(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
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
                defaultValue={vesselInfo[item.field] ?? ""}
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn tàu chuyến"
              />
            </div>
          ))}
        </span>
        <span className="grid grid-cols-6 gap-3">
          <div>
            <Label htmlFor="BILLOFLADING">{DT_CNTR_MNF_LD.BILLOFLADING.headerName} *</Label>
            <Input
              id="BILLOFLADING"
              placeholder="Nhập số vận đơn"
              value={BILLOFLADING}
              onChange={e => {
                if (!vesselInfo.VOYAGEKEY) {
                  return null;
                }
                setBILLOFLADING(e.target.value?.trim());
              }}
              onFocus={() => {
                if (!vesselInfo.VOYAGEKEY) {
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
                if (!vesselInfo.VOYAGEKEY) {
                  return null;
                }
                setCNTRNO(e.target.value?.trim()?.toUpperCase());
              }}
              onFocus={() => {
                if (!vesselInfo.VOYAGEKEY) {
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
            <Label htmlFor="HANLENH">Hạn lệnh</Label>
            <DatePicker
              id="HANLENH"
              onSelected={data => {
                if (moment(data).isBefore(moment(new Date()), "day")) {
                  return toast.error("Hạn lệnh tối thiểu phải là ngày hôm nay!");
                }
                setHANLENH(data);
              }}
              date={HANLENH}
            />
          </div>
          <div>
            <Label htmlFor="CUSTOMER_CODE">Khách hàng</Label>
            <Select
              disabled={rowData.length === 0}
              id="CUSTOMER_CODE"
              value={CUSTOMER_CODE}
              onValueChange={value => {
                setCUSTOMER_CODE(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {customerList.map(customer => (
                    <SelectItem key={customer.CUSTOMER_CODE} value={customer.CUSTOMER_CODE}>
                      {customer.CUSTOMER_CODE} - {customer.CUSTOMER_NAME}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </span>
      </Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <Button variant="outline">Quay lại</Button>
          <Button id="search" variant="green">
            Tiếp tục
          </Button>
        </span>
        <Section.Table>
          <AgGrid
            contextMenu={true}
            setRowData={data => {
              setRowData(data);
            }}
            ref={gridRef}
            rowData={rowData}
            colDefs={colDefs}
            onDeleteRow={selectedRows => {
              handleDeleteRows(selectedRows);
            }}
          />
        </Section.Table>
      </Section.Content>
      <VesselInfoSelect
        open={openVesselInfoSelect}
        onOpenChange={() => {
          setOpenVesselInfoSelect(false);
        }}
        onSelectVesselInfo={handleSelectVesselInfo}
      />
      <ContainerSelect
        contList={contList}
        open={openContainerSelect}
        onOpenChange={() => {
          setOpenContainerSelect(false);
        }}
        onSelectContainerInfo={handleSelectContainerInfo}
      />
    </Section>
  );
}
