import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { SearchInput } from "@/components/common/search";
import { Section } from "@/components/common/section";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/common/ui/select";
import { fnAddRows, fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
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

export function WarehouseDesign() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [displayType, setDisplayType] = useState("table");
  const [filterData, setFilterData] = useState({
    warehouseCode: "",
    blockName: "all"
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
      headerName: BS_BLOCK.WAREHOUSE_CODE.headerName,
      field: BS_BLOCK.WAREHOUSE_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      cellRenderer: params => WarehouseCodeRender(params, warehouses)

      // cellEditor: "agSelectCellEditor",
      // cellEditorParams: {
      //   values: warehouses.map(item => item.WAREHOUSE_CODE)
      // }
    },
    {
      headerName: BS_BLOCK.BLOCK_CODE.headerName,
      field: BS_BLOCK.BLOCK_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_BLOCK.BLOCK_NAME.headerName,
      field: BS_BLOCK.BLOCK_NAME.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_BLOCK.TIER_COUNT.headerName,
      field: BS_BLOCK.TIER_COUNT.field,
      cellDataType: "number",
      flex: 1,
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_BLOCK.SLOT_COUNT.headerName,
      field: BS_BLOCK.SLOT_COUNT.field,
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 1000
      },
      flex: 1,
      editable: OnlyEditWithInsertCell
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
            max: 1000
          },
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: OnlyEditWithInsertCell
        },
        {
          headerName: BS_BLOCK.BLOCK_WIDTH.headerName,
          field: BS_BLOCK.BLOCK_WIDTH.field,
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: OnlyEditWithInsertCell
        },
        {
          headerName: BS_BLOCK.BLOCK_HEIGHT.headerName,
          field: BS_BLOCK.BLOCK_HEIGHT.field,
          cellDataType: "number",
          cellEditorParams: {
            min: 0,
            max: 1000
          },
          headerClass: "hidden-border center-header",
          cellStyle: { textAlign: "center" },
          flex: 1,
          editable: OnlyEditWithInsertCell
        }
      ]
    }
  ];

  const handleSearch = value => {};

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    dispatch(setGlobalLoading(true));
    let { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);
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
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      selectedRows,
      rowData,
      "BLOCK_CODE"
    );
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
          warehouseCode: res.data.metadata[0].WAREHOUSE_CODE
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
        <div className="flex justify-between">
          {displayType === "table" ? (
            <SearchInput handleSearch={value => handleSearch(value)} />
          ) : (
            <span className="flex gap-x-3">
              <span>
                <div className="mb-2 text-xs font-medium">Mã kho</div>
                <Select
                  onValueChange={value => {
                    setFilterData({
                      blockName: "all",
                      warehouseCode: value
                    });
                  }}
                  value={filterData.warehouseCode}
                >
                  <SelectTrigger className="h-[36px] w-[122px]">
                    <SelectValue placeholder="Mã kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.WAREHOUSE_CODE} value={warehouse.WAREHOUSE_CODE}>
                          {warehouse.WAREHOUSE_CODE}
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
                      blockName: value
                    }));
                  }}
                  value={filterData.blockName}
                >
                  <SelectTrigger className="h-[36px] w-[122px]">
                    <SelectValue placeholder="Mã dãy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">Tất cả</SelectItem>
                      {rowData
                        .filter(block => block.WAREHOUSE_CODE === filterData.warehouseCode)
                        .sort((a, b) => a.BLOCK_CODE.localeCompare(b.BLOCK_CODE))
                        .map(block => (
                          <SelectItem key={block.BLOCK_CODE} value={block.BLOCK_CODE}>
                            {block.BLOCK_CODE}
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
              <div className="mb-2 text-xs font-medium">Hiển thị</div>
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
              handleDeleteRows(selectedRows);
            }}
            onGridReady={() => {
              gridRef.current.api.showLoadingOverlay();
              getRowData();
            }}
          />
        ) : (
          <DisplayCell blockList={rowData} warehouses={warehouses} filterData={filterData} />
        )}
      </Section.Content>
    </Section>
  );
}
