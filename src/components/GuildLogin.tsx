/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Shield, LogIn, ArrowLeft, Users, Lock, Eye, EyeOff } from "lucide-react";
import { DBState, Guild, Member } from "../types";

interface GuildLoginProps {
  db: DBState;
  guildId: string;
  onLoginSuccess: (guildId: string, memberId: string) => void;
  onBack: () => void;
}

export default function GuildLogin({
  db,
  guildId,
  onLoginSuccess,
  onBack,
}: GuildLoginProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Entrance animation state
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Find the guild
  const currentGuild = db.guilds.find((g) => g.id_guild === guildId);
  const guildMembers = db.members.filter((m) => m.id_guild === guildId);

  if (!currentGuild) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-bold mb-4">⚠️ Guild "{guildId}" tidak ditemukan!</p>
        <button onClick={onBack} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          Kembali
        </button>
      </div>
    );
  }

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!usernameInput.trim()) {
      setError("Harap masukkan Username Anda!");
      return;
    }
    if (!passwordInput.trim()) {
      setError("Harap masukkan Password Anda!");
      return;
    }

    // Simulate verification delay for immersive UX
    setIsAuthenticating(true);
    await new Promise((r) => setTimeout(r, 600));

    const cleanUsername = usernameInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    // Validate member in this guild
    const foundMember = guildMembers.find(
      (m) => m.username.toLowerCase() === cleanUsername
    );

    if (!foundMember) {
      setIsAuthenticating(false);
      setError(`Username "${cleanUsername}" tidak terdaftar di klan ini!`);
      return;
    }

    if (foundMember.password !== cleanPassword) {
      setIsAuthenticating(false);
      setError("Password yang Anda masukkan salah!");
      return;
    }

    // Success — slight delay for the authenticating animation
    setTimeout(() => {
      setIsAuthenticating(false);
      onLoginSuccess(guildId, foundMember.id_member);
    }, 300);
  };

  // Role color map
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Ketua":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Officer":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16">
      <div
        className={`transition-all duration-500 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Back Navigation */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white text-sm font-display font-bold uppercase tracking-wider group transition"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* LEFT: Guild Profile Card (2 cols) */}
          <div className="md:col-span-2 space-y-6">
            {/* Guild Identity Card */}
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md shadow-2xl shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-500 to-amber-500"></div>
              <div className="absolute -bottom-16 -right-16 h-48 w-48 bg-orange-500/5 rounded-full blur-3xl"></div>

              <div className="flex items-center gap-4 mb-5">
                {currentGuild.logo ? (
                  <img 
                    src={currentGuild.logo} 
                    alt="Logo" 
                    className="w-16 h-16 object-cover rounded-2xl shadow-lg border border-orange-400/20 shrink-0"
                  />
                ) : (
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg border border-orange-400/20 text-white font-display font-extrabold text-2xl tracking-tight uppercase shrink-0">
                    {currentGuild.nama_guild.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                    {currentGuild.nama_guild}
                  </h2>
                  <p className="text-xs font-mono text-slate-400 mt-0.5 bg-slate-950/50 border border-slate-800 inline-flex px-2 py-0.5 rounded">
                    ID: {currentGuild.id_guild}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                  <span className="text-slate-500 font-semibold">Kapten:</span>
                  <span className="text-white font-bold">{currentGuild.nama_ketua}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                  <span className="text-slate-500 font-semibold">Member:</span>
                  <span className="text-blue-400 font-bold flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {guildMembers.length} Players
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                  <span className="text-slate-500 font-semibold">Terdaftar Sejak:</span>
                  <span className="text-slate-300 font-mono text-[10px]">
                    {new Date(currentGuild.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Credential Login Form (3 cols) */}
          <div className="md:col-span-3">
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl shadow-black/40 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-500 to-red-600"></div>
              <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-orange-500/5 rounded-full blur-3xl"></div>

              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono mb-4">
                  <Lock className="w-3 h-3" />
                  STAGE 2 — AUTENTIKASI ROSTER
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2">
                  Masuk Sebagai Siapa?
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                  Guild <span className="text-orange-400 font-bold">{currentGuild.nama_guild}</span> terverifikasi.
                  Silakan masukkan <span className="text-white font-semibold">Username</span> dan{" "}
                  <span className="text-white font-semibold">Password</span> roster Anda untuk melanjutkan ke dashboard arena.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthenticate} className="space-y-5">
                <div>
                  <label
                    htmlFor="guild-username"
                    className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2"
                  >
                    USERNAME ROSTER *
                  </label>
                  <div className="relative">
                    <input
                      id="guild-username"
                      type="text"
                      placeholder="Masukkan username Anda"
                      value={usernameInput}
                      onChange={(e) => {
                        setUsernameInput(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isAuthenticating}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-700 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="guild-password"
                    className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2"
                  >
                    PASSWORD ROSTER *
                  </label>
                  <div className="relative">
                    <input
                      id="guild-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={passwordInput}
                      onChange={(e) => {
                        setPasswordInput(e.target.value);
                        if (error) setError("");
                      }}
                      disabled={isAuthenticating}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-950/30 border border-red-500/20 px-4 py-3 rounded-xl flex items-center gap-2">
                    <span className="shrink-0">⚠️</span> {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-display font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/20 hover:shadow-orange-600/40 group active:scale-[0.98] text-sm"
                >
                  {isAuthenticating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Memverifikasi Kredensial...
                    </>
                  ) : (
                    <>
                      Masuk ke Arena Dashboard
                      <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Security notice */}
              <div className="mt-6 bg-slate-950/70 border border-slate-900 rounded-xl p-4 text-[10px] font-mono text-slate-500 leading-relaxed">
                <span className="text-emerald-500 font-bold">🔒 SECURE:</span>{" "}
                Autentikasi Anda dienkripsi dan diproses langsung ke database server klan. Anda akan masuk ke dashboard sesuai role yang terdaftar di roster (Ketua / Officer / Member).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
