export type Language = 'id' | 'en';

export function getInitialLanguage(): Language {
  if (typeof window !== 'undefined' && window.navigator) {
    const lang = (window.navigator.language || (window.navigator as any).userLanguage || '').toLowerCase();
    if (lang.startsWith('id') || lang.startsWith('in')) {
      return 'id';
    }
  }
  return 'en';
}

export const translations = {
  id: {
    tabTitle: 'TubeAudio - Download Audio & Playlist YouTube',
    tabDownloading: 'Mengunduh',
    headerSub: 'YouTube Playlist Audio Downloader & Converter',
    formatLabel: 'Format',
    deployBtn: 'Deploy Vercel',

    heroBadge: 'Format Audio',
    heroBadgeSuffix: '• Efisiensi Tinggi & Suara Jernih',
    heroTitlePrefix: 'Download Playlist YouTube ke',
    heroTitleHighlight: 'Format',
    heroSubtitle1: 'Masukkan link playlist YouTube atau kata kunci pencarian. Konversi audio otomatis ke format',
    heroSubtitle2: 'hemat ruang dengan kualitas studio.',
    inputPlaceholder: 'Tempel URL Playlist / Video YouTube atau ketik judul lagu...',
    btnSearch: 'Cari & Muat',
    btnLoading: 'Memuat...',
    quickTry: 'Coba Playlist Contoh:',
    demoLofi: 'Lo-Fi Chill Beats',
    demoPop: 'Pop Hits 2026',

    // Playlist / Track view
    selectAll: 'Pilih Semua',
    deselectAll: 'Batal Semua',
    selectedTracks: 'Trek Dipilih',
    downloadSingle: 'Download 1 Trek',
    downloadBatchZip: 'Download {count} Trek (.ZIP {fmt})',
    preparingZip: 'Mempersiapkan ZIP Batch .{fmt}',

    // Track card
    duration: 'Durasi',
    views: 'tayangan',
    downloadTrack: 'Unduh trek ini',
    previewAudio: 'Pratinjau audio',
    downloadingAudio: 'Proses Mengunduh Audio...',

    // Audio Preview Modal
    instantPreview: 'Pratinjau Instan',
    proxyStream: 'Stream Proxy',
    instantMode: 'Mode Instan',
    downloadAudio: 'Unduh Audio',
    playingFromProxy: 'Memutar dari Server Audio Proxy Stream...',

    // Settings Modal
    settingsTitle: 'Pengaturan Format Audio',
    bitrateLabel: 'Kualitas Bitrate Audio',
    nativeQuality: 'Asli YouTube Native (Kualitas Tinggi)',
    standardQuality: 'Kualitas Standar (Hemat Ruang)',
    ecoQuality: 'Sangat Hemat Data',
    formatExtLabel: 'Ekstensi File Output (Format Audio)',
    fmtMp3Tag: 'Disarankan (Semua Perangkat)',
    fmtM4aTag: 'AAC Jernih (Apple / Android)',
    fmtOpusTag: 'Codec Kualitas Tinggi',
    fmtOggTag: 'Format Audio Web',
    fmtWebmTag: 'Format Container Web',
    namingPatternLabel: 'Pola Nama File Output',
    includeLyricsLabel: 'Sertakan File Lirik (.lrc)',
    saveClose: 'Simpan & Tutup',

    // Vercel Modal
    deployGuideTitle: 'Panduan Deploy ke Vercel',
    deployDesc: 'Aplikasi ini menggunakan Serverless Functions untuk konversi playlist & audio stream.',
    step1: '1. Tautkan Repositori ke Vercel',
    step1Desc: 'Gunakan menu Settings di Google AI Studio untuk menautkan repositori GitHub Anda atau download file ZIP proyek ini.',
    step2: '2. Import Proyek di Dashboard Vercel',
    step2Desc: 'Buka vercel.com/new, pilih repositori proyek ini. Vercel akan otomatis mendeteksi konfigurasi Vite + Serverless Express.',
    step3: '3. Konfigurasi Environment Variables (Opsional)',
    step3Desc: 'Tambahkan YOUTUBE_API_KEY di Vercel Settings jika kuota publik bawaan penuh.',
    step4: '4. Klik Deploy',
    step4Desc: 'Hanya butuh ~1 menit untuk mempublikasikan downloader audio playlist Anda secara online!',
    closeBtn: 'Tutup',

    // Footer
    footerRights: 'Dibuat untuk konversi & unduh audio YouTube efisiensi tinggi. Siap deploy di Vercel.'
  },
  en: {
    tabTitle: 'TubeAudio - YouTube Playlist & Audio Downloader',
    tabDownloading: 'Downloading',
    headerSub: 'YouTube Playlist Audio Downloader & Converter',
    formatLabel: 'Format',
    deployBtn: 'Deploy Vercel',

    heroBadge: 'Audio Format',
    heroBadgeSuffix: '• High Efficiency & Crystal Audio',
    heroTitlePrefix: 'Download YouTube Playlist to',
    heroTitleHighlight: 'Format',
    heroSubtitle1: 'Paste a YouTube playlist link or search query. Automatic audio conversion to',
    heroSubtitle2: 'format with studio quality and small file size.',
    inputPlaceholder: 'Paste YouTube Playlist / Video URL or search title...',
    btnSearch: 'Search & Load',
    btnLoading: 'Loading...',
    quickTry: 'Try Sample Playlists:',
    demoLofi: 'Lo-Fi Chill Beats',
    demoPop: 'Pop Hits 2026',

    // Playlist / Track view
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    selectedTracks: 'Selected Tracks',
    downloadSingle: 'Download 1 Track',
    downloadBatchZip: 'Download {count} Tracks (.ZIP {fmt})',
    preparingZip: 'Preparing Batch ZIP .{fmt}',

    // Track card
    duration: 'Duration',
    views: 'views',
    downloadTrack: 'Download this track',
    previewAudio: 'Preview audio',
    downloadingAudio: 'Downloading Audio...',

    // Audio Preview Modal
    instantPreview: 'Instant Preview',
    proxyStream: 'Proxy Stream',
    instantMode: 'Instant Mode',
    downloadAudio: 'Download Audio',
    playingFromProxy: 'Playing from Audio Proxy Server Stream...',

    // Settings Modal
    settingsTitle: 'Audio Format Settings',
    bitrateLabel: 'Audio Bitrate Quality',
    nativeQuality: 'Original YouTube Native (High Quality)',
    standardQuality: 'Standard Quality (Data Saver)',
    ecoQuality: 'Ultra Data Saver',
    formatExtLabel: 'Output File Extension (Audio Format)',
    fmtMp3Tag: 'Recommended (All Devices)',
    fmtM4aTag: 'Clean AAC (Apple / Android)',
    fmtOpusTag: 'High Efficiency Codec',
    fmtOggTag: 'Web Audio Format',
    fmtWebmTag: 'Web Container Format',
    namingPatternLabel: 'Output File Naming Pattern',
    includeLyricsLabel: 'Include Lyric File (.lrc)',
    saveClose: 'Save & Close',

    // Vercel Modal
    deployGuideTitle: 'Vercel Deployment Guide',
    deployDesc: 'This app uses Serverless Functions for playlist conversion & audio streaming.',
    step1: '1. Connect Repository to Vercel',
    step1Desc: 'Use Settings menu in Google AI Studio to link your GitHub repository or download the project ZIP.',
    step2: '2. Import Project in Vercel Dashboard',
    step2Desc: 'Go to vercel.com/new, select this project repo. Vercel automatically detects Vite + Serverless Express config.',
    step3: '3. Configure Environment Variables (Optional)',
    step3Desc: 'Add YOUTUBE_API_KEY in Vercel Settings if the default public API quota is exceeded.',
    step4: '4. Click Deploy',
    step4Desc: 'Takes only ~1 minute to publish your online playlist downloader!',
    closeBtn: 'Close',

    // Footer
    footerRights: 'Built for high efficiency YouTube audio conversion & downloads. Vercel deploy ready.'
  }
};
