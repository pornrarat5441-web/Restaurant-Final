let currentState = "waiting";

const orderData = {
  id: "A01",
  table: 1,

  menus: [
    {
      name: "ผัดผงกระหรี่",
      qty: 1
    },

    {
      name: "ไข่เจียว",
      qty: 1
    },

    {
      name: "ข้าวสวย",
      qty: 2
    },

    {
      name: "ไข่ดาว",
      qty: 1
    }
  ]
};

// let statusCounting = [];

// fetch('/orders')
//   .then(res => res.json())
//   .then(data => {
//     ordersData = data;
//     renderApp();
//   })
//   .catch(err => console.error('Error fetching orders:', err));


function renderApp(){

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
              ${orderData.table}
            </div>

          </div>

          <div class="order-section">

            <div class="order-id">
              ${orderData.id}
            </div>

            <div class="menu-list">

              ${orderData.menus.map(menu => `
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

  // DELIVERING

  if(currentState === "delivering"){

    app.innerHTML = `
      <div class="deliver-page">

        <div class="deliver-title">
          Delivering
        </div>

        <div class="deliver-order">
          ${orderData.id}
        </div>

        <div class="deliver-table">
          Table ${orderData.table}
        </div>

      <div class="action-buttons">
      <button
      class="fail-btn"
      onclick="showFailOptions()"
      >
      Fail
      </button>
      <button
       class="complete-btn"
       onclick="completeOrder()"
       >
       Complete
      </button>
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

function showFailOptions(){
  const reason = prompt(
    'Choose reason:\n1. cancel order\n2. return order\n3. other'
  );
  let failReason = '';
  if(reason === '1'){
    failReason = 'cancel order';
  }
  else if(reason === '2'){
    failReason = 'return order';
  }
  else{
    failReason = 'other';
  }
  failOrder(failReason);
}

async function completeOrder(){

  try{

    await fetch(`http://localhost:8080/orders/${orderData.id}`, {

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
    await fetch(`/orders/${orderData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        servingStatus: 'failed',
        failReason: reason
      })
    });
    currentState = "waiting";
    renderApp();
  }catch(error){
    console.log(error);
  }
}

renderApp();