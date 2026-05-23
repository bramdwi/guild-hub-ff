/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Shield, ArrowRight } from "lucide-react";
import { DBState } from "../types";

interface LandingPageProps {
  db: DBState;
  onEnterGuild: (guildId: string) => void;
  onNavigate: (view: "register-guild") => void;
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
    </div>
  );
}
