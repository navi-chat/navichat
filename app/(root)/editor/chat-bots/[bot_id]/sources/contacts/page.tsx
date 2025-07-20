'use client'
import { ContactType } from '@/lib/types'
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

import { ContactRound, Ellipsis } from 'lucide-react'
import { Button } from '@/components/ui/button'
import CreateContactSource from '@/components/CreateContactSource'
import { getContacts } from '@/lib/actions/contacts.actions'

const contactsSourceContext = createContext<{ refetch: () => void } | undefined>(undefined)

export const useContactSource = () => {
    const context = useContext(contactsSourceContext)
    if (!context) throw new Error('useContactSource must be used within ContactSourceProvider')
    return context
}

const Contacts = () => {
    const [contacts, setContacts] = useState<ContactType[]>()
    const params = useParams()
    const bot_id = params.bot_id?.toString() || ""

    const refetch = async () => {
        const res = await getContacts({ bot_id: bot_id })
        if (res.error) {
            toast(res.error)
        }
        setContacts(res.data)
    }
    useEffect(() => {
        refetch()
    }, [bot_id])

    const getContactName = (value: string) => {
        switch (value) {
            case "email":
                return "Email"
            case "phone_no":
                return "Phone Number"
            case "x.com":
                return "X (Twitter)"
            case "youtube_channel":
                return "YouTube Channel"
            case "whatsapp_no":
                return "WhatsApp Number"
            case "whatsapp_channel":
                return "WhatsApp Channel"
            case "facebook":
                return "Facebook"
            case "instagram":
                return "Instagram"
            case "telegram_no":
                return "Telegram Number"
            case "telegram_channel":
                return "Telegram Channel"
            default:
                return "Unknown"
        }
    }    

    return (
        <contactsSourceContext.Provider value={{ refetch }}>
            <div className='w-full'>
                <div className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full'>
                        <div className='border rounded-lg p-5 w-full space-y-2'>
                            <h2 className='text-lg font-bold'>Contacts</h2>
                            <p className='text-muted-foreground text-sm'>Add Contacts to your AI Chatbot.</p>
                            <CreateContactSource />
                        </div>
                        <div className='border rounded-lg p-5 w-full mt-5 mb-20'>
                            <h2 className='text-lg font-bold'>Contact Sources</h2>
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
                                        {contacts?.map((contact) => (
                                            <TableRow key={contact.id} className='hover:bg-background'>
                                                <TableCell><Checkbox /></TableCell>
                                                <TableCell className='pl-5'>
                                                    <div className='bg-accent rounded-full size-9 p-2 flex items-center justify-center'>
                                                        <ContactRound className='text-muted-foreground' />
                                                    </div>
                                                </TableCell>
                                                <TableCell className='w-1/3 font-medium'><span>{getContactName(contact.type)}</span></TableCell>
                                                <TableCell className='w-full'>
                                                    {contact.contact}
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
        </contactsSourceContext.Provider>
    )
}

export default Contacts
