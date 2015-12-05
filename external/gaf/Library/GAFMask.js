
gaf.Mask = gaf.Object.extend
({
    _className: "GAFMask",
    _clippingNode: null,

    ctor : function(gafSpriteProto)
    {
        this._super();
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },

    _init : function()
    {
        var maskNodeProto = this._gafproto.getMaskNodeProto();
        cc.assert(maskNodeProto, "Error. Mask node for id ref " + this._gafproto.getIdRef() + " not found.");
        this._maskNode = maskNodeProto._gafConstruct();
            this._clippingNode = cc.ClippingNode.create(this._maskNode);
        this._clippingNode.setAlphaThreshold(0.5);
        this.addChild(this._clippingNode);
    },

    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._maskNode._additionalTransform, affineTransform))
        {
            this._maskNode.setAdditionalTransform(affineTransform);
        }
    },

    _getNode : function()
    {
        return this._clippingNode;
    }
});