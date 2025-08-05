<script setup lang="ts">

</script>

<template>
  <section
    class="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 text-center"
  >
   <NuxtImg width="350" src="/klipartz.com.png" format="webp" alt="success" />
    
    <h2 class="text-3xl font-semibold mb-4">จองสำเร็จแล้ว!</h2>
    <p class="mb-8 text-gray-700 max-w-md">
      ขอบคุณที่ใช้บริการของเรา คำสั่งซื้อของคุณถูกบันทึกเรียบร้อยแล้ว
    </p>
    <NuxtLink
      to="/"
      class="inline-block bg-green-600 text-black px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition"
    >
      กลับสู่หน้าหลัก
    </NuxtLink>
  </section>
</template>


