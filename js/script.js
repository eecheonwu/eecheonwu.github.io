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
    setupMobileMenu();
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

    if (repos.length === 0) {
        container.innerHTML = '<div class="loading-state">No repositories found.</div>';
        return;
    }

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
        <div class="project-stats">
            <span>⭐ ${stars}</span>
            <span>👀 ${repo.watchers_count}</span>
        </div>
        <a href="${repo.html_url}" target="_blank">View on GitHub &rarr;</a>
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
            if (pageYOffset >= sectionTop - 100) {
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

// Setup mobile menu
function setupMobileMenu() {
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isFlex = navLinks.style.display === 'flex';
            navLinks.style.display = isFlex ? 'none' : 'flex';
            
            if (!isFlex) {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
                navLinks.style.padding = '1.5rem';
                navLinks.style.borderBottom = '1px solid var(--border)';
                navLinks.style.boxShadow = 'var(--shadow-md)';
                navLinks.style.gap = '1.5rem';
            }
        });

        // Close menu on link click (mobile)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.style.display = 'none';
                }
            });
        });
        
        // Reset styles on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'row';
                navLinks.style.position = 'static';
                navLinks.style.backgroundColor = 'transparent';
                navLinks.style.padding = '0';
                navLinks.style.borderBottom = 'none';
                navLinks.style.boxShadow = 'none';
                navLinks.style.gap = '2rem';
            } else {
                navLinks.style.display = 'none';
            }
        });
    }
}