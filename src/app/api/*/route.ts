import { corsResponse, corsOptionsResponse } from '@/lib/cors'
import { NextRequest, NextResponse } from 'next/server'

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function GET(request: NextRequest) {
  try {
    // Your code...
    return corsResponse(NextResponse.json(Response))
  } catch (error) {
    return corsResponse(
      NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    )
  }
} 