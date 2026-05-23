/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Shield, Users, Bell, LogOut, Copy, Check, Users2, Info, Share2, Phone
} from "lucide-react";
import { DBState, Guild, Member, MadingPost, UserRole } from "../types";
import MadingSection from "./MadingSection";
import AnggotaSection from "./AnggotaSection";

interface GuildDashboardProps {
  db: DBState;
  guildId: string;
  onLogout: () => void;
  onAddPost: (text: string, authorNickname: string, authorRole: UserRole) => void;
  onEditPost: (postId: string, text: string) => void;
  onDeletePost: (postId: string) => void;
  onUpdateRole: (memberId: string, role: UserRole) => void;
  onKicked: (memberId: string) => void;
}

export default function GuildDashboard({
  db,
  guildId,
  onLogout,
  onAddPost,
  onEditPost,
  onDeletePost,
  onUpdateRole,
  onKicked,
}: GuildDashboardProps) {
  const [activeTab, setActiveTab] = useState<"mading" | "anggota" | "tentang">("mading");
  
  // Simulated logged-in user state
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  
  // Clipboard copy feedback
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // Fetch current guild detail
  const currentGuild = db.guilds.find((g) => g.id_guild === guildId);
  
  // Filter members and posts belonging to this guild
  const guildMembers = db.members.filter((m) => m.id_guild === guildId);
  const guildPosts = db.mading.filter((p) => p.id_guild === guildId);

  // Automatically set default logged-in user to the "Ketua" of this guild upon initial load
  useEffect(() => {
    if (guildMembers.length > 0) {
      // Find Ketua first, else select first member
      const ketua = guildMembers.find((m) => m.role === "Ketua") || guildMembers[0];
      setCurrentUser(ketua);
    }
  }, [guildId]); // Reset only if guild ID changes, or if current user becomes invalid

  // If members lists is updated, make sure current user is synchronized! (e.g. if their role was changed in sandbox view)
  useEffect(() => {
    if (currentUser) {
      const updatedUser = guildMembers.find((m) => m.id_member === currentUser.id_member);
      if (updatedUser) {
        setCurrentUser(updatedUser);
      } else if (guildMembers.length > 0) {
        // Current user was kicked, select another
        const ketua = guildMembers.find((m) => m.role === "Ketua") || guildMembers[0];
        setCurrentUser(ketua);
      } else {
        setCurrentUser(null);
      }
    }
  }, [db.members]);

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
          <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg border border-orange-400/20 text-white font-display font-extrabold text-xl tracking-tight uppercase">
            {currentGuild.nama_guild.slice(0, 2)}
          </div>
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
            
            <p className="text-slate-400 text-xs mt-1 font-sans">
              Ketua: <span className="text-slate-200 font-semibold">{currentGuild.nama_ketua}</span>
            </p>
          </div>
        </div>

        {/* User Identity switcher & logout */}
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-805/50 md:border-t-0 pt-4 md:pt-0">
          
          {/* SANDBOX SWITCH ACCOUNT COMPONENT */}
          {guildMembers.length > 0 && currentUser && (
            <div className="bg-slate-950 border border-slate-850 px-3 py-2 rounded-2xl flex items-center gap-2 max-w-xs relative group">
              <div className="space-y-0.5 text-right shrink-0">
                <span className="text-[9px] font-bold text-slate-505 block tracking-wider uppercase font-mono">
                  Simulasi Akun Roster:
                </span>
                <select
                  value={currentUser.id_member}
                  onChange={(e) => {
                    const match = guildMembers.find((m) => m.id_member === e.target.value);
                    if (match) setCurrentUser(match);
                  }}
                  className="bg-transparent border-none text-xs text-white font-bold font-mono py-0 px-0 outline-none cursor-pointer focus:ring-0 max-w-[150px] truncate"
                >
                  {guildMembers.map((member) => (
                    <option key={member.id_member} value={member.id_member} className="bg-slate-950 text-white">
                      {member.nickname_ff} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Profile Avatar based on selected role */}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center relative shrink-0 ${
                currentUser.role === "Ketua" 
                  ? "bg-red-500/10 border-red-500/30 text-red-400" 
                  : currentUser.role === "Officer"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-400"
              }`}>
                <span className="text-xs font-bold uppercase">{currentUser.nickname_ff[0]}</span>
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" title="Online"></span>
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

      {/* 2. RECRUITMENT LINK PANEL SHAPE */}
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
              💡 <span className="text-slate-400 font-semibold">TIPS:</span> Anda bebas mengubah identitas pada klan melalui menu select dropdown di kanan atas.
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

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
