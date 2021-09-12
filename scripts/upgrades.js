/*
Upgrades
- contains upgrade function
Copyright 2021 AmoghTheCool and Contributors
*/
let forcefieldOfLight = false;
let points = 0;
async function upgradePlayer() {
    if (points % 10 == 0) {
        h = points / 10;
    }
    if (points == 100) {
        forcefieldOfLight = true;
        alert("You unlocked \"Forcefield of Light\"");
    }
}