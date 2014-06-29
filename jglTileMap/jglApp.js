window.addEventListener("load", jglApp, false);

var jgl = null;
var g = {
    KEY_STATE: [],
    KEY: { LEFT: 37, RIGHT: 39, UP: 38, DOWN: 40 },
    x: 0, y: 0,
    img: [],
    canvas: null,
    context: null,
    tmap: null
};

function processKeyDown(ev) {
    // console.log("KEY: "+ev.keyCode);
    ev.preventDefault();
    g.KEY_STATE[ev.keyCode] = true;
}

function processKeyUp(ev) {
    ev.preventDefault();
    g.KEY_STATE[ev.keyCode] = false;
}

function jglApp()
{
    g.canvas = document.getElementById("canvas");
    g.context = g.canvas.getContext("2d");
    g.context.fillStyle = "#eeeeff";

    document.addEventListener("keydown", processKeyDown);
    document.addEventListener("keyup", processKeyUp);

    jgl = new Jgl;

    console.log("Creating new map...");
    g.tmap = jgl.newTileMapCanvas({ context: g.context, x:0, y:0, w:(9*64), h:(5*64) });

    console.log("Creating tiles...");
    g.tmap.setDefaultTile({ img:jgl.newImage('sea.png'), x:0, y:0, w:64, h:64 });

    g.tmap.attachMap({ numColumns:16, numRows:16, tileWidth:64, tileHeight:64, mapData:
        [
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
            [0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1],
            [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0]
        ]});

    g.tmap.setPositionOffset(256, 128); // center of map is positioning hot spot

    g.img[0] = jgl.newImage('tile0.png', function() {
        g.tmap.newTile({ index:0, img: g.img[0], x:0, y:0, w:64, h:64 });
    });

    g.img[1] = jgl.newImage('tile1.png', function() {
        g.tmap.newTile({ index:1, img: g.img[1], x:0, y:0, w:64, h:64 });
        gameLoop();
    });
}

function gameLoop()
{
    if (g.KEY_STATE[g.KEY.LEFT])    { g.x -= 2; }
    if (g.KEY_STATE[g.KEY.RIGHT])   { g.x += 2; }
    if (g.KEY_STATE[g.KEY.UP])      { g.y -= 2; }
    if (g.KEY_STATE[g.KEY.DOWN])    { g.y += 2; }

    g.tmap.drawMap(g.x, g.y);
    window.requestAnimFrame(gameLoop);
}
