import { ExportOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";
import { getExportedOrders } from "@/apis/customer-order.api";

export function ExportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList
          title="Đã xác nhận"
          status={ExportOrderStatus.isConfirmed}
          service={getExportedOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã xuất kho"
          status={ExportOrderStatus.isReleased}
          service={getExportedOrders}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList
          title="Đã huỷ"
          status={ExportOrderStatus.isCanceled}
          service={getExportedOrders}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
