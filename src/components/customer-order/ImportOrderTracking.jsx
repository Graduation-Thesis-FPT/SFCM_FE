import { ImportOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";
import { getImportedOrders } from "@/apis/customer-order.api";

export function ImportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList
          title="Đã xác nhận"
          status={ImportOrderStatus.isConfirmed}
          service={getImportedOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã kiểm đếm"
          status={ImportOrderStatus.isChecked}
          service={getImportedOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã lưu kho"
          status={ImportOrderStatus.isStored}
          service={getImportedOrders}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
