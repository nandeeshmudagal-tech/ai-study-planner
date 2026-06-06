import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://atdvxdqzqgrsrzxmrkbq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF0ZHZ4ZHF6cWdyc3J6eG1ya2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MDgxMzIsImV4cCI6MjA5NjI4NDEzMn0.odYu7d-f6ZebztmTXAs_oNKnDRmyOdw6u-8uFdHTQQQ'

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)