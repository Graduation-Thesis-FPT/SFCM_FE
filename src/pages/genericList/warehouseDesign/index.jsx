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
import { fnAddRows, fnDeleteRows } from "@/lib/fnTable";
import { PlusCircle } from "lucide-react";
import { useRef, useState } from "react";
import { DetailWarehouseDesign } from "./DetailWarehouseDesign";
import { Create } from "./Create";
import { GrantPermission } from "@/components/common";
import { actionGrantPermission } from "@/constants";
import { deleteBlock, getBlock } from "@/apis/block.api";
import { useCustomToast } from "@/components/custom-toast";

export function WarehouseDesign() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [openOpenDetailWareHouseDesign, setOpenDetailWareHouseDesign] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
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
      field: "WAREHOUSE_CODE",
      headerName: "Kho",
      flex: 1,
      filter: true,
      editable: true
    },
    { field: "BLOCK_NAME", headerName: "Mã dãy", flex: 1, filter: true, editable: true },
    { field: "TIER_COUNT", headerName: "Số tầng", flex: 1, editable: true },
    { field: "SLOT_COUNT", headerName: "Số ô từng tầng", editable: true },
    {
      headerName: "Diện tích",
      headerClass: "center-header",
      children: [
        {
          field: "BLOCK_HEIGHT",
          headerName: "Dài (m)",
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 0.5,
          editable: true
        },
        {
          field: "BLOCK_WIDTH",
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
        let { key, status, ...col } = params.data;
        if (Object.keys(col).length === 0) return null;
        return (
          <span
            onClick={() => {
              setDetailData(params.data);
              console.log("🚀 ~ ThietKeKho ~ params.data:", params.data);
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

  const handleDeleteRow = listId => {
    deleteBlock(listId)
      .then(res => {
        let newRowData = fnDeleteRows(listId, rowData);
        setRowData(newRowData);
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleAddRow = () => {
    let newRowData = fnAddRows(rowData);
    setRowData(newRowData);
  };

  return (
    <Section>
      <Section.Header title="Danh sách các dãy (block)">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <Button
            variant="blue"
            className="h-[42px]"
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            <PlusCircle className="mr-2 size-5" />
            Tạo dãy mới
          </Button>
        </GrantPermission>
      </Section.Header>

      <Section.Content>
        <div className="flex justify-between">
          <SearchInput handleSearch={value => handleSearch(value)} />
          <span className="flex gap-x-4">
            <span>
              <div className="mb-2 text-xs font-medium">Công cụ</div>
              <div className="flex h-[42px] items-center gap-x-3 rounded-md bg-gray-100 px-6">
                <GrantPermission action={actionGrantPermission.CREATE}>
                  <BtnAddRow onAddRow={handleAddRow} />
                </GrantPermission>
                <GrantPermission action={actionGrantPermission.UPDATE}>
                  <BtnSave />
                </GrantPermission>

                <BtnExcel />
              </div>
            </span>

            <span>
              <div className="mb-2 text-xs font-medium">Hiển thị</div>
              <Select defaultValue="table">
                <SelectTrigger className="h-[42px] w-[122px]">
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
          onDeleteRow={listId => {
            handleDeleteRow(listId);
          }}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            getBlock().then(res => {
              setRowData(res.data.metadata);
            });
          }}
        />
      </Section.Content>
      <DetailWarehouseDesign
        detailData={detailData}
        onOpenChange={() => setOpenDetailWareHouseDesign(false)}
        open={openOpenDetailWareHouseDesign}
      />
      <Create onOpenChange={() => setOpenCreate(false)} open={openCreate} />
    </Section>
  );
}
