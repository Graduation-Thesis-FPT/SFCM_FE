import { getAllCustomerType } from "@/apis/customer-type.api";
import { createAndUpdateCustomer, deleteCustomer, getAllCustomer } from "@/apis/customer.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import {
  CustomerTypeRender,
  DateTimeByTextRender,
  OnlyEditWithInsertCell
} from "@/components/common/aggridreact/cellRender";
import { bs_customer } from "@/components/common/aggridreact/dbColumns";
import { BtnAddRow } from "@/components/common/aggridreact/tableTools/BtnAddRow";
import { BtnSave } from "@/components/common/aggridreact/tableTools/BtnSave";
import { LayoutTool } from "@/components/common/aggridreact/tableTools/LayoutTool";
import { GrantPermission } from "@/components/common/grant-permission";
import { useCustomToast } from "@/components/common/custom-toast";
import { SearchInput } from "@/components/common/search";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { fnAddRowsVer2, fnDeleteRows, fnFilterInsertAndUpdateData } from "@/lib/fnTable";
import { useEffect, useMemo, useRef, useState } from "react";

export function CustomerList() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const BS_CUSTOMER = new bs_customer();
  const [allCustomerType, setAllCustomerType] = useState([]);

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
      editable: true,
      editable: OnlyEditWithInsertCell
    },
    {
      headerName: BS_CUSTOMER.CUSTOMER_TYPE_CODE.headerName,
      field: BS_CUSTOMER.CUSTOMER_TYPE_CODE.field,
      flex: 1,
      filter: true,
      editable: true,
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
      headerName: BS_CUSTOMER.TAX_CODE.headerName,
      field: BS_CUSTOMER.TAX_CODE.field,
      flex: 1,
      filter: true,
      editable: true
    },
    {
      headerName: BS_CUSTOMER.EMAIL.headerName,
      field: BS_CUSTOMER.EMAIL.field,
      cellDataType: "email",
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
    },
    {
      headerName: BS_CUSTOMER.ADDRESS.headerName,
      field: BS_CUSTOMER.ADDRESS.field,
      flex: 1,
      filter: true,
      editable: true
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
    createAndUpdateCustomer(insertAndUpdateData)
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
      "CUSTOMER_CODE"
    );

    deleteCustomer(deleteIdList)
      .then(res => {
        toast.success(res);
        setRowData(newRowDataAfterDeleted);
      })
      .catch(err => {
        toast.error(err);
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

  useEffect(() => {
    getAllCustomerType()
      .then(res => {
        setAllCustomerType(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      });
  }, []);

  return (
    <Section>
      <Section.Header title="Danh sách loại khách hàng"></Section.Header>
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
            return item.CUSTOMER_TYPE_CODE?.toLowerCase().includes(searchData.toLowerCase());
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
