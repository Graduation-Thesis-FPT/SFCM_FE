import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { Section } from "@/components/common/section";
import { Button } from "@/components/common/ui/button";
import moment from "moment";
import React, { useRef, useState } from "react";
import { DetailPermission } from "./DetailPermission";
import useFetchData from "@/hooks/useRefetchData";
import { getAllRole } from "@/apis/role.api";

export function Permission() {
  const gridRef = useRef(null);
  const [detailData, setDetailData] = useState({});
  const { data: roles, revalidate, loading } = useFetchData({ service: getAllRole });

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
      field: "ROLE_CODE",
      headerName: "Mã",
      flex: 1,
      filter: true
    },
    { field: "ROLE_NAME", headerName: "Chức vụ", flex: 1, filter: true },
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
      headerName: "",
      minWidth: 120,
      flex: 0.5,
      cellStyle: { alignContent: "center", textAlign: "center" },
      cellRenderer: params => {
        return (
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              setDetailData(params.data);
            }}
            className="text-xs text-blue-700 hover:text-blue-700/80"
          >
            Phân quyền
          </Button>
        );
      }
    }
  ];

  return (
    <>
      <Section>
        <Section.Header title="Quản lý quyền"></Section.Header>
        <Section.Content>
          {/* <SearchInput /> */}
          <AgGrid
            loading={loading}
            ref={gridRef}
            className="h-full"
            rowData={roles}
            colDefs={colDefs}
            setRowData={data => {
              setRowData(data);
            }}
          />
        </Section.Content>
      </Section>
      <DetailPermission
        detailData={detailData}
        onOpenChange={() => {
          setDetailData({});
        }}
        revalidate={revalidate}
      />
    </>
  );
}
