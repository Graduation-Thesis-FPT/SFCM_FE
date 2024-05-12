import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { Rss, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import moment from "moment";
import { getAllUser } from "@/apis/user.api";
import { FormCreateAccount } from "./FormCreateAccount";
import { DetailUser } from "./DetailUser";
import { useCustomToast } from "@/components/custom-toast";
import { Section } from "@/components/section";

export function User() {
  const ref = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [openDetail, setOpenDetail] = useState(false);

  const colDefs = [
    {
      field: "USER_NAME",
      headerName: "Tài khoản",
      flex: 1
    },
    { field: "FULLNAME", headerName: "Họ và tên", flex: 1 },
    { field: "TELEPHONE", headerName: "Số điện thoại", flex: 1 },
    { field: "ROLE_CODE", headerName: "Chức vụ", flex: 1 },
    {
      field: "IS_ACTIVE",
      minWidth: 120,
      maxWidth: 120,
      headerName: "Trạng thái",
      cellRenderer: params => {
        if (params.value) {
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
        return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
      }
    },
    {
      field: "#",
      headerName: "Xem",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
      // headerClass: "center-header",
      cellRenderer: params => {
        return (
          <Rss
            onClick={() => {
              setDetailData(params.data);
              setTimeout(() => {
                setOpenDetail(true);
              }, 100);
            }}
            className="size-4 cursor-pointer"
          />
        );
      }
    }
  ];

  const handleUpdateUser = row => {
    let temp = [...rowData];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].ROWGUID === row.ROWGUID) {
        temp[i] = row;
        break;
      }
    }
    setRowData(temp);
  };

  const handleCreateUser = newAccount => {
    let temp = [...rowData];
    temp.unshift(newAccount);
    setRowData(temp);
  };

  const handleSearch = () => {};

  useEffect(() => {
    getAllUser()
      .then(res => {
        setRowData(res.data.metadata);
      })
      .catch(err => {
        toast.error(err?.response?.data?.message || err.message);
      });
  }, []);
  return (
    <>
      <Section className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">Danh sách người dùng</div>
        <FormCreateAccount
          handleCreateUser={newAccount => {
            handleCreateUser(newAccount);
          }}
        />
      </Section>
      <Separator />
      <Section className="pt-3">
        <div className="my-2 text-xs  font-medium ">Tìm kiếm</div>
        <div className="relative mb-6 flex">
          <Search className="absolute left-2.5 top-2.5 size-5 text-gray-400" />
          <Input
            type="search"
            placeholder="Nhập từ khóa..."
            className="mr-4 w-[416px] pl-8 text-black"
          />
          <Button
            onClick={() => {
              handleSearch();
            }}
          >
            Tìm kiếm
            <Search className="ml-2 size-5" />
          </Button>
        </div>
        <AgGrid
          ref={ref}
          className="h-[60vh]"
          rowData={rowData}
          colDefs={colDefs}
          setRowData={data => {
            setRowData(data);
          }}
        />
      </Section>
      <DetailUser
        detail={detailData}
        open={openDetail}
        onOpenChange={() => {
          setOpenDetail(false);
        }}
        handleUpdateUser={row => {
          handleUpdateUser(row);
        }}
      />
    </>
  );
}
