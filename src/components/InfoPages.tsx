import React from "react";
import { Shield, ArrowLeft, Mail, Phone, MapPin, ExternalLink } from "lucide-react";

interface InfoPagesProps {
  pageType: "privacy" | "terms" | "about";
  onBack: () => void;
}

export default function InfoPages({ pageType, onBack }: InfoPagesProps) {
  const renderPrivacy = () => (
    <div className="space-y-6 text-slate-300">
      <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
        <Shield className="text-orange-500 w-6 h-6" /> Kebijakan Privasi (Privacy Policy)
      </h2>
      <p className="text-sm leading-relaxed text-slate-400">
        Terakhir diperbarui: 24 Mei 2026
      </p>
      
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">1. Pendahuluan</h3>
        <p className="text-sm leading-relaxed">
          Di <strong>Guild Hub</strong>, yang dapat diakses dari <code className="text-orange-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">guild-hub-ff.vercel.app</code>, salah satu prioritas utama kami adalah privasi pengunjung kami. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh Guild Hub dan bagaimana kami menggunakannya.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">2. Log Files (File Log)</h3>
        <p className="text-sm leading-relaxed">
          Guild Hub mengikuti prosedur standar menggunakan file log. File-file ini mencatat pengunjung ketika mereka mengunjungi situs web. Informasi yang dikumpulkan oleh file log termasuk alamat protokol internet (IP), jenis browser, Penyedia Layanan Internet (ISP), stempel tanggal dan waktu, halaman rujukan/keluar, dan mungkin jumlah klik. Ini tidak terkait dengan informasi apa pun yang dapat diidentifikasi secara pribadi.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">3. Cookie Google DoubleClick DART</h3>
        <p className="text-sm leading-relaxed">
          Google adalah salah satu vendor pihak ketiga di situs kami. Google juga menggunakan cookie, yang dikenal sebagai cookie DART, untuk menyajikan iklan kepada pengunjung situs kami berdasarkan kunjungan mereka ke <code className="text-orange-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">guild-hub-ff.vercel.app</code> dan situs lain di internet. Pengunjung dapat memilih untuk menolak penggunaan cookie DART dengan mengunjungi Kebijakan Privasi jaringan iklan dan konten Google di URL berikut: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:underline inline-flex items-center gap-1">https://policies.google.com/technologies/ads <ExternalLink className="w-3.5 h-3.5" /></a>.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">4. Kebijakan Privasi Pihak Ketiga</h3>
        <p className="text-sm leading-relaxed">
          Kebijakan Privasi Guild Hub tidak berlaku untuk pengiklan atau situs web lain. Karena itu, kami menyarankan Anda untuk berkonsultasi dengan masing-masing Kebijakan Privasi dari server iklan pihak ketiga ini untuk informasi lebih rinci. Ini mungkin termasuk praktik mereka dan instruksi tentang cara memilih keluar dari opsi tertentu.
        </p>
        <p className="text-sm leading-relaxed">
          Anda dapat memilih untuk menonaktifkan cookie melalui opsi browser individual Anda. Untuk mengetahui informasi lebih rinci tentang manajemen cookie dengan browser web tertentu, informasi tersebut dapat ditemukan di situs web masing-masing browser.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">5. Informasi Anak-anak</h3>
        <p className="text-sm leading-relaxed">
          Bagian lain dari prioritas kami adalah menambahkan perlindungan untuk anak-anak saat menggunakan internet. Kami mendorong orang tua dan wali untuk mengamati, berpartisipasi, dan/atau memantau serta membimbing aktivitas online mereka.
        </p>
        <p className="text-sm leading-relaxed">
          Guild Hub tidak secara sadar mengumpulkan Informasi Identitas Pribadi apa pun dari anak-anak di bawah umur. Jika Anda berpikir bahwa anak Anda memberikan informasi semacam ini di situs web kami, kami sangat menganjurkan Anda untuk segera menghubungi kami dan kami akan melakukan upaya terbaik kami untuk segera menghapus informasi tersebut dari catatan kami.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">6. Persetujuan</h3>
        <p className="text-sm leading-relaxed">
          Dengan menggunakan situs web kami, Anda dengan ini menyetujui Kebijakan Privasi kami dan menyetujui Ketentuan-ketentuannya.
        </p>
      </section>
    </div>
  );

  const renderTerms = () => (
    <div className="space-y-6 text-slate-300">
      <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
        <Shield className="text-orange-500 w-6 h-6" /> Syarat dan Ketentuan (Terms of Service)
      </h2>
      <p className="text-sm leading-relaxed text-slate-400">
        Terakhir diperbarui: 24 Mei 2026
      </p>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">1. Penerimaan Syarat</h3>
        <p className="text-sm leading-relaxed">
          Dengan mengakses situs web Guild Hub di <code className="text-orange-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded">guild-hub-ff.vercel.app</code>, Anda setuju untuk terikat oleh syarat dan ketentuan layanan ini, semua hukum dan peraturan yang berlaku, dan setuju bahwa Anda bertanggung jawab untuk mematuhi hukum setempat yang berlaku. Jika Anda tidak menyetujui syarat-syarat ini, Anda dilarang menggunakan atau mengakses situs ini.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">2. Lisensi Penggunaan</h3>
        <p className="text-sm leading-relaxed">
          Izin diberikan untuk mengunduh sementara satu salinan materi (informasi atau perangkat lunak) di situs web Guild Hub hanya untuk dilihat secara pribadi dan non-komersial. Ini adalah pemberian lisensi, bukan pengalihan hak, dan di bawah lisensi ini Anda tidak boleh:
        </p>
        <ul className="list-disc list-inside space-y-1.5 pl-4 text-sm text-slate-400">
          <li>Memodifikasi atau menyalin materi;</li>
          <li>Menggunakan materi untuk tujuan komersial apa pun, atau untuk tampilan publik apa pun (komersial atau non-komersial);</li>
          <li>Mencoba mendekompilasi atau merekayasa balik perangkat lunak apa pun yang terkandung di situs web Guild Hub;</li>
          <li>Menghapus hak cipta atau notasi kepemilikan lainnya dari materi; atau</li>
          <li>Mentransfer materi ke orang lain atau "mencerminkan" materi di server lain.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">3. Penyangkal (Disclaimer)</h3>
        <p className="text-sm leading-relaxed">
          Materi di situs web Guild Hub disediakan secara 'apa adanya'. Guild Hub tidak memberikan jaminan, tersurat maupun tersirat, dan dengan ini menolak dan menegasikan semua jaminan lainnya termasuk, tanpa batasan, jaminan tersirat atau kondisi kelayakan jual, kesesuaian untuk tujuan tertentu, atau non-pelanggaran kekayaan intelektual atau pelanggaran hak lainnya.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">4. Batasan Tanggung Jawab</h3>
        <p className="text-sm leading-relaxed">
          Dalam keadaan apa pun, Guild Hub atau pemasoknya tidak bertanggung jawab atas kerusakan apa pun (termasuk, tanpa batasan, kerusakan karena hilangnya data atau keuntungan, atau karena gangguan bisnis) yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan materi di situs web Guild Hub.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">5. Akurasi Materi</h3>
        <p className="text-sm leading-relaxed">
          Materi yang muncul di situs web Guild Hub dapat mencakup kesalahan teknis, tipografi, atau fotografi. Guild Hub tidak menjamin bahwa materi apa pun di situs webnya akurat, lengkap, atau mutakhir. Guild Hub dapat melakukan perubahan pada materi yang terkandung di situs webnya kapan saja tanpa pemberitahuan.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">6. Tautan (Links)</h3>
        <p className="text-sm leading-relaxed">
          Guild Hub belum meninjau semua situs yang tertaut ke situs webnya dan tidak bertanggung jawab atas isi dari situs yang tertaut tersebut. Penyertaan tautan apa pun tidak menyiratkan dukungan oleh Guild Hub terhadap situs tersebut. Penggunaan situs web tertaut tersebut adalah risiko pengguna sendiri.
        </p>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6 text-slate-300">
      <h2 className="text-2xl font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center gap-2">
        <Shield className="text-orange-500 w-6 h-6" /> Tentang Kami & Kontak (About & Contact Us)
      </h2>
      
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-orange-400">Tentang Guild Hub</h3>
        <p className="text-sm leading-relaxed">
          <strong>Guild Hub</strong> adalah platform manajemen Esports inovatif yang dirancang khusus untuk memenuhi kebutuhan klan dan guild Free Fire di Indonesia. Misi kami adalah memfasilitasi koordinasi tim, pengelolaan mading scrim, turnamen klan, dan dokumentasi anggota secara instan, transparan, dan teratur.
        </p>
        <p className="text-sm leading-relaxed">
          Dengan fitur pembagian role yang canggih (Ketua, Officer, dan Member), Guild Hub memungkinkan para kapten klan untuk mendelegasikan tugas dan mengurus data klan secara profesional dalam satu dasbor cyber-gaming yang canggih.
        </p>
      </section>

      <section className="space-y-4 pt-4">
        <h3 className="text-lg font-semibold text-orange-400 border-b border-slate-800 pb-2">Hubungi Kami (Contact Us)</h3>
        <p className="text-sm leading-relaxed">
          Jika Anda memiliki pertanyaan tentang platform kami, bug laporan, atau permohonan kemitraan iklan, silakan hubungi kami melalui salah satu saluran berikut:
        </p>
        
        <div className="grid sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Email Dukungan</div>
              <a href="mailto:support@guildhubff.com" className="text-sm text-white hover:text-orange-400 transition font-medium">
                support@guildhubff.com
              </a>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">WhatsApp Hotline</div>
              <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-orange-400 transition font-medium">
                +62 812-3456-789
              </a>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl flex items-center gap-3 sm:col-span-2">
            <div className="p-2.5 bg-orange-500/10 rounded-lg text-orange-500">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">Markas Koordinasi</div>
              <p className="text-sm text-white font-medium">
                Indonesian Esports Alliance Sector 9, Jakarta Selatan, Indonesia
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-slate-400 hover:text-white uppercase transition mb-6 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
      </button>

      <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-orange-500 via-red-500 to-indigo-600"></div>
        {pageType === "privacy" && renderPrivacy()}
        {pageType === "terms" && renderTerms()}
        {pageType === "about" && renderAbout()}
      </div>
    </div>
  );
}
