import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rtcueiadjqkdmepogtgm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Y3VlaWFkanFrZG1lcG9ndGdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NzExODgsImV4cCI6MjA2OTM0NzE4OH0.UgiEr7EINbAjXv-O6YKD1R8I40y5EOOBEXjP_dvvPrQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)