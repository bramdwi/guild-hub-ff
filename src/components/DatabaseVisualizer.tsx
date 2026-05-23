/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Database, Eye, EyeOff, LayoutList, RefreshCw } from "lucide-react";
import { DBState } from "../types";
import { resetDBToDefault } from "../utils/storage";

interface DatabaseVisualizerProps {
  db: DBState;
  onResetDB: () => void;
}

export default function DatabaseVisualizer({ db, onResetDB }: DatabaseVisualizerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCollection, setActiveCollection] = useState<"guilds" | "members" | "mading" | "all">("all");

  const handleReset = () => {
    if (confirm("🚨 Apakah Anda yakin ingin me-reset Database ke data contoh bawaan? Semua data baru Anda akan hilang.")) {
      onResetDB();
    }
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden mt-8">
      {/* Background cyber accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-xl"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-905 pb-4">
        {/* Header Title */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-display font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              Virtual Database Inspector (LocalStorage)
              <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded-full uppercase">
                Active
              </span>
            </h3>
            <p className="text-slate-400 text-xs font-sans mt-0.5">
              Simulasi database skema klan Free Fire secara realtime di browser Anda.
            </p>
          </div>
        </div>

        {/* Action Toggle buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold font-sans transition"
          >
            {isOpen ? (
              <>
                <EyeOff className="w-3.5 h-3.5" /> Sembunyikan JSON
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> Inspeksi JSON DB
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            title="Reset DB ke Bawaan"
            className="p-2 bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white rounded-xl transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="mt-5 space-y-4 animate-fadeIn">
          {/* Navigation Tab for collections */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-900 pb-2">
            <button
              onClick={() => setActiveCollection("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                activeCollection === "all"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              🚀 All Collections ({db.guilds.length + db.members.length + db.mading.length})
            </button>
            <button
              onClick={() => setActiveCollection("guilds")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                activeCollection === "guilds"
                  ? "bg-orange-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              📁 Guilds ({db.guilds.length})
            </button>
            <button
              onClick={() => setActiveCollection("members")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                activeCollection === "members"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              📁 Members ({db.members.length})
            </button>
            <button
              onClick={() => setActiveCollection("mading")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition ${
                activeCollection === "mading"
                  ? "bg-amber-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              📁 Mading ({db.mading.length})
            </button>
          </div>

          {/* Database Schema Map Explanation */}
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-400 leading-relaxed font-sans grid sm:grid-cols-3 gap-3">
            <div className="border-r border-slate-900/60 pr-2">
              <span className="text-orange-400 font-mono font-bold block uppercase mb-1">1. COLLECTION: Guilds</span>
              Menyimpan info pokok guild. Primary Key adalah <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded text-[10px]">id_guild</code>.
            </div>
            <div className="border-r border-slate-900/60 pr-2">
              <span className="text-blue-400 font-mono font-bold block uppercase mb-1">2. COLLECTION: Members</span>
              Menyimpan data pemain. Foreign Key <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded text-[10px]">id_guild</code> berelasi dengan Guilds.
            </div>
            <div>
              <span className="text-amber-400 font-mono font-bold block uppercase mb-1">3. COLLECTION: Mading</span>
              Menyimpan pengumuman scrim klan. Terikat dengan klan via <code className="text-white font-mono bg-slate-900 px-1 py-0.5 rounded text-[10px]">id_guild</code>.
            </div>
          </div>

          {/* Code JSON Window */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] sm:text-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2 border-b border-slate-900 pb-1.5">
              <span>DATABASE RAW JSON STATE</span>
              <span>READ_WRITE</span>
            </div>
            <pre className="max-h-80 overflow-y-auto text-indigo-300 block leading-relaxed whitespace-pre scrollbar-thin">
              {JSON.stringify(
                activeCollection === "all"
                  ? db
                  : activeCollection === "guilds"
                  ? db.guilds
                  : activeCollection === "members"
                  ? db.members
                  : db.mading,
                null,
                2
              )}
            </pre>
          </div>
        </div>
      ) : (
        <p className="text-slate-500 text-xs font-mono mt-3">
          💡 Klik &ldquo;Inspeksi JSON DB&rdquo; untuk memeriksa skema database, foreign keys, serta relasi data secara dinamis.
        </p>
      )}
    </div>
  );
}
