document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Preloader
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.display = 'none';
    });

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('nav ul');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Cart Modal
    const cartLink = document.querySelector('.keranjang-link');
    const cartModal = document.getElementById('cart-modal');
    const closeCartModal = cartModal.querySelector('.close-modal');

    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cartModal.style.display = 'block';
        updateCartView();
    });

    closeCartModal.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    // Quick View Modal
    const quickViewModal = document.getElementById('quick-view-modal');
    const closeQuickViewModal = quickViewModal.querySelector('.close-modal');

    document.querySelectorAll('.quick-view-button').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.id;
            const product = getProductDetails(productId);
            if (product) {
                quickViewModal.querySelector('.quick-view-content').innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="price">${product.price}</p>
                `;
                quickViewModal.style.display = 'block';
            }
        });
    });

    closeQuickViewModal.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target == cartModal) {
            cartModal.style.display = 'none';
        }
        if (e.target == quickViewModal) {
            quickViewModal.style.display = 'none';
        }
    });

    // Add to Cart
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = button.dataset.price;

            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            showNotification(`${name} ditambahkan ke keranjang!`);
        });
    });

    // Update Cart Count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
    }

    // Update Cart View
    function updateCartView() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('.total-price');

        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Keranjang Anda kosong.</p>';
            cartTotal.textContent = 'Rp 0';
            return;
        }

        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Rp ${parseInt(item.price).toLocaleString()}</p>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">&times;</button>
            </div>
        `).join('');

        cartTotal.textContent = `Rp ${cart.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}`;

        // Add event listeners for quantity buttons and remove buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const action = button.dataset.action;
                const item = cart.find(item => item.id === id);

                if (action === 'increase') {
                    item.quantity++;
                } else {
                    item.quantity--;
                    if (item.quantity === 0) {
                        const itemIndex = cart.findIndex(item => item.id === id);
                        cart.splice(itemIndex, 1);
                    }
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartView();
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.dataset.id;
                const itemIndex = cart.findIndex(item => item.id === id);
                cart.splice(itemIndex, 1);

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                updateCartView();
            });
        });
    }

    // Show Notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Scroll to Top Button
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Get Product Details (Simulated)
    function getProductDetails(productId) {
        const products = {
            '1': {
                name: 'Logitech G102 Lightsync Gaming Mouse',
                image: 'https://images.tokopedia.net/img/cache/300-square/VqbcmM/2024/4/29/e524b898-904b-488b-9602-094358897587.jpg',
                description: 'Mouse gaming dengan sensor 8000 DPI dan pencahayaan RGB yang dapat disesuaikan.',
                price: 'Rp 289.000'
            },
            '2': {
                name: 'REXUS Daxa M71 Pro Keyboard Gaming',
                image: 'https://images.tokopedia.net/img/cache/300-square/VqbcmM/2022/1/18/88f831e3-1f20-424a-874b-513426214041.jpg',
                description: 'Keyboard mekanis dengan switch Outemu dan pencahayaan RGB.',
                price: 'Rp 629.000'
            },
            '3': {
                name: 'FANTECH MAXFIT61 FROST MK857 Keyboard',
                image: 'https://images.tokopedia.net/img/cache/300-square/VqbcmM/2021/12/21/53177145-10b2-48a0-9856-787140884021.jpg',
                description: 'Keyboard gaming 60% dengan switch Gateron dan keycaps PBT.',
                price: 'Rp 499.000'
            },
            '4': {
                name: 'LG 24MP400-B 24" IPS Monitor',
                image: 'https://images.tokopedia.net/img/cache/300-square/VqbcmM/2023/10/2/8a33557a-976c-482a-8c01-83957245781a.jpg',
                description: 'Monitor IPS 24 inci dengan resolusi Full HD dan refresh rate 75Hz.',
                price: 'Rp 1.399.000'
            }
        };
        return products[productId];
    }

    // Initial Cart Count
    updateCartCount();
});