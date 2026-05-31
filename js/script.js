// ------------------------
// Navbar loader
// ------------------------
(function () {
  // Count folder depth
  const pathParts = window.location.pathname.split('/').filter(p => p); // remove empty parts
  depth = pathParts.length - 1; // number of folders deep

  if (window.location.pathname.includes('Protfolio')) {
    depth -= 1;
  }

  // Construct prefix for assets and index.html
  let prefix = '';
  for (let i = 0; i < depth; i++) prefix += '../';

  // Pick correct path to navbar.html
  const navbarPath = prefix + 'navbar.html';

  fetch(navbarPath)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.text();
    })
    .then(data => {
      // Fix relative links inside navbar
      if (prefix) {
        data = data.replaceAll('./assets/', prefix + 'assets/');
        data = data.replaceAll('./index.html', prefix + 'index.html');
        data = data.replaceAll('./experiences.html', prefix + 'experiences.html');
      }
      // Inject into page
      document.getElementById('navbar-placeholder').innerHTML = data;
      // Notify listeners that navbar HTML has been injected (some code may need to re-measure)
      window.dispatchEvent(new Event('navbar:loaded'));
    })
    .catch(err => console.error('Failed to load navbar:', err));
})();


(function () {
  const hero = document.getElementById('hero');
  const page = hero ? document.querySelector('.page-content') : null;

  // Navbar may be injected asynchronously. Use helpers that query it on-demand.
  function getNavbar() {
    return document.querySelector('.navbar');
  }

  function getNavbarHeight() {
    const n = getNavbar();
    return n ? n.offsetHeight : 0;
  }

  function setNavVar() {
    document.documentElement.style.setProperty('--navbar-height', `${getNavbarHeight()}px`);
  }

  // Initialize and update on resize; also update when navbar HTML is injected
  setNavVar();
  window.addEventListener('resize', setNavVar);
  window.addEventListener('navbar:loaded', setNavVar);

  if (hero) {
    document.body.classList.add('has-hero');
  } else {
    document.body.classList.add('no-hero');
  }

  // Reset scroll position to top and hide content on page load if we have a hero
  if (hero && page && page.classList.contains('hidden')) {
    window.scrollTo(0, 0);
    page.style.display = 'none';
  }

  function scrollToElementWithOffset(element, offset) {
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
  }

  function revealAndScroll(targetSelector) {
    if (!page) return;
    if (page.classList.contains('revealed')) {
      if (targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) {
          const navbarHeight = getNavbarHeight();
          scrollToElementWithOffset(target, navbarHeight);
        }
      }
      return;
    }

    page.style.display = 'flex';
    page.classList.add('revealed');

    // allow the browser to render the revealed content then scroll
    // use two requestAnimationFrame calls to ensure layout/paint are complete
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (targetSelector) {
          const target = document.querySelector(targetSelector);
          if (target) {
            const navbarHeight = getNavbarHeight();
            scrollToElementWithOffset(target, navbarHeight);
          }
        } else {
          const navbarHeight = getNavbarHeight();
          scrollToElementWithOffset(page, navbarHeight);
        }
      });
    });

    window.removeEventListener('wheel', onFirstScroll);
    window.removeEventListener('touchstart', onFirstScroll);
    window.removeEventListener('keydown', onFirstKey);
  }

  function onFirstScroll() { revealAndScroll(); }
  function onFirstKey(e) {
    if (e && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) revealAndScroll();
  }

  window.addEventListener('wheel', onFirstScroll, { once: true, passive: true });
  window.addEventListener('touchstart', onFirstScroll, { once: true, passive: true });
  window.addEventListener('keydown', onFirstKey, { once: true });


})();



// ------------------------------------
// Project & Skills Dynamic Loader
// ------------------------------------
(function () {
  
  // Helper to render skill pills
  function renderSkillPills(container, skills) {
    container.innerHTML = '';
    (skills || []).forEach(s => {
      const pill = document.createElement('div');
      pill.className = 'skill-pill';
      pill.textContent = s;
      container.appendChild(pill);
    });
  }

  // Load and render projects dynamically for EE projects page
  async function loadProjectsEE() {
    const myWorkSection = document.getElementById('my-work-section');
    if (!myWorkSection) return;

    const currentPath = window.location.pathname;
    const isEEPage = currentPath.includes('ee-projects') || currentPath.includes('EE-projects');
    if (!isEEPage) return;

    try {
      let response;
      try {
        response = await fetch('./assets/data/projects-ee.json');
      } catch (e) {
        // Fallback if needed
        response = await fetch('../assets/data/projects-ee.json');
      }
      const data = await response.json();

      myWorkSection.innerHTML = ''; // clear initial content

      data.sections.forEach(section => {
        // Create section header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'what-is-above-the-projects';

        if (section.title === 'Projects') {
          headerDiv.innerHTML = `
            <span class="main-title-big">${section.title}</span>
            <hr class="section-divider" />
          `;
        } else {
          headerDiv.innerHTML = `
            <hr class="section-divider" />
            <span class="main-title-big">${section.title}</span>
            <hr class="section-divider" />
          `;
        }
        myWorkSection.appendChild(headerDiv);

        // Create projects container grid
        const containerDiv = document.createElement('div');
        containerDiv.className = 'projects-container';

        section.projects.forEach(project => {
          const card = document.createElement('div');
          card.className = 'project-card';
          card.setAttribute('data-project', project.key);
          card.setAttribute('data-color', project.color || '1');

          const inner = document.createElement('div');
          inner.className = 'project-card-inner';

          // FRONT
          const front = document.createElement('div');
          front.className = 'project-card-front';

          const imgContainer = document.createElement('div');
          imgContainer.className = `project-image-container${project.containImage ? ' contain-image' : ''}`;

          const img = document.createElement('img');
          img.className = 'project-image';
          img.src = project.image;
          imgContainer.appendChild(img);

          const frontTitle = document.createElement('div');
          frontTitle.className = 'project-card-front-title';
          frontTitle.textContent = project.title;

          const flipHint = document.createElement('span');
          flipHint.className = 'flip-hint';
          flipHint.textContent = '↻ Click to flip';

          front.appendChild(imgContainer);
          front.appendChild(frontTitle);
          front.appendChild(flipHint);

          // BACK
          const back = document.createElement('div');
          back.className = 'project-card-back';

          const title = document.createElement('div');
          title.className = 'project-title';
          title.textContent = project.title;

          const desc = document.createElement('div');
          desc.className = 'body-text project-card-text';
          desc.textContent = project.description;

          const skills = document.createElement('div');
          skills.className = 'project-card-skills';
          skills.setAttribute('data-project', project.key);

          back.appendChild(title);
          back.appendChild(desc);
          back.appendChild(skills);

          // Link/button
          if (project.link) {
            const btn = document.createElement('a');
            btn.className = 'button read-more';
            btn.href = project.link.href;
            if (project.link.external) {
              btn.target = '_blank';
            }

            const btnText = document.createElement('span');
            btnText.className = 'button-text';
            btnText.textContent = project.link.text || 'Read More';

            const arrowIcon = document.createElement('img');
            arrowIcon.src = './assets/icons/arrow-right.svg';
            arrowIcon.className = 'right-arrow-icon';

            btn.appendChild(btnText);
            btn.appendChild(arrowIcon);
            back.appendChild(btn);
          }

          inner.appendChild(front);
          inner.appendChild(back);
          card.appendChild(inner);

          // Card flip interaction
          card.addEventListener('click', (e) => {
            if (e.target.closest('a.button.read-more')) return;
            card.classList.toggle('flipped');
          });

          containerDiv.appendChild(card);
        });

        myWorkSection.appendChild(containerDiv);
      });

      // Click outside any flipped card → un-flip all
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.project-card')) {
          const cards = document.querySelectorAll('.project-card');
          cards.forEach(c => c.classList.remove('flipped'));
        }
      });

    } catch (err) {
      console.error('Failed to load projects JSON:', err);
    }
  }

  // Load and render skills on all pages (experience, projects, index)
  async function loadSkills() {
    const currentPath = window.location.pathname;
    const isSWEPage = currentPath.includes('swe') || currentPath.includes('SWE');
    const skillsFileName = isSWEPage ? 'skills-swe.json' : 'skills.json';

    let data;
    try {
      const res = await fetch(`./assets/data/${skillsFileName}`);
      data = await res.json();
    } catch (e) {
      try {
        const res = await fetch(`../assets/data/${skillsFileName}`);
        data = await res.json();
      } catch (err) {
        console.error('Failed to load skills JSON:', err);
        return;
      }
    }

    // Render skills UI on index page
    const skillsUi = document.getElementById('skills-ui');
    if (skillsUi && data.categories) {
      skillsUi.innerHTML = '';
      data.categories.forEach(cat => {
        const col = document.createElement('div');
        col.className = 'skills-category';

        const btn = document.createElement('button');
        btn.className = 'skills-category-button';
        btn.textContent = cat.name;
        btn.type = 'button';

        const panel = document.createElement('div');
        panel.className = 'skills-dropdown';

        (cat.items || []).forEach(it => {
          const a = document.createElement('a');
          a.className = 'skills-link';
          const projectPages = isSWEPage ? 'project-pages-swe' : 'project-pages-ee';
          if (it.type === 'project') {
            a.href = `./${projectPages}/${it.target}.html`;
          } else {
            a.href = `./experiences.html#${it.target}`;
          }
          a.textContent = it.label;
          panel.appendChild(a);
        });

        btn.addEventListener('click', () => {
          panel.classList.toggle('open');
        });

        col.appendChild(btn);
        col.appendChild(panel);
        skillsUi.appendChild(col);
      });
    }

    // Render project page skills (full list)
    document.querySelectorAll('.project-skills[data-project]').forEach(el => {
      const key = el.getAttribute('data-project');
      const skills = data.projects && data.projects[key] ? data.projects[key] : (data.experiences && data.experiences[key] ? data.experiences[key] : []);
      renderSkillPills(el, skills);
    });

    // Render top-3 on project cards
    document.querySelectorAll('.project-card-skills[data-project]').forEach(el => {
      const key = el.getAttribute('data-project');
      const skills = data.projects && data.projects[key] ? data.projects[key] : [];
      renderSkillPills(el, skills.slice(0, 3));
    });

    // Render experience skills
    document.querySelectorAll('.experience-skills[data-experience]').forEach(el => {
      const key = el.getAttribute('data-experience');
      const skills = (data.experiences && data.experiences[key]) ? data.experiences[key] : [];
      renderSkillPills(el, skills);
    });
  }

  // Initialize: load projects first (if on EE page), then load skills
  async function init() {
    await loadProjectsEE();
    await loadSkills();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

// --- Image Gallery Module ---
document.querySelectorAll("[data-gallery]").forEach(gallery => {
  const mainImg = gallery.querySelector(".gallery-main");
  const thumbs = gallery.querySelectorAll(".gallery-thumbs img");

  thumbs.forEach(thumb => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;

      // highlight selected thumbnail
      thumbs.forEach(t => t.classList.remove("active-thumb"));
      thumb.classList.add("active-thumb");
    });
  });
});

// --- Flippable Project Cards ---
(function () {
  const cards = document.querySelectorAll('.project-card');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't flip if the user clicked a link/button on the back
      if (e.target.closest('a.button.read-more')) return;

      card.classList.toggle('flipped');
    });
  });

  // Click outside any flipped card → un-flip all
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.project-card')) {
      cards.forEach(c => c.classList.remove('flipped'));
    }
  });
})();
