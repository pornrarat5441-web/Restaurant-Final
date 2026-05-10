/* ============================
   Kitchen Dashboard — app.js
   ============================ */

   //import packages
   const express = require('express');
   const path = require('path');

   const orderRoutes = require('../routes/routeOrder.js');

   const app = express();

   //setting the system for crud in route.js
    app.use(express.json());

    //static files
    app.use(express.static(path.join(__dirname, 'public')));

    //routes
    app.use('/', orderRoutes);

    //to the first page
    app.get('/', (req, res) => {
      res.redirect('/default');
    });

    module.exports = app;
   //


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

// ── Mock Order Data ─────────────────────────────────────
const ORDERS_DATA = [

  {
    id: 'A01',
    table: 1,
    time: '15:30',
    status: 'prepare',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  {
    id: 'A02',
    table: 2,
    time: '15:31',
    status: 'done',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  {
    id: 'A03',
    table: 3,
    time: '15:32',
    status: 'done',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  {
    id: 'A04',
    table: 4,
    time: '15:33',
    status: 'preparing',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  {
    id: 'A05',
    table: 5,
    time: '15:36',
    status: 'preparing',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  {
    id: 'A06',
    table: 6,
    time: '15:40',
    status: 'prepare',
    menus: [
      { name: 'ผัดผงกระหรี่', qty: 1 },
      { name: 'ไข่เจียว', qty: 1 },
      { name: 'ข้าวสวย', qty: 2 },
    ],
  },

  
];

// ── Status cycle ────────────────────────────────────────
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

    <div class="order-card" id="card-${order.id}">

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
        ${buildStatusBtn(order.status, order.id)}
      </div>

    </div>

  `;
}

// ── Render orders ───────────────────────────────────────
function renderOrders() {

  const container = document.getElementById('orders-container');

  container.innerHTML = ORDERS_DATA.map(order => {
    return buildCard(order);
  }).join('');

  attachEvents();
  updateTopbarStats();
}

// ── Update top stats ────────────────────────────────────
function updateTopbarStats() {

  let prepareCount = 0;
  let preparingCount = 0;
  let doneCount = 0;
  let sendoutCount = 0;

  ORDERS_DATA.forEach(order => {

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

      const order = ORDERS_DATA.find(item => item.id === orderId);

      if (!order) return;

      // Remove card when sent
      if (nextStatus === null) {

        window.location.href = "choose.html";

        const card = document.getElementById(`card-${orderId}`);

        card.style.opacity = '0';
        card.style.transform = 'translateX(30px)';

        setTimeout(() => {

          const index = ORDERS_DATA.findIndex(item => item.id === orderId);

          if (index !== -1) {
            ORDERS_DATA.splice(index, 1);
          }

          renderOrders();

        }, 300);

        return;
      }

      // Update status
      order.status = nextStatus;

      renderOrders();

    });

  });

}

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

  renderOrders();

  updateClock();

  setInterval(updateClock, 1000);

});