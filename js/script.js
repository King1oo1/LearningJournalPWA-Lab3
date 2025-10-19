// ===== REUSABLE NAVIGATION COMPONENT =====
function loadNavigation() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Create navigation HTML with template string
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <a href="index.html" class="nav-logo">Chandandeep Singh</a>
            
            <!-- Hamburger menu for mobile -->
            <input type="checkbox" id="nav-toggle" class="nav-toggle">
            <label for="nav-toggle" class="nav-toggle-label">
                <span></span><span></span><span></span> <!-- Hamburger bars -->
            </label>
            
            <ul class="nav-menu">
                <!-- Dynamic active class based on current page -->
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

// ===== LIVE DATE DISPLAY =====
function displayLiveDate() {
    const dateElement = document.getElementById('live-date'); // DOM selection by ID
    if (dateElement) {
        const now = new Date(); // Create Date object
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        // Format date and display it
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ===== THEME SWITCHER =====
function initThemeSwitcher() {
    const themeToggle = document.getElementById('theme-toggle'); // Get theme button
    
    // Check user's preferred color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Get saved theme or use OS preference
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Apply saved theme on page load
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = '☀️ Light Mode';
    }
    
    // Add click event listener to theme toggle button
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            // Toggle dark-theme class on body
            document.body.classList.toggle('dark-theme');
            
            let theme = 'light';
            if (document.body.classList.contains('dark-theme')) {
                theme = 'dark';
                this.textContent = '☀️ Light Mode'; // Update button text
            } else {
                this.textContent = '🌙 Dark Mode'; // Update button text
            }
            
            // Save theme preference to localStorage
            localStorage.setItem('theme', theme);
        });
    }
}

// ===== JOURNAL ENTRY CREATION =====
function createJournalEntry(title, content, date) {
    // Create HTML for new journal entry using template string
    const journalEntryHTML = `
        <article class="journal-entry collapsible">
            <div class="collapsible-header">
                <h2>${title}</h2> <!-- Dynamic title -->
                <span class="toggle-icon">▼</span>
            </div>
            <div class="collapsible-content">
                <div class="entry-meta">Posted on: ${date}</div> <!-- Dynamic date -->
                <div class="entry-content">
                    ${content.replace(/\n/g, '<br>')} <!-- Convert newlines to <br> tags -->
                </div>
            </div>
        </article>
    `;
    
    return journalEntryHTML;
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    const journalForm = document.getElementById('journal-form'); // Get form by ID
    
    if (journalForm) {
        // Add submit event listener to form
        journalForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form inputs
            const titleInput = document.getElementById('journal-title');
            const entryInput = document.getElementById('journal-entry');
            const title = titleInput.value.trim();
            const content = entryInput.value.trim();
            
            // Count words using regex to split and filter empty strings
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            
            // Validation checks
            if (!title) {
                alert('Please enter a title for your journal entry.');
                titleInput.focus(); // Focus on title input
                return false;
            }
            
            if (wordCount < 10) {
                alert(`Please write at least 10 words. You currently have ${wordCount} words.`);
                entryInput.focus(); // Focus on entry input
                return false;
            }
            
            // Create new journal entry
            const now = new Date();
            const dateString = now.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            const newEntryHTML = createJournalEntry(title, content, dateString);
            
            // Insert new entry after the form
            const journalFormSection = document.querySelector('.journal-form-section');
            if (journalFormSection) {
                journalFormSection.insertAdjacentHTML('afterend', newEntryHTML);
            }
            
            // Re-initialize collapsible sections to include new entry
            initCollapsibleSections();
            
            // Show success message
            alert('Journal entry added successfully!');
            
            // Reset form fields
            journalForm.reset();
            
            return true;
        });
    }
}

// ===== COLLAPSIBLE SECTIONS =====
function initCollapsibleSections() {
    // Get all collapsible headers using querySelectorAll
    const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
    
    // Remove existing event listeners by cloning nodes
    collapsibleHeaders.forEach(header => {
        header.replaceWith(header.cloneNode(true));
    });
    
    // Re-select headers after cloning
    const freshHeaders = document.querySelectorAll('.collapsible-header');
    
    freshHeaders.forEach(header => {
        // Find the corresponding content section
        const content = header.nextElementSibling;
        
        if (content && content.classList.contains('collapsible-content')) {
            // Add click event to each header
            header.addEventListener('click', function() {
                // Toggle content visibility
                if (content.style.display === 'block' || content.style.display === '') {
                    content.style.display = 'none';
                    this.classList.remove('active');
                    // Reset toggle icon
                    const toggleIcon = this.querySelector('.toggle-icon');
                    if (toggleIcon) {
                        toggleIcon.style.transform = 'rotate(0deg)';
                    }
                } else {
                    content.style.display = 'block';
                    this.classList.add('active');
                    // Rotate toggle icon
                    const toggleIcon = this.querySelector('.toggle-icon');
                    if (toggleIcon) {
                        toggleIcon.style.transform = 'rotate(180deg)';
                    }
                }
            });
            
            // Start with all sections collapsed
            content.style.display = 'none';
        }
    });
}

// ===== INITIALIZE ALL FEATURES =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - initializing JavaScript features');
    
    // Load all features in order
    loadNavigation();      // 1. Reusable navigation
    displayLiveDate();     // 2. Live date display
    initThemeSwitcher();   // 3. Theme switcher
    initFormValidation();  // 4. Form validation
    initCollapsibleSections(); // 5. Collapsible sections
    
    console.log('All JavaScript features initialized successfully!');
    
    // Debug information
    console.log('DOM Selection Methods Used:');
    console.log('- getElementById: for single elements like live-date, theme-toggle');
    console.log('- querySelectorAll: for multiple elements like collapsible sections');
});