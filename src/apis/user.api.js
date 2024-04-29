import axios from "@/config/axios";

const getTest = async () => await axios.get(`account/test`);
const getAllAccounts = async () => await axios.get(`account/getAllAccounts`);
const createAccount = async data => await axios.post(`account/createAccount`, data);
export { getTest, getAllAccounts, createAccount };
