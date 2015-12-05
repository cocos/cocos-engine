
gaf.CGAffineTransformCocosFormatFromFlashFormat = function(transform)
{
    var t = {};
    t.a = transform.a;
    t.b = -transform.b;
    t.c = -transform.c;
    t.d = transform.d;
    t.tx = transform.tx;
    t.ty = -transform.ty;
    return t;
};

gaf._AssetPreload = function()
{
    this["0"] = this.End;
    this["1"] = this.Atlases;
    this["2"] = this.AnimationMasks;
    this["3"] = this.AnimationObjects;
    this["4"] = this.AnimationFrames;
    this["5"] = this.NamedParts;
    this["6"] = this.Sequences;
    this["7"] = this.TextFields;
    this["8"] = this.Atlases; // 2
    this["9"] = this.Stage;
    this["10"] = this.AnimationObjects; //2
    this["11"] = this.AnimationMasks; // 2
    this["12"] = this.AnimationFrames; // 2
    this["13"] = this.TimeLine;
};

gaf._AssetPreload.prototype.End = function(asset, content, timeLine){
    if(timeLine)
    {
        timeLine.getFps = function()
        {
            return asset.getSceneFps();
        };
    }
};

gaf._AssetPreload.prototype.Tag = function(asset, tag, timeLine)
{
    (this[tag.tagId]).call(this, asset, tag.content, timeLine);
};

gaf._AssetPreload.prototype.Tags = function(asset, tags, timeLine)
{
    var self = this;
    tags.forEach(function(tag)
    {
        self.Tag(asset, tag, timeLine);
    });
};

gaf._AssetPreload.prototype.AtlasCreateFrames = function(elements, asset, spriteFrames)
{
    elements.forEach(function (item) {
        var texture = asset._atlases[item.atlasId];
        var rect = cc.rect(item.origin.x, item.origin.y, item.size.x, item.size.y);
        var frame = new cc.SpriteFrame(texture, rect);
        frame._gafAnchor =
        {
            x: (0 - (0 - (item.pivot.x / item.size.x))),
            y: (0 + (1 - (item.pivot.y / item.size.y)))
        };
        spriteFrames[item.elementAtlasId] = frame;
        // 9 grid
    });
};



gaf._AssetPreload.prototype.Atlases = function(asset, content, timeLine)
{
    var spriteFrames = asset._atlasScales[content.scale] = asset._atlasScales[content.scale] || [];
    var csf = cc.Director._getInstance().getContentScaleFactor();

    content.atlases.forEach(function(item)
    {
        var atlasId = item.id;
        var finalizeLoading = function()
        {
            gaf._AssetPreload.AtlasCreateFrames(content.elements, asset, spriteFrames);
        };

        var atlasPath = "";
        item.sources.forEach(function(atlasSource)
        {
            if(atlasSource.csf === csf)
            {
                atlasPath = atlasSource.source;
            }
        });
        cc.assert(atlasPath, "GAF Error. Texture for current CSF not found. Reconvert animation with correct parameters.");

        if(asset._textureLoadDelegate)
        {
            atlasPath = asset._textureLoadDelegate(atlasPath);
        }

        var loaded = false;
        var paths = asset._getSearchPaths(atlasPath);
        for(var i = 0, len = paths.length; i < len; ++i){
            var path = paths[i];
            var atlas = cc.textureCache.getTextureForKey(path);
            if(atlas && atlas.isLoaded())
            {
                atlas.handleLoadedTexture(true);
                loaded = true;
                asset._atlases[atlasId] = atlas;
                finalizeLoading();
                break;
            }
        }
        // Need to load atlases async
        if(!loaded)
        {
            var success = function (atlas) {
                atlas.handleLoadedTexture(true);
                asset._onAtlasLoaded(atlasId, atlas);
            };

            var fail = function () {
                cc.log("GAF Error. Couldn't find `" + atlasPath + "` required by `" + asset.getGAFFileName() + "`");
            };

            if(!asset._atlasesToLoad.hasOwnProperty(atlasId))
            {
                gaf._AtlasLoader.loadArray(paths, success, fail);
                asset._atlasesToLoad[atlasId] = {};
            }
            asset._onLoadTasks.push(finalizeLoading);
        }
    });
};

gaf._AssetPreload.prototype.AnimationObjects = function(asset, content, timeLine)
{
    content.forEach(function(item)
    {
        item.type = (item.type === undefined) ? gaf.TYPE_TEXTURE : item.type;
        timeLine._objects.push(item.objectId);
        asset._objects[item.objectId] = item;
    });
};

gaf._AssetPreload.prototype.convertTint = function(mat, alpha)
{
    if(!mat)
        return null;
    return {
        mult:
        {
            r: mat.redMultiplier * 255,
            g: mat.greenMultiplier * 255,
            b: mat.blueMultiplier * 255,
            a: alpha * 255
        },
        offset:
        {
            r: mat.redOffset * 255,
            g: mat.greenOffset * 255,
            b: mat.blueOffset * 255,
            a: mat.alphaOffset * 255
        }
    };
};

gaf._AssetPreload.prototype.convertState = function(state)
{
    return {
        hasColorTransform: state.hasColorTransform,
        hasMask: state.hasMask,
        hasEffect: state.hasEffect,
        objectIdRef: state.objectIdRef,
        depth: state.depth,
        alpha: state.alpha * 255,
        matrix: gaf.CGAffineTransformCocosFormatFromFlashFormat(state.matrix),
        colorTransform: this.convertTint(state.colorTransform, state.alpha),
        effect: state.effect,
        maskObjectIdRef: state.maskObjectIdRef
    };
};

gaf._AssetPreload.prototype.AnimationFrames = function(asset, content, timeLine)
{
    var self = this;
    cc.assert(timeLine, "Error. Time Line should not be null.");
    var statesForId = {};
    var frames = [];
    var lastFrame = {};
    for(var i = 0, len = content.length; i < len; ++i)
    {
        var frame = content[i];
        if(frame.state)
        {
            frame.state.forEach(function (state)
            {
                if (state.alpha !== 0)
                {
                    statesForId[state.objectIdRef] = self.convertState(state);
                }
                else
                {
                    statesForId[state.objectIdRef] = null;
                }
            });
        }
        var stateArray = [];
        for(var obj in statesForId){ if(statesForId.hasOwnProperty(obj) && statesForId[obj])
        {
            stateArray.push(statesForId[obj]);
        }}
        lastFrame = frame;
        frames[frame.frame - 1] = {states: stateArray, actions: frame.actions || null};
    }
    timeLine.getFrames = function(){return frames};
};

gaf._AssetPreload.prototype.NamedParts = function(asset, content, timeLine)
{
    var parts = {};
    content.forEach(function(item)
    {
        parts[item.name] = item.objectId;
    });
    timeLine.getNamedParts = function(){return parts};
};

gaf._AssetPreload.prototype.Sequences = function(asset, content, timeLine)
{
    var sequences = {};
    content.forEach(function(item){
        sequences[item.id] = {start: item.start - 1, end: item.end};
    });
    timeLine.getSequences = function(){return sequences};
};

gaf._AssetPreload.prototype.TextFields = function(asset, content, timeLine)
{
    debugger;
};

gaf._AssetPreload.prototype.Stage = function(asset, content, timeLine)
{
    asset._sceneFps = content.fps;
    asset._sceneColor = content.color;
    asset._sceneWidth = content.width;
    asset._sceneHeight = content.height;
};

gaf._AssetPreload.prototype.AnimationMasks = function(asset, content, timeLine)
{
    content.forEach(function(item)
    {
        item.type = (item.type === undefined) ? gaf.TYPE_TEXTURE : item.type;
        timeLine._objects.push(item.objectId);
        asset._masks[item.objectId] = item;
    });
};

gaf._AssetPreload.prototype.TimeLine = function(asset, content, timeLine)
{
    var result = new gaf._TimeLineProto(asset, content.animationFrameCount, content.boundingBox, content.pivotPoint, content.id, content.linkageName);
    asset._pushTimeLine(result);
    this.Tags(asset, content.tags, result);
};

gaf._AssetPreload = new gaf._AssetPreload();
