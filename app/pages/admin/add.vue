<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-300 via-purple-300 to-indigo-900 p-8 ">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg  ">
      <h1 class="text-2xl font-bold text-center mb-6 text-purple-800">Add New Product</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4 ">
      <input v-model="form.name" type="text" placeholder="Product Name" class="w-full border px-3 py-2 rounded" required />
      <textarea v-model="form.description" placeholder="Description" class="w-full border px-3 py-2 rounded" required />
      <input v-model="form.price" type="number" placeholder="Price" class="w-full border px-3 py-2 rounded" required />
      <input
        v-model="form.image_url"
        type="text"
        placeholder="Image URL"
        class="w-full border px-3 py-2 rounded"
        @input="previewImage = form.image_url"
      />
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="form.is_available" />
        <span>Available</span>
      </label>

      <div v-if="previewImage" class="mt-4">
        <p class="text-sm text-gray-600 "> Image Preview:</p>
        <img :src="previewImage" alt="Preview" class="w-32 h-32 object-cover shadow rounded-xl border-1 border-black" />
      </div>

      <button
      @click="handleSubmit"
        type="submit"
        class="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold"
      >{{ isSubmitting ? '⌛wait' : '✅ Submit' }}
        
      </button>
    </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})
import { ref } from 'vue'
import type { Product } from '~~/types/types'

interface OrderResponse {
  success: boolean;
  message?: string;
  data?: Product;
}

type ProductForm = Omit<Product, 'id'>
const form = ref<ProductForm>({
  name: '',
  description: '',
  price: 0,
  image_url: '',
  is_available: true,
})

const previewImage = ref('')
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (
    !form.value.name ||
    !form.value.description ||
    form.value.price == null ||
    !form.value.image_url ||
    typeof form.value.is_available !== 'boolean'
  ) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบ'
    return
  }

  if (isSubmitting.value) return;

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await $fetch<OrderResponse>('/api/admin/addproduct', {
      method: 'POST',
      body: {
        name: form.value.name,
        description: form.value.description,
        price: form.value.price,
        image_url: form.value.image_url,
        is_available: form.value.is_available
      }
    })

    if (!res.success) {
      throw new Error(res.message || 'เกิดข้อผิดพลาด')
    }

    successMessage.value = 'ส่งคำสั่งเรียบร้อยแล้ว!'
    

  } catch (err: any) {
    errorMessage.value = err?.data?.message || err.message || 'เกิดข้อผิดพลาด'
  } finally {
    isSubmitting.value = false
  }
}

</script>


