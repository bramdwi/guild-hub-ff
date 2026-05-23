/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if credentials are validly configured
export const isSupabaseConfigured = 
  supabaseUrl.trim() !== "" && 
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseAnonKey.trim() !== "" &&
  supabaseAnonKey !== "your-anon-public-key";

// Initialize client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured) {
  console.log("[Supabase] Cloud Database Connection Initialized Successfully.");
} else {
  console.log("[Supabase] Credentials not set. Running in Local Storage Playground Mode.");
}
