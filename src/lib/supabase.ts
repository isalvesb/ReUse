import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cpdwuulriyahlyhrmnuc.supabase.co';
const supabaseKey = 'sb_publishable_afI-sQijNoPlWzn76pNsWA_QUaLKrn6';

export const supabase = createClient(supabaseUrl, supabaseKey);