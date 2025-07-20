'use server'
import { auth } from "@clerk/nextjs/server";
import { createSupabaseClient } from "../supabase";
import { CreateCompany } from "../types";

export const createCompany = async ({ formData }: { formData: CreateCompany }) => {
    const supabase = createSupabaseClient()
    const { userId } = await auth()

    const { data, error } = await supabase
        .from("companies")
        .insert({ ...formData, user_id: [userId] })
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getCompany = async () => {
    const supabase = createSupabaseClient()
    const { userId } = await auth()

    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .containedBy("user_id", [userId])

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getCompanyById = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const descreaseMessageCredits = async ({ id }: { id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("companies")
        .select("id, messageCredits")
        .eq("id", id)
    
    if (data) {
        const newMessageCredits = data[0].messageCredits - 1 
        await supabase
            .from("companies")
            .update({ messageCredits: newMessageCredits })
            .eq("id", id)
    }
}

export const updatePlan = async ({ plan, messageCredits, validTill, billingType }: { plan: "free" | "basic" | "pro", messageCredits: number, validTill: Date, billingType: "subscription" | "one-time" }) => {
    const supabase = createSupabaseClient()
    const { userId } = await auth()

    const { data, error } = await supabase
        .from("companies")
        .select("*")
        .containedBy("user_id", [userId])

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    const { } = await supabase
        .from("companies")
        .update({ plan, messageCredits: data[0].messageCredits + messageCredits, validTill, billingType })
        .eq("id", data[0].id)
    return { "data": data[0] }
}