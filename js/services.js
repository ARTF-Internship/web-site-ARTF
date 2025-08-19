document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card, .service-card-horizontal');
    const modal = document.querySelector('#serviceModal');
    const closeModal = document.querySelector('.close-modal');
    const modalTitle = document.querySelector('#modalTitle');
    const serviceForm = document.querySelector('#serviceForm');
    
    // Form templates
    const formTemplates = {
        autorisation: `
            <div class="form-group">
                <label for="nom-autorisation">Nom complet</label>
                <input type="text" id="nom-autorisation" required>
            </div>
            <div class="form-group">
                <label for="email-autorisation">Email</label>
                <input type="email" id="email-autorisation" required>
            </div>
            <div class="form-group">
                <label for="type-autorisation">Type d'autorisation</label>
                <select id="type-autorisation" required>
                    <option value="">Sélectionnez...</option>
                    <option value="transport">Transport de marchandises</option>
                    <option value="acces">Accès aux installations</option>
                    <option value="construction">Construction près des voies</option>
                    <option value="autre">Autre</option>
                </select>
            </div>
            <div class="form-group">
                <label for="details-autorisation">Détails de la demande</label>
                <textarea id="details-autorisation" required></textarea>
            </div>
            <button type="submit" class="w-full bg-artf-vert text-white py-3 px-6 rounded-lg font-bold hover:bg-artf-vert-dark transition-colors">
                Envoyer la demande
            </button>
        `,
        incident: `
            <div class="form-group">
                <label for="nom-incident">Nom complet</label>
                <input type="text" id="nom-incident" required>
            </div>
            <div class="form-group">
                <label for="email-incident">Email</label>
                <input type="email" id="email-incident" required>
            </div>
            <div class="form-group">
                <label for="date-incident">Date de l'incident</label>
                <input type="date" id="date-incident" required>
            </div>
            <div class="form-group">
                <label for="type-incident">Type d'incident</label>
                <select id="type-incident" required>
                    <option value="">Sélectionnez...</option>
                    <option value="retard">Retard important</option>
                    <option value="securite">Problème de sécurité</option>
                    <option value="confort">Mauvaises conditions</option>
                    <option value="autre">Autre</option>
                </select>
            </div>
            <div class="form-group">
                <label for="details-incident">Description</label>
                <textarea id="details-incident" required></textarea>
            </div>
            <button type="submit" class="w-full bg-artf-jaune text-artf-bleu py-3 px-6 rounded-lg font-bold hover:bg-yellow-500 transition-colors">
                Signaler l'incident
            </button>
        `,
        'objet-perdu': `
            <div class="form-group">
                <label for="nom-objet">Nom complet</label>
                <input type="text" id="nom-objet" required>
            </div>
            <div class="form-group">
                <label for="email-objet">Email</label>
                <input type="email" id="email-objet" required>
            </div>
            <div class="form-group">
                <label for="date-perte">Date approximative</label>
                <input type="date" id="date-perte" required>
            </div>
            <div class="form-group">
                <label for="lieu-perte">Lieu de la perte</label>
                <input type="text" id="lieu-perte" placeholder="Gare, train, etc." required>
            </div>
            <div class="form-group">
                <label for="description-objet">Description de l'objet</label>
                <textarea id="description-objet" required></textarea>
            </div>
            <button type="submit" class="w-full bg-artf-bleu text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-800 transition-colors">
                Déclarer l'objet
            </button>
        `
    };
    
    // Open modal with appropriate form
    serviceCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;
            
            const serviceType = this.id || this.getAttribute('data-service');
            modalTitle.textContent = this.querySelector('h3').textContent;
            serviceForm.innerHTML = formTemplates[serviceType];
            
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
    
    // Close when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    });
    
    // Form submission
    serviceForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const notification = alert('Votre demande a été envoyée avec succès. Nous vous contacterons bientôt.');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        notification.style.display = 'none';
        
        this.reset();
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    });
});