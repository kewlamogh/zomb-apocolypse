/*
Movement and Keymapping
- This has the grassPieces var
- KeyPress register
- Movement function
Copyright 2021 DaCool1 and Contributors
*/

let grassPieces = [];
let switchWeaponCooldown = 100

async function move() {
    if (switchWeaponCooldown > 0) switchWeaponCooldown -= 1

    if ("w" in keyspressed || "ArrowUp" in keyspressed) {
        moveThreePixels('y', -1)
    }
    if ("r" in keyspressed && reloadData._inCurrentClip != reloadData._clip) {
        reload();
    }
    if ("s" in keyspressed || "ArrowDown" in keyspressed) {
        moveThreePixels('y', 1);
    }
    if ("a" in keyspressed || "ArrowLeft" in keyspressed) {
        moveThreePixels('x', -1);
    }
    if ("d" in keyspressed || "ArrowRight" in keyspressed) {
        moveThreePixels('x', 1);
    }
    if ('Shift' in keyspressed || "z" in keyspressed) {
        addObject(mouseX, mouseY)
        await sleep(10);
    }
    if ('e' in keyspressed || "/" in keyspressed) {
        if (switchWeaponCooldown == 0) {
            switchWeapon();

            switchWeaponCooldown = 100
        }
    }
    if ("q" in keyspressed || "Ctrl" in keyspressed) {
        if (superCooldown == 0) { superBlast(); superCooldown = 1200 }
    }
}

function moveThreePixels(axis, change) {
    let revoke = false;

    if (tripped > 0) {
        tripped -= 1;

        return;
    }

    if ((Math.random() * 100) == 1) {
        // player "trips"
        text("Oops you tripped.", 200, 750);

        tripped = 500;
        return;
    }

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
        grassPieces.push({
            "x": p.x,
            "y": p.y
        });
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
    

    forceField[axis] -= change;
    forceField[axis] -= change;
    forceField[axis] -= change;

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

        forceField[axis] += change;
        forceField[axis] += change;
        forceField[axis] += change;

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

document.onkeydown = (e) => {
    keyspressed[e.key] = true
}; 
document.onkeyup = (e) => {
    delete keyspressed[e.key]
}; 

window.onkeypress = async e => {
    if (e.key == "q") {
        for (var zomb of zombs) {
            zomb.x -= (playerpos.x > zomb.x ? 1 : -1) * 16;
            zomb.y -= (playerpos.y > zomb.y ? 1 : -1) * 16;
        }
        renderWave = true;
        await sleep(30);
        renderWave = false;
    }
}