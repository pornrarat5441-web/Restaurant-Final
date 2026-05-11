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
        card.innerHTML = `
          <div class="avatar">
            ${waiter.name === 'John' ? '👨' : '👩'}
          </div>
          <h2>${waiter.name}</h2>
        `;

        card.addEventListener('click', () => {
          selectServer(waiter.name);
        });

        container.appendChild(card);
      });
    })
    .catch(err => console.error('Error fetching waiters:', err));
}

async function selectServer(name) {
  if (!orderId) return;

  try {
    const response = await fetch(`/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ waiterName: name , servingTime: getRealTimeforOrder(), deviceId: waitersData.find(w => w.name === name).deviceId}),
    });

    if (!response.ok) {
      throw new Error('Failed to update order');
    }

    alert(`Order assigned to ${name}`);
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