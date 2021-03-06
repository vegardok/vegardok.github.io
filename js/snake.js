(function main() {
  const SNAKE_SEGMENT_SIZE = 20;
  let DRAW_LOOP_REF;
  let TICK_LENGTH = 250;

  const HEADER_EL = document.getElementsByTagName('header').item(0);
  const SNAKE_CONTAINER_EL = document.createElement('div');
  SNAKE_CONTAINER_EL.setAttribute('id', 'snakeContainer');
  SNAKE_CONTAINER_EL.classList.add('snake-container');
  HEADER_EL.appendChild(SNAKE_CONTAINER_EL);

  function updateSnakeSegment(segmentElement, x, y, head = false) {
    segmentElement.style.top = `${y * SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.left = `${x * SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.height = `${SNAKE_SEGMENT_SIZE}px`;
    segmentElement.style.width = `${SNAKE_SEGMENT_SIZE}px`;
    segmentElement.setAttribute('snake-x', x);
    segmentElement.setAttribute('snake-y', y);

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
      const segmentEl = document.createElement('span');
      segmentEl.classList.add('snake-segment');
      const segment = updateSnakeSegment(
        segmentEl,
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
      .filter((particleEl) => {
        const rect = particleEl.getBoundingClientRect();
        const {
          x, y, width, height,
        } = rect;
        const centerX = x + (height / 2);
        const centerY = y + (width / 2);

        const id = particleEl.getAttribute('id');

        return !particleEl.classList.contains('eaten')
          && headY < centerY && (headY + SNAKE_SEGMENT_SIZE) > centerY
          && headX < centerX && (headX + SNAKE_SEGMENT_SIZE) > centerX;
      });

    toBeRemoved.forEach((p) => {
      p.classList.add('eaten');
    });
    if (toBeRemoved.length > 0) {
      const scoreEl = document.getElementById('score-container');
      const score = parseInt(scoreEl.innerText, 10);
      scoreEl.innerText = `${score + toBeRemoved.length}`;
    }
    return toBeRemoved.length !== 0;
  }

  function speedup() {
    clearInterval(DRAW_LOOP_REF);
    TICK_LENGTH -= 10;
    DRAW_LOOP_REF = setInterval(draw, TICK_LENGTH);
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
      SNAKE_CONTAINER_EL.prepend(tailSegment);
      speedup();
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
    return headX < 0 || headY < 0 || headY > height || headX > width;
  }

  function selfCrash() {
    const tail = snake.body.slice(0, snake.body.length - 1);
    const head = snake.body[snake.body.length - 1];
    const headX = parseInt(head.getAttribute('snake-x'), 10);
    const headY = parseInt(head.getAttribute('snake-y'), 10);
    return !!tail.find((segment) => {
      const segmentX = parseInt(segment.getAttribute('snake-x'), 10);
      const segmentY = parseInt(segment.getAttribute('snake-y'), 10);
      return headX === segmentX && headY === segmentY;
    });
  }

  function draw() {
    const crash = wallCrash() || selfCrash();
    if (!crash) {
      moveSnake();
    }
    if (crash) {
      snake.direction = undefined;
      clearInterval(DRAW_LOOP_REF);
      const scoreContainer = document.getElementById('score-container');
      const gameOver = document.createElement('p');
      gameOver.innerText = 'Game over';
      gameOver.classList.add('game-over');
      scoreContainer.append(gameOver);
    }
  }

  /* Prepare page for a game session
   */
  function gameSetup() {
    document
      .getElementsByTagName('html')
      .item(0)
      .scrollTop = 0;
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

    const scoreFont = document.createElement('link');
    scoreFont.setAttribute('href', 'https://fonts.googleapis.com/css?family=Press+Start+2P&display=swap');
    scoreFont.setAttribute('rel', 'stylesheet');
    document
      .getElementsByTagName('head')
      .item(0)
      .append(scoreFont);

    const scoreContainer = document.createElement('div')
    scoreContainer.setAttribute('id', 'score-container');
    scoreContainer.classList.add('score-container');

    scoreContainer.innerText = '0';

    HEADER_EL.append(scoreContainer);
  }

  document.addEventListener('keyup', ({ key }) => {
    key = key.toLowerCase();

    const arrowMapping = {
      arrowup: 'w',
      arrowdown: 's',
      arrowleft: 'a',
      arrowright: 'd'
    }

    key = arrowMapping[key] || key;

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
  DRAW_LOOP_REF = setInterval(draw, TICK_LENGTH);
}());
