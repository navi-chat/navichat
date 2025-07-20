'use client'
import { deleteFAQ, getFAQs } from '@/lib/actions/faqs.actions'
import { FAQ } from '@/lib/types'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { EllipsisVertical, Loader2, PenBox, Trash2 } from 'lucide-react'
import { Separator } from './ui/separator'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogContent } from './ui/dialog'

const AllFAQs = () => {
    const [faqs, setFaqs] = useState<FAQ[]>()
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""
    const [open, setOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
    const [deleteLoading, setDeleteLoading] = useState(false)

    useEffect(() => {
        const initialCall = async () => {
            const res = await getFAQs({ bot_id })
            if (res.data) {
                setFaqs(res.data)
            }
        }
        initialCall()
    }, [bot_id])

    const handleDelete = async () => {
        if (selectedId) {
            setDeleteLoading(true)
            await deleteFAQ({ id: selectedId }) // <- Your delete action
            setFaqs((prev) => prev?.filter((faq) => faq.id !== selectedId))
            setOpen(false)
            setDeleteLoading(false)
        }
    }

    return (
        <div className='w-full p-4 border rounded-xl'>
            {faqs?.map((faq, index) => (
                <div key={faq.id}>
                    <div className='flex gap-5 items-center justify-between px-2'>
                        <div>
                            <p>{index + 1}.</p>
                        </div>
                        <div className='w-full'>
                            <p><span className=' font-bold'>Q. </span>{faq.question}</p>
                        </div>
                        <div className='w-full'>
                            <p><span className=' font-bold'>A. </span>{faq.answer}</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant={"outline"} className='size-8'><EllipsisVertical /> </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem><PenBox /> Edit</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedId(faq.id!)
                                        setOpen(true)
                                    }}><Trash2 /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog>

                        </Dialog>
                    </div>
                    {faqs.length !== (index + 1) && <Separator className='my-3' />}
                </div>
            ))}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm deletion</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this FAQ?</DialogDescription>
                        <div>
                            <p><span className='font-bold'>Question: </span>{faqs?.filter((faq) => faq.id === selectedId)[0]?.question}</p>
                            <p><span className='font-bold'>Answer: </span>{faqs?.filter((faq) => faq.id === selectedId)[0]?.answer}</p>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                        {deleteLoading ? <Loader2 className="animate-spin size-5" /> : <> <p>Delete</p></>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AllFAQs
