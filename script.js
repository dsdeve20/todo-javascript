
// Sample product data - Real website mein yeh server se aayega
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals who need focus."
    },
    {
        id: 2,
        name: "Smartphone XYZ",
        price: 699.99,
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Latest smartphone with advanced camera, fast processor, and all-day battery. Features a stunning OLED display and 5G connectivity."
    },
    {
        id: 3,
        name: "Laptop Pro",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Powerful laptop for work and gaming with high-resolution display. Equipped with the latest processor and dedicated graphics card."
    },
    {
        id: 4,
        name: "Fitness Tracker",
        price: 49.99,
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Track your steps, heart rate, and sleep patterns with this comfortable fitness tracker. Water-resistant and with 7-day battery life."
    },
    {
        id: 5,
        name: "Coffee Maker",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Brew the perfect cup of coffee with this programmable coffee maker. Features multiple brew strength options and a thermal carafe."
    },
    {
        id: 6,
        name: "Wireless Mouse",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Ergonomic wireless mouse with precision tracking and long battery life. Comfortable design for extended use."
    },
    {
        id: 7,
        name: "Smart Watch",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Stay connected with this feature-packed smartwatch. Receive notifications, track workouts, and monitor health metrics."
    },
    {
        id: 8,
        name: "Portable Speaker",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Take your music anywhere with this portable Bluetooth speaker. Waterproof design with rich, clear sound quality."
    }
];

document.addEventListener('DOMContentLoaded', function(){

    // Cart data - Yeh localStorage mein store hoga
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const pages = document.querySelectorAll('.page');
    
    function handleNavLinks(){
        const navLinks = document.querySelectorAll('.nav-link')
        const pages = document.querySelectorAll('.page');

        navLinks.forEach(link=>{
            link.addEventListener('click', function(e){
                e.preventDefault();
                const targetPage = this.getAttribute('data-page')

                pages.forEach(function(page){
                    page.classList.remove('active')
                })
                document.getElementById(targetPage).classList.add('active')

                if(targetPage == 'products'){
                    const productsContainer = document.getElementById('all-products')
                    productsContainer.innerHTML = ''
                    products.forEach(function(data, index){
                        //console.log(index, data)
                        const productElement = createProductElement(data)
                        productsContainer.appendChild(productElement)
                    })
                }

                if(targetPage == 'cart'){
                    updateCartDisplay()
                }
            })
        })
    } 

    // Cart display update karne ka function
    function updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="cart-item"><p>Your cart is empty</p></div>';
            cartTotalElement.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity} = $${itemTotal.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">Remove</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemDiv);
            
            // Quantity buttons ke liye event listeners
            const minusBtn = cartItemDiv.querySelector('.minus');
            const plusBtn = cartItemDiv.querySelector('.plus');
            const quantityInput = cartItemDiv.querySelector('.quantity-input');
            const removeBtn = cartItemDiv.querySelector('.remove-item');
            
            minusBtn.addEventListener('click', function() {
                updateCartItemQuantity(item.id, parseInt(quantityInput.value) - 1);
            });
            
            plusBtn.addEventListener('click', function() {
                updateCartItemQuantity(item.id, parseInt(quantityInput.value) + 1);
            });
            
            quantityInput.addEventListener('change', function() {
                updateCartItemQuantity(item.id, parseInt(quantityInput.value));
            });
            
            removeBtn.addEventListener('click', function() {
                removeFromCart(item.id);
            });
        });
        
        cartTotalElement.textContent = total.toFixed(2);
    }

    
    // Cart item ki quantity update karne ka function
    function updateCartItemQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            cartItem.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    }

    // Cart se item remove karne ka function
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        updateCartCount();
    }

     // Checkout button pe event listener
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // Checkout page show karo
        pages.forEach(page => {
            page.classList.remove('active');
        });
        document.getElementById('checkout').classList.add('active');
        
        // Nav link update karo
        navLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
    });

    function loadFeaturedProducts() {
        const featuredContainer = document.getElementById('featured-products')
        featuredContainer.innerHTML = ''
        const featuredProducts = products.slice(0,4)
        featuredProducts.forEach(function(data, index){
            //console.log(index, data)
            const productElement = createProductElement(data)
            featuredContainer.appendChild(productElement)
        })
    }

    function createProductElement(data){
        const productDiv = document.createElement('div')
        productDiv.className = 'product-card'
        productDiv.innerHTML = `
            <div class="product-image">
                <img src="${data.image}" alt="${data.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${data.name}</h3>
                <div class="product-price">$${data.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${data.id}">Add to Cart</button>
            </div>
        `
        // Add to cart button pe event listener add karo
        const addToCartBtn = productDiv.querySelector('.add-to-cart');
        addToCartBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            addToCart(data.id);
        });

        return productDiv
    }

    // Cart mein product add karne ka function
    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        
        if (product) {
            // Check karo agar product already cart mein hai
            const existingItem = cart.find(item => item.id === productId);
            
            if(existingItem){
                existingItem.quantity +=quantity
            }   
            else{
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity
                });
            }

            //set in localstorage
            localStorage.setItem('cart', JSON.stringify(cart))

            // Cart count update karo
            updateCartCount();
        }
        
    }

    function updateCartCount(){
        const cartCount = document.querySelector('.cart-count');
        totalQuantity = cart.reduce((total, item)=>total + item.quantity, 0)
        cartCount.innerHTML = totalQuantity 
    }



   

   //Nav Links handler   
   handleNavLinks()

    //Load products
    loadFeaturedProducts();
})