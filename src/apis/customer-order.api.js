import { axiosPrivate } from "@/config/axios";

const getCustomerOrders = async () => await axiosPrivate.get(`customer-order`);

export { getCustomerOrders };
