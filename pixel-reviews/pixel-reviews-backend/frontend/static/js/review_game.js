const userScore = document.getElementById("user-score")
const reviewTitle = document.getElementById("review_title")
const reviewContent = document.getElementById("review_content")
const submitButton = document.getElementById("submit_button")

let score = 0

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', async function() {
        const starValue = this.getAttribute('data-value');
        score = starValue
        console.log(score)

        updateStars(score)
    });
});

submitButton.addEventListener("click", async (e) => {
    
    e.preventDefault()

    const gameId = document.getElementById('star-rating').getAttribute('data-game-id');
    console.log(score)
    try {
        const response1 = await fetch('/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include",
            body: JSON.stringify({
                "game_id": gameId,
                "score": parseInt(score)
            })
        });

        const response2 = await fetch("/api/reviews", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                "game_id": gameId,
                "review_title": reviewTitle.value,
                "review_content": reviewContent.value
            })
        })

        if (response1.ok && response2.ok) {
            window.location = response2.url
        } else {
            const data = await response2.json();
            document.getElementById('rating-message').textContent = data.error;
        }
    } catch (error) {
        console.log('Error:', error);
    }
})

function updateStars(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
        star.style.opacity = index < rating ? '1' : '0.3';
    });
}