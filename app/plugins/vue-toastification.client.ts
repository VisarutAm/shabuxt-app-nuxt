const ToastModule = require("vue-toastification");
import type { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";

const { default: Toast, POSITION } = ToastModule;

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_CENTER,
    timeout: 1500,
    closeOnClick: true,
    pauseOnHover: true,
  };

  nuxtApp.vueApp.use(Toast, options);
});
