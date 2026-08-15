import { NextRequest, NextResponse } from "next/server"

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD

export function proxy(request: NextRequest) {
  if (!BASIC_AUTH_USER || !BASIC_AUTH_PASSWORD) {
    return new NextResponse("Server misconfigured: auth credentials not set.", {
      status: 500,
    })
  }

  const authHeader = request.headers.get("authorization")

  if (authHeader?.startsWith("Basic ")) {
    try {
      const encoded = authHeader.slice("Basic ".length)
      const decoded = atob(encoded)
      const separatorIndex = decoded.indexOf(":")

      if (separatorIndex >= 0) {
        const user = decoded.slice(0, separatorIndex)
        const pass = decoded.slice(separatorIndex + 1)

        if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASSWORD) {
          return NextResponse.next()
        }
      }
    } catch {
      // Treat malformed credentials as unauthenticated.
    }
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Trading Panel"',
      "Cache-Control": "no-store",
    },
  })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
