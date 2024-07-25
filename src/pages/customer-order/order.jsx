import { getCustomerOrders } from "@/apis/customer-order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { bs_order_tracking } from "@/components/common/aggridreact/dbColumns";
import { GrantPermission } from "@/components/common/grant-permission";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import { actionGrantPermission } from "@/constants";
import useFetchData from "@/hooks/useRefetchData";
import { ArrowRightToLine } from "lucide-react";
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
        if (!!params.data.CONTAINER_ID) {
          return !!params.data.PACKAGE_ID ? (
            <Badge className="rounded-sm border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200">
              Xuất
              <ArrowRightToLine className="ml-1" size={16} />
            </Badge>
          ) : (
            <Badge className="rounded-sm border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200">
              <ArrowRightToLine className="mr-1" size={16} />
              Nhập
            </Badge>
          );
        }
        return (
          <Badge className="rounded-sm border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200">
            Không xác định
          </Badge>
        );
      }
    },
    {
      headerName: BS_ORDER_TRACKING.TOTAL_CBM.headerName,
      field: BS_ORDER_TRACKING.TOTAL_CBM.field,
      flex: 0.5
    },
    
    {
      headerName: BS_ORDER_TRACKING.ISSUE_DATE.headerName,
      field: BS_ORDER_TRACKING.ISSUE_DATE.field,
      flex: 1,
      cellRenderer: DateTimeByTextRender
    },
    {
      headerName: BS_ORDER_TRACKING.INV_ID.headerName,
      field: BS_ORDER_TRACKING.INV_ID.field,
      flex: 1
    },
    {
      headerName: "",
      field: "ORDER_DETAIL",
      flex: 0.5,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <Button
            variant="link"
            size="xs"
            onClick={() => {
              // setDetailData(params.data);
            }}
            className="text-xs text-blue-700 hover:text-blue-700/80"
          >
            Xem chi tiết
          </Button>
        );
      }
    }
  ];

  return (
    <Section>
      <Section.Header title="Danh sách đơn hàng"></Section.Header>
      <Section.Content>
        <Section.Table>
          <AgGrid
            contextMenu={true}
            ref={gridRef}
            colDefs={colDefs}
            loading={loading}
            rowData={orders}
          />
        </Section.Table>
      </Section.Content>
    </Section>
  );
}
