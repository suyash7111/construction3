/**
 * AUREX CONSTRUCTIONS - CORE INTERACTION & ANIMATION ENGINE
 * Precision scripts for splash sequence, interactive services,
 * 3D card tilts, animated SVG circle mark, and instant project estimator.
 */

(() => {
  'use strict';

  // Helper query selectors
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];

  /* ==========================================================================
     1. KINETIC TYPOGRAPHY SPLITTING
     ========================================================================== */
  const splitTextToSpans = (element, text, step = 0.05, baseDelay = 0.3) => {
    if (!element) return;
    element.innerHTML = [...text].map((char, index) => {
      const delay = baseDelay + index * step;
      return `<span style="animation-delay:${delay}s; transition-delay:${delay}s">${char}</span>`;
    }).join('');
  };

  // Hero "CONSTRUCTIONS" text split
  const heroBig = $('.big');
  if (heroBig) {
    splitTextToSpans(heroBig, 'CONSTRUCTIONS', 0.045, 0.4);
  }

  // Thank You "THANK YOU" letter split
  const thankSpan = $('.ty .w1');
  const youSpan = $('.ty .w2');
  if (thankSpan) splitTextToSpans(thankSpan, 'THANK', 0.06, 0.2);
  if (youSpan) splitTextToSpans(youSpan, 'YOU', 0.06, 0.5);

  /* ==========================================================================
     2. SPLASH SCREEN (ORANGE THEME, CONSTRUCTION TELEMETRY, LOGO HOIST)
     ========================================================================== */
  const splash = $('#splash');
  const sky = $('#sky');
  const bar = $('#bar');
  const pct = $('#pct');
  const stage = $('#stage');
  const skipBtn = $('#skip-splash');

  // Generate dynamic skyline bars
  const skyHeights = [18, 32, 24, 46, 38, 54, 28, 48, 22, 42, 34, 52, 26, 40];
  const skyBars = sky ? skyHeights.map(() => {
    const barEl = document.createElement('i');
    sky.appendChild(barEl);
    return barEl;
  }) : [];

  const constructionMilestones = [
    'SURVEYING GEOTECHNICAL SITE DATA',
    'ERECTING TOWER CRANES & STRUCTURAL STEEL',
    'CASTING HIGH-STRENGTH REINFORCED CONCRETE',
    'INSTALLING MEP & FACADE SYSTEMS',
    'CALIBRATING SMART INFRASTRUCTURE',
    'FINAL INSPECTION CLEARED · WELCOME TO AUREX'
  ];

  let progress = 0;
  const startTime = performance.now();
  const splashDuration = 2800; // 2.8 seconds total
  let splashCompleted = false;

  function runSplashTick(now) {
    if (splashCompleted) return;
    const elapsed = now - startTime;
    progress = Math.min(100, Math.round((elapsed / splashDuration) * 100));

    if (bar) bar.style.width = `${progress}%`;
    if (pct) pct.textContent = progress;

    if (stage) {
      const stageIndex = Math.min(
        constructionMilestones.length - 1,
        Math.floor((progress / 100) * constructionMilestones.length)
      );
      stage.textContent = constructionMilestones[stageIndex];
    }

    if (skyBars.length) {
      skyBars.forEach((barEl, idx) => {
        if (progress > idx * 7) {
          barEl.style.height = `${skyHeights[idx]}px`;
        }
      });
    }

    if (progress < 100) {
      requestAnimationFrame(runSplashTick);
    } else {
      dismissSplashScreen();
    }
  }

  function dismissSplashScreen() {
    if (splashCompleted) return;
    splashCompleted = true;
    if (!splash) return;

    setTimeout(() => {
      splash.classList.add('out');
      document.body.classList.remove('loading');

      // Trigger hero cursive handwriting & letters
      const heroScript = $('.hero-script');
      if (heroScript) heroScript.style.animationPlayState = 'running';

      setTimeout(() => {
        splash.classList.add('gone');
      }, 1100);
    }, 300);
  }

  if (splash) {
    requestAnimationFrame(runSplashTick);
    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dismissSplashScreen();
      });
    }
  } else {
    document.body.classList.remove('loading');
  }

  /* ==========================================================================
     3. SCROLL REVEALS & THANK YOU TRIGGERS
     ========================================================================== */
  const revealElements = $$('.rv, .c-title-wrapper, .c-img');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Thank You Section Observer for letters & cursive draw
  const thanksSection = $('#thankyou');
  if (thanksSection) {
    const thanksObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const tyLetters = $('.ty');
          const attScript = $('.att');
          if (tyLetters) tyLetters.classList.add('in');
          if (attScript) attScript.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    thanksObserver.observe(thanksSection);
  }

  /* ==========================================================================
     4. ANIMATED KEY PERFORMANCE COUNTERS
     ========================================================================== */
  const counterElements = $$('[data-n]');
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);

      const targetVal = +entry.target.dataset.n;
      const suffix = entry.target.dataset.s || '';
      const startCountTime = performance.now();
      const countDuration = 1800;

      function countStep(timeNow) {
        const progressRate = Math.min(1, (timeNow - startCountTime) / countDuration);
        // Ease Out Cubic
        const easeVal = 1 - Math.pow(1 - progressRate, 3);
        const currentCount = Math.round(targetVal * easeVal);
        entry.target.textContent = currentCount + suffix;

        if (progressRate < 1) {
          requestAnimationFrame(countStep);
        }
      }
      requestAnimationFrame(countStep);
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  /* ==========================================================================
     5. NAVIGATION: ACTIVE SCROLLSPY, PROGRESS BAR & BACK-TO-TOP RING
     ========================================================================== */
  const nav = $('#nav');
  const topBtn = $('#top');
  const topRing = $('#top-ring');
  const progressBar = $('#progress');
  const navLinks = $$('#menu a.nav-link');
  const sections = $$('main section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    // Header background blur toggle
    if (nav) nav.classList.toggle('solid', scrollY > 60);

    // Scroll progress bar
    if (progressBar) progressBar.style.width = `${scrollPercent}%`;

    // Back to top visibility & SVG progress ring
    if (topBtn) {
      topBtn.classList.toggle('show', scrollY > 600);
      if (topRing) {
        // Circumference of r=18 circle is ~113.09
        const circumference = 113.09;
        const offset = circumference - (scrollPercent / 100) * circumference;
        topRing.style.strokeDashoffset = offset;
      }
    }
  }, { passive: true });

  if (topBtn) {
    topBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Active section tracking (ScrollSpy)
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  sections.forEach(sec => spyObserver.observe(sec));

  // Mobile Menu Drawer
  const burger = $('#burger');
  const menu = $('#menu');
  if (burger && menu) {
    const toggleMenu = () => {
      const isOpen = menu.classList.toggle('open');
      burger.classList.toggle('on', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    };
    burger.addEventListener('click', toggleMenu);

    $$('#menu a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('on');
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ==========================================================================
     6. SLIDE 4: CONSTRUCTION SERVICES (INTERACTIVE ACCORDION & LIVE PREVIEW)
     ========================================================================== */
  const serviceItems = $$('.svc li');
  const previewTag = $('#preview-tag');
  const previewImg = $('#preview-img');
  const previewTitle = $('#preview-title');
  const previewText = $('#preview-text');
  const previewWarranty = $('#preview-warranty');
  const previewStandard = $('#preview-standard');
  const previewLead = $('#preview-lead');

  // Service data repository
  const serviceData = {
    residential: {
      tag: 'SERVICE 01 / RESIDENTIAL',
      title: 'Residential Construction',
      text: 'Luxury turnkey residences, multi-family towers, and bespoke private estates engineered to the highest aesthetic, seismic, and sustainability criteria.',
      img: 'images/contact.jpg',
      warranty: '10 Years Structural',
      standard: 'ISO 9001:2015',
      lead: '6 – 18 Months'
    },
    commercial: {
      tag: 'SERVICE 02 / COMMERCIAL',
      title: 'Commercial Construction',
      text: 'Grade-A corporate office complexes, commercial malls, and high-performance glass towers with LEED Gold certifications and adaptive floorplates.',
      img: 'images/glass.jpg',
      warranty: '12 Years Structural',
      standard: 'LEED Certified',
      lead: '12 – 30 Months'
    },
    industrial: {
      tag: 'SERVICE 03 / INDUSTRIAL',
      title: 'Industrial Construction',
      text: 'Heavy pre-engineered steel buildings, vibration-isolated manufacturing plants, automated logistics hubs, and heavy-tonnage foundation piling.',
      img: 'images/concrete.jpg',
      warranty: '15 Years Structural',
      standard: 'OSHA & ISO 14001',
      lead: '8 – 24 Months'
    },
    infrastructure: {
      tag: 'SERVICE 04 / INFRASTRUCTURE',
      title: 'Infrastructure Development',
      text: 'Centennial-grade civic engineering: prestressed multi-span bridges, highway transit corridors, urban drainage conduits, and civil masterworks.',
      img: 'images/city.jpg',
      warranty: '25 Years Structural',
      standard: 'AASHTO / IRC Compliant',
      lead: '18 – 48 Months'
    },
    renovation: {
      tag: 'SERVICE 05 / RENOVATION',
      title: 'Renovation & Redevelopment',
      text: 'Specialist structural retrofitting, carbon fiber reinforcement, heritage architectural restoration, and adaptive reuse conversions.',
      img: 'images/concrete.jpg',
      warranty: '10 Years Structural',
      standard: 'ISO 9001:2015',
      lead: '3 – 12 Months'
    }
  };

  function updateServicePreview(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;

    if (previewTag) previewTag.textContent = data.tag;
    if (previewTitle) previewTitle.textContent = data.title;
    if (previewText) previewText.textContent = data.text;
    if (previewImg) previewImg.src = data.img;
    if (previewWarranty) previewWarranty.textContent = data.warranty;
    if (previewStandard) previewStandard.textContent = data.standard;
    if (previewLead) previewLead.textContent = data.lead;
  }

  serviceItems.forEach(item => {
    const btn = $('.svc-btn', item);
    const serviceKey = item.dataset.service;

    // Click handler for accordion
    if (btn) {
      btn.addEventListener('click', () => {
        const isAlreadyOpen = item.classList.contains('open');
        serviceItems.forEach(el => {
          el.classList.remove('open');
          const elBtn = $('.svc-btn', el);
          if (elBtn) elBtn.setAttribute('aria-expanded', 'false');
        });

        if (!isAlreadyOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }

        updateServicePreview(serviceKey);
      });
    }

    // Hover handler to dynamically preview on desktop
    item.addEventListener('mouseenter', () => {
      updateServicePreview(serviceKey);
    });
  });

  // Service Quote shortcut triggers
  $$('.svc-quote-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const serviceType = trigger.dataset.serviceType;
      const formSelect = $('#form-type');
      if (formSelect && serviceType) {
        formSelect.value = `${serviceType} Construction`;
      }
      const quoteForm = $('#quote');
      if (quoteForm) {
        quoteForm.scrollIntoView({ behavior: 'smooth' });
        const nameInput = $('#form-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  });

  /* ==========================================================================
     7. EXTRA FEATURE: INSTANT PROJECT SCOPE & COST ESTIMATOR
     ========================================================================== */
  const estType = $('#est-type');
  const estArea = $('#est-area');
  const areaVal = $('#area-val');
  const estAmount = $('#est-amount');
  const estPerSqft = $('#est-per-sqft');
  const estTimeline = $('#est-timeline');
  const estSteel = $('#est-steel');
  const estConcrete = $('#est-concrete');
  const tierButtons = $$('.tier-btn');
  const estBookBtn = $('#est-book-btn');

  let currentTier = 'premium';

  // Base rates per square foot ($)
  const baseRates = {
    residential: { min: 80, max: 110, monthsPer10k: 12, steelFactor: 4.2, concreteFactor: 36 },
    commercial: { min: 115, max: 155, monthsPer10k: 16, steelFactor: 5.5, concreteFactor: 48 },
    industrial: { min: 65, max: 95, monthsPer10k: 10, steelFactor: 6.8, concreteFactor: 42 },
    infrastructure: { min: 140, max: 210, monthsPer10k: 20, steelFactor: 7.5, concreteFactor: 60 },
    renovation: { min: 45, max: 75, monthsPer10k: 8, steelFactor: 2.1, concreteFactor: 18 }
  };

  const tierMultipliers = {
    standard: 0.85,
    premium: 1.0,
    luxury: 1.45
  };

  function calculateEstimate() {
    if (!estType || !estArea) return;
    const type = estType.value;
    const area = parseInt(estArea.value, 10);
    const config = baseRates[type] || baseRates.residential;
    const multiplier = tierMultipliers[currentTier] || 1.0;

    if (areaVal) areaVal.textContent = area.toLocaleString();

    const lowRate = Math.round(config.min * multiplier);
    const highRate = Math.round(config.max * multiplier);

    const totalLow = Math.round(area * lowRate);
    const totalHigh = Math.round(area * highRate);

    if (estAmount) {
      estAmount.textContent = `$${totalLow.toLocaleString()} – $${totalHigh.toLocaleString()}`;
    }
    if (estPerSqft) {
      estPerSqft.textContent = `~$${lowRate} – $${highRate} per Sq. Ft.`;
    }

    // Dynamic timeline estimation
    if (estTimeline) {
      const calculatedMonths = Math.max(4, Math.round((area / 10000) * config.monthsPer10k));
      estTimeline.textContent = `${calculatedMonths} – ${Math.round(calculatedMonths * 1.3)} Months`;
    }

    // Material requirements
    if (estSteel) {
      const steelTons = Math.round((area / 1000) * config.steelFactor);
      estSteel.textContent = `~${steelTons} Metric Tons`;
    }
    if (estConcrete) {
      const concreteCuYds = Math.round((area / 1000) * config.concreteFactor);
      estConcrete.textContent = `~${concreteCuYds} Cu. Yards`;
    }
  }

  if (estArea) {
    estArea.addEventListener('input', calculateEstimate);
  }
  if (estType) {
    estType.addEventListener('change', calculateEstimate);
  }

  tierButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tierButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTier = btn.dataset.tier;
      calculateEstimate();
    });
  });

  // Transfer estimate to Quote form
  if (estBookBtn) {
    estBookBtn.addEventListener('click', () => {
      const selectedType = estType ? estType.options[estType.selectedIndex].text : 'Commercial';
      const area = estArea ? estArea.value : '5000';
      const costEstimate = estAmount ? estAmount.textContent : '';

      const formSelect = $('#form-type');
      const formMsg = $('#form-msg');

      if (formSelect) formSelect.value = selectedType;
      if (formMsg) {
        formMsg.value = `Estimated Project: ${selectedType}\nBuilt-Up Area: ${area} Sq. Ft.\nSpecification Tier: ${currentTier.toUpperCase()}\nBudget Projection: ${costEstimate}\n\nPlease contact me with architectural feasibility & tender documentation.`;
      }

      const quoteSection = $('#contact');
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: 'smooth' });
        const nameInput = $('#form-name');
        if (nameInput) setTimeout(() => nameInput.focus(), 600);
      }
    });
  }

  // Initial calculation run
  calculateEstimate();

  /* ==========================================================================
     8. PROJECTS FILTERING & 3D PERSPECTIVE TILT
     ========================================================================== */
  const filterTabs = $$('.p-tab');
  const projectCards = $$('.card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const filterValue = tab.dataset.filter;

      projectCards.forEach(card => {
        const category = card.dataset.category;
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // 3D Card Tilt on Hover (Desktop Only)
  if (window.matchMedia('(hover: hover)').matches) {
    projectCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transition = 'transform 0.1s ease';
        card.style.transform = `perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s var(--ease)';
        card.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     9. ARCHITECTURAL PROJECT MODAL VIEWER
     ========================================================================== */
  const modal = $('#project-modal');
  const modalContent = $('#modal-content');
  const modalClose = $('.modal-close');

  const projectDetails = {
    concrete: {
      title: 'Concrete Arch Works',
      category: 'INFRASTRUCTURE DEVELOPMENT',
      img: 'images/concrete.jpg',
      desc: 'Heavy reinforced brutalist arch works spanning over 240 meters. Featuring post-tensioned cantilever concrete beams designed for century-long structural resilience and zone-4 seismic dampening.',
      specs: [
        ['Location', 'Metropolitan Corridor, West'],
        ['Total Concrete Volume', '42,000 Cu. Meters'],
        ['Steel Grade', 'Fe 550D TMT Reinforcement'],
        ['Engineering Compliance', 'IRC:112-2020 / AASHTO'],
        ['Execution Timeline', '28 Months (Completed 2024)']
      ]
    },
    glass: {
      title: 'Borcelle Tower 2028',
      category: 'COMMERCIAL HIGH-RISE',
      img: 'images/glass.jpg',
      desc: 'A 42-story visionary financial headquarters featuring double-curved unitized curtain wall glazing, tuned mass vibration dampers, and LEED Platinum net-zero thermal envelope.',
      specs: [
        ['Location', 'Financial District Core'],
        ['Total Built-Up Area', '850,000 Sq. Ft.'],
        ['Floor Plate Span', 'Column-Free 18m Post-Tension Slabs'],
        ['Facade System', 'Triple-Glazed Low-E Ceramic Fritted'],
        ['Target Handover', 'Q4 2028 (Under Construction)']
      ]
    },
    skyline: {
      title: 'Skyline Residences',
      category: 'LUXURY RESIDENTIAL COMPLEX',
      img: 'images/contact.jpg',
      desc: 'High-density twin-tower residential development blending geometric concrete facades with cascading private sky gardens, smart home automation, and acoustic floor isolators.',
      specs: [
        ['Location', 'Uptown Parkway Enclave'],
        ['Unit Count', '184 Luxury Residences'],
        ['Structure Type', 'Shear Wall RCC Frame with Raft Foundation'],
        ['Green Rating', 'GRIHA 5-Star Certified'],
        ['Execution Timeline', '22 Months (Handover 2025)']
      ]
    }
  };

  function openProjectModal(key) {
    const data = projectDetails[key];
    if (!data || !modal || !modalContent) return;

    modalContent.innerHTML = `
      <div class="modal-project-view">
        <div class="m-img-wrap">
          <img src="${data.img}" alt="${data.title}">
        </div>
        <div class="m-info">
          <span class="sub-tag">${data.category}</span>
          <h3>${data.title}</h3>
          <p>${data.desc}</p>
          <table class="m-specs-table">
            <tbody>
              ${data.specs.map(([label, val]) => `
                <tr>
                  <td>${label}</td>
                  <td>${val}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <button type="button" class="m-btn" id="modal-quote-btn">REQUEST SIMILAR BLUEPRINT →</button>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');

    const modalQuoteBtn = $('#modal-quote-btn');
    if (modalQuoteBtn) {
      modalQuoteBtn.addEventListener('click', () => {
        closeProjectModal();
        const contactSec = $('#contact');
        if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  function closeProjectModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalKey = card.dataset.modal;
      if (modalKey) openProjectModal(modalKey);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modal) {
    $('.modal-backdrop', modal)?.addEventListener('click', closeProjectModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeProjectModal();
      }
    });
  }

  /* ==========================================================================
     10. CONTACT SECTION: ANIMATED CIRCLE MARK INTERACTION & QUOTE FORM
     ========================================================================== */
  const contactTitleWrap = $('.c-title-wrapper');
  const ringSvg = $('.ring-svg');

  // Magnetic & breathing wobble on cursor move over Contact Title
  if (contactTitleWrap && ringSvg) {
    contactTitleWrap.addEventListener('mousemove', (e) => {
      const rect = contactTitleWrap.getBoundingClientRect();
      const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
      const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
      ringSvg.style.transform = `rotate(${-3 + xNorm * 8}deg) scale(${1 + Math.abs(yNorm) * 0.08})`;
    });

    contactTitleWrap.addEventListener('mouseleave', () => {
      ringSvg.style.transform = 'rotate(-3deg) scale(1)';
    });
  }

  // Quote Form Submission Handling
  const quoteForm = $('#quote');
  const formFeedback = $('#form-feedback');
  const submitBtn = $('#submit-btn');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.n.value.trim();
      const phone = form.p.value.trim();
      const email = form.e.value.trim();
      const type = form.t.value;
      const message = form.m.value.trim();

      if (!name || !phone || !email || !message) {
        alert('Please complete all required fields.');
        return;
      }

      if (submitBtn) {
        submitBtn.innerHTML = `<span>TRANSMITTING TENDER DATA...</span>`;
        submitBtn.style.pointerEvents = 'none';
      }

      // Simulate formal dispatch with realistic confirmation
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = `<span>ENQUIRY RECEIVED ✓</span>`;
          submitBtn.style.background = '#00cc55';
          submitBtn.style.color = '#fff';
        }

        if (formFeedback) {
          formFeedback.className = 'form-feedback success';
          formFeedback.innerHTML = `<strong>Tender Reference #AX-${Math.floor(100000 + Math.random() * 900000)} Created</strong><br>Thank you, ${name}. A Senior Civil Estimator has been assigned to your ${type} inquiry and will reach out to ${phone} within 24 hours.`;
          formFeedback.style.display = 'block';
        }

        // Open mailto client in background as fallback
        const mailtoSubject = encodeURIComponent(`[AUREX TENDER] ${type} - ${name}`);
        const mailtoBody = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nSector: ${type}\n\nProject Scope:\n${message}`);
        const mailtoLink = `mailto:aurex@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        const fallbackLink = document.createElement('a');
        fallbackLink.href = mailtoLink;
        fallbackLink.style.display = 'none';
        document.body.appendChild(fallbackLink);
        // fallbackLink.click();
        document.body.removeChild(fallbackLink);

        quoteForm.reset();
      }, 1200);
    });
  }

  /* ==========================================================================
     11. FOOTER: LIVE GLOBAL HQ TIMEZONE CLOCK
     ========================================================================== */
  const hqClock = $('#hq-clock');
  function updateHqClock() {
    if (!hqClock) return;
    const now = new Date();
    // Indian Standard Time (UTC + 5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      hqClock.textContent = `HQ TIME: ${timeString} IST`;
    } catch {
      hqClock.textContent = `HQ TIME: ${now.toTimeString().split(' ')[0]} IST`;
    }
  }
  setInterval(updateHqClock, 1000);
  updateHqClock();

})();
