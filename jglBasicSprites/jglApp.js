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

    // Add a bunch of image sprites
    for (i = 0; i < g.NUM_SPRITES; i++) {
        var s = spriteList.newSprite({id: 'ball'+i, width: 32, height: 32, imageUrl: './redball32x32.png'});
        s.setPosition(jgl.random(g.SCREEN_WIDTH - 40) + 20, jgl.random(g.SCREEN_HEIGHT - 60) + 30);
        s.setHotSpot(16, 16);
        s.user.dx = jgl.random(17) - 8;
        s.user.dy = jgl.random(17) - 8;
        if (s.user.dy === 0 ) { s.user.dy = 1; }
    }

    // Create an image sprite for our logo
    g.logoSprite = spriteList.newSprite({id: 'logo', width: 88, height: 48, imageUrl: './jgl.png'});
    g.logoSprite.setPosition(g.SCREEN_WIDTH / 2, g.SCREEN_HEIGHT / 2);
    g.logoSprite.setHotSpot(44, 24); // make it draw centered

    // Create a canvas sprite that we can draw into
    g.msgSprite = spriteList.newSprite({id: 'message', width: 130, height: 30, active: false});
    g.msgSprite.setPosition(0, 0);
    var context = g.msgSprite.getContext();
    context.font = "20px Arial";
    context.fillStyle = "#000000";
    context.fillRect(0, 0, g.SCREEN_WIDTH, g.SCREEN_HEIGHT);
    context.fillStyle = "#eecc00";
    context.fillText("COLLISION",10,22);
}

updateBalls = function() {
    for (i = 0; i < g.NUM_SPRITES; i++) {
        var s = spriteList.sprites[i];

        // Update sprite's X & Y position
        s.x += s.user.dx;
        s.y += s.user.dy;

        // Are we ready to bounce off the edges?
        if (s.x > (g.SCREEN_WIDTH - 20) || s.x < 20) {
            s.user.dx = -(s.user.dx);
            s.x += s.user.dx;
        }
        if (s.y > (g.SCREEN_HEIGHT - 20) || s.y < 20) {
            s.user.dy = -(s.user.dy);
            s.y += s.user.dy;
        }

        // Did the sprite collide with the logo sprite?
        if (!g.collided && spriteList.collision(s, g.logoSprite, 0, true)) {
            g.collided = true;
        }
    }
}

updateScreen = function() {
    // Update positions of all sprites on the screen
    updateBalls();

    // Should the message sprite be active?
    g.msgSprite.setState(g.collided); g.collided = false;

    g.context.fillRect(0, 0, g.SCREEN_WIDTH, g.SCREEN_HEIGHT);
    spriteList.drawSprites(g.context);

    window.requestAnimationFrame(updateScreen);
}
