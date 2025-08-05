import { defineStore } from "pinia";
import type { Booking, MenuItem } from "../../types/types";

export const useBookingStore = defineStore("booking", {
  state: (): Booking => ({
    table_number: null,
    booking_name: "",
    items: [],
    amount: 0,
  }),

  actions: {
    setTable(id: number) {
      this.table_number = id;
    },

    setBookingName(name: string) {
      this.booking_name = name;
    },

    addItem(item: Omit<MenuItem, "quantity"> & { quantity?: number }) {
      const index = this.items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.items[index]!.quantity += item.quantity ?? 1;
      } else {
        const newItem: MenuItem = {
          id: item.id,
          itemName: item.itemName,
          price: item.price,
          quantity: item.quantity ?? 1,
        };
        this.items.push(newItem);
      }
      this.calculateAmount();
    },

    removeItem(index: number) {
      this.items.splice(index, 1);
      this.calculateAmount();
    },

    calculateAmount() {
      this.amount = this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },

    clearBooking() {
      this.table_number = null;
      this.booking_name = "";
      this.items = [];
      this.amount = 0;
    },
  },
});
