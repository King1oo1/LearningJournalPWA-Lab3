// js/script.js - Main JavaScript file for DOM manipulation

// Reusable Navigation Function
function loadNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">Chandandeep Singh</a>
            
            <input type="checkbox" id="nav-toggle" class="nav-toggle">
            <label for="nav-toggle" class="nav-toggle-label">
                <span></span>
                <span></span>
                <span></span>
            </label>
            
            <ul class="nav-menu">
                <li><a href="index.html" class="${currentPage === 'index.html' ? 'active' : ''}">Home</a></li>
                <li><a href="journal.html" class="${currentPage === 'journal.html' ? 'active' : ''}">Journal</a></li>
                <li><a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a></li>
                <li><a href="projects.html" class="${currentPage === 'projects.html' ? 'active' : ''}">Projects</a></li>
            </ul>
        </div>
    </nav>`;
    
    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

// Live Date Display
function displayLiveDate() {
    const dateElement = document.getElementById('live-date');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Theme Switcher
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme or prefer OS theme
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply the theme
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
    }
    
    // Toggle theme when button is clicked
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                this.textContent = '☀️ Light Mode';
            } else {
                this.textContent = '🌙 Dark Mode';
            }
            
            localStorage.setItem('theme', theme);
        });
    }
}

// Form Validation for Journal Page
function initFormValidation() {
    const journalForm = document.getElementById('journal-form');
    
    if (journalForm) {
        journalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const titleInput = document.getElementById('journal-title');
            const entryInput = document.getElementById('journal-entry');
            const wordCount = entryInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
            
            if (wordCount < 10) {
                alert(`Please write at least 10 words. You currently have ${wordCount} words.`);
                entryInput.focus();
                return false;
            }
            
            // If validation passes, show success message
            alert('Journal entry submitted successfully!');
            journalForm.reset();
            return true;
        });
    }
}

// Collapsible Sections
function initCollapsibleSections() {
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(section => {
        const header = section.querySelector('.collapsible-header');
        const content = section.querySelector('.collapsible-content');
        
        if (header && content) {
            header.addEventListener('click', function() {
                const isOpen = content.style.display === 'block';
                content.style.display = isOpen ? 'none' : 'block';
                this.classList.toggle('active');
                
                // Update toggle icon
                const toggleIcon = this.querySelector('.toggle-icon');
                if (toggleIcon) {
                    toggleIcon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
            
            // Start with content collapsed
            content.style.display = 'none';
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing JavaScript features');
    
    // Load reusable navigation
    loadNavigation();
    
    // Initialize all features
    displayLiveDate();
    initThemeSwitcher();
    initFormValidation();
    initCollapsibleSections();
    
    console.log('All JavaScript features initialized successfully!');
    
    // Demonstrate DOM selection methods
    console.log('DOM Selection Methods Used:');
    console.log('- getElementById: for single elements like live-date, theme-toggle');
    console.log('- querySelectorAll: for multiple elements like collapsible sections');
});