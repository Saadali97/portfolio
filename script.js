const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const menuToggle = document.getElementById('menu-toggle');
const mainNav = document.getElementById('main-nav');
const progressBar = document.getElementById('progress-bar');

const savedTheme = localStorage.getItem('saad-portfolio-theme');
if (savedTheme === 'light' || savedTheme === 'dark') html.dataset.theme = savedTheme;

function updateThemeButton() {
  const isLight = html.dataset.theme === 'light';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
  document.querySelector('meta[name="theme-color"]').content = isLight ? '#f4f5ed' : '#101515';
}
updateThemeButton();

themeToggle.addEventListener('click', () => {
  html.dataset.theme = html.dataset.theme === 'light' ? 'dark' : 'light';
  localStorage.setItem('saad-portfolio-theme', html.dataset.theme);
  updateThemeButton();
});

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  mainNav.classList.toggle('is-open', !isOpen);
});

mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  });
});

const filterButtons = [...document.querySelectorAll('.filter-btn')];
const projectCards = [...document.querySelectorAll('.project-card')];
const projectCount = document.getElementById('project-count');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let shown = 0;
    projectCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !visible);
      if (visible) shown += 1;
    });
    projectCount.textContent = `SHOWING ${String(shown).padStart(2, '0')} PROJECT${shown === 1 ? '' : 'S'}`;
  });
});

const projectDetails = {
  'industrial-rag': {
    number: '01', category: 'APPLIED AI / RETRIEVAL', title: 'German Industrial RAG Assistant',
    summary: 'A German-language learning assistant for beginner questions about industrial control systems, grounded in a small collection of technical textbook pages.',
    idea: 'Help learners get clear explanations while keeping answers tied to reliable material. When the source passages do not support an answer, the assistant says so.',
    build: 'Collected and segmented technical text, created multilingual embeddings, retrieved relevant passages, and used Gemini to write source-supported answers. The repository includes a notebook and a small manual evaluation.',
    stack: ['Python', 'Sentence Transformers', 'Gemini', 'Google Colab'],
    repo: 'https://github.com/Saadali97/german-industrial-rag-assistant'
  },
  'carbon-canary': {
    number: '02', category: 'APPLIED AI / ANALYTICS', title: 'Carbon Canary',
    summary: 'A Scope 3 emissions analytics prototype for manufacturers in the Germany–Poland corridor, created for Climathon 2026.',
    idea: 'Make emissions reporting easier to explore by turning common business documents into a structured view of category coverage and benchmark gaps.',
    build: 'Built a React dashboard and Node.js / Express API for document upload, emission-relevant data extraction, scoring across ten Scope 3 categories, benchmark comparisons, and visual summaries.',
    stack: ['React', 'Node.js', 'Express', 'Data visualization'],
    repo: 'https://github.com/Saadali97/carbon-canary'
  },
  carebot: {
    number: '03', category: 'APPLICATIONS / CONVERSATIONAL AI', title: 'CareBot Assist',
    summary: 'A Rasa conversational assistant for a few practical healthcare-administration workflows.',
    idea: 'Let someone complete simple tasks through natural conversation, with each request routed to a specific action.',
    build: 'Configured intents, domain responses, and custom actions for appointment booking, symptom logging, and medication reminders.',
    stack: ['Python', 'Rasa', 'NLU', 'Custom actions'],
    repo: 'https://github.com/Saadali97/Carebot-Assistant'
  },
  survey: {
    number: '04', category: 'ANALYTICS / DASHBOARDING', title: 'Data Professional Survey Breakdown',
    summary: 'An interactive Power BI dashboard built from survey responses by 630 data professionals.',
    idea: 'Bring a broad survey into one exploratory view so people can compare roles, pay, technology preferences, geography, and satisfaction.',
    build: 'Prepared and modeled the survey data, then used Power BI and DAX measures to organize the comparisons and interactive visuals.',
    stack: ['Power BI', 'Excel', 'DAX', 'Data visualization'],
    repo: 'https://github.com/Saadali97/Power-BI-Data-Professional-Survey-Breakdown'
  }
};

const projectDialog = document.getElementById('project-dialog');
const dialogBackdrop = document.getElementById('dialog-backdrop');
const dialogClose = document.getElementById('dialog-close');
let lastDialogTrigger = null;

function closeProjectDialog() {
  if (!projectDialog.open) return;
  projectDialog.close();
  lastDialogTrigger?.focus();
}

document.querySelectorAll('[data-project]').forEach((button) => {
  button.addEventListener('click', () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;
    lastDialogTrigger = button;
    document.getElementById('dialog-kicker').textContent = `PROJECT NOTES / ${project.number} · ${project.category}`;
    document.getElementById('dialog-title').textContent = project.title;
    document.getElementById('dialog-summary').textContent = project.summary;
    document.getElementById('dialog-idea').textContent = project.idea;
    document.getElementById('dialog-build').textContent = project.build;
    document.getElementById('dialog-stack').replaceChildren(...project.stack.map((label) => {
      const tag = document.createElement('span');
      tag.textContent = label;
      return tag;
    }));
    const repoLink = document.getElementById('dialog-repo');
    repoLink.href = project.repo;
    projectDialog.showModal();
    dialogClose.focus();
  });
});

dialogClose.addEventListener('click', closeProjectDialog);
dialogBackdrop.addEventListener('click', closeProjectDialog);
projectDialog.addEventListener('click', (event) => {
  if (event.target === projectDialog) closeProjectDialog();
});
projectDialog.addEventListener('close', () => lastDialogTrigger?.focus());

const revealElements = document.querySelectorAll('.capability-card, .project-card, .tool-group, .timeline-item, .credentials-card');
revealElements.forEach((element) => element.setAttribute('data-reveal', ''));
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

const sectionLinks = [...document.querySelectorAll('.main-nav a')];
const observedSections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('is-current', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  observedSections.forEach((section) => navObserver.observe(section));
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
}
window.addEventListener('scroll', updateScrollProgress, { passive: true });
updateScrollProgress();
document.getElementById('year').textContent = String(new Date().getFullYear());
