let playerpos = {"x": window.innerWidth / 2, "y": window.innerHeight / 2};
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
let objects = [
    {x: 30, y: 30},
    {x: 21, y: 100},
    {x: 500, y: 30},
    {x: 10, y: 10}
];
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

function renderObjects() {
    for (var i of objects) {
        rect(i.x, i.y, 20, 20); 
    }
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
    rectMode(CENTER); 
}

document.onkeydown = (e) => {keyspressed[e.key] = true};
document.onkeyup = (e) => {delete keyspressed[e.key]};

function moveThreePixels(axis, change) {
    /*playerpos[axis] += change;
    playerpos[axis] += change;
    playerpos[axis] += change;*/

    for (let i of zombs) {
        i[axis] -= change * 3;
    }

    for (let i of bullets) {
        i[axis] -= change * 3;
    }

    for (let i of objects) {
        i[axis] -= change * 3;
    }
} 

async function move() {
    if ("w" in keyspressed) {
        moveThreePixels('y', -1)
    }
    if ("r" in keyspressed && reloadData._inCurrentClip != reloadData._clip) {
        reload();
    } 
    if ("s" in keyspressed) {
        moveThreePixels('y', 1);
    }
    if ("a" in keyspressed) {
        moveThreePixels('x', -1);
    }
    if ("d" in keyspressed) {
        moveThreePixels('x', 1);
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

function draw() {
    if (dead) {
        renderPlayer("lightgreen");
        return;
    }
    clear();
    move();                  
    isPlayerTouchingZomb(playerpos);
    background("green");
    renderObjects();
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
        circle(zomb.x, zomb.y, 30);
        checkForBulletsIn(zomb);
    }
    fill(color("white"));
}

function renderPlayer(color = "white") {
    fill(color);
    circle(playerpos["x"], playerpos["y"], 30);  
}

function moveBullets() {
    let it = -1;
    for (let bullet of bullets) {
        it += 1;
        bullet.x += (bullet.targetDest.x - bullet.x) / 150;
        bullet.y += (bullet.targetDest.y - bullet.y) / 150;
        if (Math.round(bullet.x) == bullet.targetDest.x || bullet.hasHit) {
           deleteBullet(it);
           if (bullet.hasHit) {
               killZomb(bullet.hit);
           }
        }
        fill("black");
        circle(bullet.x, bullet.y, 5);
        fill("white");
    }
}

function checkForBulletsIn(mob) {
    let zomb = mob;
    zomb.x = Math.round(zomb.x);
    zomb.y = Math.round(zomb.y);
    for (let bullet of bullets) {
        if (range(zomb.x - 15, zomb.x + 15).includes(Math.round(bullet.x)) && range(zomb.y - 15, zomb.y + 15).includes(Math.round(bullet.y))) {
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
        if (range(player.x - 15, player.x + 15).includes(Math.round(z.x)) && range(player.y - 15, player.y + 15).includes(Math.round(z.y))) {
            h -= 1;
            if (h == 0) {
                dead = true;
                alert("You got infected.");
                for (let i = 0; i < bullets.length; i++) {
                    deleteBullet(i);
                }
            }
        }
    }
    return false;
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