let playerpos = {"x": 0, "y": 0};
let bullets = [];
let keyspressed = {};
let zombs = [];
let n = 0;
let h = 1;
let reloadData = {
    "_inCurrentClip": 10,
    "_clip": 10,
    "_shouldReload": false
};
let dead = false;

setInterval(spawnZomb, 3000);

function spawnZomb() {
    n += 1;
    zombs.push({
        "x": Math.round(Math.random() * window.innerWidth),
        "y": Math.round(Math.random() * window.innerHeight),
        "id": n 
    });
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER);
}

document.onkeydown = (e) => {keyspressed[e.key] = true};
document.onkeyup = (e) => {delete keyspressed[e.key]};

async function move() {
    if ("w" in keyspressed) {
        playerpos["y"] -= 1;
        playerpos["y"] -= 1;
        playerpos["y"] -= 1;
    }
    if ("s" in keyspressed) {
        playerpos["y"] += 1;
        playerpos["y"] += 1;
        playerpos["y"] += 1;
    }
    if ("a" in keyspressed) {
        playerpos["x"] -= 1;
        playerpos["x"] -= 1;
        playerpos["x"] -= 1;
    }
    if ("d" in keyspressed) {
        playerpos["x"] += 1;
        playerpos["x"] += 1;
        playerpos["x"] += 1;
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
    zombs = zombs.filter((a) => a != undefined && a != null);
}

function range(start, end) { //from dev.to
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function draw(){
    if (dead) {
        return;
    }
    clear();
    move();                  
    isPlayerTouchingZomb(playerpos);
    background("green");
    text(reloadData._inCurrentClip+"/"+reloadData._clip, 0, 300);
    moveBullets();
    moveZombs();
    renderPlayer();
}

function moveZombs() {
    fill(color("lightgreen"));
    for (let zomb of zombs) {
        zomb.x += (playerpos.x - zomb.x) / 15;
        zomb.y += (playerpos.y - zomb.y) / 15;
        rect(zomb.x, zomb.y, 10, 10);
        checkForBulletsIn(zomb);
    }
    fill(color("white"));
}

function renderPlayer() {
    rect(playerpos["x"], playerpos["y"], 10, 10);  
}

function moveBullets() {
    let it = -1;
    for (let bullet of bullets) {
        it += 1;
        bullet.x += (bullet.targetDest.x - bullet.x) / 30;
        bullet.y += (bullet.targetDest.y - bullet.y) / 30;
        if (Math.round(bullet.x) == bullet.targetDest.x || bullet.hasHit) {
           deleteBullet(it);
           if (bullet.hasHit) {
               killZomb(bullet.hit);
           }
        }
        rect(bullet.x, bullet.y, 5, 5);
    }
}

function checkForBulletsIn(mob) {
    let zomb = mob;
    zomb.x = Math.round(zomb.x);
    zomb.y = Math.round(zomb.y);
    for (let bullet of bullets) {
        if (range(zomb.x - 5, zomb.x + 5).includes(Math.round(bullet.x)) && range(zomb.y - 5, zomb.y + 5).includes(Math.round(bullet.y))) {
            bullet.hasHit = true;
            bullet.hit = zomb.id;
            return true;
        }
    }
    return false;   
}

function isPlayerTouchingZomb(mob) {
    //TODO: Make player killbox more robust

    let player = mob;
    player.x = Math.round(mob.x);
    player.y = Math.round(mob.y);
    for (let z of zombs) {
        if (range(player.x - 10, player.x + 10).includes(Math.round(z.x)) && range(player.y - 10, player.y + 10).includes(Math.round(z.y))) {
            h -= 1;
            if (h == 0) {   
                dead = true;
                background("red");
            }
        }
    }
    return false;
}

function deleteBullet(n) {
    delete bullets[n];
    bullets = bullets.filter((a) => a != undefined && a != null);
}

async function mousePressed() {
    if (reloadData._inCurrentClip == 0) {
        reloadData._shouldReload = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        reloadData._inCurrentClip = reloadData._clip;
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