// ===============================
// FICHIER: js/script.js (AMÉLIORÉ)
// ===============================

document.addEventListener('DOMContentLoaded', () => {

  // ===== UTILS =====
  const throttle = (fn, wait) => {
    let lastTime = 0;
    return (...args) => {
      const now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, args);
      }
    };
  };

  // Préf. Animations utilisateur
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = prefersReducedMotion.matches;
  prefersReducedMotion.addEventListener('change', (e) => {
    reduce = e.matches;
  });

  // ===== MENU BURGER =====
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.querySelector('.navbar');

  if (navToggle && navLinks && navbar) {
    const toggleMenu = () => {
      const isActive = navbar.classList.contains('active');
      navbar.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', !isActive);
      document.body.style.overflow = !isActive ? 'hidden' : '';
    };

    navToggle.addEventListener('click', toggleMenu);

    navLinks.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        navbar.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('active')) {
        navbar.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== NAVBAR SCROLL =====
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', throttle(() => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 100);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', window.scrollY > 500);
  }, 100), { passive: true });

  // ===== TEXTE ANIMÉ (Typewriter Effect) =====
  class Typewriter {
    constructor(element, texts, options = {}) {
      this.element = element;
      this.texts = texts;
      this.textIndex = 0;
      this.charIndex = 0;
      this.isDeleting = false;
      this.typeSpeed = options.typeSpeed || 100;
      this.deleteSpeed = options.deleteSpeed || 50;
      this.pauseTime = options.pauseTime || 2000;
      this.startDelay = options.startDelay || 1000;
      
      if (this.element) {
        setTimeout(() => this.type(), this.startDelay);
      }
    }

    type() {
      if (!this.element) return;
      
      const currentText = this.texts[this.textIndex];
      
      if (this.isDeleting) {
        this.element.textContent = currentText.substring(0, this.charIndex - 1);
        this.charIndex--;
        
        if (this.charIndex === 0) {
          this.isDeleting = false;
          this.textIndex = (this.textIndex + 1) % this.texts.length;
          setTimeout(() => this.type(), 500);
        } else {
          setTimeout(() => this.type(), this.deleteSpeed);
        }
      } else {
        this.element.textContent = currentText.substring(0, this.charIndex + 1);
        this.charIndex++;
        
        if (this.charIndex === currentText.length) {
          this.isDeleting = true;
          setTimeout(() => this.type(), this.pauseTime);
        } else {
          setTimeout(() => this.type(), this.typeSpeed);
        }
      }
    }
  }

  // ===== INITIALISATION TYPEWRITER =====
  const typedTextElement = document.getElementById('typed-text');
  
  if (typedTextElement) {
    const typewriterTexts = [
      "Développeur Web",
      "Technicien Réseau",
      "Passionné de cybersécurité",
      "Étudiant BTS SIO SLAM"
    ];
    
    // Vérifier si l'animation doit être activée
    if (!reduce) {
      // Démarrer l'effet typewriter avec un délai pour laisser les animations CSS se terminer
      const typewriter = new Typewriter(typedTextElement, typewriterTexts, {
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000,
        startDelay: 1500
      });
      
      // Stocker l'instance globalement pour un accès ultérieur si nécessaire
      window.typewriterInstance = typewriter;
    } else {
      // Mode réduit : afficher le premier texte directement
      typedTextElement.textContent = typewriterTexts[0];
    }
  }

  // ===== ANIMATION DES COMPÉTENCES (au scroll) =====
  const skillBars = document.querySelectorAll('.skill-progress');
  if (skillBars.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(({ isIntersecting, target }) => {
        if (isIntersecting) {
          target.classList.add('animated');
          obs.unobserve(target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    skillBars.forEach(bar => observer.observe(bar));
  }

  // ===== ANIMATIONS SECTIONS =====
  const fadeSection = nodes => nodes.forEach(node => node.classList.add('fade-in'));
  const fadeObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('fade-in-visible');
        obs.unobserve(target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeSection(document.querySelectorAll('.section, .competence-category, .timeline-card'));
  document.querySelectorAll('.section, .competence-category, .timeline-card').forEach(el => fadeObserver.observe(el));
  document.querySelectorAll('.timeline-card').forEach((card, i) =>
    card.style.animationDelay = `${i * 0.15}s`
  );

  // ===== SCROLL DOUX =====
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const yOffset = navbar ? navbar.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - yOffset;
      window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.classList.add('focus-anim');
      setTimeout(() => {
        target.removeAttribute('tabindex');
        target.classList.remove('focus-anim');
      }, 800);
    });
  });

  // ===== NAVIGATION ACTIVE =====
  const sectionsForNav = document.querySelectorAll('section[id]');
  const navAnchors = navLinks ? navLinks.querySelectorAll('a[href^="#"]') : [];
  if (sectionsForNav.length && navAnchors.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const corresponding = Array.from(navAnchors).find(a => a.getAttribute('href') === `#${id}`);
        if (corresponding) {
          if (entry.isIntersecting) {
            navAnchors.forEach(a => a.removeAttribute('aria-current'));
            corresponding.setAttribute('aria-current', 'page');
          }
        }
      });
    }, { rootMargin: '0px 0px -60% 0px', threshold: 0.2 });
    sectionsForNav.forEach(sec => navObserver.observe(sec));
  }

  // ===== SCROLL TO TOP =====
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // ===== FORM CONTACT (AJAX Google Sheet) =====
  const form = document.forms['submit-to-google-sheet'];
  const msg = document.getElementById('msg');
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwV4dumTE8jLQUVvokT1ks49h6YoHAKP4n4u5pw5doA-kkQ7DEkqVWQjScBERPA5V9vLg/exec';

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('.btn-submit');
      const btnText = submitBtn?.querySelector('.btn-text');
      const originalText = btnText?.textContent || '';
      if (btnText) btnText.textContent = 'Envoi...';
      if (submitBtn) submitBtn.disabled = true;
      msg.classList.remove('fade-message');

      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then((res) => {
          if (!res.ok) throw new Error();
          msg.textContent = 'Message envoyé avec succès !';
          msg.style.color = 'green';
          msg.classList.add('fade-message');
          form.reset();
        })
        .catch(() => {
          msg.textContent = "Erreur lors de l'envoi du message.";
          msg.style.color = 'red';
          msg.classList.add('fade-message');
        })
        .finally(() => {
          setTimeout(() => {
            msg.textContent = '';
            msg.classList.remove('fade-message');
          }, 4000);
          if (btnText) btnText.textContent = originalText;
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

});
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.skill-progress').forEach(function(progress) {
        let value = progress.getAttribute('data-progress');
        setTimeout(function() {
            progress.style.width = value + "%";
        }, 600);
    });
});

