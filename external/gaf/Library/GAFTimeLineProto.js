
gaf._TimeLineProto = function(asset, animationFrameCount, boundingBox, pivotPoint, id, linkageName)
{
    id = typeof id != 'undefined' ? id : 0;
    linkageName = linkageName || "";

    this._objects = [];

    this.getTotalFrames = function(){return animationFrameCount};
    this.getBoundingBox = function() {return boundingBox};
    this.getId = function() {return id};
    this.getLinkageName = function() {return linkageName};
    this.getPivot = function(){return pivotPoint};
    this.getRect = function(){return boundingBox};
    this.getNamedParts = function() {return {}}; // Map name -> id
    this.getSequences = function() {return {}}; // Map name -> {start, end}
    this.getFrames = function(){return []}; // Array {states, actions}
    this.getFps = function(){return 60};
    this.getObjects = function(){return this._objects};
    this.getAsset = function(){return asset};

    /*
     * Will construct GAFTimeLine
     */
    this._gafConstruct = function()
    {
        var usedScale = this.getAsset()._usedAtlasScale;
        var ret = new gaf.TimeLine(this, usedScale);
        ret._init();
        return ret;
    };
};
