const space = 1;

class Atlas {
    constructor (width, height) {
        let canvas = document.createElement("canvas");
        canvas.style.width = canvas.width = width;
        canvas.style.height = canvas.height = height;
    
        // comment out this to show atlas
        // document.body.appendChild(canvas)
    
        let ctx = canvas.getContext('2d');
    
        let texture = new cc.Texture2D();
        texture.initWithElement(canvas);
        texture.handleLoadedTexture();

        this._texture = texture;
        this._ctx = ctx;

        this._x = space;
        this._y = space;
        this._nexty = space;

        this._width = width;
        this._height = height;
    }

    insertSpriteFrame (spriteFrame) {
        let rect = spriteFrame._rect;
        let sx = rect.x, sy = rect.y, width = rect.width, height = rect.height;

        if ((this._x + width) > this._width) {
            this._x = space;
            this._y = this._nexty;
        }

        if ((this._y + height) > this._nexty) {
            this._nexty = this._y + height;
        }

        if (this._nexty > this._height) {
            return false;
        }

        this._ctx.drawImage(spriteFrame._texture._image, 
            sx, sy, rect.width, rect.height,
            this._x, this._y, rect.width, rect.height,
        );

        spriteFrame._oriInfo = {
            x: sx,
            y: sy
        }

        rect.x = this._x;
        rect.y = this._y;

        this._x += width;

        spriteFrame._texture = this._texture;

        this._texture.handleLoadedTexture();

        return true;
    }
}

module.exports = Atlas;
