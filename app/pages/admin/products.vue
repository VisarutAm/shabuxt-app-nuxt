<template>
  <div>
    <div
      class="min-h-screen bg-gradient-to-br from-purple-300 via-purple-300 to-indigo-900 p-8"
    >
      <h1 class="text-2xl font-bold mb-4 text-center">Product List</h1>
      <div v-for="product in productData" :key="product.id" class="py-1">
        <div
          class="max-w-md mx-auto bg-white p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0"
        >
          <!-- รูปสินค้า -->
          <NuxtImg
            :src="product.image_url"
            alt="product"
            class="w-full sm:w-20 sm:h-20 h-48 object-cover rounded-lg"
          />

          <!-- รายละเอียดสินค้า -->
          <div class="flex-1 text-center sm:text-left">
            <p class="text-lg font-semibold text-gray-800">
              {{ product.name }}
            </p>
          </div>

          <!-- ปุ่มแก้ไข/ลบ -->
          <div class="flex justify-center sm:justify-end space-x-4">
            <NuxtImg
              src="/edit.png"
              alt="edit"
              class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
              @click="editProduct(product.id)"
            />
            <NuxtImg
              src="/bin.png"
              alt="delete"
              class="w-6 h-6 cursor-pointer hover:scale-110 transition-transform"
              @click="deleteProduct(product.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
definePageMeta({
  layout: "admin",
  middleware: "admin",
});

import Swal from "sweetalert2";
import type { Product } from "../../../types/types";
import { POSITION } from "vue-toastification";
import { useToastClient } from "~/composables/useToastClient.client";

const router = useRouter();
let toast: any;

const editProduct = (id: number) => {
  router.push(`/admin/edit/${id}`);
};

const deleteProduct = async (id: number) => {
  const result = await Swal.fire({
    title: "คุณแน่ใจไหม?",
    text: "คุณต้องการลบสินค้านี้จริงหรือไม่",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่, ลบเลย!",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#e3342f",
    cancelButtonColor: "#6c757d",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await $fetch<{ success: boolean; message?: string }>(
      `/api/admin/${id}`,
      { method: "DELETE" }
    );

    if (res.success) {
      await Swal.fire("ลบสำเร็จ!", "", "success");
      await fetchProducts();
    } else {
      throw new Error(res.message || "ลบสินค้าไม่สำเร็จ");
    }
  } catch (err: any) {
    Swal.fire("เกิดข้อผิดพลาด", err.message || "ลบไม่สำเร็จ", "error");
  }
};

const productData = ref<Product[]>([]);
const fetchProducts = async () => {
  try {
    const data = await $fetch<Product[]>("/api/products");
    productData.value = data;
  } catch (error) {
    toast?.error("โหลดข้อมูลสินค้าไม่สำเร็จ", {
      position: POSITION.TOP_CENTER,
    });
  }
};

onMounted(async () => {
  toast = await useToastClient();
  const { data } = await useLazyFetch<Product[]>("/api/products");
  productData.value = data.value || [];
});
</script>
