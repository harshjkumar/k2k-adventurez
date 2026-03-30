import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password, name, phone } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const cookieStore = await cookies()

    // Initialize Supabase Admin client using Service Role Key to bypass email confirmation
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Internal error if called from a server component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Internal error if called from a server component
            }
          },
        },
      }
    )

    // 1. Force create a verified user via Admin API
    const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to bypass SMTP errors
      user_metadata: {
        full_name: name,
        phone: phone,
      }
    })

    if (adminError) {
      return NextResponse.json({ error: adminError.message }, { status: 400 })
    }

    if (adminData?.user) {
      // 2. Insert into profiles manually since trigger might fail
      const { error: profileError } = await supabaseAdmin.from('profiles').insert({
        id: adminData.user.id,
        full_name: name,
        phone: phone,
      })
      if (profileError && profileError.code !== '23505') {
        console.error("Profile creation error:", profileError)
      }
    }

    return NextResponse.json({ success: true, user: adminData.user })
    
  } catch (err: any) {
    console.error("Custom registration error:", err)
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 })
  }
}
