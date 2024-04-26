// access the card
let slideCards = document.querySelectorAll('.card');
// access next and prev buttons
let next = document.querySelector('.next');
let prev = document.querySelector('.prev');

// access the indicators
let dots = document.querySelectorAll('.dot');

let counter = 0;

// code for next button
next.addEventListener('click', slideNext);
function slideNext(){
    slideCards[counter].style.animation = 'next1 0.5s ease forwards';
    if(counter >= slideCards.length-1) {
        counter = 0;
    } else {
        counter++;
    }
    slideCards[counter].style.animation = 'next2 0.5s ease forwards';
    indicators();
}

// code for prev button
prev.addEventListener('click', slidePrev);
function slidePrev(){
    slideCards[counter].style.animation = 'prev1 0.5s ease forwards';
    if(counter == 0) {
        counter = slideCards.length-1;
    } else {
        counter--;
    }
    slideCards[counter].style.animation = 'prev2 0.5s ease forwards';
    indicators()
}

// Auto sliding
function autoSliding() {
    deleteInterval = setInterval(timer, 5000);
    function timer() {
        slideNext();
        indicators();
    }
}
autoSliding();

// stop autosliding when mouse is over
const container = document.querySelector('.slide-container');
container.addEventListener('mouseover', function() {
    clearInterval(deleteInterval);
})

// resume autosliding when mouse is out
container.addEventListener('mouseout', autoSliding);


// add and remove active class from the indicator
function indicators () {
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(' active', ''); 
    }
    dots[counter].className +=  ' active';
}
