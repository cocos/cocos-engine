const space = 1;

class Atlas {
    constructor (width, height) {
        let texture = new cc.RenderTexture();
        texture.initWithSize(width, height);
        texture.update();
        
        this._texture = texture;

        this._x = space;
        this._y = space;
        this._nexty = space;

        this._width = width;
        this._height = height;

        this._innerTextureInfos = {};
        this._innerSpriteFrames = [];
    }

    insertSpriteFrame (spriteFrame) {
        let rect = spriteFrame._rect,
            texture = spriteFrame._texture,
            info = this._innerTextureInfos[texture._id];

        let sx = rect.x, sy = rect.y;

        if (info) {
            rect.x += info.x;
            rect.y += info.y;
        }
        else {
            let width = texture.width, height = texture.height;        

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

            this._texture.drawTextureAt(texture, this._x, this._y);

            this._innerTextureInfos[texture._id] = {
                x: this._x,
                y: this._y,
                texture: texture
            };

            rect.x += this._x;
            rect.y += this._y;

            this._x += width;

            this._dirty = true;
        }

        spriteFrame._original = {
            x: sx,
            y: sy,
            texture: spriteFrame._texture
        }

        spriteFrame._texture = this._texture;

        this._innerSpriteFrames.push(spriteFrame);

        return true;
    }

    update () {
        if (!this._dirty) return;
        this._texture.update();
        this._dirty = false;
    }

    reset () {
        this._x = space;
        this._y = space;
        this._nexty = space;

        let frames = this._innerSpriteFrames;
        for (let i = 0, l = frames.length; i < l; i++) {
            let frame = frames[i];
            if (!frame.isValid) {
                continue;
            }
            let oriInfo = frame._original;
            frame._rect.x = oriInfo.x;
            frame._rect.y = oriInfo.y;
            frame._texture = oriInfo.texture;
            frame._original = null;
        }
        this._innerSpriteFrames.length = 0;
        this._innerTextureInfos = {};
    }

    destroy () {
        this.reset();
        this._texture.destroy();
    }
}

module.exports = Atlas;
