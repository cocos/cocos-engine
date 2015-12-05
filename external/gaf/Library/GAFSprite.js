
gaf.Sprite = gaf.Object.extend
({
    _className: "GAFSprite",

    _hasCtx: false,
    _hasFilter: false,

    ctor : function(gafSpriteProto, usedScale)
    {
        this._super(usedScale);
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },

    // Private

    _init : function()
    {
        var frame = this._gafproto.getFrame();
        cc.assert(frame instanceof cc.SpriteFrame, "Error. Wrong object type.");

        // Create sprite with custom render command from frame
        this._sprite = new cc.Sprite();
        this._sprite._renderCmd = this._gafCreateRenderCmd(this._sprite);
        this._sprite.initWithSpriteFrame(frame);

        this._sprite.setAnchorPoint(this._gafproto.getAnchor());
        this.addChild(this._sprite);
        //this._sprite.setCascadeColorEnabled(true);
        //this._sprite.setCascadeOpacityEnabled(true);
        this._sprite.setOpacityModifyRGB(true);

        if(cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            this._sprite.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    },
    
    _applyState : function(state, parent)
    {
        this._applyStateSuper(state, parent);
        if(this._needsCtx)
        {
            // Enable ctx state if wasn't enabled
            if(!this._hasCtx)
            {
                this._enableCtx();
                this._hasCtx = true;
            }
            // Set ctx shader
            this._applyCtxState(state);
        }
        else
        {
            // Disable ctx state if was enabled
            if(this._hasCtx)
            {
                this._disableCtx();
                this._hasCtx = false;
            }
            // Apply color
            if(!cc.colorEqual(this._sprite._realColor, this._cascadeColorMult))
            {
                this._sprite.setColor(this._cascadeColorMult);
            }
            // Apply opacity
            if(this._sprite.getOpacity() != this._cascadeColorMult.a)
            {
                this._sprite.setOpacity(this._cascadeColorMult.a);
            }

        }
    },

    _enableCtx: function()
    {
        this._sprite._renderCmd._enableCtx();
    },

    _disableCtx: function()
    {
        this._sprite._renderCmd._disableCtx();
    },

    _applyCtxState: function(state){
        this._sprite._renderCmd._applyCtxState(this);
    },

    getBoundingBoxForCurrentFrame: function ()
    {
        var result = this._sprite.getBoundingBox();
        return cc._rectApplyAffineTransformIn(result, this.getNodeToParentTransform());
    },

    _gafCreateRenderCmd: function(item){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new gaf.Sprite.CanvasRenderCmd(item);
        else
            return new gaf.Sprite.WebGLRenderCmd(item);
    }
});
