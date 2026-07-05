// GitHub API Configuration
const GITHUB_USERNAME = 'eecheonwu';
const GITHUB_API_BASE = 'https://api.github.com';

// Project categorization
const projectCategories = {
    'ai-ml': {
        repos: ['ammi-ml-proj', 'mlprojects', 'NLP', 'Project', 'image-processing', 'Vegetation_monitoring'],
        name: 'AI & Machine Learning'
    },
    'gis': {
        repos: ['GIS_mapping_project'],
        name: 'Geospatial & Mapping'
    },
    'se': {
        repos: ['scse-knowledge-base', 'ssot_centric_framework', 'SSOT-driven-feature-evolution', 'clinic_app'],
        name: 'Software Engineering & Frameworks'
    },
    'other': {
        repos: ['eecheonwu'],
        name: 'Other Projects'
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    setupSmoothScroll();
    setupNavigation();
});

// Load projects from GitHub API
async function loadProjects() {
    try {
        // Fetch all user repositories
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
        const repos = await response.json();

        // Categorize and display projects
        for (const [categoryKey, category] of Object.entries(projectCategories)) {
            const categoryRepos = repos.filter(repo => category.repos.includes(repo.name));
            displayCategory(categoryKey, categoryRepos);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Display projects by category
function displayCategory(categoryKey, repos) {
    const container = document.getElementById(`${categoryKey}-projects`);
    if (!container) return;

    container.innerHTML = '';

    repos.forEach(repo => {
        const card = createProjectCard(repo);
        container.appendChild(card);
    });
}

// Create project card element
function createProjectCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const language = repo.language || 'Unknown';
    const description = repo.description || 'No description available';
    const stars = repo.stargazers_count || 0;

    card.innerHTML = `
        <h4>${repo.name}</h4>
        ${repo.language ? `<span class="language">${language}</span>` : ''}
        <p>${description}</p>
        <div style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-light); margin-bottom: 1rem;">
            <span>⭐ ${stars} stars</span>
            <span>👀 ${repo.watchers_count} watchers</span>
        </div>
        <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
    `;

    return card;
}

// Smooth scroll navigation
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Setup navigation active state
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Add loading animation
function showLoadingState() {
    const projectContainers = document.querySelectorAll('[id$="-projects"]');
    projectContainers.forEach(container => {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-light);">Loading repositories...</div>';
    });
}