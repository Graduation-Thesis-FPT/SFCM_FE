import AgGrid from "@/components/aggridreact/AgGrid";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fnAddKey } from "@/lib/fnTable";

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

export default function UserAccounts() {
  const [rowData, setRowData] = useState([]);

  const colDefs = [
    { field: "USER_GROUP_NAME", headerName: "Nhóm người dùng" },
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

  useEffect(() => {
    setRowData(fnAddKey(data));
  }, []);
  return (
    <>
      {/* <Button
        onClick={() => {
          console.log(rowData);
        }}
      >
        Log row Data
      </Button> */}
      <AgGrid
        className="h-[500px]"
        rowData={rowData}
        colDefs={colDefs}
        defaultColDef={true}
        onChangeRowData={data => {
          setRowData(data);
        }}
      />
    </>
  );
}
