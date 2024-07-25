import React from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../common/ui/resizable";
import { ImportOrderStatus } from "@/constants/order-status";
import { OrderList } from "./OrderList";
import { SearchInput } from "../common/search";

export function ImportOrderTracking() {
  return (
    <ResizablePanelGroup className="h-full py-2" direction="horizontal">
      <ResizablePanel className="h-full">
        <OrderList title="Đã xác nhận" status={ImportOrderStatus.isConfirmed} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList title="Đã kiểm đếm" status={ImportOrderStatus.isChecked} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <OrderList title="Đã lưu kho" status={ImportOrderStatus.isStored} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
