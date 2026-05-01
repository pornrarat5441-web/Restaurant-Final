// mock data 
let orders = [
  { id: 1, table: 1, items: "ผัดกะเพรา", status: "pending" },
  { id: 2, table: 2, items: "ข้าวไข่เจียว", status: "preparing" }
];

// โหลดหน้าเว็บ
function renderOrders() {
  const container = document.getElementById("order-list");
  container.innerHTML = "";

  orders.forEach(order => {
    // ถ้า send แล้วไม่ต้องแสดง
    if (order.status === "delivering") return;

    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <h3>โต๊ะ ${order.table}</h3>
      <p>${order.items}</p>
      ${getButton(order)}
    `;

    container.appendChild(div);
  });
}

// ปุ่มตาม status
function getButton(order) {
  if (order.status === "pending") {
    return `<button class="prepare" onclick="startOrder(${order.id})">Prepare</button>`;
  }

  if (order.status === "preparing") {
    return `<button class="preparing" onclick="markReady(${order.id})">Preparing</button>`;
  }

  if (order.status === "ready") {
    return `<button class="send" onclick="sendOrder(${order.id})">Send Order</button>`;
  }
}

// กด Prepare
function startOrder(id) {
  const order = orders.find(o => o.id === id);
  order.status = "preparing";
  renderOrders();
}

// กด Ready
function markReady(id) {
  const order = orders.find(o => o.id === id);
  order.status = "ready";
  renderOrders();
}

// กด Send
function sendOrder(id) {
  const order = orders.find(o => o.id === id);
  order.status = "delivering";
  renderOrders();
}

// เริ่มต้น
renderOrders();