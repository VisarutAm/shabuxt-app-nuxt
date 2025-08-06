import { supabase } from "~~/server/utils/db";
import { H3Event, createError } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const productId = Number(event.context.params?.id);
  if (!productId) {
    throw createError({
      statusCode: 400,
      statusMessage: "รหัสสินค้าไม่ถูกต้อง",
    });
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: "ไม่พบสินค้านี้",
    });
  }

  return {
    success: true,
    data,
  };
});
