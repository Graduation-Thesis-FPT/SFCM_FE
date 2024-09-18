import { axiosPrivate } from "@/config/axios";

export const getAllCustomer = async () => {
  return axiosPrivate.get(`customer`);
};
export const getCustomerByCustomerType = async CUSTOMER_TYPE => {
  return axiosPrivate.get(`customer?CUSTOMER_TYPE=${CUSTOMER_TYPE}`);
};

export const createCustomer = async data => {
  return await axiosPrivate.post(`customer`, data);
};

export const updateCustomer = async data => {
  return await axiosPrivate.patch(`customer`, data);
};

export const createAndUpdateCustomer = async data => {
  return await axiosPrivate.post(`customer`, data);
  // return await axiosCache.post(`customer`, data, {
  //   cache: {
  //     update: {
  //       "get-all-user": "delete",
  //       "get-all-customer": "delete"
  //     }
  //   }
  // });
};

export const deleteCustomer = async arr => {
  return await axiosPrivate.delete(`customer`, { data: { CUSTOMER_CODE_LIST: arr } });
  // return await axiosPrivate.delete(
  //   `customer`,
  //   { data: { CUSTOMER_CODE_LIST: arr } },
  //   {
  //     cache: {
  //       update: {
  //         "get-all-user": "delete",
  //         "get-all-customer": "delete"
  //       }
  //     }
  //   }
  // );
};
