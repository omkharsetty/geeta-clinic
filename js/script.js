// ===== Mobile menu =====
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
menuBtn?.addEventListener('click', () => nav.classList.toggle('open'));
nav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// ===== Header scroll state =====
const header = document.getElementById('header');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Language toggle =====
const langBtns = document.querySelectorAll('.lang-btn');
const applyLang = (lang) => {
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute(`data-${lang}`);
    if (val) el.innerHTML = val;
  });
  document.body.classList.toggle('lang-te', lang === 'te');
  document.documentElement.lang = lang === 'te' ? 'te' : 'en';
  langBtns.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('clinic-lang', lang); } catch(e) {}
  renderTimings();
  updateLiveStatus();
};
langBtns.forEach(btn => btn.addEventListener('click', () => applyLang(btn.dataset.lang)));
try {
  const saved = localStorage.getItem('clinic-lang');
  if (saved === 'te') applyLang('te');
} catch(e) {}

// ===== Timings schedule =====
const schedule = [
  { en: 'Sun', te: 'ఆది', closed: true },
  { en: 'Mon', te: 'సోమ' },
  { en: 'Tue', te: 'మంగ' },
  { en: 'Wed', te: 'బుధ' },
  { en: 'Thu', te: 'గురు' },
  { en: 'Fri', te: 'శుక్ర' },
  { en: 'Sat', te: 'శని' }
];
const todayIdx = new Date().getDay();

function renderTimings() {
  const host = document.getElementById('timingsDays');
  if (!host) return;
  const lang = document.body.classList.contains('lang-te') ? 'te' : 'en';
  const closedText = lang === 'te' ? 'మూసివేయబడింది' : 'Closed';
  host.innerHTML = schedule.map((d, i) => `
    <div class="day-card ${i === todayIdx ? 'today' : ''} ${d.closed ? 'closed' : ''}">
      <div class="day-name">${d[lang]}</div>
      <div class="day-times">
        ${d.closed ? `<span>${closedText}</span>` : `<span>9:00 – 2:00</span><span>6:00 – 8:00</span>`}
      </div>
    </div>
  `).join('');
}
renderTimings();

// ===== Live open / closed status =====
function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const min = now.getMinutes();
  const t = hour + min / 60;
  if (day === 0) return false; // Sunday
  const morning = t >= 9 && t < 14;
  const evening = t >= 18 && t < 20;
  return morning || evening;
}
function updateLiveStatus() {
  const open = isOpenNow();
  const lang = document.body.classList.contains('lang-te') ? 'te' : 'en';
  const labels = {
    en: { open: '🟢 Open Now', closed: '🔴 Closed' },
    te: { open: '🟢 తెరిచి ఉంది', closed: '🔴 మూసివేయబడింది' }
  };
  const ls = document.getElementById('liveStatus');
  if (ls) {
    ls.textContent = open ? labels[lang].open : labels[lang].closed;
    ls.className = 'top-item hide-mobile ' + (open ? 'open' : 'closed');
  }
  const os = document.getElementById('openStatus');
  if (os) {
    const shortLabels = {
      en: { open: 'Open Now', closed: 'Closed Now' },
      te: { open: 'తెరిచి ఉంది', closed: 'మూసివేయబడింది' }
    };
    os.textContent = open ? shortLabels[lang].open : shortLabels[lang].closed;
    os.className = open ? 'fc-val open' : 'fc-val closed';
  }
}
updateLiveStatus();
setInterval(updateLiveStatus, 60000);

// ===== Scroll reveal =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Stagger service cards
document.querySelectorAll('.services-grid .service-card, .why-grid .why-card, .contact-grid .contact-card, .faq-list .faq-item')
  .forEach((el, i) => { el.style.transitionDelay = `${Math.min(i * 80, 400)}ms`; });
