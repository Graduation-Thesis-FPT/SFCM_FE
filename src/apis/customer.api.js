import { axiosCache, axiosPrivate } from "@/config/axios";

export const getAllCustomer = async () => {
  return axiosPrivate.get(`customer`);
};

export const createAndUpdateCustomer = async data => {
  return await axiosCache.post(`customer`, data, {
    cache: {
      update: {
        "get-all-user": "delete",
        "get-all-customer": "delete"
      }
    }
  });
};

export const deleteCustomer = async arr => {
  return await axiosPrivate.delete(
    `customer`,
    { data: { CUSTOMER_CODE_LIST: arr } },
    {
      cache: {
        update: {
          "get-all-user": "delete",
          "get-all-customer": "delete"
        }
      }
    }
  );
};
