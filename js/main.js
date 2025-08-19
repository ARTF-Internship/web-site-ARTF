// Configuration et initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            easing: 'ease-in-out',
            offset: 100
        });
    }
    
    // Initialiser les composants
    initScrollEffects();
    initForms();
    initModals();
    initSmoothScroll();
    initAnimations();
});

// Effets de scroll
function initScrollEffects() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Effet glassmorphisme au scroll
        if (navbar) {
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Masquer/afficher navbar au scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scroll vers le bas - masquer
            if (navbar) {
                navbar.style.transform = 'translateY(-100%)';
            }
        } else {
            // Scroll vers le haut - afficher
            if (navbar) {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Parallax pour les blobs
        parallaxBlobs();
    });
}

// Effet parallax pour les blobs
function parallaxBlobs() {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    const blobs = document.querySelectorAll('.blob');
    
    blobs.forEach((blob, index) => {
        const speed = (index + 1) * 0.2;
        blob.style.transform = `translateY(${parallax * speed}px)`;
    });
}

// Gestion des formulaires
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this);
        });
        
        // Animation des champs au focus
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('input-focus');
            });
            
            input.addEventListener('blur', function() {
                this.classList.remove('input-focus');
            });
        });
    });
}

// Soumission des formulaires
async function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // État de chargement
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="loading-dots">Envoi</span>';
    
    // Animation du bouton
    submitButton.classList.add('button-press');
    
    try {
        // Simulation d'envoi (remplacer par vraie requête)
        await simulateFormSubmission(form);
        
        // Succès
        showNotification('Votre demande a été envoyée avec succès !', 'success');
        form.reset();
        
        // Fermer le modal si c'est dans un modal
        const modal = form.closest('.modal');
        if (modal) {
            closeModal(modal);
        }
        
    } catch (error) {
        // Erreur
        showNotification('Une erreur est survenue. Veuillez réessayer.', 'error');
        console.error('Erreur lors de la soumission:', error);
    } finally {
        // Restaurer le bouton
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            submitButton.classList.remove('button-press');
        }, 1000);
    }
}

// Simulation d'envoi de formulaire
function simulateFormSubmission(form) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 90% de chance de succès pour la démo
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Erreur de simulation'));
            }
        }, 2000);
    });
}

// Gestion des modals
function initModals() {
    // Boutons d'ouverture des modals
    const serviceButtons = document.querySelectorAll('[data-service]');
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.dataset.service;
            const modal = document.getElementById(`modal-${service}`);
            if (modal) {
                openModal(modal);
            }
        });
    });
    
    // Boutons de fermeture des modals
    const closeButtons = document.querySelectorAll('.modal-close, [data-modal]');
    closeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const modal = this.closest('.modal') || document.getElementById(`modal-${this.dataset.modal}`);
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Fermer modal en cliquant sur le fond
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Fermer modal avec Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

// Ouvrir modal
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Animation d'ouverture
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'slideInUp 0.4s ease';
}

// Fermer modal
function closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'slideOutDown 0.3s ease';
    
    setTimeout(() => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        content.style.animation = '';
    }, 300);
}

// Scroll fluide
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const offset = 100; // Offset pour la navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Mettre à jour l'URL
                history.pushState(null, null, href);
            }
        });
    });
}

// Animations diverses
function initAnimations() {
    // Animation des compteurs
    animateCounters();
    
    // Animation des cartes au scroll
    observeElements();
    
    // Animation de typing pour les titres
    initTypingAnimation();
}

// Animation des compteurs
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.dataset.count);
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + (element.dataset.suffix || '');
    }, stepTime);
}

// Observer pour les éléments
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Animation spécifique selon la classe
                if (element.classList.contains('mission-card')) {
                    element.classList.add('card-reveal');
                } else if (element.classList.contains('service-detail-card')) {
                    element.classList.add('hover-lift');
                }
                
                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observer les éléments
    document.querySelectorAll('.mission-card, .service-detail-card').forEach(el => {
        observer.observe(el);
    });
}

// Animation de typing
function initTypingAnimation() {
    const typeElements = document.querySelectorAll('[data-type]');
    
    typeElements.forEach(element => {
        const text = element.dataset.type;
        const speed = parseInt(element.dataset.speed) || 100;
        
        element.textContent = '';
        typeWriter(element, text, speed);
    });
}

function typeWriter(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(timer);
            element.classList.add('typing-complete');
        }
    }, speed);
}

// Système de notifications
function showNotification(message, type = 'info', duration = 5000) {
    const notification = createNotificationElement(message, type);
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.right = '20px';
        notification.style.opacity = 1;
    }, 100);
    
    // Auto-suppression
    setTimeout(() => {
        removeNotification(notification);
    }, duration);
    
    // Supprimer au clic
    notification.addEventListener('click', () => {
        removeNotification(notification);
    });
}

function createNotificationElement(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: -200px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        z-index: 1050;
        max-width: 350px;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s ease;
        border-left: 4px solid ${getNotificationColor(type)};
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${getNotificationIcon(type)}
            <span style="color: #374151; font-weight: 500;">${message}</span>
        </div>
    `;
    
    return notification;
}

function getNotificationColor(type) {
    const colors = {
        success: '#42b74f',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return `<span style="color: ${getNotificationColor(type)}; font-weight: bold; font-size: 1.2rem;">${icons[type] || icons.info}</span>`;
}

function removeNotification(notification) {
    notification.style.right = '-200px';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 400);
}

// Utilitaires
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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
    };
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur JavaScript:', e.error);
    // En production, envoyer l'erreur à un service de monitoring
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log('Temps de chargement:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
    });
}