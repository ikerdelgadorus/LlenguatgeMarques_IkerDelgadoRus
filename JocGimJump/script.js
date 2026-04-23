let video;
let poseNet;
let poses = [];
let fallingDots = [];
let timer = 60; // Temps inicial del comptador
let timerRunning = false; // Per controlar si el comptador està en marxa
let handsInCircle = false; // Controla si les dues mans estan dins del cercle
let points = 0;
const timerBanner = document.getElementById("timerBanner");
const pontsBanner = document.getElementById("pointsBanner");
const burgerBanner = document.getElementById("burgerBanner");
const icons = ["🍞", "🍅", "🥬", "🍳", "🥩", "🥓", "🧀", "🧅"];
let burger = [];
var musica = new Audio('musica_JocGimJump.mp3'); 

// Posició i mida del cercle
let circleX;
const circleY = 200;
const circleRadius = 200; // Cercle més gran

function setup() {
    circleX = windowWidth / 2;
    createCanvas(windowWidth, windowHeight - 5); // Mida de la pantalla augmentada
    video = createCapture(VIDEO);
    video.size(width, height); // Mida del vídeo augmentada
    video.hide();

    poseNet = ml5.poseNet(video, () => console.log("PoseNet carregat!"));
    poseNet.on('pose', gotPoses);

    for (let i = 0; i < 20; i++) {
        fallingDots.push(createDot());
    }
}

function gotPoses(results) {
    poses = results;
}

function createDot() {
    return {
        x: random(width),
        y: random(-200, 0),
        speed: random(2, 5),
        size: random(40, 70),
        emoji: random(icons)
    };
}

function updateFallingDots() {
    if (poses.length > 0) {
        let pose = poses[0].pose;

        let keypoints = pose.keypoints.map(kp => ({
            ...kp,
            position: {
                x: width - kp.position.x,
                y: kp.position.y
            }
        }));

        let leftWrist = keypoints.find(kp => kp.part === 'leftWrist');
        let rightWrist = keypoints.find(kp => kp.part === 'rightWrist');

        for (let dot of fallingDots) {

            dot.y += dot.speed;

            if (leftWrist && rightWrist) {
                let d1 = dist(dot.x, dot.y, leftWrist.position.x, leftWrist.position.y);
                let d2 = dist(dot.x, dot.y, rightWrist.position.x, rightWrist.position.y);

                // Si alguna mano toca el punto
                if ((d1 < dot.size || d2 < dot.size) && timerRunning) {
                    if (dot.emoji == "🍞"){
                        countPonits();
                    } else if (burger.length >= 3) {
                        burger = [];
                    } else {
                        burger.push(dot.emoji);
                    }

                    burgerBanner.innerHTML = "<b>Burger:</b> " + burger;

                    //points += 5;
                    pontsBanner.innerHTML = "<b>Points:</b> " + points;
                    dot.x = random(width);
                    dot.y = random(-200, -50);
                }
            }

            if (dot.y > height + 50) {
                dot.x = random(width);
                dot.y = random(-300, -20);
            }

            // Dibujar
            fill(0, 255, 0, 255);
            noStroke();
            textAlign(CENTER, CENTER);
            textSize(dot.size);
            text(dot.emoji, dot.x, dot.y);
        }
    }
}

function countPonits(){
    let p = 1;
    burger.forEach(ingredient => {
        if (ingredient == "🥬"){
            p += 1;
        } else if (ingredient == "🍅"){
            p += 2;
        } else if (ingredient == "🍅"){
            p += 1;
        } else if (ingredient == "🍳"){
            p += 4;
        } else if (ingredient == "🥩"){
            p += 9;
        } else if (ingredient == "🥓"){
            p = p * 2;
        } else if (ingredient == "🧀"){
            p = p * 4;
        }
    });
    points += p;
    burger = [];
}

function draw() {
    background(0);
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    updateFallingDots();

    if (!timerRunning) {
        burger = [];
        fill(0, 255, 0, 50);
        noStroke();
        ellipse(circleX, circleY, circleRadius * 2);
    }

    if (poses.length > 0) {
        let pose = poses[0].pose;

        let keypoints = pose.keypoints.map(kp => ({
            ...kp,
            position: {
                x: width - kp.position.x,
                y: kp.position.y
            }
        }));

        if (!timerRunning) {
            let leftWrist = keypoints.find(kp => kp.part === 'leftWrist');
            let rightWrist = keypoints.find(kp => kp.part === 'rightWrist');

            if (leftWrist && rightWrist) {
                let leftDist = dist(leftWrist.position.x, leftWrist.position.y, circleX, circleY);
                let rightDist = dist(rightWrist.position.x, rightWrist.position.y, circleX, circleY);

                if (leftDist < circleRadius && rightDist < circleRadius) {
                    handsInCircle = true;
                    startTimer();
                }
            }
        }

        keypoints.forEach(kp => {
            if (kp.score > 0.2 && (kp.part.includes('Wrist') || kp.part.includes('Ankle'))) {
                fill(255, 0, 0);
                noStroke();
                ellipse(kp.position.x, kp.position.y, 50, 50);
            }
        });
    }

    if (timerRunning) {

        if (timer > 0 && frameCount % 60 === 0) {
            timer--;
            timerBanner.innerHTML = "<b>Time:</b> " + timer;
        }

        if (timer === 0) {
            resetGame();
        }
    }
}

function startTimer() {
    if (!timerRunning) {
        points = 0;
        timerRunning = true;
        handsInCircle = false; 
        musica.play();
    }
}

function resetGame() {
    timerRunning = false; 
    timer = 60;
    musica.pause();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    circleX = windowWidth / 2;
}

function btnInfo(){
    if (document.getElementById('infobutton').style.display == 'block') {
        document.getElementById('infobutton').style.display = 'none';
    } else {
        document.getElementById('infobutton').style.display = 'block';
    }
}