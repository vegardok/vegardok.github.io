(function main() {
  const SNAKE_SEGMENT_SIZE = 20;
  let DRAW_LOOP_REF;

  const HEADER_EL = document.getElementsByTagName('header').item(0);
  const SNAKE_CONTAINER_EL = document.createElement('div');
  SNAKE_CONTAINER_EL.setAttribute('id', 'snakeContainer');
  HEADER_EL.appendChild(SNAKE_CONTAINER_EL);

  function updateSnakeSegment(segmentElement, x, y, head = false) {
    segmentElement.style.position = 'absolute';
    segmentElement.style.top = `${y * SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.left = `${x * SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.height = `${SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.width = `${SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.border = '1px solid #ccc';
    segmentElement.setAttribute('snake-x', x);
    segmentElement.setAttribute('snake-y', y);

    segmentElement.style.background = head ? 'red' : 'white';
    return segmentElement;
  }

  const snake = {
    length: 3,
    direction: 'RIGHT',
    body: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
    ].map(({ x, y }, i, all) => {
      const segment = updateSnakeSegment(
        document.createElement('span'),
        x, y, i === all.length - 1,
      );
      SNAKE_CONTAINER_EL.append(segment);
      return segment;
    }),
  };

  function removeParticles() {
    const head = snake.body[snake.body.length - 1];

    const headX = parseInt(head.getAttribute('snake-x'), 10) * SNAKE_SEGMENT_SIZE;
    const headY = parseInt(head.getAttribute('snake-y'), 10) * SNAKE_SEGMENT_SIZE;
    const toBeRemoved = Array.from(document.getElementsByClassName('particle'))
      .filter((p) => {
        const rect = p.getBoundingClientRect();
        const {
          x, y, width, height,
        } = rect;

        return headY > y && headY < (y + width)
              && headX > x && headX < (x + height);
      });
    toBeRemoved.forEach((p) => {
      p.style.animation = 'none';
      p.style.display = 'none';
    });
    return toBeRemoved.length !== 0;
  }

  function moveSnakeSegment(x, y) {
    const eatParticle = removeParticles();
    const tailSegment = eatParticle ? snake.body[0].cloneNode() : undefined;

    snake.body.forEach((segment, i, all) => {
      const last = i === all.length - 1;
      const currentX = last
        ? parseInt(segment.getAttribute('snake-x'), 10) + x
        : parseInt(all[i + 1].getAttribute('snake-x'), 10);
      const currentY = last
        ? parseInt(segment.getAttribute('snake-y'), 10) + y
        : parseInt(all[i + 1].getAttribute('snake-y'), 10);

      updateSnakeSegment(segment, currentX, currentY, i === all.length - 1);
    });
    if (eatParticle) {
      snake.body = [tailSegment].concat(snake.body);
      SNAKE_CONTAINER_EL.append(tailSegment);
    }
  }

  function moveSnake() {
    const { direction } = snake;

    const MOVE_MAP = {
      LEFT: { x: -1, y: 0 },
      RIGHT: { x: 1, y: 0 },
      UP: { x: 0, y: -1 },
      DOWN: { x: 0, y: 1 },
    };
    if (Object.keys(MOVE_MAP).indexOf(direction) !== -1) {
      const { x, y } = MOVE_MAP[direction];
      moveSnakeSegment(x, y);
    }
  }

  function wallCrash() {
    const { width, height } = HEADER_EL.getBoundingClientRect();
    const head = snake.body[snake.body.length - 1];
    const headX = parseInt(head.getAttribute('snake-x'), 10) * SNAKE_SEGMENT_SIZE;
    const headY = parseInt(head.getAttribute('snake-y'), 10) * SNAKE_SEGMENT_SIZE;
    return headX < 0 || headY < 0 || headY > width || headX > height;
  }

  function draw() {
    const crash = wallCrash();
    if (!crash) {
      moveSnake();
    }
    if (crash) {
      snake.direction = undefined;
      clearInterval(DRAW_LOOP_REF);
    }
  }

  /* Prepare page for a game session
   */
  function gameSetup() {
    document
      .getElementsByTagName('body')
      .item(0)
      .style.overflow = 'hidden';
    [document.getElementsByClassName('name-container'),
      document.getElementsByClassName('down'),
      document.getElementsByTagName('section'),
    ].forEach((nodeList) => {
      for (const el of nodeList) {
        el.addEventListener('animationend', (event) => event.target.classList.add('hidden'));
        el.classList.add('fade-out');
      }
    });
  }

  document.addEventListener('keyup', ({ key }) => {
    key = key.toLowerCase();
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
        break;
      }
      default: {
        break;
      }
    }
  });

  gameSetup();
  draw();
  DRAW_LOOP_REF = setInterval(draw, 250);
}());
