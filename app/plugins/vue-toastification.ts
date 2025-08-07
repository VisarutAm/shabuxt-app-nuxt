import Toast from "vue-toastification";
import type { PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { POSITION } from "vue-toastification";
export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_CENTER,
    timeout: 1500,
    closeOnClick: true,
    pauseOnHover: true,
  };

  nuxtApp.vueApp.use(Toast, options);
});
