<template>
  <div class="landing">
    <!-- HERO / HEADER -->
    <header class="hero">
      <div class="roulette-bg" aria-hidden="true"></div>
      <div class="hero-inner">
        <h1 class="title" aria-label="FinalDeal">
          <span class="slot" v-for="(ch, i) in titleChars" :key="i" :style="{animationDelay: `${i * 80}ms`}" >{{ ch }}</span>
        </h1>
        <p class="subtitle">
          Iskolai csapatunk a <strong>Békéscsabai Garabonciás napok</strong> versenyén - elegáns kaszinóhangulat, fegyelmezett szervezés, barátságos stáb.
        
        </p>
        <button class="cta" @click="scrollTo('#intro')">Belépés a lobbyba</button>
      </div>
    </header>

    <!-- INTRO -->
    <section id="intro" class="intro section">
      <div class="intro-text card">
        <h2 class="section-title">Bemutatkozás</h2>
        <p>
          A <strong>FinalDeal</strong> stáb a Trefort közösség lelkes tagjaiból áll. Célunk, hogy a Garabonciás napokon
          egy látványos, mégis közvetlen kaszinó-lobby élménnyel fogadjuk a látogatókat.
        </p>
      </div>
    
      <!-- Stábfotó külön, bemutatkozás alatt -->
      <figure class="intro-photo card">
        <img :src="assets.teamPhoto" alt="FinalDeal staff photo placeholder" />
        <figcaption><strong>Stábfotó</strong> - Burda Áron</figcaption>
      </figure>
    </section>

    <!-- STAFF PRESENTATION -->
    <section class="staff section">
      <h2 class="section-title">Vezetőség</h2>

      <!-- Candidate Featured Card -->
      <!-- Candidate -->
      <div class="candidate card" @click="openBio(candidate)">
        <img :src="candidate.image" :alt="`Candidate ${candidate.name}`" />
        <div class="info">
          <h3 class="name">{{ candidate.name }}</h3>
          <p class="role">Jelölt</p>
        </div>
      </div>

      <!-- Managers -->
      <div class="managers">
        <div v-for="m in managers" :key="m.name" class="manager card" @click="openBio(m)">
          <img :src="m.image" :alt="`Manager ${m.name}`" />
          <div class="info">
            <h3 class="name">{{ m.name }}</h3>
            <p class="role">Kampányfőnök</p>
          </div>
        </div>
      </div>

    </section>

    <!-- STATISTICS / DASHBOARD -->
    <section class="stats section">
      <h2 class="section-title">Statisztika <span class="en">/ Stats</span></h2>

      <!-- Mobile carousel -->
      <div class="stats-carousel">
        <article class="stat card" v-for="(item, key) in statList" :key="key">
          <div class="icon" v-html="item.icon" aria-hidden="true" />
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ animated[key] }}</div>
        </article>
      </div>

      <!-- Desktop grid -->
      <div class="stats-grid">
        <article class="stat card" v-for="(item, key) in statList" :key="key">
          <div class="icon" v-html="item.icon" aria-hidden="true" />
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ animated[key] }}</div>
        </article>
      </div>
    </section>

    <!-- EXTRA: Ambient roulette / slot strip decoration at bottom -->
    <div class="ambient">
      <div class="slot-strip" aria-hidden="true">
        <span>🍒</span><span>7</span><span>🍋</span><span>⭐</span><span>💎</span>
        <span>🍒</span><span>7</span><span>🍋</span><span>⭐</span><span>💎</span>
      </div>
    </div>
  </div>
  <transition name="fade">
  <div v-if="activeBio" class="bio-modal" @click.self="closeBio">
    <div class="bio-content card">
      <div class="bio-text">
        <h3 class="bio-name">{{ activeBio.name }}</h3>
        <p class="bio-blurb">{{ activeBio.blurb || 'No description yet.' }}</p>
      </div>
      <div class="bio-image">
        <img :src="activeBio.image" :alt="activeBio.name" />
      </div>
    </div>
  </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
definePageMeta({
    layout: 'main'
})
const titleChars = Array.from('FinalDeal')


const activeBio = ref<null | { name: string, blurb: string, image: string }>(null)

function openBio(member: any) {
  activeBio.value = member
}
function closeBio() {
  activeBio.value = null
}

// Dummy data
const assets = reactive({
  teamPhoto: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop',
})

const candidate = reactive({
  name: 'Madai István Richárd',
  image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop',
})

const managers = reactive([
  {
    name: 'Varga Máté',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=1000&auto=format&fit=crop',
    suit: 'spade',
    blurb: 'Logisztika és ütemezés mester – minden a helyén.',
  },
  {
    name: 'Rafael Nóra',
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop',
    suit: 'heart',
    blurb: 'Kommunikáció, szponzorok, jó hangulat – mindig mosolyog.',
  },
  {
    name: 'Petrás Áron Richárd',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
    suit: 'diamond',
    blurb: 'Technika és színpad – tiszta hang, tiszta kép.',
  },
])

// Stats
const stats = reactive({
  sponsors: 10,
  staff: 25,
  income: 1200000,
  expenses: 80000,
  balance: 40000,
})

// Icons as inline SVG for a casino vibe
const statList = reactive({
  sponsors: { label: 'Szponzorok / Sponsors', icon: `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18"/>
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" font-size="10" fill="currentColor">FD</text>
    </svg>` },
  staff: { label: 'Stáb / Staff', icon: `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="currentColor"/>
    </svg>` },
  income: { label: 'Bevétel / Income', icon: `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2"/>
      <text x="12" y="14" text-anchor="middle" font-size="10" fill="currentColor">$</text>
    </svg>` },
  expenses: { label: 'Kiadás / Expenses', icon: `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M19 7l-7 10-4-4-3 3" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="19" cy="7" r="2" fill="currentColor"/>
    </svg>` },
  balance: { label: 'Egyenleg / Balance', icon: `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 12h18" stroke="currentColor" stroke-width="2"/>
      <circle cx="8" cy="12" r="3" fill="currentColor"/>
      <circle cx="16" cy="12" r="3" fill="currentColor" opacity="0.35"/>
    </svg>` },
})

// Animated counters when in view
const animated = reactive({
  sponsors: 0,
  staff: 0,
  income: 0,
  expenses: 0,
  balance: 0,
})

const hasAnimated = ref(false)

function animateNumbers() {
  if (hasAnimated.value) return
  hasAnimated.value = true

  const duration = 1600
  const start = performance.now()

  const from = { ...animated }
  const to = { ...stats }

  const step = (t: number) => {
    const p = Math.min(1, (t - start) / duration)
    const ease = 1 - Math.pow(1 - p, 3)
    ;(Object.keys(animated) as Array<keyof typeof animated>).forEach((k) => {
      const target = (to as any)[k]
      const base = (from as any)[k]
      ;(animated as any)[k] = Math.round(base + (target - base) * ease)
    })
    if (p < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

function observeStats() {
  const el = document.querySelector('.stats')
  if (!el) return
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateNumbers()
        io.disconnect()
      }
    })
  }, { threshold: 0.25 })
  io.observe(el)
}

function scrollTo(hash: string) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  observeStats()
})
</script>

<style scoped>
/* THEME */
:root {
  --fd-red: #8B0000;            /* dark red */
  --fd-red-2: #a40c14;
  --fd-gold: #d4af37;
  --fd-green: #0c3b2e;
  --fd-black: #0b0b0b;
  --fd-white: #f7f7f7;
}

.landing {
  width: 90vw;
  display: flex;
  flex-direction: column;
  gap: 48px;
  color: var(--text-primary-color, #fff);
}

.section { 
  padding: 24px 20px; 
  width: 90%; 
  max-width: 1200px; 
  margin: 0 auto; 
}
.section-title { font-size: clamp(1.25rem, 1.2rem + 1.2vw, 2rem); letter-spacing: 0.5px; text-shadow: 0 0 20px rgba(212,175,55,.15); }
.section .card { background: linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02)); border: 1px solid rgba(164,12,20,.35); backdrop-filter: blur(6px); border-radius: 18px; box-shadow: 0 10px 30px rgba(0,0,0,.35); }

/* HERO */
.hero { position: relative; width: 100%; min-height: 72vh; display: grid; place-items: center; overflow: hidden; }
.hero::before {
  content: "";
  position: absolute;
  inset: -30%;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.3) -40%, transparent 20%);
  filter: blur(30px);
  z-index: 0;
  pointer-events: none; /* ensures it doesn't block interaction */
}
.hero-inner { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 20px; text-align: center; }

.title { display: inline-flex; gap: 2px; font-size: clamp(2.2rem, 2rem + 3vw, 5rem); font-weight: 800; letter-spacing: 1px; color: var(--fd-gold); text-shadow: 0 0 10px rgba(212,175,55,.4), 0 0 30px rgba(164,12,20,.35); }
.title .slot { display: inline-block; transform-origin: 50% 80%; animation: slotFlip 900ms cubic-bezier(.2,.6,.15,1.1) both; }
@keyframes slotFlip { 0% { transform: rotateX(90deg); opacity: 0; filter: blur(4px); } 60% { transform: rotateX(-10deg); opacity: 1; filter: blur(0); } 100% { transform: rotateX(0deg); }
}
.subtitle { max-width: 800px; color: var(--text-secondary-color, #f0e9dc); opacity: .95; }

.cta { margin-top: 6px; padding: 10px 18px; border: 1px solid var(--fd-gold); background: linear-gradient(180deg, rgba(212,175,55,.15), rgba(212,175,55,.08)); color: var(--fd-gold); border-radius: 999px; font-weight: 700; letter-spacing: .4px; box-shadow: 0 8px 18px rgba(0,0,0,.35), inset 0 0 14px rgba(212,175,55,.18); cursor: pointer; transition: transform .15s ease, box-shadow .15s ease; }
.cta:hover { transform: translateY(-1px); box-shadow: 0 12px 26px rgba(0,0,0,.45), inset 0 0 18px rgba(212,175,55,.24); }

/* Spinning roulette background */
.roulette-bg { position: absolute; width: 90vmin; height: 90vmin; border-radius: 50%; background: conic-gradient(from 0deg, #1e1e1e 0 10%, #0c0c0c 10% 20%, var(--fd-red) 20% 30%, #0c3b2e 30% 40%, #111 40% 50%, var(--fd-red-2) 50% 60%, #0c3b2e 60% 70%, #111 70% 80%, #1e1e1e 80% 90%, #0c0c0c 90% 100%); filter: blur(10px) saturate(1.2) opacity(.35); animation: spin 40s linear infinite; z-index: 0; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* INTRO */
.intro-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 18px; }
.intro-text {
  max-width: 650px;       /* kisebb szélesség */
  margin: 0 auto;         /* középre */
  padding: 24px 20px;     /* szellősebb */
  line-height: 1.7;       /* olvashatóbb */
  font-size: clamp(1rem, 1rem + 0.5vw, 1.15rem);
  text-align: center;
}
.intro-photo {
  width: 100%;         /* majdnem a teljes szélesség */
  max-width: 1200px;
  height: auto;        /* arányos magasság */
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
  margin: 24px auto 0; /* középre és a szöveg alá */
}

.intro-photo img {
  width: 100%;
  height: auto;
  object-fit: contain;
  object-position: center center;
  display: block;
}

.intro-photo figcaption {
  text-align: center;
  padding: 8px 10px 12px;
  font-size: .9rem;
  opacity: .9;
  color: var(--text-secondary-color, #eaeaea);
}
/* STAFF */
.staff { display: grid; gap: 18px; }
.candidate { display: grid; grid-template-columns: 1fr; padding: 0; }
.candidate img { width: 100%; height: 320px; object-fit: cover; display: block; }
.manager img { width: 100%; height: 220px; object-fit: scale-down ; display: block; }
.managers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.candidate img,
.manager img {
  width: 100%;
  height: 240px;           /* egységes magasság */
  object-fit: contain;       /* mindig kitölti szépen */
  border-radius: 14px 14px 0 0; /* lekerekítés felül */
  display: block;

}

/* Flip cards */
.flip { perspective: 1200px; }
.flip-inner { position: relative; transform-style: preserve-3d; transition: transform .7s cubic-bezier(.2,.8,.2,1); border-radius: 18px; overflow: hidden; }
.flip:focus .flip-inner, .flip:hover .flip-inner { transform: rotateY(180deg); }
.flip-front, .flip-back { position: relative; backface-visibility: hidden; }
.flip-front .info, .manager .info { padding: 12px 14px; }
.flip-back { position: absolute; inset: 0; display: grid; place-items: center; padding: 18px; transform: rotateY(180deg); background: radial-gradient(120% 80% at 50% 30%, rgba(212,175,55,.16), rgba(0,0,0,.6)); }

.name { margin: 0; font-size: 1.2rem; }
.role { margin: 4px 0 0; opacity: .9; }
.chip { width: 72px; height: 72px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: var(--fd-red); background: radial-gradient(circle at 30% 30%, #fff 0 28%, #e8e8e8 29% 60%, #c0c0c0 61% 100%); border: 5px solid #b80000; box-shadow: inset 0 0 12px rgba(0,0,0,.25), 0 6px 16px rgba(0,0,0,.45); }
.suit { font-size: 56px; line-height: 1; color: var(--fd-gold); text-shadow: 0 0 15px rgba(212,175,55,.35); }
.suit[data-suit="heart"] { color: #ff4d4d; }
.suit[data-suit="diamond"] { color: #ff6b6b; }
.suit[data-suit="spade"] { color: #b0b6ff; }

/* STATS */
.stats { display: grid; gap: 12px; }
.stats-carousel { display: grid; grid-auto-flow: column; grid-auto-columns: 80%; gap: 12px; overflow-x: auto; scroll-snap-type: x mandatory; padding-bottom: 6px; }
.stats-carousel .stat { scroll-snap-align: start; }
.stats-grid { display: none; grid-template-columns: repeat(5, 1fr); gap: 12px; }
.stat { padding: 14px; display: grid; place-items: center; gap: 8px; text-align: center; }
.stat .icon { font-size: 24px; color: var(--fd-gold); }
.stat .label { font-size: .95rem; opacity: .9; }
.stat .value { font-size: 2rem; font-weight: 800; letter-spacing: 1px; color: var(--fd-white); text-shadow: 0 0 10px rgba(255,255,255,.12); }

/* AMBIENT */
.ambient { position: relative; width: 100%; display: grid; place-items: center; overflow: hidden; }
.slot-strip { display: inline-flex; gap: 24px; font-size: 28px; opacity: .65; filter: drop-shadow(0 6px 12px rgba(0,0,0,.4)); animation: slideX 16s linear infinite; }
@keyframes slideX { from { transform: translateX(210%); } to { transform: translateX(-210%); } }

/* RESPONSIVE */
@media (min-width: 740px) {
  .section { padding: 28px 24px; }
  .intro-grid { grid-template-columns: 1.1fr .9fr; }
  .managers { grid-template-columns: repeat(3, 1fr); }
  .stats-carousel { display: none; }
  .stats-grid { display: grid; }
}

.intro section {
  width: 90vw;
}

/* Make sure it blends with the provided layout */
.landing { background: var(--background-trietary-color, #1a0f0f); }
.en { opacity: .85; font-style: italic; }

/* === MOBILE FIRST IMPROVEMENTS === */
@media (max-width: 739px) {
  .intro-grid {
    grid-template-columns: 1fr; /* stack intro text + photo */
  }
  .managers {
    grid-template-columns: 1fr; /* show managers one by one */
  }
  .cta {
    width: 100%;
    max-width: 280px;
    font-size: 1rem;
    padding: 14px 20px;
  }
  .slot-strip {
    font-size: 22px;
    gap: 16px;
  }
}

/* === IMAGE INTERACTIONS === */
.card img {
  transition: transform 0.35s ease, filter 0.35s ease, box-shadow 0.35s ease;
  will-change: transform, filter;
}
.card:active img {
  transform: scale(0.97) translateY(2px);
  filter: brightness(0.95);
}

/* Arrow overlay on mobile */
.card:not(.bio-image)::after {
  content: "⬇";
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  opacity: 0;
  color: var(--fd-gold);
  text-shadow: 0 0 6px rgba(0,0,0,.6);
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

@media (max-width: 739px) {
  .card {
    position: relative;
  }
  .card:not(.bio-image)::after {
    position: relative;
    width: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    opacity: 0.85; /* always visible on mobile */
    animation: bounceArrow 1.8s infinite;
  }
}

@keyframes bounceArrow {
  0%, 100% { transform: translate(-50%, 0); }
  50% { transform: translate(-50%, 6px); }
}

/* === FRIENDLIER TEXT + TAPPABLE AREAS === */
.section-title {
  text-align: center;
}
.stat {
  min-height: 120px;
  border-radius: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.stat:active {
  transform: scale(0.97);
  box-shadow: 0 6px 14px rgba(0,0,0,.5);
}

.bio-modal {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.7);
  display: grid; place-items: center;
  z-index: 999;
}
.bio-content {
  max-width: 420px;
  padding: 20px;
  text-align: center;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}


/* STAFF GRID */
.staff {
  display: grid;
  gap: 20px;
}

.managers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.candidate,
.manager {
  background: linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid rgba(212,175,55,.25);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  transition: transform .25s ease, box-shadow .25s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

@media screen and (min-width:900px) {
  .candidate {
    max-width: 25vw;
    align-self: center;
    justify-self: center;
  }
}

@media screen and (min-width:800px) {
  .candidate {
    max-width: 40vw;
    align-self: center;
    justify-self: center;
  }
}

@media screen and (min-width:600px) {
  .candidate {
    max-width: 45vw;
    align-self: center;
    justify-self: center;
  }
}

.candidate:hover,
.manager:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,.45);
}

.candidate .info,
.manager .info {
  padding: 12px 14px;
  text-align: center;
}

.bio-content img {
  width: auto;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
}

.bio-modal {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.95) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
  height: auto;
}

.bio-content {
  display: flex;
  flex-direction: row;
  max-width: 800px;
  width: 90%;
  background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(0,0,0,0.1));
  border: 2px solid rgba(212,175,55,0.6);
  border-radius: 18px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.7);
  overflow: hidden;
  backdrop-filter: blur(6px);
  transition: transform 0.3s ease;
}

/* Left side (text) */
.bio-text {
  flex: 1;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--fd-white);
  text-shadow: 0 0 6px rgba(0,0,0,0.5);
}

.bio-name {
  font-size: clamp(1.6rem, 1.5rem + 1vw, 2.2rem);
  font-weight: 800;
  color: var(--fd-gold);
  margin-bottom: 12px;
  text-shadow: 2px 2px black;
  color: #c0c0c0;
}

.bio-blurb {
  font-size: clamp(1rem, 1rem + 0.5vw, 1.2rem);
  line-height: 1.6;
  opacity: 0.9;
  font-style: italic;
  color: #f7f7f7;
}

/* Right side (image) */
.bio-image img {
  height: 100%;        /* fill the card height */
  width: auto;         /* width scales proportionally */
  max-width: 100%;     /* never exceed container width */
  object-fit: contain; /* keep aspect ratio */
  border-radius: 0 18px 18px 0;
  box-shadow: inset 0 0 12px rgba(0,0,0,0.4), 0 6px 24px rgba(0,0,0,0.5);
  transition: transform 0.3s ease;
}

.bio-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  border-radius: 0 18px 18px 0;
  background: radial-gradient(circle at center, rgba(139,0,0,0.3), rgba(0,0,0,0.7));
  background-blend-mode: overlay;
  overflow: hidden;
}

.bio-image img:hover {
  transform: scale(1.0);
}


/* Mobile fallback: stack cards */
@media (max-width: 739px) {
  .bio-content {
    flex-direction: column;
  }
  .bio-image img {
    border-radius: 0 0 18px 18px;
    max-height: 70vh;
  }
}

/* Main page cards */
.candidate,
.manager {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid rgba(212,175,55,.25);
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  max-height: 420px;       /* limit overall card height */
}

/* Image container */
.candidate img,
.manager img {
  width: 100%;
  height: auto;            /* height adjusts naturally */
  object-fit: cover;
  object-position: center top;
  border-radius: 14px 14px 0 0;
  display: block;
}

/* Info section */
.candidate .info,
.manager .info {
  padding: 12px 14px;
  text-align: center;
  flex: 1;                 /* take remaining space */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Mobile adjustments */
@media (max-width: 739px) {
  .candidate,
  .manager {
    max-height: 320px;
  }
  .candidate img,
  .manager img {
    object-fit: cover;
  }
}

.candidate img,
.manager img {
  width: 100%;        /* always fit card width */
  height: auto;       /* scale height automatically */
  object-fit: contain; /* keep full image visible */
  object-position: top center;
  border-radius: 14px 14px 0 0;
  display: block;
}

/* Limit card height without cutting image */
.candidate,
.manager {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  border: 1px solid rgba(212,175,55,.25);
  box-shadow: 0 8px 20px rgba(0,0,0,.35);
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  max-height: none; /* remove strict height limit */
}

/* Info section */
.candidate .info,
.manager .info {
  padding: 12px 14px;
  text-align: center;
}

</style>
