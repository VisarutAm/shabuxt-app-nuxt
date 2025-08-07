<script setup lang="ts">
import { useBookingStore } from '~/store/useBookingStore'

const bookingStore = useBookingStore ()

const props = defineProps<{
  food: {
    id: number
    name: string
    price: number
    image_url: string
    description?: string
    is_available: boolean
  }
}>()

const addToOrder = () => {
  const index = bookingStore.items.findIndex(i => i.id === props.food.id)

  if (index !== -1) {
    bookingStore.items[index]!.quantity += 1
  } else {
    const newItem = {
      id: props.food.id,
      itemName: props.food.name,
      price: props.food.price,
      quantity: 1,
    }
    bookingStore.addItem(newItem)
  }

  bookingStore.calculateAmount()
}


const removeFromOrder = () => {
  const index = bookingStore.items.findIndex(i => i.id === props.food.id)

  if (index !== -1) {
    const item = bookingStore.items[index]
    if (item && item.quantity > 1) {
      item.quantity -= 1
    } else {
      bookingStore.removeItem(index)
    }
    bookingStore.calculateAmount()
  }
}
</script>

<template>
  <div
    class="border rounded-lg shadow hover:shadow-lg transition cursor-pointer max-w-xs bg-white"
    :class="!food.is_available ? 'opacity-50 cursor-not-allowed' : ''"
  >
    <NuxtImg
      :src="food.image_url"
      alt="food.name"
      class="rounded-t-lg w-full h-48 object-cover"
      format="webp"
      width="320"
      height="192"
    />
    <div class="p-4">
      <h3 class="text-xl font-semibold mb-2">{{ food.name }}</h3>
      <p class="text-gray-600 mb-4 truncate" v-if="food.description">
        {{ food.description }}
      </p>
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold text-orange-600">
          ฿{{ food.price.toLocaleString() }}
        </span>
         <div class="flex justify-between items-center mt-4">
           <button
           @click="addToOrder"
            class="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="!food.is_available"
          >
            ➕
          </button>
          <p class="font-bold text-lg text-primary px-2">
 {{ bookingStore.items.find(i => i.id === food.id)?.quantity || 0 }}
</p>

<button
@click="removeFromOrder"
            class="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            :disabled="!food.is_available"
          >
            ➖
          </button>
        </div>
       
      </div>
    </div>
  </div>
</template>
