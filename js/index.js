// ------------------------
// Header image changer lol
// ------------------------
(function () {
    const headerImage = document.querySelector('.portfolio-header-image');

    if (headerImage) {
        // Create a custom tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = 'I like cats :)';
        tooltip.style.position = 'fixed';
        tooltip.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '6px 12px';
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '13px';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.15s ease';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.zIndex = '1000';
        tooltip.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';

        document.body.appendChild(tooltip);

        headerImage.addEventListener('mouseenter', () => {
            headerImage.src = './assets/images/goob-modified.png';
            tooltip.style.opacity = '1';
        });

        headerImage.addEventListener('mousemove', (e) => {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY + 15) + 'px';
        });

        headerImage.addEventListener('mouseleave', () => {
            headerImage.src = './assets/images/newprofilepic-modified.png';
            tooltip.style.opacity = '0';
        });
    }
})();

// ------------------------
// Interactive Cat Fun Facts
// ------------------------
(function () {
    const catContainer = document.getElementById('interactive-cat-container');
    const catIcon = document.getElementById('interactive-cat-icon');

    if (!catContainer || !catIcon) return;

    const funFacts = [
        "Eddie loves listening to music!",
        "Eddie enjoys learning about birds, trees, and bugs.",
        "Switzerland is at the top of Eddie's travel bucket list.",
        "Eddie plays Minecraft and Stardew Valley.",
        "Eddie likes playing wiffleball with friends.",
        "Eddie has built multiple PCBs for rockets that flown up to 30k ft!",
        "Try hovering over Eddie's profile picture!",
        "Eddie enjoys fast-paced hackathons!",
        "Check out Eddie's resume! 🐟"
    ];

    let unseenFacts = [...funFacts];

    // Idle blink animation
    function queueBlink() {
        const nextBlink = Math.random() * 4000 + 2000; // 2 to 6 seconds
        setTimeout(() => {
            catIcon.src = './assets/images/cat_closeeye.png';
            setTimeout(() => {
                catIcon.src = './assets/images/cat_openeye.png';
                queueBlink();
            }, 150); // Blink duration
        }, nextBlink);
    }
    queueBlink();

    let currentNote = null;
    let noteTimeout = null;

    catContainer.addEventListener('click', (e) => {
        // Trigger heart animation
        catContainer.classList.remove('show-heart');
        void catContainer.offsetWidth; // Force reflow to restart animation
        catContainer.classList.add('show-heart');

        showFunFactNote();
    });

    function showFunFactNote() {
        let factText;
        if (unseenFacts.length > 0) {
            const randomIndex = Math.floor(Math.random() * unseenFacts.length);
            factText = unseenFacts.splice(randomIndex, 1)[0];
        } else {
            factText = funFacts[Math.floor(Math.random() * funFacts.length)];
        }

        // If a note already exists, remove it first with a fade
        if (currentNote) {
            currentNote.classList.remove('visible');
            const oldNote = currentNote;
            setTimeout(() => oldNote.remove(), 300); // Wait for transition
            clearTimeout(noteTimeout);
        }

        const factEl = document.createElement('div');
        factEl.className = 'fun-fact-container';

        const textSpan = document.createElement('span');
        textSpan.textContent = factText;
        factEl.appendChild(textSpan);

        const closeBtn = document.createElement('div');
        closeBtn.className = 'fun-fact-close-btn';
        closeBtn.textContent = '✕';
        closeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent clicking through to other elements
            factEl.classList.remove('visible');
            setTimeout(() => factEl.remove(), 300);
            clearTimeout(noteTimeout);
            if (currentNote === factEl) currentNote = null;
        };
        factEl.appendChild(closeBtn);

        document.body.appendChild(factEl);
        currentNote = factEl;

        // Force reflow and add visible class to trigger transition
        void factEl.offsetWidth;
        factEl.classList.add('visible');

        // Auto remove after 10 seconds
        noteTimeout = setTimeout(() => {
            if (currentNote === factEl) {
                factEl.classList.remove('visible');
                setTimeout(() => factEl.remove(), 300);
                currentNote = null;
            }
        }, 10000);
    }
})();
