import axios, { axiosPrivate } from "@/config/axios";

const getAllUserGroup = async () => await axiosPrivate.get(`user-group`);
const deleteUserGroup = async listId => await axiosPrivate.delete(`user-group`, { data: listId });

export { getAllUserGroup, deleteUserGroup };
