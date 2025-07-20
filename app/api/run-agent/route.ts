// app/api/chat/route.ts
import { runAgent } from '@/lib/chatService';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { messages } = body;

  const result = await runAgent(messages);
  return NextResponse.json({ messages: result });
}
