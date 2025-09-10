const userScore = document.getElementById("user-score")

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', async function() {
        const score = this.getAttribute('data-value');
        const gameId = document.getElementById('star-rating').getAttribute('data-game-id');

        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({
                    game_id: gameId,
                    score: parseInt(score)
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                document.getElementById('rating-message').textContent = 'Rating guardado!';
                // Actualizar visualmente las estrellas
                updateStars(score);
                userScore.textContent = score;
            } else {
                document.getElementById('rating-message').textContent = data.error;
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});

function updateStars(rating) {
    document.querySelectorAll('.star').forEach((star, index) => {
        star.style.opacity = index < rating ? '1' : '0.3';
    });
}