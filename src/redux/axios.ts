import axios from "axios";
const API = axios.create({
  baseURL: `http://localhost:8080/php/coosport-server/api/`,
});

export default API;
