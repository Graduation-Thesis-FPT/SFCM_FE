import { createAndUpdateConatinerTariff, getAllContainerTariff } from "@/apis/container-tariff";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";
import {
  CntrSztpRender,
  ContainerTariffStatusRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { container_tariff } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { useCustomToast } from "@/components/common/custom-toast";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Label } from "@/components/common/ui/label";
import { Switch } from "@/components/common/ui/switch";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { formatVnd } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

const CONTAINER_TARIFF = new container_tariff();

export function ContainerTariff() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
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
      headerName: CONTAINER_TARIFF.ID.headerName,
      field: CONTAINER_TARIFF.ID.field,
      flex: 1,
      filter: true,
      editable: OnlyEditWithInsertCell,
      onCellValueChanged: UpperCase
    },
    {
      headerName: CONTAINER_TARIFF.NAME.headerName,
      field: CONTAINER_TARIFF.NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: CONTAINER_TARIFF.CNTR_SIZE.headerName,
      field: CONTAINER_TARIFF.CNTR_SIZE.field,
      flex: 1,
      filter: true,
      cellRenderer: CntrSztpRender
    },

    {
      headerName: CONTAINER_TARIFF.VALID_FROM.headerName,
      field: CONTAINER_TARIFF.VALID_FROM.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "date"
    },
    {
      headerName: CONTAINER_TARIFF.VALID_UNTIL.headerName,
      field: CONTAINER_TARIFF.VALID_UNTIL.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "date"
    },
    {
      headerName: CONTAINER_TARIFF.VAT_RATE.headerName,
      field: CONTAINER_TARIFF.VAT_RATE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 100
      },
      headerClass: "number-header",
      cellClass: "text-end"
    },
    {
      headerName: CONTAINER_TARIFF.UNIT_PRICE.headerName,
      field: CONTAINER_TARIFF.UNIT_PRICE.field,
      flex: 1,
      filter: true,
      editable: true,
      cellDataType: "number",
      cellEditorParams: {
        min: 0,
        max: 1000000000
      },
      valueFormatter: params => {
        return formatVnd(params?.value ?? 0).replace("VND", "");
      },
      headerClass: "number-header",
      cellClass: "text-end"
    },
    {
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center",
        justifyContent: "center",
        display: "flex"
      },
      headerName: CONTAINER_TARIFF.STATUS.headerName,
      field: CONTAINER_TARIFF.STATUS.field,
      flex: 1,
      filter: true,
      cellRenderer: ContainerTariffStatusRender
    }
  ];

  const getRowData = () => {
    getAllContainerTariff()
      .then(res => {
        const data = res.data.metadata?.map(item => {
          return {
            ...item,
            VALID_FROM: new Date(item.VALID_FROM),
            VALID_UNTIL: new Date(item.VALID_UNTIL)
          };
        });
        setRowData(data);
      })
      .catch(err => {
        toast.error(err);
      });
  };

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
    createAndUpdateConatinerTariff(insertAndUpdateData)
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
    return toast.warning("Không thể xóa biểu cước đã lưu");
  };

  return (
    <Section>
      <Section.Header title="Danh sách biểu cước nhập kho">
        {/* <GrantPermission action={actionGrantPermission.CREATE}>
      <CustomerCreationForm revalidateCustomerList={revalidateCustomerList} />
    </GrantPermission> */}
      </Section.Header>
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
