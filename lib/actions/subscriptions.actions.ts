'use server'

import Razorpay from "razorpay"
import crypto from 'crypto';

export const createSubscription = async ({ plan_id, total_count }: { plan_id: string, total_count: number }) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_LIVE_KEY_ID,
        key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET
    })

    const res = await instance.subscriptions.create({
        plan_id: plan_id,
        total_count: total_count
    })
    return {
        subscription_id: res.id || "",
        razorpay_key: process.env.RAZORPAY_LIVE_KEY_ID || ""
    }
}

export const createOrder = async ({ amount }: { amount: number }) => {
    const instance = new Razorpay({
        key_id: process.env.RAZORPAY_LIVE_KEY_ID,
        key_secret: process.env.RAZORPAY_LIVE_KEY_SECRET
    })

    const res = await instance.orders.create({
        amount: amount * 100,
        currency: "INR"
    })
    return {
        order_id: res.id || "",
        amount: res.amount,
        currency: res.currency,
        razorpay_key: process.env.RAZORPAY_LIVE_KEY_ID || ""
    }
}

export async function verifySignature({order_id, payment_id, signature}: {order_id: string, payment_id: string, signature: string}): Promise<boolean> {
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_LIVE_KEY_SECRET!)
      .update(order_id + "|" + payment_id)
      .digest("hex");
  
    return generated_signature === signature;
  }  
