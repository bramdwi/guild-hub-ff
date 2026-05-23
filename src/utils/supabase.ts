/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from "@supabase/supabase-js";

// Read Supabase credentials from Vite environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Check if credentials are validly configured
// These comparisons reject the PLACEHOLDER values, not real credentials
export const isSupabaseConfigured =
  supabaseUrl.trim() !== "" &&
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseAnonKey.trim() !== "" &&
  supabaseAnonKey !== "your-anon-public-key";

// Initialize client if configured, otherwise null
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export type SupabaseStatus = "connected" | "rls_locked" | "local_only";

/**
 * Checks if the Supabase database is fully writable or locked by RLS policies.
 * We do this by attempting a test insert on the guilds table and then deleting it.
 */
export const checkDatabaseRLS = async (): Promise<{ status: SupabaseStatus; error?: string }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { status: "local_only" };
  }

  const testId = `FF-TEST-${Math.floor(Math.random() * 9000) + 1000}`;
  try {
    const { error: insertError } = await supabase.from("guilds").insert({
      id_guild: testId,
      nama_guild: "RLS TEST",
      nama_ketua: "TEST",
      kontak_ketua: "TEST",
      created_at: new Date().toISOString()
    });

    if (insertError) {
      if (insertError.code === "42501") {
        console.warn("[Supabase] Connection test: Row-Level Security (RLS) policies are active and blocking writes.");
        return { status: "rls_locked", error: insertError.message };
      }
      console.warn("[Supabase] Connection test query failed:", insertError.message);
      return { status: "rls_locked", error: insertError.message };
    }

    // Clean up successfully inserted record
    const { error: deleteError } = await supabase
      .from("guilds")
      .delete()
      .eq("id_guild", testId);
      
    if (deleteError) {
      console.warn("[Supabase] Connection cleanup error:", deleteError.message);
    }

    console.log("[Supabase] Connection test: Database is fully writable and active!");
    return { status: "connected" };
  } catch (err: any) {
    console.error("[Supabase] Unexpected connection check error:", err);
    return { status: "rls_locked", error: err?.message || "Unknown error" };
  }
};

if (isSupabaseConfigured) {
  console.log("[Supabase] Cloud Database Connection Initialized Successfully.");
} else {
  console.log("[Supabase] Credentials not set. Running in Local Storage Playground Mode.");
}

