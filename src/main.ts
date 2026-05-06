import $ from "jquery";
import "./styles/main.scss";

// ===========================
// jQuery document ready
// ===========================
$(function () {
  initPreloader();
  initCursor();
  initParticles();
  initNavbar();
  initMobileMenu();
  initTyped();
  initCounters();
  initScrollReveal();
  initSkillBars();
  initBackToTop();
  initSmoothScroll();
});

// ===========================
// Preloader
// ===========================
function initPreloader() {
  function hidePreloader() {
    $("#preloader").addClass("hidden");
    $("body").removeClass("no-scroll");
  }

  // If already loaded, dismiss quickly
  if (document.readyState === "complete") {
    setTimeout(hidePreloader, 300);
  } else {
    $(window).on("load", function () {
      setTimeout(hidePreloader, 400);
    });
    // Hard fallback — never stay stuck
    setTimeout(hidePreloader, 1200);
  }
}

// ===========================
// Custom Cursor
// ===========================
function initCursor() {
  const dot = $(".cursor-dot");
  const outline = $(".cursor-outline");
  let cursorX = 0, cursorY = 0;
  let outlineX = 0, outlineY = 0;

  $(document).on("mousemove", function (e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    dot.css({ left: cursorX, top: cursorY });
  });

  function animateOutline() {
    outlineX += (cursorX - outlineX) * 0.15;
    outlineY += (cursorY - outlineY) * 0.15;
    outline.css({ left: outlineX, top: outlineY });
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  $(document).on("mouseenter", "a, button, .tech-tag, .project-card", function () {
    outline.addClass("hovering");
  });
  $(document).on("mouseleave", "a, button, .tech-tag, .project-card", function () {
    outline.removeClass("hovering");
  });
}

// ===========================
// Particle Canvas
// ===========================
function initParticles() {
  const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext("2d")!;
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  interface Particle {
    x: number; y: number;
    vx: number; vy: number;
    size: number; alpha: number;
    color: string;
  }

  const colors = ["#00d4ff", "#7c3aed", "#f59e0b"];
  const count = Math.min(80, Math.floor(W * H / 18000));
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = p.color;
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }
  draw();

  $(window).on("resize", function () {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
}

// ===========================
// Navbar
// ===========================
function initNavbar() {
  const $nav = $("#navbar");
  const $links = $(".nav-link");

  $(window).on("scroll.navbar", function () {
    if ($(window).scrollTop()! > 50) {
      $nav.addClass("scrolled");
    } else {
      $nav.removeClass("scrolled");
    }
    updateActiveLink();
  });

  function updateActiveLink() {
    const scrollPos = $(window).scrollTop()! + 120;
    $("section").each(function () {
      const top = $(this).offset()!.top;
      const bottom = top + $(this).outerHeight()!;
      const id = $(this).attr("id");
      if (scrollPos >= top && scrollPos < bottom) {
        $links.removeClass("active");
        $(`.nav-link[data-section="${id}"]`).addClass("active");
      }
    });
  }
}

// ===========================
// Mobile Menu
// ===========================
function initMobileMenu() {
  const $toggle = $("#navToggle");
  const $menu = $("#mobileMenu");

  $toggle.on("click", function () {
    $toggle.toggleClass("open");
    $menu.toggleClass("open");
    $("body").toggleClass("no-scroll");
  });

  $(".mobile-link").on("click", function () {
    $toggle.removeClass("open");
    $menu.removeClass("open");
    $("body").removeClass("no-scroll");
  });
}

// ===========================
// Typed Text Effect
// ===========================
function initTyped() {
  const words = [
    "scalable APIs",
    "enterprise systems",
    "Laravel backends",
    "SaaS platforms",
    "high-performance code",
    "global software",
  ];
  let wordIndex = 0, charIndex = 0, isDeleting = false;
  const $el = $("#typed-text");

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      charIndex--;
      $el.text(currentWord.slice(0, charIndex));
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 60);
    } else {
      charIndex++;
      $el.text(currentWord.slice(0, charIndex));
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 1000);
}

// ===========================
// Counter Animation
// ===========================
function initCounters() {
  let counted = false;
  $(window).on("scroll.counters", function () {
    if (counted) return;
    const heroBottom = $(".hero").offset()!.top + $(".hero").outerHeight()!;
    if ($(window).scrollTop()! > 0 || $(window).height()! > heroBottom - 200) {
      counted = true;
      $(".stat-num").each(function () {
        const $el = $(this);
        const target = parseInt($el.data("count") as string, 10);
        $({ counter: 0 }).animate({ counter: target }, {
          duration: 1500,
          easing: "swing",
          step: function (val: number) {
            $el.text(Math.ceil(val));
          },
          complete: function () {
            $el.text(target);
          }
        });
      });
    }
  });
  // Trigger once on load
  $(window).trigger("scroll.counters");
}

// ===========================
// Scroll Reveal
// ===========================
function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
  );

  $(".reveal-left, .reveal-right, .reveal-up").each(function () {
    observer.observe(this);
  });
}

// ===========================
// Skill Bars
// ===========================
function initSkillBars() {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).find(".skill-bar-fill").each(function () {
            const width = $(this).data("width") as string;
            $(this).css("width", width + "%");
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  $(".skills").each(function () {
    skillObserver.observe(this);
  });
}

// ===========================
// Smooth Scroll
// ===========================
function initSmoothScroll() {
  $(document).on("click", 'a[href^="#"]', function (e) {
    const href = $(this).attr("href")!;
    const $target = $(href);
    if ($target.length) {
      e.preventDefault();
      const offset = $target.offset()!.top - 80;
      $("html, body").animate({ scrollTop: offset }, 600, "swing");
    }
  });
}

// ===========================
// Back to Top
// ===========================
function initBackToTop() {
  const $btn = $("#backToTop");
  $(window).on("scroll.btt", function () {
    if ($(window).scrollTop()! > 400) {
      $btn.addClass("visible");
    } else {
      $btn.removeClass("visible");
    }
  });
  $btn.on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
  });
}

