function moveBullets() {
    let it = -1;
    for (let bullet of bullets) {
        it += 1;
        bullet.x += (bullet.targetDest.x - bullet.x) / 150;
        bullet.y += (bullet.targetDest.y - bullet.y) / 150;
        if (Math.round(bullet.x) == bullet.targetDest.x || bullet.hasHit) {
           deleteBullet(it);
           if (bullet.hasHit) {
               decreaseZombieHealth(bullet.hit);
           }
        }
        fill("black");
        circle(bullet.x, bullet.y, 5);
        fill("white");
    }
}

function drawgrassPieces() {
    fill("green");
    for (let tm of grassPieces) {
        circle(tm.x, tm.y, 10);
        for (let zomb of zombs) {
            if (Math.floor(zomb.x) == tm.x && Math.floor(zomb.y) == tm.y) {
                decreaseZombieHealth(zomb.id);
            }
        }
    }
}

function renderForcefieldOfLightWave() {
    if (renderWave) {
        circle(playerpos.x, playerpos.y, 50);
    }
}

function renderObjects() {
    for (var i of objects) { 
        rect(i.x, i.y, 30, 30); 
    }
}

function renderPlayer(color = "peachpuff") {
    fill(color);
    circle(playerpos.x, playerpos.y, 30);
    fill("white");
}

function crosshair() {
    rect(mouseX, mouseY, 10, 30);
    rect(mouseX, mouseY, 30, 10);
}

function moveZombs() {
    fill(color("green"));
    for (let zomb of zombs) {
        zomb.x += (playerpos.x - zomb.x) / 15;
        zomb.y += (playerpos.y - zomb.y) / 15;
        circle(zomb.x, zomb.y, 30);
        checkForBulletsIn(zomb);
    }
    fill(color("white"));
}
