let currentState = "waiting";
let showFailMenu = false;
let ordersData = [];
let waiterData = [];
let currentOrderData = null;
let currentWaiterInfo = null;

// Get current waiter from localStorage
const currentWaiter = localStorage.getItem('currentWaiter');

// Redirect if no waiter is selected
if (!currentWaiter) {
  window.location.href = './piChoose.html';
}

async function initApp() {
  try {
    // Fetch both datasets in parallel
    const [ordersRes, waitersRes] = await Promise.all([
      fetch('/orders'),
      fetch('/waiters')
    ]);

    ordersData = await ordersRes.json();
    waiterData = await waitersRes.json();

    // Find the current waiter's info and their assigned order
    currentWaiterInfo = waiterData.find(w => w.name === currentWaiter);
    console.log('Current Waiter Info:', currentWaiterInfo);
    
    if (currentWaiterInfo && currentWaiterInfo.orderId) {
      console.log('Looking for Order ID:', currentWaiterInfo.orderId);
      // Try matching by _id first, then by custom id string
      currentOrderData = ordersData.find(o => o._id === currentWaiterInfo.orderId || o.id === currentWaiterInfo.orderId);
      console.log('Matched Order Data:', currentOrderData);
      
      if (currentOrderData) {
        // FLOW FIX: 
        // If waiter status is 'available' but they HAVE an orderId, it means the order is INCOMING (waiting for accept).
        // If waiter status is 'busy', it means they already ACCEPTED and are DELIVERING.
        if (currentWaiterInfo.status === 'busy') {
          currentState = "delivering";
        } else {
          currentState = "incoming";
        }
      } else {
        currentState = "waiting";
      }
    } else {
      currentState = "waiting";
      currentOrderData = null;
    }

    renderApp();
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}

function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  // Update topbar info if needed (e.g., avatar/name)
  const avatar = document.querySelector('.avatar');
  if (avatar) avatar.textContent = currentWaiter || '👩';

  // WAITING
  if (currentState === "waiting") {
    app.innerHTML = `
      <div class="waiting-dashboard">
        <div class="status-item">
          <div class="status-icon">📋</div>
          <div class="status-number">1</div>
        </div>
        <div class="status-item">
          <div class="status-icon pink">⏱️</div>
          <div class="status-number">2</div>
        </div>
        <div class="status-item">
          <div class="status-icon pink">🍳</div>
          <div class="status-number">2</div>
        </div>
        <div class="status-item">
          <div class="status-icon red">🍜</div>
          <div class="status-number">1</div>
        </div>
      </div>
      <div style="margin-top: 20px; text-align: center;">
        <p>Logged in as: <strong>${currentWaiter}</strong></p>
        <button class="demo-btn" onclick="logout()">Logout / Switch Waiter</button>
      </div>
    `;
  }

  // INCOMING
  else if (currentState === "incoming") {
    if (!currentOrderData) {
      app.innerHTML = `<div class="order-card"><p>No order assigned.</p><button onclick="goWaiting()">Back</button></div>`;
      return;
    }

    // MENU RENDERING FIX: Use .map and join safely
    const menuHtml = (currentOrderData.menus && currentOrderData.menus.length > 0) 
      ? currentOrderData.menus.map(menu => `
          <div class="menu-row">
            <span>${menu.name}</span>
            <span>x${menu.qty}</span>
          </div>
        `).join("")
      : "<div>No menu items</div>";

    app.innerHTML = `
      <div class="order-card">
        <div class="content">
          <div class="table-section">
            <div class="table-icon">🍽️</div>
            <div class="table-number">${currentOrderData.table}</div>
          </div>
          <div class="order-section">
            <div class="order-id">${currentOrderData.id}</div>
            <div class="menu-list">
              ${menuHtml}
            </div>
          </div>
        </div>
        <div class="button-group">
          <button class="reject-btn" onclick="rejectOrder()">✖</button>
          <button class="accept-btn" onclick="acceptOrder()">✔</button>
        </div>
      </div>
    `;
  }

  // DELIVERING
  else if (currentState === "delivering") {
    if (!currentOrderData) {
      app.innerHTML = `<div class="order-card"><p>No order in delivery.</p><button onclick="goWaiting()">Back</button></div>`;
      return;
    }

    const menuHtml = (currentOrderData.menus && currentOrderData.menus.length > 0) 
      ? currentOrderData.menus.map(menu => `
          <div class="menu-row">
            <span>${menu.name}</span>
            <span>x${menu.qty}</span>
          </div>
        `).join("")
      : "<div>No menu items</div>";

    app.innerHTML = `
      <div class="deliver-page">
        <div class="deliver-title">Delivering</div>
        <div class="deliver-order">${currentOrderData.id}</div>
        <div class="deliver-table">Table ${currentOrderData.table}</div>
        
        <div class="menu-list" style="margin: 20px 0; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px;">
          ${menuHtml}
        </div>

        <div class="action-buttons">
          <button class="complete-btn" onclick="completeOrder()">✔</button>
          <div class="fail-wrapper">
            ${showFailMenu ? `
              <div class="fail-popup">
                <button onclick="failOrder('cancel order')">Cancel Order</button>
                <button onclick="failOrder('return order')">Return Order</button>
                <button onclick="failOrder('other')">Other</button>
              </div>
            ` : ''}
            <button class="fail-btn" onclick="toggleFailMenu()">👎</button>
          </div>
        </div>
      </div>
    `;
  }
}

function showIncoming() {
  currentState = "incoming";
  renderApp();
}

async function acceptOrder() {
  if (!currentWaiterInfo) return;

  try {
    // Update waiter status to busy on the server
    await fetch(`/waiters/${currentWaiterInfo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'busy' })
    });

    // Refresh data from server to ensure local state is synced
    await initApp();
  } catch (error) {
    console.error('Error accepting order:', error);
  }
}

async function rejectOrder() {
  if (!currentWaiterInfo) return;

  try {
    // Clear the waiter's assignment on the server
    await fetch(`/waiters/${currentWaiterInfo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: null, status: 'available' })
    });

    // Also update the Order to clear the waiterName so it can be re-assigned
    if (currentOrderData) {
       await fetch(`/orders/${currentOrderData._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          waiterName: "", 
          servingStatus: null 
        })
      });
    }

    await initApp(); // Refresh everything
  } catch (error) {
    console.error('Error rejecting order:', error);
  }
}

function goWaiting() {
  currentState = "waiting";
  renderApp();
}

function toggleFailMenu() {
  showFailMenu = !showFailMenu;
  renderApp();
}

async function completeOrder() {
  if (!currentOrderData || !currentWaiterInfo) return;

  try {
    // 1. Update Order Status to 'complete' (for history page)
    const orderPromise = fetch(`/orders/${currentOrderData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        servingStatus: 'complete',
        servingTime: getNowTime()
      })
    });

    // 2. Update Waiter Status to 'available' and clear orderId
    const waiterPromise = fetch(`/waiters/${currentWaiterInfo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'available',
        orderId: null
      })
    });

    await Promise.all([orderPromise, waiterPromise]);

    await initApp(); // Refresh everything
  } catch (error) {
    console.error('Error completing order:', error);
  }
}

async function failOrder(reason) {
  if (!currentOrderData || !currentWaiterInfo) return;

  try {
    // 1. Update Order Status to failed
    const orderPromise = fetch(`/orders/${currentOrderData._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        servingStatus: 'failed',
        failReason: reason,
        servingTime: getNowTime()
      })
    });

    // 2. Update Waiter Status back to available
    const waiterPromise = fetch(`/waiters/${currentWaiterInfo._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'available',
        orderId: null
      })
    });

    await Promise.all([orderPromise, waiterPromise]);

    showFailMenu = false;
    await initApp(); // Refresh everything
  } catch (error) {
    console.error('Error failing order:', error);
  }
}

function logout() {
  localStorage.removeItem('currentWaiter');
  window.location.href = './piChoose.html';
}

function getNowTime() {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + 
         now.getMinutes().toString().padStart(2, '0');
}

// Start the app
initApp();
