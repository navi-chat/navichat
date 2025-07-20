'use server'
import { createSupabaseClient } from "../supabase";
import { CreateBot } from "../types";
import { redirect } from "next/navigation";
import { getCompany } from "./companies.actions";

export const createBot = async ({ formData }: { formData: CreateBot }) => {
    const supabase = createSupabaseClient()
    const res = await getCompany()

    if (res.error) {
        redirect("/editor/onboarding")
    } else {
        const { data, error } = await supabase
            .from("bots")
            .insert({ ...formData, company: res.data.id })
            .select("*")

        if (!data || error) {
            return { "error": error?.message || "Something went wrong. Try Again" }
        }
        return { "data": data[0] }
    }
}

export const getBots = async () => {
    const supabase = createSupabaseClient()
    const res = await getCompany()

    if (res.error) {
        redirect("/editor/onboarding")
    } else {
        const { data, error } = await supabase
            .from("bots")
            .select("*")
            .eq("company", res.data.id)

        if (!data || error) {
            return { "error": error?.message || "Something went wrong. Try Again" }
        }
        return { "data": data }
    }
}

export const getBot = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()
    const { data, error } = await supabase
        .from("bots")
        .select("*")
        .eq("id", bot_id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}