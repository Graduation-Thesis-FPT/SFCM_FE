import axios from "@/config/axios";

const getAllUserGroup = async () => await axios.get(`user-group`);
const deleteUserGroup = async listId => await axios.delete(`user-group`, listId);

export { getAllUserGroup, deleteUserGroup };
