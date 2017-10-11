/****************************************************************************
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * ParticleSystem's canvas render command
 */
_ccsg.ParticleSystem.CanvasRenderCmd = function(renderable){
    this._rootCtor(renderable);
    this._needDraw = true;

    this._pointRect = cc.rect(0, 0, 0, 0);
    this._tintCache = null;
};
var proto = _ccsg.ParticleSystem.CanvasRenderCmd.prototype = Object.create(_ccsg.Node.CanvasRenderCmd.prototype);
proto.constructor = _ccsg.ParticleSystem.CanvasRenderCmd;

proto.updateQuadWithParticle = function (particle, newPosition) {
    //do nothing
};

proto.updateParticlePosition = function(particle, position){
    cc.pIn(particle.drawPos, position);
};

proto.updateStatus = function() {
    this.originUpdateStatus();
    this._updateCurrentRegions();
    this._regionFlag = _ccsg.Node.CanvasRenderCmd.RegionStatus.DirtyDouble;
    this._dirtyFlag &= ~_ccsg.Node._dirtyFlags.contentDirty;
};

proto.rendering = function (ctx, scaleX, scaleY) {
    //TODO: need refactor rendering for performance
    var wrapper = ctx || cc._renderContext, context = wrapper.getContext(),
        node = this._node, pointRect = this._pointRect;

    wrapper.setTransform(this._worldTransform, scaleX, scaleY);
    wrapper.save();
    if (node.isBlendAdditive())
        context.globalCompositeOperation = 'lighter';
    else
        context.globalCompositeOperation = 'source-over';

    var i, particle, lpx, alpha;
    var particleCount = this._node.particleCount, particles = this._node._particles;
    if (node._texture) {
        // Delay drawing until the texture is fully loaded by the browser
        if (!node._texture.loaded) {
            wrapper.restore();
            return;
        }
        var element = node._texture.getHtmlElementObj();
        if (!element.width || !element.height) {
            wrapper.restore();
            return;
        }

        var drawElement = element;
        for (i = 0; i < particleCount; i++) {
            particle = particles[i];
            lpx = (0 | (particle.size * 0.5));

            alpha = particle.color.a / 255;
            if (alpha === 0) continue;
            context.globalAlpha = alpha;

            context.save();
            context.translate((0 | particle.drawPos.x), -(0 | particle.drawPos.y));

            var size = Math.floor(particle.size / 4) * 4;
            var w = pointRect.width;
            var h = pointRect.height;

            context.scale(Math.max((1 / w) * size, 0.000001), Math.max((1 / h) * size, 0.000001));
            if (particle.rotation)
                context.rotate(cc.degreesToRadians(particle.rotation));

            drawElement = particle.isChangeColor ? this._changeTextureColor(node._texture, particle.color, this._pointRect) : element;
            context.drawImage(drawElement, -(0 | (w / 2)), -(0 | (h / 2)));
            context.restore();
        }
        cc.g_NumberOfDraws++;
    }
    wrapper.restore();
};

proto._changeTextureColor = function (texture, color, rect) {
    if (!this._tintCache) {
        this._tintCache = document.createElement("canvas");
    }
    var tintCache = this._tintCache;
    var textureContentSize = texture.getContentSize();
    tintCache.width = textureContentSize.width;
    tintCache.height = textureContentSize.height;
    return texture._generateColorTexture(color.r, color.g, color.b, rect, tintCache);
};

proto.initTexCoordsWithRect = function(pointRect){
    this._pointRect = pointRect;
};

proto.setTotalParticles = function(tp){
    //cc.assert(tp <= this._allocatedParticles, "Particle: resizing particle array only supported for quads");
    this._node._totalParticles = (tp < 200) ? tp : 200;
};

proto.addParticle = function(){
    var node = this._node,
        particles = node._particles,
        particle;
    if (node.particleCount < particles.length) {
        particle = particles[node.particleCount];
    } else {
        particle = new cc.Particle();
        particles.push(particle);
    }
    return particle;
};

proto._setupVBO = function(){};
proto._allocMemory = function(){
    return true;
};

proto.postStep = function(){};

proto._setBlendAdditive = function(){
    var locBlendFunc = this._node._blendFunc;
    locBlendFunc.src = cc.macro.BLEND_SRC;
    locBlendFunc.dst = cc.macro.BLEND_DST;
};

proto._initWithTotalParticles = function(totalParticles){};
proto._updateDeltaColor = function(selParticle, dt){
    if (!this._node._dontTint) {
        selParticle.color.r += selParticle.deltaColor.r * dt;
        selParticle.color.g += selParticle.deltaColor.g * dt;
        selParticle.color.b += selParticle.deltaColor.b * dt;
        selParticle.color.a += selParticle.deltaColor.a * dt;
        selParticle.isChangeColor = true;
    }
};
