import { createClient } from '@supabase/supabase-js';
// Make sure you run this script with Node v20+: 
// node --env-file=../.env.local scripts/setup-admin.mjs


const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

// Create Supabase Admin Client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function makeAdmin() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error(`Usage: node setup-admin.mjs <email> <password>`);
    process.exit(1);
  }

  const email = args[0];
  const password = args[1];

  console.log(`Setting up Admin for: ${email}`);

  // 1. Create the user or find existing user using Admin API (Bypasses SMTP completely)
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true // Force confirmation so it skips the faulty Titan Mail SMTP
  });

  let userId;

  if (createError) {
    // If the error means user already exists, let's grab their ID
    if (createError.message.includes('already exists')) {
      console.log(`User ${email} already exists. Fetching user ID...`);
      // Warning: listUsers can be slow if thousands of users
      const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
         console.error("Error listing users to find existing account:", listError);
         process.exit(1);
      }
      const existingUser = usersData.users.find(u => u.email === email);
      if (existingUser) {
        userId = existingUser.id;
        
        // Let's force confirm their email in case they were stuck
        if (!existingUser.email_confirmed_at) {
          console.log(`Force confirming email for existing user...`);
          await supabase.auth.admin.updateUserById(userId, { email_confirm: true });
        }
      } else {
         console.error("Could not find the existing user.");
         process.exit(1);
      }
    } else {
      console.error("❌ Error creating admin user:", createError.message);
      process.exit(1);
    }
  } else {
    userId = userData.user.id;
    console.log(`✅ User created successfully (ID: ${userId})`);
  }

  // 2. Ensure they are in the admin_users custom table
  console.log("Setting as an admin in 'admin_users' table...");
  const { error: insertError } = await supabase
    .from('admin_users')
    .upsert({ id: userId, email: email }, { onConflict: 'id' });

  if (insertError) {
    console.error("❌ Error adding user to admin_users table:", insertError.message);
    console.log("Make sure you ran the Supabase SQL schema for admin_users first!");
    process.exit(1);
  }

  console.log(`🎉 Success! You can now log into the admin panel securely.`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

makeAdmin();
