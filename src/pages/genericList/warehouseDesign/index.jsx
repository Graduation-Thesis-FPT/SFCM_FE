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
import { createBlock, deleteBlock, getBlock } from "@/apis/block.api";
import { useCustomToast } from "@/components/custom-toast";

let wareHouses = [
  { WAREHOUSE_CODE: "SFCM", WAREHOUSE_NAME: "SFCM" },
  { WAREHOUSE_CODE: "CFS", WAREHOUSE_NAME: "CFS" }
];

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
      headerName: "Mã kho *",
      field: "WAREHOUSE_CODE",
      flex: 1,
      filter: true,
      editable: params => (params.data.ROWGUID ? false : true),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: wareHouses.map(item => item.WAREHOUSE_CODE)
      }
    },
    {
      headerName: "Mã dãy *",
      field: "BLOCK_NAME",
      flex: 1,
      filter: true,
      editable: params => (params.data.ROWGUID ? false : true)
    },
    {
      headerName: "Số tầng",
      field: "TIER_COUNT",
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      flex: 1,
      editable: params => (params.data.ROWGUID ? false : true)
    },
    {
      headerName: "Số ô từng tầng",
      field: "SLOT_COUNT",
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      flex: 1,
      editable: params => (params.data.ROWGUID ? false : true)
    },
    {
      headerName: "Diện tích",
      headerClass: "center-header",
      children: [
        {
          headerName: "Dài (m)",
          field: "BLOCK_HEIGHT",
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 0.5,
          editable: params => (params.data.ROWGUID ? false : true)
        },
        {
          headerName: "Rộng (m)",
          field: "BLOCK_WIDTH",
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 0.5,
          editable: params => (params.data.ROWGUID ? false : true)
        }
      ]
    },
    {
      flex: 0.5,
      cellRenderer: params => {
        if (!params.data.ROWGUID) return null;
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

  const columnsRequired = ["WAREHOUSE_CODE", "BLOCK_NAME"];

  const validatePrice = params => {
    console.log(params);
  };
  const handleSearch = value => {};

  //delete data in table
  const handleDeleteRow = selectedRows => {
    let rowTemps = [];
    let liseIdDetele = [];
    selectedRows.forEach(item => {
      if (item.key) {
        rowTemps.push(item.key);
      } else {
        liseIdDetele.push(item.ROWGUID);
      }
    });

    if (rowTemps.length > 0 && liseIdDetele.length === 0) {
      let newRowData = [...rowData].filter(row => !rowTemps.includes(row.key));
      setRowData(newRowData);
      return;
    }

    deleteBlock(liseIdDetele)
      .then(resDelete => {
        getBlock()
          .then(res => {
            toast.success(resDelete);
            setRowData(res.data.metadata);
          })
          .catch(err => {
            toast.error("Lỗi không xác định");
          });
      })
      .catch(err => {
        toast.error(err);
      });
  };

  //delete data in detail
  const handleDeleteData = deteleData => {
    let newRowData = fnDeleteRows(deteleData, rowData);
    setRowData(newRowData);
  };

  const handleAddRow = () => {
    let newRowData = fnAddRows(rowData);
    setRowData(newRowData);
  };

  const handleCreateData = newRows => {
    setRowData(prevRowData => [...newRows, ...prevRowData]);
  };

  const validationData = data => {
    const gridApi = gridRef.current.api;
    data.map(item => {
      gridApi.forEachNode(node => {
        const rowNode = gridApi.getDisplayedRowAtIndex(node.id);
        if (item.key === node.data.key) {
          columnsRequired.map(column => {
            if (!item[column]) {
              gridApi.flashCells({
                rowNodes: [rowNode],
                columns: [column],
                flashDuration: 3000
              });
            }
          });
        }
      });
    });
  };

  const handleSave = () => {
    let data = [...rowData];
    let dataSave = data.filter(item => item.status === "update" || item.status === "create");

    if (dataSave.length === 0) {
      toast.error("Không có dữ liệu cần cập nhật");
      return;
    }

    validationData(dataSave);

    let finalDataSave = dataSave.map(item => {
      let { key, status, ...data } = item;
      return data;
    });

    createBlock(finalDataSave)
      .then(res => {
        getBlock().then(res => {
          setRowData(res.data.metadata);
        });
        toast.success(res);
      })
      .catch(err => {
        toast.error(err);
      });
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
                  <BtnSave onClick={handleSave} />
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
          onDeleteRow={selectedRows => {
            handleDeleteRow(selectedRows);
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
        onDeleteData={deteleData => {
          handleDeleteData(deteleData);
        }}
      />
      <Create
        onOpenChange={() => setOpenCreate(false)}
        open={openCreate}
        onCreateData={newRows => {
          handleCreateData(newRows);
        }}
      />
    </Section>
  );
}
