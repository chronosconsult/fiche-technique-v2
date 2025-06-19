import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jpemckbycegeloepluwe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZW1ja2J5Y2VnZWxvZXBsdXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzI2NjksImV4cCI6MjA2NTkwODY2OX0.Jx_hQ5aQa3ru8o3S7OQeCULjjbgtclN2AdE5QdJ437c';

export const supabase = createClient(supabaseUrl, supabaseKey);
