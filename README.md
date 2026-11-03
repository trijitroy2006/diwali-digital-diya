# 🪔 Diwali Digital Diya – Festive Greeting Website

A responsive, interactive, and personalized Diwali greeting web application built with modern web technologies.

🌐 **Live Website Link:** [https://trijitroy2006.github.io/diwali-digital-diya/](https://trijitroy2006.github.io/diwali-digital-diya/)

---

## ✨ Features & Highlights

- **Live Burning Firecracker Zone (Real Photography & Simulation):**
  - Real photography cards for Sparkler (Phuljhadi), Anar (Flowerpot), Ground Chakra, Sky Rocket, Sky Lanterns, and 1000-Wala Ladi.
  - Interactive live burning simulation: clicking any card sets it on fire in real-time with flame pulses, high-speed spin physics, glowing embers, and synchronized crackling audio!
- **Interactive Sacred Diya (Physics & Flame Aura):**
  - Custom SVG clay diya with multi-layered glowing flames.
  - Interactive tap-to-rekindle action that casts blessings, increments the global lamp tally, and sparks festive particles.
- **Panch-Diya (5 Holy Lamps) Lighting Row:**
  - Light 5 sacred diyas for Prosperity, Wisdom, Courage, Peace, and Health.
- **Interactive Rangoli Drawing Studio:**
  - Live 8-fold symmetric canvas to draw festive Rangolis with colored powder swatches and auto-mandala generator.
- **Traditional Instrumental Sitar & Audio Synthesizer:**
  - High-quality recorded instrumental Sitar loop with fallback to procedural Web Audio synthesizer (*Raag Yaman / Bhairav*).
- **Personalized Greeting Generator & Shareable Links:**
  - Custom recipient name, heartfelt blessing, and sender signature.
  - Instant WhatsApp sharing, URL hash sharing, and PNG image card downloader.
- **4 Royal Color Themes:**
  - Crimson, Midnight Navy, Imperial Gold, and Festive Emerald.

---

## ☁️ Cloud Deployment Guide (AWS & Google Tools)

### 1. Deploy on AWS Amplify Hosting (Recommended for Bonus Points)
1. Fork or push this repository to your GitHub account.
2. Sign in to the **AWS Management Console** and open **AWS Amplify Hosting**.
3. Select **Deploy an App** > **GitHub** and connect your repository.
4. Set the branch as `main` (Amplify will auto-detect the root directory containing `index.html`).
5. Click **Save and Deploy**. Your site will be globally distributed with AWS CloudFront CDN and SSL enabled in under 2 minutes!

### 2. Deploy on AWS S3 + CloudFront
1. Create an Amazon S3 bucket (e.g. `diwali-digital-diya-2026`).
2. Enable **Static Website Hosting** under the Bucket Properties tab.
3. Upload `index.html`, `style.css`, and `script.js`.
4. (Optional) Create an Amazon CloudFront distribution pointing to your S3 bucket for low-latency worldwide distribution.

### 3. Deploy via Google Cloud (Firebase Hosting)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 4. Deploy via GitHub Pages
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment** > Source, choose `Deploy from a branch`.
3. Select `main` branch and `/ (root)` folder.
4. Save and your greeting site will be live instantly!

---

## ✨ Technology Stack
- **HTML5 & SVG:** Semantic markup and scalable vector illustration.
- **CSS3 Modern Layouts:** CSS Grid, Flexbox, custom animations, and glassmorphic UI.
- **Vanilla JavaScript (ES6+):** Lightweight, zero heavy framework overhead.
- **Web Audio API:** Real-time audio oscillator and gain nodes.
- **HTML5 Canvas:** 60fps firework particle simulation.

---
*May this festival of lights illuminate your life with joy, wisdom, and success! Happy Diwali!* 🪔✨
