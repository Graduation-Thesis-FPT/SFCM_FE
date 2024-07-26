import { ImportOrderStatus } from "@/constants/order-status";
import { OrderCard } from "./OrderCard";

export function OrderList({ status = ImportOrderStatus.isConfirmed, title = "Đã xác nhận" }) {
  const orders = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="flex h-full flex-col pb-2">
      <p className="text-18 mb-6 flex-none px-6 font-medium text-blue-950">{title}</p>
      <div className="flex flex-1 flex-col gap-4 overflow-auto px-6">
        {orders.map((order, i) => (
          <OrderCard key={i} order={order} status={status} />
        ))}
      </div>
    </div>
  );
}
