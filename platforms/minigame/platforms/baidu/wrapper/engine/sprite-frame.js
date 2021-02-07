if(cc.SpriteFrame) {
    cc.SpriteFrame.prototype._checkPackable = function () {
        const dynamicAtlas = cc.internal.dynamicAtlasManager;
        if (!dynamicAtlas) return;
        const texture = this._texture;

        if (!(texture instanceof cc.Texture2D) || texture.isCompressed) {
            this._packable = false;
            return;
        }

        const w = this.width;
        const h = this.height;
        if (!texture.image
            || w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize) {
            this._packable = false;
            return;
        }

        // HACK: Can't tell if it's a Canvas or an Image by instanceof on Baidu.
        if (texture.image && texture.image.getContext) {
            this._packable = true;
        }
    }
}