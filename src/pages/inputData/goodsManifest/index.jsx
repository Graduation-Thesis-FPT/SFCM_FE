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
import { ItemTypeCodeRender, UnitCodeRender } from "@/components/common/aggridreact/cellRender";
import { getAllUnit } from "@/apis/unit.api";
import { BtnPrintGoodsManifest } from "./btnPrintGoodsManifest";
import { BtnPrintLabel } from "./btnPrintLabel";
import { BtnImportExcel } from "@/components/common/aggridreact/tableTools/BtnImportExcel";
import { v4 as uuidv4 } from "uuid";

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
  const DT_VESSEL_VISIT = new dt_vessel_visit();
  const DT_CNTR_MNF_LD = new dt_cntr_mnf_ld();
  const DT_PACKAGE_MNF_LD = new dt_package_mnf_ld();
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
      headerName: DT_PACKAGE_MNF_LD.LOT_NO.headerName,
      field: DT_PACKAGE_MNF_LD.LOT_NO.field,
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
      headerName: DT_PACKAGE_MNF_LD.UNIT_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.UNIT_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: params => UnitCodeRender(params, unit)
    },
    {
      headerName: DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName,
      field: DT_PACKAGE_MNF_LD.CARGO_PIECE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number"
    },
    {
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
  const containerFilter = [
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
      name: DT_CNTR_MNF_LD.STATUSOFGOOD.headerName,
      field: DT_CNTR_MNF_LD.STATUSOFGOOD.field
    },
    {
      name: DT_CNTR_MNF_LD.CONSIGNEE.headerName,
      field: DT_CNTR_MNF_LD.CONSIGNEE.field
    }
  ];

  const handleSelectVesselInfo = vessel => {
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
        return { ...item, REF_CONTAINER: containerInfo.ROWGUID };
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
    getAllUnit()
      .then(res => {
        setUnit(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getItemType();
    getUnit();
  }, []);

  const handleFileUpload = fileData => {
    let col = colDefs
      .filter(item => item.field)
      .map(item => {
        return { field: item.field, headerName: item.headerName };
      });
    const rowDataFileUpload = mapKeysFileUpload(fileData, col);
    setRowData(rowDataFileUpload);
  };

  function mapKeysFileUpload(data, colDefs) {
    const headerToFieldMap = {};
    colDefs.forEach(colDef => {
      headerToFieldMap[colDef.headerName] = colDef.field;
    });
    return data.map(item => {
      const newItem = {};
      Object.keys(item).forEach(key => {
        if (headerToFieldMap[key]) {
          newItem[headerToFieldMap[key]] = item[key];
        }
      });
      return { ...newItem, status: "insert", key: uuidv4() };
    });
  }

  return (
    <Section>
      <Section.Header className="grid space-y-4">
        <span className="grid grid-cols-3 gap-3">
          {vesselFilter.map(item => (
            <div key={item.field} className="space-y-2">
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
            <div key={item.field} className="space-y-2">
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
            <BtnExportExcel gridRef={gridRef} />
            <BtnImportExcel onFileUpload={handleFileUpload} />
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
