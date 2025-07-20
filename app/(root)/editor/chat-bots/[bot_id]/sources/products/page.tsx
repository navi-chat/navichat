'use client'
import { ProductType } from '@/lib/types'
import { useParams } from 'next/navigation'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox'

import { Box, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CreateProductSource from '@/components/CreateProductSource'
import { getProducts } from '@/lib/actions/products.actions'
import { productsSourceContext } from '@/hooks/useSource'

const Products = () => {
    const [products, setProducts] = useState<ProductType[]>()
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const refetch = async () => {
        const res = await getProducts({ bot_id: bot_id })
        if (res.error) {
            toast(res.error)
        }
        setProducts(res.data)
    }
    useEffect(() => {
        refetch()
    }, [bot_id])
    return (
        <productsSourceContext.Provider value={{ refetch }}>
            <div className='w-full'>
                <div className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full'>
                        <div className='border rounded-lg p-5 w-full space-y-2'>
                            <h2 className='text-lg font-bold'>Products</h2>
                            <p className='text-muted-foreground text-sm'>Add Products to your AI Chatbot.</p>
                            <CreateProductSource />
                        </div>
                        <div className='border rounded-lg p-5 w-full mt-5 mb-20'>
                            <h2 className='text-lg font-bold'>Product Sources</h2>
                            <div className='mt-2'>
                                <div className='px-2 py-3 flex items-center justify-between'>
                                    <div className='text-sm flex gap-2 items-center'><Checkbox /> Select All</div>
                                    <div>
                                        {/* <Select>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">Light</SelectItem>
                                                <SelectItem value="dark">Dark</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select> */}
                                    </div>
                                </div>
                                <Table className='border-t'>
                                    <TableBody>
                                        {products?.map((product) => (
                                            <TableRow key={product.id} className='hover:bg-background'>
                                                <TableCell><Checkbox /></TableCell>
                                                <TableCell className='pl-5'>
                                                    <div className='bg-accent rounded-full size-9 p-2 flex items-center justify-center'>
                                                        <Box className='text-muted-foreground' />
                                                    </div>
                                                </TableCell>
                                                <TableCell className='w-full font-medium'><span>{product.title}</span></TableCell>
                                                <TableCell className='w-80'>
                                                    {product.price && (
                                                        <div>
                                                            <p>{product.currency}</p>
                                                            <p>{product.price}</p>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant={"ghost"}>
                                                        <Ellipsis />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </productsSourceContext.Provider>
    )
}

export default Products
