const params = new URLSearchParams(window.location.search);
const orderId = params.get('orderId');
let waitersData = [];

if (!orderId) {
  const container = document.querySelector('.choose-container');
  if (container) {
    container.textContent = 'No order selected. Please return from the orders page.';
  }
} else {
  fetch('/waiters')
    .then(res => res.json())
    .then(data => {
      waitersData = data;
      const container = document.querySelector('.choose-container');
      container.innerHTML = '';

      waitersData.forEach(waiter => {
        const card = document.createElement('div');
        card.className = 'server-card';

        if (waiter.status === 'busy') {
          card.classList.add('busy');
          card.style.opacity = '0.5';
          card.style.pointerEvents = 'none';
        }

        card.innerHTML = `
          <div class="avatar">
            ${waiter.name === 'John' ? '👨' : '👩'}
          </div>
          <h2>${waiter.name}</h2>
          ${waiter.status === 'busy' ? '<div class="busy-badge">Busy</div>' : ''}
        `;

        if (waiter.status !== 'busy') {
          card.addEventListener('click', async () => {
            await assignWaiter(orderId, waiter);
          });
        }

        container.appendChild(card);
      });
    })
    .catch(err => console.error('Error fetching waiters:', err));
}

async function assignWaiter(orderId, waiter) {
  if (!orderId) return;

  try {
    const orderResponse = await fetch(`/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        waiterName: waiter.name,
        servingTime: getRealTimeforOrder(),
        deviceId: waiter.deviceId,
        servingStatus: 'inprocess'
      })
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to update order');
    }

    const waiterResponse = await fetch(`/waiters/${waiter._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: 'busy' , orderId: orderId })
    });

    if (!waiterResponse.ok) {
      throw new Error('Failed to update waiter status');
    }

    alert(`Order assigned to ${waiter.name}`);
    window.location.href = 'history.html';
  } catch (err) {
    console.error(err);
    alert('Unable to assign waiter. Please try again.');
  }
}

function getRealTimeforOrder() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`
}