import { ExportOrderStatus } from "@/constants/order-status";
import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { OrderList } from "./OrderList";

export function ExportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList title="Đã xác nhận" status={ExportOrderStatus.isConfirmed} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList title="Đã xuất kho" status={ExportOrderStatus.isReleased} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
