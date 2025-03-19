import { createSSRApp } from "vue";
import App from "./App.vue";
import "uno.css";
import '@/static/style/index.css'
import { http } from "@/request/interceptors";
import { setStorage, getStorage } from "@/utils/index";
import { createPinia } from 'pinia'
import "uno.css";
import "@/static/icon/index.scss";
uni.u = {
  get: http.get,
  post: http.post,
  setStorage,
  getStorage,
};
const pinia = createPinia()

export function createApp() {
  const app = createSSRApp(App);

  app.use(pinia); // 挂载 Pinia
  return {
    app,
    pinia
  };
}
export { pinia };
