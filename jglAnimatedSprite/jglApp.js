window.addEventListener("load", jglApp, false);

var jgl = null;
var spriteList = null;

var g = {
    NUM_SPRITES: 125,
    SCREEN_WIDTH: 960,
    SCREEN_HEIGHT: 540,
    KEY_STATE: [],
    canvas: null,
    context: null,
    explosionImg: null,
    explSprite: null
};  // global variables

function jglApp () {
    g.canvas = document.getElementById("canvas");
    g.context = g.canvas.getContext("2d");
    g.context.fillStyle = "#eeeeff";

    document.addEventListener("keydown", processKeyDown);
    document.addEventListener("keyup", processKeyUp);

    initSprites();
    updateScreen();
}

function processKeyDown(ev) {
    g.KEY_STATE[ev.keyCode] = true;

    g.explSprite.animate = true;
    g.explSprite.setPosition(jgl.random(760) + 100,jgl.random(340) + 100);
    g.explSprite.setCurrentFrame(0);
    g.explSprite.show();
}

function processKeyUp(ev) {
    g.KEY_STATE[ev.keyCode] = false;
}

initSprites = function() {
    // Initialize the amazing JGL and create a new sprite list
    jgl = new Jgl;
    spriteList = jgl.newSpriteList();
    g.explosionImg = new Image();
    g.explosionImg.src = "../resources/images/explosion_1.png";

    // Add a bunch of image sprites
    g.explSprite = spriteList.newSprite({
        id: 'explosion',
        width: 88, height: 90,
        image: g.explosionImg,
        animate: true,
        autoLoop: false,
        autoDeactivate: true,
        currentFrame: 0,
        startFrame: 0,
        endFrame: 39
    });

    // Define animation frames
    for (var frame = 0; frame < 40; frame++) {
        g.explSprite.setAnimFrame(frame, g.explosionImg, frame * 88, 0, 88, 90);
    }

    g.explSprite.setPosition(jgl.random(760) + 100,jgl.random(340) + 100);
    g.explSprite.setHotSpot(44, 44);
}

updateScreen = function() {
    g.context.fillRect(0, 0, g.SCREEN_WIDTH, g.SCREEN_HEIGHT);
    spriteList.drawSprites(g.context);

    window.requestAnimFrame(updateScreen);
}
