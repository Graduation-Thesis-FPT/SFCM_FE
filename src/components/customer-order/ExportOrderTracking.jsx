import { getCustomerOrders } from "@/apis/customer-order.api";
import { CustomerOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";

export function ExportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList
          title="Đã xác nhận"
          status={CustomerOrderStatus.isPending}
          orderType="EXPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đang lấy hàng"
          status={CustomerOrderStatus.isInProgress}
          orderType="EXPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đang xuất kho"
          status={CustomerOrderStatus.isCompleted}
          orderType="EXPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã huỷ"
          status={CustomerOrderStatus.isCanceled}
          orderType="EXPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
