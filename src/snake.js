(function () {
  const HEADER_EL = document.getElementsByTagName('header').item(0);
  const SNAKE_CONTAINER_EL = document.createElement('div');
  SNAKE_CONTAINER_EL.setAttribute('id', 'snakeContainer');
  HEADER_EL.appendChild(SNAKE_CONTAINER_EL);

  const snakeSegmentSize = 10;
  let snakeSpeed = 1;

  let snake = {
    length: 3,
    direction: 'RIGHT',
    body: [
      {x: 0, y: 0},
      {x: 0, y: 1},
      {x: 0, y: 2}
    ].map(({ x, y}, i, all) => {
      const segment = updateSnakeSegment(
        document.createElement('span')
        , x, y, i === all.length - 1);
      SNAKE_CONTAINER_EL.append(segment);
      return segment;
    })
  }

  function updateSnakeSegment(segmentElement, x, y, head = false) {
    segmentElement.style.position = 'absolute';
    segmentElement.style.top = `${x * snakeSegmentSize}px`;
    segmentElement.style.left = `${y * snakeSegmentSize}px`;
    segmentElement.style.height = `${snakeSegmentSize}px`;
    segmentElement.style.width = `${snakeSegmentSize}px`;
    segmentElement.style.border = '1px solid #ccc';
    segmentElement.setAttribute('snake-x', x);
    segmentElement.setAttribute('snake-y', y);

    segmentElement.style.background = head ? 'red' : 'white';
    return segmentElement;
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

  function moveSnakeSegment (x, y) {
    const eatParticle = removeParticles();
    if (eatParticle) {
      // TODO
    }
    snake.body.forEach((segment, i, all) => {
      const last = i === all.length - 1;
      const currentX = last ?
            parseInt(segment.getAttribute('snake-x'), 10) + x :
            parseInt(all[i+1].getAttribute('snake-x'), 10);
      const currentY = last ?
            parseInt(segment.getAttribute('snake-y'), 10) + y :
            parseInt(all[i+1].getAttribute('snake-y'), 10);

      updateSnakeSegment(segment, currentX, currentY, i === all.length - 1);
    })
  }

  function moveSnake () {
    const { direction, body } = snake;
    const head = body[body.length-1];

    const MOVE_MAP = {
      LEFT: { x: 0, y: -1 },
      RIGHT: { x: 0, y: 1 },
      UP: { x: -1, y: 0 },
      DOWN: { x: 1, y: 0 },
    }
    if (Object.keys(MOVE_MAP).indexOf(direction) !== -1) {
      const { x, y } = MOVE_MAP[direction]
      moveSnakeSegment(x, y);
    }
  }

  function wallCrash () {
    const { width, height } = HEADER_EL.getBoundingClientRect();
    const head = snake.body[snake.body.length-1];
    const headX = parseInt(head.getAttribute('snake-x'), 10) * snakeSegmentSize;
    const headY = parseInt(head.getAttribute('snake-y'), 10) * snakeSegmentSize;
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
    if (!crash) {
      moveSnake();
    }
    if (crash) {
      snake.direction = undefined;
      clearInterval(drawLoop);
    }
  }

  /* Prepare page for a game session
   */
  function gameSetup() {
    document
      .getElementsByTagName('body')
      .item(0)
      .style.overflow = 'hidden';
    [ document.getElementsByClassName('name-container'),
      document.getElementsByClassName('down'),
      document.getElementsByTagName('section')
    ].forEach(nodeList => {
      for (let el of nodeList) {
        el.addEventListener('animationend', event =>
                            event.target.classList.add('hidden'));
        el.classList.add('fade-out')
      }
    })
  }

  gameSetup();
  draw();
  const drawLoop = setInterval(draw, 250);
})();
