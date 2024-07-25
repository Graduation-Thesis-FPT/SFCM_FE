import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/common/ui/tabs";
import { ExportOrderTracking, ImportOrderTracking } from "@/components/customer-order";

export function OrderTracking() {
  return (
    <Tabs defaultValue="import-order" className="flex h-full w-full flex-col">
      <TabsList>
        <TabsTrigger value="import-order">Đơn hàng nhập</TabsTrigger>
        <TabsTrigger value="export-order">Đơn hàng xuất</TabsTrigger>
      </TabsList>
      <TabsContent className="min-h-0 flex-1" value="import-order">
        <ImportOrderTracking />
      </TabsContent>
      <TabsContent className="min-h-0 flex-1" value="export-order">
        <ExportOrderTracking />
      </TabsContent>
    </Tabs>
  );
}
