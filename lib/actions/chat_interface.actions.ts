'use server'
import { createSupabaseClient } from "../supabase"

export const createChatInterface = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("chat_interface")
        .insert({ bot_id: bot_id })
        .select("*")

    if (!data || error) {
        return { "error": error?.message || "Something went wrong. Try Again" }
    }
    return { "data": data[0] }
}

export const getChatInterface = async ({ bot_id }: { bot_id: string }) => {
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
        .from("chat_interface")
        .select("*")
        .eq("bot_id", bot_id)
        
        if (!data || data.length === 0 || error) {
        const res = await createChatInterface({ bot_id: bot_id })
        if (res.error) {
            return { 'error': res.error }
        }
        return { "data": res.data }
    }
    return { "data": data[0] }
}
