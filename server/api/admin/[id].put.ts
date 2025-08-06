import { supabase } from "~~/server/utils/db";
import { H3Event, createError, readBody } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const id = Number(event.context.params?.id);
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "ID ไม่ถูกต้อง",
    });
  }

  const body = await readBody(event);
  const { name, description, price, image_url, is_available } = body;

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price: Number(price),
      image_url,
      is_available: Boolean(is_available),
    })
    .eq("id", id)
    .select(); // เพื่อให้ Supabase คืนข้อมูลที่อัปเดตแล้ว

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "ไม่สามารถอัปเดตสินค้าได้",
    });
  }

  return {
    success: true,
    data: data?.[0], // คืนรายการที่อัปเดต
  };
});
