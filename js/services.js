// services.js - Gestion spécifique à la page services
document.addEventListener('DOMContentLoaded', function() {
    initServiceModals();
    initServiceAnimations();
    initServiceForms();
});

function initServiceModals() {
    // Les modals sont déjà dans le HTML, on gère juste leur ouverture
    const serviceButtons = document.querySelectorAll('[data-service]');
    
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const service = this.getAttribute('data-service');
            const modal = document.getElementById(`modal-${service}`);
            
            if (modal) {
                openModal(modal);
            }
        });
    });
}

function initServiceAnimations() {
    // Animation spécifique aux cartes de services
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

function initServiceForms() {
    // Validation spécifique aux formulaires de services
    const forms = document.querySelectorAll('.modal-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Utiliser la fonction handleFormSubmission de main.js
            if (typeof handleFormSubmission === 'function') {
                handleFormSubmission(this);
            } else {
                // Fallback si main.js n'est pas chargé
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                
                submitButton.disabled = true;
                submitButton.innerHTML = '<span class="loading-dots">Envoi en cours</span>';
                
                setTimeout(() => {
                    alert('Votre demande a été envoyée avec succès !');
                    this.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    
                    // Fermer le modal
                    const modal = this.closest('.modal');
                    if (modal) {
                        closeModal(modal);
                    }
                }, 2000);
            }
        });
    });
}

// Fonctions d'ouverture/fermeture de modals (complémentaires à main.js)
function openModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}