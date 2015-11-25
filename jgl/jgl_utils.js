//*****************************************************
//  The master JGL class
//*****************************************************

var CONVERT_TO_RADIAN = Math.PI/180;

// Utility function to create basic, empty DOM elements on demand
// *****************************************************
Jgl.prototype.requestAnimFrame = (function(callback){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 10);
        };
})();

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
        if (typeof params.parent === "string") {
            params.parent = document.getElementById(params.parent);
        }

        params.parent.appendChild(elem);
    }

    return elem;
};

//*****************************************************
Jgl.prototype.random = function(max){
    return Math.floor(Math.random() * max);
};

//*****************************************************
Jgl.prototype.randomRange = function(min, max){
    var range = max - min + 1;
    return (Math.floor(Math.random() * range) + min);
};

//*****************************************************
Jgl.prototype.newImage = function(src, callback){
    var image = new Image();
    if (callback){
        image.onload = function() { callback(image);};
    }
    image.src = src;
    return image;
};

//*****************************************************
Jgl.prototype.drawImage = function(context, image, x, y, params){

    if (!params) {
        context.drawImage(image, x, y);
        return;
    }

    // Params:
    //  scale: float
    //  scaleX: float
    //  scaleY: float
    //  center: boolean
    //  rotation: float
    //  opacity: float

    var width = image.width;
    var height = image.height;

    if (params.scale) {
        width = width * params.scale;
        height = height * params.scale;
    } else {
        if (params.scaleX) {
            width = width * params.scaleX;
        }

        if (params.scaleY) {
            height = height * params.scaleY;
        }
    }

    if (params.center) {
        x = x - parseInt(width / 2);
        y = y - parseInt(height / 2);
    }

    context.save();

    if (params.hasOwnProperty('rotation')) {
        if (params.center){
            context.translate(x + parseInt(width / 2), y + parseInt(height / 2));
            x = - parseInt(width / 2);
            y = - parseInt(height / 2);
        } else {
            context.translate(x, y);
            x = y = 0;
        }
        context.rotate(params.rotation * CONVERT_TO_RADIAN);
    }

    if (params.hasOwnProperty('opacity')) {
        context.globalAlpha = params.opacity;
    }

    context.drawImage(
        image,
        0, 0, image.width, image.height,
        x, y, width, height
    );

    context.restore();
};

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
};

// **********************************************************
// document.addEventListener(type, function(event) { data is in event.detail.data); });
Jgl.prototype.postEvent = function(type, data) {
    var event = new CustomEvent(type, { detail: { data: data }} );
    event.preventDefault();
    document.dispatchEvent(event);
};

// **********************************************************
Jgl.prototype.centerElement = function(elem, orientation) {
    if (typeof elem === "string"){
        elem = document.getElementById(elem);
    }

    if (orientation === undefined || orientation === 'horizontal' || orientation === 'both') {
        var parent = elem.parentNode;
        if (parent){
            elem.style.left = Math.floor((parent.clientWidth - elem.clientWidth) / 2) + 'px';
        }
    }

    if (orientation === 'vertical' || orientation === 'both') {
        var parent = elem.parentNode;
        if (parent){
            elem.style.top = Math.floor((parent.clientHeight - elem.clientHeight) / 2) + 'px';
        }
    }
};

/**
 * Load JavaScript file
 *
 * @public
 * @memberof JGL.UTILS
 * @param {string} filename The name of the file to load
 */
function loadjs(filename){
    document.write("<script src='" + filename + "'></script>");
}

/**
 * Load CSS file
 *
 * @public
 * @memberof JGL.UTILS
 * @param {string} filename The name of the file to load
 * @param {string} id An id to attach to the element
 */
function loadcss(filename, id) {
    var fileref;
    fileref=document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    if (id) {
        fileref.setAttribute("id", id);
    }
    document.querySelector("head").appendChild(fileref);
    return fileref;
}