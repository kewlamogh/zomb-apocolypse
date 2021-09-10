let grassPieces = [];
async function move() {
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
}

document.onkeydown = (e) => {keyspressed[e.key] = true};
document.onkeyup = (e) => {delete keyspressed[e.key]};

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