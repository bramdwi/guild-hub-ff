/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Shield, UserPlus, Database } from "lucide-react";
import { DBState, Guild } from "../types";

interface LandingPageProps {
  db: DBState;
  onEnterGuild: (guildId: string) => void;
  onNavigate: (view: "register-guild" | "register-member") => void;
  prefilledGuildId: string;
  setPrefilledGuildId: (id: string) => void;
}

export default function LandingPage({
  db,
  onEnterGuild,
  onNavigate,
  prefilledGuildId,
  setPrefilledGuildId,
}: LandingPageProps) {
  const [guildIdInput, setGuildIdInput] = useState(prefilledGuildId);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guildIdInput.trim()) {
      setError("Harap masukkan ID Guild!");
      return;
    }

    const cleanId = guildIdInput.trim().toUpperCase();
    const found = db.guilds.find((g) => g.id_guild === cleanId);

    if (found) {
      onEnterGuild(cleanId);
    } else {
      setError(`ID Guild "${cleanId}" tidak terdaftar di sistem!`);
    }
  };

  // Quick stats
  const totalGuilds = db.guilds.length;
  const totalMembers = db.members.length;
  const totalPosts = db.mading.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16">
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
        <p className="mt-3 text-slate-400 max-w-xl mx-auto text-sm sm:text-base font-sans">
          Platform manajemen Esports terlengkap untuk Guild & Klan Game Free Fire di Indonesia. Atur jadwal scrim, turnamen, mading, dan manajemen klan Anda sekarang!
        </p>
      </div>

      {/* Grid Layout for main forms */}
      <div className="grid md:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* Panel Login Samping */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>
          
          <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <LogIn className="text-orange-500 w-5 h-5" />
            Masuk Dashboard Guild
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mb-6">
            Masukkan kode ID Guild Anda untuk mengelola mading, melihat daftar tim, dan memperbarui informasi.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="guildId" className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                ID GUILD (E.g. FF-EVOS-21, FF-SND-99)
              </label>
              <div className="relative">
                <input
                  id="guildId"
                  type="text"
                  placeholder="Contoh: FF-EVOS-21"
                  value={guildIdInput}
                  onChange={(e) => {
                    setGuildIdInput(e.target.value);
                    setPrefilledGuildId(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition uppercase tracking-wider"
                />
              </div>
              {error && (
                <p className="mt-2 text-xs text-red-500 bg-red-950/30 border border-red-500/20 px-3 py-1.5 rounded-lg">
                  ⚠️ {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 group active:scale-[0.98]"
            >
              Masuk Arena Guild
              <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Prompt quick test */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
              💡 Klik ID Guild Contoh untuk Uji Coba:
            </h4>
            <div className="flex flex-wrap gap-2">
              {db.guilds.map((g) => (
                <button
                  key={g.id_guild}
                  type="button"
                  onClick={() => {
                    setGuildIdInput(g.id_guild);
                    setPrefilledGuildId(g.id_guild);
                    setError("");
                  }}
                  className="bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-orange-400 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center justify-between gap-1 w-full text-left"
                >
                  <span className="font-semibold">{g.nama_guild}</span>
                  <span className="bg-slate-900 border border-slate-700/50 px-1.5 py-0.5 rounded text-[10px] text-slate-300">
                    {g.id_guild}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel Registrasi Baru */}
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-orange-500"></div>
            
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Shield className="text-amber-500 w-5 h-5" />
              Untuk Ketua Guild
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Ingin mendaftarkan klan/guild Free Fire Anda? Buat profil eksklusif klan Anda, bagikan link undangan, dan kelola mading squad sekarang.
            </p>

            <button
              onClick={() => onNavigate("register-guild")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-orange-500/50 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/5 group active:scale-[0.98]"
            >
              Daftarkan Guild Baru
              <Shield className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-blue-500 to-indigo-500"></div>
            
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <UserPlus className="text-blue-400 w-5 h-5" />
              Gabung Sebagai Anggota
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Menerima undangan klan atau sudah punya ID Guild? Daftarkan data diri Anda (Nickname, level akun, dsb) ke klan tujuan Anda di sini.
            </p>

            <button
              onClick={() => onNavigate("register-member")}
              className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/5 group active:scale-[0.98]"
            >
              Registrasi Anggota Baru
              <UserPlus className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
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
    </div>
  );
}
