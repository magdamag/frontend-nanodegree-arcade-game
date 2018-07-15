// Classes
// Common class for objects in game (player and enemies)
class Entity {
  constructor () {
    this.row = 101;
    this.col = 83;
    this.positionX = null;
    this.positionY = null;
    this.sprite = null;
  }

  // Draw the entity on the screen
  render () {
    ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
  }

  // Set objects position on board
  update(dt) {
    this.isOutOfRangeX = this.positionX > 5 * this.row;
    this.isOutOfRangeY = this.positionY < 0 * this.col;
  }

  // Check for entity collision
  checkCollisions(playerOrEnemy) {
    if (this.positionY === playerOrEnemy.positionY) {
      if (this.positionX >= playerOrEnemy.positionX - 40 && this.positionX <= playerOrEnemy.positionX + 40) {
        return true;
      }  else {
        return false;
      }
    }
  }
}

// Properties and methods of Enemies objects
class Enemy extends Entity {
  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.positionX = this.x * this.row;
    this.positionY = this.y * this.col - 20;
    // The bugs are predefined
    this.sprite = 'images/enemy-bug.png';
    this.speed = getRandomInt(0.2, 8);
  }

  // Draw enemies on board
  render() {
    super.render();
  }

  // Set enemy positions on board based on its board range
  update(dt) {
    super.update();
    if (this.isOutOfRangeX) {
      this.positionX = -1 * this.row;
    } else {
      this.positionX += (this.speed * dt) * this.row;
    }
  }

  // Reset enemies to start positions, choose different speed every time
  restart() {
    this.positionX = this.x * this.row;
    this.positionY = this.y * this.col - 20;
    this.speed = getRandomInt(0.2, 8);
  }

  // Stop enemies from moving
  stop() {
    this.speed = 0;
  }
}

// Properties and methods of the Player object
class Hero extends Entity {
  constructor() {
    super();
    this.positionX = this.row * 2;
    this.positionY = (this.col * 5) - 20;
    // Changeable, but a sane default
    this.sprite = 'images/char-boy.png';
    this.win = false;
  }

  setSprite(s) {
    this.sprite = s
  }

  // Draw the Player on the screen
  render() {
    super.render();
  }

  // Reset the player to start position
  restart() {
    this.positionX = this.row * 2;
    this.positionY = (this.col * 5) - 20;
    this.render();
  }

  // Handle Player different direction inputs, within set range
  // Listen for key presses and move player in request direction
  // simultaneously checking whether the player has reached the end of the game
  handleInput(input) {
    switch(input) {
      case 'left':
      if (this.positionX > 0) {
        this.positionX -= this.row;
      } else {
        this.positionX;
      }
        break;
      case 'up':
      if (this.positionY > this.col) {
        this.positionY -= this.col;
      } else if (this.positionY == 63) {
        this.win = true;
        bug1.stop();
        bug2.stop();
        bug3.stop();
        modal();
      } else {
        this.positionY;
      }
        break;
      case 'right':
      if (this.positionX < this.row * 4) {
        this.positionX += this.row;
      } else {
        this.positionX;
      }
        break;
      case 'down':
      if (this.positionY < this.col * 4) {
        this.positionY += this.col;
      } else {
        this.positionY;
      }
        break;
      default:
        break;
    }
  }
}

// Courtesy of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

// Init game entities
bug1 = new Enemy(0, 1);
bug2 = new Enemy(0, 2);
bug3 = new Enemy(0, 3);
const allEnemies = [bug1, bug2, bug3];
const player = new Hero();

// Event listener for user key press
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Show congratulations modal when Player wins the game
function modal() {
  let modal = document.getElementById('modal-congrats');
  modal.style.display = 'inline-block';
}

// Event listener to close start-modal when user clicks start game button
document.querySelector('.start-button').addEventListener('click', function() {
    document.getElementById('start-modal').style.display = 'none';
});

// Event listener for user click on character icon and set this as Player image
document.querySelectorAll('.player-options li img').forEach((character) => {
  character.addEventListener('click', () => {
    // Need to remove any previous hilight
    document.querySelectorAll('.player-options li img').forEach((c) => {
      if(c.classList.contains('player-options-active')) {
        c.classList.remove('player-options-active');
      }
    });
    player.setSprite(character.attributes.src.value);
    character.classList.toggle('player-options-active');
  });
});

// Event listener for click on play again button and function to restart the game
document.getElementById('restart').addEventListener('click', function() {
  event.preventDefault();
  document.getElementById('modal-congrats').style.display = 'none';
  document.getElementById('start-modal').style.display = 'inline-block';   // When user clicks play again button, open the start modal
  player.restart();
  bug1.restart(0, 1);
  bug2.restart(0, 2);
  bug3.restart(0, 3);
});

// Event listener for click on cancel button to hide the modal
document.getElementById('cancel').addEventListener('click', function() {
  event.preventDefault();
  document.getElementById('modal-congrats').style.display = 'none';
});
