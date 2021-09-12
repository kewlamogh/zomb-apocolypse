/*
Collisions and certain effects (such as player getting knocked back).
Copyright 2021 AmoghTheCool and Contributors
*/
function range(start, end, caller = "o") { //from dev.to
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    if (caller == "block" && ans.length > 0) {
        return true;
    } else if (caller == "block") {
        return false;
    }
    return ans;
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
            moveThreePixels("x", -(z.x - playerpos.x));
            moveThreePixels("y", -(z.y - playerpos.y));
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