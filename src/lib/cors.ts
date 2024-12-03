import { NextResponse } from 'next/server'

export function corsResponse(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
  return response
}

export function corsOptionsResponse() {
  return corsResponse(new NextResponse(null, { status: 200 }))
} 