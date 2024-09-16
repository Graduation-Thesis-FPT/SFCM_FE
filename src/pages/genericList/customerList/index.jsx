import { getAllCustomer } from "@/apis/customer.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { customer } from "@/components/common/aggridreact/dbColumns";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { actionGrantPermission } from "@/constants";
import { useRef, useState } from "react";
import useFetchData from "@/hooks/useRefetchData";
import { CustomerCreationForm } from "./CustomerCreationForm";
import { Badge } from "@/components/common/ui/badge";
import { SquarePen } from "lucide-react";
import { CustomerUpdateForm } from "./CustomerUpdateForm";

const CUSTOMER = new customer();

export function CustomerList() {
  const gridRef = useRef(null);

  const { data: customerList, revalidate: revalidateCustomerList } = useFetchData({
    service: getAllCustomer
  });

  const [customerDetail, setCustomerDetail] = useState({});

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      width: 60,
      comparator: (valueA, valueB, nodeA, nodeB, isDescending) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: CUSTOMER.ID.headerName,
      field: CUSTOMER.ID.field,
      flex: 1,
      filter: true
    },
    {
      headerName: "Tên khách hàng *",
      field: "FULLNAME",
      flex: 1,
      filter: true
    },
    {
      headerName: CUSTOMER.TAX_CODE.headerName,
      field: CUSTOMER.TAX_CODE.field,
      flex: 1,
      filter: true,
      headerClass: "number-header",
      cellClass: "text-end"
    },
    {
      headerName: CUSTOMER.CUSTOMER_TYPE.headerName,
      field: CUSTOMER.CUSTOMER_TYPE.field,
      flex: 1,
      cellRenderer: params => {
        return params.value === "CONSIGNEE" ? "Chủ hàng" : "Đại lý";
      }
    },
    {
      headerName: "Email",
      field: "EMAIL",
      flex: 1,
      filter: true
    },
    {
      headerName: "Địa chỉ",
      field: "ADDRESS",
      flex: 1,
      filter: true
    },
    {
      headerName: "Trạng thái",
      field: "IS_ACTIVE",
      headerClass: "center-header",
      cellStyle: {
        textAlign: "center"
      },
      minWidth: 150,
      maxWidth: 150,
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
        return (
          <SquarePen
            onClick={() => setCustomerDetail(params.data)}
            size={16}
            className="cursor-pointer text-blue-500 hover:text-blue-800"
          />
        );
      }
    }
  ];

  return (
    <Section>
      <Section.Header title="Danh sách khách hàng">
        <GrantPermission action={actionGrantPermission.CREATE}>
          <CustomerCreationForm revalidateCustomerList={revalidateCustomerList} />
        </GrantPermission>
      </Section.Header>
      <Section.Content>
        <Section.Table>
          <AgGrid rowSelection={"single"} ref={gridRef} rowData={customerList} colDefs={colDefs} />
        </Section.Table>
      </Section.Content>
      <CustomerUpdateForm
        customerDetail={customerDetail}
        onOpenChange={() => {
          setCustomerDetail({});
        }}
        revalidateCustomerList={revalidateCustomerList}
      />
    </Section>
  );
}
