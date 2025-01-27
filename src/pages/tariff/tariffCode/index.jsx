import {
  createAndUpdateTariffCode,
  deleteTariffCode,
  getAllTariffCode
} from "@/apis/trf-codes.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";
import {
  DateTimeByTextRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { trf_codes } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnExportExcel } from "@/components/common/aggridreact/tableTools/BtnExportExcel";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { checkTariffCode } from "@/lib/validation/checkTariffCode";
import { ErrorWithDetail } from "@/components/common/custom-toast/ErrorWithDetail";

export function TariffCode() {
  const [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const dispatch = useDispatch();
  const toast = useCustomToast();
  const TRF_CODES = new trf_codes();
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
      headerName: TRF_CODES.TRF_CODE.headerName,
      field: TRF_CODES.TRF_CODE.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      onCellValueChanged: UpperCase
    },
    {
      headerName: TRF_CODES.TRF_DESC.headerName,
      field: TRF_CODES.TRF_DESC.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: TRF_CODES.UPDATED_AT.headerName,
      field: TRF_CODES.UPDATED_AT.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    }
  ];

  const handleAddRow = () => {
    const newRow = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRow);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      toast.warning("Không có dữ liệu thay đổi");
      return;
    }

    const { isValid, mess } = checkTariffCode(gridRef);
    if (!isValid) {
      toast.errorWithDetail(<ErrorWithDetail mess={mess} />);
      return;
    }

    dispatch(setGlobalLoading(true));
    createAndUpdateTariffCode(insertAndUpdateData)
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
      "TRF_CODE"
    );
    dispatch(setGlobalLoading(true));
    deleteTariffCode(deleteIdList)
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
    getAllTariffCode()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  return (
    <Section>
      <Section.Header title="Mã biểu cước"></Section.Header>
      <Section.Content>
        <LayoutTool>
          <BtnExportExcel gridRef={gridRef} />
          <GrantPermission action={actionGrantPermission.CREATE}>
            <BtnAddRow onAddRow={handleAddRow} />
          </GrantPermission>
          <GrantPermission action={actionGrantPermission.UPDATE}>
            <BtnSave onClick={handleSaveRows} />
          </GrantPermission>
        </LayoutTool>
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
      </Section.Content>
    </Section>
  );
}
