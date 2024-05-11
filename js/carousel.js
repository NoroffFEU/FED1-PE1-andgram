

// Function to fetch a single blog post by ID
async function fetchPostById(id) {
    const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch post with ID ${id}`);
    }
    const postData = await response.json();
    return postData;
}

// Function to fetch three specific blog posts by their IDs
async function fetchThreePostsByIds() {
    const postIds = [
        '1b018f2f-b3de-412e-8f08-00414d3060a8', 
        '86ee5464-59c2-41a8-9f39-97f75ed33f9b', 
        'a570fc35-f027-4164-8359-f08f879d6580'];
    const posts = [];

    for (const id of postIds) {
        try {
            const postData = await fetchPostById(id);
            posts.push(postData);
        } catch (error) {
            console.error(error.message);
        }
    }

    return posts;
}

function populateCards(posts) {
    posts.forEach((post, index) => {
        console.log('Post object:', post); // Log the post object for debugging
        const card = document.querySelector(`.card${index + 1}`);
        if (card) {
            const innerContainer = card.querySelector('div');
            const titleElement = innerContainer.querySelector('h3');
            const contentElement = innerContainer.querySelector('p');
            const buttonElement = innerContainer.querySelector('button');
            const imageContainer = card.querySelector('.image-container');

            // Access the title property from the data object
            const title = post.data.title;
            const body = post.data.body;
            const imageUrl = post.data.media.url;

            // Split body text into an array of sentences
            const sentences = body.split(/[.!?]/);

            // Extract the first sentence
            const firstSentence = sentences[0].trim();

            // Populate title element with the title
            titleElement.textContent = title || 'Title Not Available';
            contentElement.textContent = firstSentence || 'Content Not Available';

            // Set background image URL
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;


            buttonElement.addEventListener('click', () => {
                // Add code to navigate to the full blog post page
                console.log(`Clicked on Read more for post with ID ${post.id}`);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetchThreePostsByIds()
        .then(posts => {
            populateCards(posts);
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
        });
});

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
    deleteInterval = setInterval(timer, 4000);
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
