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
  generateId,
  initializeGuildHub
} from "./utils/storage";
import { isSupabaseConfigured } from "./utils/supabase";
import { DBState, ActiveView, Guild, Member, MadingPost, UserRole } from "./types";

// Import Components
import LandingPage from "./components/LandingPage";
import GuildLogin from "./components/GuildLogin";
import RegisterGuild from "./components/RegisterGuild";
import RegisterMember from "./components/RegisterMember";
import GuildDashboard from "./components/GuildDashboard";
import DatabaseVisualizer from "./components/DatabaseVisualizer";

import { Shield, Sparkles, Database } from "lucide-react";

export default function App() {
  const [db, setDb] = useState<DBState>({ guilds: [], members: [], mading: [] });
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [currentView, setCurrentView] = useState<ActiveView>("landing");
  const [activeGuildId, setActiveGuildId] = useState<string | null>(null);
  const [activeMemberId, setActiveMemberId] = useState<string | null>(null);
  
  // LogicFlow variables and booting animation state
  const [isBooting, setIsBooting] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [bootStatusText, setBootStatusText] = useState("KONEKSI KE SERVER GUILD...");

  // Direct entry/invite states
  const [prefilledGuildId, setPrefilledGuildId] = useState("");

  // Boot loading interval simulating Free Fire engine setup & instantiating logic flow
  useEffect(() => {
    if (!isBooting) return;
    
    setBootProgress(0);
    setBootStatusText(
      isSupabaseConfigured 
        ? "MENGHUBUNGKAN KE SUPABASE CLOUD DATABASE..." 
        : "MENGHUBUNGKAN KE DATABASE SERVER LOKAL..."
    );
    
    let loadedDb: DBState | null = null;
    let hasFinishedLoading = false;
    
    // Start fetching data immediately on boot
    getDB().then((data) => {
      loadedDb = data;
      hasFinishedLoading = true;
    }).catch((err) => {
      console.error("Boot database load error:", err);
      hasFinishedLoading = true;
    });

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        // Slow down/stall progress at 90% if the database fetch hasn't completed yet
        if (prev >= 90 && !hasFinishedLoading) {
          return 90;
        }

        const next = prev + Math.floor(Math.random() * 12) + 6;
        if (next >= 100) {
          clearInterval(interval);
          
          // Instantiate the logic flow from initialize-guild-hub.json
          const result = initializeGuildHub("Guild Hub FF");
          setIsInitialized(result.initialized);
          
          // Apply loaded database records
          if (loadedDb) {
            setDb(loadedDb);
          }
          
          // Delay turning off booting slightly for premium visual transition
          setTimeout(() => {
            setIsBooting(false);
          }, 800);
          return 100;
        }
        
        // Update status text dynamically
        if (next < 25) {
          setBootStatusText(
            isSupabaseConfigured 
              ? "MENGHUBUNGKAN KE SUPABASE CLOUD..." 
              : "MENGHUBUNGKAN KE DATABASE SERVER LOKAL..."
          );
        } else if (next < 50) {
          setBootStatusText("MEMUAT METADATA GUILD & MEMBER...");
        } else if (next < 75) {
          setBootStatusText("MENGINSTANSIASI LOGIKA HUB UTAMA (M-d7074e0d)...");
        } else {
          setBootStatusText("LOGIKA HUB BERHASIL DIAKTIFKAN! MENYIAPKAN ARENA...");
        }
        
        return next;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isBooting]);

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

  // Stage 1: Enter Guild (navigate to credential screen)
  const handleEnterGuild = (guildId: string) => {
    setActiveGuildId(guildId);
    setActiveMemberId(null);
    setCurrentView("guild-login");
  };

  // Stage 2: Credential Login Success (enter dashboard)
  const handleLoginSuccess = (guildId: string, memberId: string) => {
    setActiveGuildId(guildId);
    setActiveMemberId(memberId);
    setCurrentView("dashboard");
  };

  const handleRegisterGuild = async (newGuild: Guild, leader: Member) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await addGuildToDB(newGuild, leader);
      setDb(updatedDB);
      // Auto-login as the Ketua of the newly registered guild
      setActiveGuildId(newGuild.id_guild);
      setActiveMemberId(leader.id_member);
      setCurrentView("dashboard");
    } catch (err) {
      console.error(err);
      alert("Gagal mendaftarkan guild ke database server. Silakan coba lagi.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleRegisterMember = async (newMember: Member) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await addMemberToDB(newMember);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal bergabung sebagai anggota. Username mungkin sudah digunakan. Silakan coba lagi.");
    } finally {
      setIsDbLoading(false);
    }
  };

  // Upgraded announcement posting
  const handlePublishPost = async (text: string, authorNickname: string, authorRole: UserRole) => {
    if (!activeGuildId) return;

    setIsDbLoading(true);
    try {
      const newPost: MadingPost = {
        id_post: `POST-${generateId()}`,
        id_guild: activeGuildId,
        isi_pengumuman: text,
        author: authorNickname,
        author_role: authorRole,
        created_at: new Date().toISOString()
      };

      const updatedDB = await addMadingPostToDB(newPost);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal mempublikasikan pengumuman ke cloud server.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleEditPost = async (postId: string, text: string) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await editMadingPostInDB(postId, text);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal menyimpan perubahan pengumuman.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await deleteMadingPostFromDB(postId);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus pengumuman.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, role: UserRole) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await updateMemberRoleInDB(memberId, role);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui role anggota.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleKickMember = async (memberId: string) => {
    setIsDbLoading(true);
    try {
      const updatedDB = await deleteMemberFromDB(memberId);
      setDb(updatedDB);
    } catch (err) {
      console.error(err);
      alert("Gagal mengeluarkan anggota dari clan.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    setIsDbLoading(true);
    try {
      const defaultDB = await resetDBToDefault();
      setDb(defaultDB);
      setActiveGuildId(null);
      setActiveMemberId(null);
      setCurrentView("landing");
      setPrefilledGuildId("");
      
      // Reboot the system flow (M-d7074e0d)
      setIsInitialized(false);
      setIsBooting(true);
      
      // Clear URL parameters
      if (typeof window !== "undefined" && window.history.pushState) {
        const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newurl }, '', newurl);
      }
    } catch (err) {
      console.error(err);
      alert("Gagal me-reset database server.");
    } finally {
      setIsDbLoading(false);
    }
  };

  const handleLogout = () => {
    setActiveGuildId(null);
    setActiveMemberId(null);
    setCurrentView("landing");
    setPrefilledGuildId("");
    
    // Clear invite URL if any
    if (typeof window !== "undefined" && window.history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
      window.history.pushState({ path: newurl }, '', newurl);
    }
  };

  if (isBooting) {
    return (
      <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center font-sans antialiased relative overflow-hidden">
        {/* Dynamic cyber background lights */}
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute -top-32 -right-32 h-[500px] w-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        
        {/* Futuristic Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40"></div>
        
        {/* Futuristic Scanning line */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent top-0 animate-scan-line opacity-60"></div>

        <div className="relative z-10 w-full max-w-lg px-6 text-center space-y-8">
          {/* Logo Badge with high animation glow */}
          <div className="relative inline-flex items-center justify-center p-5 bg-gradient-to-br from-orange-500 via-red-600 to-indigo-600 rounded-3xl shadow-2xl shadow-orange-600/30 border border-orange-400/40 transform animate-[pulse_2s_infinite] scale-105">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full animate-ping"></div>
            <Shield className="w-16 h-16 text-white" />
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl font-black tracking-tighter uppercase italic bg-gradient-to-r from-white via-orange-400 to-amber-400 bg-clip-text text-transparent drop-shadow-md">
              GUILD HUB FF
            </h1>
            <p className="text-xs font-mono tracking-widest text-slate-400 uppercase">
              Free Fire Community Management
            </p>
          </div>

          {/* Futuristic Terminal Glassbox */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 border-b border-slate-900 pb-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping"></span>
                SYSTEM INIT PHASE
              </span>
              <span>FLOW_ID: M-D7074E0D</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-orange-500 animate-pulse text-left truncate max-w-[80%]">{bootStatusText}</span>
                <span className="text-slate-300">{bootProgress}%</span>
              </div>
              
              {/* Progress Bar Container */}
              <div className="h-3 bg-slate-900 rounded-full p-[2px] border border-slate-800 overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-full transition-all duration-150 relative shadow-inner"
                  style={{ width: `${bootProgress}%` }}
                >
                  {/* Glowing tip */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-80 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
              <span>
                {isSupabaseConfigured
                  ? "Menghubungkan ke server cloud live Supabase..."
                  : "Menghubungkan ke playground storage lokal..."}
              </span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-slate-600">
            &copy; 2026 GUILD HUB FF &bull; INDONESIAN ESPORTS ALLIANCE
          </div>
        </div>
      </div>
    );
  }

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
            {isSupabaseConfigured ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/25 px-3 py-1 rounded-full shadow-lg shadow-emerald-500/5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                SUPABASE CLOUD ACTIVE
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-400 bg-orange-950/40 border border-orange-500/25 px-3 py-1 rounded-full shadow-lg shadow-orange-500/5">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                LOCAL STORAGE PLAYGROUND
              </span>
            )}
            <span className="bg-orange-600/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              {isSupabaseConfigured ? "LIVE DB" : "SANDBOX"}
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

        {currentView === "guild-login" && activeGuildId && (
          <GuildLogin
            db={db}
            guildId={activeGuildId}
            onLoginSuccess={handleLoginSuccess}
            onBack={handleLogout}
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
            onEnterGuild={handleLoginSuccess}
          />
        )}

        {currentView === "dashboard" && activeGuildId && (
          <GuildDashboard
            db={db}
            guildId={activeGuildId}
            activeMemberId={activeMemberId}
            onLogout={handleLogout}
            onAddPost={(text, author, role) => handlePublishPost(text, author, role)}
            onEditPost={handleEditPost}
            onDeletePost={handleDeletePost}
            onUpdateRole={handleUpdateMemberRole}
            onKicked={handleKickMember}
          />
        )}
      </main>

      {/* DYNAMIC DATABASE IN-FLIGHT ACTIVITY OVERLAY LOADER */}
      {isDbLoading && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-slate-950 border border-orange-500/30 text-slate-200 px-4 py-3 rounded-2xl shadow-2xl animate-[pulse_1.5s_infinite] backdrop-blur-md">
          <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-orange-400">
            SINKRONISASI DATABASE...
          </span>
        </div>
      )}

      {/* DYNAMIC DATABASE INSPECTOR FOOTER LAYER */}
      <div className="w-full max-w-5xl mx-auto px-4 mt-8">
        <DatabaseVisualizer
          db={db}
          onResetDB={handleResetDatabase}
          onRebootSystem={() => {
            setIsInitialized(false);
            setIsBooting(true);
          }}
        />
      </div>

    </div>
  );
}
