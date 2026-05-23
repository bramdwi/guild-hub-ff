/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Shield, Users, Bell, LogOut, Copy, Check, Users2, Info, Share2, Phone, Award, Star
} from "lucide-react";
import { DBState, Guild, Member, MadingPost, UserRole } from "../types";
import MadingSection from "./MadingSection";
import AnggotaSection from "./AnggotaSection";

interface GuildDashboardProps {
  db: DBState;
  guildId: string;
  activeMemberId: string | null;
  onLogout: () => void;
  onAddPost: (text: string, authorNickname: string, authorRole: UserRole) => void;
  onEditPost: (postId: string, text: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdateRole: (memberId: string, role: UserRole) => void;
  onKicked: (memberId: string) => void;
  onUpdateGuild: (guildId: string, slogan: string, logo: string) => void;
}

export default function GuildDashboard({
  db,
  guildId,
  activeMemberId,
  onLogout,
  onAddPost,
  onEditPost,
  onDeletePost,
  onUpdateRole,
  onKicked,
  onUpdateGuild,
}: GuildDashboardProps) {
  // Fetch current guild detail
  const currentGuild = db.guilds.find((g) => g.id_guild === guildId);
  
  // Filter members and posts belonging to this guild
  const guildMembers = db.members.filter((m) => m.id_guild === guildId);
  const guildPosts = db.mading.filter((p) => p.id_guild === guildId);

  // Derive current logged-in user dynamically from the activeMemberId prop
  const currentUser = db.members.find((m) => m.id_member === activeMemberId) || null;

  const [activeTab, setActiveTab] = useState<"mading" | "anggota" | "tentang">("mading");
  
  // Clipboard copy feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const [sloganInput, setSloganInput] = useState("");
  const [logoInput, setLogoInput] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edits when currentGuild changes
  useEffect(() => {
    if (currentGuild) {
      setSloganInput(currentGuild.slogan || "");
      setLogoInput(currentGuild.logo || "");
    }
  }, [guildId, currentGuild]);

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ukuran gambar terlalu besar! Maksimal 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!currentGuild) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold mb-4">Error: Guild tidak ditemukan!</p>
        <button onClick={onLogout} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold">
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Create absolute invite link
  const getInviteLink = () => {
    if (typeof window === "undefined") return `${currentGuild.id_guild}`;
    return `${window.location.origin}?invite=${currentGuild.id_guild}`;
  };

  const handleCopyLink = () => {
    const inviteUrl = getInviteLink();
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(currentGuild.id_guild);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getRoleTheme = (role: UserRole) => {
    switch (role) {
      case "Ketua":
        return {
          glow: "border-red-500/30 shadow-red-500/5",
          badge: "bg-red-500/10 text-red-400 border-red-500/30",
          text: "text-red-400"
        };
      case "Officer":
        return {
          glow: "border-amber-500/30 shadow-amber-500/5",
          badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
          text: "text-amber-400"
        };
      default:
        return {
          glow: "border-blue-500/30 shadow-blue-500/5",
          badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
          text: "text-blue-400"
        };
    }
  };

  const currentRoleTheme = currentUser ? getRoleTheme(currentUser.role) : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      
      {/* 1. TOP DASHBOARD CONTROL PANEL BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 rounded-3xl p-5 mb-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-red-500 to-amber-500"></div>

        {/* Guild metadata header */}
        <div className="flex items-center gap-4">
          {currentGuild.logo ? (
            <img 
              src={currentGuild.logo} 
              alt="Logo Guild" 
              className="w-14 h-14 object-cover rounded-2xl shadow-lg border border-orange-400/20 shrink-0"
            />
          ) : (
            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg border border-orange-400/20 text-white font-display font-extrabold text-xl tracking-tight uppercase">
              {currentGuild.nama_guild.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
                {currentGuild.nama_guild}
              </h2>
              {/* Guild ID copy action */}
              <button
                onClick={handleCopyId}
                title="Salin ID Guild"
                className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-[10px] font-bold px-2 py-1 rounded-md transition"
              >
                ID: {currentGuild.id_guild}
                {copiedId ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>
            </div>
            
            {currentGuild.slogan && (
              <p className="text-orange-405 text-[10px] sm:text-xs italic font-display font-black tracking-wider mt-0.5 uppercase text-orange-400">
                🔥 "{currentGuild.slogan}"
              </p>
            )}
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Ketua: <span className="text-slate-200 font-semibold">{currentGuild.nama_ketua}</span>
            </p>
          </div>
        </div>

        {/* User Identity active display & logout */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-805/50 md:border-t-0 pt-4 md:pt-0">
          
          {/* ACTIVE ACCOUNT LOGGED IN CARD */}
          {currentUser && (
            <div className="bg-slate-950 border border-slate-850 px-4 py-2 rounded-2xl flex items-center gap-3 max-w-xs relative">
              <div className="space-y-0.5 text-right shrink-0">
                <span className="text-[9px] font-bold text-slate-500 block tracking-wider uppercase font-mono">
                  LOGGED IN AS:
                </span>
                <span className="text-white font-mono font-bold text-xs block">
                  {currentUser.nickname_ff}
                </span>
              </div>

              {/* Display Profile Avatar based on selected role */}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative shrink-0 font-display font-extrabold ${
                currentUser.role === "Ketua" 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : currentUser.role === "Officer"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}>
                <span className="text-xs uppercase">{currentUser.nickname_ff[0]}</span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" title="Online Roster"></span>
              </div>
            </div>
          )}

          {/* EXIT DASHBOARD BUTTON */}
          <button
            onClick={onLogout}
            className="p-3 bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-2xl transition"
            title="Keluar Guild"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. RECRUITMENT LINK PANEL SHAPE (Only for Ketua & Officer) */}
      {currentUser && (currentUser.role === "Ketua" || currentUser.role === "Officer") && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full"></div>
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Share2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-display font-black text-white uppercase tracking-wider">
                Rekrut Roster Baru (Undangan Pendaftaran)
              </h4>
              <p className="text-slate-400 text-xs mt-0.5 max-w-md">
                Bagikan link otomatis di bawah ini. Ketika dibuka, link ini akan langsung mengarahkan pendaftar ke form input dengan ID Guild terisi otomatis!
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyLink}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/10 shrink-0 w-full sm:w-auto"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                Link Tersalin!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin Link Undangan
              </>
            )}
          </button>
        </div>
      )}

      {/* IMMERSIVE UI STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="absolute -right-2 -top-2 h-16 w-16 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Member</p>
          <h3 className="text-3xl font-black mt-1 text-white">
            {guildMembers.length}
            <span className="text-sm text-slate-500 font-medium ml-1">/ 50 Max</span>
          </h3>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="absolute -right-2 -top-2 h-16 w-16 bg-orange-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg. Level Roster</p>
          <h3 className="text-3xl font-black mt-1 text-orange-500">
            LV. {guildMembers.length > 0 ? Math.round(guildMembers.reduce((acc, m) => acc + m.level, 0) / guildMembers.length) : 0}
          </h3>
        </div>
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative overflow-hidden group hover:border-slate-700 transition-all duration-300">
          <div className="absolute -right-2 -top-2 h-16 w-16 bg-red-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform"></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mading Aktivitas</p>
          <h3 className="text-3xl font-black mt-1 text-red-500">
            {guildPosts.length} <span className="text-sm text-slate-500 font-medium ml-1">Kabar Scrim</span>
          </h3>
        </div>
      </div>

      {/* 3. CENTER LAYOUT & TABS NAVIGATION */}
      <div className="grid md:grid-cols-4 gap-8 items-start">
        
        {/* Left Side Tab Navigation Column */}
        <div className="space-y-2">
          
          <button
            onClick={() => setActiveTab("mading")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
              activeTab === "mading"
                ? "bg-orange-500/10 text-orange-500 border-l-2 border-orange-500 font-bold"
                : "bg-slate-950/40 text-slate-400 hover:text-slate-100 border border-slate-900 hover:bg-slate-800/20"
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            Mading Scrim
            <span className={`ml-auto border text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === "mading"
                ? "bg-orange-500/20 border-orange-500/30 text-orange-400"
                : "bg-slate-950/70 border-slate-800 text-slate-500"
            }`}>
              {guildPosts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("anggota")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
              activeTab === "anggota"
                ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 font-bold"
                : "bg-slate-950/40 text-slate-400 hover:text-slate-100 border border-slate-900 hover:bg-slate-800/20"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Roster Pasukan
            <span className={`ml-auto border text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
              activeTab === "anggota"
                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                : "bg-slate-950/70 border-slate-800 text-slate-500"
            }`}>
              {guildMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("tentang")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
              activeTab === "tentang"
                ? "bg-amber-500/10 text-amber-500 border-l-2 border-amber-500 font-bold"
                : "bg-slate-950/40 text-slate-400 hover:text-slate-100 border border-slate-900 hover:bg-slate-800/20"
            }`}
          >
            <Info className="w-4 h-4 shrink-0" />
            Informasi Klan
          </button>

          {/* Quick Info Box on side */}
          <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 space-y-4">
            <h5 className="font-display text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-900 pb-1.5">
              <span>🎮 LIVE STATUS</span>
            </h5>
            
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Jabatan Anda:</span>
                <span className={`font-mono font-bold uppercase text-[10px] ${currentRoleTheme?.text}`}>
                  {currentUser?.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FF Nickname:</span>
                <span className="text-white font-mono font-semibold">{currentUser?.nickname_ff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FF Level:</span>
                <span className="text-amber-500 font-bold">Lv.{currentUser?.level}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-2 text-[10px] rounded text-slate-500 leading-normal block">
              🔒 <span className="text-slate-400 font-semibold">SECURE LOGIN:</span> Sesi aktif Anda terhubung secara aman di database server klan.
            </div>
          </div>

        </div>

        {/* Right Side Main Content Pane */}
        <div className="md:col-span-3 bg-slate-950/60 border border-slate-900 rounded-3xl p-5 md:p-6 shadow-2xl relative">
          
          {/* TAB 1: MADING SCRIM */}
          {activeTab === "mading" && (
            <MadingSection
              posts={guildPosts}
              currentUser={currentUser}
              onAddPost={(text) => {
                if (currentUser) {
                  onAddPost(text, currentUser.nickname_ff, currentUser.role);
                }
              }}
              onEditPost={onEditPost}
              onDeletePost={onDeletePost}
            />
          )}

          {/* TAB 2: ROSTER LIST */}
          {activeTab === "anggota" && (
            <AnggotaSection
              members={guildMembers}
              currentUser={currentUser}
              onUpdateRole={onUpdateRole}
              onKicked={onKicked}
            />
          )}

          {/* TAB 3: TENTANG CLAN DETAILS */}
          {activeTab === "tentang" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Info className="text-slate-400 w-5 h-5" />
                  Informasi Profil Klan
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Rincian administrasi dan legalitas pembentukan klan di database nasional.
                </p>
              </div>

              {/* Showcase Banner if Logo or Slogan exists */}
              {(currentGuild.logo || currentGuild.slogan) && (
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-3xl rounded-full"></div>
                  <div className="shrink-0 relative">
                    {currentGuild.logo ? (
                      <img 
                        src={currentGuild.logo} 
                        alt="Logo" 
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl border-2 border-orange-500/20 shadow-2xl"
                      />
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center font-display font-extrabold text-white text-3xl">
                        {currentGuild.nama_guild.slice(0, 2)}
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left space-y-2">
                    <h4 className="font-display text-2xl font-black text-white uppercase tracking-tight">
                      {currentGuild.nama_guild}
                    </h4>
                    {currentGuild.slogan && (
                      <p className="text-orange-400 text-xs sm:text-sm italic font-display font-extrabold uppercase tracking-wide">
                        🔥 "{currentGuild.slogan}"
                      </p>
                    )}
                    <span className="inline-block font-mono text-[9px] font-bold text-slate-500 bg-slate-950 border border-slate-900 px-2.5 py-0.5 rounded">
                      VERIFIED TIM KLASIFIKASI KLAN
                    </span>
                  </div>
                </div>
              )}

              {/* Info Table */}
              <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 space-y-4">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-950 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">NAMA GUILD</span>
                    <span className="block text-white font-extrabold font-display uppercase text-lg">{currentGuild.nama_guild}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">ID UNIK DAFTAR</span>
                    <span className="block text-emerald-400 font-bold font-mono text-lg">{currentGuild.id_guild}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b border-slate-950 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">NAMA KEPALA CLAN</span>
                    <span className="block text-white font-semibold text-sm sm:text-base">{currentGuild.nama_ketua}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">KONTAK RESMI (WA/DISCORD)</span>
                    <span className="text-orange-400 font-semibold text-sm sm:text-base flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      {currentGuild.kontak_ketua}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">TANGGAL BERDIRI (DATABASE)</span>
                    <span className="block text-slate-300 text-xs sm:text-sm">
                      {new Date(currentGuild.created_at).toLocaleDateString("id-ID", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 font-mono">TOTAL KEKUATAN ROSTER</span>
                    <span className="block text-white font-bold text-xs sm:text-sm">{guildMembers.length} Aktif Players</span>
                  </div>
                </div>
              </div>

              {/* 🏆 DAFTAR PENGHARGAAN GUILD */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                <h4 className="text-xs sm:text-sm font-display font-black text-amber-500 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-5 h-5 animate-pulse text-amber-500" />
                  🏆 LEMARI PENGHARGAAN & PRESTASI KLAN
                </h4>
                
                <div className="grid sm:grid-cols-2 gap-3 text-xs leading-normal">
                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-white">JUARA 1 REGIONAL SCRIMS</span>
                      <span className="text-[10px] text-slate-500 font-mono">Season 20 - FFML Community</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg shrink-0">
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-white">TOP 3 KLAN TERAKTIF NATIONAL</span>
                      <span className="text-[10px] text-slate-500 font-mono">Verified Guild - Garena ID</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-white">PIALA INDONESIA ESPORTS RISING</span>
                      <span className="text-[10px] text-slate-500 font-mono">Turnamen Garena 2025</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
                      <Users2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold block text-white">KLAN KEKELUARGAAN TERBAIK</span>
                      <span className="text-[10px] text-slate-500 font-mono">Kategori Komunitas Discord ID</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guide card */}
              <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-xs text-slate-400 space-y-2 leading-relaxed">
                <span className="font-bold text-white uppercase block">🛡️ TATA TERTIB CLAN (ESPORTS REGULATORY):</span>
                <p>
                  1. Roster dilarang keras bermain menggunakan Cheat / Mod Menu / Script ilegal dalam scrimmage maupun turnamen turnamen kecil. Sanksi: Kick otomatis.
                </p>
                <p>
                  2. Menjaga sopan santun antar rekan klan ksatria. Selalu hormati instruksi taktik yang diberikan Kapten (Ketua) dan wakil klan (Officer) demi keselarasan booyah!
                </p>
              </div>

              {/* ⚔️ PENGATURAN PROFIL KLAN (KHUSUS KETUA) */}
              {currentUser?.role === "Ketua" && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs sm:text-sm font-display font-black text-orange-500 uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    ⚔️ PENGATURAN PROFIL KLAN (KHUSUS KETUA)
                  </h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Sebagai Ketua Guild, Anda memiliki hak istimewa untuk mengustomisasi slogan klan dan memasang lambang/logo resmi tim klan Anda agar terpampang gagah di arena.
                  </p>

                  <div className="space-y-4 text-xs">
                    {/* Slogan input */}
                    <div>
                      <label htmlFor="guildSloganInput" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                        SLOGAN RESMI KLAN
                      </label>
                      <input
                        id="guildSloganInput"
                        type="text"
                        placeholder="Contoh: Aim Keras, Booyah Pasti! ⚔️"
                        value={sloganInput}
                        onChange={(e) => setSloganInput(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-805 rounded-xl px-4 py-3 text-white placeholder-slate-700 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                      />
                    </div>

                    {/* Logo selection */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="guildLogoFileInput" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                          UPLOAD LOGO TIM (PNG/JPG)
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            id="guildLogoFileInput"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-950 file:text-slate-300 hover:file:bg-slate-800 file:cursor-pointer transition cursor-pointer"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="guildLogoUrlInput" className="block text-slate-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                          ATAU MASUKKAN URL GAMBAR LOGO
                        </label>
                        <input
                          id="guildLogoUrlInput"
                          type="text"
                          placeholder="https://link-gambar-anda.com/logo.png"
                          value={logoInput}
                          onChange={(e) => setLogoInput(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-805 rounded-xl px-4 py-3 text-white placeholder-slate-700 text-xs focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-mono"
                        />
                      </div>
                    </div>

                    {/* Logo Preview */}
                    <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-850 p-4 rounded-2xl">
                      <div className="shrink-0">
                        {logoInput ? (
                          <img
                            src={logoInput}
                            alt="Preview Logo"
                            className="w-16 h-16 object-cover rounded-2xl border border-orange-500/20"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center font-display font-extrabold text-slate-600 text-[10px]">
                            NO LOGO
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase tracking-wider mb-1 font-mono">PREVIEW LAMBANG</span>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          Lambang di atas akan menjadi representasi visual resmi klan Anda. Pastikan gambar rasio kotak (1:1) untuk hasil optimal.
                        </p>
                        {logoInput && (
                          <button
                            type="button"
                            onClick={() => setLogoInput("")}
                            className="text-[10px] font-bold text-red-400 hover:text-red-300 underline mt-2 block outline-none border-none bg-transparent cursor-pointer"
                          >
                            Hapus Logo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 flex items-center justify-between gap-4">
                      {saveSuccess ? (
                        <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5 animate-[pulse_1s_infinite]">
                          ✓ Pengaturan Profil Klan Berhasil Disimpan!
                        </p>
                      ) : (
                        <div />
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          onUpdateGuild(guildId, sloganInput.trim(), logoInput);
                          setSaveSuccess(true);
                          setTimeout(() => setSaveSuccess(false), 3000);
                        }}
                        className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-display font-bold py-2.5 px-6 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-orange-600/10 active:scale-95 cursor-pointer outline-none border-none"
                      >
                        SIMPAN PERUBAHAN
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
