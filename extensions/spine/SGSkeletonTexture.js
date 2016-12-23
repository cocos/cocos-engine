
sp.SkeletonTexture = cc.Class({
    name: 'sp.SkeletonTexture',
    extends: sp.spine.Texture,
    _texture: null,

    setRealTexture: function(tex) {
        this._texture = tex;
    },

    getRealTexture: function() {
        return this._texture;
    },

    setFilters: function(minFilter, magFilter) {
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var gl = cc._renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        }
    },

    setWraps: function(uWrap, vWrap) {
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            var gl = cc._renderContext;
            this.bind();
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
        }
    },

    dispose: function() {
    },

    bind: function() {
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL) {
            cc.gl.bindTexture2D(this._texture);
        }
    }
});
