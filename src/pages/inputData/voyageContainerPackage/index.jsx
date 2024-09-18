import {
  voyage,
  voyage_container,
  voyage_container_package
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { useEffect, useRef, useState } from "react";
import { VoyageContainerSelect } from "./VoyageContainerSelect";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { useCustomToast } from "@/components/common/custom-toast";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { GrantPermission } from "@/components/common/grant-permission";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { actionGrantPermission } from "@/constants";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import {
  createAndUpdateVoyContPackage,
  deleteVoyContPackage,
  getVoyageContainerPackage
} from "@/apis/voyage-container-package.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { getAllPackageType } from "@/apis/package-type.api";
import {
  CustomerRender,
  OnlyEditWithInsertCell,
  PackageTypeRender
} from "@/components/common/aggridreact/cellRender";
import { BtnDownExcelGoodsMnfSample } from "./btnDownExcelGoodsMnfSample";
import moment from "moment";
import { getAllPackageUnit } from "@/apis/pakage-unit.api";
import { BtnImportExcel } from "./btnImportExcel";
import { Copy } from "lucide-react";
import { cn, removeLastAsterisk } from "@/lib/utils";
import { ErrorWithDetail } from "@/components/common/custom-toast/ErrorWithDetail";
import { checkGoodsManifest } from "@/lib/validation/input-data/checkGoodsManifest";
import { VoyageSelect } from "./VoyageSelect";
import useFetchData from "@/hooks/useRefetchData";
import { getCustomerByCustomerType } from "@/apis/customer.api";

const VOYAGE = new voyage();
const VOYAGE_CONTAINER = new voyage_container();
const VOYAGE_CONTAINER_PACKAGE = new voyage_container_package();

const vesselFilter = [
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
const containerFilter = [
  {
    name: VOYAGE_CONTAINER.CNTR_NO.headerName,
    field: VOYAGE_CONTAINER.CNTR_NO.field
  },
  {
    name: VOYAGE_CONTAINER.CNTR_SIZE.headerName,
    field: VOYAGE_CONTAINER.CNTR_SIZE.field
  },
  {
    name: VOYAGE_CONTAINER.SHIPPER_ID.headerName,
    field: VOYAGE_CONTAINER.SHIPPER_ID.field
  },
  {
    name: VOYAGE_CONTAINER.SEAL_NO.headerName,
    field: VOYAGE_CONTAINER.SEAL_NO.field
  },
  {
    name: VOYAGE_CONTAINER.NOTE.headerName,
    field: VOYAGE_CONTAINER.NOTE.field
  }
];

export function VoyageContainerPackage() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const { data: packageTypeList } = useFetchData({
    service: getAllPackageType
  });
  const { data: consigneeList } = useFetchData({
    service: getCustomerByCustomerType,
    params: "CONSIGNEE"
  });

  const [rowData, setRowData] = useState([]);

  const [unit, setUnit] = useState([]);

  const [openSelectVoyage, setOpenSelectVoyage] = useState(false);
  const [openSelectContainer, setOpenSelectContainer] = useState(false);

  const [voyageSelected, setVoyageSelected] = useState({});
  const [containerSelected, setContainerSelected] = useState({});

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
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.CONSIGNEE_ID.field,
      flex: 1,
      filter: true,
      cellStyle: {
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: params => CustomerRender(params, consigneeList)
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
      filter: true,
      editable: true
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.TOTAL_ITEMS.field,
      flex: 1,
      filter: true,
      editable: true,
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      cellDataType: "number"
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: VOYAGE_CONTAINER_PACKAGE.CBM.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.CBM.field,
      flex: 1,
      filter: true,
      editable: true,
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      cellDataType: "number"
    },
    {
      headerName: VOYAGE_CONTAINER_PACKAGE.NOTE.headerName,
      field: VOYAGE_CONTAINER_PACKAGE.NOTE.field,
      flex: 1,
      filter: true,
      editable: true
    }
  ];

  const handleSelectVoyage = vessel => {
    setContainerSelected({});
    setRowData([]);
    setVoyageSelected({ ...vessel, ETA: moment(vessel.ETA).format("DD/MM/YYYY") });
    setOpenSelectVoyage(false);
    setOpenSelectContainer(true);
  };

  const handleSelectContainer = container => {
    setContainerSelected(container);
    setOpenSelectContainer(false);
    dispatch(setGlobalLoading(true));
    getVoyageContainerPackage(container.ID)
      .then(res => {
        setRowData(res.data.metadata);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleContainerGoBackVessel = () => {
    setOpenSelectContainer(false);
    setOpenSelectVoyage(true);
  };

  const handleAddRow = () => {
    if (!voyageSelected.ID) {
      toast.warning("Vui lòng chọn tàu chuyến");
      return;
    }
    if (!containerSelected.ID) {
      toast.warning("Vui lòng chọn container");
      return;
    }
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    // const { isValid, mess } = checkGoodsManifest(gridRef);
    // if (!isValid) {
    //   toast.errorWithDetail(<ErrorWithDetail mess={mess} />);
    //   return;
    // }

    dispatch(setGlobalLoading(true));
    if (insertAndUpdateData.insert.length > 0) {
      insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
        return { ...item, VOYAGE_CONTAINER_ID: containerSelected.ID };
      });
    }
    createAndUpdateVoyContPackage(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowData();
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const handleDeleteRows = selectedRows => {
    dispatch(setGlobalLoading(true));
    const { newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ID");
    deleteVoyContPackage(selectedRows)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  };

  const getRowData = () => {
    getVoyageContainerPackage(containerSelected.ID)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleFileUpload = rowDataFileUpload => {
    if (!voyageSelected.VOYAGEKEY) {
      toast.warning("Vui lòng chọn tàu chuyến");
      return;
    }
    if (!containerSelected.ROWGUID) {
      toast.warning("Vui lòng chọn container");
      return;
    }
    const finalRowData = rowDataFileUpload?.map(item => {
      return {
        ...item,
        CARGO_PIECE: Number(item?.CARGO_PIECE),
        CBM: Number(item?.CBM),
        HOUSE_BILL: item.HOUSE_BILL?.toString(),
        DECLARE_NO: item.DECLARE_NO?.toString(),
        NOTE: item.NOTE?.toString()
      };
    });
    toast.success("Nhập file thành công");
    setRowData(finalRowData);
  };

  const handleCopyToClipboard = field => {
    try {
      if (field === VOYAGE_CONTAINER.CNTRNO.field && containerSelected.CNTRNO) {
        navigator.clipboard.writeText(containerSelected?.CNTRNO);
        toast.success("Copy số container thành công");
      } else if (field === VOYAGE_CONTAINER.BILLOFLADING.field && containerSelected.BILLOFLADING) {
        navigator.clipboard.writeText(containerSelected?.BILLOFLADING);
        toast.success("Copy số vận đơn thành công");
      } else {
        toast.error("Không có dữ liệu để copy");
      }
    } catch (error) {
      console.log(error);
      toast.error("Copy thất bại. Vui lòng thử lại");
    }
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
                  setOpenSelectVoyage(true);
                }}
                defaultValue={voyageSelected[item.field]}
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn chuyến tàu"
              />
            </div>
          ))}
        </span>
        <span className="grid grid-cols-6 gap-3">
          {containerFilter.map(item => (
            <div
              key={item.field}
              className={cn(item.field === VOYAGE_CONTAINER.NOTE.field ? "col-span-2" : "")}
            >
              <Label className="flex">
                {removeLastAsterisk(item.name)}
                {item.field === VOYAGE_CONTAINER.CNTR_NO.field && (
                  <Copy
                    onClick={() => {
                      handleCopyToClipboard(item.field);
                    }}
                    className="ml-3 size-3 hover:cursor-pointer hover:text-black/70"
                  />
                )}
              </Label>
              <Input
                onClick={() => {
                  if (!voyageSelected.ID) {
                    toast.warning("Vui lòng chọn chuyến tàu");
                    return;
                  }
                  setOpenSelectContainer(true);
                }}
                defaultValue={
                  typeof containerSelected[item.field] === "boolean"
                    ? containerSelected[item.field]
                      ? "Có hàng"
                      : "Rỗng"
                    : containerSelected[item.field] ?? ""
                }
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn container"
              />
            </div>
          ))}
        </span>
      </Section.Header>
      <Section.Content>
        <LayoutTool>
          {/* <BtnPrintGoodsManifest
              rowData={rowData}
              voyageSelected={voyageSelected}
              containerSelected={containerSelected}
            /> */}
          {/* <BtnPrintLabel
              gridRef={gridRef}
              voyageSelected={voyageSelected}
              containerSelected={containerSelected}
            /> */}
          <BtnDownExcelGoodsMnfSample gridRef={gridRef} itemType={packageTypeList} unit={unit} />
          <BtnExportExcel gridRef={gridRef} />
          <BtnImportExcel gridRef={gridRef} onFileUpload={handleFileUpload} />
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
        <Section.Table>
          <AgGrid
            contextMenu={true}
            showCountRowSelected={true}
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
      <VoyageSelect
        open={openSelectVoyage}
        onOpenChange={() => {
          setOpenSelectVoyage(false);
        }}
        onSelectVesselInfo={handleSelectVoyage}
      />
      <VoyageContainerSelect
        VOYAGE_ID={voyageSelected?.ID}
        open={openSelectContainer}
        onOpenChange={() => {
          setOpenSelectContainer(false);
        }}
        onSelectContainerInfo={handleSelectContainer}
        onGoBack={handleContainerGoBackVessel}
      />
    </Section>
  );
}
