Bertindaklah sebagai Senior Full-Stack Web Developer yang ahli dalam membuat Web App responsif (Mobile-First) untuk komunitas gaming.

TUGAS SAYA:
Saya ingin membuat aplikasi web bernama "Guild Hub FF", sebuah platform manajemen untuk Guild/Klan game Free Fire di Indonesia. Buatkan struktur kode lengkap (HTML, CSS/Tailwind, JavaScript) dan rancangan database-nya (misalnya menggunakan Firebase Firestore atau sekadar simulasi LocalStorage untuk prototype awal).

ALUR KERJA (WORKFLOW) APLIKASI:
1. Landing Page (Halaman Utama)

Terdapat form untuk memasukkan "ID Guild" (untuk login/masuk ke dashboard guild tertentu).

Terdapat tombol "Daftarkan Guild Baru" untuk para Ketua Guild.

2. Registrasi Guild (Khusus Ketua)

Input: Nama Guild, Nama Ketua, Kontak (WA/Discord).

Output: Sistem menghasilkan ID Guild unik (contoh: FF-INDO-99).

3. Registrasi Anggota

Anggota masuk menggunakan link undangan atau memasukkan ID Guild.

Form Input Anggota meliputi:

Nama Lengkap

Umur

Level Akun

Asal Kota

Nama Akun FF (Nickname)

Setelah mendaftar, role default mereka adalah "Member".

4. Dashboard Guild (Setelah Login)

Mading / Papan Pengumuman: Menampilkan jadwal kegiatan (scrim, turnamen).

Daftar Anggota: Menampilkan list member beserta asal kota dan role mereka.

SISTEM ROLE (HAK AKSES):

Ketua Guild: Bisa edit info guild, tambah/hapus pengumuman mading, mengubah role anggota (menjadi Officer), dan menghapus anggota.

Officer: Hanya bisa menambah/mengedit pengumuman di mading.

Member: Hanya bisa melihat mading dan daftar anggota.

STRUKTUR DATABASE YANG DIBUTUHKAN:

Collection: Guilds (id_guild, nama_guild, nama_ketua, created_at)

Collection: Members (id_member, id_guild, nama, umur, level, kota, nickname_ff, role)

Collection: Mading (id_post, id_guild, isi_pengumuman, author, created_at)

INSTRUKSI OUTPUT UNTUK AI:

Buatkan struktur folder proyek yang disarankan.

Berikan kode lengkap untuk Landing Page dan Form Registrasi dengan desain UI/UX yang modern ala gamers (gunakan framework CSS seperti Tailwind jika memungkinkan).

Buatkan logika JavaScript (berbasis React.js atau Vanilla JS) untuk sistem Role dan Alur Pendaftarannya.

Jelaskan langkah demi langkah bagaimana cara saya menjalankan kode ini di komputer saya.