import axios from "axios";
const API = axios.create({
  baseURL: `http://localhost:8080/PHP/coosport-api/api/`,
});

export default API;
