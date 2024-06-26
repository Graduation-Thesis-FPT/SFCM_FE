import { getAllUser } from "@/apis/user.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/common/ui/badge";
import { actionGrantPermission } from "@/constants";
import useFetchData from "@/hooks/useRefetchData";
import { SquarePen } from "lucide-react";
import moment from "moment";
import React, { useRef, useState } from "react";
import { UserCreationForm } from "./UserCreationForm";
import { UserUpdateForm } from "./UserUpdateForm";

export function User() {
  const gridRef = useRef(null);
  const [detailData, setDetailData] = useState({});
  const { data: users, revalidate } = useFetchData({ service: getAllUser });
  let rowData = users ?? [];

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 50,
      comparator: (nodeA, nodeB) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      field: "USER_NAME",
      headerName: "Tài khoản",
      flex: 1,
      filter: true
    },
    { field: "FULLNAME", headerName: "Họ và tên", flex: 1, filter: true },
    { field: "TELEPHONE", headerName: "Số điện thoại", flex: 1, filter: true },
    { field: "ROLE_NAME", headerName: "Chức vụ", flex: 1 },
    {
      field: "IS_ACTIVE",
      minWidth: 150,
      maxWidth: 150,
      headerName: "Trạng thái",
      cellRenderer: params => {
        if (params.value) {
          return (
            // <Button className="h-[70%] w-full cursor-default rounded-[6px] bg-green-100 font-medium text-green-800 hover:bg-green-100">
            //   Hoạt động
            // </Button>
            <Badge className="rounded-sm border-transparent bg-green-100 text-green-800 hover:bg-green-200">
              Hoạt động
            </Badge>
          );
        }
        return (
          <Badge className="rounded-sm border-transparent bg-red-100 text-red-800 hover:bg-red-200">
            Dừng
          </Badge>
        );
      }
    },
    {
      field: "UPDATE_DATE",
      headerName: "Ngày chỉnh sửa",
      flex: 1,
      cellRenderer: params => {
        return params.value ? moment(params.value).format("DD/MM/YYYY") : "";
      }
    },
    {
      field: "#",
      headerName: "Xem",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <SquarePen
            onClick={() => setDetailData(params.data)}
            size={16}
            className="cursor-pointer text-blue-500 hover:text-blue-800"
          />
        );
      }
    }
  ];

  // const handleSearch = value => {
  //   console.log(value);
  // };

  return (
    <Section>
      <Section.Header title="Danh sách người dùng">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <UserCreationForm revalidate={revalidate} />
        </GrantPermission>
      </Section.Header>
      <Section.Content>
        {/* <SearchInput handleSearch={value => handleSearch(value)} /> */}

        <AgGrid
          ref={gridRef}
          rowData={rowData}
          colDefs={colDefs}
          setRowData={data => {
            setRowData(data);
          }}
        />
      </Section.Content>
      <UserUpdateForm
        detail={detailData}
        revalidate={revalidate}
        onOpenChange={() => {
          setDetailData({});
        }}
      />
    </Section>
  );
}
