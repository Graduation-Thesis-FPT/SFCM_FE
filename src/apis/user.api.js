import axios from "@/config/axios";

const getTest = async () => await axios.get(`load_tariff`);

export { getTest };
