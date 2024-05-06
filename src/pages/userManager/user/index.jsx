import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { fnAddKey, fnAddRows, fnDeleteRows } from "@/lib/fnTable";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/aggridreact/BtnAddRow";
import { BtnDeleteRow } from "@/components/aggridreact/BtnDeleteRow";
import { Loader, Loader2, Plus } from "lucide-react";
import { BtnSave } from "@/components/aggridreact/BtnSave";
import { BtnCreateAccount } from "./BtnCreateAccount";
import { FormCreateAccount } from "./FormCreateAccount";

let data = [
  {
    USER_GROUP_NAME: "Nhóm người dùng",
    USER_NAME: "Tên tài khoản",
    BIRTHDAY: "Ngày sinh",
    ADDRESS: "Địa chỉ",
    TELPHONE: "Số điện thoại",
    EMAIL: "Email",
    IS_ACTIVE: "Trạng thái",
    REMARK: "Ghi chú",
    CREATE_BY: "Người tạo",
    CREATE_DATE: "Ngày tạo",
    UPDATE_BY: "Người cập nhật",
    UPDATE_DATE: "Ngày cập nhật"
  }
];

const colDefs = [
  { field: "USER_GROUP_NAME", headerName: "Nhóm người dùng", flex: 1.5 },
  { field: "USER_NAME", headerName: "Tên tài khoản" },
  { field: "BIRTHDAY", headerName: "Ngày sinh" },
  { field: "ADDRESS", headerName: "Địa chỉ" },
  { field: "TELPHONE", headerName: "Số điện thoại" },
  { field: "EMAIL", headerName: "Email" },
  { field: "IS_ACTIVE", headerName: "Trạng thái" },
  { field: "REMARK", headerName: "Ghi chú" },
  { field: "CREATE_BY", headerName: "Người tạo", editable: false },
  { field: "CREATE_DATE", headerName: "Ngày tạo", editable: false },
  { field: "UPDATE_BY", headerName: "Người cập nhật", editable: false },
  { field: "UPDATE_DATE", headerName: "Ngày cập nhật", editable: false }
];
export default function User() {
  const ref = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const handleAddRows = numOfNewRow => {
    let temp = fnAddRows(numOfNewRow, rowData);
    setRowData(temp);
  };

  const handleDeleteRows = () => {
    let selectedRows = ref.current.api.getSelectedRows();
    setRowData(fnDeleteRows(selectedRows, rowData));
  };

  useEffect(() => {
    setRowData(fnAddKey(data));
  }, []);
  return (
    <>
      <div className="mb-2 flex justify-end gap-2">
        <BtnDeleteRow isLoading={isLoading} deleteRow={() => handleDeleteRows()} />
        <BtnCreateAccount
          onClick={() => {
            setOpenForm(true);
          }}
        />

        <BtnSave isLoading={isLoading} />
      </div>
      <AgGrid
        ref={ref}
        className="h-[500px]"
        rowData={rowData}
        colDefs={colDefs}
        defaultColDef={true}
        setRowData={data => {
          setRowData(data);
        }}
      />
      <FormCreateAccount
        open={openForm}
        setOpen={status => {
          setOpenForm(status);
        }}
      />
    </>
  );
}
