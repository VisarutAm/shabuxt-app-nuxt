import { supabase } from "~~/server/utils/db";
import { H3Event, sendError } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const productId = Number(event.context.params?.id);
    if (!productId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or missing product ID",
      });
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return sendError(event, error as Error);
  }
});
