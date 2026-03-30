import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching trips:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in trips table:', Object.keys(data[0]));
  } else {
    console.log('No trips found, cannot check columns.');
  }
}

checkSchema();
