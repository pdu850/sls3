const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const title = document.getElementById('title');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameOverFlag = false;
let gameSpeed = 2; // Initial game speed
let lastSpawnTime = 0;
let spawnRate = 2000; // Initial spawn rate in milliseconds (1 second)

// Load images
const samImage = new Image();
samImage.src = 'Sam.png';

const obstacleImages = [
    new Image(),
    new Image(),
    new Image()
];
obstacleImages[0].src = 'Sam1.png';
obstacleImages[1].src = 'Sam2.png';
obstacleImages[2].src = 'Sam3.png';

// Sam (Player)
const sam = {
    x: canvas.width / 2,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 6
};

// Obstacles
const obstacles = [];

// Initialize game
function init() {
    score = 0;
    gameOverFlag = false;
    gameSpeed = 1;
    lastSpawnTime = 0;
    spawnRate = 400;
    obstacles.length = 0; // Clear obstacles

    // Center Sam initially
    sam.x = canvas.width / 2 - sam.width / 2;

    // Start game loop
    requestAnimationFrame(update);
}

// Update game state
function update(timestamp) {
    if (gameOverFlag) {
        return; // Stop the game loop
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Sam
    ctx.drawImage(samImage, sam.x, sam.y, sam.width, sam.height);

    // Move Sam
    if (leftPressed) {
        sam.x -= sam.speed;
    }
    if (rightPressed) {
        sam.x += sam.speed;
    }

    // Keep Sam within canvas bounds
    if (sam.x < 0) {
        sam.x = 0;
    } else if (sam.x + sam.width > canvas.width) {
        sam.x = canvas.width - sam.width;
    }

    // Spawn obstacles
    if (timestamp - lastSpawnTime > spawnRate) {
        spawnObstacle();
        lastSpawnTime = timestamp;

        // Gradually increase difficulty
        spawnRate = Math.max(200, spawnRate - 7); // Limit spawn rate
        gameSpeed += 0.03;
    }

    // Update and draw obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += obstacles[i].speed * gameSpeed;

        // Draw obstacle
        ctx.drawImage(obstacleImages[obstacles[i].type], obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);

        // Check for collision with Sam
        if (collision(sam, obstacles[i])) {
            gameOver();
            return; // Stop the game loop
        }

        // Remove obstacles that go off screen
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
        }
    }

    // Update score
    score += 10 * (gameSpeed / 10); // Adjust scoring based on game speed
    scoreDisplay.textContent = `Score: ${Math.floor(score)}`;

    // Request next frame
    requestAnimationFrame(update);
}

// Spawn a new obstacle
function spawnObstacle() {
    const obstacleTypes = obstacleImages.length;
    const randomType = Math.floor(Math.random() * obstacleTypes);
    const obstacleWidth = 60;
    const obstacleHeight = 60;
    const x = Math.random() * (canvas.width - obstacleWidth);
    const y = -obstacleHeight; // Start off screen
    const speed = Math.random() * 3 + 1; // Varying speeds

    obstacles.push({
        x,
        y,
        width: obstacleWidth,
        height: obstacleHeight,
        type: randomType,
        speed
    });
}

// Check for collision between two objects
function collision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

// Game over
function gameOver() {
    gameOverFlag = true;
    alert('Game Over!');
    init(); // Restart the game
}

// Touch controls
let leftPressed = false;
let rightPressed = false;

document.addEventListener('touchstart', (e) => {
    if (e.touches[0].clientX < canvas.width / 2) {
        leftPressed = true;
    } else {
        rightPressed = true;
    }
}, false);

document.addEventListener('touchend', () => {
    leftPressed = false;
    rightPressed = false;
}, false);

// Start the game
init();