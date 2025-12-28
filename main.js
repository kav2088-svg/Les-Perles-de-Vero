// ========================================
// CONFIGURATION
// ========================================
const WHATSAPP_NUMBER = "225XXXXXXXXXX"; // À remplacer par le vrai numéro

// ========================================
// DONNÉES PRODUITS (selon la maquette)
// ========================================
const products = {
    colliers: [
        {
            id: 1,
            name: "Perle de Tahiti",
            price: 120,
            currency: "€",
            description: "Élégance noire profonde avec reflets verts",
            image: "assets/perle-tahiti.jpg",
            badge: "Nouveau"
        },
        {
            id: 2,
            name: "Collier Akoya",
            price: 250,
            currency: "€",
            description: "Le classique blanc intemporel",
            image: "assets/collier-akoya.jpg",
            badge: null
        },
        {
            id: 3,
            name: "Pendentif Baroque",
            price: 90,
            currency: "€",
            description: "Forme unique et organique",
            image: "assets/pendentif-baroque.jpg",
            badge: null
        }
    ],
    boucles: [
        {
            id: 4,
            name: "Puces Douceur",
            price: 45,
            currency: "€",
            description: "Discrétion absolue",
            image: "assets/puces-douceur.jpg",
            badge: null
        },
        {
            id: 5,
            name: "Gouttes d'Or",
            price: 180,
            currency: "€",
            description: "Or 18k et perles",
            image: "assets/gouttes-or.jpg",
            badge: null
        },
        {
            id: 6,
            name: "Créoles Perle",
            price: 65,
            currency: "€",
            description: "Modernité affirmée",
            image: "assets/creoles-perle.jpg",
            badge: null
        },
        {
            id: 7,
            name: "Ligne Pure",
            price: 85,
            currency: "€",
            description: "Minimalisme vertical",
            image: "assets/ligne-pure.jpg",
            badge: null
        }
    ],
    bracelets: [
        {
            id: 8,
            name: "Bracelet Manchette",
            price: 140,
            currency: "€",
            description: "Un design audacieux pour les soirées",
            image: "assets/bracelet-manchette.jpg",
            badge: null
        },
        {
            id: 9,
            name: "Chaîne Délicate",
            price: 55,
            currency: "€",
            description: "Finesse et légèreté au quotidien",
            image: "assets/chaine-delicate.jpg",
            badge: null
        }
    ]
};

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
    initCarousel();
    initModal();
    renderProducts();
    initWhatsAppLinks();
});

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

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
}

// ========================================
// CAROUSEL BOUCLES
// ========================================
function initCarousel() {
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const carousel = document.querySelector('.products-carousel');

    if (prevBtn && nextBtn && carousel) {
        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -300, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }
}

// ========================================
// RENDU DES PRODUITS
// ========================================
function renderProducts() {
    renderCategory('colliers', 'colliers-grid');
    renderCategory('boucles', 'boucles-grid');
    renderCategory('bracelets', 'bracelets-grid');
}

function renderCategory(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid || !products[category]) return;

    const categoryProducts = products[category];
    
    grid.innerHTML = categoryProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" onerror="this.style.background='linear-gradient(135deg, #E8A8A0, #d4af37)'">
                ${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <div class="product-price">${product.currency}${product.price}</div>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <button class="btn-whatsapp" data-product-id="${product.id}">
                    Commander via WhatsApp
                </button>
            </div>
        </div>
    `).join('');

    // Ajouter les événements
    const productCards = grid.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = parseInt(card.getAttribute('data-product-id'));
        const product = findProductById(productId);
        
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

function findProductById(id) {
    for (const category in products) {
        const found = products[category].find(p => p.id === id);
        if (found) return found;
    }
    return null;
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
    const product = findProductById(productId);
    if (!product) return;

    currentProduct = product;
    currentQuantity = 1;

    const modal = document.getElementById('product-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-image" style="height: 300px;">
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
                    <button class="quantity-btn" data-action="decrease" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-beige-light); border: 2px solid var(--color-border);">−</button>
                    <input type="number" id="quantity-input" value="1" min="1" style="width: 60px; padding: var(--spacing-sm); border: 2px solid var(--color-border); border-radius: var(--radius-md); text-align: center; font-size: var(--font-size-lg); font-weight: 600;">
                    <button class="quantity-btn" data-action="increase" style="width: 40px; height: 40px; border-radius: var(--radius-md); background: var(--color-beige-light); border: 2px solid var(--color-border);">+</button>
                </div>
            </div>
            <button class="btn-whatsapp" id="modal-whatsapp-btn" style="width: 100%;">
                Commander via WhatsApp
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
            const message = "Bonjour ! 👋\n\nJe souhaite obtenir plus d'informations sur vos bijoux en perles.\n\nMerci ! 😊";
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        });
    });
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
