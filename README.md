# TubeAudio - YouTube Playlist Audio Downloader & Converter API

[![Deployment Status](https://img.shields.io/badge/Vercel-Serverless%20Ready-black?style=flat-square&logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)

> **Short Description (GitHub Tagline):**  
> *A high-performance YouTube playlist & video audio downloader/converter backend built with Node.js, Express, and TypeScript. Supports multi-format audio extraction (.mp3, .m4a, .opus, .ogg, .webm) with automated serverless proxy streaming and multi-mirror fallbacks.*

---

## 🌟 Key Features

- **Multi-Format Extraction:** Seamlessly converts and extracts YouTube audio into **MP3**, **M4A (AAC)**, **Opus**, **Ogg**, and **WebM** formats.
- **Playlist & Single Video Parsing:** Handles full YouTube playlist URLs (`list=PL...`), short URLs (`youtu.be`), and keyword search queries.
- **Multi-Instance Resilience & Failover Engine:**
  1. **Tier 1:** Direct YouTube Web Scraping (`ytInitialData` renderer parsing).
  2. **Tier 2:** Invidious Public API Instance Rotation.
  3. **Tier 3:** Piped API Federation.
  4. **Tier 4:** Cobalt / Media Proxy Engine.
  5. **Tier 5:** Built-in Synthetic OGG/Opus Binary Fallback Streamer.
- **Direct Audio Proxy Streaming:** Features `/api/proxy-audio` with chunked array buffer streaming, proper MIME type headers, and `Content-Disposition` attachment headers for instant browser downloads.
- **Vercel Serverless & Docker Ready:** Pre-configured with CORS middleware, Express routing, and `vercel.json` for serverless edge deployment.

---

## 🛠️ Tech Stack

- **Runtime & Language:** Node.js (v18+), TypeScript
- **Framework:** Express.js
- **Frontend App:** React 18, Vite, Tailwind CSS, Lucide Icons
- **Deployment Platform:** Vercel Serverless Functions / Cloud Run / Node.js

---

## 🚀 API Endpoints Documentation

### 1. Health Check
Checks backend operational status and active runtime environment.
- **Endpoint:** `GET /api/health`
- **Response:**
  ```json
  {
    "status": "ok",
    "timestamp": "2026-08-12T02:00:00.000Z",
    "environment": "Vercel Serverless"
  }
  ```

---

### 2. Fetch Playlist / Video Metadata
Extracts playlist details and track lists from YouTube URL or Playlist ID.
- **Endpoint:** `GET /api/playlist?url=<YOUTUBE_URL_OR_ID>` or `GET /api/playlist?id=<PLAYLIST_ID>`
- **Example:** `/api/playlist?id=PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj`
- **Response:**
  ```json
  {
    "id": "PLMC9KNkIncKtPzgY-5rmhvj7fewJS2xoj",
    "title": "Top Pop Hits & Trending Music",
    "author": "YouTube Music",
    "trackCount": 50,
    "tracks": [
      {
        "id": "kJQP7kiw5Fk",
        "title": "Despacito",
        "channel": "Luis Fonsi",
        "duration": 228,
        "durationFormatted": "3:48",
        "thumbnail": "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
        "index": 1
      }
    ]
  }
  ```

---

### 3. Search Playlists
Searches YouTube playlists based on a text query.
- **Endpoint:** `GET /api/search?q=<QUERY>`
- **Example:** `/api/search?q=lofi+beats`
- **Response:**
  ```json
  {
    "query": "lofi beats",
    "results": [
      {
        "id": "PLw-VjHDlEOgvtnnnqWlTqByAtC7tXBg6D",
        "title": "Lofi Hip Hop Radio - Beats to Relax/Study to",
        "author": "Lofi Girl",
        "trackCount": 100,
        "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg"
      }
    ]
  }
  ```

---

### 4. Direct Audio Proxy Stream & Download
Streams and downloads audio files with specified container format (`mp3`, `m4a`, `opus`, `ogg`, `webm`).
- **Endpoint:** `GET /api/proxy-audio?v=<VIDEO_ID>&title=<TITLE>&ext=<FORMAT>`
- **Parameters:**
  - `v` *(required)*: YouTube Video ID.
  - `title` *(optional)*: File title for attachment filename.
  - `artist` *(optional)*: Artist / channel name.
  - `ext` / `format` *(optional)*: `mp3` | `m4a` | `opus` | `ogg` | `webm` (Default: `mp3`).
- **Headers Returned:**
  - `Content-Type: audio/mpeg` (or `audio/mp4`, `audio/ogg`, `audio/webm`)
  - `Content-Disposition: attachment; filename="Song_Title.mp3"`

---

## 💻 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/tube-audio-downloader.git
   cd tube-audio-downloader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:3000`.

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 📦 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. Vercel will automatically detect the `vercel.json` and build settings.
4. Click **Deploy**!

---

## 📄 License

This project is licensed under the MIT License.
