<script setup lang="ts">
import FoodCard from "~/components/Foodcard.vue";
import { ref } from "vue";
import type { Product } from "../../types/types";
import { useBookingStore } from "~/store/useBookingStore";
import { POSITION } from 'vue-toastification';
import { useToastClient } from '~/composables/useToastClient.client';

const toast = await useToastClient(); 


const bookingStore = useBookingStore();

const {
  data: productData,
  error,
  pending,
} = await useFetch<Product[]>("/api/products");
const products = computed(() => productData.value || []);

// เก็บข้อมูลโต๊ะ 25 ตัว
const tables = ref(
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    available: true,
  }))
);

const reservedTables = ref<number[]>([]);

async function fetchReservedTables() {
  try {
    const res = await $fetch<{ table_number: number }[]>("/api/bookings");
    reservedTables.value = res.map((b) => b.table_number);

    tables.value = tables.value.map((table) => ({
      ...table,
      available: !reservedTables.value.includes(table.id),
    }));
  } catch (err) {
    console.error("Error fetching booked tables:", err);
  }
}

onMounted(() => {
  fetchReservedTables();
});

const selectedTable = ref<number | null>(bookingStore.table_number);
const bookingName = ref(bookingStore.booking_name);

function selectTable(id: number) {
  const table = tables.value.find((t) => t.id === id);
  if (table && table.available) {
    selectedTable.value = id;
  }
}

const showBookingModal = ref(false);

function openModal() {
  showBookingModal.value = true;
}

function closeModal() {
  showBookingModal.value = false;
}

function submitBooking(e: Event) {
  e.preventDefault();

  if (!bookingName.value) {
    toast?.error("กรุณากรอกชื่อ",{
  position: POSITION.TOP_CENTER, 
});
    return;
  }
  if (!selectedTable.value) {
    toast?.error("กรุณาเลือกโต๊ะ",{
  position: POSITION.TOP_CENTER, 
});
    return;
  }

  bookingStore.setBookingName(bookingName.value);
  bookingStore.setTable(selectedTable.value);

  toast?.success(
    `จองโต๊ะหมายเลข ${selectedTable.value} สำหรับคุณ ${bookingName.value} เรียบร้อยแล้ว`
  ,{
  position: POSITION.TOP_CENTER, 
});

  closeModal();
}

useSeoMeta({
  title: "ShaBuxt - ร้านชาบูพรีเมียมเสิร์ฟร้อนทุกคำ",
  description:
    "ลิ้มรสชาบูร้อน ๆ จากวัตถุดิบคุณภาพ พร้อมน้ำจิ้มสูตรพิเศษที่คุณจะลืมไม่ลง! สำรองโต๊ะล่วงหน้าได้แล้ววันนี้กับ ShaBuxt",

  ogTitle: "ShaBuxt - ชาบูพรีเมียมเพื่อคุณ",
  ogDescription:
    "เสิร์ฟความอร่อยแบบต้นตำรับ พร้อมบรรยากาศร้านชาบูที่อบอุ่น สำรองที่นั่งง่าย ๆ ผ่านเว็บไซต์",
  ogImage: "/shabuxt-banner.png",
  ogUrl: "https://shabuxt.com",

  twitterTitle: "ShaBuxt - ชาบูที่คุณต้องลอง",
  twitterDescription:
    "สำรองโต๊ะแล้วมาสัมผัสรสชาติชาบูพรีเมียมได้ที่ ShaBuxt วันนี้!",
  twitterImage: "/shabuxt-banner.png",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <main>
    <section class="bg-[#f1f1f1] px-10">
      <div
        class="container flex flex-col lg:flex-row items-center py-20 gap-10"
      >
        <div class="flex-1 order-2 lg:order-1 text-center lg:text-left">
          <h1 class="text-4xl lg:text-6xl font-extrabold mb-6 text-balance">
            ลิ้มรสชาบูพรีเมียม เสิร์ฟร้อน สดใหม่ทุกคำ ที่ ShaBuxt!
          </h1>

          <!-- ปุ่มเปิด modal -->
          <button
            @click="openModal"
            class="px-6 py-3 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition"
          >
            จองโต๊ะตอนนี้
          </button>

          <!-- Modal Overlay -->
          <div
            v-if="showBookingModal"
            class="fixed inset-0 bg-black/40 bg-opacity-50 flex justify-center items-center z-50"
          >
            <!-- Modal content -->
            <div
              class="bg-white rounded-lg max-w-md w-full p-6 relative"
              @click.stop
            >
              <button
                @click="closeModal"
                class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                aria-label="Close modal"
              >
                &times;
              </button>

              <h2 class="text-2xl font-bold mb-4">จองโต๊ะกับ ShaBuxt</h2>

              <form @submit="submitBooking">
                <label class="block mb-2 font-semibold">ชื่อ</label>
                <input
                  type="text"
                  class="w-full mb-4 border rounded px-3 py-2"
                  v-model="bookingName"
                  placeholder="กรุณากรอกชื่อ"
                />

                <label class="block mb-2 font-semibold">เลือกโต๊ะ</label>

                <div class="grid grid-cols-5 gap-2 mb-2">
                  <button
                    v-for="table in tables"
                    :key="table.id"
                    type="button"
                    :class="[
                      'rounded-lg flex flex-col items-center justify-center cursor-pointer transition',
                      table.available
                        ? selectedTable === table.id
                          ? 'bg-green-700 text-white'
                          : 'bg-green-400 hover:bg-green-500 text-white'
                        : 'bg-red-400 cursor-not-allowed text-gray-700',
                    ]"
                    :disabled="!table.available"
                    @click="selectTable(table.id)"
                    :aria-label="
                      'โต๊ะ ' +
                      table.id +
                      (table.available ? ' ว่าง' : ' ไม่ว่าง')
                    "
                  >
                    <span class="text-lg font-bold">{{ table.id }}</span>
                    <span class="text-sm">{{
                      table.available ? "ว่าง" : "ไม่ว่าง"
                    }}</span>
                  </button>
                </div>

                <button
                  type="submit"
                  class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
                  :disabled="!selectedTable || !bookingName"
                >
                  ส่งคำจอง
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="flex-1 order-1 lg:order-2">
          <NuxtImg
            sizes="xs:100vw sm:667px"
            src="/shabuxt-banner.png"
            format="webp"
            densities="x1"
            alt=""
          />
        </div>
      </div>
    </section>
    <p class="text-lg lg:text-xl my-2 px-10">
      "เลือกเมนูโปรดของคุณล่วงหน้า เพื่อเตรียมพร้อมความอร่อยทันทีเมื่อมาถึง
      ShaBuxt"
    </p>
    <div v-if="pending" class="text-gray-400 px-10">กำลังโหลด...</div>
    <div v-else-if="error" class="text-red-500 px-10">โหลดสินค้าล้มเหลว</div>
    <section
      id="menu"
      class="container mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
    >
      <FoodCard v-for="food in products" :key="food.id" :food="food" />
    </section>
  </main>
</template>
