const productsByCategory = {
  figuras: {
    title: "Figuras",
    description: "Figuras coleccionables para decorar tu habitacion o vitrina.",
    products: [
      {
        id: "figura-coleccionable",
        name: "Figura coleccionable",
        description: "Figura premium inspirada en personajes de anime.",
        price: 35,
        image: "figura coleccionable.jpg"
      },
      {
        id: "nendoroid-chibi",
        name: "Nendoroid estilo chibi",
        description: "Figura pequena con accesorios intercambiables.",
        price: 28,
        image: "Nendoroid estilo chibi.jpg"
      },
      {
        id: "figura-accion",
        name: "Figura de accion",
        description: "Modelo articulado para poses de batalla y exhibicion.",
        price: 42,
        image: "Figura de accion.jpg"
      }
    ]
  },
  manga: {
    title: "Manga",
    description: "Tomos, ediciones especiales y lecturas para fans del manga.",
    products: [
      {
        id: "manga-especial",
        name: "Manga edicion especial",
        description: "Tomo impreso con sobrecubierta y arte de coleccion.",
        price: 12,
        image: "Manga edicion especial.jpg"
      },
      {
        id: "pack-shonen",
        name: "Pack de manga shonen",
        description: "Set de volumenes con historias de accion y aventura.",
        price: 38,
        image: "Pack de manga shonen.jpg"
      },
      {
        id: "manga-romance",
        name: "Manga romance escolar",
        description: "Historias ligeras con ilustraciones expresivas.",
        price: 10,
        image: "Manga romance bl.jpg"
      }
    ]
  },
  snacks: {
    title: "Snacks",
    description: "Dulces, bebidas y sabores japoneses para probar algo distinto.",
    products: [
      {
        id: "box-snacks",
        name: "Box de snacks japoneses",
        description: "Dulces, bebidas y botanas importadas desde Japon.",
        price: 22,
        image: "Box de snacks japoneses.jpg"
      },
      {
        id: "ramune",
        name: "Ramune japones",
        description: "Bebida japonesa refrescante con botella clasica.",
        price: 5,
        image: "Ramune japones.jpg"
      },
      {
        id: "mochis",
        name: "Mochis surtidos",
        description: "Dulces suaves con sabores tradicionales japoneses.",
        price: 9,
        image: "Mochis surtidos.jpg"
      }
    ]
  },
  ropa: {
    title: "Ropa japonesa",
    description: "Prendas inspiradas en estilos japoneses, anime y streetwear.",
    products: [
      {
        id: "kimono",
        name: "Kimono decorativo",
        description: "Prenda ligera inspirada en patrones tradicionales.",
        price: 45,
        image: "Kimono decorativo.jpg"
      },
      {
        id: "hoodie-anime",
        name: "Hoodie anime",
        description: "Sudadera con estampado inspirado en cultura otaku.",
        price: 32,
        image: "Hoodie anime.jpg"
      },
      {
        id: "camiseta-kanji",
        name: "Camiseta kanji",
        description: "Camiseta casual con diseno tipografico japones.",
        price: 18,
        image: "Camiseta kanji.jpg"
      }
    ]
  },
  accesorios: {
    title: "Accesorios",
    description: "Detalles pequenos para mochila, escritorio y coleccion personal.",
    products: [
      {
        id: "llavero",
        name: "Llavero anime",
        description: "Accesorio pequeno para mochila, bolso o llaves.",
        price: 4,
        image: "Llavero anime.jpg"
      },
      {
        id: "poster",
        name: "Poster japones",
        description: "Lamina decorativa para habitacion o estudio.",
        price: 8,
        image: "Poster japones.jpg"
      },
      {
        id: "taza",
        name: "Taza anime",
        description: "Taza de ceramica para cafe, te o chocolate.",
        price: 11,
        image: "Taza anime.jpg"
      }
    ]
  }
};

const orderForm = document.querySelector("#orderForm");
const formMessage = document.querySelector("#formMessage");
const productGrid = document.querySelector("#productGrid");
const categoryButtons = document.querySelectorAll(".category-button");
const categoryTitle = document.querySelector("#categoryTitle");
const categoryDescription = document.querySelector("#categoryDescription");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const showCheckoutButton = document.querySelector("#showCheckout");
const kawaiiMessage = document.querySelector("#kawaiiMessage");
const apiBaseUrl = "http://localhost/akiba-store/";
const clientOrderSection = document.querySelector("#pedidoCliente");
const clientOrderSummary = document.querySelector("#clientOrderSummary");

let cart = [];

renderCategory("figuras");
renderCart();

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    categoryButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    renderCategory(button.dataset.category);
  });
});

showCheckoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    showKawaiiMessage("Tu carrito esta vacio", "Primero selecciona un producto con el boton Agregar.");
    return;
  }

  orderForm.classList.remove("hidden");
  orderForm.scrollIntoView({ behavior: "smooth", block: "start" });
});

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (cart.length === 0) {
    formMessage.textContent = "Agrega productos al carrito antes de confirmar.";
    return;
  }

  formMessage.textContent = "Guardando pedido...";

  const customerData = new FormData(orderForm);

  try {
    const purchasedItems = [...cart];

    for (const item of purchasedItems) {
      const formData = new FormData();
      formData.append("cliente", customerData.get("cliente"));
      formData.append("correo", customerData.get("correo"));
      formData.append("telefono", customerData.get("telefono"));
      formData.append("ciudad", customerData.get("ciudad"));
      formData.append("producto", item.name);
      formData.append("cantidad", item.quantity);
      formData.append("precio_unitario", item.price.toFixed(2));
      formData.append("total", (item.price * item.quantity).toFixed(2));
      formData.append("direccion", customerData.get("direccion"));

      const response = await fetch(`${apiBaseUrl}guardar_pedido.php`, {
        method: "POST",
        body: formData,
        cache: "no-store"
      });

      const result = await readJsonResponse(response);

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "No se pudo guardar el pedido.");
      }
    }

    formMessage.textContent = "Pedido realizado con exito.";
    showKawaiiMessage("Arigato!", "Tu compra kawaii fue guardada. Prepara espacio para tu coleccion.");
    renderClientOrder(customerData, purchasedItems);
    cart = [];
    renderCart();
    orderForm.reset();
    orderForm.classList.add("hidden");
  } catch (error) {
    formMessage.textContent = error.message;
  }
});

function renderCategory(categoryKey) {
  const category = productsByCategory[categoryKey];
  categoryTitle.textContent = category.title;
  categoryDescription.textContent = category.description;

  productGrid.innerHTML = category.products.map((product) => `
    <article class="product-card">
      <img src="${product.image}" alt="${escapeHtml(product.name)}" />
      <div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-meta">
          <span class="product-price">$${product.price.toFixed(2)}</span>
          <button class="add-button" type="button" data-product-id="${product.id}">Agregar</button>
        </div>
      </div>
    </article>
  `).join("");

  productGrid.querySelectorAll(".add-button").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.productId));
  });
}

function addToCart(productId) {
  const product = findProduct(productId);
  const currentItem = cart.find((item) => item.id === productId);

  if (currentItem) {
    currentItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  renderCart();
  showKawaiiMessage("Producto agregado", `${product.name} entro al carrito.`);
  document.querySelector("#carrito").scrollIntoView({ behavior: "smooth", block: "start" });
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();

  if (cart.length === 0) {
    orderForm.classList.add("hidden");
  }
}

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Tu carrito espera productos kawaii.</p>';
    cartTotal.textContent = "$0.00";
    showCheckoutButton.disabled = true;
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <div>
        <h3>${escapeHtml(item.name)}</h3>
        <p>${item.quantity} x $${item.price.toFixed(2)}</p>
      </div>
      <button class="remove-button" type="button" data-product-id="${item.id}">Quitar</button>
    </article>
  `).join("");

  cartItems.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", () => removeFromCart(button.dataset.productId));
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
  showCheckoutButton.disabled = false;
}

function findProduct(productId) {
  return Object.values(productsByCategory)
    .flatMap((category) => category.products)
    .find((product) => product.id === productId);
}

function renderClientOrder(customerData, items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  clientOrderSummary.innerHTML = `
    <article class="order-item">
      <h3>${escapeHtml(customerData.get("cliente"))}</h3>
      <p><strong>Correo:</strong> ${escapeHtml(customerData.get("correo"))}</p>
      <p><strong>Telefono:</strong> ${escapeHtml(customerData.get("telefono"))}</p>
      <p><strong>Ciudad:</strong> ${escapeHtml(customerData.get("ciudad"))}</p>
      <p><strong>Direccion:</strong> ${escapeHtml(customerData.get("direccion"))}</p>
      <div class="client-products">
        ${items.map((item) => `
          <p><strong>${escapeHtml(item.name)}:</strong> ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}</p>
        `).join("")}
      </div>
      <p class="client-total"><strong>Total:</strong> $${total.toFixed(2)}</p>
    </article>
  `;

  clientOrderSection.classList.remove("hidden");
  clientOrderSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showKawaiiMessage(title, text) {
  kawaiiMessage.querySelector("strong").textContent = title;
  kawaiiMessage.querySelector("span").textContent = text;
  kawaiiMessage.classList.remove("hidden");

  window.setTimeout(() => {
    kawaiiMessage.classList.add("hidden");
  }, 3600);
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (text.trim() === "") {
    throw new Error(`El servidor respondio vacio. Abre la tienda desde http://localhost/akiba-store/index.html y recarga con Ctrl + F5. Estado HTTP: ${response.status}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Respuesta no valida del servidor: ${text.slice(0, 180)}`);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
