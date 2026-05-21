#!/usr/bin/env node
/**
 * Matador Portfolio Forge
 * Generates a stunning GitHub README from your profile, repos, and config
 * Built for El Matador (Muhammad Aminu Musa) — Nightly Build
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKEN = process.argv.find(a => a.startsWith('--token='))?.split('=')[1]
  || process.env.GITHUB_TOKEN || '';

// ── CONFIG ────────────────────────────────────────────────────────────────
const CONFIG = {
  github: 'mamuaminu',
  name: 'Muhammad Aminu Musa',
  handle: 'El Matador',
  title: 'Full-Stack Developer & Security Engineer',
  location: 'Nigeria',
  email: 'muhammadaminumusa@gmail.com',
  twitter: '@el_matador_dev',
  linkedin: 'Muhammad Aminu Musa',
  skills: [
    'Node.js','Python','JavaScript','TypeScript','Express.js','FastAPI',
    'WhatsApp Bots','REST APIs','PM2','Docker','Linux','Git','GitHub',
    'Cybersecurity','Penetration Testing','ISC2 CC','Cisco Pentest',
    'Automation','Bot Development','Social Media Automation'
  ],
  projects: [
    { name: 'Hayaku Express', desc: 'WhatsApp delivery bot + rider app for logistics automation', url: 'https://github.com/mamuaminu/hayaku-express' },
    { name: 'PostForge AI', desc: 'Multi-platform social media scheduling & automation', url: 'https://github.com/mamuaminu/PostForge-AI' },
    { name: 'Hawkeye Intelligence', desc: 'Security platform for threat detection & hardening', url: 'https://github.com/mamuaminu/Hawkeye-Intelligence' },
    { name: 'NeuroCards', desc: 'Flashcard-based learning app for devs', url: 'https://github.com/mamuaminu/NeuroCards' },
  ],
  about: `Building tools that save time and scale operations. ISC2 CC & Cisco certified pentester. Currently exploring opportunities in backend engineering, DevOps, and security automation.`,
  funFact: '🚀 Launched Hayaku Express — a WhatsApp delivery bot serving real customers in Nigeria.'
};

// ── HTTP HELPERS ────────────────────────────────────────────────────────────
function gh(path, token = TOKEN) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: `/users/${path}`.replace(/^\/users\/+/, '/'),
      method: 'GET',
      headers: {
        'User-Agent': 'MatadorPortfolioForge/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    let d = '';
    https.get(opts, r => {
      r.on('data', c => d += c);
      r.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(null); } });
    }).on('error', reject);
  });
}

function ghRepos(user, token = TOKEN) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'api.github.com',
      path: `/users/${user}/repos?sort=updated&per_page=100`,
      method: 'GET',
      headers: {
        'User-Agent': 'MatadorPortfolioForge/1.0',
        'Accept': 'application/vnd.github.v3+json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };
    let d = '';
    https.get(opts, r => {
      r.on('data', c => d += c);
      r.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve([]); } });
    }).on('error', reject);
  });
}

// ── BADGE HELPERS ───────────────────────────────────────────────────────────
const BADGE = {
  green(s) { return `![${s}](https://img.shields.io/badge/${encodeURIComponent(s)}-${'2ea44f'-encodeURIComponent(s === 'Success' ? '2ea44f' : 'green')}?style=for-the-badge)`; },
  stat(label, value, color = 'blue') { return `![GitHub ${label}](https://img.shields.io/github/${label.replace(/ /g, '-').toLowerCase()}/${CONFIG.github}?style=for-the-badge&label=${encodeURIComponent(value)}&color=${color})`; }
};

function badge(name, value, color = '2ea44f') {
  return `![${name}](https://img.shields.io/badge/${encodeURIComponent(name)}-${encodeURIComponent(value)}-${color}?style=for-the-badge)`;
}

// ── GENERATE README ─────────────────────────────────────────────────────────
function generate(stats, repos) {
  const stars = repos.reduce((a, r) => a + r.stargazers_count, 0);
  const forks = repos.reduce((a, r) => a + (r.forks_count || 0), 0);
  const langs = [...new Set(repos.filter(r => r.language).map(r => r.language))];
  const pubRepos = repos.filter(r => !r.private).length;

  return `#${' '} <kbd>${CONFIG.name}</kbd>

<p align="center">
  <a href="https://github.com/${CONFIG.github}">
    <img src="https://github-readme-stats.vercel.app/api?username=${CONFIG.github}&theme=shadow_blue&show_icons=true&count_private=true&hide_rank=true" alt="stats" height="160"/>
    <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${CONFIG.github}&theme=shadow_blue&layout=compact" alt="languages" height="160"/>
  </a>
</p>

<p align="center">
  ${BADGE.stat('Followers', (stats.followers || 0).toString())}
  ${BADGE.stat('Stars', stars.toString())}
  ${BADGE.stat('Forks', forks.toString())}
  ${BADGE.stat('Repositories', pubRepos.toString(), 'purple')}
</p>

---

${['🇳🇬', '💻', '🔐', '🚀'].map((e,i) => `<kbd>${e}</kbd>`).join(' ')} **${CONFIG.title}** · ${CONFIG.location}

> *${CONFIG.about}*

**${CONFIG.funFact}**

---

## 🛠️ Tech Stack

${CONFIG.skills.map((s, i) => `<kbd>${s}</kbd>`).join(' ')}

---

## 📦 Projects

| Project | Description | Link |
|---------|-------------|------|
${CONFIG.projects.map(p => `| **${p.name}** | ${p.desc} | [🔗 View](${p.url}) |`).join('\n')}

---

## 📊 GitHub Activity

<p align="center">
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${CONFIG.github}&theme=shadow_blue" alt="streak"/>
</p>

---

## 🔗 Connect

${CONFIG.email ? `📧 [Email](mailto:${CONFIG.email})` : ''} ${CONFIG.twitter ? `· 🐦 [${CONFIG.twitter}](https://twitter.com/${CONFIG.twitter.replace('@', '')})` : ''} ${CONFIG.linkedin ? `· 💼 [LinkedIn](https://linkedin.com/in/${CONFIG.linkedin})` : ''}

---

<p align="center">
  <img src="https://img.shields.io/badge/Built%20by-El%20Matador%20🚀-shadow_blue?style=for-the-badge" alt="built"/>
  <img src="https://img.shields.io/badge/ISC2%20CC-Certified-2ea44f?style=for-the-badge" alt="cert"/>
  <img src="https://img.shields.io/badge/Cisco-Pentest%20Certified-2ea44f?style=for-the-badge" alt="pentest"/>
</p>
`;
}

// ── EXEC ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🔨 Matador Portfolio Forge — building your README...\n');

  mkdirSync(__dirname, { recursive: true });

  const [stats, repos] = await Promise.all([
    gh(CONFIG.github),
    ghRepos(CONFIG.github)
  ]);

  const readme = generate(stats, repos);
  const outPath = join(__dirname, 'generated-portfolio-README.md');

  writeFileSync(outPath, readme, 'utf8');
  console.log(`✅ Generated: ${outPath}`);
  console.log(`📊 Stats: ${stats?.followers || '?'} followers · ${repos.length} repos`);
  console.log(`⭐ Total stars: ${repos.reduce((a,r) => a + r.stargazers_count, 0)}`);
  console.log(`\n📄 Preview of generated README:\n`);
  console.log(readme.slice(0, 1500));
  console.log('\n...');
}

main().catch(e => { console.error('❌', e.message); process.exit(1); });