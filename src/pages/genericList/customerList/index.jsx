import { getAllCustomerType } from "@/apis/customer-type.api";
import { createAndUpdateCustomer, deleteCustomer, getAllCustomer } from "@/apis/customer.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  CustomerTypeRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { bs_customer } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useRef, useState } from "react";
import useFetchData from "@/hooks/useRefetchData";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { checkCustomerList } from "@/lib/validation/generic-list/checkCustomerList";
import { ErrorWithDetail } from "@/components/common/custom-toast/ErrorWithDetail";
import { BtnDownExcelCustomerSample } from "./btnDownExcelCustomerSample";
import { BtnImportExcel } from "./btnImportExcel";
import { UpperCase } from "@/components/common/aggridreact/cellFunction";

const BS_CUSTOMER = new bs_customer();

export function CustomerList() {
  const dispatch = useDispatch();
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const { data: allCustomerType } = useFetchData({ service: getAllCustomerType });

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
      headerName: BS_CUSTOMER.CUSTOMER_CODE.headerName,
      field: BS_CUSTOMER.CUSTOMER_CODE.field,
      flex: 1,
      filter: true,
      onCellValueChanged: UpperCase,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_CUSTOMER.CUSTOMER_TYPE_CODE.headerName,
      field: BS_CUSTOMER.CUSTOMER_TYPE_CODE.field,
      flex: 1,
      cellRenderer: params => CustomerTypeRender(params, allCustomerType)
    },
    {
      headerName: BS_CUSTOMER.CUSTOMER_NAME.headerName,
      field: BS_CUSTOMER.CUSTOMER_NAME.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      headerName: BS_CUSTOMER.TAX_CODE.headerName,
      field: BS_CUSTOMER.TAX_CODE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_CUSTOMER.EMAIL.headerName,
      field: BS_CUSTOMER.EMAIL.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_CUSTOMER.ADDRESS.headerName,
      field: BS_CUSTOMER.ADDRESS.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_CUSTOMER.IS_ACTIVE.headerName,
      field: BS_CUSTOMER.IS_ACTIVE.field,
      headerClass: "center-header",
      cellStyle: {
        justifyContent: "center",
        display: "flex"
      },
      flex: 1,
      editable: true,
      cellEditor: "agCheckboxCellEditor",
      cellRenderer: "agCheckboxCellRenderer"
    }
  ];

  const handleAddRow = () => {
    let newRowData = fnAddRowsVer2(rowData, colDefs);
    setRowData(newRowData);
  };

  const handleSaveRows = () => {
    const { insertAndUpdateData, isContinue } = fnFilterInsertAndUpdateData(rowData);
    if (!isContinue) {
      return toast.warning("Không có dữ liệu thay đổi");
    }

    const { isValid, mess } = checkCustomerList(gridRef);
    if (!isValid) {
      toast.errorWithDetail(<ErrorWithDetail mess={mess} />);
      return;
    }

    dispatch(setGlobalLoading(true));
    createAndUpdateCustomer(insertAndUpdateData)
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
    dispatch(setGlobalLoading(true));
    const { deleteIdList, newRowDataAfterDeleted } = fnDeleteRows(
      selectedRows,
      rowData,
      "CUSTOMER_CODE"
    );
    deleteCustomer(deleteIdList)
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
    getAllCustomer()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  };

  const handleFileUpload = rowDataFileUpload => {
    if (!rowDataFileUpload?.length) {
      toast.error("File excel không có dữ liệu");
      return;
    }
    const finalRowData = rowDataFileUpload?.map(item => {
      return {
        ...item,
        ADDRESS: item.ADDRESS?.toString()?.trim(),
        CUSTOMER_CODE: item.CUSTOMER_CODE?.toString()?.trim(),
        CUSTOMER_NAME: item.CUSTOMER_NAME?.toString()?.trim(),
        CUSTOMER_TYPE_CODE: item.CUSTOMER_TYPE_CODE?.toString()?.trim(),
        EMAIL: item.EMAIL?.toString()?.trim(),
        TAX_CODE: item.TAX_CODE?.toString()?.trim(),
        IS_ACTIVE: item?.IS_ACTIVE === "Không" ? false : true
      };
    });
    toast.success("Nhập file thành công");
    setRowData(finalRowData);
  };

  return (
    <Section>
      <Section.Header title="Danh sách khách hàng"></Section.Header>
      <Section.Content>
        <LayoutTool>
          <BtnDownExcelCustomerSample gridRef={gridRef} cusType={allCustomerType} />
          <BtnImportExcel gridRef={gridRef} onFileUpload={handleFileUpload} />

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
            ref={gridRef}
            rowData={rowData}
            colDefs={colDefs}
            setRowData={data => {
              setRowData(data);
            }}
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
