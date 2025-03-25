// ====================
// Global Variables
// ====================
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// ====================
// Cart Functionality
// ====================

// Add an item to the cart
const addToCart = (name, price) => {
    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.name === name);
    
    if (existingItemIndex !== -1) {
        // Item exists, update quantity or inform user
        alert(`${name} is already in your cart!`);
        return;
    }
    
    const item = { name, price };
    cartItems.push(item);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    alert(`${name} has been added to your cart!`);
    displayCartItems(); // Update the cart display
};

// Display cart items
const displayCartItems = () => {
    const cartItemsContainer = document.querySelector(".cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const gstElement = document.getElementById("gst");
    const totalElement = document.getElementById("total");

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = "<p>Your cart is currently empty.</p>";
        subtotalElement.textContent = "$0.00 BZD";
        gstElement.textContent = "$0.00 BZD";
        totalElement.textContent = "$0.00 BZD";
    } else {
        cartItemsContainer.innerHTML = ""; // Clear the container
        let subtotal = 0;

        cartItems.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)} BZD</p>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            subtotal += item.price; // Add to subtotal
        });

        // Calculate GST and total
        const gst = subtotal * 0.125; // 12.5% GST
        const total = subtotal + gst;

        // Update the totals
        subtotalElement.textContent = `$${subtotal.toFixed(2)} BZD`;
        gstElement.textContent = `$${gst.toFixed(2)} BZD`;
        totalElement.textContent = `$${total.toFixed(2)} BZD`;
    }
};

// Remove an item from the cart
const removeItem = (index) => {
    cartItems.splice(index, 1); // Remove the item
    localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Update localStorage
    displayCartItems(); // Refresh the cart display
};

// ====================
// Search Functionality
// ====================
const searchProduct = () => {
    const input = document.getElementById("search-bar").value.toLowerCase();
    if (!input) {
        alert("Please enter a search term.");
        return;
    }

    // Redirect to the Fruits tab with the search term as a URL parameter
    window.location.href = `fruits.html?search=${encodeURIComponent(input)}`;
};

// Filter and highlight items based on search term
const filterAndHighlightItems = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search")?.toLowerCase();

    if (!searchTerm) return;

    const fruitItems = document.querySelectorAll(".fruit-item");
    let found = false;

    fruitItems.forEach((item) => {
        const name = item.getAttribute("data-name").toLowerCase();
        if (name.includes(searchTerm)) {
            item.style.display = "block"; // Show matching items
            item.scrollIntoView({ behavior: "smooth", block: "center" });
            item.style.border = "2px solid rgb(248, 248, 248)"; // Highlight the product
            found = true;
        } else {
            item.style.display = "none"; // Hide non-matching items
        }
    });

    if (!found) {
        alert(`No products found matching "${searchTerm}".`);
    }
};

// ====================
// Background Animation
// ====================
const hero = document.querySelector(".hero");
let offset = 0;

function animateBackground() {
    offset += 1;
    hero.style.backgroundPosition = `${offset}px 0`;
    requestAnimationFrame(animateBackground);
}

// ====================
// Hero Content Animation
// ====================
const animateHeroContent = () => {
    const h1 = document.querySelector(".hero h1");
    const p = document.querySelector(".hero p");
    const button = document.querySelector(".hero button");

    h1.style.opacity = "1";
    h1.style.transform = "translateY(0)";
    h1.style.transition = "opacity 1s ease, transform 1s ease";

    p.style.opacity = "1";
    p.style.transform = "translateY(0)";
    p.style.transition = "opacity 1s ease 0.5s, transform 1s ease 0.5s";

    button.style.opacity = "1";
    button.style.transform = "translateY(0)";
    button.style.transition = "opacity 1s ease 1s, transform 1s ease 1s";
};

// ====================
// Modal Functionality
// ====================
const setupModal = () => {
    const checkoutButton = document.getElementById("checkout-button");
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("close-button");
    const confirmButton = document.getElementById("confirm-button");
    const cancelButton = document.getElementById("cancel-button");
    const paymentForm = document.getElementById("payment-details");

    // Show modal on checkout button click
    checkoutButton?.addEventListener("click", () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty. Please add items before checkout.");
            return;
        }
        modal.style.display = "block";
    });

    // Close modal when the close button is clicked
    closeButton?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when the cancel button is clicked
    cancelButton?.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Handle payment form submission
    paymentForm?.addEventListener("submit", (event) => {
        event.preventDefault();
        
        // Validate form inputs
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;
        const cardholderName = document.getElementById("cardholder-name").value;
        
        if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
            alert("Please fill in all payment details.");
            return;
        }
        
        // Process payment (simulated)
        alert("Payment processed successfully! Thank you for your purchase.");
        
        // Clear cart after successful payment
        cartItems = [];
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        displayCartItems();
        
        modal.style.display = "none";
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
};

// ====================
// Initialize Everything
// ====================
document.addEventListener("DOMContentLoaded", () => {
    console.log("Website loaded");

    // Display cart items if on the Cart tab
    if (window.location.pathname.includes("cart.html")) {
        displayCartItems();
        
        // Add event delegation for remove buttons
        document.querySelector(".cart-items")?.addEventListener("click", (e) => {
            if (e.target.classList.contains("remove-item")) {
                const index = parseInt(e.target.getAttribute("data-index"));
                removeItem(index);
            }
        });
    }

    // Filter and highlight items if on the Fruits tab
    if (window.location.pathname.includes("fruits.html")) {
        filterAndHighlightItems();
    }

    // Attach search functionality
    const searchButton = document.getElementById("search-button");
    if (searchButton) {
        searchButton.addEventListener("click", searchProduct);
    }

    // Start background animation if on homepage
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        animateBackground();
        setTimeout(animateHeroContent, 500);
    }

    // Setup modal functionality
    setupModal();
});

// Make functions available globally for HTML onclick attributes
window.addToCart = addToCart;
window.removeItem = removeItem;
window.searchProduct = searchProduct;