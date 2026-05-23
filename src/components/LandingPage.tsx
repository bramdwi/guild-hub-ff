/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Shield, Database, ArrowRight, Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { DBState } from "../types";

interface LandingPageProps {
  db: DBState;
  onEnterGuild: (guildId: string) => void;
  onNavigate: (view: "register-guild") => void;
  prefilledGuildId: string;
  setPrefilledGuildId: (id: string) => void;
  supabaseStatus: "connected" | "rls_locked" | "local_only";
  onRecheckConnection: () => void;
}

export default function LandingPage({
  db,
  onEnterGuild,
  onNavigate,
  prefilledGuildId,
  setPrefilledGuildId,
  supabaseStatus,
  onRecheckConnection,
}: LandingPageProps) {
  const [guildIdInput, setGuildIdInput] = useState(prefilledGuildId);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSql, setShowSql] = useState(supabaseStatus === "rls_locked" || db.guilds.length === 0);

  const handleEnterGuild = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guildIdInput.trim()) {
      setError("Harap masukkan ID Guild!");
      return;
    }

    const cleanGuildId = guildIdInput.trim().toUpperCase();

    // Validate Guild exists
    const foundGuild = db.guilds.find((g) => g.id_guild === cleanGuildId);
    if (!foundGuild) {
      setError(`ID Guild "${cleanGuildId}" tidak terdaftar di sistem!`);
      return;
    }

    // Pass to Stage 2
    onEnterGuild(cleanGuildId);
  };

  // Quick stats
  const totalGuilds = db.guilds.length;
  const totalMembers = db.members.length;
  const totalPosts = db.mading.length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16">
      {/* Title Hero */}
      <div className="text-center mb-12 relative">
        <div className="absolute inset-0 bg-orange-600/10 blur-3xl rounded-full w-72 h-72 mx-auto -top-10"></div>

        {/* Esports Badge Icon */}
        <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl shadow-orange-600/20 mb-4 border border-orange-400/30 transform hover:scale-105 transition-transform duration-300">
          <Shield className="w-12 h-12 text-white animate-pulse" />
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-400 to-amber-400 bg-clip-text text-transparent">
          GUILD HUB FF
        </h1>
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-sans leading-relaxed">
          Platform manajemen Esports eksklusif untuk Guild & guild Game Free Fire di Indonesia. Atur jadwal scrim, turnamen, mading, dan Member guild Anda dalam satu pintu aman.
        </p>
      </div>

      {/* Grid Layout for main forms (Simplified to symmetric 2-column layout) */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch relative z-10">

        {/* Panel 1: Masuk Dashboard Guild (Stage 1 — Guild ID Only) */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>

          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <LogIn className="text-orange-500 w-6 h-6" />
              Masuk Dashboard Guild
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              Masukkan <span className="text-white font-semibold">ID Guild</span> guild Anda terlebih dahulu. Setelah guild terverifikasi, Anda akan diarahkan ke halaman login untuk memasukkan kredensial guild.
            </p>

            <form onSubmit={handleEnterGuild} className="space-y-4">
              <div>
                <label htmlFor="guildId" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  ID GUILD *
                </label>
                <input
                  id="guildId"
                  type="text"
                  placeholder="Contoh: FF-EVOS-21"
                  autoComplete="off"
                  value={guildIdInput}
                  onChange={(e) => {
                    setGuildIdInput(e.target.value);
                    setPrefilledGuildId(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition uppercase tracking-wider"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-950/30 border border-red-500/20 px-3 py-2.5 rounded-xl">
                  ⚠️ {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 group active:scale-[0.98] mt-2"
              >
                Masuk Arena Guild
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Divider with "2-stage" flow hint */}
            <div className="mt-5 bg-slate-950/50 border border-slate-800 rounded-xl p-3 text-[10px] font-mono text-slate-500 leading-relaxed flex items-start gap-2">
              <span className="text-orange-500 font-bold shrink-0 mt-px">📋</span>
              <span>
                Login terdiri dari <span className="text-orange-400 font-bold">2 tahap</span>:
                (1) Masukkan ID Guild → (2) Login dengan Username & Password di halaman berikutnya.
              </span>
            </div>
          </div>
        </div>

        {/* Panel 2: Registrasi Baru (Untuk Ketua Guild) */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-orange-500"></div>

          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="text-amber-500 w-6 h-6" />
                Untuk Ketua Guild
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Apakah Anda kapten tim, leader guild, atau Ketua Guild Free Fire yang ingin memodernisasi manajemen member dan scrim Anda?
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-3.5 text-xs sm:text-sm text-slate-300">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                💎 KEUNTUNGAN DAFTAR GUILD HUB FF:
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-400 text-xs leading-relaxed">
                <li>Dapatkan <span className="text-amber-400 font-semibold">ID Guild Unik Nasional</span> secara instan.</li>
                <li>Buat portal rekrutmen member guild dengan link undangan otomatis.</li>
                <li>Tulis, edit, dan hapus mading scrim serta jadwal turnamen guild.</li>
                <li>Promosikan anggota menjadi Officer untuk mendelegasikan tugas mading.</li>
                <li>Keluarkan (kick) anggota guild yang melanggar aturan secara realtime.</li>
              </ul>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => onNavigate("register-guild")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/5 group active:scale-[0.98]"
            >
              Daftarkan Guild Baru
              <Shield className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Global Live Stats Counter */}
      <div className="mt-12 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-orange-500">{totalGuilds}</div>
          <div className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Guild Terdaftar</div>
        </div>
        <div className="border-x border-slate-800/60">
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-blue-400">{totalMembers}</div>
          <div className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Total Players</div>
        </div>
        <div>
          <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-500">{totalPosts}</div>
          <div className="text-slate-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Pengumuman Scrim</div>
        </div>
      </div>

      {/* ⚔️ SUPABASE DATABASE SETUP & ACTIVATOR WIZARD ⚔️ */}
      <div
        id="rls-setup-wizard"
        className={`mt-12 bg-slate-900/80 border rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden transition-all duration-500 ${supabaseStatus === "rls_locked"
            ? "border-red-500/40 shadow-red-950/20"
            : supabaseStatus === "connected"
              ? "border-emerald-500/20 shadow-emerald-950/10"
              : "border-slate-800/85"
          }`}
      >
        {/* Glow decoration */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] pointer-events-none -mr-32 -mt-32 opacity-25 transition-colors duration-500 ${supabaseStatus === "rls_locked"
            ? "bg-red-500"
            : supabaseStatus === "connected"
              ? "bg-emerald-500"
              : "bg-orange-500"
          }`}></div>

        <div className="relative z-10 space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className={`text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${supabaseStatus === "rls_locked"
                  ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : supabaseStatus === "connected"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                }`}>
                {supabaseStatus === "rls_locked" ? "⚠️ KONEKSI TERTAHAN (RLS LOCKED)" : supabaseStatus === "connected" ? "🛡️ SUPABASE CLOUD AKTIF & WRITABLE" : "🔌 LOCAL SANDBOX PLAYGROUND"}
              </span>
              <h3 className="font-display text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight mt-2">
                ⚔️ Supabase Cloud Database Activator
              </h3>
            </div>

            <button
              onClick={onRecheckConnection}
              className="bg-slate-950 border border-slate-850 hover:border-orange-500 hover:text-orange-400 text-slate-300 font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 group active:scale-95 outline-none cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
              RE-CHECK CONNECTION
            </button>
          </div>

          {supabaseStatus === "rls_locked" && (
            <div className="bg-red-950/20 border border-red-500/15 p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs text-slate-350 leading-relaxed border-l-4 border-l-red-500">
              <p className="font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                🛑 MASALAH KEAMANAN TERDETEKSI (RLS ACTIVE):
              </p>
              <p>
                Koneksi ke server cloud Supabase <strong>berhasil terhubung</strong>, tetapi database menolak perintah tulis karena kebijakan <strong>Row-Level Security (RLS)</strong> aktif di database Anda tanpa adanya aturan (policy) akses publik.
              </p>
              <p>
                Data Anda saat ini <strong>aman disimpan di Local Storage browser (Sandbox)</strong> agar progress permainan tidak hilang. Namun, untuk mengaktifkan sinkronisasi awan real-time yang sesungguhnya, Anda hanya perlu menjalankan satu perintah SQL di bawah ini.
              </p>
            </div>
          )}

          {supabaseStatus === "connected" && (
            <div className="bg-emerald-950/10 border border-emerald-500/10 p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs text-slate-350 leading-relaxed border-l-4 border-l-emerald-500">
              <p className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                🎉 SISTEM CLOUD ONLINE & WRITABLE:
              </p>
              <p>
                Selamat! Kebijakan RLS di database cloud Supabase Anda telah terbuka. Aplikasi sekarang <strong>100% sinkron</strong> secara real-time ke awan. Setiap data guild, anggota, dan mading yang ditambahkan akan langsung disimpan di live database Supabase Anda.
              </p>
            </div>
          )}

          {supabaseStatus === "local_only" && (
            <div className="bg-slate-950 border border-slate-850 p-4 sm:p-5 rounded-2xl space-y-2.5 text-xs text-slate-400 leading-relaxed border-l-4 border-l-slate-700">
              <p className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                🔌 LOCAL PLAYGROUND SANDBOX:
              </p>
              <p>
                Aplikasi berjalan dalam mode penyimpanan lokal browser karena kredensial `.env` Anda belum diatur atau masih default. Anda dapat menghubungkan ke Supabase kapan saja dengan mengisi file `.env` di folder proyek Anda.
              </p>
            </div>
          )}

          {/* SETUP STEPS */}
          {supabaseStatus !== "connected" && (
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-mono font-black uppercase text-slate-400 tracking-wider">
                👉 CARA MENGAKTIFKAN CLOUD DATABASE DALAM 15 DETIK:
              </h4>

              <div className="grid sm:grid-cols-3 gap-4 text-xs font-sans">
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono text-orange-500 font-extrabold text-[10px]">LANGKAH 1</div>
                  <div className="font-bold text-white uppercase">Copy SQL Kode</div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Klik tombol <strong>Copy SQL Code</strong> di bawah untuk menyalin seluruh skema tabel, data awal, dan perintah bypass RLS.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono text-orange-500 font-extrabold text-[10px]">LANGKAH 2</div>
                  <div className="font-bold text-white uppercase flex items-center gap-1.5">
                    Buka SQL Editor
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-400 inline-flex items-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Masuk ke proyek Supabase Anda, lalu klik menu <strong>SQL Editor</strong> -&gt; <strong>New Query</strong>.
                  </p>
                </div>
                <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl space-y-1.5">
                  <div className="font-mono text-orange-500 font-extrabold text-[10px]">LANGKAH 3</div>
                  <div className="font-bold text-white uppercase">Paste & Run</div>
                  <p className="text-slate-500 leading-relaxed text-[11px]">
                    Tempel (Paste) kode yang disalin ke editor SQL, lalu klik tombol <strong>Run</strong> di kanan bawah. Selesai!
                  </p>
                </div>
              </div>

              {/* Collapsible SQL Block */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowSql(!showSql)}
                    className="text-xs font-mono font-bold text-slate-400 hover:text-white transition duration-200 flex items-center gap-1.5 outline-none cursor-pointer bg-transparent border-none"
                  >
                    {showSql ? "[-] Sembunyikan SQL Setup Code" : "[+] Tampilkan SQL Setup Code"}
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`-- 1. HAPUS TABEL JIKA SUDAH ADA
DROP TABLE IF EXISTS mading_posts CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS guilds CASCADE;

-- 2. BUAT TABEL GUILDS
CREATE TABLE guilds (
  id_guild TEXT PRIMARY KEY,
  nama_guild TEXT NOT NULL,
  nama_ketua TEXT NOT NULL,
  kontak_ketua TEXT NOT NULL,
  slogan TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MIGRATION HELPER (Jalankan ini jika tabel Anda sudah ada untuk menambah kolom tanpa hapus data):
-- ALTER TABLE guilds ADD COLUMN IF NOT EXISTS slogan TEXT;
-- ALTER TABLE guilds ADD COLUMN IF NOT EXISTS logo TEXT;

-- 3. BUAT TABEL MEMBERS
CREATE TABLE members (
  id_member TEXT PRIMARY KEY,
  id_guild TEXT REFERENCES guilds(id_guild) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  umur INTEGER NOT NULL,
  level INTEGER NOT NULL,
  kota TEXT NOT NULL,
  nickname_ff TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUAT TABEL MADING POSTS
CREATE TABLE mading_posts (
  id_post TEXT PRIMARY KEY,
  id_guild TEXT REFERENCES guilds(id_guild) ON DELETE CASCADE,
  isi_pengumuman TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AKTIFKAN & ATUR ROW LEVEL SECURITY (RLS) SESUAI BEST PRACTICES
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mading_posts ENABLE ROW LEVEL SECURITY;

-- Hapus kebijakan lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "Allow public read" ON guilds;
DROP POLICY IF EXISTS "Allow public insert" ON guilds;
DROP POLICY IF EXISTS "Allow public update" ON guilds;
DROP POLICY IF EXISTS "Allow public delete" ON guilds;

DROP POLICY IF EXISTS "Allow public read" ON members;
DROP POLICY IF EXISTS "Allow public insert" ON members;
DROP POLICY IF EXISTS "Allow public update" ON members;
DROP POLICY IF EXISTS "Allow public delete" ON members;

DROP POLICY IF EXISTS "Allow public read" ON mading_posts;
DROP POLICY IF EXISTS "Allow public insert" ON mading_posts;
DROP POLICY IF EXISTS "Allow public update" ON mading_posts;
DROP POLICY IF EXISTS "Allow public delete" ON mading_posts;

-- Buat Kebijakan Akses Publik Terbuka (Public Access Policies)
CREATE POLICY "Allow public read" ON guilds FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON guilds FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON guilds FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON guilds FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON members FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON mading_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mading_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mading_posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON mading_posts FOR DELETE USING (true);

-- 6. MASUKKAN SEED DATA (DATA AWAL CONTOH)
INSERT INTO guilds (id_guild, nama_guild, nama_ketua, kontak_ketua, created_at)
VALUES 
  ('FF-EVOS-21', 'EVOS Divine Clone', 'Muhammad Farchan', '081234567890 (WA)', NOW() - INTERVAL '30 days'),
  ('FF-SND-99', 'Sunda Esports', 'Kang Cecep', 'cecep_sepuh#1312 (Discord)', NOW() - INTERVAL '10 days');

INSERT INTO members (id_member, id_guild, nama, umur, level, kota, nickname_ff, username, password, role, created_at)
VALUES
  ('MEM-EVOS-1', 'FF-EVOS-21', 'Muhammad Farchan', 22, 78, 'Jakarta', 'EVOS Manay', 'manay', '123', 'Ketua', NOW() - INTERVAL '30 days'),
  ('MEM-EVOS-2', 'FF-EVOS-21', 'Kenbo Wijaya', 20, 69, 'Bandung', 'EVOS Kenbo', 'kenbo', '123', 'Officer', NOW() - INTERVAL '25 days'),
  ('MEM-EVOS-3', 'FF-EVOS-21', 'Fajar Street', 19, 72, 'Tangerang', 'EVOS Street', 'street', '123', 'Member', NOW() - INTERVAL '20 days'),
  ('MEM-EVOS-4', 'FF-EVOS-21', 'Abu Sofyan', 21, 70, 'Bekasi', 'EVOS Abu', 'abu', '123', 'Member', NOW() - INTERVAL '15 days'),
  ('MEM-EVOS-5', 'FF-EVOS-21', 'Rasyah Rasyid', 16, 75, 'Makassar', 'BTR Rasyah', 'rasyah', '123', 'Member', NOW() - INTERVAL '5 days'),
  ('MEM-SND-1', 'FF-SND-99', 'Kang Cecep', 25, 65, 'Garut', 'SND CecepX', 'cecep', '123', 'Ketua', NOW() - INTERVAL '10 days'),
  ('MEM-SND-2', 'FF-SND-99', 'Asep Kabayan', 18, 52, 'Tasikmalaya', 'SND Kabayan', 'kabayan', '123', 'Member', NOW() - INTERVAL '8 days');

INSERT INTO mading_posts (id_post, id_guild, isi_pengumuman, author, author_role, created_at)
VALUES
  ('POST-EVOS-1', 'FF-EVOS-21', '🔥 UPDATE JADWAL SCRIM: Scrim Internal malam ini jam 20:00 WIB vs RRQ Esports. Harap semua squad inti standby di Discord 15 menit sebelum mulai. Map yang dimainkan: Bermuda, Purgatory, Kalahari. Aim keras, jangan loyo!', 'EVOS Manay', 'Ketua', NOW() - INTERVAL '2 days'),
  ('POST-EVOS-2', 'FF-EVOS-21', '🏆 Pendaftaran Turnamen FFML Community Season depan sudah resmi dibuka! Kita butuh perwakilan 2 Squad. Yang berminat mendaftar harap setor nama tim dan level akun ke Kenbo untuk di-seleksi terlebih dahulu.', 'EVOS Kenbo', 'Officer', NOW() - INTERVAL '1 days'),
  ('POST-SND-1', 'FF-SND-99', '⚡ Sampurasun baraya! Tong hilap engke wengi jam 19:30 WIB urang ngerush bareng di Ranked map Bermuda. Siapkeun kuota jeung mental, ampun sepuh! 🙏', 'SND CecepX', 'Ketua', NOW() - INTERVAL '4 days');`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="bg-orange-600 hover:bg-orange-500 text-white font-display text-xs font-bold px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-orange-600/10 active:scale-95 outline-none border-none cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        SQL COPIED!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        COPY SQL CODE
                      </>
                    )}
                  </button>
                </div>

                {showSql && (
                  <div className="relative">
                    <pre className="bg-slate-950 border border-slate-850 rounded-2xl p-4 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-72 shadow-inner border-l-4 border-l-orange-500 select-all leading-normal">
                      {`-- 1. HAPUS TABEL JIKA SUDAH ADA
DROP TABLE IF EXISTS mading_posts CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS guilds CASCADE;

-- 2. BUAT TABEL GUILDS
CREATE TABLE guilds (
  id_guild TEXT PRIMARY KEY,
  nama_guild TEXT NOT NULL,
  nama_ketua TEXT NOT NULL,
  kontak_ketua TEXT NOT NULL,
  slogan TEXT,
  logo TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MIGRATION HELPER (Jalankan ini jika tabel Anda sudah ada untuk menambah kolom tanpa hapus data):
-- ALTER TABLE guilds ADD COLUMN IF NOT EXISTS slogan TEXT;
-- ALTER TABLE guilds ADD COLUMN IF NOT EXISTS logo TEXT;

-- 3. BUAT TABEL MEMBERS
CREATE TABLE members (
  id_member TEXT PRIMARY KEY,
  id_guild TEXT REFERENCES guilds(id_guild) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  umur INTEGER NOT NULL,
  level INTEGER NOT NULL,
  kota TEXT NOT NULL,
  nickname_ff TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BUAT TABEL MADING POSTS
CREATE TABLE mading_posts (
  id_post TEXT PRIMARY KEY,
  id_guild TEXT REFERENCES guilds(id_guild) ON DELETE CASCADE,
  isi_pengumuman TEXT NOT NULL,
  author TEXT NOT NULL,
  author_role TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AKTIFKAN & ATUR ROW LEVEL SECURITY (RLS) SESUAI BEST PRACTICES
ALTER TABLE guilds ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE mading_posts ENABLE ROW LEVEL SECURITY;

-- Hapus kebijakan lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "Allow public read" ON guilds;
DROP POLICY IF EXISTS "Allow public insert" ON guilds;
DROP POLICY IF EXISTS "Allow public update" ON guilds;
DROP POLICY IF EXISTS "Allow public delete" ON guilds;

DROP POLICY IF EXISTS "Allow public read" ON members;
DROP POLICY IF EXISTS "Allow public insert" ON members;
DROP POLICY IF EXISTS "Allow public update" ON members;
DROP POLICY IF EXISTS "Allow public delete" ON members;

DROP POLICY IF EXISTS "Allow public read" ON mading_posts;
DROP POLICY IF EXISTS "Allow public insert" ON mading_posts;
DROP POLICY IF EXISTS "Allow public update" ON mading_posts;
DROP POLICY IF EXISTS "Allow public delete" ON mading_posts;

-- Buat Kebijakan Akses Publik Terbuka (Public Access Policies)
CREATE POLICY "Allow public read" ON guilds FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON guilds FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON guilds FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON guilds FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON members FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON members FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON mading_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON mading_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON mading_posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete" ON mading_posts FOR DELETE USING (true);

-- 6. MASUKKAN SEED DATA (DATA AWAL CONTOH)
INSERT INTO guilds (id_guild, nama_guild, nama_ketua, kontak_ketua, created_at)
VALUES 
  ('FF-EVOS-21', 'EVOS Divine Clone', 'Muhammad Farchan', '081234567890 (WA)', NOW() - INTERVAL '30 days'),
  ('FF-SND-99', 'Sunda Esports', 'Kang Cecep', 'cecep_sepuh#1312 (Discord)', NOW() - INTERVAL '10 days');

INSERT INTO members (id_member, id_guild, nama, umur, level, kota, nickname_ff, username, password, role, created_at)
VALUES
  ('MEM-EVOS-1', 'FF-EVOS-21', 'Muhammad Farchan', 22, 78, 'Jakarta', 'EVOS Manay', 'manay', '123', 'Ketua', NOW() - INTERVAL '30 days'),
  ('MEM-EVOS-2', 'FF-EVOS-21', 'Kenbo Wijaya', 20, 69, 'Bandung', 'EVOS Kenbo', 'kenbo', '123', 'Officer', NOW() - INTERVAL '25 days'),
  ('MEM-EVOS-3', 'FF-EVOS-21', 'Fajar Street', 19, 72, 'Tangerang', 'EVOS Street', 'street', '123', 'Member', NOW() - INTERVAL '20 days'),
  ('MEM-EVOS-4', 'FF-EVOS-21', 'Abu Sofyan', 21, 70, 'Bekasi', 'EVOS Abu', 'abu', '123', 'Member', NOW() - INTERVAL '15 days'),
  ('MEM-EVOS-5', 'FF-EVOS-21', 'Rasyah Rasyid', 16, 75, 'Makassar', 'BTR Rasyah', 'rasyah', '123', 'Member', NOW() - INTERVAL '5 days'),
  ('MEM-SND-1', 'FF-SND-99', 'Kang Cecep', 25, 65, 'Garut', 'SND CecepX', 'cecep', '123', 'Ketua', NOW() - INTERVAL '10 days'),
  ('MEM-SND-2', 'FF-SND-99', 'Asep Kabayan', 18, 52, 'Tasikmalaya', 'SND Kabayan', 'kabayan', '123', 'Member', NOW() - INTERVAL '8 days');

INSERT INTO mading_posts (id_post, id_guild, isi_pengumuman, author, author_role, created_at)
VALUES
  ('POST-EVOS-1', 'FF-EVOS-21', '🔥 UPDATE JADWAL SCRIM: Scrim Internal malam ini jam 20:00 WIB vs RRQ Esports. Harap semua squad inti standby di Discord 15 menit sebelum mulai. Map yang dimainkan: Bermuda, Purgatory, Kalahari. Aim keras, jangan loyo!', 'EVOS Manay', 'Ketua', NOW() - INTERVAL '2 days'),
  ('POST-EVOS-2', 'FF-EVOS-21', '🏆 Pendaftaran Turnamen FFML Community Season depan sudah resmi dibuka! Kita butuh perwakilan 2 Squad. Yang berminat mendaftar harap setor nama tim dan level akun ke Kenbo untuk di-seleksi terlebih dahulu.', 'EVOS Kenbo', 'Officer', NOW() - INTERVAL '1 days'),
  ('POST-SND-1', 'FF-SND-99', '⚡ Sampurasun baraya! Tong hilap engke wengi jam 19:30 WIB urang ngerush bareng di Ranked map Bermuda. Siapkeun kuota jeung mental, ampun sepuh! 🙏', 'SND CecepX', 'Ketua', NOW() - INTERVAL '4 days');`}
                    </pre>
                    <div className="absolute bottom-2 right-2 bg-slate-900 border border-slate-800 text-slate-500 text-[8px] font-mono px-2 py-1 rounded uppercase tracking-wider select-none pointer-events-none">
                      Postgres SQL
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
