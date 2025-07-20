'use server'
import { createSupabaseClient } from "../supabase"
import { CreateFAQ } from "../types"

export const createFaq = async ({ formData }: { formData: CreateFAQ }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .insert(formData)
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getFAQs = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const matchFAQs = async ({ bot_id, embedding }: { bot_id: string, embedding: number[] }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .rpc("match_faqs", {
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

export const getFAQById = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("id", id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getFAQsList = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .select("id, question")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const deleteFAQ = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getFAQsLength = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("faqs")
        .select("id")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}