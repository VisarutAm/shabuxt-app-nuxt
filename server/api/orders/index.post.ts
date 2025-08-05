import { defineEventHandler, readBody } from "h3";
import { supabase } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { table_number, booking_name, items, amount } = body;

  if (
    !table_number ||
    !booking_name ||
    !items ||
    items.length === 0 ||
    !amount
  ) {
    return {
      statusCode: 400,
      body: { error: "ข้อมูลไม่ครบถ้วน" },
    };
  }

  const { error } = await supabase.from("tables").insert([
    {
      table_number,
      booking_name,
      items,
      amount,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return {
      statusCode: 500,
      body: { error: error.message },
    };
  }

  return { success: true };
});
