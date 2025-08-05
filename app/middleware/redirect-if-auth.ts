export default defineNuxtRouteMiddleware((to) => {
  const token = useCookie("admin_token");

  // ถ้าไม่มี token แล้วไม่ใช่หน้า /admin/login ให้ไป /admin/login
  if (!token.value && to.path !== "/admin/login") {
    return navigateTo("/admin/login");
  }

  // ถ้ามี token แล้วไปหน้า /admin/login ให้ไป /admin/add แทน
  if (token.value && to.path === "/admin/login") {
    return navigateTo("/admin/add");
  }
});
