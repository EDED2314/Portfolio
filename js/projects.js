// ------------------------
// EE Projects dynamic loader + card flip
// ------------------------
(function () {

    async function loadProjectsEE() {
        const myWorkSection = document.getElementById('my-work-section');
        if (!myWorkSection) return;

        const currentPath = window.location.pathname;
        const isEEPage = currentPath.includes('ee-projects') || currentPath.includes('EE-projects');
        if (!isEEPage) return;

        let response;
        try {
            response = await fetch('./assets/data/projects-ee.json');
        } catch (e) {
            response = await fetch('../assets/data/projects-ee.json');
        }
        const data = await response.json();

        myWorkSection.innerHTML = '';

        data.sections.forEach(section => {
            const headerDiv = document.createElement('div');
            headerDiv.className = 'what-is-above-the-projects';
            headerDiv.innerHTML = section.title === 'Projects'
                ? `<span class="main-title-big">${section.title}</span><hr class="section-divider" />`
                : `<hr class="section-divider" /><span class="main-title-big">${section.title}</span><hr class="section-divider" />`;
            myWorkSection.appendChild(headerDiv);

            const containerDiv = document.createElement('div');
            containerDiv.className = 'projects-container';

            section.projects.forEach(project => {
                const card = document.createElement('div');
                card.className = 'project-card';
                card.setAttribute('data-project', project.key);
                card.setAttribute('data-color', project.color || '1');

                const inner = document.createElement('div');
                inner.className = 'project-card-inner';

                // Front face
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

                // Back face
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

                if (project.link) {
                    const btn = document.createElement('a');
                    btn.className = 'button read-more';
                    btn.href = project.link.href;
                    if (project.link.external) btn.target = '_blank';

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

                card.addEventListener('click', (e) => {
                    if (e.target.closest('a.button.read-more')) return;
                    card.classList.toggle('flipped');
                });

                containerDiv.appendChild(card);
            });

            myWorkSection.appendChild(containerDiv);
        });

        // Click outside → un-flip all cards
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.project-card')) {
                document.querySelectorAll('.project-card').forEach(c => c.classList.remove('flipped'));
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadProjectsEE);
    } else {
        loadProjectsEE();
    }

})();
