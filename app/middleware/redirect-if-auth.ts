export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("admin_token");

  if (!token.value && to.path !== "/admin/login") {
    return navigateTo("/admin/login");
  }

  if (token.value && to.path === "/admin/login") {
    return navigateTo("/admin/add");
  }
});
