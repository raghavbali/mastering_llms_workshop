// Theme Management - Fixed to work without localStorage
class ThemeManager {
  constructor() {
    this.currentTheme = this.getInitialTheme();
    this.themeToggle = document.getElementById('themeToggle');
    this.init();
  }

  getInitialTheme() {
    // Check system preference only (no localStorage in sandbox)
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }

  bindEvents() {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleTheme();
      });
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        this.applyTheme(e.matches ? 'dark' : 'light');
      });
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    document.body.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    if (this.themeToggle) {
      this.themeToggle.innerHTML = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    }
  }
}

// Method Tab Management - Fixed to properly switch tabs
class MethodTabManager {
  constructor() {
    this.tabs = document.querySelectorAll('.method-tab');
    this.panels = document.querySelectorAll('.method-panel');
    this.init();
  }

  init() {
    this.bindEvents();
    // Ensure first tab is active on load
    if (this.tabs.length > 0) {
      this.switchTab(this.tabs[0].getAttribute('data-method'));
    }
  }

  bindEvents() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const methodId = tab.getAttribute('data-method');
        this.switchTab(methodId);
      });

      // Keyboard navigation
      tab.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const methodId = tab.getAttribute('data-method');
          this.switchTab(methodId);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          this.focusTab(index - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          this.focusTab(index + 1);
        }
      });
    });
  }

  switchTab(methodId) {
    // Remove active class from all tabs and panels
    this.tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
    });
    this.panels.forEach(panel => {
      panel.classList.remove('active');
      panel.setAttribute('aria-hidden', 'true');
    });

    // Add active class to selected tab and panel
    const selectedTab = document.querySelector(`[data-method="${methodId}"]`);
    const selectedPanel = document.getElementById(methodId);

    if (selectedTab && selectedPanel) {
      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-selected', 'true');
      selectedPanel.classList.add('active');
      selectedPanel.setAttribute('aria-hidden', 'false');

      // Smooth animation
      selectedPanel.style.opacity = '0';
      selectedPanel.style.transform = 'translateY(10px)';
      
      // Use requestAnimationFrame for smooth animation
      requestAnimationFrame(() => {
        selectedPanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        selectedPanel.style.opacity = '1';
        selectedPanel.style.transform = 'translateY(0)';
      });
    }
  }

  focusTab(index) {
    if (index >= 0 && index < this.tabs.length) {
      this.tabs[index].focus();
    } else if (index < 0) {
      this.tabs[this.tabs.length - 1].focus();
    } else {
      this.tabs[0].focus();
    }
  }
}

// Summary Diagram Navigation - Fixed to properly navigate to sections
class SummaryDiagramManager {
  constructor() {
    this.summaryStages = document.querySelectorAll('.summary-stage');
    this.init();
  }

  init() {
    this.bindEvents();
    this.makeAccessible();
  }

  makeAccessible() {
    this.summaryStages.forEach(stage => {
      const stageData = stage.getAttribute('data-stage');
      stage.setAttribute('tabindex', '0');
      stage.setAttribute('role', 'button');
      stage.setAttribute('aria-label', `Navigate to ${stageData} section`);
    });
  }

  bindEvents() {
    this.summaryStages.forEach(stage => {
      stage.addEventListener('click', (e) => {
        e.preventDefault();
        this.navigateToStage(stage.getAttribute('data-stage'));
      });

      stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.navigateToStage(stage.getAttribute('data-stage'));
        }
      });

      // Hover effects
      stage.addEventListener('mouseenter', () => {
        this.highlightStage(stage);
      });

      stage.addEventListener('mouseleave', () => {
        this.unhighlightStage(stage);
      });
    });
  }

  navigateToStage(stageId) {
    let targetElement = null;
    
    // Map stage IDs to actual element IDs
    const stageMapping = {
      'pretraining': 'pretraining',
      'branching': 'branching',
      'task-specific': 'branching', // Task-specific is part of branching
      'instruction': 'branching', // Instruction is part of branching
      'alignment': 'branching', // Alignment is part of branching
      'production': 'production'
    };

    const targetId = stageMapping[stageId];
    if (targetId) {
      targetElement = document.getElementById(targetId);
    }

    if (targetElement) {
      // Scroll to target with offset for fixed headers
      const targetPosition = targetElement.offsetTop - 20;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Add a temporary highlight
      targetElement.style.transition = 'box-shadow 0.3s ease';
      targetElement.style.boxShadow = '0 0 0 4px rgba(31, 184, 205, 0.3)';
      
      setTimeout(() => {
        targetElement.style.boxShadow = '';
      }, 2000);

      // If clicking on alignment, also show the alignment methods section
      if (stageId === 'alignment') {
        const alignmentSection = document.querySelector('.alignment-methods');
        if (alignmentSection) {
          setTimeout(() => {
            alignmentSection.scrollIntoView({
              behavior: 'smooth',
              block: 'center'
            });
          }, 500);
        }
      }
    }
  }

  highlightStage(stage) {
    const box = stage.querySelector('.summary-box');
    if (box) {
      box.style.transition = 'all 0.3s ease';
      box.style.transform = 'scale(1.05)';
      box.style.borderColor = 'var(--color-primary)';
      box.style.boxShadow = '0 4px 12px rgba(31, 184, 205, 0.3)';
    }
  }

  unhighlightStage(stage) {
    const box = stage.querySelector('.summary-box');
    if (box) {
      box.style.transform = 'scale(1)';
      box.style.borderColor = 'var(--color-border)';
      box.style.boxShadow = 'var(--shadow-xs)';
    }
  }
}

// Intersection Observer for Animations
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupObserver();
    }
  }

  setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, this.observerOptions);

    // Observe phase containers
    document.querySelectorAll('.phase-container').forEach(container => {
      observer.observe(container);
    });

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
      observer.observe(item);
    });
  }
}

// Tooltip Manager
class TooltipManager {
  constructor() {
    this.tooltip = this.createTooltip();
    this.init();
  }

  createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-base);
      padding: var(--space-12);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      pointer-events: none;
      opacity: 0;
      transition: opacity var(--duration-normal) var(--ease-standard);
      max-width: 300px;
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
      color: var(--color-text);
    `;
    document.body.appendChild(tooltip);
    return tooltip;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Add tooltips to complexity badges
    const complexityBadges = document.querySelectorAll('.complexity-badge');
    complexityBadges.forEach(badge => {
      badge.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, this.getComplexityTooltip(badge.textContent.trim()));
      });

      badge.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      badge.addEventListener('mousemove', (e) => {
        this.updateTooltipPosition(e);
      });
    });

    // Add tooltips to year badges
    const yearBadges = document.querySelectorAll('.year-badge');
    yearBadges.forEach(badge => {
      badge.addEventListener('mouseenter', (e) => {
        this.showTooltip(e, this.getYearTooltip(badge.textContent.trim()));
      });

      badge.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      badge.addEventListener('mousemove', (e) => {
        this.updateTooltipPosition(e);
      });
    });
  }

  showTooltip(event, content) {
    this.tooltip.innerHTML = content;
    this.tooltip.style.opacity = '1';
    this.updateTooltipPosition(event);
  }

  hideTooltip() {
    this.tooltip.style.opacity = '0';
  }

  updateTooltipPosition(event) {
    const tooltipRect = this.tooltip.getBoundingClientRect();
    let x = event.clientX + 10;
    let y = event.clientY + 10;

    // Keep tooltip in viewport
    if (x + tooltipRect.width > window.innerWidth) {
      x = event.clientX - tooltipRect.width - 10;
    }
    if (y + tooltipRect.height > window.innerHeight) {
      y = event.clientY - tooltipRect.height - 10;
    }

    this.tooltip.style.left = x + 'px';
    this.tooltip.style.top = y + 'px';
  }

  getComplexityTooltip(complexity) {
    const tooltips = {
      'Low Complexity': 'Simple implementation with minimal components and straightforward training process.',
      'Medium Complexity': 'Moderate implementation complexity with multiple stages and components.',
      'High Complexity': 'Complex implementation requiring multiple stages, specialized components, and significant resources.'
    };
    return tooltips[complexity] || 'Complexity information not available.';
  }

  getYearTooltip(year) {
    const tooltips = {
      '2018': 'Early adoption of task-specific fine-tuning approaches.',
      '2019': 'Breakthrough year for large-scale pre-training with models like GPT-2.',
      '2021': 'Introduction of instruction tuning and supervised fine-tuning methods.',
      '2022': 'Revolutionary year with RLHF, RLAIF, and Constitutional AI approaches.',
      '2023': 'Introduction of Direct Preference Optimization (DPO) simplifying alignment.',
      '2024': 'Latest advancement with ORPO providing single-step alignment process.'
    };
    return tooltips[year] || 'Historical information not available.';
  }
}

// Scroll Progress Indicator
class ScrollProgressManager {
  constructor() {
    this.progressBar = this.createProgressBar();
    this.init();
  }

  createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 3px;
      background: linear-gradient(90deg, var(--color-primary), var(--color-success));
      z-index: 1000;
      transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('scroll', () => {
      this.updateProgress();
    });
  }

  updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    this.progressBar.style.width = Math.min(progress, 100) + '%';
  }
}

// Enhanced Interactive Features
class InteractiveFeatures {
  constructor() {
    this.init();
  }

  init() {
    this.setupPhaseHover();
    this.setupBranchPathHover();
    this.setupTimelineHover();
  }

  setupPhaseHover() {
    const phaseContainers = document.querySelectorAll('.phase-container');
    phaseContainers.forEach(container => {
      container.addEventListener('mouseenter', () => {
        container.style.transform = 'translateY(-4px)';
      });

      container.addEventListener('mouseleave', () => {
        container.style.transform = 'translateY(0)';
      });
    });
  }

  setupBranchPathHover() {
    const branchPaths = document.querySelectorAll('.branch-path');
    branchPaths.forEach(path => {
      path.addEventListener('mouseenter', () => {
        path.style.transform = 'translateY(-2px)';
      });

      path.addEventListener('mouseleave', () => {
        path.style.transform = 'translateY(0)';
      });
    });
  }

  setupTimelineHover() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateX(8px)';
      });

      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateX(0)';
      });
    });
  }
}

// Main Application Controller
class LLMTrainingApp {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeComponents();
      });
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Initialize all components in order
    this.components.themeManager = new ThemeManager();
    this.components.methodTabManager = new MethodTabManager();
    this.components.summaryDiagramManager = new SummaryDiagramManager();
    this.components.animationManager = new AnimationManager();
    this.components.tooltipManager = new TooltipManager();
    this.components.scrollProgressManager = new ScrollProgressManager();
    this.components.interactiveFeatures = new InteractiveFeatures();

    // Setup resize handler
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Setup error handling
    window.addEventListener('error', this.handleError.bind(this));

    // Add loading complete class
    document.body.classList.add('app-loaded');
  }

  handleResize() {
    // Handle responsive adjustments
    const summaryDiagram = document.querySelector('.summary-diagram');
    if (summaryDiagram && window.innerWidth < 768) {
      summaryDiagram.style.flexDirection = 'column';
    } else if (summaryDiagram) {
      summaryDiagram.style.flexDirection = 'row';
    }
  }

  handleError(error) {
    console.error('Application error:', error);
  }
}

// Initialize the application
const app = new LLMTrainingApp();