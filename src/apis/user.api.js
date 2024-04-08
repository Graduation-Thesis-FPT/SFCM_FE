import axios from "@/config/axios";

const getTest = async () => await axios.get(`entries`);

export { getTest };
