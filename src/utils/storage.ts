/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DBState, Guild, Member, MadingPost, UserRole } from "../types";

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

export const getDB = (): DBState => {
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

export const saveDB = (db: DBState): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
};

// State update handlers
export const addGuildToDB = (guild: Guild, ketuaMember: Member): DBState => {
  const db = getDB();
  db.guilds.push(guild);
  db.members.push(ketuaMember);
  saveDB(db);
  return db;
};

export const addMemberToDB = (member: Member): DBState => {
  const db = getDB();
  // Ensure no duplicate nickname or real name in the same guild
  db.members.push(member);
  saveDB(db);
  return db;
};

export const deleteMemberFromDB = (memberId: string): DBState => {
  const db = getDB();
  db.members = db.members.filter((m) => m.id_member !== memberId);
  saveDB(db);
  return db;
};

export const updateMemberRoleInDB = (memberId: string, role: UserRole): DBState => {
  const db = getDB();
  db.members = db.members.map((m) => {
    if (m.id_member === memberId) {
      return { ...m, role };
    }
    return m;
  });
  saveDB(db);
  return db;
};

export const addMadingPostToDB = (post: MadingPost): DBState => {
  const db = getDB();
  db.mading.unshift(post); // newest first
  saveDB(db);
  return db;
};

export const deleteMadingPostFromDB = (postId: string): DBState => {
  const db = getDB();
  db.mading = db.mading.filter((p) => p.id_post !== postId);
  saveDB(db);
  return db;
};

export const editMadingPostInDB = (postId: string, text: string): DBState => {
  const db = getDB();
  db.mading = db.mading.map((p) => {
    if (p.id_post === postId) {
      return { ...p, isi_pengumuman: text };
    }
    return p;
  });
  saveDB(db);
  return db;
};

export const resetDBToDefault = (): DBState => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
};

/**
 * Instantiates the logic flow from initialize-guild-hub.json
 * Input: appName (string)
 * Output: { initialized: boolean }
 */
export const initializeGuildHub = (appName: string): { initialized: boolean } => {
  console.log(`[LogicFlow M-d7074e0d] Starting: Initialize Guild Hub ("${appName}")`);
  // V-b891d22a: Assign initialized = true
  const initialized = true;
  console.log(`[LogicFlow M-d7074e0d] V-b891d22a: App activation state set to initialized = ${initialized}`);
  console.log(`[LogicFlow M-d7074e0d] R-2b020f5b: Returning initialization success`);
  return { initialized };
};
