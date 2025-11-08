import { SUPABASE_URL, SUPABASE_KEY } from './confg.js'

export const supabase = (window as any).supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
