const waiters = require('./waitersData');
//waiters name
const availableWaiter = waiters.find(w => w.status === "available");

const orders = [
    {
      id: "A73",
      table: 20,
      time: getRealTimeforOrder(),
      status: "prepare",
      menus: [
        {
          name: "Dirty Milky Donut (S)",
          qty: 1
        }
      ],
      waiterName: null,
      servingStatus: null, //receive data from pi if the waiter click check mark for serving the order **
      servingTime: null, //serve at the time we click to choose the server
      deviceId: null,
      failReason: null
  }
  
];

function getRealTimeforOrder() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`
}

module.exports = orders;