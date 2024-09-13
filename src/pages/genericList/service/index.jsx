import { createAndUpdateMethod, deleteMethod, getAllMethod } from "@/apis/method.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  DateTimeByTextRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { bs_method } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useRef, useState } from "react";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";

export function Service() {
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
      cellClass: params => {
        return params.data.METHOD_CODE !== "NK" &&
          params.data.METHOD_CODE !== "XK" &&
          params.data.METHOD_CODE !== "LK"
          ? null
          : "bg-gray-100";
      },
      headerName: BS_METHOD.METHOD_CODE.headerName,
      field: BS_METHOD.METHOD_CODE.field,
      flex: 1,
      filter: true,
      onCellValueChanged: UpperCase,
      editable: OnlyEditWithInsertCell
    },
    {
      cellClass: params => {
        return params.data.METHOD_CODE !== "NK" &&
          params.data.METHOD_CODE !== "XK" &&
          params.data.METHOD_CODE !== "LK"
          ? null
          : "bg-gray-100";
      },
      headerName: BS_METHOD.METHOD_NAME.headerName,
      field: BS_METHOD.METHOD_NAME.field,
      flex: 1,
      filter: true,
      editable: params =>
        params.data.METHOD_CODE !== "NK" &&
        params.data.METHOD_CODE !== "XK" &&
        params.data.METHOD_CODE !== "LK"
    },
    // {
    //   cellClass: params => {
    //     return params.data.METHOD_CODE !== "NK" &&
    //       params.data.METHOD_CODE !== "XK" &&
    //       params.data.METHOD_CODE !== "LK"
    //       ? null
    //       : "bg-gray-100";
    //   },
    //   headerName: BS_METHOD.IS_IN_OUT.headerName,
    //   field: BS_METHOD.IS_IN_OUT.field,
    //   flex: 1,
    //   cellRenderer: IsInOutRender
    // },
    {
      cellClass: params => {
        return params.data.METHOD_CODE !== "NK" &&
          params.data.METHOD_CODE !== "XK" &&
          params.data.METHOD_CODE !== "LK"
          ? null
          : "bg-gray-100";
      },
      headerName: BS_METHOD.IS_SERVICE.headerName,
      field: BS_METHOD.IS_SERVICE.field,
      headerClass: "center-header",
      cellStyle: {
        justifyContent: "center",
        display: "flex"
      },
      flex: 1,
      editable: params =>
        params.data.METHOD_CODE !== "NK" &&
        params.data.METHOD_CODE !== "XK" &&
        params.data.METHOD_CODE !== "LK",
      cellEditor: "agCheckboxCellEditor",
      cellRenderer: "agCheckboxCellRenderer"
    },
    {
      cellClass: params => {
        return params.data.METHOD_CODE !== "NK" &&
          params.data.METHOD_CODE !== "XK" &&
          params.data.METHOD_CODE !== "LK"
          ? null
          : "bg-gray-100";
      },
      headerName: BS_METHOD.UPDATED_AT.headerName,
      field: BS_METHOD.UPDATED_AT.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    if (insertAndUpdateData.insert.length > 0) {
      insertAndUpdateData.insert = insertAndUpdateData.insert.map(item => {
        return { ...item, IS_IN_OUT: "I" };
      });
    }
    if (insertAndUpdateData.update.length > 0) {
      insertAndUpdateData.update = insertAndUpdateData.update.map(item => {
        return { ...item, IS_IN_OUT: "I" };
      });
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
    const idsToMove = ["NK", "XK", "LK"];
    getAllMethod()
      .then(res => {
        res.data.metadata.sort((a, b) => {
          if (idsToMove.includes(a.METHOD_CODE) && idsToMove.includes(b.METHOD_CODE)) {
            return idsToMove.indexOf(a.METHOD_CODE) - idsToMove.indexOf(b.METHOD_CODE);
          }
          if (idsToMove.includes(a.METHOD_CODE)) {
            return -1;
          }
          if (idsToMove.includes(b.METHOD_CODE)) {
            return 1;
          }
          return 0;
        });
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
        <LayoutTool>
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
        <Section.Table>
          <AgGrid
            isRowSelectable={params => {
              return (
                params.data.METHOD_CODE !== "NK" &&
                params.data.METHOD_CODE !== "XK" &&
                params.data.METHOD_CODE !== "LK"
              );
            }}
            // showCountRowSelected={true}
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
      </Section.Content>
    </Section>
  );
}
