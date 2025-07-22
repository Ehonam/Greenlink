function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('active');
}





// Navigation entre sections
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Cacher toutes les sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Afficher la section ciblée
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Fermer le menu mobile
            const navbar = document.getElementById('navbar');
            navbar.classList.remove('active');
        });
    });
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});


// cart

function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('active');
}



function openCart() {
var cart = document.getElementById('cart');
if (cart.style.display === 'none' || cart.style.display === '') {
cart.style.display = 'block';
 } else {
 cart.style.display = 'none';
}
}

document.getElementById('cartButton').onclick = openCart;


// Cart functionality
    let cart = [];
    
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <p>${item.name} - ${item.price.toFixed(2)} € x ${item.quantity}</p>
                <p>${(item.price * item.quantity).toFixed(2)} €</p>
                <button class="remove-from-cart" data-index="${index}">Supprimer</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartTotal.textContent = total.toFixed(2) + ' €';

        // Remove item functionality
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function () {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
    }

    // Détails produits

    // Attendre que le document soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // 1. Sélectionner le bouton et l'élément d'information
    const bouton = document.getElementById('monBouton');
    const info = document.getElementById('info');
    
    // 2. Ajouter un écouteur d'événement pour le clic
    bouton.addEventListener('click', function() {
        // 3. Vérifier si l'info est cachée
        if (info.style.display === 'none') {
            // 4. Si cachée, l'afficher
            info.style.display = 'block';
        } else {
            // 5. Si visible, la cacher
            info.style.display = 'none';
        }
    });
});
});