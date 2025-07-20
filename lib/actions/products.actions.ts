'use server'

import { createSupabaseClient } from "../supabase";
import { CreateProductType } from "../types";

export const createProduct = async ({ formData }: { formData: CreateProductType }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("products")
        .insert(formData)
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getProducts = async ({ bot_id }: { bot_id: string }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const getProductById = async ({ id }: { id: string }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getProductsList = async ({ bot_id }: { bot_id: string }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("products")
        .select("id, title")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const getProductsLength = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("products")
        .select("id")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const matchProducts = async ({ bot_id, embedding }: { bot_id: string, embedding: number[] }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .rpc("match_products", {
            query_embedding: embedding,
            match_threshold: 0.7,
            match_count: 5,
            input_bot_id: bot_id
        })

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}
