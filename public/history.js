let HISTORY_DATA = [];

async function loadHistory() {

  try {

    const res = await fetch('http://localhost:8080/orders');

    const data = await res.json();

    // เอาเฉพาะ order ที่มี waiter
    HISTORY_DATA = data.filter(order => order.waiterName);

    renderHistory();

  } catch (error) {

    console.log(error);

  }

}

function renderHistory() {

  const container = document.getElementById('history-container');

  // ไม่มี history
  if (HISTORY_DATA.length === 0) {

    container.innerHTML = `
      <div class="empty-history">
        No history yet
      </div>
    `;

    return;
  }

  // render cards
  container.innerHTML = HISTORY_DATA.map(order => {

    let statusText = '';

    if (order.servingStatus === 'complete') {
      statusText = 'Delivered';
    }
    else if (order.servingStatus === 'failed') {
      statusText = 'Failed';
    }
    else {
      statusText = 'In Process';
    }

    return `
      <div class="order-card">

        <!-- TABLE -->
        <div class="table-col">
          ${order.table}
        </div>

        <!-- ORDER -->
        <div class="order-col">
          ${order.id}
        </div>

        <!-- TIME -->
        <div class="time-col">
          ${order.servingTime}
        </div>

        <!-- SERVER -->
        <div class="menu-col">

          <div class="menu-row">
            👩 ${order.waiterName || '-'}
          </div>

        </div>

        <!-- STATUS -->
        <div class="status-col">

          <div class="history-status ${order.servingStatus}">
            ${statusText}
          </div>

          <div class="fail-reason">
          ${order.failReason || ''}
          </div>
          
        </div>

      </div>
    `;

  }).join('');

}

function goDashboard() {

  window.location.href = 'index.html';

}

document.addEventListener('DOMContentLoaded', () => {

  loadHistory();

});