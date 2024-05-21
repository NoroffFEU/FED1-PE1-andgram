// Function to fetch all blog posts
async function fetchAllPosts() {
    const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram');
    if (!response.ok) {
        throw new Error('Failed to fetch posts');
    }
    const responseData = await response.json();
    
    // Check if the response data contains the 'data' property
    if (!responseData.hasOwnProperty('data') || !Array.isArray(responseData.data)) {
        throw new Error('Invalid data format: expected an array under "data" property');
    }
    
    return responseData.data;
}

// Function to get the latest three blog posts
async function fetchLatestThreePosts() {
    try {
        const allPosts = await fetchAllPosts();

        // Sort posts by date in descending order to get the latest posts first
        allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Get the latest three posts
        const latestThreePosts = allPosts.slice(0, 3);

        return latestThreePosts;
    } catch (error) {
        console.error(error.message);
        return [];
    }
}

// Example usage: Fetch and log the latest three posts
fetchLatestThreePosts().then(posts => console.log(posts));


function populateCards(posts) {
    posts.forEach((post, index) => {
        const card = document.querySelector(`.card${index + 1}`);
        if (card) {
            const innerContainer = card.querySelector('div');
            const titleElement = innerContainer.querySelector('h3');
            const contentElement = innerContainer.querySelector('p');
            const imageContainer = card.querySelector('.image-container');

            // Access the title, body, and media properties directly from the post object
            const title = post.title;
            const body = post.body;
            const imageUrl = post.media.url;
            const postId = post.id;

            // Split body text into an array of sentences
            const sentences = body.split(/[.!?]/);

            // Extract the first sentence
            const firstSentence = sentences[0].trim();

            // Populate title element with the title
            titleElement.textContent = title || 'Title Not Available';
            contentElement.textContent = firstSentence || 'Content Not Available';

            // Set background image URL
            imageContainer.style.backgroundImage = `url('${imageUrl}')`;

            card.addEventListener('click', () => {
                // Navigate to the full blog post
                window.location.href = `/post/index.html?id=${postId}`;
            });
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    fetchLatestThreePosts()
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
