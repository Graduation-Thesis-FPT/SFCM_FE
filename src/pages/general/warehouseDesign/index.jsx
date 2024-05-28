import { AgGrid } from "@/components/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnExcel } from "@/components/aggridreact/tableTools/BtnExcel";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { fnAddRows } from "@/lib/fnTable";
import { PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { DetailWarehouseDesign } from "./DetailWarehouseDesign";

let data = [
  {
    ROWGUID: "1",
    WAREHOSE_CODE: "CFS",
    BLOCK: "A",
    TIER_COUNT: "1",
    SLOT_COUNT: "10",
    d: "1",
    r: "1"
  },
  {
    ROWGUID: "12",

    WAREHOSE_CODE: "CFS",
    BLOCK: "B",
    TIER_COUNT: "1",
    SLOT_COUNT: "20",
    d: "1",
    r: "1"
  },
  {
    ROWGUID: "13",
    WAREHOSE_CODE: "CFS",
    BLOCK: "C",
    TIER_COUNT: "1",
    SLOT_COUNT: "30",
    d: "1",
    r: "1"
  }
];

export function ThietKeKho() {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [openOpenDetailWareHouseDesign, setOpenDetailWareHouseDesign] = useState(false);
  const colDefs = [
    {
      cellStyle: { textAlign: "center", background: "rgb(249 250 251)" },
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      field: "WAREHOSE_CODE",
      headerName: "Kho",
      flex: 1,
      filter: true,
      editable: true
    },
    { field: "BLOCK", headerName: "Mã dãy", flex: 1, filter: true, editable: true },
    { field: "TIER_COUNT", headerName: "Số tầng", flex: 1, editable: true },
    { field: "SLOT_COUNT", headerName: "Số ô từng tầng", editable: true },
    {
      headerName: "Diện tích",
      headerClass: "center-header",
      children: [
        {
          field: "d",
          headerName: "Dài (m)",
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 0.5,
          editable: true
        },
        {
          field: "r",
          headerName: "Rộng (m)",
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 0.5,
          editable: true
        }
      ]
    },
    {
      flex: 0.5,
      cellRenderer: params => {
        return (
          <span
            onClick={() => {
              setDetailData(params.data);
              setOpenDetailWareHouseDesign(true);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Xem
          </span>
        );
      }
    }
  ];

  const handleSearch = value => {};

  const handleAddRow = () => {
    let newRowData = fnAddRows(rowData);
    setRowData(newRowData);
  };

  return (
    <Section>
      <Section.Header title="Danh sách các dãy (block)">
        <Button variant="blue" className="h-12" onClick={handleAddRow}>
          <PlusCircle className="mr-2 size-5" />
          Tạo dãy mới
        </Button>
      </Section.Header>

      <Section.Content>
        <div className="flex justify-between">
          <SearchInput handleSearch={value => handleSearch(value)} />
          <span className="flex gap-x-4">
            <span>
              <div className="mb-2 text-xs font-medium">Công cụ</div>
              <div className="flex h-12 items-center gap-x-3 rounded-md bg-gray-100 px-6">
                <BtnAddRow onAddRow={handleAddRow} />
                <BtnSave />
                <BtnExcel />
              </div>
            </span>

            <span>
              <div className="mb-2 text-xs font-medium">Hiển thị</div>
              <Select defaultValue="table">
                <SelectTrigger className="h-12 w-[122px]">
                  <SelectValue placeholder="Hiển thị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="table">Dạng bảng</SelectItem>
                    <SelectItem value="...">Dạng háng</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </span>
          </span>
        </div>
        <AgGrid
          contextMenu={true}
          setRowData={data => {
            setRowData(data);
          }}
          ref={gridRef}
          className="h-[50vh]"
          rowData={rowData}
          colDefs={colDefs}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            setRowData(data);
          }}
        />
      </Section.Content>
      <DetailWarehouseDesign
        detailData={detailData}
        onOpenChange={() => setOpenDetailWareHouseDesign(false)}
        open={openOpenDetailWareHouseDesign}
      />
    </Section>
  );
}
