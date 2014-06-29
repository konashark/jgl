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
    logoSprite: null,
    msgSprite: null,
    jgl: null,
    spriteList: null,
    collided: false
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
}

function processKeyUp(ev) {
    g.KEY_STATE[ev.keyCode] = false;
}

initSprites = function() {
    // Initialize the amazing JGL and create a new sprite list
    jgl = new Jgl;
    spriteList = jgl.newSpriteList();

    // Create an image sprite for our logo
    g.logoSprite = spriteList.newSprite({id: 'logo', width: 88, height: 48, imageUrl: './jgl.png'});
    g.logoSprite.setPosition(g.SCREEN_WIDTH / 2, g.SCREEN_HEIGHT / 2);
    g.logoSprite.setHotSpot(44, 24); // make it draw centered

}

updateScreen = function() {
    // g.context.fillRect(0, 0, g.SCREEN_WIDTH, g.SCREEN_HEIGHT);
    g.logoSprite.setPosition(jgl.randomRange(60,900), jgl.randomRange(40,500));
    spriteList.drawSprites(g.context);

    window.requestAnimFrame(updateScreen);
}
