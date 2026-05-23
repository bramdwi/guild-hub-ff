/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { LogIn, Shield, KeyRound, User, Database } from "lucide-react";
import { DBState } from "../types";

interface LandingPageProps {
  db: DBState;
  onLoginSuccess: (guildId: string, memberId: string) => void;
  onNavigate: (view: "register-guild") => void;
  prefilledGuildId: string;
  setPrefilledGuildId: (id: string) => void;
}

export default function LandingPage({
  db,
  onLoginSuccess,
  onNavigate,
  prefilledGuildId,
  setPrefilledGuildId,
}: LandingPageProps) {
  const [guildIdInput, setGuildIdInput] = useState(prefilledGuildId);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!guildIdInput.trim()) {
      setError("Harap masukkan ID Guild!");
      return;
    }
    if (!usernameInput.trim()) {
      setError("Harap masukkan Username!");
      return;
    }
    if (!passwordInput.trim()) {
      setError("Harap masukkan Password!");
      return;
    }

    const cleanGuildId = guildIdInput.trim().toUpperCase();
    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // 1. Validate Guild
    const foundGuild = db.guilds.find((g) => g.id_guild === cleanGuildId);
    if (!foundGuild) {
      setError(`ID Guild "${cleanGuildId}" tidak terdaftar di sistem!`);
      return;
    }

    // 2. Validate Member in Guild
    const foundMember = db.members.find(
      (m) => m.id_guild === cleanGuildId && m.username.toLowerCase() === cleanUsername
    );
    if (!foundMember) {
      setError(`Username "${cleanUsername}" tidak ditemukan di klan ini!`);
      return;
    }

    // 3. Validate Password
    if (foundMember.password !== cleanPassword) {
      setError("Password yang Anda masukkan salah!");
      return;
    }

    // Login successful
    onLoginSuccess(cleanGuildId, foundMember.id_member);
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
          Platform manajemen Esports eksklusif untuk Guild & Klan Game Free Fire di Indonesia. Atur jadwal scrim, turnamen, mading, dan roster klan Anda dalam satu pintu aman.
        </p>
      </div>

      {/* Grid Layout for main forms (Simplified to symmetric 2-column layout) */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch relative z-10">
        
        {/* Panel Login Kredensial */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>
          
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <LogIn className="text-orange-500 w-6 h-6" />
              Masuk Dashboard Guild
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6">
              Masukkan ID Guild beserta Username dan Password klan Anda untuk masuk ke arena koordinasi mading & roster.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="guildId" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                  ID GUILD *
                </label>
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="username" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    USERNAME *
                  </label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                    PASSWORD *
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (error) setError("");
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                  />
                </div>
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
                <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Quick test tips with click-to-autofill */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <h4 className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-orange-500" />
              💡 AKUN UJI COBA (KLIK UNTUK AUTO-FILL):
            </h4>
            
            <div className="flex flex-col gap-2.5">
              {db.guilds.slice(0, 2).map((g) => {
                const members = db.members.filter((m) => m.id_guild === g.id_guild);
                const ketua = members.find((m) => m.role === "Ketua");
                const member = members.find((m) => m.role === "Member");
                
                return (
                  <div
                    key={g.id_guild}
                    className="bg-slate-950/85 border border-slate-805/85 p-3.5 rounded-xl text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                      <span className="font-bold text-orange-400 font-display">{g.nama_guild}</span>
                      <span className="font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                        ID: {g.id_guild}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 leading-normal">
                      {ketua && (
                        <div 
                          onClick={() => {
                            setGuildIdInput(g.id_guild);
                            setUsernameInput(ketua.username);
                            setPasswordInput(ketua.password);
                          }}
                          className="hover:text-orange-400 hover:bg-orange-500/5 cursor-pointer transition bg-slate-900/50 p-2 rounded-lg border border-slate-800/30 hover:border-orange-500/20"
                        >
                          <span className="text-[9px] font-black text-red-500 uppercase block mb-0.5">🔑 KETUA (LEADER):</span>
                          U: {ketua.username}<br />P: {ketua.password}
                        </div>
                      )}
                      {member && (
                        <div 
                          onClick={() => {
                            setGuildIdInput(g.id_guild);
                            setUsernameInput(member.username);
                            setPasswordInput(member.password);
                          }}
                          className="hover:text-blue-400 hover:bg-blue-500/5 cursor-pointer transition bg-slate-900/50 p-2 rounded-lg border border-slate-800/30 hover:border-blue-500/20"
                        >
                          <span className="text-[9px] font-black text-blue-400 uppercase block mb-0.5">🔑 MEMBER (ANGGOTA):</span>
                          U: {member.username}<br />P: {member.password}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Panel Registrasi Baru (Untuk Ketua Guild) */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl shadow-black/40 relative group overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-amber-500 to-orange-500"></div>
          
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Shield className="text-amber-500 w-6 h-6" />
                Untuk Ketua Guild
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Apakah Anda kapten tim, leader klan, atau Ketua Guild Free Fire yang ingin memodernisasi manajemen roster dan scrim Anda? 
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-3.5 text-xs sm:text-sm text-slate-300">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                💎 KEUNTUNGAN DAFTAR GUILD HUB FF:
              </h4>
              <ul className="space-y-2 list-disc list-inside text-slate-400 text-xs leading-relaxed">
                <li>Dapatkan <span className="text-amber-400 font-semibold">ID Guild Unik Nasional</span> secara instan.</li>
                <li>Buat portal rekrutmen roster klan dengan link undangan otomatis.</li>
                <li>Tulis, edit, dan hapus mading scrim serta jadwal turnamen klan.</li>
                <li>Promosikan anggota menjadi Officer untuk mendelegasikan tugas mading.</li>
                <li>Keluarkan (kick) anggota klan yang melanggar aturan secara realtime.</li>
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
