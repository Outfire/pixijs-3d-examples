const app = new PIXI.Application({ autoStart: true, antialias: true });
document.getElementById("example").appendChild(app.view);

const { loader, stage } = app;
loader.add("./d6dice.json");
loader.load(onAssetsLoaded);

let camera = new PIXI.projection.Camera3d();
camera.position.set(400, 300);
camera.euler.set(0);
stage.addChild(camera);

let dice = new PIXI.projection.Container3d();
dice.position3d.set(0);
dice.euler.set(0);
camera.addChild(dice);
dice.sortableChildren = true;
sides = []

function onAssetsLoaded() {
    createDice();
    sortDiceSides();
    handleSliders();
}

function createDice() {
    let width = PIXI.utils.TextureCache.d6side1.width;
    let halfWidth = width / 2;
    let diceParams = {
        "1": {texture: "d6side1", x: 0,             y: 0,           z: -halfWidth,  ex: 0,              ey: 0,              ez: 0},
        "2": {texture: "d6side2", x: 0,             y: halfWidth,   z: 0,           ex: Math.PI * 0.5,  ey: 0,              ez: 0},
        "3": {texture: "d6side3", x: 0,             y: 0,           z: halfWidth,   ex: Math.PI,        ey: 0,              ez: 0},
        "4": {texture: "d6side4", x: 0,             y: -halfWidth,  z: 0,           ex: Math.PI * 1.5,  ey: 0,              ez: 0},
        "5": {texture: "d6side5", x: -halfWidth,    y: 0,           z: 0,           ex: 0,              ey: Math.PI * 0.5,  ez: 0},
        "6": {texture: "d6side6", x: halfWidth,     y: 0,           z: 0,           ex: 0,              ey: Math.PI * 1.5,  ez: 0}
    }

    for(let key in diceParams) {
        let params = diceParams[key];
        let side = createDiceSide(params.texture);
        side.position3d.set(params.x, params.y, params.z);
        side.euler.set(params.ex, params.ey, params.ez);
        dice.addChild(side);
    }
}

function createDiceSide(name) {
    let sprite = new PIXI.projection.Sprite3d(PIXI.utils.TextureCache[name]);
    sprite.anchor.set(0.5);
    sides.push(sprite)
    return sprite;
}

function sortDiceSides() {
    sides.sort((a, b) => {
        return a.getDepth() < b.getDepth() ? 1 : -1
    }).forEach((side, index) => {
        side.zIndex = index;
    })
    setEulerAmount();
}

function setEulerAmount() {
    document.querySelector('#eulerX .amount').innerText = dice.euler.x.toFixed(2);
    document.querySelector('#eulerY .amount').innerText = dice.euler.y.toFixed(2);
    document.querySelector('#eulerZ .amount').innerText = dice.euler.z.toFixed(2);
    document.querySelector('#eulerX input').value = dice.euler.x;
    document.querySelector('#eulerY input').value = dice.euler.y;
    document.querySelector('#eulerZ input').value = dice.euler.z;
}

function handleSliders() {
    handleSlider("x", dice.euler, "x");
    handleSlider("y", dice.euler, "y");
    handleSlider("z", dice.euler, "z");
}

function handleSlider(id, param, name) {
    document.querySelector(`input[id=${id}]`).oninput = event => {
        param[name] = Number(event.target.value);
        sortDiceSides();
    }
}

function startAnimation() {
    reset();
    gsap.to(dice.euler, {duration: 2, ease: "none", y: Math.PI * 2, x: Math.PI * 2, z: Math.PI * 2, onUpdate: sortDiceSides})
}

function reset() {
    dice.euler.set(0);
}