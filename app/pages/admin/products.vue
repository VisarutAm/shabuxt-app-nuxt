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
            <!-- เพิ่มข้อมูลอื่นถ้าต้องการ -->
            <!-- <p class="text-sm text-gray-500">{{ product.description }}</p> -->
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
   middleware: 'admin'
});
import type { Product } from "../../../types/types";
const router = useRouter();

const editProduct = (id: number) => {
  router.push(`/admin/edit/${id}`);
};

const deleteProduct = async (id: number) => {
  const confirmDelete = confirm("คุณแน่ใจหรือว่าต้องการลบสินค้านี้?");
  if (!confirmDelete) return;

  try {
    const res = await $fetch<{ success: boolean; message?: string }>(
      `/api/admin/${id}`,
      {
        method: "DELETE",
      }
    );

    if (res.success) {
      alert("ลบสินค้าสำเร็จแล้ว");
      await fetchProducts(); // โหลดข้อมูลใหม่หลังลบ
    } else {
      throw new Error(res.message || "ลบสินค้าไม่สำเร็จ");
    }
  } catch (err: any) {
    alert(err.message || "เกิดข้อผิดพลาดในการลบ");
  }
};

const productData = ref<Product[]>([]);
const fetchProducts = async () => {
  try {
    const data = await $fetch<Product[]>("/api/products");
    productData.value = data;
  } catch (error) {
    alert("โหลดข้อมูลสินค้าไม่สำเร็จ");
  }
};

onMounted(async () => {
  await fetchProducts();
  console.log("📦 productData เปลี่ยน:", productData.value);
});
</script>
