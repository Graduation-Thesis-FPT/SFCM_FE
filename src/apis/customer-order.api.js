import { axiosCache } from "@/config/axios";

const getCustomerOrders = async () =>
  await axiosCache.get(`customer-order`, {
    id: "customer-order",
    cache: {
      ttl: 5 * 60 * 1000,
      interpretHeader: false
    }
  });

const getImportedOrders = async ({ status }) =>
  await axiosCache.get(`customer-order/import-orders?status=${status}`, {
    id: `customer-order-import-orders-${status}`
  });

const getExportedOrders = async ({ status }) =>
  await axiosCache.get(`customer-order/export-orders?status=${status}`, {
    id: `customer-order-export-orders-${status}`
  });

const getOrderByOrderNo = async ({ orderNo }) =>
  await axiosCache.get(`customer-order/order/${orderNo}`, {
    id: `customer-order-${orderNo}`
  });

export { getCustomerOrders, getImportedOrders, getExportedOrders, getOrderByOrderNo };
