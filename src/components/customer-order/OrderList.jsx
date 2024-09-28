import { CustomerOrderStatus } from "@/constants/order-status";
import useFetchData from "@/hooks/useRefetchData";
import { Skeleton } from "../common/ui/skeleton";
import { OrderCard } from "./OrderCard";

export function OrderList({
  status = CustomerOrderStatus.isPending,
  title = "Đã xác nhận",
  service
}) {
  const {
    data: orders,
    loading,
    error
  } = useFetchData({
    service: service,
    params: { status }
  });

  if (loading) {
    return (
      <div className="flex h-full flex-col pb-2">
        <p className="text-16 mb-6 flex-none px-6 font-medium text-blue-950">{title}</p>
        <div className="flex flex-1 flex-col gap-4 overflow-auto px-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-64" />
          ))}
        </div>
      </div>
    );
  }
  
  return  orders?.length === 0 ? (
    <div className="flex h-full flex-col pb-2">
      <p className="text-18 mb-6 flex-none px-6 font-medium text-blue-950">{title}</p>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-6">
        <p className="text-14 text-gray-500">Không có đơn hàng nào</p>
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col pb-2">
      <p className="text-16 mb-6 flex-none px-6 font-medium text-blue-950">{title}</p>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-6">
        {Array.isArray(orders) &&
          orders.map((order, idx) => <OrderCard key={idx} order={order} status={status} />)}
      </div>
    </div>
  );
}
