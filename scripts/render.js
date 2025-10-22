/*
Rendering
- all rendering functions here
- along with the scripts to move bullets and zombies
Copyright 2021 DaCool1 and Contributors
*/

function renderSuperBar() {
    fill("white")
    rect(0, 20, 120, 140)
    fill("gray")
    rect(0, 20, 120, superCooldown/10)
    fill("white")
}

function moveBullets() {
    let it = -1;
    for (let bullet of bullets) {
        it += 1;
        bullet.x += (bullet.targetDest.x - bullet.x) / 10;
        bullet.y += (bullet.targetDest.y - bullet.y) / 10;
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

async function moveZombs() {
    fill(color("green"));
    for (let zomb of zombs) {
        zomb.x += (playerpos.x - zomb.x) / 15;
        zomb.y += (playerpos.y - zomb.y) / 15;

        if (forceField.timer > 0 && (zomb.x > forceField.x - 100) && (zomb.x < forceField.x + 100) && (zomb.y > forceField.y - 100) && (zomb.y < forceField.y + 100)) {
            zomb.x -= (playerpos.x - zomb.x) / 10;
            zomb.y -= (playerpos.y - zomb.y) / 10;
        }
     
        circle(zomb.x, zomb.y, 30);
        checkForBulletsIn(zomb);
    }
    fill(color("white"));
}