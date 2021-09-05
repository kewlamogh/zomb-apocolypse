let playerpos = {"x": 0, "y": 0};
let bullets = [];
let keyspressed = {};
let zombs = [];
let n = 0;
let gun = {
    "_inCurrentClip": 10,
    "_clip": 10,
    "_shouldReload": false
};

setInterval(() => {
    spawnZomb()
}, 3000);

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
    if ("r" in keyspressed && !gun._shouldReload) {
        gun._shouldReload = true;
        gun._inCurrentClip = gun._clip;
        await new Promise(resolve => setTimeout(resolve, 1000));
        gun._shouldReload = false;
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
    clear();
    move();                  
    isPlayerTouchingZomb(playerpos);
    background("green");
    text(gun._inCurrentClip+"/"+gun._clip, 0, 300);
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
    fill(color("lightgreen"));
    for (let zomb of zombs) {
        zomb.x += (playerpos.x - zomb.x) / 15;
        zomb.y += (playerpos.y - zomb.y) / 15;
        rect(zomb.x, zomb.y, 10, 10);
        checkForBulletsIn(zomb);
    }
    fill(color("white"));
    rect(playerpos["x"], playerpos["y"], 10, 10);  
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
    let player = mob;
    player.x = Math.round(mob.x);
    player.y = Math.round(mob.y);
    for (let z of zombs) {
        if (range(player.x - 5, player.x + 5).includes(Math.round(z.x)) && range(player.y - 5, player.y + 5).includes(Math.round(z.y))) {
            alert("YOU DIED!");
            window.location.href = "/main.html";
        }
    }
    return false;
}

function deleteBullet(n) {
    delete bullets[n];
    bullets = bullets.filter((a) => a != undefined && a != null);
}

async function mousePressed() {
    if (gun._inCurrentClip == 0) {
        gun._shouldReload = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        gun._inCurrentClip = gun._clip;
    }
    
    bullets.push({
        "x": playerpos["x"],
        "y": playerpos["y"],
        "hit": null,
        "targetDest": {"x": Math.round(mouseX), "y": Math.round(mouseY)},        
        "hasHit": false
    });

    gun._inCurrentClip -= 1;
}