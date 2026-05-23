/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bell, Shield, Edit3, Trash2, Calendar, User, Save, X, PlusCircle } from "lucide-react";
import { MadingPost, UserRole, Member } from "../types";

interface MadingSectionProps {
  posts: MadingPost[];
  currentUser: Member | null;
  onAddPost: (text: string) => void;
  onEditPost: (postId: string, text: string) => void;
  onDeletePost: (postId: string) => void;
}

export default function MadingSection({
  posts,
  currentUser,
  onAddPost,
  onEditPost,
  onDeletePost,
}: MadingSectionProps) {
  const [newPostText, setNewPostText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostText, setEditingPostText] = useState("");

  const userRole: UserRole = currentUser?.role || "Member";

  // Permissions
  const canAdd = userRole === "Ketua" || userRole === "Officer";
  const canEdit = userRole === "Ketua" || userRole === "Officer";
  const canDelete = userRole === "Ketua"; // ONLY Ketua can delete according to instructions

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(newPostText.trim());
    setNewPostText("");
    setIsAdding(false);
  };

  const handleSaveEdit = (postId: string) => {
    if (!editingPostText.trim()) return;
    onEditPost(postId, editingPostText.trim());
    setEditingPostId(null);
    setEditingPostText("");
  };

  const startEdit = (post: MadingPost) => {
    setEditingPostId(post.id_post);
    setEditingPostText(post.isi_pengumuman);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditingPostText("");
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "Ketua":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "Officer":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    }
  };

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Mading Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="text-orange-500 w-5 h-5 animate-bounce" />
            Mading & Jadwal Kegiatan
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm">
            Informasi scrim, turnamen klan, dan koordinasi taktis harian.
          </p>
        </div>

        {canAdd && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-sans text-xs sm:text-sm font-bold py-2 px-3.5 sm:px-4 rounded-xl transition-all duration-300 flex items-center gap-1.5 shadow-md shadow-orange-600/10"
          >
            <PlusCircle className="w-4 h-4" />
            Tulis Info
          </button>
        )}
      </div>

      {/* FORM: NEW POST */}
      {isAdding && (
        <form onSubmit={handleSubmitNew} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider">
              Buat Pengumuman Baru (Sebagai {userRole})
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <textarea
              placeholder="Ketik pengumuman di sini... (E.g. Jadwal scrim vs RRQ, pendaftaran turnamen, koordinasi jam latihan)"
              required
              rows={4}
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder-slate-700 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold py-2 px-4 rounded-lg transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-1.5"
            >
              Publish Info
            </button>
          </div>
        </form>
      )}

      {/* LIST OF POSTS */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-slate-950 border border-slate-900 rounded-2xl p-10 text-center">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="font-display text-base font-bold text-slate-400">Belum Ada Pengumuman</h4>
            <p className="text-slate-600 text-xs max-w-xs mx-auto mt-1">
              Saat ini belum ada pengumuman scrim atau kegiatan klan. Ketua atau Officer dapat menambahkannya via tombol di atas.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const isEditing = editingPostId === post.id_post;

            return (
              <div
                key={post.id_post}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 relative group overflow-hidden transition-all duration-300 hover:border-slate-700/50"
              >
                {/* Decorative Side Marker based on role */}
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${
                    post.author_role === "Ketua"
                      ? "bg-red-500"
                      : post.author_role === "Officer"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                ></div>

                {isEditing ? (
                  /* EDIT MODE FOR A POST */
                  <div className="space-y-3">
                    <textarea
                      value={editingPostText}
                      onChange={(e) => setEditingPostText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs sm:text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition resize-none leading-relaxed"
                      rows={3}
                    />
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={cancelEdit}
                        className="bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold py-1.5 px-3 rounded-lg transition flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Batal
                      </button>
                      <button
                        onClick={() => handleSaveEdit(post.id_post)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Save className="w-3 h-3" /> Simpan
                      </button>
                    </div>
                  </div>
                ) : (
                  /* NORMAL VIEW */
                  <div className="space-y-3">
                    
                    {/* Post Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-950 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400">
                          {post.author_role === "Ketua" ? (
                            <Shield className="w-4 h-4 text-red-400" />
                          ) : (
                            <User className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                            {post.author}
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getRoleBadgeColor(post.author_role)}`}>
                              {post.author_role}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            {formatDate(post.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex items-center gap-1">
                        {canEdit && (
                          <button
                            onClick={() => startEdit(post)}
                            title="Edit Pengumuman"
                            className="p-1.5 hover:bg-slate-950 text-slate-500 hover:text-orange-400 rounded-lg transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => {
                              if (confirm("Ingin menghapus pengumuman ini?")) {
                                onDeletePost(post.id_post);
                              }
                            }}
                            title="Hapus Pengumuman"
                            className="p-1.5 hover:bg-slate-950 text-slate-500 hover:text-red-400 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Announcement Body */}
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans pl-1">
                      {post.isi_pengumuman}
                    </p>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
