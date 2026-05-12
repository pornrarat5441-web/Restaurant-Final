const waiters = require('./waitersData');
//waiters name
const availableWaiter = waiters.find(w => w.status === "available");

const orders = [
  {
      id: "A20",
      table: 1,
      time: getRealTimeforOrder(),
      status: "prepare",
      menus: [
        {
          name: "Milk Tea",
          qty: 2
        },
        {
          name: "Chocolate Pancake with Ice Cream",
          qty: 1
        }
      ],
      waiterName: null,
      servingStatus: null, //receive data from pi if the waiter click check mark for serving the order **
      servingTime: null, //serve at the time we click to choose the server
      deviceId: null
  },
    {
      id: "A21",
      table: 2,
      time: getRealTimeforOrder(),
      status: "prepare",
      menus: [
        {
          name: "Caramel Macchiato",
          qty: 2
        },
        {
          name: "pizza with cheese",
          qty: 1
        }
      ],
      waiterName: null,
      servingStatus: null, //receive data from pi if the waiter click check mark for serving the order **
      servingTime: null, //serve at the time we click to choose the server
      deviceId: null
  },
    {
      id: "A22",
      table: 3,
      time: getRealTimeforOrder(),
      status: "prepare",
      menus: [
        {
          name: "Orange Juice with Ice",
          qty: 2
        },
        {
          name: "Dirty Chocolate Donut (XXL)",
          qty: 1
        }
      ],
      waiterName: null,
      servingStatus: null, //receive data from pi if the waiter click check mark for serving the order **
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