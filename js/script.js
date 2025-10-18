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

// Save journal entries to localStorage
function saveJournalEntries(entries) {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
}

// Load journal entries from localStorage
function loadJournalEntries() {
    const entries = localStorage.getItem('journalEntries');
    return entries ? JSON.parse(entries) : [];
}

// Display all journal entries
function displayJournalEntries() {
    const entries = loadJournalEntries();
    const entriesContainer = document.getElementById('journal-entries-container');
    
    if (!entriesContainer) return;
    
    // Clear existing entries (except static ones)
    const staticEntries = entriesContainer.querySelectorAll('.static-entry');
    entriesContainer.innerHTML = '';
    
    // Add back static entries
    staticEntries.forEach(entry => {
        entriesContainer.appendChild(entry);
    });
    
    // Add dynamic entries from localStorage
    entries.forEach(entry => {
        const entryElement = createJournalEntryElement(entry.title, entry.content, entry.date, false);
        entriesContainer.appendChild(entryElement);
    });
    
    // Re-initialize collapsible sections
    initCollapsibleSections();
}

// Create journal entry element
function createJournalEntryElement(title, content, date, isStatic = true) {
    const entryHTML = `
        <article class="journal-entry collapsible ${isStatic ? 'static-entry' : ''}">
            <div class="collapsible-header">
                <h2>${title}</h2>
                <span class="toggle-icon">▼</span>
            </div>
            <div class="collapsible-content">
                <div class="entry-meta">Posted on: ${date}</div>
                <div class="entry-content">${content}</div>
            </div>
        </article>
    `;
    
    const template = document.createElement('template');
    template.innerHTML = entryHTML.trim();
    return template.content.firstChild;
}

// Create and save new journal entry
function createJournalEntry(title, content) {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateString = now.toLocaleDateString('en-US', options);
    
    // Create entry object
    const newEntry = {
        title: title,
        content: content,
        date: dateString,
        timestamp: now.getTime()
    };
    
    // Get existing entries
    const entries = loadJournalEntries();
    
    // Add new entry
    entries.unshift(newEntry); // Add to beginning so newest shows first
    
    // Save to localStorage
    saveJournalEntries(entries);
    
    // Refresh the display
    displayJournalEntries();
    
    return newEntry;
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
            
            // Create and save the new journal entry
            createJournalEntry(titleInput.value, entryInput.value);
            
            // Show success message
            alert('Journal entry submitted successfully! Your new entry has been added to the journal.');
            
            // Reset the form
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
            // Remove existing event listeners to avoid duplicates
            const newHeader = header.cloneNode(true);
            header.parentNode.replaceChild(newHeader, header);
            
            newHeader.addEventListener('click', function() {
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
    
    // Load and display journal entries (this will also initialize collapsible sections)
    if (window.location.pathname.includes('journal.html')) {
        displayJournalEntries();
    } else {
        initCollapsibleSections();
    }
    
    console.log('All JavaScript features initialized successfully!');
});