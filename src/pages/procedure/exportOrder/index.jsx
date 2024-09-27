import {
  dt_package_mnf_ld,
  voyage_container_package
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { useCustomToast } from "@/components/common/custom-toast";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DialogBillInfoEx } from "./dialogBillInfoEx";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { DialogSaveBillExSuccess } from "./dialogSaveBillExSuccess";
import { Button } from "@/components/common/ui/button";
import { calculateExportOrder, getPackageCanExportByConsigneeId } from "@/apis/export-order.api";
import {
  PackageTypeRender,
  VoyContPackageStatusRender
} from "@/components/common/aggridreact/cellRender";
import { getAllPackageType } from "@/apis/package-type.api";
import useFetchData from "@/hooks/useRefetchData";
import { DatePicker } from "@/components/common/date-picker";
import { socket } from "@/config/socket";

const VOYAGE_CONTAINER_PACKAGE = new voyage_container_package();

const customerFilter = [
  {
    name: "Mã chủ hàng",
    field: "CONSIGNEE_ID"
  },
  {
    name: "Tên chủ hàng",
    field: "FULLNAME"
  },
  {
    name: "Mã số thuế",
    field: "TAX_CODE"
  },
  {
    name: "Email",
    field: "EMAIL"
  }
];

export function ExportOrder() {
  const toast = useCustomToast();
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const { data: packageTypeList } = useFetchData({
    service: getAllPackageType
  });

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
      headerName: VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.HOUSE_BILL.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.PACKAGE_TYPE_ID.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: params => PackageTypeRender(params, packageTypeList)
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.PACKAGE_UNIT.field,
      flex: 1,
      filter: true
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.field,
      flex: 1
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.CBM.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.CBM.field,
      flex: 1
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.NOTE.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.NOTE.field,
      flex: 1,
      filter: true
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.STATUS.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.STATUS.field,
      flex: 1,
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: VoyContPackageStatusRender
    }
  ];

  const [customerSelected, setCustomerSelected] = useState({});
  const [packageList, setPackageList] = useState([]);
  const [openCustomerSelect, setOpenCustomerSelect] = useState(false);

  const [pickupDate, setPickupDate] = useState(new Date());
  const [billInfoEx, setBillInfoEx] = useState({});
  const [openDialogBillInfoEx, setOpenDialogBillInfoEx] = useState(false);

  const [dataBillAfterSave, setDataBillAfterSave] = useState({});
  const [openDialogSaveBillExSuccess, setOpenDialogSaveBillExSuccess] = useState(false);

  const handleCustomerSelected = customerSelected => {
    dispatch(setGlobalLoading(true));
    setCustomerSelected(customerSelected);
    setOpenCustomerSelect(false);
    getPackageCanExportByConsigneeId(customerSelected.CONSIGNEE_ID)
      .then(res => {
        toast.success(res);
        setPackageList(res.data.metadata);
      })
      .catch(err => {
        setPackageList([]);
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleCalculateExportOrder = () => {
    const rowSelected = gridRef?.current?.api.getSelectedRows();
    if (rowSelected.length === 0) {
      toast.warning("Vui lòng chọn kiện hàng");
      return;
    }
    if (!pickupDate) {
      return toast.warning("Vui lòng chọn ngày lấy hàng");
    }
    const currentDate = new Date();
    if (currentDate > moment(pickupDate).endOf("day").toDate()) {
      return toast.warning("Ngày lấy hàng không hợp lệ");
    }
    dispatch(setGlobalLoading(true));
    const listPkId = rowSelected?.map(item => item.ID);
    calculateExportOrder(listPkId, pickupDate)
      .then(res => {
        toast.success(res);
        setBillInfoEx(res.data.metadata);
        setOpenDialogBillInfoEx(true);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleSaveExOrderSuccess = data => {
    setOpenDialogBillInfoEx(false);
    setDataBillAfterSave(data);
    setOpenDialogSaveBillExSuccess(true);
  };

  const handleMakeNewExOrder = () => {
    setOpenDialogSaveBillExSuccess(false);
    setPackageList([]);
    setCustomerSelected({});
    setDataBillAfterSave({});
    setBillInfoEx([]);
  };

  return (
    <Section>
      <Section.Header className="space-y-4">
        <div className="flex gap-3">
          {customerFilter.map(item => (
            <div className="w-full" key={item.field}>
              <Label htmlFor={item.field}>{item.name}</Label>
              <Input
                onClick={() => {
                  setOpenCustomerSelect(true);
                }}
                defaultValue={customerSelected[item.field] ?? ""}
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn khách hàng"
              />
            </div>
          ))}
          <div className="flex flex-col">
            <Label htmlFor="pickupDate">Ngày lấy hàng</Label>
            <DatePicker id="pickupDate" onSelected={setPickupDate} date={pickupDate} />
          </div>
        </div>
      </Section.Header>
      <Section.Content>
        <span className="flex items-end justify-between">
          <span className="text-lg font-bold">
            Danh sách kiện hàng của chủ hàng: {customerSelected.FULLNAME}
          </span>
          <Button
            onClick={handleCalculateExportOrder}
            disabled={packageList.length > 0 ? false : true}
            variant="blue"
          >
            Tính tiền
          </Button>
        </span>
        <Section.Table>
          <AgGrid ref={gridRef} rowData={packageList} colDefs={colDefs} />
        </Section.Table>
      </Section.Content>
      <VesselInfoSelect
        open={openCustomerSelect}
        onOpenChange={() => {
          setOpenCustomerSelect(false);
        }}
        onSelectVesselInfo={handleCustomerSelected}
      />

      <DialogBillInfoEx
        customerSelected={customerSelected}
        billInfoEx={billInfoEx}
        open={openDialogBillInfoEx}
        onOpenChange={() => {
          setOpenDialogBillInfoEx(false);
        }}
        onSaveExOrderSuccess={handleSaveExOrderSuccess}
      />

      <DialogSaveBillExSuccess
        customerSelected={customerSelected}
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
