document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas element ('gameCanvas') not found in the document. Please ensure it is correctly defined.");
        return;
    }
    const ctx = canvas.getContext('2d');
    const scale = 20;
    const rows = canvas.height / scale;
    const columns = canvas.width / scale;
    let snake = [];
    let gameSpeed = 120; // Slowing down the game speed to 120 milliseconds
    let mouse = null;
    const mouseColor = 'red';
    const mouseScale = scale; // Using the same scale as the snake for the mouse
    let mouseSpawnInterval = 20; // INPUT_REQUIRED {set appropriate mouse spawn interval in milliseconds}
    let mouseSpawnTimer; // Timer for spawning mice

    (function setup() {
        snake[0] = {
            x: Math.floor(rows / 2) * scale,
            y: Math.floor(columns / 2) * scale
        };
        window.direction = 'right';
        window.addEventListener('keydown', changeDirection);
        setTimeout(createMouse, mouseSpawnInterval); // Delay the first mouse appearance
        mouseSpawnTimer = setInterval(createMouse, mouseSpawnInterval); // Continuously spawn mice at a predefined interval
        draw();
    })();

    function createMouse() {
        // Check if game is over before spawning a new mouse
        // Manual intervention
       /* if (document.getElementById('gameOverMessage').style.display === 'block') {
            clearInterval(mouseSpawnTimer);
            return;
        }*/

        let mousePosition;
        let isOnSnake;
        do {
            isOnSnake = false;
            mousePosition = {
                x: Math.floor(Math.random() * columns) * scale,
                y: Math.floor(Math.random() * rows) * scale
            };

            snake.forEach(segment => {
                if (segment.x === mousePosition.x && segment.y === mousePosition.y) {
                    isOnSnake = true;
                }
            });
        } while (isOnSnake);

        mouse = mousePosition;
    }

    function drawMouse() {
        if (mouse) {
            ctx.fillStyle = mouseColor;
            ctx.fillRect(mouse.x, mouse.y, mouseScale, mouseScale);
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i == 0) ? 'green' : 'white';
            ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
        }
        drawMouse();
        update();
        setTimeout(draw, gameSpeed);
    }

    function update() {
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (window.direction == 'right') snakeX += scale;
        if (window.direction == 'left') snakeX -= scale;
        if (window.direction == 'up') snakeY -= scale;
        if (window.direction == 'down') snakeY += scale;

        let newHead = {
            x: snakeX,
            y: snakeY
        };

        if (mouse && snakeX === mouse.x && snakeY === mouse.y) {
            mouse = null; // The mouse is eaten
            // Here you might want to increase the length of the snake or the score
        } else {
            snake.pop();
        }

        snake.unshift(newHead);

        // Check collision
        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            console.log('Game Over detected. Snake collided with the boundary.');
            // Display game over message in UI
            // Manual intervention
            //document.getElementById('gameOverMessage').style.display = 'block'; 
           // document.getElementById('restartGame').style.display = 'inline-block';
            clearInterval(mouseSpawnTimer); // Stop spawning mice on game over
            return;
        }
    }

    function changeDirection(event) {
        const keyPressed = event.keyCode;
        const goingUp = window.direction == 'up';
        const goingDown = window.direction == 'down';
        const goingRight = window.direction == 'right';
        const goingLeft = window.direction == 'left';

        if (keyPressed == 37 && !goingRight) {
            window.direction = 'left';
        } else if (keyPressed == 38 && !goingDown) {
            window.direction = 'up';
        } else if (keyPressed == 39 && !goingLeft) {
            window.direction = 'right';
        } else if (keyPressed == 40 && !goingUp) {
            window.direction = 'down';
        }
    }

    function collision(head, array) {
        for (let i = 0; i < array.length; i++) {
            if (head.x == array[i].x && head.y == array[i].y) {
                return true;
            }
        }
        return false;
    }

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width; // Relationship bitmap vs. element for X
        const scaleY = canvas.height / rect.height; // Relationship bitmap vs. element for Y

        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;

        // Check if the click is within the bounds of the mouse
        if (mouse && canvasX >= mouse.x && canvasX <= mouse.x + mouseScale && canvasY >= mouse.y && canvasY <= mouse.y + mouseScale) {
            mouse = null; // The mouse is eaten
            // Here you can increase the length of the snake or the score
        }
    });

    document.getElementById('restartGame').addEventListener('click', () => {
        document.getElementById('gameOverMessage').style.display = 'none';
        document.getElementById('restartGame').style.display = 'none';
        snake = [{
            x: Math.floor(rows / 2) * scale,
            y: Math.floor(columns / 2) * scale
        }];
        window.direction = 'right';
        // Removed immediate call to createMouse to prevent unintended mouse spawn
        if (mouseSpawnTimer) clearInterval(mouseSpawnTimer); // Clear any existing timer
        mouseSpawnTimer = setInterval(createMouse, mouseSpawnInterval); // Start spawning mice again with interval
        draw();
    });
});