let waitersData = [];

async function loadWaiters(){
  try{
    const res = await fetch('/waiters');
    const data = await res.json();
    waitersData = data;
    renderWaiters();
  }catch(error){
    console.error('loadWaiters error:', error);
  }
}

function renderWaiters(){
  const container = document.getElementById('waiters-container');
  container.innerHTML = waitersData.map(waiter => `
    <div class="waiters-card">
      <span class="waiter-icon">${waiterIcon(waiter)}</span>
      ${waiter.name}
    </div>
  `).join('');
}

loadWaiters();

function waiterIcon(waiter) {
  if(waiter.name === "John") {
    return "👨";
  } else
  return "👩‍🦰";  
}

function getRealTimeforOrder() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`
}

const timeDisplay = document.getElementById('time');
timeDisplay.innerHTML = getRealTimeforOrder();