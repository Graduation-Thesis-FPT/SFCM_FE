import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { useEffect, useRef, useState } from "react";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { ContainerInfoSelect } from "./ContainerInfoSelect";
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
  createAndUpdatePackageMnfLd,
  deletePackageMnfLd,
  getPackageMnfLdByFilter
} from "@/apis/package_mnf_ld.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { getAllItemType } from "@/apis/item-type.api";
import {
  ItemTypeCodeRender,
  PackageUnitCodeRender
} from "@/components/common/aggridreact/cellRender";
import { BtnPrintGoodsManifest } from "./btnPrintGoodsManifest";
import { BtnPrintLabel } from "./btnPrintLabel";
import { BtnDownExcelGoodsMnfSample } from "./btnDownExcelGoodsMnfSample";
import moment from "moment";
import { getAllPackageUnit } from "@/apis/pakage-unit.api";
import { BtnImportExcel } from "./btnImportExcel";

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
const containerFilter = [
  {
    name: DT_CNTR_MNF_LD.BILLOFLADING.headerName,
    field: DT_CNTR_MNF_LD.BILLOFLADING.field
  },
  {
    name: DT_CNTR_MNF_LD.CNTRNO.headerName,
    field: DT_CNTR_MNF_LD.CNTRNO.field
  },
  {
    name: DT_CNTR_MNF_LD.CNTRSZTP.headerName,
    field: DT_CNTR_MNF_LD.CNTRSZTP.field
  },
  {
    name: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.headerName,
    field: DT_CNTR_MNF_LD.ITEM_TYPE_CODE.field
  },
  {
    name: DT_CNTR_MNF_LD.SEALNO.headerName,
    field: DT_CNTR_MNF_LD.SEALNO.field
  },
  {
    name: DT_CNTR_MNF_LD.CONSIGNEE.headerName,
    field: DT_CNTR_MNF_LD.CONSIGNEE.field
  }
];

export function GoodsManifest() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [itemType, setItemType] = useState([]);
  const [unit, setUnit] = useState([]);
  const [openVesselInfoSelect, setOpenVesselInfoSelect] = useState(false);
  const [openContainerInfoSelect, setOpenContainerInfoSelect] = useState(false);
  const [vesselInfo, setVesselInfo] = useState({});
  const [containerInfo, setContainerInfo] = useState({});

  const toast = useCustomToast();
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
      filter: true,
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.ITEM_TYPE_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => ItemTypeCodeRender(params, itemType)
    },
    {
      headerName: DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.PACKAGE_UNIT_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => PackageUnitCodeRender(params, unit)
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName,
      field: DT_PACKAGE_MNF_LD.CARGO_PIECE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number"
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: DT_PACKAGE_MNF_LD.CBM.headerName,
      field: DT_PACKAGE_MNF_LD.CBM.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number"
    },
    {
      headerName: DT_PACKAGE_MNF_LD.DECLARE_NO.headerName,
      field: DT_PACKAGE_MNF_LD.DECLARE_NO.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.NOTE.headerName,
      field: DT_PACKAGE_MNF_LD.NOTE.field,
      flex: 1,
      filter: true,
      editable: true
    }
  ];

  const handleSelectVesselInfo = vessel => {
    vessel.ETA = moment(vessel.ETA).format("DD/MM/YYYY HH:mm");
    setContainerInfo({});
    setRowData([]);
    setVesselInfo(vessel);
    setOpenVesselInfoSelect(false);
    setOpenContainerInfoSelect(true);
  };

  const handleSelectContainerInfo = container => {
    setContainerInfo(container);
    setOpenContainerInfoSelect(false);
    dispatch(setGlobalLoading(true));
    getPackageMnfLdByFilter(container.ROWGUID)
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
    setOpenContainerInfoSelect(false);
    setOpenVesselInfoSelect(true);
  };

  const handleAddRow = () => {
    if (!vesselInfo.VOYAGEKEY) {
      toast.warning("Vui lòng chọn tàu chuyến");
      return;
    }
    if (!containerInfo.ROWGUID) {
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

    dispatch(setGlobalLoading(true));
    if (insertAndUpdateData.insert.length > 0) {
      insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
        return { ...item, CONTAINER_ID: containerInfo.ROWGUID };
      });
    }
    createAndUpdatePackageMnfLd(insertAndUpdateData)
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
    const { newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ROWGUID");
    deletePackageMnfLd(selectedRows)
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
    getPackageMnfLdByFilter(containerInfo.ROWGUID)
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleFileUpload = rowDataFileUpload => {
    if (!vesselInfo.VOYAGEKEY) {
      toast.warning("Vui lòng chọn tàu chuyến");
      return;
    }
    if (!containerInfo.ROWGUID) {
      toast.warning("Vui lòng chọn container");
      return;
    }
    const finalRowData = rowDataFileUpload?.map(item => {
      return {
        ...item,
        HOUSE_BILL: item.HOUSE_BILL?.toString(),
        DECLARE_NO: item.DECLARE_NO?.toString(),
        NOTE: item.NOTE?.toString()
      };
    });
    toast.success("Nhập file thành công");
    setRowData(finalRowData);
  };

  useEffect(() => {
    getItemType();
    getUnit();
  }, []);

  const getItemType = () => {
    getAllItemType()
      .then(res => {
        setItemType(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getUnit = () => {
    getAllPackageUnit()
      .then(res => {
        setUnit(res.data.metadata);
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
                defaultValue={vesselInfo[item.field]}
                readOnly
                className="hover:cursor-pointer"
                id={item.field}
                placeholder="Chọn tàu chuyến"
              />
            </div>
          ))}
        </span>
        <span className="grid grid-cols-6 gap-3">
          {containerFilter.map(item => (
            <div key={item.field}>
              <Label htmlFor={item.field}>{item.name}</Label>
              <Input
                onClick={() => {
                  if (!vesselInfo.VOYAGEKEY) {
                    toast.warning("Vui lòng chọn tàu chuyến");
                    return;
                  }
                  setOpenContainerInfoSelect(true);
                }}
                defaultValue={
                  typeof containerInfo[item.field] === "boolean"
                    ? containerInfo[item.field]
                      ? "Có hàng"
                      : "Rỗng"
                    : containerInfo[item.field] ?? ""
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
        <span className="flex items-end justify-between">
          <div>{/* Sau này để cái gì đó vô đây */}</div>
          <LayoutTool>
            <BtnPrintGoodsManifest
              rowData={rowData}
              vesselInfo={vesselInfo}
              containerInfo={containerInfo}
            />
            <BtnPrintLabel
              gridRef={gridRef}
              vesselInfo={vesselInfo}
              containerInfo={containerInfo}
            />
            <BtnDownExcelGoodsMnfSample gridRef={gridRef} itemType={itemType} unit={unit} />
            <BtnExportExcel gridRef={gridRef} />
            <BtnImportExcel gridRef={gridRef} onFileUpload={handleFileUpload} />
            <GrantPermission action={actionGrantPermission.CREATE}>
              <BtnAddRow onAddRow={handleAddRow} />
            </GrantPermission>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
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
      <ContainerInfoSelect
        VOYAGEKEY={vesselInfo?.VOYAGEKEY}
        open={openContainerInfoSelect}
        onOpenChange={() => {
          setOpenContainerInfoSelect(false);
        }}
        onSelectContainerInfo={handleSelectContainerInfo}
        onGoBack={handleContainerGoBackVessel}
      />
    </Section>
  );
}
