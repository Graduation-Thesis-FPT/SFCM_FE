import { axiosPrivate } from "@/config/axios";

const getCustomerOrders = async () =>
  await axiosPrivate.get(`customer-order`, {
    id: "customer-order",
    cache: {
      ttl: 60 * 60 * 1000,
      interpretHeader: false
    }
  });

export { getCustomerOrders };
