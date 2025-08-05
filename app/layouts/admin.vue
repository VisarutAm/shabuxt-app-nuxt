<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  const adminToken = useCookie('admin_token')
  adminToken.value = null // ลบค่า cookie ออก
  router.push('/')
}
</script>
<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <aside class="w-64 bg-purple-800 text-white p-6 flex flex-col justify-between">
        <div class="space-y-4">
      <h2 class="text-2xl font-bold mb-6">Admin Panel</h2>

      <NuxtLink
        to="/admin/add"
        class="block px-3 py-2 rounded hover:bg-purple-700"
        :class="{ 'bg-purple-900 font-semibold': $route.path === '/admin/add' }"
      >
        ➕ Add Product
      </NuxtLink>

      <NuxtLink
        to="/admin/products"
        class="block px-3 py-2 rounded hover:bg-purple-700"
        :class="{ 'bg-purple-900 font-semibold': $route.path === '/admin/products' }"
      >
        📦 Products
      </NuxtLink>

      <NuxtLink
        to="/admin/orders"
        class="block px-3 py-2 rounded hover:bg-purple-700"
        :class="{ 'bg-purple-900 font-semibold': $route.path === '/admin/orders' }"
      >
        📑 Orders
      </NuxtLink>
        </div>
     <!-- Logout Button -->
      <button
        @click="logout"
        class="mt-6 w-full bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        🔓 Logout
      </button>
    </aside>

    <!-- Main content -->
    <main class="flex-1  overflow-y-auto">
      <slot />
    </main>
  </div>
</template>
