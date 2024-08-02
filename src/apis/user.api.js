import { axiosCache, axiosPrivate } from "@/config/axios";

const getAllUser = async () =>
  await axiosCache.get(`user`, {
    id: "get-all-user",
    cache: {
      ttl: 60 * 60 * 1000,
      interpretHeader: false
    }
  });
const findUserById = async ({ id }) =>
  await axiosCache.get(`user/${id}`, {
    id: `find-user-by-id-${id}`,
    cache: {
      ttl: 60 * 60 * 1000,
      interpretHeader: false
    }
  });
const createAccount = async ({ data }) =>
  await axiosCache.post(`user`, data, {
    id: `create-account`,
    cache: {
      update: {
        "get-all-user": "delete"
      }
    }
  });
const deleteUserById = async ({ id }) =>
  await axiosCache.delete(`user/${id}`, {
    id: `delete-user-${id}`,
    cache: {
      update: {
        "get-all-user": "delete",
        "get-all-customer": "delete"
      }
    }
  });
const activateUser = async ({ id }) =>
  await axiosCache.patch(`user/active/${id}`, {
    id: `activate-user-${id}`,
    cache: {
      update: {
        "get-all-user": "delete",
        "get-all-customer": "delete"
      }
    }
  });
const deactivateUser = async ({ id }) =>
  await axiosCache.patch(`user/deactive/${id}`, {
    id: `deactivate-user-${id}`,
    cache: {
      update: {
        "get-all-user": "delete",
        "get-all-customer": "delete"
      }
    }
  });
const updateUser = async ({ id, data }) =>
  await axiosPrivate.patch(`user/${id}`, data, {
    id: `update-user-${id}`,
    cache: {
      update: {
        "get-all-user": "delete",
        "get-all-customer": "delete"
      }
    }
  });
const resetPasswordById = async ({ id, data }) =>
  await axiosPrivate.patch(`user/reset-password/${id}`, data);
export {
  getAllUser,
  createAccount,
  deleteUserById,
  activateUser,
  deactivateUser,
  updateUser,
  findUserById,
  resetPasswordById
};
