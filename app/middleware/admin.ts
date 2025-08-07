import { jwtDecode } from "jwt-decode";
interface AdminTokenPayload {
  role: string;
}
export default defineNuxtRouteMiddleware(() => {
  if (process.server) return;

  const token = useCookie("admin_token");
  if (!token.value) return navigateTo("/admin/login");

  try {
    const decoded = jwtDecode<AdminTokenPayload>(token.value);

    if (decoded.role === "admin") return;
    return navigateTo("/admin/login");
  } catch (error) {
    console.error("Token decode failed:", error);
    return navigateTo("/admin/login");
  }
});
