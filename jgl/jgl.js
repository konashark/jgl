//*****************************************************
//  The master JGL class
//*****************************************************
var Jgl = function(){
    console.log("JGL INIT");
    this.winList    = [];
    this.mapList    = [];
    this.spriteList = [];
    this.stateList  = [];

    this.KEYS = {
        LEFT:       37,
        RIGHT:      39,
        UP:         38,
        DOWN:       40,
        ENTER:      13,
        BACK:       27,
        SPACE:      32,
        ESC:        27
    };
};

Jgl.prototype.className = "jglGameLibrary";

Jgl.prototype.error = {
    NOT_INITIALIZED:    "not_initialized_error",
    PARAMETER:          "parameter_error",
    INVALID_ID:         "invalid_id",
    INVALID_CONTEXT:    "invalid_context",
    ALREADY_ACTIVE:     "already_active"
};

Jgl.prototype.event = {
    JGL_INITIALIZED:    "jgl_initialized",
    STATE_ACTIVATE:     "state_activate",
    STATE_TERMINATE:    "state_terminate"
};

// Utility function to create basic, empty DOM elements on demand
// *****************************************************
window.requestAnimFrame = (function(callback){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 10);
        };
})();

//*****************************************************
//  STATE MANAGER - jgl_state.js
//*****************************************************
Jgl.prototype.newStateManager = function(){
    var stateManager = new Jgl_StateManager(this);
    this.stateList.push(stateManager);
    return stateManager;
};

//*****************************************************
//  WINDOW - jgl_window.js
//*****************************************************
Jgl.prototype.newWindow = function(params){
    var window = new Jgl_Window(this, params);
    this.winList.push(window);
    return window;
};

//*****************************************************
//  TILEMAP - jgl_tilemap.js
//*****************************************************
Jgl.prototype.newTileMap = function(params){
    var tileMap = new Jgl_TileMap(this, params);
    this.mapList.push(tileMap);
    return tileMap;
};

Jgl.prototype.newTileMapCanvas = function(params){
    var tileMap = new Jgl_TileMapCanvas(this, params);
    this.mapList.push(tileMap);
    return tileMap;
};

//*****************************************************
//  SPRITE - jgl_sprite.js
//*****************************************************
Jgl.prototype.newSpriteList = function(){
    var spriteList = new Jgl_SpriteList(this);
    this.spriteList.push(spriteList);
    return spriteList;
};
