import { AgGrid } from "@/components/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/aggridreact/BtnAddRow";
import { fnAddRows } from "@/lib/fnTable";
import React, { useRef, useState } from "react";
const colDefs = [
  { field: "USER_GROUP_CODE", headerName: "Mã nhóm người dùng" },
  { field: "USER_GROUP_NAME", headerName: "Tên nhóm người dùng" },
  { field: "CREATE_BY", headerName: "Người tạo", editable: false },
  { field: "CREATE_DATE", headerName: "Ngày tạo", editable: false },
  { field: "UPDATE_BY", headerName: "Người cập nhật", editable: false },
  { field: "UPDATE_DATE", headerName: "Ngày cập nhật", editable: false }
];

export default function UserGroups() {
  const ref = useRef(null);
  const [rowData, setRowData] = useState([]);

  const handleAddRows = numOfNewRow => {
    let temp = fnAddRows(numOfNewRow, rowData);
    setRowData(temp);
  };

  return (
    <>
      <BtnAddRow
        onAddRows={num => {
          handleAddRows(num);
        }}
      />
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
    </>
  );
}
