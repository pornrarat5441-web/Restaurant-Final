const waiters = require('./waitersData');
//waiters name
const availableWaiter = waiters.find(w => w.status === "available");

const orders = [
  {
    id: "ORD09",
    table: 9,
    time: new Date().toLocaleTimeString(),
    status: "prepare",
    menus: [
      {
        name: "Carbonara Pasta",
        qty: 1
      },
      {
        name: "Watermelon Smoothie",
        qty: 2
      },
      {
        name: "Fired Rice with Salmon",
        qty: 1
      }
    ],
    waiterName: availableWaiter.name,
    servingStatus: "inprocess",
    servingTime: "20:00",
    deviceId: availableWaiter.deviceId
  }
  
];

module.exports = orders;