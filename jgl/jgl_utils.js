//*****************************************************
//  The master JGL class
//*****************************************************

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
}

//*****************************************************
Jgl.prototype.random = function(max){
    return Math.floor(Math.random() * max);
}

//*****************************************************
Jgl.prototype.randomRange = function(min, max){
    var range = max - min + 1;
    return (Math.floor(Math.random() * range) + min);
}

//*****************************************************
Jgl.prototype.newImage = function(src, callback){
    var image = new Image();
    if (callback){
        image.onload = function() { callback(image);};
    }
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

// **********************************************************
// document.addEventListener(type, function(event) { data is in event.detail.data); });
Jgl.prototype.postEvent = function(type, data) {
    var event = new CustomEvent(type, { detail: { data: data }} );
    event.preventDefault();
    document.dispatchEvent(event);
}

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
}

/**
 * Removes an element in the document
 *
 * @public
 * @memberof JUNOTK.SCREENUTILS
 * @param {string} _id The id of the new element. Can also be an element object.
 */
Jgl.prototype.removeElement = function(element) {
    var childElement = null;

    if (typeof element === "string") {
        childElement = document.getElementById(element);
    }
    else if((typeof element === "object") &&
        ('parentNode' in element)) {
        childElement = element;
    }

    if (childElement){
        childElement.parentNode.removeChild(childElement);
    }
}

/**
 * This function will fit an image to a space (window) scaling as
 * appropriate based on the relative aspect ratios of the space and
 * image and sizes whilst retaining the aspect ratio of the image.
 *
 * @public
 * @memberof JUNOTK.SCREENUTILS
 * @param {object} imgElement the targetted <img>
 */
Jgl.prototype.fitImageToSpace = function(imgElement) {
    // aspect ratios
    var windowAR = imgElement.width / imgElement.height;
    var imageAR = imgElement.naturalWidth / imgElement.naturalHeight;
    var scaleFactor;

    if (windowAR - imageAR > 0) {
        // all available width - scale height
        scaleFactor = imgElement.width / imgElement.naturalWidth;
        imgElement.height = imgElement.naturalHeight * scaleFactor;
    }
    else {
        // all available height scale width
        scaleFactor = imgElement.height / imgElement.naturalHeight;
        imgElement.width = imgElement.naturalWidth * scaleFactor;
    }
}

