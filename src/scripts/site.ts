import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Navigation: the mobile panel traps no focus when closed and restores page scrolling.
const header = document.querySelector<HTMLElement>('.site-header');
const menuButton = document.querySelector<HTMLButtonElement>('.mobile-menu-toggle');
const mobileNav = document.querySelector<HTMLElement>('.mobile-nav');

function setMenu(open: boolean) {
  if (!header || !menuButton || !mobileNav) return;
  header.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileNav.setAttribute('aria-hidden', String(!open));
  mobileNav.inert = !open;
  if (open) mobileNav.querySelector<HTMLElement>('a')?.focus();
}

menuButton?.addEventListener('click', () => setMenu(!header?.classList.contains('is-open')));
mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
window.addEventListener('resize', () => {
  if (window.innerWidth > 1024 && header?.classList.contains('is-open')) setMenu(false);
}, { passive: true });
document.addEventListener('keydown', (event) => {
  if (event.key === 'Tab' && header?.classList.contains('is-open') && mobileNav) {
    const links = Array.from(mobileNav.querySelectorAll<HTMLElement>('a:not([hidden])'));
    const first = links[0];
    const last = links[links.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  if (event.key === 'Escape' && header?.classList.contains('is-open')) {
    setMenu(false);
    menuButton?.focus();
  }
});

// Hero photography slideshow with user-controlled thumbnails and gentle autoplay.
const heroImages = Array.from(document.querySelectorAll<HTMLImageElement>('[data-hero-image]'));
const heroThumbs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-hero-thumb]'));
const heroHeading = document.querySelector<HTMLElement>('[data-hero-heading]');
const heroDescription = document.querySelector<HTMLElement>('[data-hero-description]');
let currentSlide = 0;
let autoplay: number | undefined;
let heroCopyTransition: gsap.core.Timeline | undefined;

function showHeroSlide(index: number) {
  if (!heroImages.length) return;
  const nextSlide = (index + heroImages.length) % heroImages.length;
  if (nextSlide === currentSlide) return;
  currentSlide = nextSlide;
  heroImages.forEach((image, i) => image.classList.toggle('is-active', i === currentSlide));
  heroThumbs.forEach((thumb, i) => {
    thumb.classList.toggle('is-active', i === currentSlide);
    thumb.setAttribute('aria-pressed', String(i === currentSlide));
  });

  const selected = heroThumbs[currentSlide];
  if (!selected || !heroHeading || !heroDescription) return;
  const applyCopy = () => {
    heroHeading.textContent = selected.dataset.heroHeadline ?? '';
    heroDescription.textContent = selected.dataset.heroDescription ?? '';
  };
  heroCopyTransition?.kill();
  if (reducedMotion.matches) {
    gsap.set([heroHeading, heroDescription], { clearProps: 'opacity,transform,visibility' });
    applyCopy();
    return;
  }
  // Fade the existing words out before replacing them, then reveal the new slide copy.
  // Killing the previous timeline keeps rapid thumbnail clicks from mixing slide texts.
  heroCopyTransition = gsap.timeline({ defaults: { overwrite: 'auto' } })
    .to([heroHeading, heroDescription], { opacity: 0, y: -13, duration: .27, stagger: .045, ease: 'power2.in' })
    .add(applyCopy)
    .fromTo([heroHeading, heroDescription], { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: .55, stagger: .08, ease: 'power3.out', clearProps: 'opacity,transform' });
}
function stopHeroAutoplay() {
  if (autoplay !== undefined) window.clearInterval(autoplay);
  autoplay = undefined;
}
function startHeroAutoplay() {
  stopHeroAutoplay();
  if (reducedMotion.matches || heroImages.length < 2 || document.hidden) return;
  autoplay = window.setInterval(() => showHeroSlide(currentSlide + 1), 6500);
}
heroThumbs.forEach((thumb, i) => thumb.addEventListener('click', () => {
  showHeroSlide(i);
  startHeroAutoplay();
}));
document.addEventListener('visibilitychange', () => document.hidden ? stopHeroAutoplay() : startHeroAutoplay());
reducedMotion.addEventListener('change', startHeroAutoplay);
startHeroAutoplay();

// Independent room photo carousels.
document.querySelectorAll<HTMLElement>('[data-room-gallery]').forEach((gallery) => {
  const images = Array.from(gallery.querySelectorAll<HTMLImageElement>('.room-card__image'));
  const count = gallery.querySelector<HTMLElement>('[data-room-count]');
  const thumbs = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-room-thumb]'));
  gallery.querySelectorAll<HTMLElement>('[data-room-controls]').forEach((control) => { control.hidden = false; });
  let active = 0;
  function show(index: number) {
    if (images.length === 0) return;
    active = (index + images.length) % images.length;
    images.forEach((image, i) => {
      image.classList.toggle('is-active', i === active);
      image.setAttribute('aria-hidden', String(i !== active));
    });
    thumbs.forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === active)));
    if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
  }
  gallery.querySelector('[data-room-prev]')?.addEventListener('click', () => show(active - 1));
  gallery.querySelector('[data-room-next]')?.addEventListener('click', () => show(active + 1));
  thumbs.forEach((thumb, index) => thumb.addEventListener('click', () => show(index)));
  gallery.addEventListener('keydown', (event) => {
    if (!(event.target instanceof HTMLButtonElement) || !['ArrowLeft', 'ArrowRight'].includes(event.key) || images.length < 2) return;
    event.preventDefault();
    show(active + (event.key === 'ArrowRight' ? 1 : -1));
    if (thumbs.includes(event.target)) thumbs[active]?.focus();
  });
});

// An accessible, single-open FAQ accordion. Content remains in the document for SEO.
const faqButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-faq-button]'));
faqButtons.forEach((button) => button.addEventListener('click', () => {
  const item = button.closest<HTMLElement>('.faq-item');
  const shouldOpen = !item?.classList.contains('is-open');
  faqButtons.forEach((other) => {
    const otherItem = other.closest<HTMLElement>('.faq-item');
    const isOpen = other === button && shouldOpen;
    otherItem?.classList.toggle('is-open', isOpen);
    other.setAttribute('aria-expanded', String(isOpen));
    const panel = otherItem?.querySelector<HTMLElement>('.faq-item__panel');
    if (panel) panel.inert = !isOpen;
  });
}));

// Explore image cards: hover/focus reveals on desktop, click/tap toggles on touch.
const exploreCards = Array.from(document.querySelectorAll<HTMLElement>('[data-explore-item]'));
exploreCards.forEach((card) => {
  const trigger = card.querySelector<HTMLButtonElement>('.explore-photo__trigger');
  const info = card.querySelector<HTMLElement>('.explore-photo__popover');
  const setExpanded = (expanded: boolean) => {
    card.classList.toggle('is-open', expanded);
    trigger?.setAttribute('aria-expanded', String(expanded));
    info?.setAttribute('aria-hidden', String(!expanded));
  };
  trigger?.addEventListener('click', () => {
    const next = !card.classList.contains('is-open');
    exploreCards.forEach((other) => {
      other.classList.remove('is-open');
      other.querySelector('.explore-photo__trigger')?.setAttribute('aria-expanded', 'false');
      other.querySelector('.explore-photo__popover')?.setAttribute('aria-hidden', 'true');
    });
    setExpanded(next);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') { setExpanded(false); trigger?.focus(); }
  });
});
document.addEventListener('pointerdown', (event) => {
  if ((event.target as HTMLElement).closest('[data-explore-item]')) return;
  exploreCards.forEach((card) => {
    card.classList.remove('is-open');
    const trigger = card.querySelector<HTMLButtonElement>('.explore-photo__trigger');
    if (document.activeElement === trigger) trigger?.blur();
    trigger?.setAttribute('aria-expanded', 'false');
    card.querySelector('.explore-photo__popover')?.setAttribute('aria-hidden', 'true');
  });
});

// Gallery rail + native dialog for full-size images, with keyboard controls.
const galleryRail = document.querySelector<HTMLElement>('[data-gallery-rail]');
document.querySelectorAll<HTMLButtonElement>('[data-gallery-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.dataset.galleryScroll === 'next' ? 1 : -1;
    galleryRail?.scrollBy({ left: direction * Math.min(galleryRail.clientWidth * .8, 460), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
});
const galleryTiles = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-gallery-item]'));
const galleryDialog = document.querySelector<HTMLDialogElement>('#gallery-modal');
const modalImage = document.querySelector<HTMLImageElement>('#gallery-modal-image');
const modalCaption = document.querySelector<HTMLElement>('#gallery-modal-caption');
let activeGalleryIndex = 0;
let galleryRequest = 0;

// Load the next image before replacing the current one, so rapid navigation
// cannot flash blank frames or allow stale images to overwrite the latest.
async function displayGalleryImage(index: number) {
  if (!galleryTiles.length || !modalImage || !galleryDialog) return;
  activeGalleryIndex = (index + galleryTiles.length) % galleryTiles.length;
  const currentRequest = ++galleryRequest;
  const tile = galleryTiles[activeGalleryIndex];
  const nextSrc = tile.dataset.galleryFull;
  const caption = tile.dataset.galleryCaption || 'Hotel photograph';
  if (!nextSrc) return;

  const thumbnail = tile.querySelector<HTMLImageElement>('img');
  const previewSrc = thumbnail?.currentSrc || thumbnail?.src;
  // Show the already-loaded thumbnail immediately, then replace it with the
  // decoded full-resolution photograph. Never leave the dialog empty.
  if (previewSrc) modalImage.src = previewSrc;
  modalImage.alt = thumbnail?.alt || caption;
  if (modalCaption) modalCaption.textContent = caption;
  galleryDialog.classList.add('is-loading');
  try {
    const preloaded = new Image();
    preloaded.src = nextSrc;
    if (typeof preloaded.decode === 'function') await preloaded.decode();
    else if (!preloaded.complete) await new Promise<void>((resolve) => {
      preloaded.onload = () => resolve();
      preloaded.onerror = () => resolve();
    });
  } catch {
    // Network errors still permit the browser to show the image or alt text.
  }
  if (currentRequest !== galleryRequest || !galleryDialog.open) return;
  modalImage.src = nextSrc;
  if (modalCaption) modalCaption.textContent = caption;
  galleryDialog.classList.remove('is-loading');
}

galleryTiles.forEach((tile, index) => tile.addEventListener('click', () => {
  if (!galleryDialog) return;
  if (!galleryDialog.open) galleryDialog.showModal();
  void displayGalleryImage(index);
}));
document.querySelector('[data-modal-close]')?.addEventListener('click', () => galleryDialog?.close());
document.querySelector('[data-modal-prev]')?.addEventListener('click', () => void displayGalleryImage(activeGalleryIndex - 1));
document.querySelector('[data-modal-next]')?.addEventListener('click', () => void displayGalleryImage(activeGalleryIndex + 1));
galleryDialog?.addEventListener('close', () => {
  galleryRequest++;
  galleryDialog.classList.remove('is-loading');
});
galleryDialog?.addEventListener('click', (event) => {
  if (event.target === galleryDialog) galleryDialog.close();
});
galleryDialog?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') { event.preventDefault(); void displayGalleryImage(activeGalleryIndex - 1); }
  if (event.key === 'ArrowRight') { event.preventDefault(); void displayGalleryImage(activeGalleryIndex + 1); }
});

// The loader is a CSS animation so it has a fail-safe exit even if this module fails.
const loader = document.querySelector<HTMLElement>('.site-loader');
loader?.addEventListener('animationend', (event) => {
  if (event.target === loader) document.documentElement.classList.remove('intro-play');
});

// A quiet, fixed return control after the visitor begins scrolling.
const backToTop = document.querySelector<HTMLElement>('[data-back-to-top]');
function updateReturnControl() {
  backToTop?.classList.toggle('is-visible', window.scrollY > 460);
}
window.addEventListener('scroll', updateReturnControl, { passive: true });
updateReturnControl();

if (!reducedMotion.matches) {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // ScrollSmoother only runs on desktops where it won't fight native touch scrolling.
  // Header stays outside the transformed content so sticky positioning keeps working.
  const mm = gsap.matchMedia();
  let smoother: ScrollSmoother | undefined;
  mm.add('(min-width: 1025px)', () => {
    // Native document snap interferes with ScrollSmoother's scrolling and the
    // section pin. Preserve proximity snapping on native-scroll devices only.
    document.documentElement.classList.add('has-scroll-smoother');
    smoother = ScrollSmoother.create({
      wrapper: '#smooth-wrapper',
      content: '#smooth-content',
      smooth: 1.15,
      smoothTouch: false,
      effects: true,
      normalizeScroll: false,
    });
    return () => {
      smoother?.kill();
      smoother = undefined;
      document.documentElement.classList.remove('has-scroll-smoother');
    };
  });

  // Pin only when the left introduction itself reaches the navbar clearance.
  // Release when its bottom reaches the bottom of the right-hand cards.
  // Do not combine this with CSS sticky or a document-wide snap on desktop.
  mm.add('(min-width: 1025px)', () => {
    const intro = document.querySelector<HTMLElement>('.amenities-intro');
    const cards = document.querySelector<HTMLElement>('.amenities-list');
    if (!intro || !cards) return;
    const clearance = () => (header?.offsetHeight ?? 76) + 18;
    const pin = ScrollTrigger.create({
      trigger: intro,
      start: () => `top top+=${clearance()}`,
      endTrigger: cards,
      end: () => `bottom top+=${clearance() + intro.offsetHeight}`,
      pin: intro,
      pinSpacing: false,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    return () => pin.kill();
  });

  // Expand the photographed hero to the edges, rather than simply scaling the image.
  mm.add('(min-width: 781px)', () => {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;
    const tween = gsap.to(hero, {
      width: '100%',
      ease: 'none',
      scrollTrigger: { trigger: hero, start: () => `top top+=${header?.offsetHeight ?? 76}`, end: '+=400', scrub: 1.05, invalidateOnRefresh: true },
    });
    return () => { tween.scrollTrigger?.kill(); tween.kill(); gsap.set(hero, { clearProps: 'width' }); };
  });

  // A clipped/scaled frame can look like a narrow, broken layout during the
  // entrance sequence on phones. Keep that effect on desktop only; mobile gets
  // the existing text reveal with a full-width frame from the first paint.
  if (document.querySelector('[data-hero-frame]')) {
    const introDelay = document.documentElement.classList.contains('intro-play') ? 1.24 : .13;
    mm.add('(min-width: 781px)', () => {
      const reveal = gsap.fromTo('[data-hero-frame]',
        { clipPath: 'inset(8% 5% 8% 5%)', opacity: .35, scale: .975 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, scale: 1, duration: 1.4,
          ease: 'power3.out', delay: introDelay, clearProps: 'clipPath,opacity,scale,transform' }
      );
      return () => {
        reveal.kill();
        gsap.set('[data-hero-frame]', { clearProps: 'clipPath,opacity,scale,transform' });
      };
    });
    gsap.fromTo('[data-hero-animate]',
      { y: 34, opacity: 0 },
      { y: 0, opacity: 1, duration: .96, stagger: .12,
        ease: 'power3.out', delay: introDelay + .35, clearProps: 'transform,opacity' }
    );
  }
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
    gsap.fromTo(element,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: .95, ease: 'power3.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 91%', once: true } }
    );
  });
  // Keep the alternating left/right entrance on desktop. On phones, moving
  // an entire review row sideways enlarges the layout viewport before the
  // reveal finishes, causing the whole page to appear scaled down.
  const compactViewport = window.matchMedia('(max-width: 780px)').matches;
  gsap.utils.toArray<HTMLElement>('[data-reviews-row]').forEach((row) => {
    const fromLeft = row.dataset.reviewsRow === 'left';
    gsap.fromTo(row,
      { autoAlpha: 0, x: compactViewport ? 0 : (fromLeft ? -94 : 94), y: compactViewport ? 24 : 0 },
      { autoAlpha: 1, x: 0, y: 0, duration: 1.25, ease: 'power3.out',
        clearProps: 'opacity,visibility,transform',
        scrollTrigger: { trigger: row, start: 'top 92%', once: true } }
    );
  });

  // Each floating image arrives independently as it enters view. This prevents
  // the bottom images revealing off-screen when the overall section first enters.
  const exploreItems = gsap.utils.toArray<HTMLElement>('[data-explore-reveal]');
  exploreItems.forEach((item, index) => {
    const isUpper = index < 2;
    const isLeft = index % 2 === 0;
    gsap.fromTo(item,
      { autoAlpha: 0, x: compactViewport ? 0 : (isLeft ? -42 : 42), y: isUpper ? -72 : 95,
        scale: .9, rotation: compactViewport ? 0 : (isLeft ? -2.6 : 2.6) },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, rotation: 0, ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top 94%',
          end: 'top 65%',
          scrub: .6,
          invalidateOnRefresh: true,
        } }
    );
  });
  const galleryItems = gsap.utils.toArray<HTMLElement>('[data-gallery-reveal]');
  if (galleryItems.length) {
    gsap.fromTo(galleryItems,
      { autoAlpha: 0, y: 80, clipPath: 'inset(12% 0% 0% 0%)' },
      { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15,
        stagger: .11, ease: 'power3.out', clearProps: 'opacity,visibility,transform,clipPath',
        scrollTrigger: { trigger: '.gallery-rail', start: 'top 90%', once: true } }
    );
  }
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      if (!smoother) return; // Native CSS smooth scrolling handles mobile and reduced-motion.
      const hash = anchor.getAttribute('href');
      if (!hash || hash.length <= 1) return;
      const destination = document.getElementById(hash.slice(1));
      if (!destination) return;
      event.preventDefault();
      const targetScroll = smoother.offset(destination, 'top top');
      smoother.scrollTo(Math.max(0, targetScroll - (header?.offsetHeight ?? 76)), true);
      window.history.replaceState(null, '', hash);
    });
  });
  // Scroll-linked image zoom-out for the existing Breakfast and Contact sections.
  // Each image settles at 1x and stays there after its first complete reveal.
  // The overlay and content remain untouched; reduced-motion visitors skip the effect.
  [
    { section: '.breakfast-section', image: '.breakfast-section__image' },
    { section: '.contact-section', image: '.contact-section__background img' },
  ].forEach(({ section, image }) => {
    const sectionElement = document.querySelector<HTMLElement>(section);
    const imageElement = document.querySelector<HTMLImageElement>(image);
    if (!sectionElement || !imageElement) return;

    gsap.fromTo(imageElement,
      { scale: 1.16, transformOrigin: 'center center' },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionElement,
          start: 'top bottom',
          end: 'top 25%',
          scrub: 1.05,
          invalidateOnRefresh: true,
          onScrubComplete: (self) => {
            if (self.progress >= 0.999) {
              gsap.set(imageElement, { scale: 1, clearProps: 'willChange' });
              self.kill(false);
            }
          },
        },
      }
    );
  });

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  document.addEventListener('marlin:layout-change', () => requestAnimationFrame(() => ScrollTrigger.refresh()));
  if (window.location.hash) {
    window.addEventListener('load', () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (target && smoother) smoother.scrollTo(Math.max(0, smoother.offset(target, 'top top') - (header?.offsetHeight ?? 76)), false);
    }, { once: true });
  }
}
