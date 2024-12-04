import { createSSRApp } from "vue";
import App from "./App.vue";
import "uno.css";
import '@/static/style/index.css'

export function createApp() {
  const app = createSSRApp(App);
  return {
    app,
  };
}
