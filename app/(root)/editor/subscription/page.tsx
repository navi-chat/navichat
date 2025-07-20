'use client'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Check, Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { createOrder, createSubscription, verifySignature } from '@/lib/actions/subscriptions.actions'
import { redirect } from 'next/navigation'
import Razorpay from 'razorpay'
import { Company } from '@/lib/types'
import { getCompany, updatePlan } from '@/lib/actions/companies.actions'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'


const Subscription = () => {
    const user = useUser().user
    const [billing, setBilling] = useState<"monthly" | "yearly" | "one-time-purchase">("monthly")
    const [company, setCompany] = useState<Company>()
    const [amount, setAmount] = useState(6)
    const [noOfMonthsBasic, setNoOfMonthsBasic] = useState(1)
    const [noOfMonthsPro, setNoOfMonthsPro] = useState(1)

    const paymentOptions = ({ key, id, handler }: { key: string, id: string, handler: (response: any) => void }) => {
        const options = {
            key: key,
            subscription_id: id,
            name: "NaviChat",
            description: "Subscription Payment",
            handler: handler
        }
        return options
    }

    useEffect(() => {
        const initialCall = async () => {
            const res = await getCompany();
            if (res.data) {
                setCompany(res.data)
            }
        }
        initialCall()
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
        return () => {
            document.body.removeChild(script)
        }
    }, [])

    return (
        <>
            <Header />
            <section className='p-5 w-full space-y-5'>
                <div className='flex gap-5 items-center'>
                    <h1 className='text-2xl text-foreground font-bold'>Subscription</h1>
                    <div className='p-1 flex items-center gap-1 bg-accent border rounded-lg *:px-5 *:py-2 *:rounded-md *:cursor-pointer transition-all *:transition-all'>
                        <div className={`${billing === "monthly" ? 'bg-white border' : 'bg-accent'}`} onClick={() => setBilling("monthly")}>Monthly</div>
                        <div className={`${billing === "yearly" ? 'bg-white border' : 'bg-accent'}`} onClick={() => setBilling("yearly")}>Yearly</div>
                        <div className={`${billing === "one-time-purchase" ? 'bg-white border' : 'bg-accent'}`} onClick={() => setBilling("one-time-purchase")}>One Time Purchase</div>
                    </div>
                </div>
                <div className='flex gap-5 w-full flex-wrap'>
                    <div className='w-sm border rounded-lg p-5 space-y-3'>
                        <h2 className='font-semibold text-xl'>Starter</h2>
                        <div>
                            <h3 className='text-3xl font-bold'>Free</h3>
                        </div>
                        <div>
                            {company?.plan === "free" && (
                                <Button variant={"outline"} className='submit-btn w-full h-12'>Current Plan</Button>
                            )}
                        </div>
                        <div className='w-full *:text-sm space-y-1'>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>100 message credits</span></p>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>1 ChatBot</span></p>
                        </div>
                    </div>
                    <div className='w-sm border rounded-lg p-5 space-y-3'>
                        <h2 className='font-semibold text-xl'>Basic</h2>
                        <div>
                            <h3 className='text-3xl font-bold'>{billing === "yearly" ? '₹499' : billing === "monthly" ? '₹529' : `₹${(noOfMonthsBasic * 529)}`}</h3>
                            <p>{billing !== "one-time-purchase" ? 'per' : `for ${noOfMonthsBasic}`} month {billing === "yearly" && `, ₹${499 * 12} billed annually`}</p>
                            {billing === "one-time-purchase" && (
                                <div className='flex items-center mt-1'>
                                    <Button className='' variant={"outline"} onClick={() => noOfMonthsBasic !== 1 && setNoOfMonthsBasic(noOfMonthsBasic - 1)}><Minus /></Button>
                                    <p className='px-4'>{noOfMonthsBasic} Month</p>
                                    <Button className='' variant={"outline"} onClick={() => setNoOfMonthsBasic(noOfMonthsBasic + 1)}><Plus /></Button>
                                </div>
                            )}
                        </div>
                        <div>
                            {company?.plan === "basic" ? (
                                <Button variant={"outline"} className='submit-btn w-full h-12'>Current Plan</Button>
                            ) : (
                                <Button className='submit-btn w-full h-12' onClick={async () => {
                                    if (billing === "monthly") {
                                        const res = await createSubscription({ plan_id: "plan_QvBdmRQL6Al1mU", total_count: 12 })
                                        const options = paymentOptions({
                                            key: res.razorpay_key, id: res.subscription_id, handler: async (response: any) => {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const resUpdatePlan = await updatePlan({
                                                    plan: "basic",
                                                    messageCredits: 20000,
                                                    validTill: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                                                    billingType: "subscription"
                                                })
                                                toast.success("Subscription created successfully.")
                                            }
                                        })
                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open()
                                    } else if (billing === "yearly") {
                                        const res = await createSubscription({ plan_id: "plan_QvBeHw7hr7hq4d", total_count: 2 })
                                        const options = paymentOptions({
                                            key: res.razorpay_key, id: res.subscription_id, handler: async (response: any) => {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const resUpdatePlan = await updatePlan({
                                                    plan: "basic",
                                                    messageCredits: 20000,
                                                    validTill: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)),
                                                    billingType: "subscription"
                                                })
                                                toast.success("Subscription created successfully.")
                                            }
                                        })
                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open()
                                    } else if (billing === "one-time-purchase") {
                                        const totalAmount = noOfMonthsBasic * 529; // ₹ per month * months
                                        const res = await createOrder({ amount: totalAmount });

                                        const options = {
                                            key: res.razorpay_key,
                                            amount: res.amount,
                                            currency: res.currency,
                                            order_id: res.order_id,
                                            name: "NaviChat",
                                            description: `One-time purchase for ${noOfMonthsBasic} month(s)`,
                                            handler: async function (response: any) {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const initialDate = company?.plan === "basic" ? new Date(company.validTill) : new Date(Date.now());

                                                const resUpdatePlan = await updatePlan({
                                                    plan: "basic",
                                                    messageCredits: 20000 * noOfMonthsBasic,
                                                    validTill: new Date(initialDate.getTime() + (noOfMonthsBasic * 30 * 24 * 60 * 60 * 1000)), // ← FIXED
                                                    billingType: "one-time"
                                                });
                                                toast.success("Purchased successfully.")
                                            },
                                            prefill: {
                                                name: user?.fullName,
                                                email: user?.emailAddresses[0],
                                            },
                                            theme: {
                                                color: "#3399cc",
                                            },
                                        };

                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open();
                                    }
                                }}>Upgrade Plan</Button>
                            )}
                        </div>
                        <div className='w-full *:text-sm space-y-1'>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>{billing !== "one-time-purchase" ? "20,000" : 20000 * noOfMonthsBasic} message credits (then ₹100 per 10,000)</span></p>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>1 ChatBot</span></p>
                        </div>
                    </div>
                    <div className='w-sm border rounded-lg p-5 space-y-3'>
                        <h2 className='font-semibold text-xl'>Pro</h2>
                        <div>
                            <h3 className='text-3xl font-bold'>{billing === "yearly" ? '₹1399' : billing === "monthly" ? '₹1449' : `₹${(noOfMonthsPro * 1449)}`}</h3>
                            <p>{billing !== "one-time-purchase" ? 'per' : `for ${noOfMonthsPro}`} month {billing === "yearly" && `, ₹${1399 * 12} billed annually`}</p>
                            {billing === "one-time-purchase" && (
                                <div className='flex items-center mt-1'>
                                    <Button className='' variant={"outline"} onClick={() => noOfMonthsPro !== 1 && setNoOfMonthsPro(noOfMonthsPro - 1)}><Minus /></Button>
                                    <p className='px-4'>{noOfMonthsPro} Month</p>
                                    <Button className='' variant={"outline"} onClick={() => setNoOfMonthsPro(noOfMonthsPro + 1)}><Plus /></Button>
                                </div>
                            )}
                        </div>
                        <div>
                            {company?.plan === "pro" ? (
                                <Button variant={"outline"} className='submit-btn w-full h-12'>Current Plan</Button>
                            ) : (
                                <Button variant={company?.plan === "basic" ? "default" : "outline"} className='submit-btn w-full h-12' onClick={async () => {
                                    if (billing === "monthly") {
                                        const res = await createSubscription({ plan_id: "plan_QvBfBcBGfwxIiL", total_count: 12 })
                                        const options = paymentOptions({
                                            key: res.razorpay_key, id: res.subscription_id, handler: async (response: any) => {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const resUpdatePlan = await updatePlan({
                                                    plan: "pro",
                                                    messageCredits: 80000,
                                                    validTill: new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)),
                                                    billingType: "subscription"
                                                })
                                                toast.success("Subscription created successfully.")
                                            }
                                        })
                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open()
                                    } else if (billing === "yearly") {
                                        const res = await createSubscription({ plan_id: "plan_QvBehwp4NnPRVk", total_count: 2 })
                                        const options = paymentOptions({
                                            key: res.razorpay_key, id: res.subscription_id, handler: async (response: any) => {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const resUpdatePlan = await updatePlan({
                                                    plan: "pro",
                                                    messageCredits: 80000,
                                                    validTill: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)),
                                                    billingType: "subscription"
                                                })
                                                toast.success("Subscription created successfully.")
                                            }
                                        })
                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open()
                                    } else if (billing === "one-time-purchase") {
                                        const totalAmount = noOfMonthsPro * 1449; // ₹ per month * months
                                        const res = await createOrder({ amount: totalAmount });

                                        const options = {
                                            key: res.razorpay_key,
                                            amount: res.amount,
                                            currency: res.currency,
                                            order_id: res.order_id,
                                            name: "NaviChat",
                                            description: `One-time purchase for ${noOfMonthsPro} month(s)`,
                                            handler: async function (response: any) {
                                                const signature = await verifySignature({ order_id: response.razorpay_order_id, payment_id: response.razorpay_payment_id, signature: response.razorpay_signature })
                                                const initialDate = company?.plan === "pro" ? new Date(company.validTill) : new Date(Date.now());

                                                const resUpdatePlan = await updatePlan({
                                                    plan: "pro",
                                                    messageCredits: 80000 * noOfMonthsPro,
                                                    validTill: new Date(initialDate.getTime() + (noOfMonthsPro * 30 * 24 * 60 * 60 * 1000)), // ← FIXED
                                                    billingType: "one-time"
                                                });
                                                toast.success("Purchased successfully.")
                                            },
                                            prefill: {
                                                name: user?.fullName,
                                                email: user?.emailAddresses[0],
                                            },
                                            theme: {
                                                color: "#3399cc",
                                            },
                                        };

                                        const razorpay = new (window as any).Razorpay(options);
                                        razorpay.open();
                                    }

                                }}>Upgrade Plan</Button>
                            )}
                        </div>
                        <div className='w-full *:text-sm space-y-1'>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>{billing !== "one-time-purchase" ? '80,000' : noOfMonthsPro * 80000} message credits (then ₹100 per 10,000)</span></p>
                            <p className='flex items-center gap-2'><Check className='size-4' /> <span>Unlimited ChatBots</span></p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Subscription
