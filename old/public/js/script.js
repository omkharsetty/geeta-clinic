const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const header = document.getElementById("header");

menuBtn?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 12);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const schedule = [
  { day: "Sun", closed: true },
  { day: "Mon" },
  { day: "Tue" },
  { day: "Wed" },
  { day: "Thu" },
  { day: "Fri" },
  { day: "Sat" },
];

function renderTimings() {
  const host = document.getElementById("timingsDays");
  if (!host) return;

  const today = new Date().getDay();
  host.innerHTML = schedule
    .map((entry, idx) => {
      const timings = entry.closed
        ? "<span>Closed</span>"
        : "<span>9:00 AM - 2:00 PM</span><span>6:00 PM - 8:00 PM</span>";
      return `<article class="day-card ${idx === today ? "today" : ""}">
        <div class="day-name">${entry.day}</div>
        <div class="day-times">${timings}</div>
      </article>`;
    })
    .join("");
}

function isOpenNow() {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const clock = hour + minute / 60;
  if (day === 0) return false;
  return (clock >= 9 && clock < 14) || (clock >= 18 && clock < 20);
}

function updateLiveStatus() {
  const isOpen = isOpenNow();
  const longText = isOpen ? "Open now | Mon-Sat" : "Currently closed";
  const shortText = isOpen ? "Open Now" : "Closed Now";
  const liveStatus = document.getElementById("liveStatus");
  const openStatus = document.getElementById("openStatus");

  if (liveStatus) {
    liveStatus.textContent = longText;
    liveStatus.classList.toggle("open", isOpen);
    liveStatus.classList.toggle("closed", !isOpen);
  }

  if (openStatus) {
    openStatus.textContent = shortText;
    openStatus.classList.toggle("open", isOpen);
    openStatus.classList.toggle("closed", !isOpen);
  }
}

renderTimings();
updateLiveStatus();
setInterval(updateLiveStatus, 60000);
