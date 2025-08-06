import { supabase } from "~~/server/utils/db";
import { H3Event, sendError } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const orderId = Number(event.context.params?.id);
    if (!orderId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid or missing product ID",
      });
    }

    const { error } = await supabase.from("tables").delete().eq("id", orderId);

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
