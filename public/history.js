let HISTORY_DATA = [];

async function loadHistory() {

  try {

    const res = await fetch('/orders');

    const data = await res.json();

    // แสดงเฉพาะ order ที่มี waiter แล้ว
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

    // status color class
    let statusClass = '';

    if (order.servingStatus === 'complete') {

      statusText = 'Delivered';

      statusClass = 'delivered';

    }

    else if (order.servingStatus === 'failed') {

      statusText = 'Failed';

      statusClass = 'failed';

    }

    else {

      statusText = 'In Process';

      statusClass = 'inprocess';

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
          ${order.servingTime || '-'}
        </div>

        <!-- SERVER -->
        <div class="menu-col">

          <div class="menu-row">
            👩 ${order.waiterName || '-'}
          </div>

        </div>

        <!-- STATUS -->
        <div class="status-col">

          <div>

            <div class="history-status ${statusClass}">
              ${statusText}
            </div>

            ${order.failReason ? `

              <div class="fail-reason">
                ${order.failReason}
              </div>

            ` : ''}

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