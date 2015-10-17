//***********************************************
Jgl_SpriteList = function(jgl){
    this.signature = "spritelist";
    this.jgl = jgl;
    this.sprites = [];
};

//***********************************************
Jgl_SpriteList.prototype.newSprite = function(params) {

    var sprite = new Jgl_Sprite(this.jgl, params);

    if (params.parent && params.parent.signature === "sprite") {
        params.parent.children.push(sprite);
    } else {
        this.sprites.push(sprite);
    }

    return sprite;
};

//***********************************************
Jgl_SpriteList.prototype.deleteSprite = function(sprite) {
    if (sprite){
        var index = this.sprites.indexOf(sprite);
        if (index >= 0) {
            this.sprites.splice(index, 1);
        }
        delete sprite;
    }
};

//***********************************************
Jgl_SpriteList.prototype.deleteAll = function() {
    this.sprites = [];
};

//***********************************************
Jgl_SpriteList.prototype.drawSprites = function(ctx) {
    if (!ctx){
        return this.jgl.error.INVALID_CONTEXT;
    }

    renderArray(this.sprites);

    function renderArray(spriteArray) {
        spriteArray.forEach(function(sprite) {
            if (sprite.active) {
                sprite.draw(ctx);
                if (sprite.children.length) {
                    renderArray(sprite.children);
                }
            }
        });
    }
};

//***********************************************
Jgl_SpriteList.prototype.doIntersect = function(rect1, rect2) {
    if ((rect1.x1 > rect2.x2) ||
        (rect1.y1 > rect2.y2) ||
        (rect1.x2 < rect2.x1) ||
        (rect1.y2 < rect2.y1)) {
            return false;
    }

    return true;
};

//***********************************************
Jgl_SpriteList.prototype.collision = function(sprite1, sprite2, fuzziness, circular) {
    if (circular){
        var xd = sprite1.x - sprite2.x;
        var yd = sprite1.y - sprite2.y;
        var rad = ((sprite1.width + sprite1.height) / 4) + ((sprite2.width + sprite2.height) / 4) - fuzziness;
        return (xd * xd + yd * yd < rad * rad);
    } else {
        // do rectangular collision
        var rect1 = {
            x1: sprite1.x - sprite1.offsetX + fuzziness,
            y1: sprite1.y - sprite1.offsetY + fuzziness,
            x2: sprite1.x - sprite1.offsetX + sprite1.width - fuzziness,
            y2: sprite1.y - sprite1.offsetY + sprite1.height - fuzziness
        };
        var rect2 = {
            x1: sprite2.x - sprite2.offsetX + fuzziness,
            y1: sprite2.y - sprite2.offsetY + fuzziness,
            x2: sprite2.x - sprite2.offsetX + sprite2.width - fuzziness,
            y2: sprite2.y - sprite2.offsetY + sprite2.height - fuzziness
        };
        return this.doIntersect(rect1, rect2);
    }
};

//***********************************************
Jgl_SpriteList.prototype.getSpriteById = function(id) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].id === id) {
            return this.sprites[i];
        }
    }
    return null;
};

//***********************************************
//  JGL_SPRITE
//***********************************************
Jgl_Sprite = function(jgl, params){
    var image;

    if (params.image) {
        image = params.image;
    } else {
        if (params.width && params.height) {
            image = jgl.createElement({
                type: 'canvas',
                width: params.width,
                height: params.height
            });
        } else {
            console.log("No sprite image data supplied.");
        }
    }

    this.signature = "sprite";
    this.user = {}; // opaque place to store user data
    this.x = 0;
    this.y = 0;
    this.children = []; // can attach sprites as children of other sprites in order to keep them grouped
    this.parent = null;
    this.relativePositioning = false;
    this.offsetX = this.offsetY = 0;
    this.srcX = this.srcY = 0;
    this.srcWidth = this.destWidth = params.width;
    this.srcHeight = this.destHeight = params.height;
    this.rotation = 0;
    this.radians = 0;
    this.animFrames = [];
    this.animate = false;
    this.animationSpeed = 1;
    this.animationSpeedCounter = 0;
    this.animationEndCallback = undefined;
    this.autoLoop = false;
    this.autoDeactivate = false;
    this.currentFrame = 0;
    this.startFrame = 0;
    this.endFrame = 0;
    this.active = true;

    if (params instanceof Object) {
        for (var attr in params) {
            if (params.hasOwnProperty(attr)) {
                this[attr] = params[attr];
            }
        }
    }

    this.setImage (image, this.srcX, this.srcY, this.srcWidth, this.srcHeight);
};

//***********************************************
Jgl_Sprite.prototype.getContext = function() {
    return this.animFrames[this.currentFrame].canvas.getContext("2d");
};

//***********************************************
Jgl_Sprite.prototype.setImage = function(image, srcX, srcY, srcWidth, srcHeight) {
    this.setAnimFrame(0, image, srcX, srcY, srcWidth, srcHeight);
};

//***********************************************
Jgl_Sprite.prototype.setHotSpot = function(x, y) {
    this.offsetX = x;
    this.offsetY = y;
};

//***********************************************
Jgl_Sprite.prototype.draw = function(ctx, x, y) {
    if (ctx){
        if (x) {
            this.x = x;
        }
        if (y) {
            this.y = y;
        }

        // A child sprite can optionally be positioned relative to its parent
        var relativeX = relativeY = 0;
        if (this.relativePositioning && this.parent) {
            relativeX = this.parent.x;
            relativeY = this.parent.y;
        }

        if (this.active) {
            var frame = this.animFrames[this.currentFrame];

            if (this.rotation) {
                frame.context.save();
                frame.context.rotate(this.radians);
            }

            ctx.drawImage(
                frame.canvas,
                frame.srcX,
                frame.srcY,
                frame.srcWidth,
                frame.srcHeight,
                this.x - this.offsetX + relativeX,
                this.y - this.offsetY + relativeY,
                this.destWidth,
                this.destHeight
            );

            if (this.rotation) {
                frame.context.restore();
            }

            if (this.animate) {
                if (++this.animationSpeedCounter >= this.animationSpeed) {
                    this.animationSpeedCounter = 0;
                    if (++this.currentFrame > this.endFrame) {
                        if (this.autoLoop) {
                            this.currentFrame = this.startFrame;
                        } else {
                            this.animate = false;
                            if (this.autoDeactivate) {
                                this.currentFrame = this.startFrame;
                                this.active = false;
                            }
                            if (this.animationEndCallback) {
                                this.animationEndCallback(this);
                            }
                        }
                    }
                }
            }
        }
    }
};

//***********************************************
Jgl_Sprite.prototype.setState = function(state) {
    this.active = !!(state);
};

//***********************************************
Jgl_Sprite.prototype.show = function() {
    this.active = true;
};

//***********************************************
Jgl_Sprite.prototype.hide = function() {
    this.active = false;
};

//***********************************************
Jgl_Sprite.prototype.setSize = function(width, height) {
    this.destWidth = width;
    this.destHeight = height;
};

//***********************************************
Jgl_Sprite.prototype.setRotation = function(rotation) {
    this.rotation = rotation;
    this.radians = rotation*Math.PI/180;

};

//***********************************************
Jgl_Sprite.prototype.setSourceDimensions = function(x, y, width, height) {
    this.srcX = x;
    this.srcY = y;
    this.srcWidth = this.destWidth = width;
    this.srcHeight = this.destHeight = height;
};

//***********************************************
Jgl_Sprite.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

//***********************************************
Jgl_Sprite.prototype.setAnimFrame = function(frame, image, srcX, srcY, srcWidth, srcHeight) {
    if (typeof(image) == "string") {
        var url = image;
        image = new Image();
        image.src = url;
    }

    this.animFrames[frame] = { canvas: image,
        srcX: srcX, srcY: srcY,
        srcWidth: srcWidth, srcHeight: srcHeight,
       // context: image.getContext("2d")
    };
};

//***********************************************
Jgl_Sprite.prototype.setCurrentFrame = function(frame) {
    this.currentFrame = frame;
};

//***********************************************
Jgl_Sprite.prototype.setFrameRange = function(start, end, current) {
    if (start !== undefined) { this.startFrame = start; }
    if (end !== undefined) { this.endFrame = end; }
    if (current !== undefined) { this.currentFrame = current; }
};

//***********************************************
Jgl_Sprite.prototype.setAnimActions = function(animate, autoLoop, autoDeactivate, animationEndCallback) {
    if (animate !== undefined) { this.animate = animate; }
    if (autoLoop !== undefined) { this.autoLoop = autoLoop; }
    if (autoDeactivate !== undefined) { this.autoDeactivate = autoDeactivate; }
    if (animationEndCallback !== undefined) { this.animationEndCallback = animationEndCallback; }
};
