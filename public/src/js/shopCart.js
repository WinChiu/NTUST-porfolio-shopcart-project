var overLappingSpace = 150;
if ($(document).width() <= 1200) {
  overLappingSpace = 100;
}
if ($(document).width() <= 992) {
  overLappingSpace = 50;
}
console.log(overLappingSpace);
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
});

$('.draggable').mouseover(function (e) {
  $('.commodityTag').css('display', 'flex');
  $('.commodityTag__rightWordBlock--content').text(
    e.target.dataset.description
  );
  $('.commodityTag__rightWordBlock--title').text(e.target.dataset.title);
  $('.commodityTag__leftNum--num').text(`(${e.target.dataset.num})`);
});

$('.draggable').mouseout(function (e) {
  $('.commodityTag').css('display', 'none');
});

$('.introScreen').click(function (e) {
  $('.introScreen').css('display', 'none');
});

document.addEventListener('mousemove', function (e) {
  // let body = document.querySelector('body');
  let tag = document.getElementsByClassName('commodityTag');
  let left = e.offsetX;
  let top = e.offsetY;
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

  let safeWidth = windowWidth - overLappingSpace - 50;
  let safeHeight = windowHeight - overLappingSpace - 40;
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
  }
}

window.onload = function () {
  randomizeCommodity();
};
