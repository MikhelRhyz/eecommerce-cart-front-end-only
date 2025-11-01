// ==========================
// DOM ELEMENTS
// ==========================
const addToCartBtns = document.querySelectorAll(".add-to-cart");
const cartTableWrap = document.querySelector("#cart-table-wrap");
const cartItems = document.querySelector("#cart-items");
const cartEmptyMessage = document.querySelector("#cart-empty-msg");
const subtotalEl = document.querySelector("#subtotal");
const taxEl = document.querySelector("#tax");
const shippingEl = document.querySelector("#shipping");
const totalEl = document.querySelector("#total");
const discountContainer = document.querySelector("#discount-container");
const discountEl = document.querySelector("#discount");
const couponCodeEl = document.querySelector("#coupon-code");
const applyCouponBtn = document.querySelector("#apply-coupon");

let totalValue = 0;

// ==========================
// IN-MEMORY CART OBJECT
// ==========================
// Structure: { id: { name, price, qty } }
const cart = {};

// ==========================
// ADD TO CART
// ==========================
addToCartBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    // Increment quantity if item already exists
    if (!cart[id]) {
      cart[id] = { name, price, qty: 1 };
    } else {
      cart[id].qty++;
    }

    renderCart();
  });
});

// ==========================
// RENDER CART
// ==========================
function renderCart() {
  cartItems.innerHTML = ""; // clear existing rows
  let subTotalValue = 0;

  for (const id in cart) {
    const item = cart[id];
    const itemTotal = item.price * item.qty;
    subTotalValue += itemTotal;

    cartItems.insertAdjacentHTML(
      "beforeend",
      `
      <tr data-id="${id}">
        <td>${item.name}</td>
        <td class="text-end">
          <div class="d-inline-flex align-items-center gap-1">
            <button class="btn btn-sm btn-outline-secondary decrease">−</button>
            <span>${item.qty}</span>
            <button class="btn btn-sm btn-outline-secondary increase">+</button>
          </div>
        </td>
        <td class="text-end">₱${itemTotal.toFixed(2)}</td>
      </tr>
    `
    );
  }

  // Calculate totals
  const taxValue = subTotalValue * 0.12;
  const shippingValue = subTotalValue === 0 ? 0 : subTotalValue <= 100 ? 55 : 110;
  totalValue = subTotalValue + taxValue + shippingValue;

  // Update DOM
  subtotalEl.textContent = `₱${subTotalValue.toFixed(2)}`;
  taxEl.textContent = `₱${taxValue.toFixed(2)}`;
  shippingEl.textContent = `₱${shippingValue.toFixed(2)}`;
  totalEl.textContent = `₱${totalValue.toFixed(2)}`;

  // Show/Hide cart table
  if (subTotalValue === 0) {
    cartTableWrap.classList.add("d-none");
    cartEmptyMessage.classList.remove("d-none");
    discountContainer.classList.add("d-none"); // hide discount if cart empty
  } else {
    cartTableWrap.classList.remove("d-none");
    cartEmptyMessage.classList.add("d-none");
  }
}

// ==========================
// HANDLE CART ITEM BUTTONS (+ / −)
// ==========================
cartItems.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;
  const id = row.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("increase")) {
    cart[id].qty++;
  } else if (e.target.classList.contains("decrease")) {
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id]; // remove from cart if qty = 0
  }

  renderCart();
});

// ==========================
// APPLY COUPON
// ==========================
applyCouponBtn.addEventListener("click", () => {
  const couponCode = couponCodeEl.value.trim().toLowerCase();

  if (couponCode === "anniv10") {
    const discountAmount = totalValue * 0.1;
    totalValue -= discountAmount;

    totalEl.textContent = `₱${totalValue.toFixed(2)}`;
    discountContainer.classList.remove("d-none");
    discountEl.textContent = `-₱${discountAmount.toFixed(2)}`;
  } else {
    // invalid coupon resets discount
    discountContainer.classList.add("d-none");
    renderCart();
  }
});
