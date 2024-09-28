import { getCustomerOrders } from "@/apis/customer-order.api";
import { CustomerOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";

export function ImportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full w-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList
          title="Đã xác nhận"
          status={CustomerOrderStatus.isPending}
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel className="h-full">
        <OrderList
          title="Đã thanh toán"
          status={CustomerOrderStatus.isPaid}
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đang kiểm đếm"
          status={CustomerOrderStatus.isInProgress}
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã lưu kho"
          status={CustomerOrderStatus.isCompleted}
          service={getCustomerOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã huỷ"
          status={CustomerOrderStatus.isCanceled}
          service={getCustomerOrders}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
