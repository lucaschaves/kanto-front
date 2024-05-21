import { CONSTANT_TOKEN } from "@/constants";
import { getAmbientURL } from "@/utils";
import axios from "axios";

const api = axios.create({
    baseURL: `${getAmbientURL()}`,
});

api.interceptors.request.use(async (config) => {
    const token = window.sessionStorage.getItem(CONSTANT_TOKEN);
    if (token) {
        config.headers.Authorization = token;
        config.headers["Access-Control-Allow-Origin"] = "*";
    }
    return config;
});

export default api;
