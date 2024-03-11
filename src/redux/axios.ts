import axios from "axios";
const API = axios.create({
  baseURL: `https://vuorder.com/coosport-server/api/`,
});

export default API;
