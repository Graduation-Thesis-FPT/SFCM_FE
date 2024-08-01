import { getCustomerOrders, getOrderByOrderNo } from "@/apis/customer-order.api";
import { viewInvoice } from "@/apis/order.api";
import { AgGrid } from "@/components/common/aggridreact/AgGrid";
import { DateTimeByTextRender } from "@/components/common/aggridreact/cellRender";
import { bs_order_tracking } from "@/components/common/aggridreact/dbColumns";
import { useCustomToast } from "@/components/common/custom-toast";
import { Section } from "@/components/common/section";
import { Badge } from "@/components/common/ui/badge";
import { Button } from "@/components/common/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/common/ui/tooltip";
import { OrderDetail } from "@/components/customer-order";
import useFetchData from "@/hooks/useRefetchData";
import { useToggle } from "@/hooks/useToggle";
import { getType } from "@/lib/utils";
import { setGlobalLoading } from "@/redux/slice/globalLoadingSlice";
import { ArrowRightToLine, Printer } from "lucide-react";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";

export function Order() {
  const gridRef = useRef(null);
  const toast = useCustomToast();
  const orderDetailRef = useRef();
  const [order, setOrder] = useToggle();
  const BS_ORDER_TRACKING = new bs_order_tracking();
  const { data: orders, loading } = useFetchData({ service: getCustomerOrders });
  const dispatch = useDispatch();

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
      flex: 1,
      filter: true
    },
    {
      headerName: "Loại lệnh",
      field: "ORDER_TYPE",
      flex: 0.5,
      filter: true,
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
      flex: 0.5,
      filter: true
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
      flex: 1,
      filter: true,
      cellRenderer: params => {
        return (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                onClick={() => {
                  handleViewInvoice(params.data.DE_ORDER_NO);
                }}
                className="text-xs text-gray-500 hover:text-gray-800 hover:underline"
              >
                {params.data.INV_ID}
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="text-12">Xem hoá đơn</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      }
    },
    {
      headerName: "",
      field: "ORDER_DETAIL",
      flex: 0.5,
      filter: true,
      cellStyle: { alignContent: "space-evenly" },
      cellRenderer: params => {
        return (
          <Button
            variant="ghost"
            size="xs"
            className="text-xs"
            onClick={async () => {
              await handleGetOrder(params.data.DE_ORDER_NO);
              handlePrint();
            }}
          >
            <Printer size={16} className="mr-1 text-blue-950" />
            In phiếu
          </Button>
        );
      }
    }
  ];
  const handlePrint = useReactToPrint({
    content: () => orderDetailRef.current
  });

  function handleViewInvoice(deliveryOrderNO) {
    dispatch(setGlobalLoading(true));
    viewInvoice(deliveryOrderNO)
      .then(res => {
        let base64Data = res.data.metadata.content.data;
        const blob = new Blob([new Uint8Array(base64Data).buffer], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  }

  async function handleGetOrder(orderNo) {
    console.log(orderNo);
    dispatch(setGlobalLoading(true));
    await getOrderByOrderNo({ orderNo: orderNo })
      .then(async res => {
        await setOrder(res.data.metadata);
      })
      .catch(err => {
        toast.error(err);
      })
      .finally(() => {
        dispatch(setGlobalLoading(false));
      });
  }

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
      <OrderDetail ref={orderDetailRef} data={order} status={getType(order)} />
    </Section>
  );
}
