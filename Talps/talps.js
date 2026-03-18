let points = 0;
let siTalp = "Multimedia/Images/Si_Digglet.png";
let siTalpS = "Multimedia/Images/Si_Digglet_Shiny.png";
let noTalp = "Multimedia/Images/No_Digglet.png";
let pamTalp = "Multimedia/Images/Pam_Digglet.png";
let audioMode = true;
let numTalps = 3;
let talpsRest = 0;
let time = 120;
let finalPoints = 0;
let sortirFinal = false;

setInterval(timeFun, 1000);
setInterval(talps, 1500);

function talps(){
    const talps = document.querySelectorAll('.talp');
    talpsRest = numTalps;
    talps.forEach(talp => {talpf(talp)});
}

function talpf(talpItem) {
    let rdm = Math.random(); 
    if (rdm > 0.5){
        if ((!talpItem.src.includes(siTalp) || !talpItem.src.includes(siTalpS)) && talpsRest > 0){
            if (audioMode == true){
                var audio = new Audio('Multimedia/Sounds/emerald_0097.wav');
                audio.play();
            }
            talpItem.src = shiny();
            talpsRest -= 1;
        } else {
            talpItem.src = noTalp;
        }
    } else {
        //if (talpItem.src.includes(siTalp)) numTalps += 1; 
        //if (talpItem.src.includes(siTalpS)) numTalps += 1; 
        talpItem.src = noTalp;
    }
    //document.getElementById("talps").innerHTML = ("Talps: " + numTalps);
}

document.addEventListener('mousedown', function() {
    document.body.style.cursor = "url('Multimedia/Images/Cursor_Hammer_Pam.png'), auto";
    setTimeout(() => {
        document.body.style.cursor = "url('Multimedia/Images/Cursor_Hammer.png'), auto";
    }, 250);
});

function pam(talpItem){
    //talpItem.st
    if (talpItem.src.includes(siTalp) || talpItem.src.includes(siTalpS)) { 
        points += 5;
        if (talpItem.src.includes(siTalpS)) points += 120; 
        //numTalps += 1;
        // document.getElementById("talps").innerHTML = ("Talps: " + numTalps);
        talpItem.src = pamTalp;
        if (audioMode == true){
            var audio = new Audio('Multimedia/Sounds/emerald_0094.wav');
            audio.play();
        }
    } else {
        if (audioMode == true){
            var audio = new Audio('Multimedia/Sounds/emerald_0088.wav');
            audio.play();
        }
        talpItem.src = "Multimedia/Images/Pam_NO_Digglet.png";
    }
    document.getElementById("puntuation").innerHTML = ("Puntuacio: " + points);
    setTimeout(() => {
        talpItem.src = noTalp;
    }, 500)
}

function changeAudio() {
    if (audioMode == true) {
        audioMode = false;
        document.getElementById("audio").src = "Multimedia/Images/Mute.png";
        
    } else {
        audioMode = true;
        document.getElementById("audio").src = "Multimedia/Images/Noise.png";
    }
}    

function timeFun(){
    if (time > 0) time--;
    let min = Math.trunc(time / 60);
    let seg = time % 60;
    document.getElementById("timer").innerHTML = "Time: " + min + ":" + ((seg > 9) ? seg : "0" + seg);


    if (time <= 0 && sortirFinal == false) {
        gameOcult();
        sumarPunts();
        sortirFinal = true;
    }
}

function sumarPunts(){
    finalPoints++;
    document.getElementById("finalpoints").innerHTML = finalPoints + " punts";
    if (finalPoints < points){ 
        setTimeout(sumarPunts, 2);
    } else {
        setTimeout(() => {location.reload();}, 5000)
    }
}

function shiny(){
    let rdm = Math.random(); 
    if (rdm < 0.01){
        if (audioMode == true){
            var audioShiny = new Audio('Multimedia/Sounds/emerald_0214.wav');
            audioShiny.play();
        }
        return siTalpS;
    } 
    return siTalp;
}

function gameOcult(){
    const gameObjects = document.querySelectorAll('.gameObj');
    gameObjects.forEach(object => {ocult(object)});
    const finalObject = document.querySelectorAll('.final');
    finalObject.forEach(object => {show(object)});
}

function ocult(object){
    object.style.display = "none";
}

function show(object){
    object.style.display = "block";
}