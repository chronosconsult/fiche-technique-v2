import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xqhgufhxlyhisiniathn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxaGd1Zmh4bHloaXNpbmlhdGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2MTI1NTcsImV4cCI6MjA2NjE4ODU1N30.MzgvwlzaICD9t-dwmZsGb04a-OAYchelkDc1nu3_dW8'
export const supabase = createClient(supabaseUrl, supabaseKey)
