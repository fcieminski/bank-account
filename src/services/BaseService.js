import axios from "axios";

export default class BaseService {
  constructor() {
    this.axios = axios.create({
        baseURL: process.env.API_BASE_URL || `http://localhost:8081`,
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
  }
}
