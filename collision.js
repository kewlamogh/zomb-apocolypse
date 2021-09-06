function range(start, end) { //from dev.to
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
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