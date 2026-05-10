const waiters = require('./waitersData');
//waiters name
const availableWaiter = waiters.find(w => w.status === "available");

const orders = [
  {
    id: "ORD002",
    table: 3,
    time: "19:30",
    status: "prepare",
    menus: [
      {
        name: "Pizza",
        qty: 2
      },
      {
        name: "Cola",
        qty: 1
      }
    ],
    waiterName: availableWaiter.name,
    servingStatus: "inprocess",
    servingTime: "20:00",
    deviceId: availableWaiter.deviceId
  },
  {
    id: "ORD004",
    table: 3,
    time: "19:30",
    status: "prepare",
    menus: [
      {
        name: "Ramen",
        qty: 2
      },
      {
        name: "Magarita",
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