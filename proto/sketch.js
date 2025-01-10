let benoit, benoit_run_r, benoit_run_l, benoit_jump, benoit_accueil;
let natacha, natacha_run_r, natacha_run_l, natacha_jump, natacha_accueil;
let guillaume, guillaume_run_r, guillaume_run_l, guillaume_jump, guillaume_accueil;
let waste = [];
let covid;
let bg_ingame;
let J1, J2, J3;
let fallingObjects = [];
let redObjects = []; // Éléments rouges qui stun
let player1Score = 0;
let player2Score = 0;
let player3Score = 0;
let gameStarted = false; // Indique si la partie a commencé
let mode = ""; // Mode de jeu: "single", "two", ou "three"
let singlePlayerButton, twoPlayerButton, threePlayerButton; // Boutons du menu principal
let quitButton; // Bouton Quit
let stunTimers = { J1: 0, J2: 0, J3: 0 }; // Chronomètres pour le stun des joueurs
let gameTimer = 30000; // Temps de jeu en millisecondes (30 secondes)
let startTime; // Temps de début de la partie
let gameFrozen = false; // Indique si le jeu est gelé
let gameEnded = false; // Indique si la partie est terminée

function preload() {

    benoit_accueil = loadImage("./asset/benoit-accueil.png");
    benoit = loadImage("./asset/benoit.png");
    benoit_run_r = loadImage("./asset/benoit_run-r.png");
    benoit_run_l = loadImage("./asset/benoit_run-l.png");
    benoit_jump = loadImage("./asset/benoit_jump.png");

    natacha_accueil = loadImage("./asset/natacha-accueil.png");
    natacha = loadImage("./asset/natacha.png");
    natacha_run_r = loadImage("./asset/natacha_run-r.png");
    natacha_run_l = loadImage("./asset/natacha_run-l.png");
    natacha_jump = loadImage("./asset/natacha_jump.png");

    guillaume_accueil = loadImage("./asset/guillaume-accueil.png");
    guillaume = loadImage("./asset/guillaume.png");
    guillaume_run_r = loadImage("./asset/guillaume_run-r.png");
    guillaume_run_l = loadImage("./asset/guillaume_run-l.png");
    guillaume_jump = loadImage("./asset/guillaume_jump.png");

  
  bg_ingame = loadImage("./asset/background_ingame.jpg");
  waste.push(loadImage("./asset/file.png"));
  waste.push(loadImage("./asset/mail.png"));
  waste.push(loadImage("./asset/photo.png"));
  waste.push(loadImage("./asset/youtube.png"));
  waste.push(loadImage("./asset/phone.png"));
  waste.push(loadImage("./asset/sms.png"));
  covid = loadImage("./asset/covid.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Création des boutons du menu principal
  singlePlayerButton = createButton('Single Player');
  singlePlayerButton.position(width - 300, height / 2 - 150);
  singlePlayerButton.size(150, 50);
  singlePlayerButton.mousePressed(() => startGame("single"));

  twoPlayerButton = createButton('Two Players');
  twoPlayerButton.position(width - 300, height / 2);
  twoPlayerButton.size(150, 50);
  twoPlayerButton.mousePressed(() => startGame("two"));

  threePlayerButton = createButton('Three Players');
  threePlayerButton.position(width - 300, height / 2 + 150);
  threePlayerButton.size(150, 50);
  threePlayerButton.mousePressed(() => startGame("three"));

  // Création du bouton Quit (invisible au début)
  quitButton = createButton('Quit');
  quitButton.position(width - 150, height - 75);
  quitButton.size(100, 50);
  quitButton.mousePressed(quitGame);
  quitButton.hide();

  // Initialisation des joueurs
  J1 = new Player1(850, 500);
  J2 = new Player2(600, 500);
  J3 = new Player3(400, 500);

  setupMovingCharacters(); // Initialiser les personnages
  showStartMenu(); // Afficher le menu de démarrage au début
}

let movingCharacters = []; // Liste des personnages traversant l'écran

function setupMovingCharacters() {
  movingCharacters = [
    { x: 0, y: 525, speed: random(2, 5), direction: 1, image: benoit_accueil },
    { x: width, y: 525, speed: random(2, 5), direction: -1, image: natacha_accueil },
    { x: -1000, y: 525, speed: random(2, 5), direction: 1, image: guillaume_accueil },
  ];
}

function showStartMenu() {
  background(bg_ingame);
  textSize(48);
  textAlign(RIGHT, RIGHT);
  fill(255, 255, 255);
  stroke(0);
  strokeWeight(5);
  text('Welcome to the Cloudfall !', 600, 100);
  textSize(24);
  text('Digital Cleanup Day', 600, 150);
  textSize(36);
  text('Choose a mode to get started', width - 50, 100 );

  textSize(28);
  fill(255, 215, 0);
  let animationOffset = sin(millis() / 200) * 5; // Animation de va-et-vient
  push();
  rotate(radians(-14));
  text(`Best Cleanup: ${bestScore}  Mb !`, width / 2 - 180 , height/2  + animationOffset);
  pop();

  // Afficher les boutons de sélection de mode de jeu
  singlePlayerButton.show();
  twoPlayerButton.show();
  threePlayerButton.show();

  // Animation des personnages traversant l'écran
  movingCharacters.forEach((character) => {
    image(character.image, character.x, character.y, 121, 200);
    character.x += character.speed * character.direction;

    // Réinitialiser la position lorsqu'un personnage sort de l'écran
    if (character.direction === 1 && character.x > width + 50) {
      character.x = -100;
      character.y = 525;
    } else if (character.direction === -1 && character.x < -100) {
      character.x = width + 50;
      character.y = 525;
    }
  });
}


function startGame(selectedMode) {
  gameStarted = true;
  gameFrozen = false;
  gameEnded = false;
  mode = selectedMode;
  startTime = millis();
  singlePlayerButton.hide();
  twoPlayerButton.hide();
  threePlayerButton.hide();
  quitButton.show();
  player1Score = 0;
  player2Score = 0;
  player3Score = 0;
  fallingObjects = [];
  redObjects = [];
}

function quitGame() {
  resetToMainMenu();
}

// Initialisation sécurisée de bestScore
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore'), 10) : 0;

function endGame() {
  gameStarted = false;
  gameFrozen = true;
  gameEnded = true;
  background(bg_ingame);
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(50);

  // Récupérer le gagnant
  let winner = displayResults();

  // Mise à jour du meilleur score
  if (mode === "single" && player1Score > bestScore) {
    bestScore = player1Score;
    localStorage.setItem('bestScore', bestScore.toString());
  }

  if ((mode === "two" || mode === "three") && winner && winner.score > bestScore) {
    bestScore = winner.score;
    localStorage.setItem('bestScore', bestScore.toString());
  }

  setTimeout(() => {
    gameEnded = false;
    resetToMainMenu();
  }, 3000);
}


function displayResults() {
  let winner = null;

  if (mode === "two" || mode === "three") {
    let scores = [
      { player: "Benoit", score: player1Score },
      { player: "Natacha", score: player2Score },
    ];
    if (mode === "three") {
      scores.push({ player: "Guillaume", score: player3Score });
    }

    scores.sort((a, b) => b.score - a.score);
    winner = scores[0]; // Le joueur avec le score le plus élevé

    // Dessiner un fond rectangulaire derrière le texte avec animation
    fill(0, 0, 0, 150); // Fond noir semi-transparent
    rect(width / 2 - 225, height / 2 - 150, 450, 300, 20); // Rectangle avec coins arrondis

    // Texte animé
    fill(255, 215, 0); // Couleur dorée
    textAlign(CENTER, CENTER);
    textSize(48);
    text(`${winner.player} Wins!`, width / 2, height / 2 - 50);
    textSize(32);
    text(`Cleanup: ${winner.score} Mb`, width / 2, height / 2 + 50);

  } else if (mode === "single") {
    console.log("Cleanup:", player1Score, "Mb");

    // Dessiner un fond rectangulaire derrière le texte avec animation
    fill(0, 0, 0, 150); // Fond noir semi-transparent
    rect(width / 2 - 225, height / 2 - 150, 450, 300, 20); // Rectangle avec coins arrondis

    // Texte animé
    fill(255, 215, 0); // Couleur dorée
    textAlign(CENTER, CENTER);
    textSize(48);
    text(`Congratulations!`, width / 2, height / 2 - 50);
    textSize(32);
    text(`Cleanup: ${player1Score}Mb`, width / 2, height / 2 + 20);
    text(`Best: ${bestScore}Mb`, width / 2, height / 2 + 70);
  }

  return winner;
}


function resetToMainMenu() {
  gameStarted = false;
  gameFrozen = false;
  gameEnded = false; // Réinitialise l'état de fin de jeu
  mode = "";
  singlePlayerButton.show();
  twoPlayerButton.show();
  threePlayerButton.show();
  quitButton.hide(); // Cache le bouton Quit
  player1Score = 0;
  player2Score = 0;
  player3Score = 0;
  fallingObjects = [];
  redObjects = [];
  showStartMenu();
}

function draw() {
  if (gameEnded) {
    return;
  }

  if (!gameStarted) {
    showStartMenu();
  } else if (gameFrozen) {
    return;
  } else {
    let elapsedTime = millis() - startTime;

    if (elapsedTime >= gameTimer) {
      endGame();
    } else {
      background(bg_ingame);

      handleFallingObjects();
      handleRedObjects();

      // Afficher et déplacer les joueurs
      J1.show();
      if (millis() > stunTimers.J1) J1.move();
      else forceFallToGround(J1);

      if (mode === "two" || mode === "three") {
        J2.show();
        if (millis() > stunTimers.J2) J2.move();
        else forceFallToGround(J2);

        // Collision entre J1 et J2
        handlePlayerCollision(J1, J2);

        handleHeadCollision(J1, J2);
        handleHeadCollision(J2, J1);
      }

      if (mode === "three") {
        J3.show();
        if (millis() > stunTimers.J3) J3.move();
        else forceFallToGround(J3);

        // Collisions entre J1, J2 et J3
        handlePlayerCollision(J1, J3);
        handlePlayerCollision(J2, J3);

        handleHeadCollision(J1, J2);
        handleHeadCollision(J1, J3);
        handleHeadCollision(J2, J1);
        handleHeadCollision(J2, J3);
        handleHeadCollision(J3, J1);
        handleHeadCollision(J3, J2);
      }

      // Affichage des scores et du temps restant
      displayScores();
      displayTimer(gameTimer - elapsedTime);

      // Notifications de score
      displayScoreNotifications();
    }
  }
}


function displayScoreNotifications() {
  for (let i = scoreNotifications.length - 1; i >= 0; i--) {
    let notification = scoreNotifications[i];
    if (millis() > notification.duration) {
      scoreNotifications.splice(i, 1); // Supprime la notification après expiration
    } else {
      textSize(18);
      fill(0, 255, 0);
      stroke(0);
      strokeWeight(1);
      textAlign(CENTER);
      text(notification.text, notification.x + 25, notification.y);
      notification.y -= 1; // Fait monter la notification légèrement
    }
  }
}

function handlePlayerCollision(playerA, playerB) {
  if (
    playerA.x + 50 > playerB.x &&
    playerA.x < playerB.x + 50 &&
    playerA.y + 100 > playerB.y &&
    playerA.y < playerB.y + 100 &&
    playerA.y + 100 > playerB.y + 10
  ) {
    if (playerA.x < playerB.x) {
      playerA.x -= 4;
      playerB.x += 4;
    } else {
      playerA.x += 4;
      playerB.x -= 4;
    }
  }
}

function handleHeadCollision(playerA, playerB) {
  if (
    playerA.y + 100 > playerB.y &&
    playerA.y + 90 < playerB.y &&
    playerA.x + 50 > playerB.x &&
    playerA.x < playerB.x + 50 &&
    playerA.yVelocity > 0
  ) {
    playerA.y = playerB.y - 100;
    playerA.yVelocity = 0;
    playerA.isJumping = false;
  }
}

class Player1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.jumpForce = -15;
    this.gravity = 1;
    this.isJumping = false;
    this.yVelocity = 0;
    this.currentImage = benoit; // Image par défaut
  }

  show() {

    let shadowSize = map(this.y + 25, 550, 450, 60, 40); // Taille de l'ombre
    fill(100, 100, 100, 150); // Ombre grise
    ellipse(this.x + 25, 550 + 150, shadowSize, shadowSize / 10); // Ombre plus bas
    noStroke();

    push();
    translate(-25, -50);
    image(this.currentImage, this.x, this.y, 121, 200);
    pop();

    push();
    // Instructions pour afficher les contrôles au début
    if (millis() < 4000) {
      textAlign(CENTER);
      textSize(18);
      fill(0);
      stroke(255);
      strokeWeight(3);
      text("Arrow keys to move", this.x + 25, this.y - 20);
      text("UP to jump", this.x + 25, this.y - 40);
    }
    pop();
  }

  move() {
    let moving = false; // Indique si le joueur est en train de bouger
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= this.speed;
      this.currentImage = benoit_run_l; // Image pour déplacement à gauche
      moving = true;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.x += this.speed;
      this.currentImage = benoit_run_r; // Image pour déplacement à droite
      moving = true;
    }
    if (keyIsDown(UP_ARROW) && !this.isJumping) {
      this.isJumping = true;
      this.yVelocity = this.jumpForce;
      this.currentImage = benoit_jump; // Image pour saut
    }

    if (!moving && !this.isJumping) {
      this.currentImage = benoit; // Image par défaut (immobile)
    }

    this.y += this.yVelocity;
    this.x = constrain(this.x, 0, width - 50);
    this.yVelocity += this.gravity;

    if (this.y >= 550) {
      this.y = 550;
      this.isJumping = false;
      this.yVelocity = 0;
    }
  }
}

class Player2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.jumpForce = -15;
    this.gravity = 1;
    this.isJumping = false;
    this.yVelocity = 0;
    this.currentImage = natacha; // Image par défaut
  }

  show() {
    let shadowSize = map(this.y + 25, 550, 450, 60, 40); // Taille de l'ombre
    fill(100, 100, 100, 150); // Ombre grise
    ellipse(this.x + 25, 550 + 145, shadowSize, shadowSize / 10); // Ombre plus bas
    noStroke();

    push();
    translate(-25, -50);
    image(this.currentImage, this.x, this.y, 160, 200);
    pop();

    // Instructions pour afficher les contrôles au début
    push();
    if (millis() < 4000) {
      textAlign(CENTER);
      textSize(18);
      fill(0);
      stroke(255);
      strokeWeight(3);
      text("Q/D to move", this.x + 25, this.y - 20);
      text("Z to jump", this.x + 25, this.y - 40);
    }
    pop();  
  }

  move() {
    let moving = false; // Indique si le joueur est en train de bouger
    if (keyIsDown(81)) {
      this.x -= this.speed;
      this.currentImage = natacha_run_l; // Image pour déplacement à gauche
      moving = true;
    }
    if (keyIsDown(68)) {
      this.x += this.speed;
      this.currentImage = natacha_run_r; // Image pour déplacement à droite
      moving = true;
    }
    if (keyIsDown(90) && !this.isJumping) {
      this.isJumping = true;
      this.yVelocity = this.jumpForce;
      this.currentImage = natacha_jump; // Image pour saut
    }

    if (!moving && !this.isJumping) {
      this.currentImage = natacha; // Image par défaut (immobile)
    }

    this.y += this.yVelocity;
    this.x = constrain(this.x, 0, width - 50);
    this.yVelocity += this.gravity;

    if (this.y >= 550) {
      this.y = 550;
      this.isJumping = false;
      this.yVelocity = 0;
    }
  }
}

class Player3 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.jumpForce = -15;
    this.gravity = 1;
    this.isJumping = false;
    this.yVelocity = 0;
    this.currentImage = guillaume; // Image par défaut
  }

  show() {
    let shadowSize = map(this.y + 25, 550, 450, 60, 40); // Taille de l'ombre
    fill(100, 100, 100, 150); // Ombre grise
    ellipse(this.x + 25, 550 + 150, shadowSize, shadowSize / 10); // Ombre plus bas
    noStroke();


    push();
    translate(-25, -50);
    image(this.currentImage, this.x, this.y, 127, 200);
    pop();

    // Instructions pour afficher les contrôles au début
    push();
    if (millis() < 4000) {
      textAlign(CENTER);
      textSize(18);
      fill(0);
      stroke(255);
      strokeWeight(3);
      text("Use MOUSE to move", this.x + 25, this.y - 20);
      text("Click to jump", this.x + 25, this.y - 40);
    }
    pop();  
  }

  move() {
    let moving = false; // Indique si le joueur est en train de bouger

    // Déplacement à gauche
    if (mouseX < this.x - 25) {
        this.x -= this.speed;
        this.currentImage = guillaume_run_l; // Image pour déplacement à gauche
        moving = true;
    }

    // Déplacement à droite
    if (mouseX > this.x + 25) {
        this.x += this.speed;
        this.currentImage = guillaume_run_r; // Image pour déplacement à droite
        moving = true;
    }

    // Gestion du saut
    if (mouseIsPressed && !this.isJumping) {
        this.isJumping = true;
        this.yVelocity = this.jumpForce;
        this.currentImage = guillaume_jump; // Image pour saut
    }

    // Mise à jour de la position verticale
    this.y += this.yVelocity;
    this.yVelocity += this.gravity;

    // Vérifier si le joueur touche le sol
    if (this.y >= 550) {
        this.y = 550;
        this.isJumping = false;
        this.yVelocity = 0;
    }

    // Image par défaut (immobile) si aucune action n'est en cours
    if (!moving && !this.isJumping) {
        this.currentImage = guillaume; // Image par défaut
    }

    // Contraintes pour rester dans les limites de l'écran
    this.x = constrain(this.x, 0, width - 50);
}


}

function handleFallingObjects() {
  if (frameCount % 60 === 0) {
    fallingObjects.push(new FallingObject(random(0, width), 0, "green"));
  }
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    let obj = fallingObjects[i];
    obj.show();
    obj.update();
    if (obj.isCaughtByPlayer(J1)) {
      player1Score++;
      fallingObjects.splice(i, 1);
    } else if ((mode === "two" || mode === "three") && obj.isCaughtByPlayer(J2)) {
      player2Score++;
      fallingObjects.splice(i, 1);
    } else if (mode === "three" && obj.isCaughtByPlayer(J3)) {
      player3Score++;
      fallingObjects.splice(i, 1);
    } else if (obj.isOutOfBounds()) {
      fallingObjects.splice(i, 1);
    }
  }
}

function handleRedObjects() {
  if (frameCount % 180 === 0) {
    redObjects.push(new FallingObject(random(0, width), 0, "red"));
  }
  for (let i = redObjects.length - 1; i >= 0; i--) {
    let obj = redObjects[i];
    obj.show();
    obj.update();
    if (obj.isCaughtByPlayer(J1)) {
      stunTimers.J1 = millis() + 2000;
      redObjects.splice(i, 1);
    } else if ((mode === "two" || mode === "three") && obj.isCaughtByPlayer(J2)) {
      stunTimers.J2 = millis() + 2000;
      redObjects.splice(i, 1);
    } else if (mode === "three" && obj.isCaughtByPlayer(J3)) {
      stunTimers.J3 = millis() + 2000;
      redObjects.splice(i, 1);
    } else if (obj.isOutOfBounds()) {
      redObjects.splice(i, 1);
    }
  }
}

function displayScores() {
  textSize(24);
  fill(0, 102, 204);
  text(`Benoit: ${player1Score}Mb`, 100, 50);

  if (millis() < stunTimers.J1) {
    fill(255, 215, 0);
    text(`STUNNED !`, J1.x + 25, J1.y - 50);
  }
  if (mode === "two" || mode === "three") {
    fill(0, 102, 204);
    text(`Natacha: ${player2Score}Mb`, 100, 80);
    if (millis() < stunTimers.J2) {
      fill(255, 215, 0);
      text(`STUNNED !`, J2.x + 25, J2.y - 50);
    }
  }
  if (mode === "three") {
    fill(0, 102, 204);
    text(`Guillaume: ${player3Score}Mb`, 100, 110);

    if (millis() < stunTimers.J3) {
      fill(255, 215, 0);
      text(`STUNNED !`, J3.x + 25, J3.y - 50);
    }
    fill(0);
  }
}

function displayTimer(timeLeft) {
  textSize(24);
  fill(0);
  textAlign(CENTER, CENTER);
let timerSize = map(sin(millis() / 400), -1, 1, 24, 26); // Animation de va-et-vient pour la taille du texte avec une intensité réduite
textSize(timerSize);
fill(255, 0, 0);
textAlign(CENTER, CENTER);
text(`Time left: ${Math.ceil(timeLeft / 1000)}s`, width - 100, 30);
}

function forceFallToGround(player) {
  player.yVelocity += player.gravity;
  player.y += player.yVelocity;
  if (player.y >= 550) {
    player.y = 550;
    player.isJumping = false;
    player.yVelocity = 0;
  }
}
let scoreNotifications = []; // Stocke les notifications de score { x, y, text, duration }

// Mise à jour de la méthode handleFallingObjects
function handleFallingObjects() {
  if (frameCount % 60 === 0) {
    fallingObjects.push(new FallingObject(random(0, width), 0, "green"));
  }
  for (let i = fallingObjects.length - 1; i >= 0; i--) {
    let obj = fallingObjects[i];
    obj.show();
    obj.update();
    if (obj.isCaughtByPlayer(J1)) {
      player1Score += obj.points;
      scoreNotifications.push({ x: J1.x, y: J1.y - 20, text: `+${obj.points}`, duration: millis() + 1000 });
      fallingObjects.splice(i, 1);
    } else if ((mode === "two" || mode === "three") && obj.isCaughtByPlayer(J2)) {
      player2Score += obj.points;
      scoreNotifications.push({ x: J2.x, y: J2.y - 20, text: `+${obj.points}`, duration: millis() + 1000 });
      fallingObjects.splice(i, 1);
    } else if (mode === "three" && obj.isCaughtByPlayer(J3)) {
      player3Score += obj.points;
      scoreNotifications.push({ x: J3.x, y: J3.y - 20, text: `+${obj.points}`, duration: millis() + 1000 });
      fallingObjects.splice(i, 1);
    } else if (obj.isOutOfBounds()) {
      fallingObjects.splice(i, 1);
    }
  }
}

class FallingObject {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = 20 ;
    this.speed = 5;
    this.color = color;

    // Choisir une image aléatoire une fois pour chaque objet
    if (this.color === "red") {
      push();
      translate(-20, -20);
      this.image = covid; // Utilise l'image du COVID pour les objets rouges
      pop();
      this.points = 0; // Les objets rouges ne donnent pas de points
    } else if (this.color === "green") {
      let randomNum = Math.floor(Math.random() * 6);
      push();
      translate(-20, -20);
      this.image = waste[randomNum]; // Sélectionne une image aléatoire dans le tableau `waste`
      pop();
      this.points = this.getPointsByType(randomNum); // Définit les points selon le type
    }
  }

  getPointsByType(index) {
    // Associe un nombre de points à chaque type d'image
    if (waste[index] === waste[3]) return 3; // youtube vaut 3 points
    if (waste[index] === waste[2] || waste[index] === waste[0]) return 2; // photo et file valent 2 points
    return 1; // Tous les autres valent 1 point
  }

  show() {
    image(this.image, this.x, this.y, 40, 40); // Affiche l'image sélectionnée pour cet objet
  }

  update() {
    this.y += this.speed;
  }

  isCaughtByPlayer(player) {
    return (
      this.x > player.x &&
      this.x < player.x + 50 &&
      this.y + this.size / 2 >= player.y &&
      this.y - this.size / 2 <= player.y + 100
    );
  }

  isOutOfBounds() {
    return this.y > 650;
  }
}
