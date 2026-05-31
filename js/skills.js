// ------------------------
// Skills loader + renderer
// ------------------------
(function () {

    function renderSkillPills(container, skills) {
        container.innerHTML = '';
        (skills || []).forEach(s => {
            const pill = document.createElement('div');
            pill.className = 'skill-pill';
            pill.textContent = s;
            container.appendChild(pill);
        });
    }

    // Exposed so projects.js can reuse it after skills data is loaded
    window._renderSkillPills = renderSkillPills;

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

        // Store data globally so projects.js can access it
        window._skillsData = data;

        // Skills category UI (index page)
        const skillsUi = document.getElementById('skills-ui');
        if (skillsUi && data.categories) {
            skillsUi.innerHTML = '';
            const isSWE = currentPath.includes('swe') || currentPath.includes('SWE');
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
                    const projectPages = isSWE ? 'project-pages-swe' : 'project-pages-ee';
                    a.href = it.type === 'project'
                        ? `./${projectPages}/${it.target}.html`
                        : `./experiences.html#${it.target}`;
                    a.textContent = it.label;
                    panel.appendChild(a);
                });

                btn.addEventListener('click', () => panel.classList.toggle('open'));

                col.appendChild(btn);
                col.appendChild(panel);
                skillsUi.appendChild(col);
            });
        }

        renderAllSkills(data);
    }

    function renderAllSkills(data) {
        // Project page full skill list
        document.querySelectorAll('.project-skills[data-project]').forEach(el => {
            const key = el.getAttribute('data-project');
            const skills = (data.projects && data.projects[key])
                || (data.experiences && data.experiences[key])
                || [];
            renderSkillPills(el, skills);
        });

        // Project card top-3 pills
        document.querySelectorAll('.project-card-skills[data-project]').forEach(el => {
            const key = el.getAttribute('data-project');
            const skills = (data.projects && data.projects[key]) || [];
            renderSkillPills(el, skills.slice(0, 3));
        });

        // Experience page skill pills
        document.querySelectorAll('.experience-skills[data-experience]').forEach(el => {
            const key = el.getAttribute('data-experience');
            const skills = (data.experiences && data.experiences[key]) || [];
            renderSkillPills(el, skills);
        });
    }

    // Expose for projects.js to call after cards are created
    window._renderAllSkills = renderAllSkills;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadSkills);
    } else {
        loadSkills();
    }

})();
