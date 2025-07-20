'use client'
import React, { useState } from 'react'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Loader, Upload, X } from 'lucide-react'
import { useSources } from '@/app/(root)/editor/chat-bots/[bot_id]/sources/layout'
import { useProductSource } from '@/app/(root)/editor/chat-bots/[bot_id]/sources/products/page'
import currencyCodes from "currency-codes"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import Image from 'next/image'
import { uploadImageFile } from '@/lib/actions/images.actions'
import { createProduct } from '@/lib/actions/products.actions'
import { embeddingsModel } from '@/lib/embeddingModel'


const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    images: z.string().url().optional(),
    description: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    price: z.number().optional(),
    currency: z.string().optional(),
})

const CreateProductSource = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            currency: "INR"
        },
    })

    const currencies = currencyCodes.data

    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const { refetch } = useProductSource()
    const { sourcesRefetch } = useSources()
    const [imageFile, setImageFile] = useState<File>()

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        const embedding = await embeddingsModel.embedQuery(`Product Title: ${values.title}, Description: ${values.description}${values.price && `Price: ${values.price} ${values.currency}`}`)
        const imageURLs: string[] = []
        if (imageFile) {
            const image = await uploadImageFile({ path: `product_images/product_image_${new Date().toISOString()}.png`, file: imageFile })
            if (image.error) {
                toast.error(image.error)
                return
            }
            if (image.data) {
                imageURLs.push(image.data.publicUrl)
            }
        }
        const res = await createProduct({
            formData: {
                title: values.title,
                description: values.description,
                currency: values.currency,
                price: values.price,
                image_urls: imageURLs,
                bot_id: bot_id,
                embedding: embedding
            }
        })

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Product added successfully.")
            form.reset()
            refetch()
            sourcesRefetch()
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Asus Vivobook 15" className='input' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                        <FormItem>
                            <FormLabel>Image (Optional)</FormLabel>
                            <FormControl>
                                {form.watch("images") !== undefined ? (
                                    <div className='p-2 border rounded-lg w-fit'>
                                        <Image src={form.watch("images") || ''} alt='image' width={160} height={0} className='h-40 object-contain rounded-lg' />
                                        <div className='h-40 w-full -mt-40 flex items-start justify-end'>
                                            <Button variant={"outline"} className='size-8' onClick={() => {
                                                form.resetField("images")
                                                setImageFile(undefined)
                                            }}> <X /></Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className=' h-28 border-2 border-dashed rounded-lg cursor-pointer'>
                                        <Input type="file" accept="image/*" className='h-28 opacity-0 -mb-28 cursor-pointer' onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file)
                                                const url = URL.createObjectURL(file)
                                                form.setValue("images", url)
                                            }
                                        }} />
                                        <div className='w-full h-28 flex items-center justify-center'>
                                            <p className='flex gap-1 items-center flex-col'><Upload className='size-5' /> Upload an Image</p>
                                        </div>
                                    </div>
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter product description here..." className='input min-h-24 pt-3' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className='space-y-2 w-full'>
                    <FormLabel>Price (Optional)</FormLabel>
                    <div className='flex gap-4 w-full'>
                        <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select {...field}>
                                            <SelectTrigger>
                                                <SelectValue className='input' placeholder="Currency" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {currencies.map((currency) => (
                                                    <SelectItem key={currency.code} value={currency.code}>{currency.currency}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className='input' placeholder='Price' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='flex justify-end'>
                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid} className='btn'>
                        Add Product {form.formState.isSubmitting && <Loader className="animate-spin size-5" />}
                    </Button>
                </div>
            </form>
        </Form >
    )
}

export default CreateProductSource
