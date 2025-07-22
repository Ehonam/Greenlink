/**
 * GREENLINK - JavaScript moderne et fonctionnel
 * Fonctionnalités : Navigation one-page, Menu burger, Modal produits, Panier complet, Animations
 */

class GreenLink {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('greenlink-cart') || '[]');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartUI();
        this.setupScrollEffects();
        this.setupProductFiltering();
        this.setupFormValidation();
    }

    /* ==========================================================================
       EVENT LISTENERS
       ========================================================================== */
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Menu burger
        this.setupMobileMenu();
        
        // Modals
        this.setupModals();
        
        // Panier
        this.setupCart();
        
        // Produits
        this.setupProducts();
        
        // Formulaire
        this.setupContactForm();
    }

    /* ==========================================================================
       NAVIGATION ONE-PAGE
       ========================================================================== */
    setupNavigation() {
        // Smooth scroll pour tous les liens d'ancrage
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Fermer le menu mobile s'il est ouvert
                    this.closeMobileMenu();
                    
                    // Mettre à jour le lien actif
                    this.updateActiveNavLink(targetId);
                }
            });
        });

        // Scroll spy pour mettre à jour la navigation
        this.setupScrollSpy();
    }

    setupScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observerOptions = {
            rootMargin: '-80px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetId = '#' + entry.target.id;
                    this.updateActiveNavLink(targetId);
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    updateActiveNavLink(targetId) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /* ==========================================================================
       MENU BURGER MOBILE
       ========================================================================== */
    setupMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        const closeMobileNav = document.getElementById('close-mobile-nav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        menuToggle?.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        closeMobileNav?.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        mobileNavOverlay?.addEventListener('click', (e) => {
            if (e.target === mobileNavOverlay) {
                this.closeMobileMenu();
            }
        });

        // Fermer le menu lors du clic sur un lien
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Gestion panier mobile
        const mobileCartBtn = document.querySelector('.mobile-cart-btn');
        mobileCartBtn?.addEventListener('click', () => {
            this.closeMobileMenu();
            this.openCartModal();
        });
    }

    toggleMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        
        menuToggle.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        
        // Empêcher le scroll du body
        if (mobileNavOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
        
        menuToggle?.classList.remove('active');
        mobileNavOverlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ==========================================================================
       GESTION DES MODALS
       ========================================================================== */
    setupModals() {
        // Modal produit
        this.setupProductModal();
        
        // Modal panier
        this.setupCartModal();
    }

    setupProductModal() {
        const modal = document.getElementById('product-modal');
        const closeBtn = document.getElementById('modal-close');
        
        closeBtn?.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Boutons "Voir détails"
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-details-btn')) {
                this.openProductModal(e.target);
            }
        });
    }

    setupCartModal() {
        const modal = document.getElementById('cart-modal');
        const closeBtn = document.getElementById('cart-modal-close');
        const cartBtn = document.getElementById('cart-btn');
        
        cartBtn?.addEventListener('click', () => {
            this.openCartModal();
        });
        
        closeBtn?.addEventListener('click', () => {
            this.closeModal(modal);
        });
        
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });
    }

    openProductModal(button) {
        const modal = document.getElementById('product-modal');
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const image = button.dataset.image;
        const category = button.dataset.category;
        const description = button.dataset.description;
        
        // Remplir le modal avec les données du produit
        document.getElementById('modal-product-name').textContent = name;
        document.getElementById('modal-product-price').textContent = `${price.toFixed(2)} €`;
        document.getElementById('modal-product-image').src = image;
        document.getElementById('modal-product-image').alt = name;
        document.getElementById('modal-category').textContent = category;
        document.getElementById('modal-product-description').textContent = description;
        
        // Gérer le bouton d'ajout au panier dans le modal
        const modalAddToCartBtn = document.getElementById('modal-add-to-cart');
        modalAddToCartBtn.onclick = () => {
            this.addToCart({ name, price, image });
            this.closeModal(modal);
        };
        
        this.openModal(modal);
    }

    openCartModal() {
        const modal = document.getElementById('cart-modal');
        this.updateCartModal();
        this.openModal(modal);
    }

    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ==========================================================================
       GESTION DU PANIER
       ========================================================================== */
    setupCart() {
        // Boutons d'ajout au panier
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const name = e.target.dataset.name;
                const price = parseFloat(e.target.dataset.price);
                const image = e.target.dataset.image;
                
                this.addToCart({ name, price, image });
            }
        });

        // Actions du panier
        const clearCartBtn = document.getElementById('clear-cart');
        const checkoutBtn = document.getElementById('checkout');
        
        clearCartBtn?.addEventListener('click', () => {
            this.clearCart();
        });
        
        checkoutBtn?.addEventListener('click', () => {
            this.checkout();
        });
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.name === product.name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartUI();
        this.showToast(`${product.name} ajouté au panier`, 'success');
        this.animateCartButton();
    }

    removeFromCart(productName) {
        this.cart = this.cart.filter(item => item.name !== productName);
        this.saveCart();
        this.updateCartUI();
        this.updateCartModal();
        this.showToast('Produit retiré du panier', 'success');
    }

    updateQuantity(productName, change) {
        const item = this.cart.find(item => item.name === productName);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productName);
            } else {
                this.saveCart();
                this.updateCartUI();
                this.updateCartModal();
            }
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
        this.updateCartModal();
        this.showToast('Panier vidé', 'success');
    }

    checkout() {
        if (this.cart.length === 0) {
            this.showToast('Votre panier est vide', 'error');
            return;
        }
        
        // Simulation d'une commande
        const total = this.getCartTotal();
        this.showToast(`Commande de ${total.toFixed(2)}€ confirmée !`, 'success');
        this.clearCart();
        this.closeModal(document.getElementById('cart-modal'));
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) cartCount.textContent = totalItems;
        if (mobileCartCount) mobileCartCount.textContent = totalItems;
    }

    updateCartModal() {
        const cartItems = document.getElementById('cart-items');
        const cartSummary = document.getElementById('cart-summary');
        const cartTotal = document.getElementById('cart-total');
        
        if (this.cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Votre panier est vide</p>
                </div>
            `;
            cartSummary.style.display = 'none';
        } else {
            cartItems.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toFixed(2)} €</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="app.updateQuantity('${item.name}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn" onclick="app.updateQuantity('${item.name}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="cart-item-price">
                        ${(item.price * item.quantity).toFixed(2)} €
                    </div>
                    <button class="remove-item" onclick="app.removeFromCart('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `).join('');
            
            cartSummary.style.display = 'block';
            cartTotal.textContent = `${this.getCartTotal().toFixed(2)} €`;
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('greenlink-cart', JSON.stringify(this.cart));
    }

    animateCartButton() {
        const cartBtn = document.getElementById('cart-btn');
        cartBtn?.classList.add('animate-pulse');
        setTimeout(() => {
            cartBtn?.classList.remove('animate-pulse');
        }, 600);
    }

    /* ==========================================================================
       FILTRAGE DES PRODUITS
       ========================================================================== */
    setupProductFiltering() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.filterProducts(category);
                
                // Mettre à jour l'état actif
                categoryCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });
    }

    filterProducts(category) {
        const products = document.querySelectorAll('.product-card');
        
        products.forEach((product, index) => {
            const productCategory = product.dataset.category;
            const shouldShow = category === 'all' || productCategory === category;
            
            if (shouldShow) {
                product.classList.remove('hidden');
                setTimeout(() => {
                    product.classList.add('visible');
                }, index * 100);
            } else {
                product.classList.add('hidden');
                product.classList.remove('visible');
            }
        });
    }

    /* ==========================================================================
       GESTION DES PRODUITS
       ========================================================================== */
    setupProducts() {
        // Animation d'apparition des produits au scroll
        this.setupProductAnimations();
    }

    setupProductAnimations() {
        const products = document.querySelectorAll('.product-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-fade-in-up');
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        products.forEach(product => {
            observer.observe(product);
        });
    }

    /* ==========================================================================
       EFFETS DE SCROLL
       ========================================================================== */
    setupScrollEffects() {
        // Header au scroll
        this.setupHeaderScroll();
        
        // Parallax léger pour le hero
        this.setupParallax();
    }

    setupHeaderScroll() {
        const header = document.getElementById('header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }

            // Auto-hide sur mobile
            if (window.innerWidth <= 768) {
                if (currentScrollY > lastScrollY && currentScrollY > 100) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupParallax() {
        const heroSection = document.querySelector('.hero-section');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (heroSection) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    /* ==========================================================================
       FORMULAIRE DE CONTACT
       ========================================================================== */
    setupContactForm() {
        const form = document.getElementById('contact-form');
        
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });
        
        // Validation en temps réel
        this.setupFormValidation();
    }

    setupFormValidation() {
        const inputs = document.querySelectorAll('.contact-form input, .contact-form textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Validation selon le type de champ
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
        } else if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
        }
        
        // Mise à jour visuelle
        if (isValid) {
            field.classList.remove('error');
            field.classList.add('valid');
        } else {
            field.classList.remove('valid');
            field.classList.add('error');
        }
        
        return isValid;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    isValidPhone(phone) {
        return /^[\d\s\-\+\(\)]{10,}$/.test(phone);
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validation complète
        let isFormValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showToast('Veuillez corriger les erreurs du formulaire', 'error');
            return;
        }
        
        // Simulation d'envoi
        this.showToast('Message envoyé avec succès !', 'success');
        form.reset();
        
        // Retirer les classes de validation
        inputs.forEach(input => {
            input.classList.remove('valid', 'error');
        });
    }

    /* ==========================================================================
       NOTIFICATIONS TOAST
       ========================================================================== */
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastIcon = document.querySelector('.toast-icon');
        const toastMessage = document.querySelector('.toast-message');
        
        // Icônes selon le type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        // Mise à jour du contenu
        toastIcon.className = `toast-icon ${icons[type] || icons.success}`;
        toastMessage.textContent = message;
        toast.className = `toast ${type}`;
        
        // Affichage
        toast.classList.add('show');
        
        // Masquage automatique
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    /* ==========================================================================
       NEWSLETTER
       ========================================================================== */
    setupNewsletter() {
        const form = document.querySelector('.newsletter-form');
        
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            if (this.isValidEmail(email)) {
                this.showToast('Inscription réussie !', 'success');
                form.reset();
            } else {
                this.showToast('Email invalide', 'error');
            }
        });
    }
}

/* ==========================================================================
   CSS ADDITIONNELS POUR LES ANIMATIONS
   ========================================================================== */
const additionalStyles = `
    .contact-form .error {
        border-color: var(--error) !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
    
    .contact-form .valid {
        border-color: var(--success) !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
    }
    
    .product-card.animate-fade-in-up {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .product-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
`;

// Injection du CSS additionnel
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

/* ==========================================================================
   INITIALISATION
   ========================================================================== */
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new GreenLink();
});

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    // Fermer le menu mobile si on passe en desktop
    if (window.innerWidth > 768) {
        app?.closeMobileMenu();
    }
});

// Gestion de la fermeture avec Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Fermer toutes les modals ouvertes
        const modals = document.querySelectorAll('.modal-overlay.active');
        modals.forEach(modal => {
            app?.closeModal(modal);
        });
        
        // Fermer le menu mobile
        app?.closeMobileMenu();
    }
});

// Export pour utilisation globale
window.GreenLink = GreenLink;