import { getCustomerOrders } from "@/apis/customer-order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { bs_order_tracking } from "@/components/common/aggridreact/dbColumns";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/common/ui/badge";
import { actionGrantPermission } from "@/constants";
import useFetchData from "@/hooks/useRefetchData";
import { ArrowRightToLine, SquarePen } from "lucide-react";
import { useRef } from "react";

export function Order() {
  const gridRef = useRef(null);
  const BS_ORDER_TRACKING = new bs_order_tracking();
  const { data: orders, loading } = useFetchData({ service: getCustomerOrders });

  const colDefs = [
    {
      cellClass: "text-gray-600 bg-gray-50 text-center",
      flex: 0.25,
      comparator: (nodeA, nodeB) => {
        return nodeA.rowIndex - nodeB.rowIndex;
      },
      valueFormatter: params => {
        return Number(params.node.id) + 1;
      }
    },
    {
      headerName: BS_ORDER_TRACKING.DE_ORDER_NO.headerName,
      field: BS_ORDER_TRACKING.DE_ORDER_NO.field,
      flex: 1
    },
    {
      headerName: "Loại lệnh",
      field: "ORDER_TYPE",
      flex: 1,
      cellRenderer: params => {
        if (params.data.CONTAINER_ID !== null) {
          return (
            <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
              <ArrowRightToLine className="mr-1" size={16} />
              Nhập
            </Badge>
          );
        }
        if (params.data.PACKAGE_ID !== null) {
          return (
            <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
              Xuất
              <ArrowRightToLine className="ml-1" size={16} />
            </Badge>
          );
        }
        return "";
      }
    },
    {
      headerName: BS_ORDER_TRACKING.TOTAL_CBM.headerName,
      field: BS_ORDER_TRACKING.TOTAL_CBM.field,
      flex: 0.5
    },
    {
      headerName: BS_ORDER_TRACKING.INV_ID.headerName,
      field: BS_ORDER_TRACKING.INV_ID.field,
      flex: 1
    },
    {
      headerName: BS_ORDER_TRACKING.ISSUE_DATE.headerName,
      field: BS_ORDER_TRACKING.ISSUE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: "Chi tiết",
      field: "ORDER_DETAIL",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <SquarePen
            onClick={() => {
              console.log(params.data);
            }}
            size={16}
            className="cursor-pointer text-blue-500 hover:text-blue-800"
          />
        );
      }
    }
  ];

  return (
    <Section>
      <Section.Header title="Danh sách đơn hàng"></Section.Header>
      <Section.Content>
        <Section.Table>
          <GrantPermission action={actionGrantPermission.VIEW}>
            <AgGrid
              contextMenu={true}
              ref={gridRef}
              colDefs={colDefs}
              loading={loading}
              rowData={orders}
            />
          </GrantPermission>
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
