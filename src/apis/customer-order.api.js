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
    id: `customer-order-import-orders-${status}`,
    cache: {
      ttl: 5 * 60 * 1000,
      interpretHeader: false
    }
  });

const getExportedOrders = async ({ status }) =>
  await axiosCache.get(`customer-order/export-orders?status=${status}`, {
    id: `customer-order-export-orders-${status}`,
    cache: {
      ttl: 5 * 60 * 1000,
      interpretHeader: false
    }
  });

export { getCustomerOrders, getImportedOrders, getExportedOrders };
