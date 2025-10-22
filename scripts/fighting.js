let bullets = [];
let kills = 0;
let dead = false;
let flinching = 0;

let weapon = "Leadstorm";

let inventory = [
    {
        name: "Leadstorm",
        inClip: 40,
    }, {
        name: "Single Eye Kill",
        inClip: 6,
    }
]

let weapons = {
    "Leadstorm": {
        'damage': 1,
        'clip': 40,
        "flinchTime": 5,
        "reloadSpeed": 100
    }, 

    "Single Eye Kill": {
        'damage': 10,
        'clip': 6,
        "flinchTime": 60,
        "reloadSpeed": 300
    },
};

let reloadData = {
    "_inCurrentClip": 0,
    "_clip": weapons[weapon].clip,
    "_shouldReload": false
};

let forceField = {
    timer: 0,
    x: 0,
    y: 0
};

function deleteBullet(n) {
    delete bullets[n];
    bullets = bullets.filter((a) => a != undefined && a != null);
}

function superBlast() {
    forceField.timer = 500
    forceField.x = playerpos.x
    forceField.y = playerpos.y
}

function switchWeapon() {
    for (i of inventory) {
        if (i.name == weapon) {
            i.inClip = reloadData._inCurrentClip
            
            continue
        }

        weapon = i.name;

        reloadData._inCurrentClip = i.inClip
        reloadData._shouldReload = false
        reloadData._clip = weapons[weapon].clip
    }
}

function drawSuper() {
    fill("blue")
    noFill();
    circle(forceField.x, forceField.y, 200)
    fill("white")
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

    if (flinching == 0) {
        bullets.push({
            "x": playerpos["x"],
            "y": playerpos["y"],
            "hit": null,
            "targetDest": {
                "x": Math.round(mouseX),
                "y": Math.round(mouseY)
            },
            "hasHit": false
        });

        reloadData._inCurrentClip -= 1;
        flinching = weapons[weapon].flinchTime
    }
}