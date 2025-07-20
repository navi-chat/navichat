'use server'
import { createSupabaseClient } from "../supabase"
import { CreateContactType } from "../types"

export const createContact = async ({ formData }: { formData: CreateContactType }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("contacts")
        .insert(formData)
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getContacts = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const getContactById = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getContactsList = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("contacts")
        .select("type, id, contact")
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

export const getContactsLength = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("contacts")
        .select("id")
        .eq("bot_id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const matchContacts = async ({ bot_id, embedding }: { bot_id: string, embedding: number[] }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .rpc("match_contacts", {
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
