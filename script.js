/**
 * NaviBuddy — AI-Powered Onboarding Assistant
 * script.js — Main Application Entry Point
 * Architecture: Modular namespace pattern (Strict Mode ES6+)
 * Modules: RAGEngine | UIManager | StorageManager | NaviBuddyApp
 */

'use strict';

/* ══════════════════════════════════════════════════════════════════
   KNOWLEDGE BASE — Embedded JSON (Simulated RAG Documents)
   ══════════════════════════════════════════════════════════════════ */
const DEFAULT_KNOWLEDGE_BASE = [
  {
    id: 'kb_001',
    title: 'Buku Saku Karyawan 2026 - Bab 4.2: Kebijakan Cuti Tahunan',
    category: 'leave',
    keywords: ['cuti', 'izin', 'annual leave', 'libur', 'hari libur', 'cuti tahunan', 'pengajuan cuti'],
    content: `Karyawan berhak atas 12 hari cuti tahunan setelah menyelesaikan masa probasi 3 bulan.
Pengajuan cuti harus dilakukan minimal 3 hari kerja sebelumnya melalui sistem HRM Portal (hris.perusahaan.com).
Cuti dapat diambil minimum 1 hari dan maksimum 5 hari berturut-turut dalam satu pengajuan.
Sisa cuti tidak dapat diakumulasikan ke tahun berikutnya kecuali ada persetujuan tertulis dari Head of HR.
Cuti sakit wajib dilengkapi surat dokter bila lebih dari 2 hari berturut-turut.
Cuti darurat keluarga (meninggal/menikah) diberikan masing-masing 2-3 hari dengan verifikasi dokumen.`
  },
  {
    id: 'kb_002',
    title: 'Buku Saku Karyawan 2026 - Bab 7.1: Prosedur Klaim Reimbursement',
    category: 'health',
    keywords: ['reimburse', 'reimbursement', 'klaim', 'kesehatan', 'medical', 'biaya kesehatan', 'rawat inap', 'rawat jalan', 'obat', 'apotek'],
    content: `Program Reimbursement Kesehatan mencakup rawat jalan, rawat inap, dan pembelian obat.
Batas klaim rawat jalan: Rp 500.000/bulan per karyawan.
Batas klaim rawat inap: Rp 5.000.000/tahun per karyawan (tidak termasuk prosedur kosmetik).
Cara klaim: Kumpulkan nota/kwitansi asli, isi Form Klaim (unduh di HRM Portal > Benefits), serahkan ke Tim HR maksimal 30 hari setelah pengobatan.
Dokumen yang diperlukan: Kwitansi asli, resep dokter (untuk obat), surat rujukan (rawat inap), KTP.
Reimbursement akan dibayarkan bersamaan dengan gaji bulan berikutnya.
Anggota keluarga (pasangan & anak) mendapatkan 50% dari batas klaim karyawan.`
  },
  {
    id: 'kb_003',
    title: 'Buku Saku Karyawan 2026 - Bab 2.3: Aturan Berpakaian (Dress Code)',
    category: 'conduct',
    keywords: ['dress code', 'berpakaian', 'pakaian', 'seragam', 'kaos', 'formal', 'casual', 'penampilan', 'outfit'],
    content: `Kebijakan berpakaian perusahaan mengikuti prinsip Smart-Casual sehari-hari.
Senin–Kamis: Business Casual (kemeja, celana bahan/chino, sepatu tertutup). Dilarang celana jeans robek dan kaos polos.
Jumat: Casual Day diperbolehkan (kaos berkerah, jeans rapi, sepatu sneakers bersih).
Kunjungan Klien/Presentasi: Wajib Business Formal (kemeja/blazer, celana bahan, sepatu pantofel/heels formal).
Pakaian berpotongan terlalu terbuka, bergambar tidak sopan, atau mengandung simbol provokatif dilarang setiap saat.
Karyawan yang mewakili perusahaan di event eksternal wajib memakai ID card dan pakaian berlogo perusahaan jika tersedia.`
  },
  {
    id: 'kb_004',
    title: 'Panduan Fasilitas Kantor 2026 - Lokasi & Penggunaan',
    category: 'facilities',
    keywords: ['pantry', 'dapur', 'fasilitas', 'lokasi', 'kantor', 'ruang meeting', 'parkir', 'gym', 'musola', 'toilet', 'loker', 'printer'],
    content: `Lantai 1: Lobby utama, Resepsionis, Ruang Tunggu Tamu, Ruang Meeting Anggrek & Melati.
Lantai 2: Area kerja Open Office tim Engineering & Product. Pantry Lt.2 dengan microwave, kulkas, mesin kopi.
Lantai 3: Area kerja tim HR, Finance, & Legal. Pantry Lt.3 (khusus karyawan Lt.3). Ruang Ibadah/Musola.
Lantai 4: Rooftop Garden & Relaxation Zone (buka 07.00–19.00). Ruang Makan bersama.
Basement B1: Area parkir motor (gratis) dan mobil (gratis untuk posisi Manager ke atas, Rp 10.000/hari untuk staf).
Ruang Meeting dapat dipesan melalui sistem Calendar perusahaan (Google Workspace).
Printer/Fotokopi: Lantai 2 dekat tangga, Lantai 3 dekat lift. Gunakan PIN karyawan untuk login.`
  },
  {
    id: 'kb_005',
    title: 'Direktori Tim HR 2026 - Struktur & Kontak',
    category: 'hr_team',
    keywords: ['hr', 'tim hr', 'human resource', 'kontak', 'siapa', 'struktur', 'direktori', 'sdm', 'personalia', 'pic'],
    content: `Struktur Tim Human Resources:
• Head of HR: Ibu Sari Dewi Rahayu (sari.dewi@perusahaan.com) — Kebijakan strategis, eskalasi senior.
• HR Business Partner: Bapak Anggoro Wibowo (anggoro.w@perusahaan.com) — Permasalahan karyawan, performance review.
• HR Recruitment: Nadia Kusuma (nadia.k@perusahaan.com) — Proses rekrutmen, referral karyawan.
• HR Benefits & Payroll: Fajar Ramadhan (fajar.r@perusahaan.com) — Gaji, tunjangan, reimbursement, BPJS.
• HR Learning & Development: Putri Handayani (putri.h@perusahaan.com) — Pelatihan, sertifikasi, program pengembangan.
• General Email HR: hr@perusahaan.com
Jam kerja HR: Senin–Jumat, 08.00–17.00 WIB. Untuk isu darurat di luar jam kerja, hubungi Head of HR.`
  },
  {
    id: 'kb_006',
    title: 'Kebijakan Teknologi & Keamanan Data 2026 - Bab 3',
    category: 'conduct',
    keywords: ['laptop', 'komputer', 'keamanan', 'data', 'vpn', 'password', 'software', 'teknologi', 'it', 'helpdesk', 'wi-fi', 'internet'],
    content: `Semua perangkat kerja yang diberikan perusahaan adalah milik perusahaan dan harus dikembalikan saat resign.
Instalasi software tidak resmi dilarang. Ajukan kebutuhan software ke IT Helpdesk (it@perusahaan.com atau ext. 100).
VPN wajib diaktifkan saat mengakses sistem internal dari luar kantor.
Password akun harus minimal 12 karakter, kombinasi huruf besar/kecil, angka, dan simbol. Ganti setiap 90 hari.
Dilarang menyambungkan perangkat USB pribadi ke komputer kantor tanpa izin IT.
Wi-Fi tamu (GuestNetwork_PTX) tersedia di Lobby Lt.1 — tidak boleh digunakan untuk akses data internal.
Pelanggaran keamanan data harus dilaporkan ke IT Security maksimal 1x24 jam setelah diketahui.`
  },
  {
    id: 'kb_007',
    title: 'Panduan Onboarding Hari Pertama — Checklist Karyawan Baru',
    category: 'general',
    keywords: ['hari pertama', 'onboarding', 'orientasi', 'karyawan baru', 'checklist', 'mulai kerja', 'probasi', 'orientasi perusahaan'],
    content: `Selamat datang di keluarga besar PT Xynergy! Berikut hal-hal yang perlu dilakukan di hari pertama:
✅ Lapor ke Resepsionis Lt.1 dan ambil ID Card sementara.
✅ Temui HR Buddy Anda (akan dikonfirmasi via email sebelum hari pertama).
✅ Lengkapi dokumen administrasi di Ruang HR Lt.3 (KTP, NPWP, ijazah, foto 4x6, buku rekening).
✅ Setup workstation — IT akan membantu konfigurasi email, laptop, dan akses sistem.
✅ Ikuti sesi orientasi perusahaan (09.00–12.00 di Ruang Meeting Anggrek Lt.1).
✅ Makan siang bersama tim di Ruang Makan Lt.4 (dijadwalkan oleh HR).
✅ Review Employee Handbook digital yang dikirimkan ke email Anda.
Masa probasi: 3 bulan. Evaluasi dilakukan di bulan ke-1, ke-2, dan ke-3 oleh HR BP Anda.`
  },
  {
    id: 'kb_008',
    title: 'Kebijakan Kerja Fleksibel & WFH 2026',
    category: 'general',
    keywords: ['wfh', 'work from home', 'remote', 'hybrid', 'flexible', 'jam kerja', 'kerja dari rumah', 'flexi', 'jadwal kerja'],
    content: `Perusahaan menerapkan kebijakan Hybrid Work 3-2: 3 hari di kantor (WFO), 2 hari WFH per minggu.
Hari WFO wajib: Selasa dan Kamis (all-hands day). Satu hari WFO lainnya ditentukan bersama tim masing-masing.
WFH wajib memastikan: koneksi internet stabil, tersedia di jam kerja 08.00–17.00, responsif dalam 15 menit via chat.
Pengajuan WFH penuh (force-WFH) untuk kondisi darurat harus mendapat persetujuan manager via email.
Lembur di luar jam kerja normal (>17.00 WIB atau hari libur) harus mendapat approval manager dan dicatat di HRM Portal untuk kompensasi.
Karyawan yang absen tanpa izin lebih dari 3 hari berturut-turut dapat dikenakan sanksi sesuai PKB.`
  }
];

/* ══════════════════════════════════════════════════════════════════
   STORAGE MANAGER
   Handles all LocalStorage persistence
   ══════════════════════════════════════════════════════════════════ */
const StorageManager = (() => {
  const KEYS = {
    CHAT_HISTORY:  'navibuddy_chat_v2',
    MILESTONE:     'navibuddy_milestone_v2',
    CUSTOM_DOCS:   'navibuddy_docs_v2',
    CHECKINS_DONE: 'navibuddy_checkins_v2',
  };

  const _save = (key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('[StorageManager] Save failed:', e.message); }
  };

  const _load = (key, fallback = null) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  };

  return {
    saveChat:     (msgs)   => _save(KEYS.CHAT_HISTORY, msgs),
    loadChat:     ()       => _load(KEYS.CHAT_HISTORY, []),
    saveMilestone:(m)      => _save(KEYS.MILESTONE, m),
    loadMilestone:()       => _load(KEYS.MILESTONE, 'day1'),
    saveCustomDocs:(docs)  => _save(KEYS.CUSTOM_DOCS, docs),
    loadCustomDocs:()      => _load(KEYS.CUSTOM_DOCS, []),
    saveCheckins: (done)   => _save(KEYS.CHECKINS_DONE, done),
    loadCheckins: ()       => _load(KEYS.CHECKINS_DONE, []),
    clearAll: () => Object.values(KEYS).forEach(k => localStorage.removeItem(k)),
  };
})();

/* ══════════════════════════════════════════════════════════════════
   RAG ENGINE
   Simulated Retrieval-Augmented Generation search
   ══════════════════════════════════════════════════════════════════ */
const RAGEngine = (() => {
  let _knowledgeBase = [];

  /**
   * Score a document against a query using keyword overlap + fuzzy matching
   * Returns confidence score [0..1]
   */
  const _scoreDocument = (doc, queryTokens) => {
    const textToSearch = [
      doc.title.toLowerCase(),
      doc.keywords.join(' ').toLowerCase(),
      doc.content.toLowerCase(),
    ].join(' ');

    let hits = 0;
    for (const token of queryTokens) {
      if (token.length < 3) continue;
      if (textToSearch.includes(token)) hits++;
    }
    const keywordHits = doc.keywords.filter(kw =>
      queryTokens.some(t => kw.includes(t) || t.includes(kw))
    ).length;

    return Math.min(1, (hits * 0.15) + (keywordHits * 0.35));
  };

  /**
   * Tokenize a query string into lowercase words
   */
  const _tokenize = (query) =>
    query.toLowerCase()
      .replace(/[^a-zA-Z0-9\u00C0-\u024F\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 0);

  /**
   * Main search function — returns best matching docs sorted by score
   */
  const search = (query, topK = 2) => {
    const tokens = _tokenize(query);
    if (!tokens.length) return [];

    const scored = _knowledgeBase
      .map(doc => ({ doc, score: _scoreDocument(doc, tokens) }))
      .filter(r => r.score > 0.1)
      .sort((a, b) => b.score - a.score);

    return scored.slice(0, topK);
  };

  /**
   * Generate a natural language answer from matched document(s)
   */
  const generateAnswer = (query, results) => {
    if (!results.length) {
      return {
        answer: null,
        confidence: 0,
        sources: [],
      };
    }

    const topDoc   = results[0].doc;
    const confidence = results[0].score;
    const sources  = results.map(r => r.doc);

    // Format content lines into readable response
    const lines = topDoc.content.trim().split('\n').filter(l => l.trim());
    const formattedLines = lines.map(l => l.trim());

    const intro = _buildIntro(query, topDoc.category);
    const body  = formattedLines.join('\n');

    return {
      answer: `${intro}\n\n${body}`,
      confidence,
      sources,
    };
  };

  const _buildIntro = (query, category) => {
    const intros = {
      leave:      'Berikut informasi terkait kebijakan cuti & izin yang berlaku:',
      health:     'Ini panduan prosedur klaim dan benefit kesehatan kamu:',
      conduct:    'Berikut aturan yang perlu kamu ketahui:',
      facilities: 'Ini informasi lengkap tentang fasilitas kantor:',
      hr_team:    'Ini direktori dan kontak tim HR yang bisa kamu hubungi:',
      general:    'Berikut informasi yang aku temukan untukmu:',
    };
    return intros[category] || intros.general;
  };

  return {
    init: (baseDocs, customDocs = []) => {
      _knowledgeBase = [...baseDocs, ...customDocs];
    },
    addDocument: (doc) => { _knowledgeBase.push(doc); },
    search,
    generateAnswer,
    getAll: () => [..._knowledgeBase],
  };
})();

/* ══════════════════════════════════════════════════════════════════
   UI MANAGER
   DOM manipulation, rendering, and visual feedback
   ══════════════════════════════════════════════════════════════════ */
const UIManager = (() => {
  // ─── DOM Cache ────────────────────────────────────────────────
  const el = {};

  const _cache = () => {
    el.chatFeed        = document.getElementById('chat-feed');
    el.chatForm        = document.getElementById('chat-form');
    el.chatInput       = document.getElementById('chat-input');
    el.btnSend         = document.getElementById('btn-send');
    el.quickChips      = document.getElementById('quick-chips');
    el.sidebar         = document.getElementById('sidebar');
    el.sidebarBackdrop = document.getElementById('sidebar-backdrop');
    el.btnSidebarToggle= document.getElementById('btn-sidebar-toggle');
    el.milestoneNav    = document.getElementById('milestone-nav');
    el.milestoneNavMob = document.getElementById('milestone-nav-mobile');
    el.btnAdminUpload  = document.getElementById('btn-admin-upload');
    el.btnClearChat    = document.getElementById('btn-clear-chat');
    el.kbDocList       = document.getElementById('kb-doc-list');
    el.notificationBar = document.getElementById('notification-bar');
    el.toast           = document.getElementById('toast');
    // Admin modal
    el.modalAdmin      = document.getElementById('modal-admin');
    el.adminDocTitle   = document.getElementById('admin-doc-title');
    el.adminDocCat     = document.getElementById('admin-doc-category');
    el.adminDocKw      = document.getElementById('admin-doc-keywords');
    el.adminDocContent = document.getElementById('admin-doc-content');
    el.adminUploadErr  = document.getElementById('admin-upload-error');
    el.btnAdminSave    = document.getElementById('btn-admin-save');
    // Email modal
    el.modalEmail      = document.getElementById('modal-email');
    el.emailSubject    = document.getElementById('email-subject');
    el.emailBody       = document.getElementById('email-body');
    el.btnCopyEmail    = document.getElementById('btn-copy-email');
  };

  // ─── XSS Sanitizer ────────────────────────────────────────────
  /**
   * Safe text → textNode (no innerHTML injection for user text)
   * For controlled bot content with line breaks, we use a
   * controlled whitelist approach via _renderBotContent().
   */
  const _sanitizeText = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML; // Returns HTML-escaped string
  };

  /**
   * Render bot content: allow line breaks and bullet chars only.
   * Input is sourced from our own knowledge base (trusted), NOT user input.
   */
  const _renderBotContent = (text) => {
    const escaped = _sanitizeText(text);
    return escaped
      .replace(/\n/g, '<br>')
      .replace(/✅/g, '<span aria-hidden="true">✅</span>')
      .replace(/•/g, '<span aria-hidden="true">•</span>');
  };

  // ─── Timestamp ────────────────────────────────────────────────
  const _now = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  // ─── Scroll to Bottom ─────────────────────────────────────────
  const scrollToBottom = () => {
    if (el.chatFeed) {
      el.chatFeed.scrollTo({ top: el.chatFeed.scrollHeight, behavior: 'smooth' });
    }
  };

  // ─── Render Welcome Card ──────────────────────────────────────
  const renderWelcome = (milestone) => {
    const msgs = {
      day1:   { emoji: '🌅', title: 'Selamat Datang di Hari Pertamamu!', sub: 'Aku NaviBuddy, asisten onboarding virtualmu. Siap bantu kamu mengenal perusahaan, kebijakan, dan fasilitas — tanyakan apa saja!' },
      week1:  { emoji: '⭐', title: 'Selamat Memasuki Minggu Pertama!', sub: 'Semoga awal yang luar biasa! Aku siap membantu kamu menavigasi semua prosedur dan kebutuhan di minggu pertama.' },
      month1: { emoji: '🚀', title: 'Sebulan Bersama Kami!', sub: 'Luar biasa! Satu bulan telah berlalu. Yuk bagikan pengalamanmu dan tanyakan apa pun yang masih perlu diketahui.' },
    };
    const m = msgs[milestone] || msgs.day1;
    const card = document.createElement('div');
    card.className = 'welcome-card';
    card.innerHTML = `
      <div class="welcome-logo">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
      </div>
      <h1 class="text-xl font-bold text-slate-900 mb-2">${m.emoji} ${m.title}</h1>
      <p class="text-sm text-slate-500 leading-relaxed mb-4">${m.sub}</p>
      <div class="flex flex-wrap justify-center gap-2">
        <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">📋 Kebijakan Perusahaan</span>
        <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">💼 SOP & Prosedur</span>
        <span class="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">🏢 Fasilitas Kantor</span>
      </div>`;
    el.chatFeed.appendChild(card);
  };

  // ─── Render User Message ──────────────────────────────────────
  const renderUserMessage = (text, timestamp = _now()) => {
    const row = document.createElement('div');
    row.className = 'message-row user-row';
    row.setAttribute('role', 'listitem');
    row.innerHTML = `
      <div>
        <div class="msg-bubble user-bubble">${_sanitizeText(text)}</div>
        <span class="msg-time">${timestamp}</span>
      </div>
      <div class="msg-avatar user-avatar" aria-hidden="true">👤</div>`;
    el.chatFeed.appendChild(row);
    scrollToBottom();
    return row;
  };

  // ─── Render Typing Indicator ──────────────────────────────────
  const renderTypingIndicator = () => {
    const row = document.createElement('div');
    row.className = 'message-row bot-row';
    row.id = 'typing-indicator-row';
    row.setAttribute('aria-label', 'NaviBuddy sedang mengetik…');
    row.innerHTML = `
      <div class="msg-avatar bot-avatar" aria-hidden="true">🤖</div>
      <div class="typing-indicator" role="status">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      </div>`;
    el.chatFeed.appendChild(row);
    scrollToBottom();
    return row;
  };

  const removeTypingIndicator = () => {
    const ind = document.getElementById('typing-indicator-row');
    if (ind) ind.remove();
  };

  // ─── Render Bot Message ───────────────────────────────────────
  const renderBotMessage = (text, sources = [], isEscalation = false, timestamp = _now()) => {
    const row = document.createElement('div');
    row.className = 'message-row bot-row';
    row.setAttribute('role', 'listitem');

    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble bot-bubble';

    const content = document.createElement('div');
    content.innerHTML = _renderBotContent(text);
    bubble.appendChild(content);

    // Source Badges
    if (sources.length) {
      const badgeWrap = document.createElement('div');
      badgeWrap.className = 'flex flex-wrap gap-1.5 mt-2';
      sources.forEach(src => {
        const badge = document.createElement('button');
        badge.className = 'source-badge';
        badge.setAttribute('aria-label', `Sumber: ${src.title}`);
        badge.setAttribute('title', src.title);
        badge.innerHTML = `📄 <span>${src.title.substring(0, 55)}${src.title.length > 55 ? '…' : ''}</span>`;
        badgeWrap.appendChild(badge);
      });
      bubble.appendChild(badgeWrap);
    }

    // Escalation Card
    if (isEscalation) {
      const card = document.createElement('div');
      card.className = 'escalation-card';
      card.innerHTML = `
        <div class="escalation-title">⚠️ Butuh Bantuan Langsung dari Tim HR?</div>
        <p>Pertanyaan ini mungkin membutuhkan penanganan personal dari HR. Aku sudah siapkan draft email untuk kamu.</p>
        <div class="mt-3">
          <button class="btn-accent btn-escalate-email" data-issue="${_sanitizeText(text)}">
            ✉️ Hubungi Tim HR via Email
          </button>
        </div>`;
      bubble.appendChild(card);
    }

    const timestamp_el = document.createElement('span');
    timestamp_el.className = 'msg-time';
    timestamp_el.textContent = timestamp;

    const wrapper = document.createElement('div');
    wrapper.appendChild(bubble);
    wrapper.appendChild(timestamp_el);

    row.innerHTML = `<div class="msg-avatar bot-avatar" aria-hidden="true">🤖</div>`;
    row.appendChild(wrapper);
    el.chatFeed.appendChild(row);
    scrollToBottom();
    return row;
  };

  // ─── Render Check-in Card ──────────────────────────────────────
  const renderCheckinCard = (milestone, onAnswer) => {
    const configs = {
      day1: {
        title: '🌅 Bagaimana kesan pertamamu hari ini?',
        options: ['😊 Menyenangkan!', '😐 Cukup Baik', '😅 Sedikit Overwhelming', '❓ Banyak yang Belum Jelas'],
      },
      week1: {
        title: '⭐ Bagaimana minggu pertamamu berjalan?',
        options: ['🚀 Sangat Lancar!', '👍 Perlu Sedikit Bantuan', '🤔 Masih Banyak Penyesuaian', '🆘 Perlu Bantuan Lebih'],
      },
      month1: {
        title: '🚀 Sudah satu bulan! Bagaimana perasaanmu?',
        options: ['💪 Sudah Percaya Diri', '📈 Ada Progres Signifikan', '🔧 Masih Ada yang Perlu Diperbaiki', '💬 Ingin Diskusi dengan HR'],
      },
    };

    const cfg = configs[milestone];
    if (!cfg) return;

    const row = document.createElement('div');
    row.className = 'message-row bot-row';
    row.setAttribute('role', 'listitem');

    const card = document.createElement('div');
    card.className = 'checkin-card';
    card.innerHTML = `<div class="checkin-title">${cfg.title}</div>
      <p class="text-xs text-slate-500 mb-1">Pilih salah satu yang paling menggambarkan pengalamanmu:</p>`;

    const actions = document.createElement('div');
    actions.className = 'checkin-actions';
    cfg.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'checkin-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        // Disable all buttons after selection
        card.querySelectorAll('.checkin-btn').forEach(b => {
          b.disabled = true;
          b.classList.remove('selected');
        });
        btn.classList.add('selected');
        if (typeof onAnswer === 'function') onAnswer(opt, milestone);
      });
      actions.appendChild(btn);
    });

    card.appendChild(actions);

    row.innerHTML = `<div class="msg-avatar bot-avatar" aria-hidden="true">🤖</div>`;
    row.appendChild(card);
    el.chatFeed.appendChild(row);
    scrollToBottom();
  };

  // ─── KB Sidebar Doc List ──────────────────────────────────────
  const renderKBDocList = (docs) => {
    if (!el.kbDocList) return;
    el.kbDocList.innerHTML = '';
    docs.forEach(doc => {
      const li = document.createElement('li');
      li.className = 'kb-doc-item';
      li.innerHTML = `
        <span class="kb-doc-icon" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
        </span>
        <div>
          <div class="font-medium text-slate-700 leading-snug">${_sanitizeText(doc.title.substring(0, 60))}${doc.title.length > 60 ? '…' : ''}</div>
          <span class="kb-doc-badge mt-0.5">${_sanitizeText(doc.category)}</span>
        </div>`;
      el.kbDocList.appendChild(li);
    });
  };

  // ─── Milestone Active State ───────────────────────────────────
  const setActiveMilestone = (milestone) => {
    document.querySelectorAll('.milestone-tab').forEach(btn => {
      const isActive = btn.dataset.milestone === milestone;
      btn.classList.toggle('active-tab', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('.milestone-tab-mobile').forEach(btn => {
      const isActive = btn.dataset.milestone === milestone;
      btn.classList.toggle('active-tab-mobile', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  // ─── Notification Bar ─────────────────────────────────────────
  const showNotification = (msg) => {
    if (!el.notificationBar) return;
    el.notificationBar.innerHTML = `
      <span>🔔 ${_sanitizeText(msg)}</span>
      <button class="close-notif" aria-label="Tutup notifikasi" onclick="this.parentElement.classList.add('hidden')">✕</button>`;
    el.notificationBar.classList.remove('hidden');
    setTimeout(() => el.notificationBar.classList.add('hidden'), 8000);
  };

  // ─── Toast ────────────────────────────────────────────────────
  let _toastTimer = null;
  const showToast = (msg, duration = 2800) => {
    if (!el.toast) return;
    el.toast.textContent = msg;
    el.toast.classList.remove('hidden');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.toast.classList.add('hidden'), duration);
  };

  // ─── Modal Control ────────────────────────────────────────────
  const openModal  = (id) => { const m = document.getElementById(id); if (m) m.classList.remove('hidden'); };
  const closeModal = (id) => { const m = document.getElementById(id); if (m) m.classList.add('hidden'); };

  // ─── Email Draft Modal ────────────────────────────────────────
  const populateEmailDraft = (issue, chatSummary) => {
    if (el.emailSubject) {
      el.emailSubject.textContent = `[HR Inquiry] Pertanyaan dari Karyawan Baru — ${new Date().toLocaleDateString('id-ID')}`;
    }
    if (el.emailBody) {
      el.emailBody.textContent =
`Kepada Yth. Tim Human Resources,

Saya adalah karyawan baru yang ingin mengajukan pertanyaan terkait hal berikut:

Topik / Pertanyaan:
"${issue}"

Ringkasan Diskusi dengan NaviBuddy:
${chatSummary}

Mohon bantuan dan informasi lebih lanjut dari Tim HR.

Terima kasih atas perhatian dan bantuannya.

Hormat saya,
[Nama Karyawan]
[Departemen]
[No. HP / Ext.]`;
    }
    openModal('modal-email');
  };

  // ─── Input Auto-Resize ────────────────────────────────────────
  const setupTextareaResize = () => {
    if (!el.chatInput) return;
    el.chatInput.addEventListener('input', () => {
      el.chatInput.style.height = 'auto';
      el.chatInput.style.height = Math.min(el.chatInput.scrollHeight, 160) + 'px';
    });
  };

  // ─── Clear Feed ───────────────────────────────────────────────
  const clearFeed = () => {
    if (el.chatFeed) el.chatFeed.innerHTML = '';
  };

  return {
    init: _cache,
    setupTextareaResize,
    renderWelcome,
    renderUserMessage,
    renderTypingIndicator,
    removeTypingIndicator,
    renderBotMessage,
    renderCheckinCard,
    renderKBDocList,
    setActiveMilestone,
    showNotification,
    showToast,
    openModal,
    closeModal,
    populateEmailDraft,
    clearFeed,
    scrollToBottom,
    el, // expose for NaviBuddyApp
  };
})();

/* ══════════════════════════════════════════════════════════════════
   NAVIBUDDY APP
   Main orchestrator — state management, event wiring, flow control
   ══════════════════════════════════════════════════════════════════ */
const NaviBuddyApp = (() => {

  // ─── App State ────────────────────────────────────────────────
  const state = {
    chatHistory:    [],  // { role: 'user'|'bot', text, timestamp }
    currentMilestone: 'day1',
    customDocs:     [],
    checkinsDone:   [],  // milestone ids already shown
    isThinking:     false,
  };

  // ─── Milestone Notification Map ───────────────────────────────
  const MILESTONE_NOTIFICATIONS = {
    day1:   'Selamat datang di Hari Pertama! Yuk mulai perjalanan onboarding-mu bersama NaviBuddy. 🌅',
    week1:  'Minggu pertamamu hampir selesai! Cek in-card sudah tersedia untukmu di bawah ini. ⭐',
    month1: 'Sebulan sudah berlalu — kamu luar biasa! Bagikan pengalamanmu dengan kami. 🚀',
  };

  // ─── Low-Confidence Fallback Responses ────────────────────────
  const FALLBACK_RESPONSES = [
    'Hmm, aku belum menemukan informasi spesifik tentang itu di Knowledge Base kami. Ini mungkin membutuhkan konfirmasi langsung dari Tim HR.',
    'Pertanyaan ini sepertinya membutuhkan penanganan khusus dari Tim HR. Aku tidak ingin memberikan informasi yang salah.',
    'Maaf, aku tidak cukup yakin dengan jawaban untuk pertanyaan ini. Sebaiknya langsung tanyakan ke HR untuk kepastian.',
  ];

  const _randomFallback = () => FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];

  // ─── Initialize App ───────────────────────────────────────────
  const init = () => {
    UIManager.init();
    UIManager.setupTextareaResize();

    // Load persisted state
    state.chatHistory      = StorageManager.loadChat();
    state.currentMilestone = StorageManager.loadMilestone();
    state.customDocs       = StorageManager.loadCustomDocs();
    state.checkinsDone     = StorageManager.loadCheckins();

    // Initialize RAG with default + custom docs
    RAGEngine.init(DEFAULT_KNOWLEDGE_BASE, state.customDocs);

    // Render sidebar KB list
    UIManager.renderKBDocList(RAGEngine.getAll());

    // Set active milestone tab
    UIManager.setActiveMilestone(state.currentMilestone);

    // Restore or start fresh
    if (state.chatHistory.length > 0) {
      _restoreChatHistory();
    } else {
      UIManager.renderWelcome(state.currentMilestone);
    }

    // Wire all events
    _bindEvents();

    // Trigger milestone notification after short delay
    setTimeout(() => {
      UIManager.showNotification(MILESTONE_NOTIFICATIONS[state.currentMilestone]);
    }, 1200);

    // Auto check-in if not done for current milestone
    setTimeout(() => {
      if (!state.checkinsDone.includes(state.currentMilestone) && state.chatHistory.length >= 2) {
        _triggerCheckin(state.currentMilestone);
      }
    }, 3500);
  };

  // ─── Restore Persisted Chat ────────────────────────────────────
  const _restoreChatHistory = () => {
    // Show minimal welcome back message
    const lastBot = [...state.chatHistory].reverse().find(m => m.role === 'bot');
    state.chatHistory.forEach(msg => {
      if (msg.role === 'user') {
        UIManager.renderUserMessage(msg.text, msg.timestamp);
      } else {
        UIManager.renderBotMessage(msg.text, msg.sources || [], msg.isEscalation || false, msg.timestamp);
      }
    });
    UIManager.scrollToBottom();
  };

  // ─── Process User Query ───────────────────────────────────────
  const _processQuery = async (rawQuery) => {
    if (state.isThinking || !rawQuery.trim()) return;

    const query     = rawQuery.trim();
    const timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Render user message
    UIManager.renderUserMessage(query, timestamp);

    // Persist to state
    state.chatHistory.push({ role: 'user', text: query, timestamp });
    StorageManager.saveChat(state.chatHistory);

    // Show typing indicator
    state.isThinking = true;
    UIManager.el.btnSend.disabled = true;
    const typingRow = UIManager.renderTypingIndicator();

    // Simulate async AI processing delay
    const delay = 800 + Math.random() * 900;
    await _sleep(delay);

    UIManager.removeTypingIndicator();
    state.isThinking = false;
    UIManager.el.btnSend.disabled = false;

    // RAG search
    const results  = RAGEngine.search(query);
    const { answer, confidence, sources } = RAGEngine.generateAnswer(query, results);

    const botTimestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const isEscalation = confidence < 0.15;
    const responseText = answer || _randomFallback();

    UIManager.renderBotMessage(responseText, sources, isEscalation, botTimestamp);

    // Persist bot response
    state.chatHistory.push({
      role: 'bot',
      text: responseText,
      sources,
      isEscalation,
      timestamp: botTimestamp,
    });
    StorageManager.saveChat(state.chatHistory);
  };

  // ─── Trigger Check-in ─────────────────────────────────────────
  const _triggerCheckin = (milestone) => {
    if (state.checkinsDone.includes(milestone)) return;
    state.checkinsDone.push(milestone);
    StorageManager.saveCheckins(state.checkinsDone);

    UIManager.renderCheckinCard(milestone, (answer) => {
      const ackMap = {
        '😊 Menyenangkan!'        : 'Senang dengarnya! Semoga hari-hari berikutnya sama menyenangkan. Jangan ragu tanya apa pun! 🎉',
        '🚀 Sangat Lancar!'        : 'Luar biasa! Terus semangat dan jangan ragu untuk eksplorasi lebih banyak. 🚀',
        '💪 Sudah Percaya Diri'    : 'Keren sekali! Satu bulan pertama berhasil dilalui dengan percaya diri. 👏',
      };
      const generic = 'Terima kasih atas feedback-mu! Tim HR akan senang mengetahuinya. Apakah ada hal spesifik yang ingin kamu tanyakan atau diskusikan?';
      const response = ackMap[answer] || generic;

      const ts = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      UIManager.renderBotMessage(response, [], false, ts);
      state.chatHistory.push({ role: 'bot', text: response, sources: [], timestamp: ts });
      StorageManager.saveChat(state.chatHistory);
    });
  };

  // ─── Switch Milestone ──────────────────────────────────────────
  const _switchMilestone = (milestone) => {
    if (milestone === state.currentMilestone) return;
    state.currentMilestone = milestone;
    StorageManager.saveMilestone(milestone);
    UIManager.setActiveMilestone(milestone);
    UIManager.showNotification(MILESTONE_NOTIFICATIONS[milestone]);

    const ts = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const msgs = {
      day1:   'Kamu beralih ke fase **Hari 1 — Welcome**. Aku siap menemanimu dari awal! 🌅',
      week1:  'Kamu masuk ke fase **Minggu 1 — First Impression**. Bagaimana pengalaman pertamamu? ⭐',
      month1: 'Memasuki fase **Bulan 1 — Pulse Check**! Sudah satu bulan, luar biasa! 🚀',
    };
    UIManager.renderBotMessage(msgs[milestone] || msgs.day1, [], false, ts);

    // Show check-in if not done
    setTimeout(() => {
      if (!state.checkinsDone.includes(milestone)) {
        _triggerCheckin(milestone);
      }
    }, 1000);
  };

  // ─── Admin Upload Handler ──────────────────────────────────────
  const _handleAdminSave = () => {
    const title   = UIManager.el.adminDocTitle.value.trim();
    const category= UIManager.el.adminDocCat.value;
    const keywords= UIManager.el.adminDocKw.value.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    const content = UIManager.el.adminDocContent.value.trim();

    const errEl = UIManager.el.adminUploadErr;
    errEl.classList.add('hidden');

    if (!title || !content) {
      errEl.textContent = 'Judul dan konten dokumen wajib diisi.';
      errEl.classList.remove('hidden');
      return;
    }

    const newDoc = {
      id: `kb_custom_${Date.now()}`,
      title,
      category,
      keywords,
      content,
    };

    RAGEngine.addDocument(newDoc);
    state.customDocs.push(newDoc);
    StorageManager.saveCustomDocs(state.customDocs);
    UIManager.renderKBDocList(RAGEngine.getAll());

    // Reset form
    UIManager.el.adminDocTitle.value   = '';
    UIManager.el.adminDocKw.value      = '';
    UIManager.el.adminDocContent.value = '';
    UIManager.el.adminDocCat.value     = 'general';

    UIManager.closeModal('modal-admin');
    UIManager.showToast('✅ Dokumen berhasil ditambahkan ke Knowledge Base!');
  };

  // ─── Copy Email Draft ──────────────────────────────────────────
  const _handleCopyEmail = () => {
    const subject = UIManager.el.emailSubject?.textContent || '';
    const body    = UIManager.el.emailBody?.textContent    || '';
    const full    = `Kepada: hr@perusahaan.com\nSubjek: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(full)
      .then(() => UIManager.showToast('📋 Draft email berhasil disalin ke clipboard!'))
      .catch(() => UIManager.showToast('❌ Gagal menyalin. Coba salin secara manual.'));
  };

  // ─── Clear Chat ────────────────────────────────────────────────
  const _handleClearChat = () => {
    if (!confirm('Reset sesi chat? Semua riwayat percakapan akan dihapus.')) return;
    StorageManager.clearAll();
    state.chatHistory    = [];
    state.checkinsDone   = [];
    state.customDocs     = [];
    state.currentMilestone = 'day1';
    RAGEngine.init(DEFAULT_KNOWLEDGE_BASE, []);
    UIManager.clearFeed();
    UIManager.renderKBDocList(RAGEngine.getAll());
    UIManager.setActiveMilestone('day1');
    UIManager.renderWelcome('day1');
    UIManager.showToast('🗑️ Sesi chat telah direset.');
  };

  // ─── Event Binding ─────────────────────────────────────────────
  const _bindEvents = () => {
    const { el } = UIManager;

    // Form submit
    el.chatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = el.chatInput.value;
      if (!query.trim()) return;
      el.chatInput.value = '';
      el.chatInput.style.height = 'auto';
      _processQuery(query);
    });

    // Enter key (submit), Shift+Enter (newline)
    el.chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        el.chatForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });

    // Quick suggestion chips — Event Delegation
    el.quickChips?.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      const query = chip.dataset.query;
      if (query) {
        el.chatInput.value = '';
        _processQuery(query);
      }
    });

    // Sidebar HR shortcut links — Event Delegation
    el.sidebar?.addEventListener('click', (e) => {
      const link = e.target.closest('.sidebar-link');
      if (!link) return;
      const query = link.dataset.quick;
      if (query) {
        _closeSidebar();
        _processQuery(query);
      }
    });

    // Chat feed delegation — escalation button + source badge
    el.chatFeed?.addEventListener('click', (e) => {
      // Escalation email button
      const escBtn = e.target.closest('.btn-escalate-email');
      if (escBtn) {
        const issue = escBtn.dataset.issue || 'Topik yang dibahas dalam percakapan';
        const chatSummary = state.chatHistory
          .slice(-6)
          .map(m => `[${m.role === 'user' ? 'Karyawan' : 'NaviBuddy'}]: ${m.text.substring(0, 120)}`)
          .join('\n');
        UIManager.populateEmailDraft(issue, chatSummary);
        return;
      }
      // Source badge — just show toast info
      const srcBadge = e.target.closest('.source-badge');
      if (srcBadge) {
        UIManager.showToast(`📄 ${srcBadge.title}`);
      }
    });

    // Milestone tabs (desktop + mobile) — Event Delegation
    document.getElementById('milestone-nav')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.milestone-tab');
      if (tab?.dataset.milestone) _switchMilestone(tab.dataset.milestone);
    });
    document.getElementById('milestone-nav-mobile')?.addEventListener('click', (e) => {
      const tab = e.target.closest('.milestone-tab-mobile');
      if (tab?.dataset.milestone) _switchMilestone(tab.dataset.milestone);
    });

    // Admin Upload button & save
    el.btnAdminUpload?.addEventListener('click', () => UIManager.openModal('modal-admin'));
    el.btnAdminSave?.addEventListener('click', _handleAdminSave);

    // Clear chat
    el.btnClearChat?.addEventListener('click', _handleClearChat);

    // Copy email draft
    el.btnCopyEmail?.addEventListener('click', _handleCopyEmail);

    // Modal close buttons — Event Delegation on document
    document.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('.modal-close-btn');
      if (closeBtn?.dataset.modal) {
        UIManager.closeModal(closeBtn.dataset.modal);
        return;
      }
      // Click outside modal box closes it
      const overlay = e.target.closest('.modal-overlay');
      if (overlay && e.target === overlay) {
        overlay.classList.add('hidden');
      }
    });

    // Sidebar toggle (mobile)
    el.btnSidebarToggle?.addEventListener('click', () => {
      el.sidebar.classList.toggle('open');
      el.sidebarBackdrop.classList.toggle('hidden');
    });
    el.sidebarBackdrop?.addEventListener('click', _closeSidebar);

    // Keyboard: Escape closes modals & sidebar
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      ['modal-admin', 'modal-email'].forEach(id => UIManager.closeModal(id));
      _closeSidebar();
    });
  };

  const _closeSidebar = () => {
    UIManager.el.sidebar?.classList.remove('open');
    UIManager.el.sidebarBackdrop?.classList.add('hidden');
  };

  const _sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return { init };
})();
