import AgGrid from "@/components/aggridreact/AgGrid";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getTest } from "@/apis/user.api";
import BtnAddRow from "@/components/BtnAddRow";

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

  const handleAddNewRow = num => {
    console.log("🚀 ~ handleAddNewRow ~ num:", num);
    let temp = [];
    colDefs.map(data => {
      temp[data.field] = "";
    });
    setRowData([temp, ...rowData]);
  };
  useEffect(() => {}, []);
  return (
    <>
      <Button
        onClick={() => {
          getTest()
            .then(data => {
              console.log(data);
            })
            .catch(err => {
              console.log(err);
            });
        }}
      >
        Test
      </Button>
      <BtnAddRow
        addNewRow={num => {
          handleAddNewRow(num);
        }}
      />
      <AgGrid rowData={rowData} colDefs={colDefs} defaultColDef={true} className="h-[500px]" />
    </>
  );
}
