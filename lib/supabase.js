// supabase.js
import { createClient } from '@supabase/supabase-js';

// Supabase URL in anon key dobiš v dashboardu: Settings → API
const supabaseUrl = 'https://qhlcwbcvqqerdwlxftnx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobGN3YmN2cXFlcmR3bHhmdG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MTg2ODksImV4cCI6MjA3OTM5NDY4OX0.Z2OZ5uP5Oqd02r_oF8eqY0b_1KDuvdOqiVPMOnWGDcQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);