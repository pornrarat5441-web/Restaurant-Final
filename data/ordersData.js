const waiters = require('./waitersData');
//waiters name
const availableWaiter = waiters.find(w => w.status === "available");

const orders = [
  {
  //   id: "A03",
  //   table: 1,
  //   time: getRealTimeforOrder(),
  //   status: "prepare",
  //   menus: [
  //     {
  //       name: "Strawberry Milkshake",
  //       qty: 1
  //     },
  //     {
  //       name: "Pizza Magarita (S)",
  //       qty: 2
  //     }
  //   ],
  //   waiterName: availableWaiter.name,
  //   servingStatus: "inprocess",
  //   servingTime: "20:00",
  //   deviceId: availableWaiter.deviceId
  // }
      id: "A03",
      table: 1,
      time: getRealTimeforOrder(),
      status: "prepare",
      menus: [
        {
          name: "Strawberry Milkshake",
          qty: 1
        },
        {
          name: "Pizza Magarita (S)",
          qty: 2
        }
      ],
      waiterName: null,
      servingStatus: "inprocess",
      servingTime: null, //serve at the time we click to choose the server
      deviceId: null
  }
  
];

function getRealTimeforOrder() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`
}

module.exports = orders;