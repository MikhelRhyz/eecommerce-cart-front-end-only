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

const cart = {};
let couponApplied = false;
let discountAmount = 0;

// --- ADD TO CART ---
addToCartBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!cart[id]) {
      cart[id] = { name, price, qty: 1 };
    } else {
      cart[id].qty++;
    }

    renderCart();
  });
});

// --- RENDER CART ---
function renderCart() {
  cartItems.innerHTML = "";

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

  // --- Calculate totals ---
  let discountedSubtotal = subTotalValue - discountAmount;
  if (discountedSubtotal < 0) discountedSubtotal = 0;

  const taxValue = discountedSubtotal * 0.12;
  const shippingValue =
    discountedSubtotal === 0 ? 0 : discountedSubtotal <= 100 ? 55 : 110;
  const totalValue = discountedSubtotal + taxValue + shippingValue;

  subtotalEl.textContent = `₱${subTotalValue.toFixed(2)}`;
  taxEl.textContent = `₱${taxValue.toFixed(2)}`;
  shippingEl.textContent = `₱${shippingValue.toFixed(2)}`;
  totalEl.textContent = `₱${totalValue.toFixed(2)}`;

  if (subTotalValue === 0) {
    cartTableWrap.classList.add("d-none");
    cartEmptyMessage.classList.remove("d-none");
    discountContainer.classList.add("d-none");
    couponApplied = false;
    discountAmount = 0;
  } else {
    cartTableWrap.classList.remove("d-none");
    cartEmptyMessage.classList.add("d-none");
  }
}

// --- HANDLE CART BUTTONS (+ / −) ---
cartItems.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  const id = row.dataset.id;
  if (!id) return;

  if (e.target.classList.contains("increase")) {
    cart[id].qty++;
  } else if (e.target.classList.contains("decrease")) {
    cart[id].qty--;
    if (cart[id].qty <= 0) delete cart[id];
  }

  renderCart();
});

// --- APPLY COUPON ---
applyCouponBtn.addEventListener("click", () => {
  const couponCode = couponCodeEl.value.toLowerCase().trim();

  if (couponApplied) {
    alert("Coupon already applied!");
    return;
  }

  if (couponCode === "anniv10") {
    // 10% discount applied to subtotal
    discountAmount = Object.values(cart).reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    ) * 0.1;

    discountContainer.classList.remove("d-none");
    discountEl.textContent = `-₱${discountAmount.toFixed(2)}`;
    couponApplied = true;
    renderCart();
  } else {
    alert("Invalid coupon code!");
  }
});
