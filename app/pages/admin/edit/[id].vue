<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-300 via-purple-300 to-indigo-900 p-8 ">
    <div class="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
      <h1 class="text-2xl font-bold text-center mb-6 text-purple-800">Edit Product</h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Product Name"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          v-model="form.description"
          placeholder="Description"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <input
          v-model.number="form.price"
          type="number"
          placeholder="Price"
          class="w-full border px-3 py-2 rounded"
          required
        />
        <input
          v-model="form.image_url"
          type="text"
          placeholder="Image URL"
          class="w-full border px-3 py-2 rounded"
          @input="previewImage = form.image_url"
          required
        />
        <label class="flex items-center space-x-2">
          <input type="checkbox" v-model="form.is_available" />
          <span>Available</span>
        </label>

        <div v-if="previewImage" class="mt-4">
          <p class="text-sm text-gray-600">Image Preview:</p>
          <img
            :src="previewImage"
            alt="Preview"
            class="w-32 h-32 object-cover shadow rounded-xl border-1 border-black"
          />
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
        >
          {{ isSubmitting ? '⌛ Wait...' : '✅ Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Product } from "../../../../types/types";

const route = useRoute();
const router = useRouter();


const form = ref<Product>({
  id: 0,
  name: "",
  description: "",
  price: 0,
  image_url: "",
  is_available: true,
});

const previewImage = ref("");
const isSubmitting = ref(false);

const fetchProduct = async (id: number) => {
  try {
    const data = await $fetch<{data:Product}>(`/api/admin/${id}`);
    form.value = data.data;    
    console.log("📦 Product data fetched:", data);
    previewImage.value = data.data.image_url;
  } catch (error) {
    alert("โหลดข้อมูลสินค้าไม่สำเร็จ");
    router.push("/admin/products");
  }
};


onMounted(() => {
  const id = Number(route.params.id);
  if (!id) {
    alert("Invalid product ID");
    router.push("/admin/products");
    return;
  }
  fetchProduct(id);
});

const handleSubmit = async () => {
  if (
    !form.value.name ||
    !form.value.description ||
    !form.value.price ||
    !form.value.image_url
  ) {
    alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    return;
  }

  isSubmitting.value = true;

  try {
    const res = await $fetch<{ success: boolean; message?: string }>(
      `/api/admin/${form.value.id}`,
      {
        method: "PUT",
        body: form.value,
      }
    );

    if (!res.success) {
      throw new Error(res.message || "แก้ไขสินค้าไม่สำเร็จ");
    }

    alert("แก้ไขสินค้าเรียบร้อยแล้ว");
    router.push("/admin/products");
  } catch (error: any) {
    alert(error.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

