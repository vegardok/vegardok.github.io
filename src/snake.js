function main () {
  console.log('Start game');
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
          moveSnake();
          drawSnake();
        }
        return;
      }
      case 'a': {
        if (snake.direction === 'UP' || snake.direction === 'DOWN') {
          snake.direction = 'LEFT';
          moveSnake();
          drawSnake();
        }
        return;
      }
      case 'w': {
        if (snake.direction === 'LEFT' || snake.direction === 'RIGHT') {
          snake.direction = 'UP';
          moveSnake();
          drawSnake();
        }
        return;
      }
      case 's': {
        if (snake.direction === 'LEFT' || snake.direction === 'RIGHT') {
          snake.direction = 'DOWN';
          moveSnake();
          drawSnake();
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
    if (!eatParticle) {
      snake.body = snake.body.slice(1);
    } else {
      console.log('hit');
    }

    switch (direction) {
      case 'LEFT': {
        snake.body.push({ x: head.x, y: head.y - 1 });
        return
      }
      case 'RIGHT': {
        snake.body.push({ x: head.x, y: head.y + 1 });
        return
      }
      case 'UP': {
        snake.body.push({ x: head.x - 1, y: head.y });
        return
      }
      case 'DOWN': {
        snake.body.push({ x: head.x + 1, y: head.y });
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
    drawSnake();
    moveSnake();
  }

  draw();
  setInterval(draw, 250);
}

main();
