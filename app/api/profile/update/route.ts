import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const cookieStore = cookies()

        // Create a Supabase client configured to use cookies
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get body
        const body = await request.json()
        // Extract only allowed fields to prevent arbitrary updates
        const {
            full_name,
            whatsapp,
            address_condominium,
            address_block,
            address_apartment
        } = body

        // Build update object dynamically
        const updates: any = {
            id: user.id, // Enforce ID match
            updated_at: new Date().toISOString(),
        }
        if (full_name !== undefined) updates.full_name = full_name
        if (whatsapp !== undefined) updates.whatsapp = whatsapp
        if (address_condominium !== undefined) updates.address_condominium = address_condominium
        if (address_block !== undefined) updates.address_block = address_block
        if (address_apartment !== undefined) updates.address_apartment = address_apartment

        // Upsert profile
        const { error: dbError } = await supabase
            .from('profiles')
            .upsert(updates)

        if (dbError) {
            console.error('Profile update error:', dbError)
            return NextResponse.json({ error: dbError.message }, { status: 500 })
        }

        // Also update metadata if name changed
        if (full_name) {
            await supabase.auth.updateUser({
                data: { full_name }
            })
        }

        return NextResponse.json({ success: true })
    } catch (err) {
        console.error('API Error:', err)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
