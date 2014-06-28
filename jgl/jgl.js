//*****************************************************
var Jgl = function(){
    this.winList = [];
    this.mapList = [];
    this.spriteList = [];
};

Jgl.prototype.className = "jglGameLibrary";

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element){
            window.setTimeout(callback, 1000 / 10);
        };
})();

Jgl.prototype.error = {
    NOT_INITIALIZED: "not_initialized_error",
    PARAMETER: "parameter_error",
    INVALID_ID: "invalid_id",
    INVALID_CONTEXT: "invalid_context"
};

// Utility function to create basic, empty DOM elements on demand
// *****************************************************
Jgl.prototype.createElement = function(params) {
    if (!params){
        console.log("JGL: No parameters!");
    }
    if (!params.type) {
        params.type = 'div';
    }
    var elem = document.createElement(params.type);
    if (!params.position) {
        elem.style.position = 'absolute';
    } else {
        elem.style.position = params.position;
    }
    if (params.class){
        elem.className = params.class;
    }
    if (params.id){
        elem.id = params.id;
    }
    if (params.src){
        elem.setAttribute("src", params.src);
    }
    if (params.top){
        elem.style.top = params.top;
    }
    if (params.left){
        elem.style.left = params.left;
    }
    if (params.width){
        elem.style.width = params.width;
    }
    if (params.height){
        elem.style.height = params.height;
    }
    if (params.text){
        elem.innerHTML = params.text;
    }
    if (params.parent){
        params.parent.appendChild(elem);
    }

    return elem;
}

//*****************************************************
Jgl.prototype.random = function(max){
    return Math.floor(Math.random() * max);
}

//*****************************************************
Jgl.prototype.newImage = function(src){
    var image = new Image();
    image.src = src;
    return image;
}

//*****************************************************
Jgl.prototype.slowType = function(elem, str, speed, callback){
    var len = str.length;
    var i = 0;
    elem.innerHTML = "";

    function printChar(){
        var ch = str.charAt(i);
        if (ch == '~') { ch = '<br>'};
        elem.innerHTML += ch;
        if (++i <= len){
            setTimeout(printChar, speed);
        } else {
            if (callback) {
                callback();
            }
        }
    }

   printChar();
}

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
