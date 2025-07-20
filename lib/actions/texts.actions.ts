'use server'

import { createSupabaseClient } from "../supabase";
import { CreateText, UpdateTextType } from "../types";

export const createText = async ({ formData }: { formData: CreateText }) => {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase
        .from("texts")
        .insert(formData)
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getTexts = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("texts")
        .select("*")
        .eq("bot_id", bot_id)

    if(!data || error){
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const getTextById = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("texts")
        .select("*")
        .eq("id", id)

    if(!data || error){
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getTextsList = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("texts")
        .select("id, title")
        .eq("bot_id", bot_id)

    if(!data || error){
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const updateTexts = async ({ id, formData }: { id: string, formData: UpdateTextType }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("texts")
        .update(formData)
        .eq("id", id)

    if(!data || error){
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getTextsLength = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("texts")
        .select("id")
        .eq("bot_id", bot_id)

    if(!data || error){
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data }
}

export const matchTexts = async ({ bot_id, embedding }: { bot_id: string, embedding: number[] }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .rpc("match_texts", {
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
