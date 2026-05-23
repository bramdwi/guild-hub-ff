/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { UserPlus, ArrowLeft, Send, CheckCircle, ExternalLink } from "lucide-react";
import { DBState, Member } from "../types";
import { generateId } from "../utils/storage";

interface RegisterMemberProps {
  db: DBState;
  prefilledGuildId: string;
  onRegister: (member: Member) => void;
  onBack: () => void;
  onEnterGuild: (guildId: string) => void;
}

export default function RegisterMember({
  db,
  prefilledGuildId,
  onRegister,
  onBack,
  onEnterGuild,
}: RegisterMemberProps) {
  // Input fields
  const [selectedGuildId, setSelectedGuildId] = useState("");
  const [useCustomGuildId, setUseCustomGuildId] = useState(false);
  const [customGuildId, setCustomGuildId] = useState("");

  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState<number | "">("");
  const [level, setLevel] = useState<number | "">("");
  const [kota, setKota] = useState("");
  const [nicknameFf, setNicknameFf] = useState("");

  const [registeredMember, setRegisteredMember] = useState<Member | null>(null);
  const [errorCode, setErrorCode] = useState("");

  // Populate selectedGuildId based on prefilled value or default
  useEffect(() => {
    if (prefilledGuildId) {
      const match = db.guilds.find(
        (g) => g.id_guild.toUpperCase() === prefilledGuildId.toUpperCase()
      );
      if (match) {
        setSelectedGuildId(match.id_guild);
        setUseCustomGuildId(false);
      } else {
        setCustomGuildId(prefilledGuildId.toUpperCase());
        setUseCustomGuildId(true);
      }
    } else if (db.guilds.length > 0) {
      setSelectedGuildId(db.guilds[0].id_guild);
    } else {
      setUseCustomGuildId(true);
    }
  }, [prefilledGuildId, db.guilds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCode("");

    const targetGuildId = (useCustomGuildId ? customGuildId : selectedGuildId).trim().toUpperCase();

    if (!targetGuildId) {
      return setErrorCode("Silakan masukkan atau pilih ID Guild.");
    }

    // Verify guild exists in DB
    const matchedGuild = db.guilds.find((g) => g.id_guild === targetGuildId);
    if (!matchedGuild) {
      return setErrorCode(`ID Guild "${targetGuildId}" tidak ditemukan atau belum terdaftar.`);
    }

    if (!nama.trim()) return setErrorCode("Nama lengkap wajib diisi.");
    if (!nicknameFf.trim()) return setErrorCode("Nickname FF wajib diisi.");
    if (!kota.trim()) return setErrorCode("Asal kota wajib diisi.");
    if (umur === "" || Number(umur) <= 0) return setErrorCode("Harap masukkan umur yang valid.");
    if (level === "" || Number(level) < 1 || Number(level) > 100) {
      return setErrorCode("Level Akun FF harus berada di kisaran 1 - 100.");
    }

    const newMember: Member = {
      id_member: `MEM-${generateId()}`,
      id_guild: targetGuildId,
      nama: nama.trim(),
      umur: Number(umur),
      level: Number(level),
      kota: kota.trim(),
      nickname_ff: nicknameFf.trim(),
      role: "Member", // Default role is "Member"
      created_at: new Date().toISOString(),
    };

    onRegister(newMember);
    setRegisteredMember(newMember);
  };

  const getTargetGuildName = () => {
    if (!registeredMember) return "";
    const g = db.guilds.find((guild) => guild.id_guild === registeredMember.id_guild);
    return g ? g.nama_guild : registeredMember.id_guild;
  };

  if (registeredMember) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8 relative">
        <div className="bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>

          <div className="text-center relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/20">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Registrasi Berhasil!
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Anda telah terdaftar sebagai bagian dari squad klan di bawah ini. Selamat bertempur!
            </p>

            {/* Esports badge card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-blue-600/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider font-mono">
                ROLE: MEMBER
              </div>
              
              <div className="text-left space-y-3">
                <div>
                  <span className="text-slate-500 text-[10px] font-bold uppercase block tracking-wider">GUILD TUJUAN</span>
                  <span className="text-lg font-bold text-white font-display uppercase tracking-tight">{getTargetGuildName()}</span>
                  <span className="ml-2 font-mono text-xs text-blue-400 bg-blue-950/40 border border-blue-800/40 px-2 py-0.5 rounded-md">
                    {registeredMember.id_guild}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-900">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block tracking-wider font-mono">NICKNAME FF</span>
                    <span className="text-emerald-400 font-mono font-bold text-sm sm:text-base">{registeredMember.nickname_ff}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold uppercase block tracking-wider font-mono">Real Name</span>
                    <span className="text-slate-300 font-semibold text-sm sm:text-base">{registeredMember.nama}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono">LEVEL</span>
                    <span className="block font-bold text-amber-500">Lv.{registeredMember.level}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono">UMUR</span>
                    <span className="block font-semibold text-slate-300">{registeredMember.umur} Thn</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono font-sans">KOTA</span>
                    <span className="block font-semibold text-slate-300 truncate">{registeredMember.kota}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => onEnterGuild(registeredMember.id_guild)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35"
              >
                Masuk ke Dashboard Guild
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-10">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 mb-6 text-sm font-semibold group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </button>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-2xl rounded-full"></div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
          <UserPlus className="text-blue-400 w-7 h-7" />
          Registrasi Anggota Guild
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 pb-4 border-b border-slate-800">
          Masukkan detail karakter Free Fire dan data diri Anda untuk divalidasi ke dalam pangkalan data tim klan Anda.
        </p>

        {errorCode && (
          <div className="mb-6 bg-red-950/40 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs sm:text-sm">
            ⚠️ {errorCode}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* GUILD SELECTION SECTION */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
                Pilih Guild Tujuan
              </label>
              
              {db.guilds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseCustomGuildId(!useCustomGuildId)}
                  className="text-[11px] font-semibold text-slate-400 hover:text-blue-400 underline transition"
                >
                  {useCustomGuildId ? "Pilih dari Guild Terdaftar" : "Ketik ID Guild Manual"}
                </button>
              )}
            </div>

            {useCustomGuildId || db.guilds.length === 0 ? (
              <div>
                <input
                  type="text"
                  placeholder="Masukkan KODE ID (Contoh: FF-EVOS-21)"
                  required
                  value={customGuildId}
                  onChange={(e) => setCustomGuildId(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-700 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition uppercase tracking-wider"
                />
              </div>
            ) : (
              <div>
                <select
                  value={selectedGuildId}
                  onChange={(e) => setSelectedGuildId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                >
                  {db.guilds.map((g) => (
                    <option key={g.id_guild} value={g.id_guild} className="bg-slate-950 text-white">
                      {g.nama_guild} ({g.id_guild})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* MEMBER PROFILE DETAILS */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
              Biodata & Karakter Pemain
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Nama Lengkap Player *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  NAMA AKUN FF (Nickname) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: KING•BUD⚔️"
                  required
                  value={nicknameFf}
                  onChange={(e) => setNicknameFf(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Umur (Tahun) *
                </label>
                <input
                  type="number"
                  placeholder="E.g. 17"
                  min="5"
                  max="99"
                  required
                  value={umur}
                  onChange={(e) => setUmur(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  LEVEL AKUN FF *
                </label>
                <input
                  type="number"
                  placeholder="1 - 100"
                  min="1"
                  max="100"
                  required
                  value={level}
                  onChange={(e) => setLevel(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Asal Kota *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Surabaya"
                  required
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 group active:scale-[0.98]"
            >
              Kirim Registrasi Anggota
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
