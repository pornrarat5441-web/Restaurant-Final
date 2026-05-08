// mock history data

const HISTORY_DATA = [

  {
    table: 1,
    order: 'A01',
    time: '15:30',
    server: 'Jane',
    status: 'Delivered',
  },

  {
    table: 3,
    order: 'A03',
    time: '15:45',
    server: 'John',
    status: 'Delivered',
  },

];

// render

function renderHistory() {

  const container = document.getElementById('history-container');

  container.innerHTML = HISTORY_DATA.map(item => {

    return `

      <div class="order-card">

        <div class="table-col">
          ${item.table}
        </div>

        <div class="order-col">
          ${item.order}
        </div>

        <div class="time-col">
          ${item.time}
        </div>

        <div class="menu-col">
          ${item.server}
        </div>

        <div class="status-col">

          <button class="status-btn btn-done">
            ${item.status}
          </button>

        </div>

      </div>

    `;

  }).join('');

}

// back button

function goDashboard() {
  window.location.href = 'kitchen.html';
}

renderHistory();