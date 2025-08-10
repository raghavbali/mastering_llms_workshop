// Slide Management
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Update slide counter
document.getElementById('totalSlides').textContent = totalSlides;

// Configuration data
let config = {};

// Theme Management - matching main site functionality
class ThemeManager {
    constructor() {
        this.currentTheme = this.getInitialTheme();
        this.themeToggle = null;
        this.init();
    }

    getInitialTheme() {
        // Always default to light mode
        return 'light';
    }

    init() {
        this.findThemeToggle();
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    findThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        if (!this.themeToggle) {
            setTimeout(() => {
                this.themeToggle = document.getElementById('themeToggle');
                if (this.themeToggle) {
                    this.bindEvents();
                    this.applyTheme(this.currentTheme);
                }
            }, 100);
        }
    }

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.removeEventListener('change', this.handleToggleChange);
            this.handleToggleChange = this.handleToggleChange.bind(this);
            this.themeToggle.addEventListener('change', this.handleToggleChange);
        }

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.applyTheme(e.matches ? 'dark' : 'light');
            });
        }
    }

    handleToggleChange(e) {
        const newTheme = e.target.checked ? 'dark' : 'light';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-color-scheme', theme);
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        if (this.themeToggle) {
            const shouldBeChecked = theme === 'dark';
            if (this.themeToggle.checked !== shouldBeChecked) {
                this.themeToggle.checked = shouldBeChecked;
            }
            this.themeToggle.setAttribute('aria-checked', shouldBeChecked ? 'true' : 'false');
        }
    }
}

// Load configuration from JSON
async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        populateSlideContent();
    } catch (error) {
        console.error('Error loading config:', error);
        // Use default values if config fails to load
        populateSlideContent();
    }
}

// Populate slide content dynamically
function populateSlideContent() {
    // Update footer on all slides
    const footers = document.querySelectorAll('.slide-footer');
    footers.forEach(footer => {
        footer.textContent = config.global?.footer_text || 'Mastering LLMs Workshop - Raghav Bali';
    });

    // Slide 1: Introduction
    if (config.slides?.slide1) {
        const slide1 = config.slides.slide1;
        document.getElementById('main-title').textContent = 
            resolveTemplate(slide1.title) || 'Mastering LLMs';
        document.getElementById('subtitle').textContent = 
            resolveTemplate(slide1.subtitle) || 'Training, Fine-Tuning and Best Practices';
        document.getElementById('instructor').textContent = 
            resolveTemplate(slide1.instructor) || 'Raghav Bali, Principal Data Scientist, DeliveryHero';
    }

    // Slide 2: Agenda
    if (config.slides?.slide2?.modules) {
        populateAgenda(config.slides.slide2.modules);
    }

    // Slide 3: Instructor
    if (config.slides?.slide3) {
        const slide3 = config.slides.slide3;
        document.getElementById('instructor-title').textContent = 
            resolveTemplate(slide3.title) || 'Raghav Bali';
        // Note: Photo and intro placeholders remain as placeholders for manual replacement
    }

    // Slide 4: Book Information
    if (config.slides?.slide4) {
        const slide4 = config.slides.slide4;
        
        // Update book content dynamically
        const bookTitle = document.getElementById('book-title');
        const bookDescription = document.getElementById('book-description');
        const bookCover = document.getElementById('book-cover-img');
        
        if (bookTitle && slide4.book_title) {
            bookTitle.textContent = slide4.book_title;
        }
        
        if (bookDescription && slide4.book_description) {
            bookDescription.innerHTML = slide4.book_description.replace(
                'Inspire your LLM journey!', 
                '<span class="book-highlight">Inspire your LLM journey!</span>'
            );
        }
        
        if (bookCover && slide4.book_cover) {
            bookCover.src = slide4.book_cover;
        }
    }

    // Slide 5: Getting Started
    if (config.slides?.slide5) {
        const slide5 = config.slides.slide5;
        
        // Update repository link
        const repoLink = document.getElementById('repo-link');
        if (repoLink && slide5.repository_link) {
            repoLink.innerHTML = `<code>git clone ${resolveTemplate(slide5.repository_link)}</code>`;
        }

        // Populate breaks
        if (slide5.breaks) {
            populateBreaks(slide5.breaks);
        }
    }

    // Slide 6: Let's Get Started
    if (config.slides?.slide6) {
        const slide6 = config.slides.slide6;
        const materialsLink = document.getElementById('materials-link');
        if (materialsLink && slide6.materials_link) {
            materialsLink.innerHTML = `
                <a href="${resolveTemplate(slide6.materials_link)}" target="_blank">
                    <code>Open: ${resolveTemplate(slide6.materials_link)}</code>
                </a>
            `;
        }
    }
}

// Resolve template variables (simple implementation)
function resolveTemplate(template) {
    if (!template || typeof template !== 'string') return template;
    
    return template.replace(/\{\{global\.(\w+)\}\}/g, (match, key) => {
        return config.global?.[key] || match;
    });
}

// Populate agenda items
function populateAgenda(modules) {
    const container = document.getElementById('agenda-container');
    if (!container) return;

    container.innerHTML = '';
    
    modules.forEach((module, index) => {
        const agendaItem = document.createElement('div');
        agendaItem.className = 'agenda-item';
        agendaItem.innerHTML = `
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <span class="agenda-duration">${module.duration} mins</span>
        `;
        container.appendChild(agendaItem);
    });
}

// Populate breaks schedule
function populateBreaks(breaks) {
    const container = document.getElementById('breaks-list');
    if (!container) return;

    container.innerHTML = '';
    
    breaks.forEach(breakItem => {
        const breakDiv = document.createElement('div');
        breakDiv.className = breakItem.highlight ? 'break-item networking-highlight' : 'break-item';
        breakDiv.innerHTML = `
            <span class="break-name">${breakItem.name}</span>
            <span class="break-time">${breakItem.time}</span>
        `;
        container.appendChild(breakDiv);
    });
}

// Show specific slide
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    currentSlideIndex = index;
    document.getElementById('currentSlide').textContent = index + 1;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').disabled = index === slides.length - 1;
}

// Change slide (navigation)
function changeSlide(direction) {
    const newIndex = currentSlideIndex + direction;
    
    if (newIndex >= 0 && newIndex < slides.length) {
        showSlide(newIndex);
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            changeSlide(-1);
            break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
            changeSlide(1);
            break;
        case 'Home':
            showSlide(0);
            break;
        case 'End':
            showSlide(slides.length - 1);
            break;
        case 'Escape':
            // Toggle fullscreen if supported
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                document.documentElement.requestFullscreen();
            }
            break;
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Presentation mode utilities
function enterPresentationMode() {
    document.documentElement.requestFullscreen();
}

function exitPresentationMode() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConfig();
    showSlide(0);
    
    // Initialize theme manager
    window.themeManager = new ThemeManager();
    
    // Add presentation mode shortcuts
    const nav = document.querySelector('.navigation');
    const presentationBtn = document.createElement('button');
    presentationBtn.textContent = '⛶ Present';
    presentationBtn.onclick = enterPresentationMode;
    nav.appendChild(presentationBtn);
});

// Auto-save presentation state
window.addEventListener('beforeunload', () => {
    localStorage.setItem('currentSlide', currentSlideIndex);
});

// Restore presentation state
window.addEventListener('load', () => {
    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide !== null) {
        showSlide(parseInt(savedSlide));
    }
});

// Export functions for external use
window.slideController = {
    showSlide,
    changeSlide,
    getCurrentSlide: () => currentSlideIndex,
    getTotalSlides: () => slides.length,
    enterPresentationMode,
    exitPresentationMode
};
