// ========================================
// CONFIGURATION
// ========================================
// IMPORTANT : Remplacez ce numéro par votre numéro WhatsApp actif (format international sans +)
// Exemple pour la Côte d'Ivoire : "2250123456789" (sans espaces, sans +)
const WHATSAPP_NUMBER = "2250103021890"; // ⚠️ REMPLACER PAR VOTRE NUMÉRO ACTIF

// ========================================
// DONNÉES PRODUITS (Les Favoris du Moment)
// ========================================
const favorites = [
    {
        id: 1,
        name: "Reine Abla Pokou",
        price: 25000,
        currency: "FCFA",
        description: "Collier en perles dorées et noires inspiré de la royauté Akan",
        image: "assets/reine-abla-pokou.jpg",
        badge: { text: "En stock", type: "stock" }
    },
    {
        id: 2,
        name: "Boucles Peulh",
        price: 7500,
        currency: "FCFA",
        description: "Grandes boucles d'oreilles circulaires aux motifs géométriques vibrants.",
        image: "assets/boucles-peulh.jpg",
        badge: null
    },
    {
        id: 3,
        name: "Set Zulu",
        price: 10000,
        currency: "FCFA",
        description: "Ensemble de 3 bracelets rigides aux couleurs chaudes de la terre.",
        image: "assets/set-zulu.jpg",
        badge: { text: "Populaire", type: "popular" }
    },
    {
        id: 4,
        name: "Perles des Mers",
        price: 22000,
        currency: "FCFA",
        description: "Collier délicat mélangeant perles de verre bleu nuit et accents argentés.",
        image: "assets/perles-mers.jpg",
        badge: null
    }
];

// ========================================
// ÉTAT GLOBAL
// ========================================
let currentProduct = null;
let currentQuantity = 1;

// ========================================
// INITIALISATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initModal();
    renderFavorites();
    initWhatsAppLinks();
    initCategoryCards();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    const contactBtn = document.querySelector('.btn-contact-header');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = navList.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
        });
    }

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

            if (navList.classList.contains('active')) {
                navList.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            openWhatsAppGeneral();
        });
    }
}

// ========================================
// CATÉGORIES
// ========================================
function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.getAttribute('data-category');
            // Scroll vers la section collection
            const collectionSection = document.querySelector('#collection');
            if (collectionSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = collectionSection.offsetTop - headerHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// RENDU DES FAVORIS
// ========================================
function renderFavorites() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    grid.innerHTML = favorites.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.style.background='linear-gradient(135deg, #E8A8A0, #d4af37)'">
                ${product.badge ? `<span class="product-badge badge-${product.badge.type}">${escapeHtml(product.badge.text)}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-price">${product.currency}${product.price}</div>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <button class="btn-whatsapp" data-product-id="${product.id}">
                    <span>🛒</span>
                    <span>Acheter sur WhatsApp</span>
                </button>
            </div>
        </div>
    `).join('');

    // Ajouter les événements
    const productCards = grid.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.getAttribute('data-product-id'));
        const product = favorites.find(p => p.id === productId);
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.btn-whatsapp')) {
                openModal(productId);
            }
        });

        const whatsappBtn = card.querySelector('.btn-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (product) {
                    openWhatsApp(product, 1);
                }
            });
        }
    });
}

// ========================================
// MODALE
// ========================================
function initModal() {
    const modal = document.getElementById('product-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

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

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(productId) {
    const product = favorites.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    currentQuantity = 1;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" style="height: 300px;">
            ${product.badge ? `<span class="product-badge badge-${product.badge.type}">${escapeHtml(product.badge.text)}</span>` : ''}
        </div>
        <div style="padding: var(--spacing-lg);">
            <h2 style="font-size: var(--font-size-2xl); font-weight: 600; margin-bottom: var(--spacing-sm);">${escapeHtml(product.name)}</h2>
            <div style="font-size: var(--font-size-2xl); font-weight: 700; color: var(--color-text); margin-bottom: var(--spacing-md);">
                ${product.currency}${product.price}
            </div>
            <p style="font-size: var(--font-size-base); color: var(--color-text-light); margin-bottom: var(--spacing-lg); line-height: 1.8;">
                ${escapeHtml(product.description)}
            </p>
            <div style="margin-bottom: var(--spacing-lg);">
                <label style="display: block; font-weight: 500; margin-bottom: var(--spacing-sm);">Quantité :</label>
                <div style="display: flex; align-items: center; gap: var(--spacing-md);">
                    <button class="quantity-btn" data-action="decrease" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-beige); border: 2px solid var(--color-gray);">−</button>
                    <input type="number" id="quantity-input" value="1" min="1" style="width: 60px; padding: var(--spacing-sm); border: 2px solid var(--color-gray); border-radius: var(--radius-md); text-align: center; font-size: var(--font-size-lg); font-weight: 600;">
                    <button class="quantity-btn" data-action="increase" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-beige); border: 2px solid var(--color-gray);">+</button>
                </div>
            </div>
            <button class="btn-whatsapp" id="modal-whatsapp-btn" style="width: 100%;">
                <span>🛒</span>
                <span>Acheter sur WhatsApp</span>
            </button>
        </div>
    `;

    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            openWhatsApp(product, currentQuantity);
        });
    }

    const quantityInput = document.getElementById('quantity-input');
    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            currentQuantity = value > 0 ? value : 1;
            e.target.value = currentQuantity;
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const action = e.target.getAttribute('data-action');
            if (action === 'decrease' && currentQuantity > 1) {
                currentQuantity--;
            } else if (action === 'increase') {
                currentQuantity++;
            }
            if (quantityInput) quantityInput.value = currentQuantity;
        }
    }, { once: false });

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

// ========================================
// WHATSAPP
// ========================================
function initWhatsAppLinks() {
    const whatsappLinks = document.querySelectorAll('a[href="#whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsAppGeneral();
        });
    });
}

function openWhatsAppGeneral() {
    const message = "Bonjour ! 👋\n\nJe souhaite obtenir plus d'informations sur vos bijoux en perles.\n\nMerci ! 😊";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

function openWhatsApp(product, quantity = 1) {
    const totalPrice = product.price * quantity;
    
    const message = `Bonjour ! 👋

Je souhaite commander :
• Produit : ${product.name}
• Prix unitaire : ${product.currency}${product.price}
• Quantité : ${quantity}
• Prix total : ${product.currency}${totalPrice}

Mes informations :
• Nom : 
• Ville/Commune : 
• Adresse : 
• Mode de livraison : 

Merci ! 😊`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    try {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
        window.location.href = whatsappUrl;
    }

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
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
