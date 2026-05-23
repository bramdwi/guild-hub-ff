/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Users, Search, Shield, User, Trash2, MapPin, Award, Star, Activity } from "lucide-react";
import { Member, UserRole } from "../types";

interface AnggotaSectionProps {
  members: Member[];
  currentUser: Member | null;
  onUpdateRole: (memberId: string, role: UserRole) => void;
  onKicked: (memberId: string) => void;
}

export default function AnggotaSection({
  members,
  currentUser,
  onUpdateRole,
  onKicked,
}: AnggotaSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"level" | "name" | "joined">("level");

  const loggedInRole = currentUser?.role || "Member";
  const isKetua = loggedInRole === "Ketua";

  // Filter and sort members
  const filteredAndSortedMembers = members
    .filter((m) => {
      const matchSearch =
        m.nickname_ff.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.kota.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRole = roleFilter === "ALL" || m.role === roleFilter;

      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      if (sortBy === "level") {
        return b.level - a.level; // Highest level first
      } else if (sortBy === "name") {
        return a.nickname_ff.localeCompare(b.nickname_ff); // Alphabetical IGN
      } else {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Newest first
      }
    });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "Ketua":
        return "text-red-400 bg-red-500/10 border-red-500/30";
      case "Officer":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-blue-400 bg-blue-500/10 border-blue-500/30";
    }
  };

  const handleRoleChange = (memberId: string, value: string) => {
    onUpdateRole(memberId, value as UserRole);
  };

  return (
    <div className="space-y-6">
      
      {/* Section Header */}
      <div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <Users className="text-blue-400 w-5 h-5" />
          Daftar Roster Anggota
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm">
          Saring, urutkan, dan kelola seluruh pasukan prajurit guild Anda.
        </p>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 grid sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari Nickname, Nama, Kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-600 text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Role Filter Selector */}
        <div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:border-blue-500 outline-none transition"
          >
            <option value="ALL">Semua Jabatan (Role)</option>
            <option value="Ketua">Ketua (Leader)</option>
            <option value="Officer">Officer (Wakil)</option>
            <option value="Member">Member (Anggota)</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-2 text-white text-xs sm:text-sm focus:border-blue-500 outline-none transition"
          >
            <option value="level">Urutkan: Level Akun Tertinggi</option>
            <option value="name">Urutkan: Nama Nickname (A-Z)</option>
            <option value="joined">Urutkan: Tanggal Join Terbaru</option>
          </select>
        </div>
      </div>

      {/* ROSTER GRID CARD SYSTEM (RESPONSIVE) */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filteredAndSortedMembers.length === 0 ? (
          <div className="col-span-full bg-slate-950 border border-slate-900 rounded-2xl p-10 text-center">
            <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-display text-base font-bold text-slate-400">Pemain Tidak Ditemukan</h4>
            <p className="text-slate-600 text-xs max-w-xs mx-auto mt-1">
              Tidak ada data roster yang cocok dengan kata kunci pencarian atau filter yang Anda terapkan.
            </p>
          </div>
        ) : (
          filteredAndSortedMembers.map((member) => {
            const isSelf = member.id_member === currentUser?.id_member;
            
            return (
              <div
                key={member.id_member}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 relative group hover:border-slate-700 transition duration-300 flex flex-col justify-between"
              >
                {/* ID Tag and Badge overlay */}
                {isSelf && (
                  <span className="absolute top-3 right-3 bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">
                    Anda
                  </span>
                )}

                <div className="space-y-4">
                  {/* Player header */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-slate-400 relative">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span className="text-[10px] font-mono leading-none font-bold text-slate-200 mt-0.5">
                        Lv.{member.level}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-sm sm:text-base font-display font-extrabold text-white truncate flex items-center gap-1">
                        {member.nickname_ff}
                      </div>
                      
                      <div className="text-xs text-slate-400 flex items-center gap-1 leading-relaxed">
                        <span>{member.nama}</span>
                        <span>•</span>
                        <span>{member.umur} Thn</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges/Details Row */}
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-950 text-slate-400 px-2 py-1 rounded-lg flex items-center gap-1 border border-slate-800/80">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {member.kota}
                    </span>

                    <span className={`px-2 py-1 rounded-lg font-mono font-bold border ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                {/* ROLE MANAGEMENT & DELETE (KICK) OPTIONS */}
                {isKetua && !isSelf && (
                  <div className="mt-4 pt-3 border-t border-slate-950 flex items-center justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-sans shrink-0">
                        Set Role:
                      </span>
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id_member, e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg outline-none focus:border-amber-400 flex-1 min-w-0"
                      >
                        <option value="Member">Member</option>
                        <option value="Officer">Officer</option>
                      </select>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menendang (kick) ${member.nickname_ff} dari Guild? Tindakan ini permanen.`)) {
                          onKicked(member.id_member);
                        }
                      }}
                      title="Kick Player"
                      className="bg-red-950/20 hover:bg-red-600 border border-red-500/20 hover:border-red-500 text-red-500 hover:text-white p-1.5 rounded-lg transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ROSTER FOOTER STATS */}
      <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-mono">
        <div className="flex items-center gap-1">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>PRO RATING:</span>
          <span className="text-slate-300 font-bold">
            {members.length > 0
              ? Math.round(members.reduce((acc, current) => acc + current.level, 0) / members.length)
              : 0}
            {" "}Avg Level
          </span>
        </div>
        <div>
          <span>TOTAL WAR SQUAD CAPABLE:</span>
          <span className="text-white font-bold ml-1">
            {Math.floor(members.length / 4)} Squads
          </span>
        </div>
      </div>

    </div>
  );
}
