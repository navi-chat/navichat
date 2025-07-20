'use server'

import { createSupabaseClient } from "../supabase";

export const uploadImageFile = async ({ path, file }: { path: string, file: File }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .storage
        .from("images")
        .upload(path, file)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    const res = await getImageFile({ path: path })
    return { "data": res.data }
}

export const getImageFile = async ({ path }: { path: string }) => {
    const supabase = await createSupabaseClient();

    const { data } = await supabase
        .storage
        .from("images")
        .getPublicUrl(path)

    if (!data) {
        return { "error": "Something went wrong. Try Again" }
    }
    return { "data": data }
}