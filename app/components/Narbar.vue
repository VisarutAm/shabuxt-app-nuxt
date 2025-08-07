<script setup lang="ts">
import { useBookingStore } from '~/store/useBookingStore'
import { computed } from 'vue'

const bookingStore = useBookingStore()

const totalQuantity = computed(() =>
  bookingStore.items.reduce((sum, item) => sum + item.quantity, 0)
)

const scrollToMenu = () => {
  const el = document.getElementById('menu')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

</script>

<template>
  <header class="border-b shadow-sm">
    <nav class="container mx-auto py-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2">
        <NuxtImg width="70" src="/shubu-logo.png" format="webp" alt="logo" />
        <span class="text-2xl sm:text-3xl font-bold text-primary">ShaBuxt</span>
      </NuxtLink>

      <!-- Menu (Desktop) -->
      <ul class=" flex items-center gap-6 text-lg font-medium max-md:px-15">
        <li>
         <button @click="scrollToMenu" class="hover:text-primary transition-colors">Menu</button>
        </li>
        <li>
          <NuxtLink to="/orders" class="relative group">
            <NuxtImg width="32" src="/add-to-basket.png" format="webp" alt="orders" />
            <span class="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">{{ totalQuantity }}</span>
          </NuxtLink>
        </li>
      </ul>     
    </nav>
  </header>
</template>

<style scoped>
.text-primary {
  color :text-rose-600
}
</style>