// lib/database.js
import { supabase } from "../../client";

export async function saveProductDetailsToDatabase(productData) {
  const { data, error } = await supabase
    .from('products') // Ensure this table exists in your Supabase
    .insert([productData]);

  if (error) {
    console.error('Error inserting data:', error);
    throw new Error(error.message);
  }

  return data;
}
