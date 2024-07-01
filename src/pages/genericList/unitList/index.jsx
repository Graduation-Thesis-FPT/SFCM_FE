import { createAndUpdateUnit, deleteUnit, getAllUnit } from "@/apis/unit.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { bs_unit } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { useCustomToast } from "@/components/common/custom-toast";
import { SearchInput } from "@/components/common/search";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useRef, useState } from "react";

export function UnitList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const BS_UNIT = new bs_unit();

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
      headerName: BS_UNIT.UNIT_CODE.headerName,
      field: BS_UNIT.UNIT_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_UNIT.UNIT_NAME.headerName,
      field: BS_UNIT.UNIT_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_UNIT.UPDATE_DATE.headerName,
      field: BS_UNIT.UPDATE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];

  const [searchData, setSearchData] = useState("");

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData } = fnFilterInsertAndUpdateData(rowData);
    if (insertAndUpdateData.insert.length === 0 && insertAndUpdateData.update.length === 0) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }
    createAndUpdateUnit(insertAndUpdateData)
      .then(res => {
        toast.success(res);
        getRowData();
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleDeleteRows = selectedRows => {
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      selectedRows,
      rowData,
      "UNIT_CODE"
    );

    deleteUnit(deleteIdList)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getRowData = () => {
    getAllUnit()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <Section>
      <Section.Header title="Danh mục đơn vị tính"></Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <SearchInput
            handleSearch={value => {
              setSearchData(value);
            }}
          />
          <LayoutTool>
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
          className="h-[50vh]"
          rowData={rowData?.filter(item => {
            if (searchData === "") return item;
            return item.METHOD_CODE?.toLowerCase().includes(searchData.toLowerCase());
          })}
          colDefs={colDefs}
          onDeleteRow={selectedRows => {
            handleDeleteRows(selectedRows);
          }}
          onGridReady={() => {
            gridRef.current.api.showLoadingOverlay();
            getRowData();
          }}
        />
      </Section.Content>
    </Section>
  );
}
