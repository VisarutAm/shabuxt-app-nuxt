export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
}

// --------Order---------//

export interface MenuItem {
  id: number;
  itemName: string;
  price: number;
  quantity: number;
}

export interface Booking {
  id: number;
  table_number: number | null;
  booking_name: string;
  items: MenuItem[];
  amount: number;
}
