// @ts-nocheck

import { getStorage, host } from "@/utils";
import service from "./index";
import { TOKEN } from '@/utils/constants'
import { setActivePinia } from "pinia";
import { pinia } from "@/main"; // ✅ 引入全局 Pinia 实例
import { useUserStore } from "@/store/index";

let token: string = "";

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

    setActivePinia(pinia);
    const authStore = useUserStore();
    console.log('authStore', authStore.token)
    if (config.data.token) {
      token = config.data.token
    } else {
      token = authStore.token || uni.getStorageSync(TOKEN);
    }

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
    return config;
  });
  //响应拦截
  service.interceptors.response.use((response) => {
    //TODO
    if (response.data?.code === 401) {
      uni.removeStorageSync(TOKEN)
      uni.redirectTo({
        url: '/pages/login/index'
      })
      return Promise.reject(response);
    }
    if (response.data?.code === 500) {
      uni.showToast({
        title: response.data.msg,
        icon: 'error'
      })
      return Promise.reject(response);
    }

    return Promise.resolve(response.data);
  });

  return service as any;
}

export const http = initHttp();
