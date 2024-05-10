import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { fnAddKey, fnAddRows, fnDeleteRows } from "@/lib/fnTable";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { BtnDeleteRow } from "@/components/aggridreact/BtnDeleteRow";
import { BtnSave } from "@/components/aggridreact/BtnSave";
import { BtnCreateAccount } from "./BtnCreateAccount";
import { FormCreateAccount } from "./FormCreateAccount";
import { PlusCircle, Rss, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import moment from "moment";

let data = [
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 1,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  },
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 1,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  },
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 0,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  },
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 1,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  },
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 0,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  },
  {
    ROLE_NAME: "Thủ quỹ",
    USER_NAME: "abc123",
    FULL_NAME: "Nguyễn Văn A",
    BIRTHDAY: "2024-05-06 15:19:39.253",
    ADDRESS: "",
    TELPHONE: "0999999999",
    EMAIL: "",
    IS_ACTIVE: 1,
    REMARK: "",
    CREATE_BY: "sql",
    CREATE_DATE: "2024-05-06 15:19:39.253",
    UPDATE_BY: "sql",
    UPDATE_DATE: "2024-05-06 15:19:39.253"
  }
];

export function User() {
  const ref = useRef(null);
  const refSheet = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const colDefs = [
    { field: "USER_NAME", headerName: "Tài khoản", flex: 1 },
    { field: "FULL_NAME", headerName: "Họ và tên", flex: 1 },
    { field: "TELPHONE", headerName: "Số điện thoại", flex: 1 },
    { field: "ROLE_NAME", headerName: "Chức vụ", flex: 1 },
    {
      field: "IS_ACTIVE",
      minWidth: 120,
      maxWidth: 120,
      headerName: "Trạng thái",
      cellRenderer: params => {
        if (params.value === 1) {
          return (
            <Button className="h-[70%] w-full cursor-default rounded-[6px] bg-green-100 font-medium text-green-800 hover:bg-green-100">
              Hoạt động
            </Button>
          );
        }
        return (
          <Button className="h-[70%] w-full cursor-default rounded-[6px] bg-red-100 font-medium text-red-800 hover:bg-red-100">
            Dừng
          </Button>
        );
      }
    },
    {
      field: "UPDATE_DATE",
      headerName: "Ngày chỉnh sửa",
      flex: 1,
      cellRenderer: params => {
        return params.value ? moment(params.value).utc().format("DD/MM/YYYY") : "";
      }
    },

    // { field: "BIRTHDAY", headerName: "Ngày sinh" },
    // { field: "ADDRESS", headerName: "Địa chỉ" },
    // { field: "EMAIL", headerName: "Email" },
    // { field: "REMARK", headerName: "Ghi chú" },
    // { field: "CREATE_BY", headerName: "Người tạo", editable: false },
    // { field: "CREATE_DATE", headerName: "Ngày tạo", editable: false },
    // { field: "UPDATE_BY", headerName: "Người cập nhật", editable: false },
    {
      field: "#",
      headerName: "Xem",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
      // headerClass: "center-header",
      cellRenderer: () => {
        return <Rss className="size-4 cursor-pointer" />;
      }
    }
  ];

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
      <div className="mb-2 flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">Danh sách người dùng</div>
        <Button
          onClick={() => {
            setOpenForm(true);
          }}
          variant="blue"
        >
          <PlusCircle className="mr-2 size-5" />
          Tạo người dùng mới
        </Button>
      </div>
      <Separator />
      <div className="my-2 text-xs  font-medium ">Tìm kiếm</div>
      <div className="relative mb-6 flex">
        <Search className="absolute left-2.5 top-2.5 size-5 text-gray-400" />
        <Input
          type="search"
          placeholder="Nhập từ khóa..."
          className="mr-4 w-[416px] pl-8 text-black"
        />
        <Button>
          Tìm kiếm
          <Search className="ml-2 size-5" />
        </Button>
      </div>
      <AgGrid
        ref={ref}
        className="h-[500px]"
        rowData={rowData}
        colDefs={colDefs}
        setRowData={data => {
          setRowData(data);
        }}
      />
      <AgGrid
        ref={ref}
        className="h-[500px]"
        rowData={rowData}
        colDefs={colDefs}
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
