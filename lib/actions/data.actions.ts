'use server'

import { createSupabaseClient } from "../supabase";
import { CreateDataType } from "../types";

export const createData = async ({ formData }: { formData: CreateDataType }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("data")
        .insert(formData)
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}