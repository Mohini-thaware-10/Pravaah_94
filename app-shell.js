// PRAVAAH Application Shell JavaScript
// Handles sidebar, navigation, modals, and responsive behavior

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Collapse/Expand
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapse');
    
    if (sidebarCollapseBtn && sidebar) {
        sidebarCollapseBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
        });
    }
    
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const headerMenuBtn = document.getElementById('headerMenuBtn');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.add('mobile-open');
        });
    }
    
    if (headerMenuBtn && sidebar) {
        headerMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            sidebar.classList.add('mobile-open');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (sidebar && !sidebar.contains(e.target)) {
                if (e.target !== mobileMenuBtn && e.target !== headerMenuBtn && 
                    !mobileMenuBtn.contains(e.target) && !headerMenuBtn.contains(e.target)) {
                    sidebar.classList.remove('mobile-open');
                }
            }
        }
    });
    
    // Prevent sidebar close when clicking inside
    if (sidebar) {
        sidebar.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Navigation
    const navItems = document.querySelectorAll('.nav__item[data-page]');
    const pages = document.querySelectorAll('.page');
    const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
    const headerSectionTitle = document.getElementById('headerSectionTitle');
    
    const pageTitles = {
        'overview': 'Overview',
        'approval-dashboard': 'Approval Dashboard',
        'applications': 'Applications',
        'workflow-tracking': 'Workflow Tracking',
        'document-verification': 'Document Verification',
        'compliance-monitoring': 'Compliance Monitoring',
        'deadline-alerts': 'Deadline & Alerts',
        'reports-analytics': 'Reports & Analytics',
        'approval-to-compliance': 'Approval-to-Compliance Continuity',
        'approval-stages': 'Approval Stages',
        'audit-trail': 'Audit Trail',
        'user-role-management': 'User & Role Management',
        'help': 'Help & Guidelines',
        'settings': 'Settings',
        'pre-submission-simulator': 'Pre-Submission Simulator',
        'trace-graph': 'Evidence-to-Decision Trace',
        'impact-map': 'Regulatory Change Impact',
        'notifications': 'Notifications',
        'my-tasks': 'My Tasks'
    };
    
    function navigateToPage(pageId) {
        // Update nav active state
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === pageId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Update pages
        pages.forEach(page => {
            if (page.id === 'page-' + pageId) {
                page.classList.add('active');
            } else {
                page.classList.remove('active');
            }
        });
        
        // Update header
        if (pageTitles[pageId]) {
            if (breadcrumbCurrent) {
                if (pageId === 'applications') {
                    breadcrumbCurrent.textContent = 'Applications';
                } else if (pageId === 'approval-dashboard') {
                    breadcrumbCurrent.textContent = 'Approval Dashboard';
                } else {
                    breadcrumbCurrent.textContent = pageTitles[pageId];
                }
            }
            if (headerSectionTitle) {
                if (pageId === 'applications') {
                    headerSectionTitle.textContent = 'Applications';
                } else if (pageId === 'approval-dashboard') {
                    headerSectionTitle.textContent = 'Approval Dashboard';
                } else {
                    headerSectionTitle.textContent = pageTitles[pageId];
                }
            }
        }
        
        // Close mobile sidebar
        if (sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    }
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });
    
    // Default to Dashboard on load
    if (document.querySelector('.nav__item[data-page="approval-dashboard"]')) {
        navigateToPage('approval-dashboard');
    }
     
    // Welcome panel links
    const welcomeLinks = document.querySelectorAll('.welcome-link[data-page]');
    welcomeLinks.forEach(link => {
        link.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                navigateToPage(pageId);
            }
        });
    });
    
    // New Workspace button
    const newWorkspaceBtn = document.getElementById('newWorkspaceBtn');
    if (newWorkspaceBtn) {
        newWorkspaceBtn.addEventListener('click', function() {
            alert('New View - UI only control. No backend records created.');
        });
    }
    
    // Search
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            searchOverlay.classList.add('active');
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        });
    }
    
    if (searchClose && searchOverlay) {
        searchClose.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
        });
    }
    
    if (searchOverlay) {
        const searchBackdrop = searchOverlay.querySelector('.overlay__backdrop');
        if (searchBackdrop) {
            searchBackdrop.addEventListener('click', function() {
                searchOverlay.classList.remove('active');
            });
        }
    }
    
    // Notifications
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationsOverlay = document.getElementById('notificationsOverlay');
    const notificationsClose = document.getElementById('notificationsClose');
    
    if (notificationBtn && notificationsOverlay) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationsOverlay.classList.add('active');
        });
    }
    
    if (notificationsClose && notificationsOverlay) {
        notificationsClose.addEventListener('click', function() {
            notificationsOverlay.classList.remove('active');
        });
    }
    
    if (notificationsOverlay) {
        const notificationsBackdrop = notificationsOverlay.querySelector('.overlay__backdrop');
        if (notificationsBackdrop) {
            notificationsBackdrop.addEventListener('click', function() {
                notificationsOverlay.classList.remove('active');
            });
        }
    }
    
    // Help button
    const helpBtn = document.getElementById('helpBtn');
    if (helpBtn) {
        helpBtn.addEventListener('click', function() {
            navigateToPage('help');
        });
    }
    
    // Profile dropdown
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
        });
    }
    
    // Close profile dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (profileDropdown && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
            profileDropdown.classList.remove('active');
        }
    });
    
    // Profile dropdown items
    const profileItems = document.querySelectorAll('.profile-dropdown__item');
    profileItems.forEach(item => {
        item.addEventListener('click', function() {
            profileDropdown.classList.remove('active');
            if (this.classList.contains('profile-dropdown__item--signout')) {
                // No authentication provider is configured in this demo, so there is
                // no session to destroy. Return the user to the sign-in screen.
                window.location.assign('signin.html');
            } else {
                alert(this.textContent + ' - UI only placeholder.');
            }
        });
    });
    
    // Escape key to close overlays
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (notificationsOverlay) notificationsOverlay.classList.remove('active');
            if (profileDropdown) profileDropdown.classList.remove('active');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
            }
        }
    });
    
    // Initialize - make sure overview is active
    navigateToPage('overview');
    initSimulatorPage();
    initTraceGraphPage();
    initImpactMapPage();
});
