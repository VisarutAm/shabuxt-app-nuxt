import { supabase } from "../../utils/db";

export default defineEventHandler(async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    return { error: error.message };
  }

  return data;
});
