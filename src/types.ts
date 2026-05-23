/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Ketua" | "Officer" | "Member";

export interface Guild {
  id_guild: string;      // Unique code, e.g., FF-INDO-99
  nama_guild: string;
  nama_ketua: string;
  kontak_ketua: string;  // WhatsApp or Discord contact
  created_at: string;
  slogan?: string;       // Optional slogan
  logo?: string;         // Optional logo URL or Base64 data URL
}

export interface Member {
  id_member: string;     // Unique identifier
  id_guild: string;      // Belongs to this Guild
  nama: string;          // Full name
  umur: number;          // Age
  level: number;         // FF Account Level
  kota: string;          // Origin City
  nickname_ff: string;   // In-Game Name (IGN)
  username: string;      // Custom username for login
  password: string;      // Password for authentication
  role: UserRole;        // Role determination
  created_at: string;
}

export interface MadingPost {
  id_post: string;
  id_guild: string;
  isi_pengumuman: string;
  author: string;        // Nickname of creator
  author_role: UserRole; // Role of creator at posting time
  created_at: string;
}

export interface DBState {
  guilds: Guild[];
  members: Member[];
  mading: MadingPost[];
}

export type ActiveView = 
  | "landing" 
  | "register-guild" 
  | "register-member" 
  | "guild-login"
  | "dashboard";
