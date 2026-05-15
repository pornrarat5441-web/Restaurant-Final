/* ============================
   Kitchen Dashboard — app.js
   ============================ */

const socket = io();

socket.on('connect', () => {
    console.log('CONNECTED');
});

// Listen for real-time updates
socket.on('orders_updated', () => {
  console.log('Orders updated, calling fetchOrders()...');
  fetchOrders();
});

// ── Order Data and Fetching
let ordersData = [];

function fetchOrders() {
  console.log('Fetching orders from /orders...');
  fetch('/orders')
    .then(res => res.json())
    .then(data => {
      console.log('Orders data received:', data);
      ordersData = data;
      renderOrders();
    })
    .catch(err => console.error('Error fetching orders:', err));
}

// Initial fetch
fetchOrders();

// ── SVG icons ──────────────────────────────────────────
const ICONS = {
  pot: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M2 14h20M6 14V8a6 6 0 0112 0v6M4 20h16"/>
      <path d="M8 8V5M16 8V5"/>
    </svg>
  `,

  bowl: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <path d="M4 11h16a8 8 0 01-16 0z"/>
      <path d="M12 19v2M9 21h6"/>
    </svg>
  `,

  plate: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
      <ellipse cx="12" cy="18" rx="8" ry="2"/>
      <path d="M4 18V9a8 4 0 0116 0v9"/>
    </svg>
  `,
};

// ── Status cycle ──────────────────────────────────────── checked
const STATUS_CYCLE = {
  prepare: 'preparing',
  preparing: 'done',
  done: 'sendout',
  sendout: null,
};

// ── Build status button ─────────────────────────────────
function buildStatusBtn(status, orderId) {

  const config = {

    prepare: {
      className: 'btn-prepare',
      label: 'Prepare',
      icon: '⏱',
    },

    preparing: {
      className: 'btn-preparing',
      label: 'Preparing...',
      icon: '🍳',
    },

    done: {
      className: 'btn-done',
      label: 'Done',
      icon: '🍜',
    },

    sendout: {
      className: 'btn-sendout',
      label: 'Send out the order',
      icon: '🍽',
    },

  };

  const current = config[status];

  return `
    <button
      class="status-btn ${current.className}"
      data-id="${orderId}"
      data-status="${status}"
    >
      <span>${current.label}</span>
      <span>${current.icon}</span>
    </button>
  `;
}

// ── Build menu HTML ─────────────────────────────────────
function buildMenus(menus) {

  return menus.map(menu => `
    <div class="menu-row">
      <span>${menu.name}</span>
      <span>x${menu.qty}</span>
    </div>
  `).join('');

}



// ── Build one order card ────────────────────────────────
function buildCard(order) {

  return `

      <div class="order-card" id="card-${order._id}">

      <div class="table-col">
        ${order.table}
      </div>

      <div class="order-col">
        ${order.id}
      </div>

      <div class="time-col">
        ${order.time}
      </div>

      <div class="menu-col">
        ${buildMenus(order.menus)}
      </div>

      <div class="status-col">
        ${buildStatusBtn(order.status, order._id)}
      </div>

    </div>

  `;
}

// ── Render orders ───────────────────────────────────────
function renderOrders() {
  console.log('Rendering orders...');
  const container = document.getElementById('orders-container');
  const visibleOrders = ordersData.filter(order => !order.waiterName);
  console.log('Visible orders count:', visibleOrders.length);

  container.innerHTML = visibleOrders.map(order => {
    return buildCard(order);
  }).join('');

  attachEvents();
  updateTopbarStats(visibleOrders);
}

// ── Update top stats ────────────────────────────────────
function updateTopbarStats(orders = []) {

  let prepareCount = 0;
  let preparingCount = 0;
  let doneCount = 0;
  let sendoutCount = 0;

  orders.forEach(order => {

    if (order.status === 'prepare') {
      prepareCount++;
    }

    if (order.status === 'preparing') {
      preparingCount++;
    }

    if (order.status === 'done') {
      doneCount++;
    }

    if (order.status === 'sendout') {
      sendoutCount++;
    }

  });

  document.getElementById('prepare-count').textContent = prepareCount;
  document.getElementById('preparing-count').textContent = preparingCount;
  document.getElementById('done-count').textContent = doneCount;
  document.getElementById('sendout-count').textContent = sendoutCount;
}

// ── Handle button clicks ────────────────────────────────
function attachEvents() {

  const buttons = document.querySelectorAll('.status-btn');

  buttons.forEach(button => {

    button.addEventListener('click', () => {

      const orderId = button.dataset.id;
      const currentStatus = button.dataset.status;

      const nextStatus = STATUS_CYCLE[currentStatus];

      const order = ordersData.find(item => item._id === orderId);

      if (!order) return;

      // Remove card when sent
      if (nextStatus === null) {

        window.location.href = `choose.html?orderId=${orderId}`;

        const card = document.getElementById(`card-${orderId}`);

        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';

        setTimeout(() => {

          const index = ordersData.findIndex(item => item._id === orderId);

          if (index !== -1) {
            ordersData.splice(index, 1);
          }

          renderOrders();

        }, 300);

        return;
      }

      // Update status
      order.status = nextStatus;
      updateOrderStatus(orderId, nextStatus);
      renderOrders();

    });

  });

}

//update order status in database
function updateOrderStatus(orderId, newStatus) {
  fetch(`/orders/${orderId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  })
  .then(res => res.json())
  .then(data => {
    // update local ordersData
    renderOrders();
  })
  .catch(err => console.error('Error updating order:', err));
};

// ── Live clock ──────────────────────────────────────────
function updateClock() {

  const now = new Date();

  const hours = String(now.getHours()).padStart(2, '0');

  const minutes = String(now.getMinutes()).padStart(2, '0');

  const currentTime = `${hours}:${minutes}`;

  const clock = document.getElementById('clock-time');

  if (clock) {
    clock.textContent = currentTime;
  }

}

//post and get for mongodb


// ── Init ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  updateClock();

  setInterval(updateClock, 1000);

});
