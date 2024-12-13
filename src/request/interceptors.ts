// @ts-nocheck

import { getStorage, baseUrl } from "@/utils";
import service from "./index";
import { TOKEN } from '@/utils/constants'

let token: string = "";
const dev = "http://47.100.214.251:8181";

export const host = process.env.NODE_ENV === "development" ? dev : baseUrl;

function initHttp() {
  service.create({
    host,
    header: {
      // "content-type": "application/x-www-form-urlencoded",
    },
  });

  //请求拦截
  // @ts-ignore
  service.interceptors.request.use(async (config) => {
    const data = (await getStorage(TOKEN)) || {};
    token = data;

    if (config.header?.isToken === false) return config;
    if (config.header) {
      config.header["Authorization"] = token;
      config.header["token"] = token;
    } else {
      config.header = {
        Authorization: token,
        token,
      };
    }

    console.log(config, "header");

    return config;
  });
  //响应拦截
  service.interceptors.response.use((response) => {
    //TODO
    console.log("interceptors response", response);

    if (response.statusCode != 200) {
      uni.showToast({
        icon: "none",
        title: response?.data?.msg || "服务异常",
        duration: 4000,
      });
      return Promise.reject(response);
    }

    if ([401, 403].includes(response.data.code)) {
      token = "";
      uni.u.reLaunch("/pages/login/index").then(() => {
        uni.showToast({
          icon: "none",
          title: response?.data?.msg || "服务异常",
          duration: 4000,
        });
      });

      return Promise.reject(response.data);
    }

    if (response.data.code !== 200) {
      uni.showToast({
        icon: "none",
        title: response?.data?.msg || "服务异常",
        duration: 4000,
      });
      return Promise.reject(response.data);
    }

    return Promise.resolve(response.data);
  });

  return service as any;
}

export const http = initHttp();
