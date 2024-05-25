import { AgGrid } from "@/components/aggridreact/AgGrid";
import { SearchInput } from "@/components/search";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import moment from "moment";
import { useRef, useState } from "react";

export function ThietKeKho() {
  const gridRef = useRef(null);
  const [rowData, setRowData] = useState([]);

  const colDefs = [
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
      field: "UPDATE_DATE",
      headerName: "Ngày chỉnh sửa",
      flex: 1,
      cellRenderer: params => {
        return params.value ? moment(params.value).format("DD/MM/YYYY HH:mm") : "";
      }
    },
    {
      headerName: "Diện tích",
      headerClass: "center-header",
      children: [
        {
          field: "d",
          headerName: "Dài",
          headerClass: "center-header",
          flex: 1
        },
        {
          field: "r",
          headerName: "Rộng",
          headerClass: "center-header",
          flex: 1
        }
      ]
    },
    {
      field: "#",
      headerName: "Xem",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
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
  const handleSearch = value => {};

  return (
    <Section>
      <Section.Header title="Danh sách các dãy (block)">
        <Button variant="blue" className="h-12">
          <PlusCircle className="mr-2 size-5" />
          Tạo dãy mới
        </Button>
      </Section.Header>

      <Section.Content>
        <div className="flex justify-between">
          <SearchInput handleSearch={value => handleSearch(value)} />
          <span>
            <div className="mb-2 text-xs font-medium">Hiển thị</div>
            <Select defaultValue="table">
              <SelectTrigger className="h-12 w-[122px]">
                <SelectValue placeholder="Hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="table">Dạng bảng</SelectItem>
                  <SelectItem value="...">Dạng háng</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </span>
        </div>
        <AgGrid
          ref={gridRef}
          className="h-[50vh]"
          rowData={rowData}
          colDefs={colDefs}
          setRowData={data => {
            setRowData(data);
          }}
        />
      </Section.Content>
    </Section>
  );
}
