let playerpos = {"x": window.innerWidth / 2, "y": window.innerHeight / 2};
let bullets = [];
let keyspressed = {};
let zombs = [];
let zombIdGenerator = 0;
let h = 1;
let reloadData = {
    "_inCurrentClip": 10,
    "_clip": 10,
    "_shouldReload": false
};
let inGamePosition = {
    "x": 0,
    "y": 0
};
let renderWave = false;
let objects = [
    {x: 30, y: 30},
    {x: 60, y: 60},
    {x: 90, y: 90},
    {x: 120, y: 120},
    {x: 30, y: 120}
];
let points = 0;
let dead = false;

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

function moveThreePixels(axis, change) {
    let revoke = false;

    inGamePosition[axis] += change;

    if (playerpos[axis] != change * 3) {
        playerpos[axis] += change;
    } else {
        playerpos[axis] -= change;
    }

    let p = {
        "x": Math.random() * 10000,
        "y": Math.random() * 10000
    } 

    if (range(0, window.innerWidth).includes(Math.round(p.x)) || range(0, window.innerHeight).includes(Math.round(p.y))) {} else {
        addObject(p.x, p.y);
    }
    
    p = {
        "x": Math.random() * 10000,
        "y": Math.random() * 10000
    } 

    if (range(0, window.innerWidth).includes(Math.round(p.x)) || range(0, window.innerHeight).includes(Math.round(p.y))) {} else {
        grassPieces.push({"x": p.x, "y": p.y});
    }

    for (let i of zombs) {
        i[axis] -= change;
        i[axis] -= change;
        i[axis] -= change;
    }

    for (let i of bullets) {
        i[axis] -= change;
        i[axis] -= change;
        i[axis] -= change;
    }

    for (let i of grassPieces) {
        i[axis] -= change;
        i[axis] -= change;
        i[axis] -= change;
    }
    
    for (let i of objects) {
        i[axis] -= change;
        i[axis] -= change;
        i[axis] -= change;
        let collisionPoints = range(
            Math.round(i[axis] + 45), 
            Math.round(i[axis] - 45),
            "block"
        );
        revoke = collisionPoints;
    }

    if (revoke) {
        for (let i of grassPieces) {
            i[axis] -= change;
            i[axis] -= change;
            i[axis] -= change;
        }

        for (let i of zombs) {
            i[axis] += change;
            i[axis] += change;
            i[axis] += change;
        }
    
        for (let i of bullets) {
            i[axis] += change;
            i[axis] += change;
            i[axis] += change;
        }
        
        for (let i of objects) {
            i[axis] += change;
            i[axis] += change;
            i[axis] += change;
        }
        
        playerpos[axis] -= change;
    }
} 

function killZomb(zombID) {
    let iterator = -1;
    for (let zomb of zombs) {
        iterator += 1;
        if (zomb.id == zombID) {
            delete zombs[iterator];
        }
    }
    points++;
    upgradePlayer();
    zombs = zombs.filter((a) => a != undefined && a != null);
}

let sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function decreaseZombieHealth(zombID) {
    for (let zomb of zombs) {
        if (zomb.id == zombID) {
            zomb.health -= 1;
            if (zomb.health == 0) {
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
    clear();                  
    isPlayerTouchingZomb(playerpos);
    background("lightgreen");
    fill("black");
    text("Ammo: "+reloadData._inCurrentClip+"/"+reloadData._clip, 0, 300);
    move();
    fill("brown");
    renderObjects();
    drawgrassPieces();
    moveBullets();
    moveZombs();
    fill("black");
    textSize(30);
    text("X: "+inGamePosition.x+" Y: "+-inGamePosition.y, 200, 900);
    renderForcefieldOfLightWave();
    renderPlayer();
    crosshair();
}

function deleteBullet(n) {
    delete bullets[n];
    bullets = bullets.filter((a) => a != undefined && a != null);
}

async function reload() {
    reloadData._shouldReload = true;
    await new Promise(resolve => setTimeout(resolve, 1000));
    reloadData._inCurrentClip = reloadData._clip;
}

async function mousePressed() {
    if (reloadData._inCurrentClip == 0) {
        reload();
        return;
    } 
    
    bullets.push({
        "x": playerpos["x"],
        "y": playerpos["y"],
        "hit": null,
        "targetDest": {"x": Math.round(mouseX), "y": Math.round(mouseY)},        
        "hasHit": false
    });

    reloadData._inCurrentClip -= 1;
}