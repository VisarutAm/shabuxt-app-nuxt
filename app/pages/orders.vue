<script setup lang="ts">
import { useBookingStore } from '~/store/useBookingStore'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

interface OrderResponse {
  success: boolean
  message?: string
}

const bookingStore = useBookingStore()
const router = useRouter()

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const submitOrder = async () => {
  if (!bookingStore.table_number || !bookingStore.booking_name || bookingStore.items.length === 0) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบก่อนส่งคำสั่งซื้อ'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await $fetch<OrderResponse>('/api/orders', {
      method: 'POST',
      body: {
        table_number: bookingStore.table_number,
        booking_name: bookingStore.booking_name,
        amount: bookingStore.amount,
        items: bookingStore.items,
      }
    })

    if (!res.success) {
      throw new Error(res.message || 'เกิดข้อผิดพลาดในการส่งคำสั่งซื้อ')
    }

    successMessage.value = 'ส่งคำสั่งซื้อเรียบร้อยแล้ว!'
    bookingStore.clearBooking()
    router.push('/success')

  } catch (err: any) {
    errorMessage.value = err.message
  } finally {
    isSubmitting.value = false
  }
}

</script>

<template>
  <div class="max-w-xl mx-auto p-4 bg-white shadow rounded flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">ยืนยันคำสั่งซื้อ</h2>

    <p class="mb-2"><strong>โต๊ะ:</strong> {{ bookingStore.table_number }}</p>
    <p class="mb-2"><strong>ชื่อผู้จอง:</strong> {{ bookingStore.booking_name }}</p>
    
    <ul class="mb-4 divide-y">
      <li v-for="item in bookingStore.items" :key="item.id" class="py-2">
        {{ item.itemName }} x {{ item.quantity }} = ฿{{ item.price * item.quantity }}
      </li>
    </ul>

    <p class="text-right text-lg font-bold mb-4">
      รวมทั้งหมด: ฿{{ bookingStore.amount }}
    </p>

    <button
      :disabled="isSubmitting"
      @click="submitOrder"
      class="bg-orange-300 text-black px-4 py-2 rounded hover:bg-orange-500 "
    >
      {{ isSubmitting ? 'กำลังส่ง...' : 'ส่งคำสั่งซื้อ' }}
    </button>
    
    <p class="text-red-500 mt-2" v-if="errorMessage">{{ errorMessage }}</p>
    <p class="text-green-600 mt-2" v-if="successMessage">{{ successMessage }}</p>
  </div>
</template>