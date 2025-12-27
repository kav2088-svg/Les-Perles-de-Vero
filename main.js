// ========================================
// CONFIGURATION
// ========================================
const WHATSAPP_NUMBER = "225XXXXXXXXXX"; // À remplacer par le vrai numéro

// ========================================
// DONNÉES PRODUITS
// ========================================
const products = [
    // BRACELETS
    {
        id: 1,
        name: "Aurore",
        category: "bracelets",
        price: 5000,
        description: "Bracelet élégant en perles nacrées et dorées. Parfait pour un style quotidien raffiné.",
        image: "assets/bracelet-aurore.jpg"
    },
    {
        id: 2,
        name: "Naya",
        category: "bracelets",
        price: 8000,
        description: "Bracelet moderne aux perles colorées. Une touche de couleur pour égayer votre tenue.",
        image: "assets/bracelet-naya.jpg"
    },
    {
        id: 3,
        name: "Perle d'Or",
        category: "bracelets",
        price: 12000,
        description: "Bracelet luxueux en perles dorées. Idéal pour les occasions spéciales et soirées.",
        image: "assets/bracelet-perle-dor.jpg"
    },
    // COLLIERS
    {
        id: 4,
        name: "Sophia",
        category: "colliers",
        price: 10000,
        description: "Collier délicat en perles blanches. Un classique intemporel qui s'associe à toutes vos tenues.",
        image: "assets/collier-sophia.jpg"
    },
    {
        id: 5,
        name: "Élégance Rose",
        category: "colliers",
        price: 15000,
        description: "Collier raffiné aux perles roses et dorées. Un bijou qui sublime votre décolleté avec grâce.",
        image: "assets/collier-elegance-rose.jpg"
    },
    {
        id: 6,
        name: "Reine des Perles",
        category: "colliers",
        price: 18000,
        description: "Collier somptueux en perles multicolores. Une pièce unique qui fait sensation.",
        image: "assets/collier-reine.jpg"
    },
    // ENSEMBLES
    {
        id: 7,
        name: "Harmonie",
        category: "ensembles",
        price: 20000,
        description: "Ensemble complet bracelet et collier assortis. Cohérence et élégance pour un look parfait.",
        image: "assets/ensemble-harmonie.jpg"
    },
    {
        id: 8,
        name: "Prestige",
        category: "ensembles",
        price: 25000,
        description: "Ensemble luxueux en perles dorées et nacrées. Pour les grandes occasions, brillez de tous vos feux.",
        image: "assets/ensemble-prestige.jpg"
    },
    {
        id: 9,
        name: "Collection Complète",
        category: "ensembles",
        price: 35000,
        description: "Ensemble complet bracelet, collier et boucles d'oreilles. Le must-have pour une tenue parfaite.",
        image: "assets/ensemble-complet.jpg"
    }
];

// ========================================
// ÉTAT GLOBAL
// ========================================
let currentCategory = "all";
let currentSearch = "";
let currentProduct = null;
let currentQuantity = 1;

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initFilters();
    initSearch();
    initModal();
    renderProducts();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

    // Scroll doux pour les ancres
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }

            // Fermer le menu mobile si ouvert
            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Header sticky - ajout d'une ombre au scroll
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
    });
}

// ========================================
// FILTRES PAR CATÉGORIE
// ========================================
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Ajouter la classe active au bouton cliqué
            button.classList.add('active');
            // Mettre à jour la catégorie courante
            currentCategory = button.getAttribute('data-category');
            // Re-rendre les produits
            renderProducts();
        });
    });
}

// ========================================
// RECHERCHE
// ========================================
function initSearch() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase().trim();
            renderProducts();
        });
    }
}

// ========================================
// RENDU DES PRODUITS
// ========================================
function renderProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    // Filtrer les produits
    const filteredProducts = products.filter(product => {
        const matchesCategory = currentCategory === "all" || product.category === currentCategory;
        const matchesSearch = currentSearch === "" || 
            product.name.toLowerCase().includes(currentSearch) ||
            product.description.toLowerCase().includes(currentSearch);
        return matchesCategory && matchesSearch;
    });

    // Afficher un message si aucun produit trouvé
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <p style="font-size: 1.25rem; color: #666;">Aucun produit trouvé.</p>
                <p style="color: #999; margin-top: 0.5rem;">Essayez une autre recherche ou une autre catégorie.</p>
            </div>
        `;
        return;
    }

    // Générer le HTML des produits
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" role="listitem" data-product-id="${product.id}">
            <div class="product-image">
                <span>💎</span>
            </div>
            <div class="product-badge">${getCategoryLabel(product.category)}</div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-price">${formatPrice(product.price)} FCFA</div>
                <button class="btn btn-primary btn-whatsapp" data-product-id="${product.id}">
                    💬 Commander sur WhatsApp
                </button>
            </div>
        </div>
    `).join('');

    // Ajouter les événements aux cartes et boutons
    const productCards = productsGrid.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Ne pas ouvrir la modale si on clique sur le bouton WhatsApp
            if (e.target.closest('.btn-whatsapp')) {
                return;
            }
            const productId = parseInt(card.getAttribute('data-product-id'));
            openModal(productId);
        });
    });

    const whatsappButtons = productsGrid.querySelectorAll('.btn-whatsapp');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(button.getAttribute('data-product-id'));
            const product = products.find(p => p.id === productId);
            if (product) {
                openWhatsApp(product, 1);
            }
        });
    });
}

// ========================================
// MODALE PRODUIT
// ========================================
function initModal() {
    const modal = document.getElementById('product-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    // Fermer la modale
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Initialiser les contrôles de quantité
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const action = e.target.getAttribute('data-action');
            if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
                updateQuantityDisplay();
            } else if (action === 'increase') {
                currentQuantity++;
                updateQuantityDisplay();
            }
        }
    });

    // Gérer l'input de quantité
    const quantityInput = document.getElementById('quantity-input');
    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value > 0) {
                currentQuantity = value;
            } else {
                currentQuantity = 1;
                e.target.value = 1;
            }
        });
    }
}

function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    currentQuantity = 1;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    // Générer le contenu de la modale
    modalBody.innerHTML = `
        <div class="modal-product-image">
            <span style="font-size: 5rem;">💎</span>
        </div>
        <h2 class="modal-product-name">${escapeHtml(product.name)}</h2>
        <div class="modal-product-price">${formatPrice(product.price)} FCFA</div>
        <p class="modal-product-description">${escapeHtml(product.description)}</p>
        <div class="modal-quantity">
            <label for="quantity-input">Quantité :</label>
            <div class="quantity-controls">
                <button class="quantity-btn" data-action="decrease" aria-label="Diminuer la quantité">−</button>
                <input 
                    type="number" 
                    id="quantity-input" 
                    class="quantity-input" 
                    value="1" 
                    min="1"
                    aria-label="Quantité"
                >
                <button class="quantity-btn" data-action="increase" aria-label="Augmenter la quantité">+</button>
            </div>
        </div>
        <button class="btn btn-primary btn-whatsapp btn-large" id="modal-whatsapp-btn">
            💬 Commander sur WhatsApp
        </button>
    `;

    // Ajouter l'événement au bouton WhatsApp de la modale
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            openWhatsApp(product, currentQuantity);
        });
    }

    // Afficher la modale
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Mettre à jour l'affichage de la quantité
    updateQuantityDisplay();
}

function updateQuantityDisplay() {
    const quantityInput = document.getElementById('quantity-input');
    if (quantityInput) {
        quantityInput.value = currentQuantity;
    }
}

// ========================================
// INTÉGRATION WHATSAPP
// ========================================
function openWhatsApp(product, quantity = 1) {
    const totalPrice = product.price * quantity;
    
    // Construire le message
    const message = `Bonjour ! 👋

Je souhaite commander :
• Produit : ${product.name}
• Catégorie : ${getCategoryLabel(product.category)}
• Prix unitaire : ${formatPrice(product.price)} FCFA
• Quantité : ${quantity}
• Prix total : ${formatPrice(totalPrice)} FCFA

Mes informations :
• Nom : 
• Ville/Commune : 
• Adresse : 
• Mode de livraison : 

Merci ! 😊`;

    // Encoder le message pour l'URL
    const encodedMessage = encodeURIComponent(message);
    
    // Construire l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Ouvrir WhatsApp (web ou app)
    try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
        // Fallback : redirection directe
        window.location.href = whatsappUrl;
    }

    // Fermer la modale si elle est ouverte
    const modal = document.getElementById('product-modal');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// ========================================
// UTILITAIRES
// ========================================
function getCategoryLabel(category) {
    const labels = {
        'bracelets': 'Bracelet',
        'colliers': 'Collier',
        'ensembles': 'Ensemble'
    };
    return labels[category] || category;
}

function formatPrice(price) {
    return new Intl.NumberFormat('fr-FR').format(price);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
