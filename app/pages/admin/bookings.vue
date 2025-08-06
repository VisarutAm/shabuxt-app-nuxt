<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-300 via-purple-300 to-indigo-900 p-8">
    <h1 class="text-2xl font-bold mb-4 text-center">Bookings</h1>
   
    <div  v-for="(booking, index) in bookings" :key="booking.id"  class="border p-4 rounded-lg shadow-sm bg-white mb-2">
     
          <!-- คลิกเพื่อเปิด/ปิดรายละเอียด -->
          <div class="flex justify-between items-center cursor-pointer">
      <h1 class="text-xl font-bold text-gray-700">
        โต๊ะ {{ booking.table_number }}
      </h1>
      <!-- ลูกศร toggle -->
       <h2 class="text-xl font-bold text-gray-700">คุณ {{ booking.booking_name }}</h2>
      <NuxtImg
        :src="expandedIndex === index ? '/upload.png' : '/down-arrow.png'"
        alt="toggle"
        class="w-5 h-5 hover:scale-110 transition-transform"
        @click="toggleBooking(index)"
      />
    </div>

    <!-- เนื้อหารายละเอียด -->
    <div v-show="expandedIndex === index" class="mt-2">
      <!-- รายการอาหาร -->
      <div>
        <p class="font-semibold text-gray-600">รายการที่มีการสั่งซื้อ:</p>
        <ul class="list-disc list-inside text-gray-800">
          <li v-for="item in booking.items" :key="item.id">
            {{ item.itemName }} - {{ item.quantity }} x {{ item.price }} ฿
          </li>
        </ul>
      </div>

      <!-- ราคารวม -->
      <div class="mt-2 text-right font-bold text-green-700">
        ราคารวม: {{ booking.amount }} ฿
      </div>

      <!-- ปุ่มลบ -->
      <div class="flex justify-end mt-2">
        <NuxtImg
          src="/bin.png"
          alt="delete"
          class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
          @click="deleteBooking(booking.id)" 
          />
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  layout: 'admin',
   middleware: 'admin'
})
import type { Booking } from '~~/types/types'

const bookingData = ref<Booking[] | null>(null)

const fetchBookings = async () => {
  const { data, error } = await useFetch<Booking[]>('/api/bookings', {
    key: 'fetch-bookings-' + Date.now(), // ป้องกัน cache
  })
  if (error.value) {
    console.error('❌ Error loading bookings:', error.value)
    return
  }
  bookingData.value = data.value || []
}

const bookings = computed(() => bookingData.value || [])

onMounted(async () => {
  await fetchBookings()
})

onMounted(async () => {
  console.log("📦 bookingData:", bookingData.value)
})

import { ref } from 'vue'

const expandedIndex = ref<number | null>(null)

const toggleBooking = (index: number) => {
  expandedIndex.value = expandedIndex.value === index ? null : index
}

const deleteBooking = async (id: number) => {
  const confirmDelete = confirm("คุณแน่ใจหรือว่าต้องการลบข้อมูลการจองนี้?");
  if (!confirmDelete) return;

  try {
    const res = await $fetch<{ success: boolean; message?: string }>(
      `/api/admin/orders/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.success) {
      alert("ลบข้อมูลแล้ว");
      await fetchBookings(); // ✅ โหลดใหม่ตรงนี้
    } else {
      throw new Error(res.message || "ลบสินค้าไม่สำเร็จ");
    }
  } catch (err: any) {
    alert(err.message || "เกิดข้อผิดพลาดในการลบ");
  }
};
</script>
