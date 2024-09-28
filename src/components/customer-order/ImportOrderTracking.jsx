import { getCustomerOrders } from "@/apis/customer-order.api";
import { CustomerOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";

export function ImportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full w-full py-2" direction="horizontal">
      <ResizablePanel className="h-full" defaultSize={10} maxSize={400}>
        <OrderList
          title="Đã xác nhận"
          status={CustomerOrderStatus.isPending}
          orderType="IMPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={10} maxSize={400}>
        <OrderList
          title="Đang kiểm đếm"
          status={CustomerOrderStatus.isInProgress}
          orderType="IMPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={10} maxSize={400}>
        <OrderList
          title="Đã lưu kho"
          status={CustomerOrderStatus.isCompleted}
          orderType="IMPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={10} maxSize={400}>
        <OrderList
          title="Đã huỷ"
          status={CustomerOrderStatus.isCanceled}
          orderType="IMPORT"
          service={getCustomerOrders}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
