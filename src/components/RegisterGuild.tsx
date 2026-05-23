/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, ArrowLeft, Send, CheckCircle, Copy, Check, ExternalLink } from "lucide-react";
import { Guild, Member } from "../types";
import { generateGuildId, generateId } from "../utils/storage";

interface RegisterGuildProps {
  onRegister: (guild: Guild, ketua: Member) => void;
  onBack: () => void;
}

export default function RegisterGuild({ onRegister, onBack }: RegisterGuildProps) {
  const [namaGuild, setNamaGuild] = useState("");
  const [namaKetua, setNamaKetua] = useState("");
  const [kontak, setKontak] = useState("");
  
  // Member fields for the leader themselves
  const [umur, setUmur] = useState<number>(20);
  const [level, setLevel] = useState<number>(55);
  const [kota, setKota] = useState("");
  const [nicknameFF, setNicknameFF] = useState("");

  const [registeredGuild, setRegisteredGuild] = useState<Guild | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorCode("");

    if (!namaGuild.trim()) return setErrorCode("Nama guild wajib diisi.");
    if (!namaKetua.trim()) return setErrorCode("Nama ketua wajib diisi.");
    if (!nicknameFF.trim()) return setErrorCode("Nickname FF Ketua wajib diisi.");
    if (!kontak.trim()) return setErrorCode("Kontak WA/Discord wajib diisi.");
    if (!kota.trim()) return setErrorCode("Asal kota wajib diisi.");

    // Create the guild object
    const finalGuildId = generateGuildId(namaGuild);
    const newGuild: Guild = {
      id_guild: finalGuildId,
      nama_guild: namaGuild.trim(),
      nama_ketua: namaKetua.trim(),
      kontak_ketua: kontak.trim(),
      created_at: new Date().toISOString(),
    };

    // Create the leader as the first member with "Ketua" role
    const leaderMember: Member = {
      id_member: `MEM-CHIEF-${generateId()}`,
      id_guild: finalGuildId,
      nama: namaKetua.trim(),
      umur: Number(umur),
      level: Number(level),
      kota: kota.trim(),
      nickname_ff: nicknameFF.trim(),
      role: "Ketua",
      created_at: new Date().toISOString(),
    };

    onRegister(newGuild, leaderMember);
    setRegisteredGuild(newGuild);
  };

  const handleCopyId = () => {
    if (!registeredGuild) return;
    navigator.clipboard.writeText(registeredGuild.id_guild);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (registeredGuild) {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-8 relative">
        <div className="bg-slate-900 border-2 border-emerald-500 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Neon background pulse */}
          <div className="absolute inset-0 bg-emerald-500/5 animate-pulse"></div>

          <div className="text-center relative z-10 space-y-6">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-600 rounded-full text-white shadow-lg shadow-emerald-500/20">
              <CheckCircle className="w-12 h-12" />
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Guild Berhasil Terdaftar!
            </h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Sistem telah mengalokasikan pengenal unik untuk Guild baru Anda secara otomatis. Harap simpan ID ini baik-baik.
            </p>

            {/* Simulated certificate/card of ID */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 relative group">
              <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                ID UNIK GUILD ANDA
              </div>
              <div className="text-3xl font-mono font-extrabold text-emerald-400 tracking-wider my-3 select-all">
                {registeredGuild.id_guild}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Klan: <span className="text-white font-semibold">{registeredGuild.nama_guild}</span>
              </div>
              
              <button
                onClick={handleCopyId}
                className="mt-4 inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Tersalin!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    Salin ID Guild
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl text-left text-xs space-y-2">
              <h4 className="font-bold text-white uppercase tracking-wider flex items-center gap-1">
                📢 APA SELANJUTNYA?
              </h4>
              <ul className="list-disc list-inside text-slate-400 space-y-1 block leading-relaxed">
                <li>Gunakan ID ini untuk masuk ke Dashboard sebagai Ketua.</li>
                <li>Bagikan ID atau Link pendaftaran kepada calon anggota klan Anda.</li>
                <li>Ketua klan berkewajiban menyetujui, menyaring, dan mengelola role.</li>
              </ul>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={onBack}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-semibold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2"
              >
                Kembali & Masuk Arena
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
        className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-500 mb-6 text-sm font-semibold group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Kembali ke Beranda
      </button>

      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-2xl rounded-full"></div>
        
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-2 flex items-center gap-2">
          <Shield className="text-orange-500 w-7 h-7" />
          Registrasi Guild Baru
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 pb-4 border-b border-slate-800">
          Lengkapi form di bawah ini selaku Kapten / Ketua Guild untuk melahirkan ID klan unik baru di database Indonesia.
        </p>

        {errorCode && (
          <div className="mb-6 bg-red-950/40 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs sm:text-sm">
            ⚠️ {errorCode}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* SECTION A: GUILD INFO */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              A. Informasi Klan / Guild
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Nama Guild *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: INDO PRIDE"
                  required
                  value={namaGuild}
                  onChange={(e) => setNamaGuild(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Kontak (WA / Discord Tag) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 081234xxx atau Discord#123"
                  required
                  value={kontak}
                  onChange={(e) => setKontak(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* SECTION B: LEADER DETAILS */}
          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest">
              B. Profil In-Game Ketua (Kapten)
            </h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Nama Lengkap Ketua *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Fajar Kurniawan"
                  required
                  value={namaKetua}
                  onChange={(e) => setNamaKetua(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Nama Akun FF (Nickname) *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: INDO•CAPTAIN⚔️"
                  required
                  value={nicknameFF}
                  onChange={(e) => setNicknameFF(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition font-mono"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Umur (Tahun)
                </label>
                <input
                  type="number"
                  min="5"
                  max="99"
                  required
                  value={umur}
                  onChange={(e) => setUmur(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Level Akun FF (1-100)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider mb-2">
                  Asal Kota *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Jakarta"
                  required
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-display font-bold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-orange-600/25 hover:shadow-orange-600/40 group active:scale-[0.98]"
            >
              Proses Pendaftaran Guild
              <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-white" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
