import { deleteUserGroup, getAllUserGroup } from "@/apis/user-group.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { BtnAddRow } from "@/components/aggridreact/BtnAddRow";
import { BtnDeleteRow } from "@/components/aggridreact/BtnDeleteRow";
import { BtnSave } from "@/components/aggridreact/BtnSave";
import { useToast } from "@/components/ui/use-toast";
import { fnAddRows } from "@/lib/fnTable";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";

const colDefs = [
  { field: "ROLE_CODE", headerName: "Mã nhóm người dùng" },
  { field: "ROLE_NAME", headerName: "Tên nhóm người dùng" },
  {
    field: "CREATE_BY",
    headerName: "Người tạo",
    editable: false
  },
  {
    field: "CREATE_DATE",
    headerName: "Ngày tạo",
    editable: true,
    cellRenderer: params => {
      return moment(params.value).utc().format("DD/MM/YYYY HH:mm");
    }
  },
  { field: "UPDATE_BY", headerName: "Người cập nhật", editable: false },
  { field: "UPDATE_DATE", headerName: "Ngày cập nhật", editable: false }
];

export function Role() {
  const ref = useRef(null);
  const refBtnDelete = useRef(null);
  const [rowData, setRowData] = useState([]);
  const { toast } = useToast();

  const handleAddRows = numOfNewRow => {
    let temp = fnAddRows(numOfNewRow, rowData);
    setRowData(temp);
  };

  const handleSave = () => {
    let data = rowData.filter(row => row.status);
    console.log(data);
    if (data.length === 0) {
      toast({
        variant: "red",
        title: "Không có dữ liệu thay đổi"
      });
      return;
    }
  };

  const handleDeleteRow = () => {
    let selectedRows = ref.current.api.getSelectedRows();
    deleteUserGroup(selectedRows.map(row => row.ROWGUID))
      .then(res => {
        console.log("🚀 ~ handleDeleteRow ~ res:", res);
      })
      .catch(err => {
        toast({
          variant: "red",
          title: err.message
        });
      })
      .finally(() => {
        refBtnDelete.current.handleCloseDialog();
      });
  };

  useEffect(() => {
    getAllUserGroup()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast({
          variant: "red",
          title: err.message
        });
      });
  }, []);

  return (
    <>
      <div className="mb-2 flex justify-end gap-2">
        <BtnDeleteRow ref={refBtnDelete} deleteRow={handleDeleteRow} />
        <BtnAddRow
          onAddRows={num => {
            handleAddRows(num);
          }}
        />
        <BtnSave onClick={handleSave} />
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
    </>
  );
}
