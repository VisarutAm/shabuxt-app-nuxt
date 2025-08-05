import { supabase } from "../../utils/db";

export default defineEventHandler(async () => {
  const { data, error } = await supabase.from("tables").select("*");

  if (error) {
    return { error: error.message };
  }

  return data;
});
