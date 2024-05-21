import { getAllRole } from "@/apis/role.api";
import { AgGrid } from "@/components/aggridreact/AgGrid";
import { useCustomToast } from "@/components/custom-toast";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { DetailPermission } from "./DetailPermission";
import { getAllPermission } from "@/apis/permission";

export function Permission() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const [rowData, setRowData] = useState([]);
  const [detailData, setDetailData] = useState({});
  const [openDetail, setOpenDetail] = useState(false);

  const colDefs = [
    {
      field: "ROWGUID",
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
        return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
      }
    },
    {
      field: "#",
      headerName: "",
      flex: 0.5,
      cellStyle: { alignContent: "center", textAlign: "center" },
      cellRenderer: params => {
        return (
          <span
            onClick={() => {
              setDetailData(params.data);
              setTimeout(() => {
                setOpenDetail(true);
              }, 100);
            }}
            className="cursor-pointer text-sm font-medium text-blue-700 hover:text-blue-700/80"
          >
            Phân quyền
          </span>
        );
      }
    }
  ];

  useEffect(() => {}, []);
  return (
    <>
      <Section>
        <Section.Header title="Quản lý quyền"></Section.Header>
        <Section.Content>
          <SearchInput />
          <AgGrid
            ref={gridRef}
            className="h-[50vh]"
            rowData={rowData}
            colDefs={colDefs}
            setRowData={data => {
              setRowData(data);
            }}
            onGridReady={() => {
              gridRef.current.api.showLoadingOverlay();
              getAllRole()
                .then(res => {
                  setRowData(res.data.metadata);
                })
                .catch(err => {
                  toast.error(err?.response?.data?.message || err.message);
                });
            }}
          />
        </Section.Content>
      </Section>
      <DetailPermission
        detailData={detailData}
        open={openDetail}
        onOpenChange={() => {
          setOpenDetail(false);
        }}
      />
    </>
  );
}
