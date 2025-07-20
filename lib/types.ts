export type CreateCompany = {
    name: string;
    niche: string[];
}

export type Company = {
    id: string;
    created_at: string;
    name: string;
    niche: string[];
    user_id: string;
    messageCredits: number;
    plan: "free" | "basic" | "pro";
    billingType: "subscription" | "one-time";
    validTill: Date;
    lastCreditsReset: Date;
}

export type Bot = {
    id: string;
    created_at: string;
    name: string;
    website: string;
    company: string;
}

export type CreateBot = {
    name: string;
    website: string;
}

export type CreateFAQ = {
    question: string;
    answer: string;
    embedding: number[];
    bot_id: string;
}

export type FAQ = {
    id: string;
    created_at: string;
    question: string;
    answer: string;
    embedding: string;
    bot_id: string;
}

export type CreateText = {
    title: string;
    text: string;
    embedding?: number[];
    bot_id: string;
}

export type TextType = {
    id: string;
    created_at: string;
    title: string;
    text: string;
    embedding: number[];
    bot_id: string;
    is_trained: boolean;
    data_id: string;
}

export type UpdateTextType = {
    title?: string;
    text?: string;
    embedding?: number[];
    bot_id?: string;
    is_trained?: boolean;
    data_id?: string;
}

export type CreateDataType = {
    title: string;
    data_list: string[];
    embedding?: number[][];
}

export type ChatInterfaceType = {
    id: string;
    bot_id: string;
    initial_message: string;
    created_at: string;
}

export type CustomChatInterfaceType = {
    initial_message: string;
    header_color: string;
}

export type CreateProductType = {
    title: string;
    description: string;
    image_urls?: string[];
    price?: number;
    currency?: string;
    other_info?: string;
    bot_id: string;
    embedding: number[];
}

export type ProductType = {
    id: string;
    created_at: string;
    title: string;
    description: string;
    image_urls?: string[];
    price?: number;
    currency?: string;
    other_info?: string;
    bot_id: string;
    embedding: number[];
}

export type CreateContactType = {
    type: string;
    contact: string;
    bot_id: string;
    embedding: number[];
}

export type ContactType = {
    id: string;
    created_at: string;
    type: string;
    contact: string;
    bot_id: string;
    embedding: number[];
}