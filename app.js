// PRAVAAH Landing Page JavaScript
// Handles navigation, smooth scrolling, and mobile menu

document.addEventListener('DOMContentLoaded', function() {
    // Set copyright year dynamically
    const copyrightYear = new Date().getFullYear();
    const yearSpan = document.getElementById('copyright-year');
    if (yearSpan) {
        yearSpan.textContent = copyrightYear;
    }

    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav__menu .nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', false);
            });
        });
    }
    
    // Smooth scroll offset for sticky header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                return;
            }
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
