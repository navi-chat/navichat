'use client'
import CreateTextSource from '@/components/CreateTextSource'
import { getTexts } from '@/lib/actions/texts.actions'
import { TextType } from '@/lib/types'
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

import { Ellipsis, TextIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const textSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useTextSource = () => {
    const context = useContext(textSourceContext)
    if (!context) throw new Error('useTextSource must be used within TextSourceProvider')
    return context
}

const Text = () => {
    const [texts, setTexts] = useState<TextType[]>()
    const [selectedTexts, setSelectedTexts] = useState<string[]>([])

    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const refetch = async () => {
        const res = await getTexts({ bot_id: bot_id })
        if (res.error) {
            toast(res.error)
        }
        setTexts(res.data)
    }
    useEffect(() => {
        refetch()
    }, [bot_id])
    return (
        <textSourceContext.Provider value={{ refetch }}>
            <div className='w-full'>
                <div className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full'>
                        <div className='border rounded-lg p-5 w-full space-y-2'>
                            <h2 className='text-lg font-bold'>Text</h2>
                            <p className='text-muted-foreground text-sm'>Add text based source to train your AI Chatbot.</p>
                            <CreateTextSource />
                        </div>
                        <div className='border rounded-lg p-5 w-full mt-5 mb-20'>
                            <h2 className='text-lg font-bold'>Text Sources</h2>
                            <div className='mt-2'>
                                <div className='px-2 py-3 flex items-center justify-between'>
                                    <div className='text-sm flex gap-2 items-center'><Checkbox onCheckedChange={(checked) => {
                                        return checked ? setSelectedTexts(texts?.map((text) => text.id) ?? []) : setSelectedTexts([])
                                    }} checked={selectedTexts.length === texts?.length} /> Select All</div>
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
                                        {texts?.map((text) => (
                                            <TableRow key={text.id} className='hover:bg-background'>
                                                <TableCell><Checkbox checked={selectedTexts.includes(text.id)} onCheckedChange={(checked) => {
                                                    return checked ? setSelectedTexts((prev) => [...prev, text.id]) : setSelectedTexts((prev) => prev.filter((item) => item !== text.id))
                                                }} /></TableCell>
                                                <TableCell className='pl-5'>
                                                    <div className='bg-accent rounded-full size-9 p-2 flex items-center justify-center'>
                                                        <TextIcon className='text-muted-foreground' />
                                                    </div>
                                                </TableCell>
                                                <TableCell className='w-full font-medium'><span>{text.title}</span></TableCell>
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
                            {selectedTexts.length > 0 && (
                                <>
                                <Separator />
                                    <div className='w-full flex justify-center mt-5'>
                                        <Button variant={"destructive"}>Delete Selected</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </textSourceContext.Provider>
    )
}

export default Text
