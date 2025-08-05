<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-300 via-purple-300 to-indigo-900"
  >
    <div
      class="bg-white bg-opacity-90 rounded-lg shadow-lg p-8 max-w-md w-full"
    >
      <h1 class="text-2xl font-bold mb-6 text-center text-purple-900">
        Admin Login
      </h1>
      <form @submit.prevent="login">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="border border-purple-300 rounded-md p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="border border-purple-300 rounded-md p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          class="bg-purple-500 hover:bg-purple-400 transition-colors text-white font-semibold py-3 rounded-md w-full"
        >
          Login
        </button>
        <p v-if="error" class="text-red-600 mt-4 text-center">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  layout: "empty", // หรือ layout: false
  middleware: "redirect-if-auth",
});
import { useRouter } from "vue-router";

interface LoginResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const email = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();

const login = async () => {
  const { data } = await useFetch<LoginResponse>("/api/admin/login", {
    method: "POST",
    body: { email: email.value, password: password.value },
  });

  if (data.value?.success) {
    //localStorage.setItem('admin_token', data.value.token as string)
    const cookie = useCookie("admin_token");
    cookie.value = data.value.token; // ได้จาก API หลัง login

    router.push("/admin/add");
  } else {
    error.value = data.value?.message || "Login failed";
  }
};
</script>
