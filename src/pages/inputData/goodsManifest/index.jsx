import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { useRef, useState } from "react";
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
import { fnAddRowsVer2 } from "@/lib/fnTable";

export function GoodsManifest() {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
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
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.COMMODITYDESCRIPTION.headerName,
      field: DT_PACKAGE_MNF_LD.COMMODITYDESCRIPTION.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.UNIT_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.UNIT_CODE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.CARGO_PIECE.headerName,
      field: DT_PACKAGE_MNF_LD.CARGO_PIECE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: DT_PACKAGE_MNF_LD.CBM.headerName,
      field: DT_PACKAGE_MNF_LD.CBM.field,
      flex: 1,
      filter: true,
      editable: true
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
    setVesselInfo(vessel);
    setOpenVesselInfoSelect(false);
    setOpenContainerInfoSelect(true);
  };
  const handleSelectContainerInfo = container => {
    setContainerInfo(container);
    setOpenContainerInfoSelect(false);
  };

  const handleAddRow = () => {
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };
  const handleSaveRows = () => {};
  return (
    <Section>
      <Section.Header className="flex items-end justify-between">
        <span className="space-y-2">
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
        </span>
        <Button
          variant="blue"
          onClick={() => {
            setOpenVesselInfoSelect(true);
          }}
        >
          Chọn tàu chuyến
        </Button>
      </Section.Header>
      <Section.Content>
        <span className="mb-[25px] flex justify-between">
          <div>{/* Sau này để cái gì đó vô đây */}</div>
          <LayoutTool>
            <BtnExportExcel gridRef={gridRef} />
            <GrantPermission action={actionGrantPermission.CREATE}>
              <BtnAddRow onAddRow={handleAddRow} />
            </GrantPermission>
            <GrantPermission action={actionGrantPermission.UPDATE}>
              <BtnSave onClick={handleSaveRows} />
            </GrantPermission>
          </LayoutTool>
        </span>

        <AgGrid
          contextMenu={true}
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          className="h-full"
          rowData={rowData}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRows(selectedRows);
          }}
        />
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
      />
    </Section>
  );
}
