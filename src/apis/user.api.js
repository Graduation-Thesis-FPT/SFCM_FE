import { axiosPrivate } from "@/config/axios";

const getAllUser = async () => await axiosPrivate.get(`user`);
const findUserById = async ({id}) => await axiosPrivate.get(`user/${id}`);
const createAccount = async ({data}) => await axiosPrivate.post(`user`, data);
const deleteUserById = async ({id}) => await axiosPrivate.delete(`user/${id}`);
const activateUser = async ({id}) => await axiosPrivate.patch(`user/active/${id}`);
const deactivateUser = async ({id}) => await axiosPrivate.patch(`user/deactive/${id}`);
const updateUser = async ({id, data}) => await axiosPrivate.patch(`user/${id}`, data);
const resetPasswordById = async ({id, data}) =>
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
