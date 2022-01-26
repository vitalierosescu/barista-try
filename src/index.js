import "./style.css";
import data from "./assets/data/coffees.json";

let plantbased = [];
let currentOrders = [];

// 1. start by making the coffee assortiment list
const createCoffee = coffee => {
  const $li = document.createElement(`li`);
  $li.classList.add('price');
  $li.dataset.id = coffee.id;
  $li.addEventListener('click', handleClickLi);
  $li.innerHTML = `
  <a class="price__button">
    <span class="price__button__wrapper">
      <span class="price__button__name">${coffee.name}</span>
      <span class="price__button__amount">&euro; ${coffee.prices.medium}</span>
    </span>
    <span class="price__button__plus">m</span>
  </a>
  `;
  document.querySelector('.prices__list').appendChild($li)
}

// 2. show the coffee list
const showCoffeeAssortiment = coffees => {
  coffees.map(createCoffee);
}

// 3. show only the plantbased coffees
const loadCoffees = () => {
  plantbased = data.coffees.filter(coffee => coffee.plantbased === true);
  showCoffeeAssortiment(plantbased);
}

// 4. eventListener on coffee to add to order array
const handleClickLi = e => {
  const clickedCoffee = data.coffees.find(coffee => coffee.id === parseInt(e.currentTarget.dataset.id));
  addToOrder(clickedCoffee);
}

// 5. add to order function
const addToOrder = (coffee) => {
  const existingOrder = findOrderInCurrentOrder(coffee.id);

  if (existingOrder) {
    existingOrder.amount ++;
  } else {
    currentOrders.push({
      amount: 1,
      coffee: coffee
    })
  }

  calculateTotal();
  showOrders(currentOrders)
}

// find order in currentOrders helper function
const findOrderInCurrentOrder = id => {
  return currentOrders.find(order => order.coffee.id === id);
}

// 6. show the currentOrders
const createOrder = order => {
  const $li = document.createElement('li');
  $li.classList.add('order');
  $li.dataset.id = order.coffee.id;
  $li.innerHTML = `
                <span class="order__name">
                  <span class="order__amount">${order.amount}x</span> ${order.coffee.name}
                </span>
                <span class="order__price">&euro; ${order.amount * order.coffee.prices.medium}</span>
                <button class="order__remove">
                  x
                </button>
  `;
  $li.querySelector('.order__remove').addEventListener('click', handleClickRemove);
  return $li;
}

const showOrders = orders => {
  const $emptyState = document.querySelector('.emptystate');
  const $ordersWrapper = document.querySelector('.orders__wrapper');
  const $orders = document.querySelector('.orders');

  if (orders.length > 0) {
    $emptyState.classList.add('hide');
    $ordersWrapper.classList.remove('hide');

    $orders.innerHTML = ``;
    orders.forEach(order => {
      const $li = createOrder(order);
      $orders.appendChild($li)
    });
  } else {
    $emptyState.classList.remove('hide');
    $ordersWrapper.classList.add('hide');
  }
}

// 7. remove button
const handleClickRemove = e => {
  const coffeeId = parseInt(e.currentTarget.parentElement.dataset.id);

  currentOrders = currentOrders.filter(order => {
    return coffeeId !== order.coffee.id;
  })

  showOrders(currentOrders);
}

// 8. total price

const calculateTotal = () => {
  if (currentOrders.length > 0) {
    const total = currentOrders.reduce((total, order) => {
      return total + order.amount * order.coffee.prices.medium;
    }, 0);
    document.querySelector('.total__price span').textContent = total;
  } else {
    document.querySelector('.total__price span').textContent = "0";
  }
}

const init = () => {
  loadCoffees();
}

init();
