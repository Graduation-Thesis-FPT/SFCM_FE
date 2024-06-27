import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  dt_cntr_mnf_ld,
  dt_package_mnf_ld,
  dt_vessel_visit
} from "@/components/common/aggridreact/dbColumns";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import { useRef, useState } from "react";
import { Input } from "@/components/common/ui/input";
import { Label } from "@/components/common/ui/label";
import { VesselInfoSelect } from "./VesselInfoSelect";
import { useCustomToast } from "@/components/common/custom-toast";
import { regexPattern } from "@/constants/regexPattern";

export function ImportOrder() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [vesselInfo, setVesselInfo] = useState({});
  const [openVesselInfoSelect, setOpenVesselInfoSelect] = useState(false);

  const [BILLOFLADING, setBILLOFLADING] = useState("");
  const [CNTRNO, setCNTRNO] = useState("");

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
      filter: true
      // cellRenderer: params => ItemTypeCodeRender(params, itemType)
    },
    {
      headerName: DT_PACKAGE_MNF_LD.UNIT_CODE.headerName,
      field: DT_PACKAGE_MNF_LD.UNIT_CODE.field,
      flex: 1,
      filter: true
      // cellRenderer: params => UnitCodeRender(params, unit)
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
  const handleSelectVesselInfo = vessel => {
    setRowData([]);
    setVesselInfo(vessel);
    setBILLOFLADING("");
    setOpenVesselInfoSelect(false);
  };

  const handleEnterBillOfLading = () => {
    if (!vesselInfo.VOYAGEKEY) {
      return;
    }
    let dataSend = { BILLOFLADING: BILLOFLADING, VOYAGEKEY: vesselInfo.VOYAGEKEY };
  };

  const handleEnterCntrNo = () => {
    if (!vesselInfo.VOYAGEKEY || !CNTRNO) {
      return;
    }
    if (!regexPattern.CNTRNO.test(CNTRNO)) {
      return toast.error("Số container không hợp lệ");
    }
    let dataSend = { BILLOFLADING: BILLOFLADING, VOYAGEKEY: vesselInfo.VOYAGEKEY };
  };

  return (
    <Section>
      <Section.Header className="space-y-4">
        <span className="grid grid-cols-3 gap-3">
          {vesselFilter.map(item => (
            <div key={item.field} className="space-y-2">
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
          <div className="space-y-2">
            <Label htmlFor="BILLOFLADING">Số Masterbill</Label>
            <Input
              id="BILLOFLADING"
              placeholder="Nhập số Masterbill"
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
          <div className="space-y-2">
            <Label htmlFor="CNTRNO">Số Container</Label>
            <Input
              id="CNTRNO"
              placeholder="Nhập số Container"
              value={CNTRNO}
              maxLength={10}
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
        </span>
      </Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <div>{/* Sau này để cái gì đó vô đây */}</div>
          <LayoutTool>
            <Button variant="green">Tiếp tục</Button>
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
    </Section>
  );
}
