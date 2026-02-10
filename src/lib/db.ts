import { supabase } from "@/lib/supabase";

// samples code only. not working
export async function getTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addTodo(title: string) {
  const { data, error } = await supabase
    .from("todos")
    .insert({ title })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// prod tb

export async function getProducts() {
  const { data, error } = await supabase.from("products").select();

  if (error) throw error;
  return data;
}
