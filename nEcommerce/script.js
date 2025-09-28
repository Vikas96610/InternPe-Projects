const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

let cart = [];
let total = 0;

// Open Cart
cartBtn.addEventListener("click", () => {
  cartModal.style.display = "flex";
});

// Close Cart
closeCart.addEventListener("click", () => {
  cartModal.style.display = "none";
});

// Add to Cart
document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    let name = button.getAttribute("data-name");
    let price = parseFloat(button.getAttribute("data-price"));

    cart.push({ name, price });
    total += price;

    updateCart();
  });
});

// Update Cart
function updateCart() {
  cartItems.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartItems.appendChild(li);
  });
  cartTotal.textContent = total.toFixed(2);
}
