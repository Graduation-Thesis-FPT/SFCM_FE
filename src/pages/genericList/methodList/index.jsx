import { createAndUpdateMethod, deleteMethod, getAllMethod } from "@/apis/method.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  IsInOutRender,
  OnlyEditWithInsertCell
} from "@/components/aggridreact/cellRender";
import { bs_method } from "@/components/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/aggridreact/tableTools/BtnSave";
import { GrantPermission } from "@/components/common";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useRef, useState } from "react";

export function MethodList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const BS_METHOD = new bs_method();

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
      headerName: BS_METHOD.METHOD_CODE.headerName,
      field: BS_METHOD.METHOD_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell
    },

    {
      headerName: BS_METHOD.METHOD_NAME.headerName,
      field: BS_METHOD.METHOD_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_METHOD.IS_IN_OUT.headerName,
      field: BS_METHOD.IS_IN_OUT.field,
      flex: 1,
      filter: true,
      editable: true,
      cellRenderer: IsInOutRender
    },
    {
      headerName: BS_METHOD.IS_SERVICE.headerName,
      field: BS_METHOD.IS_SERVICE.field,
      headerClass: "center-header",
      cellStyle: {
        justifyContent: "center",
        display: "flex"
      },
      flex: 1,
      editable: true,
      cellEditor: "agCheckboxCellEditor",
      cellRenderer: "agCheckboxCellRenderer"
    },
    {
      headerName: BS_METHOD.UPDATE_DATE.headerName,
      field: BS_METHOD.UPDATE_DATE.field,
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
      toast.error("Không có dữ liệu thay đổi để lưu");
      return;
    }
    createAndUpdateMethod(insertAndUpdateData)
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
      "METHOD_CODE"
    );

    deleteMethod(deleteIdList)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const getRowData = () => {
    getAllMethod()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <Section>
      <Section.Header title="Danh sách phương án"></Section.Header>
      <Section.Content>
        <span className="flex justify-between">
          <SearchInput
            handleSearch={value => {
              setSearchData(value);
            }}
          />
          <span>
            <div className="mb-2 text-xs font-medium">Công cụ</div>
            <div className="flex h-[36px] items-center gap-x-3 rounded-md bg-gray-100 px-3">
              <GrantPermission action={actionGrantPermission.CREATE}>
                <BtnAddRow onAddRow={handleAddRow} />
              </GrantPermission>
              <GrantPermission action={actionGrantPermission.UPDATE}>
                <BtnSave onClick={handleSaveRows} />
              </GrantPermission>
            </div>
          </span>
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
