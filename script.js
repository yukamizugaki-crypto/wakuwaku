/* ============================================
   わくわく工房 — script.js
   ============================================ */

// ---- Hamburger Menu ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mnavLinks = document.querySelectorAll('.mnav-link');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const isOpen = mobileNav.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});
mnavLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
  });
});

// ---- Scroll-reveal (IntersectionObserver) ----
const revealEls = document.querySelectorAll('.js-reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

// ---- Slider ----
const slider       = document.getElementById('slider');
const prevBtn      = document.getElementById('prevBtn');
const nextBtn      = document.getElementById('nextBtn');
const dotsWrap     = document.getElementById('sliderDots');
const slides       = slider.querySelectorAll('.slide');
const slidesPerView = () => window.innerWidth <= 640 ? 1 : 2;
let currentIndex = 0;

// Build dots
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.classList.add('dot');
  dot.setAttribute('aria-label', `スライド ${i + 1}`);
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

function totalPositions() {
  return Math.max(0, slides.length - slidesPerView());
}

function goTo(index) {
  currentIndex = Math.max(0, Math.min(index, totalPositions()));
  const slideWidth = slides[0].offsetWidth + 24; // gap = 1.5rem ≈ 24px
  slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  slider.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1)';
  updateDots();
}

function updateDots() {
  const dots = dotsWrap.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

// Touch/swipe support
let touchStartX = 0;
slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
slider.addEventListener('touchend', e => {
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dx) > 40) goTo(currentIndex + (dx > 0 ? 1 : -1));
});

// Keyboard arrow support
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  goTo(currentIndex - 1);
  if (e.key === 'ArrowRight') goTo(currentIndex + 1);
});

// Recalculate on resize
window.addEventListener('resize', () => {
  currentIndex = Math.min(currentIndex, totalPositions());
  goTo(currentIndex);
});

// ---- Header shadow on scroll ----
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) {
    header.style.boxShadow = '0 2px 20px rgba(0,0,0,.1)';
  } else {
    header.style.boxShadow = 'none';
  }
}, { passive: true });

// ---- Concept Slideshow (Fade-in/out every 4s) ----
const conceptSlides = document.querySelectorAll('.concept-slideshow .c-slide');
let conceptSlideIndex = 0;
if (conceptSlides.length > 0) {
  setInterval(() => {
    conceptSlides[conceptSlideIndex].classList.remove('active');
    conceptSlideIndex = (conceptSlideIndex + 1) % conceptSlides.length;
    conceptSlides[conceptSlideIndex].classList.add('active');
  }, 4000);
}
