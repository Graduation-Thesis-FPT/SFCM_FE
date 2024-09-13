import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { Section } from "@/components/common/section";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useEffect, useRef, useState } from "react";
import { GrantPermission } from "@/components/common/grant-permission";
import { actionGrantPermission } from "@/constants";
import { createBlock, deleteBlock, getBlock } from "@/apis/block.api";
import { useCustomToast } from "@/components/common/custom-toast";
import { getAllWarehouse } from "@/apis/warehouse.api";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { bs_block } from "@/components/common/aggridreact/dbColumns";
import {
  OnlyEditWithInsertCell,
  WarehouseCodeRender
} from "@/components/common/aggridreact/cellRender";
import { DisplayCell } from "./displayCell";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { Label } from "@/components/common/ui/label";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";

export function WarehouseDesign() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [displayType, setDisplayType] = useState("table");
  const [filterData, setFilterData] = useState({
    warehouseID: "",
    blockID: "all"
  });
  const dispatch = useDispatch();
  const BS_BLOCK = new bs_block();

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
      headerName: BS_BLOCK.ID.headerName,
      field: BS_BLOCK.ID.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      onCellValueChanged: UpperCase
    },
    {
      headerName: BS_BLOCK.NAME.headerName,
      field: BS_BLOCK.NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_BLOCK.WAREHOUSE_ID.headerName,
      field: BS_BLOCK.WAREHOUSE_ID.field,
      flex: 1,
      filter: true,
      cellRenderer: params => WarehouseCodeRender(params, warehouses)
    },
    {
      headerName: BS_BLOCK.TOTAL_TIERS.headerName,
      field: BS_BLOCK.TOTAL_TIERS.field,
      cellDataType: "number",
      flex: 1,
      cellEditorParams: {
        min: 0,
        max: 100
      },
      editable: true
    },
    {
      headerName: BS_BLOCK.TOTAL_CELLS.headerName,
      field: BS_BLOCK.TOTAL_CELLS.field,
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 10000
      },
      flex: 1,
      editable: true
    },
    {
      headerName: "Diện tích",
      headerClass: "center-header",
      children: [
        {
          headerName: BS_BLOCK.BLOCK_LENGTH.headerName,
          field: BS_BLOCK.BLOCK_LENGTH.field,
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 10000
          },
          headerClass: " center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: true
        },
        {
          headerName: BS_BLOCK.BLOCK_WIDTH.headerName,
          field: BS_BLOCK.BLOCK_WIDTH.field,
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: " center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: true
        },
        {
          headerName: BS_BLOCK.BLOCK_HEIGHT.headerName,
          field: BS_BLOCK.BLOCK_HEIGHT.field,
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: " center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: true
        }
      ]
    }
  ];

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    let { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }
    dispatch(setGlobalLoading(true));
    createBlock(insertAndUpdateData)
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
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(selectedRows, rowData, "ID");
    dispatch(setGlobalLoading(true));
    deleteBlock(deleteIdList)
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
    getBlock()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getAllWarehouse()
      .then(res => {
        setWarehouses(res.data.metadata);
        setFilterData(prevState => ({
          ...prevState,
          warehouseID: res.data.metadata[0]?.ID
        }));
      })
      .catch(err => {
        toast.error(err);
      });
  }, []);

  return (
    <Section>
      <Section.Header title="Danh sách các dãy (block)" />
      <Section.Content>
        <div className="flex justify-between gap-1">
          {displayType === "table" ? (
            <div></div>
          ) : (
            <span className="flex gap-x-3">
              <span>
                <div className="mb-2 text-xs font-medium">Mã kho</div>
                <Select
                  onValueChange={value => {
                    setFilterData({
                      blockID: "all",
                      warehouseID: value
                    });
                  }}
                  value={filterData.warehouseID}
                >
                  <SelectTrigger className="h-[36px] w-[122px]">
                    <SelectValue placeholder="Mã kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.ID} value={warehouse.ID}>
                          {warehouse.ID}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>

              <span>
                <div className="mb-2 text-xs font-medium">Mã dãy</div>
                <Select
                  onValueChange={value => {
                    setFilterData(prevState => ({
                      ...prevState,
                      blockID: value
                    }));
                  }}
                  value={filterData.blockID}
                >
                  <SelectTrigger className="h-[36px] w-[122px]">
                    <SelectValue placeholder="Mã dãy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {rowData
                        .filter(block => block.WAREHOUSE_ID === filterData.warehouseID)
                        .sort((a, b) => a.ID.localeCompare(b.ID))
                        .map(block => (
                          <SelectItem key={block.ID} value={block.ID}>
                            {block.ID}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </span>
            </span>
          )}
          <span className="flex gap-x-4">
            {displayType === "table" ? (
              <LayoutTool>
                <GrantPermission action={actionGrantPermission.CREATE}>
                  <BtnAddRow onAddRow={handleAddRow} />
                </GrantPermission>
                <GrantPermission action={actionGrantPermission.UPDATE}>
                  <BtnSave onClick={handleSaveRows} />
                </GrantPermission>
              </LayoutTool>
            ) : null}

            <span>
              <Label>Hiển thị</Label>
              <Select
                onValueChange={value => {
                  setDisplayType(value);
                }}
                defaultValue={displayType}
              >
                <SelectTrigger className="h-[36px] min-w-[122px]">
                  <SelectValue placeholder="Hiển thị" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="table">Dạng bảng</SelectItem>
                    <SelectItem value="block">Dạng khối</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </span>
          </span>
        </div>
        {displayType === "table" ? (
          <Section.Table>
            <AgGrid
              showCountRowSelected={true}
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
              onGridReady={() => {
                gridRef.current.api.showLoadingOverlay();
                getRowData();
              }}
            />
          </Section.Table>
        ) : (
          <DisplayCell blockList={rowData} warehouses={warehouses} filterData={filterData} />
        )}
      </Section.Content>
    </Section>
  );
}
