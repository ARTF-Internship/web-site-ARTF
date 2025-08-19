// Gestion de la navbar
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initMobileMenu();
    initActiveNavigation();
    initDropdowns();
    initNavbarSearch();
    initAuthNotifications();
    initLanguageSwitch();
    initBreadcrumb();
});


    function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    const scrollThreshold = 100;

    const handleScroll = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ajouter/retirer la classe scrolled
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Toujours visible
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }, 10);

    window.addEventListener('scroll', handleScroll);
}

    // Menu mobile
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMobileMenu();
    });
    
    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Fermer le menu avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Fermer le menu lors du clic sur un lien
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                closeMobileMenu();
            }, 300);
        });
    });
    
    // Gestion du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            closeMobileMenu();
        }
    });
}

// Toggle menu mobile
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Ouvrir menu mobile
function openMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    
    document.body.style.overflow = 'hidden';
    
    const links = mobileMenu.querySelectorAll('.mobile-nav-link');
    links.forEach((link, index) => {
        link.style.animationDelay = `${index * 0.1}s`;
        link.classList.add('animate-slide-in-left');
    });
}

// Fermer menu mobile
function closeMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!hamburger || !mobileMenu) return;
    
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    
    document.body.style.overflow = '';
    
    const links = mobileMenu.querySelectorAll('.mobile-nav-link');
    links.forEach(link => {
        link.style.animationDelay = '';
        link.classList.remove('animate-slide-in-left');
    });
}

// Navigation active
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const sections = document.querySelectorAll('section[id], main[id]');
    
    // Marquer le lien actif au chargement
    updateActiveNavigation(window.location.hash.substring(1));
    
    // Observer les sections
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                updateActiveNavigation(sectionId);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Clic sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Si c'est un lien interne
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    e.preventDefault();
                    scrollToSection(targetSection);
                    updateActiveNavigation(targetId);
                }
            }
        });
    });
}

// Mettre à jour la navigation active et l'URL
function updateActiveNavigation(sectionId = null) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        // Gérer les liens de type #id et la page d'accueil
        const linkId = href.startsWith('#') ? href.substring(1) : null;
        if (linkId && linkId === sectionId) {
            link.classList.add('active');
        }
    });
    
    // Mettre à jour l'URL sans recharger
    if (sectionId && sectionId !== 'accueil') {
        history.replaceState(null, null, `#${sectionId}`);
    } else {
        history.replaceState(null, null, window.location.pathname);
    }
}

// Scroll vers une section
function scrollToSection(section) {
    const navbar = document.getElementById('navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const offset = 20; // Marge supplémentaire
    
    const targetPosition = section.offsetTop - navbarHeight - offset;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Gestion des dropdowns
function initDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        let timeoutId;
        
        // Événements de survol pour desktop
        dropdown.addEventListener('mouseenter', function() {
            clearTimeout(timeoutId);
            showDropdown(menu);
        });
        
        dropdown.addEventListener('mouseleave', function() {
            timeoutId = setTimeout(() => {
                hideDropdown(menu);
            }, 150);
        });
        
        // Événements de clic pour mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                toggleDropdown(menu);
            }
        });
        
        // Fermer les dropdowns en cliquant à l'extérieur
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                hideDropdown(menu);
            }
        });
    });
    
    // Fermer tous les dropdowns avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeDropdowns = document.querySelectorAll('.dropdown-menu.active');
            activeDropdowns.forEach(menu => hideDropdown(menu));
        }
    });
}

// Afficher dropdown
function showDropdown(menu) {
    menu.classList.add('active');
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.style.transform = 'translateY(0)';
}

// Masquer dropdown
function hideDropdown(menu) {
    menu.classList.remove('active');
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
    menu.style.transform = 'translateY(-10px)';
}

// Toggle dropdown
function toggleDropdown(menu) {
    if (menu.classList.contains('active')) {
        hideDropdown(menu);
    } else {
        // Fermer les autres dropdowns
        const otherMenus = document.querySelectorAll('.dropdown-menu.active');
        otherMenus.forEach(otherMenu => {
            if (otherMenu !== menu) {
                hideDropdown(otherMenu);
            }
        });
        
        showDropdown(menu);
    }
}

// Gestion de la recherche dans la navbar (si implémentée)
function initNavbarSearch() {
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');
    
    if (!searchToggle || !searchOverlay) return;
    
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        openSearch();
    });
    
    if (searchClose) {
        searchClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeSearch();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });
    
    searchOverlay.addEventListener('click', function(e) {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });
}

function openSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        if (searchInput) {
            searchInput.focus();
        }
    }, 300);
}

function closeSearch() {
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    if (searchInput) {
        searchInput.value = '';
    }
}

// Notification de connexion/déconnexion (si implémentée)
function initAuthNotifications() {
    const loginBtn = document.querySelector('.login-btn');
    const logoutBtn = document.querySelector('.logout-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Logique de connexion
            showNotification('Connexion réussie !', 'success');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Logique de déconnexion
            showNotification('Déconnexion réussie !', 'info');
        });
    }
}

// Gestion de la langue (si multilingue)
function initLanguageSwitch() {
    const langSwitches = document.querySelectorAll('.lang-switch');
    
    langSwitches.forEach(langSwitch => {
        langSwitch.addEventListener('click', function(e) {
            e.preventDefault();
            const lang = this.dataset.lang;
            switchLanguage(lang);
        });
    });
}

function switchLanguage(lang) {
    localStorage.setItem('preferred-language', lang);
    
    const langSwitches = document.querySelectorAll('.lang-switch');
    langSwitches.forEach(sw => {
        sw.classList.remove('active');
        if (sw.dataset.lang === lang) {
            sw.classList.add('active');
        }
    });
    
    const langNames = {
        'fr': 'Français',
        'en': 'English'
    };
    
    showNotification(`Langue changée vers ${langNames[lang] || lang}`, 'info');
}

// Breadcrumb automatique
function initBreadcrumb() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb) return;
    
    const path = window.location.pathname;
    const hash = window.location.hash;
    
    const pathSegments = path.split('/').filter(segment => segment);
    const breadcrumbItems = [];
    
    breadcrumbItems.push({
        name: 'Accueil',
        url: 'index.html'
    });
    
    pathSegments.forEach((segment, index) => {
        const name = formatBreadcrumbName(segment);
        const url = pathSegments.slice(0, index + 1).join('/');
        breadcrumbItems.push({ name, url });
    });
    
    if (hash) {
        const sectionName = formatBreadcrumbName(hash.substring(1));
        breadcrumbItems.push({
            name: sectionName,
            url: null
        });
    }
    
    renderBreadcrumb(breadcrumb, breadcrumbItems);
}

function formatBreadcrumbName(segment) {
    const names = {
        'services': 'Services',
        'apropos': 'À propos',
        'contact': 'Contact',
        'missions': 'Missions',
        'actualites': 'Actualités'
    };
    
    return names[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

function renderBreadcrumb(container, items) {
    container.innerHTML = items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        if (isLast || !item.url) {
            return `<span class="breadcrumb-current">${item.name}</span>`;
        } else {
            return `<a href="${item.url}" class="breadcrumb-link">${item.name}</a>`;
        }
    }).join('<span class="breadcrumb-separator">›</span>');
}

// Utilitaire throttle pour optimiser les performances
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}