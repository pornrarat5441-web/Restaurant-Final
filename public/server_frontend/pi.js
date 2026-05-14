let currentState = "waiting";
let showFailMenu = false
let orderId;
import { currentWaiter } from './piChoose.js';

// const orderData = {
//   id: "A01",
//   table: 1,

//   menus: [
//     {
//       name: "ผัดผงกระหรี่",
//       qty: 1
//     },

//     {
//       name: "ไข่เจียว",
//       qty: 1
//     },

//     {
//       name: "ข้าวสวย",
//       qty: 2
//     },

//     {
//       name: "ไข่ดาว",
//       qty: 1
//     }
//   ]
// };

// let statusCounting = [];

// fetch('/orders')
//   .then(res => res.json())
//   .then(data => {
//     ordersData = data;
//     renderApp();
//   })
//   .catch(err => console.error('Error fetching orders:', err));


//fetching order data from database and use it with buildcard in pi function
let ordersData = [];
fetch('/orders')
  .then(res => res.json())
  .then(data => {
    ordersData = data;
    //function
    renderApp();
  })
  .catch(err => console.error('Error fetching orders:', err));

  let waiterData = [];
  fetch('/waiters')
    .then(res => res.json())
    .then(data => {
      waiterData = data;
      //function
      renderApp();
    })
    .catch(err => console.error('Error fetching waiters:', err));

if (currentWaiter) {
  const currenrOrder = waiterData.find(waiter => waiter.name === currentWaiter);
  if (currentOrder) {
    const orderId = currentOrder.orderId;
  }
}

const currentOrderData = ordersData.find(order => order.id === orderId);

function renderApp(currentOrderData){

  const app = document.getElementById("app");

  // WAITING

  if(currentState === "waiting"){

  app.innerHTML = `
  
    <div class="waiting-dashboard">


      <div class="status-item">
        
        <div class="status-icon">   
          📋         
        </div>

        <div class="status-number">
          1
        </div>

      </div>

 
      <div class="status-item">
        
        <div class="status-icon pink">
          ⏱️
        </div>

        <div class="status-number">
          2
        </div>

      </div>


      <div class="status-item">

        <div class="status-icon pink">
          🍳
        </div>

        <div class="status-number">
          2
        </div>

      </div>

 
      <div class="status-item">

        <div class="status-icon red">
          🍜
        </div>

        <div class="status-number">
          1
        </div>

      </div>

    </div>

    <button
      class="demo-btn"
      onclick="showIncoming()"
    >
      Demo Waiting For Order
    </button>

  `;
}

  // INCOMING

  if(currentState === "incoming"){

    app.innerHTML = `
      <div class="order-card">

        <div class="content">

          <div class="table-section">

            <div class="table-icon">
              🍽️
            </div>

            <div class="table-number">
              ${currentOrderData.table}
            </div>

          </div>

          <div class="order-section">

            <div class="order-id">
              ${currentOrderData.id}
            </div>

            <div class="menu-list">

              ${currentOrderData.menus.map(menu => `
                <div class="menu-row">

                  <span>
                    ${menu.name}
                  </span>

                  <span>
                    x${menu.qty}
                  </span>

                </div>
              `).join("")}

            </div>

          </div>

        </div>

        <div class="button-group">

          <button
            class="reject-btn"
            onclick="rejectOrder()"
          >
            ✖
          </button>

          <button
            class="accept-btn"
            onclick="acceptOrder()"
          >
            ✔
          </button>

        </div>

      </div>
    `;
  }

  // DELIVERING///////////////////////////////////////

  if(currentState === "delivering"){

    app.innerHTML = `
      <div class="deliver-page">

        <div class="deliver-title">
          Delivering
        </div>

        <div class="deliver-order">
          ${currentOrderData.id}
        </div>

        <div class="deliver-table">
          Table ${currentOrderData.table}
        </div>

      <div class="action-buttons">

  <button
    class="complete-btn"
    onclick="completeOrder()"
  >
    ✔
  </button>

  <div class="fail-wrapper">

    ${showFailMenu ? `

      <div class="fail-popup">

        <button onclick="failOrder('cancel order')">
          Cancel Order
        </button>

        <button onclick="failOrder('return order')">
          Return Order
        </button>

        <button onclick="failOrder('other')">
          Other
        </button>

      </div>

    ` : ''}

    <button
      class="fail-btn"
      onclick="toggleFailMenu()"
    >
      👎
    </button>

  </div>

</div>
    `;
  }

}

function showIncoming(){

  currentState = "incoming";

  renderApp();
}

function acceptOrder(){

  currentState = "delivering";

  renderApp();
}

function rejectOrder(){

  currentState = "waiting";

  renderApp();
}
function toggleFailMenu(){

  showFailMenu = !showFailMenu;

  renderApp();

}

async function completeOrder(){

  try{

    await fetch(`http://localhost:8080/orders/${currentOrderData.id}`, {

      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({
        servingStatus: 'delivered'
      })

    });

    currentState = "waiting";

    renderApp();

  }catch(error){

    console.log(error);

  }

}

async function failOrder(reason){

  try{

    await fetch(`/orders/${currentOrderData.id}`, {

      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      body: JSON.stringify({

        servingStatus: 'failed',

        failReason: reason

      })

    });

    showFailMenu = false;

    currentState = "waiting";

    renderApp();

  }catch(error){

    console.log(error);

  }

}

renderApp();