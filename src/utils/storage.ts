/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DBState, Guild, Member, MadingPost, UserRole } from "../types";
import { supabase, isSupabaseConfigured } from "./supabase";

const LOCAL_STORAGE_KEY = "guild_hub_ff_db";

export const generateGuildId = (namaGuild: string): string => {
  // Generate uppercase initials from guild name
  const initials = namaGuild
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);

  // Generate a random number between 10 and 99
  const randomNum = Math.floor(Math.random() * 90) + 10;
  return `FF-${initials || "GUILD"}-${randomNum}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
};

const SEED_DATA: DBState = {
  guilds: [
    {
      id_guild: "FF-EVOS-21",
      nama_guild: "EVOS Divine Clone",
      nama_ketua: "Muhammad Farchan",
      kontak_ketua: "081234567890 (WA)",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    },
    {
      id_guild: "FF-SND-99",
      nama_guild: "Sunda Esports",
      nama_ketua: "Kang Cecep",
      kontak_ketua: "cecep_sepuh#1312 (Discord)",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    }
  ],
  members: [
    // EVOS Divine Members
    {
      id_member: "MEM-EVOS-1",
      id_guild: "FF-EVOS-21",
      nama: "Muhammad Farchan",
      umur: 22,
      level: 78,
      kota: "Jakarta",
      nickname_ff: "EVOS Manay",
      username: "manay",
      password: "123",
      role: "Ketua",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_member: "MEM-EVOS-2",
      id_guild: "FF-EVOS-21",
      nama: "Kenbo Wijaya",
      umur: 20,
      level: 69,
      kota: "Bandung",
      nickname_ff: "EVOS Kenbo",
      username: "kenbo",
      password: "123",
      role: "Officer",
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_member: "MEM-EVOS-3",
      id_guild: "FF-EVOS-21",
      nama: "Fajar Street",
      umur: 19,
      level: 72,
      kota: "Tangerang",
      nickname_ff: "EVOS Street",
      username: "street",
      password: "123",
      role: "Member",
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_member: "MEM-EVOS-4",
      id_guild: "FF-EVOS-21",
      nama: "Abu Sofyan",
      umur: 21,
      level: 70,
      kota: "Bekasi",
      nickname_ff: "EVOS Abu",
      username: "abu",
      password: "123",
      role: "Member",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_member: "MEM-EVOS-5",
      id_guild: "FF-EVOS-21",
      nama: "Rasyah Rasyid",
      umur: 16,
      level: 75,
      kota: "Makassar",
      nickname_ff: "BTR Rasyah",
      username: "rasyah",
      password: "123",
      role: "Member",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Sunda Esports Members
    {
      id_member: "MEM-SND-1",
      id_guild: "FF-SND-99",
      nama: "Kang Cecep",
      umur: 25,
      level: 65,
      kota: "Garut",
      nickname_ff: "SND CecepX",
      username: "cecep",
      password: "123",
      role: "Ketua",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_member: "MEM-SND-2",
      id_guild: "FF-SND-99",
      nama: "Asep Kabayan",
      umur: 18,
      level: 52,
      kota: "Tasikmalaya",
      nickname_ff: "SND Kabayan",
      username: "kabayan",
      password: "123",
      role: "Member",
      created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ],
  mading: [
    // EVOS posts
    {
      id_post: "POST-EVOS-1",
      id_guild: "FF-EVOS-21",
      isi_pengumuman: "🔥 UPDATE JADWAL SCRIM: Scrim Internal malam ini jam 20:00 WIB vs RRQ Esports. Harap semua squad inti standby di Discord 15 menit sebelum mulai. Map yang dimainkan: Bermuda, Purgatory, Kalahari. Aim keras, jangan loyo!",
      author: "EVOS Manay",
      author_role: "Ketua",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id_post: "POST-EVOS-2",
      id_guild: "FF-EVOS-21",
      isi_pengumuman: "🏆 Pendaftaran Turnamen FFML Community Season depan sudah resmi dibuka! Kita butuh perwakilan 2 Squad. Yang berminat mendaftar harap setor nama tim dan level akun ke Kenbo untuk di-seleksi terlebih dahulu.",
      author: "EVOS Kenbo",
      author_role: "Officer",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },

    // Sunda Esports posts
    {
      id_post: "POST-SND-1",
      id_guild: "FF-SND-99",
      isi_pengumuman: "⚡ Sampurasun baraya! Tong hilap engke wengi jam 19:30 WIB urang ngerush bareng di Ranked map Bermuda. Siapkeun kuota jeung mental, ampun sepuh! 🙏",
      author: "SND CecepX",
      author_role: "Ketua",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
};

// ----------------------------------------------------
// LOCAL STORAGE GRADUAL FALLBACK IMPLEMENTATION
// ----------------------------------------------------
const getLocalDB = (): DBState => {
  if (typeof window === "undefined") return SEED_DATA;
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse LocalStorage DB, resetting", e);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_DATA));
    return SEED_DATA;
  }
};

const saveLocalDB = (db: DBState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
};

// ----------------------------------------------------
// ASYNCHRONOUS DATABASE INTERFACE (SUPABASE / LOCAL)
// ----------------------------------------------------

export class SyncError extends Error {
  dbState: DBState;
  constructor(message: string, dbState: DBState) {
    super(message);
    this.name = "SyncError";
    this.dbState = dbState;
  }
}

export const getDB = async (): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    // Fallback to localStorage
    return getLocalDB();
  }

  try {
    const [guildsRes, membersRes, madingRes] = await Promise.all([
      supabase.from("guilds").select("*").order("created_at", { ascending: true }),
      supabase.from("members").select("*").order("created_at", { ascending: true }),
      supabase.from("mading_posts").select("*").order("created_at", { ascending: false })
    ]);

    if (guildsRes.error) throw guildsRes.error;
    if (membersRes.error) throw membersRes.error;
    if (madingRes.error) throw madingRes.error;

    const result: DBState = {
      guilds: guildsRes.data || [],
      members: membersRes.data || [],
      mading: madingRes.data || []
    };

    // Warn if all tables are empty — likely RLS policy not set or tables not created
    if (result.guilds.length === 0 && result.members.length === 0 && result.mading.length === 0) {
      console.warn("[Supabase] All tables returned empty. Possible causes: (1) Tables not created yet, (2) No seed data inserted, (3) Row Level Security (RLS) blocking access. Run the SQL in the walkthrough to fix.");
    } else {
      console.log(`[Supabase] Data loaded: ${result.guilds.length} guilds, ${result.members.length} members, ${result.mading.length} posts`);
    }

    return result;
  } catch (error: any) {
    console.error("[Supabase] Failed to fetch data:", error?.message || error);
    if (error?.message?.includes("permission denied") || error?.code === "42501") {
      console.error("[Supabase] RLS POLICY ERROR: Jalankan perintah SQL berikut di Supabase SQL Editor untuk mengizinkan akses publik sesuai Best Practices:");
      console.error(`
        ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow public read" ON guilds FOR SELECT USING (true);
        CREATE POLICY "Allow public insert" ON guilds FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public update" ON guilds FOR UPDATE USING (true) WITH CHECK (true);
        CREATE POLICY "Allow public delete" ON guilds FOR DELETE USING (true);
        
        ALTER TABLE members ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow public read" ON members FOR SELECT USING (true);
        CREATE POLICY "Allow public insert" ON members FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public update" ON members FOR UPDATE USING (true) WITH CHECK (true);
        CREATE POLICY "Allow public delete" ON members FOR DELETE USING (true);
        
        ALTER TABLE mading_posts ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Allow public read" ON mading_posts FOR SELECT USING (true);
        CREATE POLICY "Allow public insert" ON mading_posts FOR INSERT WITH CHECK (true);
        CREATE POLICY "Allow public update" ON mading_posts FOR UPDATE USING (true) WITH CHECK (true);
        CREATE POLICY "Allow public delete" ON mading_posts FOR DELETE USING (true);
      `);
    }
    console.warn("[Supabase] Falling back to Local Storage.");
    return getLocalDB();
  }
};

export const addGuildToDB = async (guild: Guild, ketuaMember: Member): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.guilds.push(guild);
    db.members.push(ketuaMember);
    saveLocalDB(db);
    return db;
  }

  try {
    const { error: guildError } = await supabase.from("guilds").insert(guild);
    if (guildError) throw guildError;

    const { error: memberError } = await supabase.from("members").insert(ketuaMember);
    if (memberError) throw memberError;

    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] addGuildToDB error:", error?.message || error);
    
    // Graceful local storage fallback
    const db = getLocalDB();
    if (!db.guilds.some((g) => g.id_guild === guild.id_guild)) {
      db.guilds.push(guild);
    }
    if (!db.members.some((m) => m.id_member === ketuaMember.id_member)) {
      db.members.push(ketuaMember);
    }
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal sinkronisasi data Guild Baru ke Cloud. Disimpan di Penyimpanan Lokal (Offline).",
      db
    );
  }
};

export const addMemberToDB = async (member: Member): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.members.push(member);
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("members").insert(member);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] addMemberToDB error:", error?.message || error);
    
    const db = getLocalDB();
    if (!db.members.some((m) => m.id_member === member.id_member)) {
      db.members.push(member);
    }
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal bergabung sebagai Anggota di Cloud. Disimpan di Penyimpanan Lokal (Offline).",
      db
    );
  }
};

export const deleteMemberFromDB = async (memberId: string): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.members = db.members.filter((m) => m.id_member !== memberId);
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("members").delete().eq("id_member", memberId);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] deleteMemberFromDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.members = db.members.filter((m) => m.id_member !== memberId);
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal mengeluarkan Anggota dari Cloud. Diperbarui di Penyimpanan Lokal.",
      db
    );
  }
};

export const updateMemberRoleInDB = async (memberId: string, role: UserRole): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.members = db.members.map((m) => {
      if (m.id_member === memberId) {
        return { ...m, role };
      }
      return m;
    });
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("members").update({ role }).eq("id_member", memberId);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] updateMemberRoleInDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.members = db.members.map((m) => {
      if (m.id_member === memberId) {
        return { ...m, role };
      }
      return m;
    });
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal memperbarui Role Anggota di Cloud. Diperbarui di Penyimpanan Lokal.",
      db
    );
  }
};

export const updateGuildProfileInDB = async (
  guildId: string,
  slogan: string,
  logo: string
): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.guilds = db.guilds.map((g) => {
      if (g.id_guild === guildId) {
        return { ...g, slogan, logo };
      }
      return g;
    });
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase
      .from("guilds")
      .update({ slogan, logo })
      .eq("id_guild", guildId);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] updateGuildProfileInDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.guilds = db.guilds.map((g) => {
      if (g.id_guild === guildId) {
        return { ...g, slogan, logo };
      }
      return g;
    });
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal memperbarui Profil Guild di Cloud. Diperbarui di Penyimpanan Lokal.",
      db
    );
  }
};

export const addMadingPostToDB = async (post: MadingPost): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.mading.unshift(post);
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("mading_posts").insert(post);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] addMadingPostToDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.mading.unshift(post);
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal mempublikasikan Pengumuman ke Cloud. Disimpan di Penyimpanan Lokal.",
      db
    );
  }
};

export const deleteMadingPostFromDB = async (postId: string): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.mading = db.mading.filter((p) => p.id_post !== postId);
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("mading_posts").delete().eq("id_post", postId);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] deleteMadingPostFromDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.mading = db.mading.filter((p) => p.id_post !== postId);
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal menghapus Pengumuman dari Cloud. Dihapus dari Penyimpanan Lokal.",
      db
    );
  }
};

export const editMadingPostInDB = async (postId: string, text: string): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    const db = getLocalDB();
    db.mading = db.mading.map((p) => {
      if (p.id_post === postId) {
        return { ...p, isi_pengumuman: text };
      }
      return p;
    });
    saveLocalDB(db);
    return db;
  }

  try {
    const { error } = await supabase.from("mading_posts").update({ isi_pengumuman: text }).eq("id_post", postId);
    if (error) throw error;
    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] editMadingPostInDB error:", error?.message || error);
    
    const db = getLocalDB();
    db.mading = db.mading.map((p) => {
      if (p.id_post === postId) {
        return { ...p, isi_pengumuman: text };
      }
      return p;
    });
    saveLocalDB(db);
    
    throw new SyncError(
      "Gagal mengedit Pengumuman di Cloud. Diperbarui di Penyimpanan Lokal.",
      db
    );
  }
};

export const resetDBToDefault = async (): Promise<DBState> => {
  if (!isSupabaseConfigured || !supabase) {
    saveLocalDB(SEED_DATA);
    return SEED_DATA;
  }

  try {
    // Delete existing records (cascade deletes handles relationships)
    await supabase.from("mading_posts").delete().neq("id_post", "");
    await supabase.from("members").delete().neq("id_member", "");
    await supabase.from("guilds").delete().neq("id_guild", "");

    // Insert seeds
    const { error: gErr } = await supabase.from("guilds").insert(SEED_DATA.guilds);
    if (gErr) throw gErr;

    const { error: mErr } = await supabase.from("members").insert(SEED_DATA.members);
    if (mErr) throw mErr;

    const { error: pErr } = await supabase.from("mading_posts").insert(SEED_DATA.mading);
    if (pErr) throw pErr;

    return await getDB();
  } catch (error: any) {
    console.error("[Supabase] resetDBToDefault error:", error?.message || error);
    
    saveLocalDB(SEED_DATA);
    throw new SyncError(
      "Gagal me-reset Cloud Database. Reset dilakukan di Penyimpanan Lokal (Offline).",
      SEED_DATA
    );
  }
};

/**
 * Instantiates the logic flow from initialize-guild-hub.json
 * Input: appName (string)
 * Output: { initialized: boolean }
 */
export const initializeGuildHub = (appName: string): { initialized: boolean } => {
  console.log(`[LogicFlow M-d7074e0d] Starting: Initialize Guild Hub ("${appName}")`);
  const initialized = true;
  console.log(`[LogicFlow M-d7074e0d] V-b891d22a: App activation state set to initialized = ${initialized}`);
  console.log(`[LogicFlow M-d7074e0d] R-2b020f5b: Returning initialization success`);
  return { initialized };
};

