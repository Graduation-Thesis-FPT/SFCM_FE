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
import { useSelector } from "react-redux";

export function User() {
  const { data: users, revalidate, loading } = useFetchData({ service: getAllUser });

  const gridRef = useRef(null);
  const currentUser = useSelector(state => state.userSlice.user.userInfo);

  const [detailData, setDetailData] = useState({});

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
      field: "USERNAME",
      headerName: "Tài khoản",
      flex: 1,
      filter: true
    },
    { field: "FULLNAME", headerName: "Họ và tên", flex: 1, filter: true },
    { field: "ROLE_NAME", headerName: "Chức vụ", flex: 1 },
    {
      headerClass: "number-header",
      cellClass: "text-end",
      field: "TELEPHONE",
      headerName: "Số điện thoại",
      flex: 1,
      filter: true
    },
    {
      field: "IS_ACTIVE",
      minWidth: 150,
      maxWidth: 150,
      headerName: "Trạng thái",
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      cellRenderer: params => {
        if (params.value) {
          return (
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
      field: "UPDATED_AT",
      headerName: "Ngày chỉnh sửa",
      flex: 1,
      cellRenderer: params => {
        return params.value ? moment(params.value).format("DD/MM/YYYY") : "";
      }
    },
    {
      field: "#",
      headerName: "",
      flex: 0.5,
      headerClass: "center-header",
      cellStyle: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex"
      },
      cellRenderer: params => {
        if (params.data.USERNAME === currentUser.USERNAME) return null;
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

  return (
    <Section>
      <Section.Header title="Danh sách người dùng">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <UserCreationForm revalidate={revalidate} />
        </GrantPermission>
      </Section.Header>

      <Section.Content>
        <Section.Table>
          <AgGrid
            loading={loading}
            ref={gridRef}
            rowData={users}
            colDefs={colDefs}
            setRowData={data => {
              setRowData(data);
            }}
          />
        </Section.Table>
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
