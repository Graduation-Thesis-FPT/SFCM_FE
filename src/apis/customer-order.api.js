import { axiosCache, axiosPrivate } from "@/config/axios";

const getCustomerOrders = async ({ status, orderId, orderType, from, to }) => {
  return await axiosPrivate.get(`customer-order/all-orders`, {
    params: {
      status: status || "",
      orderId: orderId || "",
      orderType: orderType || "",
      from: from || "",
      to: to || ""
    }
  });
};

const getCustomerOrdersByFilter = async ({ from_date, to_date }) =>
  await axiosCache.get(`customer-order?from=${from_date}&to=${to_date}`);

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

export {
  getCustomerOrders,
  getImportedOrders,
  getExportedOrders,
  getOrderByOrderNo,
  getCustomerOrdersByFilter
};
