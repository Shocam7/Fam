
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role for backend actions

// We use the service role key for backend actions to bypass RLS when needed
// and handle permission checks manually in our code,
// OR we can use the anon key and RLS if we propagate the user session properly.
// Given we are doing complex asymmetric privacy filtering in code, the Service Role is safer/easier
// to ensure we get the data we need to filter.
export const supabase = createClient(supabaseUrl || 'https://mock.supabase.co', supabaseKey || 'mock-key')
