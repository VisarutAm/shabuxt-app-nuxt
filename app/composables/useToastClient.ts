export const useToastClient = async () => {
  if (process.client) {
    const toastModule = await import("vue-toastification");
    return toastModule.useToast();
  }
  return null;
};
