const RenderTexture = require('../../../assets/CCRenderTexture');

const space = 2;

function Atlas (width, height) {
    let texture = new RenderTexture();
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

Atlas.DEFAULT_HASH = (new RenderTexture())._getHash();

cc.js.mixin(Atlas.prototype, {
    insertSpriteFrame (spriteFrame) {
        let rect = spriteFrame._rect,
            texture = spriteFrame._texture,
            info = this._innerTextureInfos[texture._id];

        let sx = rect.x, sy = rect.y;

        if (info) {
            sx += info.x;
            sy += info.y;
        }
        else {
            let width = texture.width, height = texture.height;        

            if ((this._x + width + space) > this._width) {
                this._x = space;
                this._y = this._nexty;
            }

            if ((this._y + height + space) > this._nexty) {
                this._nexty = this._y + height + space;
            }

            if (this._nexty > this._height) {
                return null;
            }

            // texture bleeding
            this._texture.drawTextureAt(texture, this._x-1, this._y);
            this._texture.drawTextureAt(texture, this._x+1, this._y);
            this._texture.drawTextureAt(texture, this._x, this._y-1);
            this._texture.drawTextureAt(texture, this._x, this._y+1);
            this._texture.drawTextureAt(texture, this._x, this._y);

            this._innerTextureInfos[texture._id] = {
                x: this._x,
                y: this._y,
                texture: texture
            };

            sx += this._x;
            sy += this._y;

            this._x += width + space;

            this._dirty = true;
        }

        let frame = {
            x: sx,
            y: sy,
            texture: this._texture
        }
        
        this._innerSpriteFrames.push(spriteFrame);

        return frame;
    },

    update () {
        if (!this._dirty) return;
        this._texture.update();
        this._dirty = false;
    },

    deleteInnerTexture (texture) {
        if (texture) {
            delete this._innerTextureInfos[texture._id];
        }
    },

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
            frame._resetDynamicAtlasFrame();
        }
        this._innerSpriteFrames.length = 0;
        this._innerTextureInfos = {};
    },

    destroy () {
        this.reset();
        this._texture.destroy();
    }
});

module.exports = Atlas;
