
gaf._SpriteProto = function(asset, atlasFrames, elementAtlasIdRef)
{
    //this._anchor = atlasFrame._gafAnchor;
    //delete atlasFrame._gafAnchor;

    this.getFrames = function(){return atlasFrames};
    this.getIdRef = function(){return elementAtlasIdRef};
    //this.getAnchor = function() {return this._anchor};
    this.getAsset = function() {return asset};

    /*
     * Will construct GAFSprite
     */
    this._gafConstruct = function()
    {
        var usedScale = this.getAsset()._usedAtlasScale;
        var ret = new gaf.Sprite(this, usedScale);
        ret._init();
        return ret;
    };
};

gaf._SpriteProto.prototype.getFrame = function()
{
    var usedScale = this.getAsset()._usedAtlasScale;
    cc.assert(usedScale, "Error. Atlas scale zero.");
    var frames = this.getFrames()[usedScale];
    cc.assert(frames, "Error. No frames found for used scale `"+usedScale+"`");
    return frames[this.getIdRef()];
};

gaf._SpriteProto.prototype.getAnchor = function()
{
    return this.getFrame()._gafAnchor;
};
