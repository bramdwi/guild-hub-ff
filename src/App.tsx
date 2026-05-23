/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  getDB, 
  addGuildToDB, 
  addMemberToDB, 
  addMadingPostToDB, 
  editMadingPostInDB, 
  deleteMadingPostFromDB, 
  updateMemberRoleInDB, 
  deleteMemberFromDB,
  resetDBToDefault,
  generateId
} from "./utils/storage";
import { DBState, ActiveView, Guild, Member, MadingPost, UserRole } from "./types";

// Import Components
import LandingPage from "./components/LandingPage";
import RegisterGuild from "./components/RegisterGuild";
import RegisterMember from "./components/RegisterMember";
import GuildDashboard from "./components/GuildDashboard";
import DatabaseVisualizer from "./components/DatabaseVisualizer";

import { Shield, Sparkles, HelpCircle } from "lucide-react";

export default function App() {
  const [db, setDb] = useState<DBState>(getDB());
  const [currentView, setCurrentView] = useState<ActiveView>("landing");
  const [activeGuildId, setActiveGuildId] = useState<string | null>(null);
  
  // Direct entry/invite states
  const [prefilledGuildId, setPrefilledGuildId] = useState("");

  // Read URL search query for invite codes (?invite=FF-EVOS-21) on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const inviteCode = params.get("invite");
      
      if (inviteCode) {
        setPrefilledGuildId(inviteCode.toUpperCase());
        setCurrentView("register-member");
      }
    }
  }, []);

  // Sync state helpers
  const handleEnterGuild = (guildId: string) => {
    setActiveGuildId(guildId);
    setCurrentView("dashboard");
  };

  const handleRegisterGuild = (newGuild: Guild, leader: Member) => {
    const updatedDB = addGuildToDB(newGuild, leader);
    setDb(updatedDB);
    // Auto-login to the newly registered guild
    setActiveGuildId(newGuild.id_guild);
  };

  const handleRegisterMember = (newMember: Member) => {
    const updatedDB = addMemberToDB(newMember);
    setDb(updatedDB);
    // Member join succeeds. Under real conditions we would auto-login
    // We let the success card direct them to login
  };

  const handleAddPost = (text: string) => {
    if (!activeGuildId) return;
    
    // Find who is posting in this guild. 
    // In our prototype, they are acting as the active selected user
    const guildMembers = db.members.filter((m) => m.id_guild === activeGuildId);
    // Find the current pseudo-logged user in the dashboard. We can find by selecting who role matches
    // But since dashboard handles simulated account state, let's search who is acting as Ketua/Officer.
    // Let's pass author details from the active persona in the dashboard.
    // Instead of doing guessing inside App, let's find the first member that has the power, OR we can let standard member post if role matches.
    // Let's inspect which user is selected.
    // In order to make it extremely clean, we will handle creating the post directly from App,
    // assuming authorship belongs to whatever user is currently selected in dashboard state.
    // That means we should receive author detail inside onAddPost. Let's pass it!
  };

  // Upgraded announcement posting
  const handlePublishPost = (text: string, authorNickname: string, authorRole: UserRole) => {
    if (!activeGuildId) return;

    const newPost: MadingPost = {
      id_post: `POST-${generateId()}`,
      id_guild: activeGuildId,
      isi_pengumuman: text,
      author: authorNickname,
      author_role: authorRole,
      created_at: new Date().toISOString()
    };

    const updatedDB = addMadingPostToDB(newPost);
    setDb(updatedDB);
  };

  const handleEditPost = (postId: string, text: string) => {
    const updatedDB = editMadingPostInDB(postId, text);
    setDb(updatedDB);
  };

  const handleDeletePost = (postId: string) => {
    const updatedDB = deleteMadingPostFromDB(postId);
    setDb(updatedDB);
  };

  const handleUpdateMemberRole = (memberId: string, role: UserRole) => {
    const updatedDB = updateMemberRoleInDB(memberId, role);
    setDb(updatedDB);
  };

  const handleKickMember = (memberId: string) => {
    const updatedDB = deleteMemberFromDB(memberId);
    setDb(updatedDB);
  };

  const handleResetDatabase = () => {
    const defaultDB = resetDBToDefault();
    setDb(defaultDB);
    setActiveGuildId(null);
    setCurrentView("landing");
    setPrefilledGuildId("");
    
    // Clear URL parameters
    if (typeof window !== "undefined" && window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  const handleLogout = () => {
    setActiveGuildId(null);
    setCurrentView("landing");
    setPrefilledGuildId("");
    
    // Clear invite URL if any
    if (typeof window !== "undefined" && window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  // Find currently acting author profile for dashboard postings
  const getSelectedPersonaForPosts = (): { nickname: string; role: UserRole } => {
    if (!activeGuildId) return { nickname: "Guest", role: "Member" };
    // Find active acting user in current members list
    const guildMembers = db.members.filter((m) => m.id_guild === activeGuildId);
    // Find ketua as default fallback, else first member
    const activePersona = guildMembers.find((m) => m.role === "Ketua") || guildMembers[0];
    return {
      nickname: activePersona ? activePersona.nickname_ff : "Anonymous",
      role: activePersona ? activePersona.role : "Member"
    };
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pb-16 font-sans antialiased selection:bg-orange-600 selection:text-white relative overflow-hidden">
      {/* Visual Overlay Background Elements */}
      <div className="fixed -bottom-32 -left-32 h-[450px] w-[450px] bg-orange-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed -top-32 -right-32 h-[450px] w-[450px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* GLOBAL NAVBAR BAR */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 relative">
        <div className="w-full max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            onClick={handleLogout}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="h-8 w-8 rounded-lg bg-orange-600 flex items-center justify-center font-bold text-black shadow-lg shadow-orange-600/10">
              FF
            </div>
            <span className="font-display text-xl font-black tracking-tighter uppercase italic text-orange-500 group-hover:text-orange-400 transition-colors">
              Guild Hub FF
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ID CLAN DATABASE SERVER
            </span>
            <span className="bg-orange-600/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              PROTOTYPE
            </span>
          </div>
        </div>
      </header>

      {/* VIEWPORT AREA CONTENT */}
      <main className="relative">
        {currentView === "landing" && (
          <LandingPage
            db={db}
            onEnterGuild={handleEnterGuild}
            onNavigate={(view) => setCurrentView(view)}
            prefilledGuildId={prefilledGuildId}
            setPrefilledGuildId={setPrefilledGuildId}
          />
        )}

        {currentView === "register-guild" && (
          <RegisterGuild
            onRegister={handleRegisterGuild}
            onBack={handleLogout}
          />
        )}

        {currentView === "register-member" && (
          <RegisterMember
            db={db}
            prefilledGuildId={prefilledGuildId}
            onRegister={handleRegisterMember}
            onBack={handleLogout}
            onEnterGuild={handleEnterGuild}
          />
        )}

        {currentView === "dashboard" && activeGuildId && (
          <GuildDashboard
            db={db}
            guildId={activeGuildId}
            onLogout={handleLogout}
            onAddPost={(text, author, role) => handlePublishPost(text, author, role)}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onUpdateRole={handleUpdateMemberRole}
            onKicked={handleKickMember}
          />
        )}
      </main>

      {/* OVERRIDING ONADDPOST WITH DYNAMIC CURRENT SELECTOR IN DASHBOARD CALLBACK */}
      {currentView === "dashboard" && activeGuildId && (
        <div className="hidden">
          {/* Invisible binder to mount customized triggers */}
        </div>
      )}

      {/* 4. DYNAMIC DATABASE INSPECTOR FOOTER LAYER */}
      <div className="w-full max-w-5xl mx-auto px-4 mt-8">
        <DatabaseVisualizer
          db={db}
          onResetDB={handleResetDatabase}
        />
      </div>

    </div>
  );
}
