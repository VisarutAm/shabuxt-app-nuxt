import { defineEventHandler, readBody } from "h3";
import { supabase } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { name, description, price, image_url, is_available } = body;

  if (!name || !description || !price || !image_url || !is_available) {
    return {
      statusCode: 400,
      body: { error: "ข้อมูลไม่ครบถ้วน" },
    };
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      description,
      price,
      image_url,
      is_available,
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
