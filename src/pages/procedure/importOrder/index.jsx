import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { voyage } from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { useCustomToast } from "@/components/common/custom-toast";
import moment from "moment";
import { DialogBillInfo } from "./dialogBillInfo";
import { DialogSaveBillSuccess } from "./dialogSaveBillSuccess";
import { FilterInfoSelect } from "./FilterInfoSelect";
import { calculateImportContainer, getAllContainerByVoyIdAndCusId } from "@/apis/import-order.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { VoyContainerStatusRender } from "@/components/common/aggridreact/cellRender";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContainerDetail } from "./DialogContainerDetail";

const VOYAGE = new voyage();

const filterList = [
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

export function ImportOrder() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const dispach = useDispatch();

  const [filterInfoSelected, setFilterInfoSelected] = useState({});
  const [openFilterInfoSelect, setOpenFilterInfoSelect] = useState(false);

  const [containerList, setContainerList] = useState([]);
  const [selectedContIdList, setSelectedContIdList] = useState([]);

  const [openDialogBillInfo, setOpenDialogBillInfo] = useState(false);
  const [billInfoList, setBillInfoList] = useState([]);

  const [openDialogSaveBillSuccess, setOpenDialogSaveBillSuccess] = useState(false);
  const [dataBillAfterSave, setDataBillAfterSave] = useState({});

  const [selectedContainer, setSelectedContainer] = useState({});
  const [openDialogContainerDetail, setOpenDialogContainerDetail] = useState(false);

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
      headerName: "Kích thước container (ft)",
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
    },
    {
      headerName: "",
      field: "#",
      cellStyle: { alignContent: "center", textAlign: "center" },
      flex: 0.5,
      cellRenderer: params => {
        return (
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              setSelectedContainer(params.data);
              setOpenDialogContainerDetail(true);
            }}
            className="text-xs text-blue-700 hover:text-blue-700/80"
          >
            Chi tiết
          </Button>
        );
      }
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

  const handleSaveImportOrderSuccess = data => {
    setDataBillAfterSave(data);
    setOpenDialogBillInfo(false);
    setOpenDialogSaveBillSuccess(true);
  };

  const handleMakeNewOrder = () => {
    setOpenDialogSaveBillSuccess(false);
    setFilterInfoSelected({});
    setContainerList([]);
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
        setSelectedContIdList(listContId);
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
      <DialogContainerDetail
        open={openDialogContainerDetail}
        onOpenChange={() => {
          setOpenDialogContainerDetail(false);
        }}
        selectedContainer={selectedContainer}
      />
      <FilterInfoSelect
        open={openFilterInfoSelect}
        onOpenChange={() => {
          setOpenFilterInfoSelect(false);
        }}
        onSelectedFilterInfo={handleSelectedFilterInfo}
      />
      <DialogBillInfo
        filterInfoSelected={filterInfoSelected}
        selectedContIdList={selectedContIdList}
        billInfoList={billInfoList}
        open={openDialogBillInfo}
        onOpenChange={() => {
          setOpenDialogBillInfo(false);
        }}
        onSaveImportOrderSuccess={handleSaveImportOrderSuccess}
      />
      <DialogSaveBillSuccess
        filterInfoSelected={filterInfoSelected}
        billInfoList={billInfoList}
        dataBillAfterSave={dataBillAfterSave}
        open={openDialogSaveBillSuccess}
        onOpenChange={() => {
          setOpenDialogSaveBillSuccess(false);
        }}
        onMakeNewOrder={handleMakeNewOrder}
      />
    </Section>
  );
}
