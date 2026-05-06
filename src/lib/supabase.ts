import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpdwuulriyahlyhrmnuc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwZHd1dWxyaXlhaGx5aHJtbnVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3OTk4OTEsImV4cCI6MjA5MjM3NTg5MX0.syDEAVAzUx6ea7ij7Iy5DMjPpvdNMz4Go8bq0yqCwAs';

export const supabase = createClient(supabaseUrl, supabaseKey);