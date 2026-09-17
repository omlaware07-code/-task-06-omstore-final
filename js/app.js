const defaultImage =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

let products = JSON.parse(localStorage.getItem("omstore_products")) || [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1499,
    category: "Electronics",
    image: defaultImage
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 2499,
    category: "Electronics",
    image: defaultImage
  },
  {
    id: 3,
    name: "Gaming Mouse",
    price: 999,
    category: "Gaming",
    image: defaultImage
  }
];

let cart = JSON.parse(localStorage.getItem("omstore_cart")) || [];

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productForm = document.getElementById("productForm");
const adminProducts = document.getElementById("adminProducts");

function saveData() {
  localStorage.setItem("omstore_products", JSON.stringify(products));
  localStorage.setItem("omstore_cart", JSON.stringify(cart));
}

function displayProducts() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search) &&
    (category === "all" || p.category === category)
  );

  productList.innerHTML = filtered.map(p => `
    <div class="product">
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>₹${p.price.toLocaleString("en-IN")}</p>
      <p>${p.category}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    </div>
  `).join("");
}

function loadCategories() {
  const categories = [...new Set(products.map(p => p.category))];

  categoryFilter.innerHTML =
    `<option value="all">All Categories</option>` +
    categories.map(c => `<option value="${c}">${c}</option>`).join("");
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const item = cart.find(p => p.id === id);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveData();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    count += item.quantity;

    cartItems.innerHTML += `
      <div class="cart-item">
        <span>
          ${item.name} × ${item.quantity}
        </span>

        <span>
          ₹${(item.price * item.quantity).toLocaleString("en-IN")}
        </span>

        <button onclick="removeFromCart(${item.id})">
          Remove
        </button>
      </div>
    `;
  });

  cartCount.textContent = count;
  cartTotal.textContent = total.toLocaleString("en-IN");
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveData();
  renderCart();
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert("Order placed successfully!");
  cart = [];
  saveData();
  renderCart();
}

function renderAdminProducts() {
  adminProducts.innerHTML = products.map(p => `
    <div class="admin-item">
      <span>
        ${p.name} - ₹${p.price}
      </span>

      <span>
        <button onclick="editProduct(${p.id})">Edit</button>
        <button onclick="deleteProduct(${p.id})">Delete</button>
      </span>
    </div>
  `).join("");
}

productForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("productName").value;
  const price = Number(document.getElementById("productPrice").value);
  const category = document.getElementById("productCategory").value;

  if (id) {
    const product = products.find(p => p.id === Number(id));

    product.name = name;
    product.price = price;
    product.category = category;
  } else {
    products.push({
      id: Date.now(),
      name,
      price,
      category,
      image: defaultImage
    });
  }

  productForm.reset();
  document.getElementById("editProductId").value = "";

  saveData();
  loadCategories();
  displayProducts();
  renderAdminProducts();
});

function editProduct(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  document.getElementById("editProductId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productCategory").value = product.category;
}

function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  products = products.filter(p => p.id !== id);
  cart = cart.filter(item => item.id !== id);

  saveData();
  loadCategories();
  displayProducts();
  renderCart();
  renderAdminProducts();
}

document.getElementById("loginBtn").onclick = function() {
  document.getElementById("loginModal").style.display = "flex";
};

document.getElementById("closeLogin").onclick = function() {
  document.getElementById("loginModal").style.display = "none";
};

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  if (email === "om@gmail.com" && password === "1234") {
    message.textContent = "Login successful!";
  } else {
    message.textContent = "Invalid email or password.";
  }
});

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);

loadCategories();
displayProducts();
renderCart();
renderAdminProducts();