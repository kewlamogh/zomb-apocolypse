/*
Main JS file
- contains draw function
- contains all vars
Copyright 2021 DaCool1 and Contributors
*/
let playerpos = {"x": window.innerWidth / 2, "y": window.innerHeight / 2};

let keyspressed = {};
let zombs = [];
let zombIdGenerator = 0;
let h = 1;
let superCooldown = 1200;

let tripped = 0;
let inGamePosition = {
    "x": 0,
    "y": 0
};
let objects = [
    {x: 30, y: 30},
    {x: 60, y: 60},
    {x: 90, y: 90},
    {x: 120, y: 120},
    {x: 30, y: 120}
];

sessionStorage.setItem('kills', 0)

setInterval(spawnZomb, 3000);

function spawnZomb() {
    zombIdGenerator++;
    zombs.push({   
        "x": Math.round(Math.random() * window.innerWidth),
        "y": Math.round(Math.random() * window.innerHeight),
        "id": zombIdGenerator,
        "health": 3
    });
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER); 
}

function addObject(x, y) {
    objects.push({
        "x": x,
        "y": y
    });
} 

function killZomb(zombID) {
    let iterator = -1;
    for (let zomb of zombs) {
        iterator += 1;
        if (zomb.id == zombID) {
            delete zombs[iterator];
        }
    }
    kills++;
    sessionStorage.setItem('kills', kills)
    
    zombs = zombs.filter((a) => a != undefined && a != null);
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function decreaseZombieHealth(zombID) {
    for (let zomb of zombs) {
        if (zomb.id == zombID) {
            zomb.health -= weapons[weapon].damage;
            if (zomb.health <= 0) {
                killZomb(zombID);
            } else {
                for (let i = 0; i <= 10; i++) {
                    zomb.x -= (playerpos.x - zomb.x) / 10;
                    zomb.y -= (playerpos.y - zomb.y) / 10;
                    await sleep(10);
                }
            }
        }
    }
}

function draw() {
    if (dead) {
        renderPlayer("lightgreen");
        return;
    }

    if (superCooldown > 0) {
        superCooldown -= 1;
    }

    clear(); 
    
    if (flinching > 0) {
        flinching--
    }

    isPlayerTouchingZomb(playerpos);
    background("lightgreen");
    fill("black");
    text("Ammo: "+reloadData._inCurrentClip+"/"+reloadData._clip, 0, 300);
    move();
    fill("brown");
    renderObjects();
    drawgrassPieces();
    renderSuperBar();
    moveBullets();

    moveZombs();
    fill("black");
    textSize(30);
    text("X: " + inGamePosition.x + " Y: " + -inGamePosition.y, 200, 900);

    if (forceField.timer > 0) {
        drawSuper();

        forceField.timer--;
    }

    renderPlayer();
    crosshair();
}

