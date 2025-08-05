<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Orders</h1>
    <!-- Placeholder for order list -->
    <ul class="space-y-2">
      <li class="border p-4">Order #1 - John Doe - ฿250</li>
      <li class="border p-4">Order #2 - Jane Smith - ฿300</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  layout: 'admin'
})
</script>
