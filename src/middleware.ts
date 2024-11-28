import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

async function fetchNewTempToken(): Promise<TokenData> {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/api/token', {
        headers: {
            'apiKey': process.env.API_KEY!
        }
    })

    if (!res.ok) {
        console.error('Token fetch failed:', await res.json())
        throw new Error("An error occurred while fetching the token.")
    }

    const data = await res.json()
    console.log('Token fetched:', data)
    return data
}

export async function middleware(request: NextRequest) {
    const storedToken = request.cookies.get('tempToken')?.value
    let tokenData: TokenData | null = null

    if (storedToken) {
        tokenData = JSON.parse(storedToken)
        // Checking if the token is still valid, if so, skip fetching a new one
        if (tokenData && new Date(tokenData.expires) > new Date()) {
            console.log('Token is valid, skipping refresh')
            return NextResponse.next()
        }
    }


    try {
        tokenData = await fetchNewTempToken()
        const res = NextResponse.next()
        res.cookies.set('tempToken', JSON.stringify(tokenData), {
            httpOnly: true,
            maxAge: 24 * 60 * 60,
        })
        return res
    } catch (error) {
        console.error('Token fetch failed:', error)
        return new NextResponse('Service Unavailable', { status: 503 })
    }
}

export const config = {
    matcher: [
        // '/api/:path*',
        // '/((?!api/token|_next/static|favicon.ico).*)',
        '/((?!_next/static|favicon.ico).*)'
    ],
}