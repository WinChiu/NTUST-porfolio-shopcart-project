var overLappingSpace = 150;
if ($(document).width() <= 1500) {
  overLappingSpace = $(document).width() / 10;
}
if ($(document).height() <= 600) {
  if (overLappingSpace > 60) overLappingSpace = $(document).height() / 10;
}

let nowDraggingItemPosX = 0;
let nowDraggingItemPosY = 0;
let totalPrice = 0;
let beepSound = new Audio('../../asset/audio/shopCart_beep.mp3');

document.addEventListener('mousemove', function (e) {
  // let body = document.querySelector('body');
  let tag = document.getElementsByClassName('commodityTag');
  tag[0].style.left = e.pageX + 5 + 'px';
  tag[0].style.top = e.pageY + 5 + 'px';
});

function Position(x, y) {
  this.x = x;
  this.y = y;
}
function isOverlapCart(newPX, newPY) {
  let isLappingCart =
    newPX > $('.shopCart__cart').position().left - 150 &&
    newPX <
      $('.shopCart__cart').position().left + $('.shopCart__cart').width() &&
    newPY > $('.shopCart__cart').position().top - 150 &&
    newPY < $('.shopCart__cart').position().top + $('.shopCart__cart').height();

  return isLappingCart;
}
function inShopCart(posX, posY) {
  return (
    posX > $('.shopCart__cart').position().left &&
    posX <
      $('.shopCart__cart').position().left + $('.shopCart__cart').width() &&
    posY > $('.shopCart__cart').position().top &&
    posY < $('.shopCart__cart').position().top + $('.shopCart__cart').height()
  );
}
function isOverlap(currentPositions, newPX, newPY) {
  if (currentPositions.length === 0) return isOverlapCart(newPX, newPY);

  for (let i = 0; i < currentPositions.length; i++) {
    let isOverlap =
      Math.abs(currentPositions[i].x - newPX) < overLappingSpace &&
      Math.abs(currentPositions[i].y - newPY) < overLappingSpace;

    if (isOverlap) return true;
    if (isOverlapCart(newPX, newPY)) return true;
  }

  return false;
}
function generatePositionsArray() {
  let windowWidth = $(document).width();
  let windowHeight = $(document).height();

  // let safeWidth = windowWidth - overLappingSpace - 50;
  // let safeHeight = windowHeight - overLappingSpace - 40;
  let safeWidth = windowWidth - 150 - 50;
  let safeHeight = windowHeight - 150 - 40;
  let positionArray = [];
  let newX = 0;
  let newY = 0;

  for (let i = 0; i < 17; i++) {
    while (true) {
      newX = Math.floor(Math.random() * safeWidth);
      newY = Math.floor(Math.random() * safeHeight) + 40;
      //console.log(newX, newY);
      if (!isOverlap(positionArray, newX, newY)) {
        break;
      }
    }
    positionArray.push(new Position(newX, newY));
  }

  return positionArray;
}
function randomizeCommodity() {
  let imgPositions = generatePositionsArray();

  for (let i = 0; i < 17; i++) {
    $('.commodity')[i].style.left = `${imgPositions[i].x}px`;
    $('.commodity')[i].style.top = `${imgPositions[i].y}px`;
    $('.commodity')[i].style.display = 'block';
  }
}

$('.marquee-shop').marquee({
  duration: 9000,
  gap: 2,
  delayBeforeStart: 0,
  direction: 'left',
  duplicated: true,
  startVisible: true,
});
$('.draggable').draggable({
  stack: '.commodity',
  containment: 'body',
  scroll: false,
  drag: function (e) {
    nowDraggingItemPosX = parseFloat(e.target.style.left) + e.target.width / 2;
    nowDraggingItemPosY = parseFloat(e.target.style.top) + e.target.height / 2;

    if (inShopCart(nowDraggingItemPosX, nowDraggingItemPosY))
      $('.shopCart__cart').css('opacity', 0.6);
    if (!inShopCart(nowDraggingItemPosX, nowDraggingItemPosY))
      $('.shopCart__cart').css('opacity', 1);
  },
  stop: function (e) {
    $('.shopCart__cart').css('opacity', 1);
    if (
      inShopCart(nowDraggingItemPosX, nowDraggingItemPosY) &&
      e.target.dataset.status === 'out'
    ) {
      beepSound.play();
      totalPrice += parseInt(e.target.dataset.price);
      e.target.dataset.status = 'in';
    }

    if (
      !inShopCart(nowDraggingItemPosX, nowDraggingItemPosY) &&
      e.target.dataset.status === 'in'
    ) {
      totalPrice -= parseInt(e.target.dataset.price);
      e.target.dataset.status = 'out';
    }
    console.log(totalPrice);
  },
});
$('.draggable').mouseover(function (e) {
  //e.target.style.opacity = 0.6;
  $('.commodityTag').css('display', 'flex');
  $('.commodityTag__rightWordBlock--content').text(
    e.target.dataset.description
  );
  $('.commodityTag__rightWordBlock--title').text(e.target.dataset.title);
  $('.commodityTag__leftNum--num').text(`(${e.target.dataset.num})`);
});
$('.draggable').mouseout(function (e) {
  // e.target.style.opacity = 1;
  $('.commodityTag').css('display', 'none');
});
$('.introScreen').click(function (e) {
  $('.introScreen').fadeOut();
  setTimeout(() => {
    $('.introScreen').css('display', 'none');
  }, 1000);
});

$('.cashRegister').click(function (e) {
  $('.checkoutScreen').css('display', 'flex').hide().fadeIn();
  setTimeout(() => {
    $('.checking').css('display', 'none');
    $('.totalPrice').text(totalPrice);
    $('.priceWord').css('display', 'block');
    $('.totalPrice').each(function () {
      $(this)
        .prop('Counter', 0)
        .animate(
          {
            Counter: $(this).text(),
          },
          {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
              $(this).text(Math.ceil(now));
            },
          }
        );
    });
  }, 2000);
});
$('.cashRegister').mouseover(function (e) {
  e.target.style.opacity = 0.6;
});
$('.cashRegister').mouseout(function (e) {
  e.target.style.opacity = 1;
});

window.onload = function () {
  console.log(`Setting commodities' position`);
  randomizeCommodity();
  console.log('Commodities settled');
  setTimeout(() => {
    $('#shopCartBody').fadeTo(1000, 1);
  }, 1000);
};
