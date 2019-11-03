(function () {
  const header = document.getElementsByTagName('header')[0];
  const snakeContainer = document.createElement('div');
  snakeContainer.setAttribute('id', 'snakeContainer');
  header.appendChild(snakeContainer);

  const snakeSegmentSize = 10;
  let snakeSpeed = 1;

  let snake = {
    length: 3,
    body: [{x: 0, y: 0}, {x: 0, y: 1}, {x: 0, y: 2}],
    direction: 'RIGHT'
  }

  document.addEventListener('keyup', ({ key }) => {
    key = key.toLowerCase()
    switch (key) {
      case 'd': {
        if (snake.direction === 'UP' || snake.direction === 'DOWN') {
          snake.direction = 'RIGHT';
          draw();
        }
        return;
      }
      case 'a': {
        if (snake.direction === 'UP' || snake.direction === 'DOWN') {
          snake.direction = 'LEFT';
          draw();
        }
        return;
      }
      case 'w': {
        if (snake.direction === 'LEFT' || snake.direction === 'RIGHT') {
          snake.direction = 'UP';
          draw();
        }
        return;
      }
      case 's': {
        if (snake.direction === 'LEFT' || snake.direction === 'RIGHT') {
          snake.direction = 'DOWN';
          draw();
        }
        return;
      }
      default: {
        return
      }
    }
  })

  function moveSnake () {
    const { direction, body } = snake;
    const head = body[body.length-1];
    const eatParticle = removeParticles();
    function move (x, y) {
      if (!eatParticle) {
        snake.body = snake.body.slice(1);
      }
      snake.body.push({ x, y });
    }


    switch (direction) {
      case 'LEFT': {
        move(head.x, head.y - 1);
        return
      }
      case 'RIGHT': {
        move(head.x, head.y + 1);
        return
      }
      case 'UP': {
        move(head.x - 1, head.y);
        return
      }
      case 'DOWN': {
        move(head.x + 1, head.y);
        return
      }

      default: {
        return
      }
    };
  }

  function drawSnake () {
    const container = document.getElementById('snakeContainer');
    Array.from(container.children).forEach(e => container.removeChild(e));
    snake.body.forEach((segment, i) => {
      const segmentElement = document.createElement('span');
      segmentElement.style.position = 'absolute';
      segmentElement.style.top = `${segment.x * snakeSegmentSize}px`;
      segmentElement.style.left = `${segment.y * snakeSegmentSize}px`;
      segmentElement.style.height = `${snakeSegmentSize}px`;
      segmentElement.style.width = `${snakeSegmentSize}px`;
      segmentElement.style.border = '1px solid #ccc';

      segmentElement.style.background = i === snake.body.length - 1 ? 'red' : 'white';
      container.append(segmentElement);
    })
  }

  function wallCrash () {
    const headerEl = document.getElementsByTagName('header').item(0)
    const { width, height } = headerEl.getBoundingClientRect();
    const head = snake.body[snake.body.length-1];
    const headX = head.x * snakeSegmentSize
    const headY = head.y * snakeSegmentSize
    return headX < 0 || headY < 0 || headY > width || headX > height;
  }

  function removeParticles () {
    const head = snake.body[snake.body.length-1];
    // TODO: head is a square, not a point
    const headX = head.x * snakeSegmentSize
    const headY = head.y * snakeSegmentSize
    const toBeRemoved = Array.from(document.getElementsByClassName('particle'))
          .filter(p => {
            const rect = p.getBoundingClientRect()
            const { x, y, width, height } = rect;

            return headX > x && headX < (x + width) &&
              headY > y && headY < (y + height);
          })
    toBeRemoved.forEach(p => {
      console.log(p.getAttribute('id'))
      p.style.animation = 'none';
      p.style.display = 'none';
    });
    return toBeRemoved.length !== 0;
  }

  function draw() {
    const crash = wallCrash();
    drawSnake();
    if (!crash) {
      moveSnake();
    }
    if (crash) {
      snake.direction = undefined;
      clearInterval(drawLoop);
    }
  }

  }

  draw();
  const drawLoop = setInterval(draw, 250);
})();
