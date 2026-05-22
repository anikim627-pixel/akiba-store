const apiBaseUrl = "http://localhost/akiba-store/";
const loadOrdersButton = document.querySelector("#loadOrders");
const ordersList = document.querySelector("#ordersList");

loadOrdersButton.addEventListener("click", loadOrders);
loadOrders();

async function loadOrders() {
  ordersList.innerHTML = "<p>Cargando pedidos...</p>";

  try {
    const response = await fetch(`${apiBaseUrl}listar_pedidos.php?limite=50`, {
      method: "GET",
      cache: "no-store"
    });

    const result = await readJsonResponse(response);

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "No se pudieron cargar los pedidos.");
    }

    if (result.data.length === 0) {
      ordersList.innerHTML = "<p>No hay pedidos registrados todavia.</p>";
      return;
    }

    ordersList.innerHTML = result.data.map((pedido) => `
      <article class="order-item">
        <h3>${escapeHtml(pedido.producto)}</h3>
        <p><strong>ID:</strong> ${pedido.id}</p>
        <p><strong>Cliente:</strong> ${escapeHtml(pedido.cliente)}</p>
        <p><strong>Correo:</strong> ${escapeHtml(pedido.correo)}</p>
        <p><strong>Telefono:</strong> ${escapeHtml(pedido.telefono || "No registrado")}</p>
        <p><strong>Ciudad:</strong> ${escapeHtml(pedido.ciudad || "No registrada")}</p>
        <p><strong>Cantidad:</strong> ${pedido.cantidad}</p>
        <p><strong>Precio:</strong> $${Number(pedido.precio_unitario || 0).toFixed(2)}</p>
        <p><strong>Total:</strong> $${Number(pedido.total || 0).toFixed(2)}</p>
        <p><strong>Direccion:</strong> ${escapeHtml(pedido.direccion)}</p>
        <p><strong>Fecha:</strong> ${escapeHtml(pedido.fecha_creacion)}</p>
        <button class="delete-order-button" type="button" data-id="${pedido.id}">Eliminar pedido</button>
      </article>
    `).join("");

    ordersList.querySelectorAll(".delete-order-button").forEach((button) => {
      button.addEventListener("click", () => deleteOrder(button.dataset.id));
    });
  } catch (error) {
    ordersList.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

async function deleteOrder(id) {
  const confirmed = window.confirm(`Deseas eliminar el pedido #${id}?`);

  if (!confirmed) {
    return;
  }

  const formData = new FormData();
  formData.append("id", id);

  try {
    const response = await fetch(`${apiBaseUrl}eliminar_pedido.php`, {
      method: "POST",
      body: formData,
      cache: "no-store"
    });

    const result = await readJsonResponse(response);

    if (!response.ok || !result.ok) {
      throw new Error(result.message || "No se pudo eliminar el pedido.");
    }

    await loadOrders();
  } catch (error) {
    ordersList.innerHTML = `<p>${escapeHtml(error.message)}</p>`;
  }
}

async function readJsonResponse(response) {
  const text = await response.text();

  if (text.trim() === "") {
    throw new Error(`El servidor respondio vacio. Estado HTTP: ${response.status}`);
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
