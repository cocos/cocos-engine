
(function() {
    gaf.Sprite.CanvasRenderCmd = function (renderable) {
        cc.Sprite.CanvasRenderCmd.call(this, renderable);
        this._hasTintMult = false;
        this._hasTintOffset = false;
        this._hasCtx = false;
        this._tintMult = cc.color(255,255,255,255);
        this._tintOffset = cc.color(0,0,0,0);
        this._textureDirty = false;
    };
    var proto = gaf.Sprite.CanvasRenderCmd.prototype = Object.create(cc.Sprite.CanvasRenderCmd.prototype);
    proto.constructor = gaf.Sprite.CanvasRenderCmd;

    proto._disableCtx = function(){
        this._hasTintOffset = false;
        this._hasCtx = false;
        this._textureDirty = true;
        this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
        this._tintMult = cc.color(255,255,255,255);
        this._tintOffset = cc.color(0,0,0,0);
    };

    proto._enableCtx = function(){

    };

    proto._applyCtxState = function(gafObject){

        var tintMult = gafObject._cascadeColorMult;
        var tintOffset = gafObject._cascadeColorOffset;
        var opacity = tintMult.a;

        // Apply opacity
        if(this._node.getOpacity() != opacity)
        {
            this._node.setOpacity(opacity);
        }

        // Check Tint multiplicator
        var multDirty = !cc.colorEqual(this._tintMult, tintMult);
        if(multDirty)
        {
            this._node.setColor(tintMult);
            this._tintMult = tintMult;
            this._hasTintMult =
                (tintMult.r !== 255 ||
                 tintMult.g !== 255 ||
                 tintMult.b !== 255 );
        }

        // Check Tint offset
        var offfsetDirty =
            (this._tintOffset.r != tintOffset.r) ||
            (this._tintOffset.g != tintOffset.g) ||
            (this._tintOffset.b != tintOffset.b) ||
            (this._tintOffset.a != tintOffset.a);

        if(offfsetDirty)
        {
            this._tintOffset = tintOffset;
            this._hasTintOffset =
                (tintOffset.r !== 0 ||
                 tintOffset.g !== 0 ||
                 tintOffset.b !== 0 ||
                 tintOffset.a !== 0 );
        }

        // Update dirty flag
        this._textureDirty = multDirty || offfsetDirty;
        if(this._textureDirty)
        {
            this.setDirtyFlag(cc.Node._dirtyFlags.colorDirty);
        }


        this._hasCtx = gafObject._filterStack.length > 0 && gafObject._filterStack[0].type === gaf.EFFECT_COLOR_MATRIX;

    };

    proto.rendering = function(ctx, scaleX, scaleY)
    {
        var node = this._node;
        var locTextureCoord = this._textureCoord,
            alpha = (this._displayedOpacity / 255);

        if ((node._texture && ((locTextureCoord.width === 0 || locTextureCoord.height === 0)            //set texture but the texture isn't loaded.
            || !node._texture._textureLoaded)) || alpha === 0)
            return;

        var wrapper = ctx || cc._renderContext,
            context = wrapper.getContext();
        var locX = node._offsetPosition.x,
            locHeight = node._rect.height,
            locWidth = node._rect.width,
            locY = -node._offsetPosition.y - locHeight,
            image;

        wrapper.setTransform(this._worldTransform, scaleX, scaleY);
        wrapper.setCompositeOperation(this._blendFuncStr);
        wrapper.setGlobalAlpha(alpha);

        if(node._flippedX || node._flippedY)
            wrapper.save();
        if (node._flippedX) {
            locX = -locX - locWidth;
            context.scale(-1, 1);
        }
        if (node._flippedY) {
            locY = node._offsetPosition.y;
            context.scale(1, -1);
        }

        image = node._texture._htmlElementObj;

        if (this._colorized) {
            context.drawImage(image,
                0, 0, locTextureCoord.width,locTextureCoord.height,
                locX * scaleX,locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        } else {
            context.drawImage(image,
                locTextureCoord.renderX, locTextureCoord.renderY, locTextureCoord.width, locTextureCoord.height,
                locX * scaleX, locY * scaleY, locWidth * scaleX, locHeight * scaleY);
        }

        if(node._flippedX || node._flippedY)
            wrapper.restore();
        cc.g_NumberOfDraws++;
    };

    if(cc.sys._supportCanvasNewBlendModes){
        proto._updateColor = function () {
            var displayedColor = this._displayedColor, node = this._node;
            this._hasTintMult |= (displayedColor.r !== 255 || displayedColor.g !== 255 || displayedColor.b !== 255);

            // If no color changes
            if(this._textureDirty)
            {
                this._textureDirty = false;
                if (this._colorized) {
                    this._colorized = false;
                    node.texture = this._originalTexture;
                }
            }
            else
            {
                return;
            }

            var locElement, locTexture = node._texture, locRect = this._textureCoord;
            if(this._hasTintMult)
            {
                if (locTexture && locRect.validRect && this._originalTexture) {
                    locElement = locTexture.getHtmlElementObj();
                    if (!locElement)
                        return;

                    this._colorized = true;
                    if (this._hasTintOffset || this._hasCtx) displayedColor = this._tintMult;

                    locElement = cc.Sprite.CanvasRenderCmd._generateTintImageWithMultiply(this._originalTexture._htmlElementObj, displayedColor, locRect);
                    locTexture = new cc.Texture2D();
                    locTexture.initWithElement(locElement);
                    locTexture.handleLoadedTexture();
                    node.texture = locTexture;
                }
            }

            locTexture = node._texture;
            if(this._hasTintOffset)
            {
                var cacheTextureForColor = cc.textureCache.getTextureColors(this._originalTexture.getHtmlElementObj());
                if (locTexture && locRect.validRect && this._originalTexture) {
                    locElement = locTexture.getHtmlElementObj();
                    if (!locElement)
                        return;
                    if(this._colorized)
                        var texRect = cc.rect(0,0,locRect.width, locRect.height);
                    else
                        texRect = locRect;
                    locElement = this._gafGenerateTintImage(node.texture._htmlElementObj, texRect, cacheTextureForColor, this._tintOffset, locRect);
                    locTexture = new cc.Texture2D();
                    locTexture.initWithElement(locElement);
                    locTexture.handleLoadedTexture();
                    node.texture = locTexture;
                    this._colorized = true;
                }
            }


        };

        proto._gafGenerateTintImage = function(texture, texRect, tintedImgCache, color, rect, renderCanvas){
            if (!rect)
                rect = cc.rect(0, 0, texture.width, texture.height);

            // Create a new buffer if required
            var w = Math.min(rect.width, tintedImgCache[0].width);
            var h = Math.min(rect.height, tintedImgCache[0].height);
            var buff = renderCanvas, ctx;
            if (!buff) {
                buff = document.createElement("canvas");
                buff.width = w;
                buff.height = h;
                ctx = buff.getContext("2d");
            } else {
                ctx = buff.getContext("2d");
                ctx.clearRect(0, 0, w, h);
            }
            ctx.save();

            // draw a channel with alpha of the original image
            ctx.globalCompositeOperation = 'source-over';
            //ctx.globalAlpha = 1;
            ctx.drawImage(tintedImgCache[2], rect.x, rect.y, w, h, 0, 0, w, h);

            // draw a rect of specified color
            ctx.globalCompositeOperation = 'source-in';
            ctx.fillStyle = 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',1)';
            ctx.fillRect(0, 0, w, h);

            // add the desired image to the drawn
            ctx.globalCompositeOperation = 'lighter';
            ctx.drawImage(texture, texRect.x, texRect.y, w, h, 0, 0, w, h);


            ctx.restore();
            return buff;

        };
    }

})();
