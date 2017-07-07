/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

cc.rendererCanvas = {
    childrenOrderDirty: true,
    assignedZ: 0,
    assignedZStep: 1/10000,
    
    _transformNodePool: [],                              //save nodes transform dirty
    _renderCmds: [],                                     //save renderer commands

    _isCacheToCanvasOn: false,                          //a switch that whether cache the rendererCmd to cacheToCanvasCmds
    _cacheToCanvasCmds: {},                              // an array saves the renderer commands need for cache to other canvas
    _cacheInstanceIds: [],
    _currentID: 0,
    _clearColor: cc.color(),                                  //background color,default BLACK
    _clearFillStyle: "rgb(0, 0, 0)",
    _dirtyRegion: null,
    _allNeedDraw: true,
    _enableDirtyRegion: false,
    _debugDirtyRegion: false,

    //max dirty Region count, default is 10
    _dirtyRegionCountThreshold: 10,
    init: function() {
        if(cc.sys.browserType === cc.sys.BROWSER_TYPE_IE || cc.sys.browserType === cc.sys.BROWSER_TYPE_UC) {
            this.enableDirtyRegion(false);
        }
    },

    getRenderCmd: function (renderableObject) {
        //TODO Add renderCmd pool here
        return renderableObject._createRenderCmd();
    },

    enableDirtyRegion : function (enabled) {
        this._enableDirtyRegion = enabled;
    },

    isDirtyRegionEnabled: function () {
        return this._enableDirtyRegion;
    },

    setDirtyRegionCountThreshold: function(threshold) {
        this._dirtyRegionCountThreshold = threshold;
    },

    _collectDirtyRegion: function() {
        //collect dirtyList
        var locCmds = this._renderCmds, i, len;
        var dirtyRegion = this._dirtyRegion;
        var localStatus = _ccsg.Node.CanvasRenderCmd.RegionStatus;
        var dirtryRegionCount = 0;
        var result = true;
        for (i = 0, len = locCmds.length; i < len; i++) {
            var cmd = locCmds[i];
            var regionFlag  = cmd._regionFlag;
            var oldRegion = cmd._oldRegion;
            var currentRegion = cmd._currentRegion;
            if(regionFlag > localStatus.NotDirty) {
                ++dirtryRegionCount;
                if(dirtryRegionCount > this._dirtyRegionCountThreshold)
                    result = false;
                //add
                if(result) {
                    (!currentRegion.isEmpty()) && dirtyRegion.addRegion(currentRegion);
                    if(cmd._regionFlag > localStatus.Dirty) {
                        (!oldRegion.isEmpty()) && dirtyRegion.addRegion(oldRegion);
                    }
                }

                cmd._regionFlag = localStatus.NotDirty;
            }

        }

        return result;
    },

    _beginDrawDirtyRegion: function(ctxWrapper) {
        var ctx = ctxWrapper.getContext();
        var dirtyList = this._dirtyRegion.getDirtyRegions();
        ctx.save();
        //add clip
        ctxWrapper.setTransform({a:1, b:0, c:0, d:1, tx:0,ty:0}, 1, 1);

        ctx.beginPath();

        var x = 0, y = 0, width = 0, height = 0, scaleX = ctxWrapper._scaleX, scaleY = ctxWrapper._scaleY;
        for(var index = 0, count = dirtyList.length; index < count; ++index) {
            // fix dirty rectangle black border for #fireball/issues/3819
            var region = dirtyList[index];
            x = (region._minX * scaleX | 0) - 1;
            y = (-region._maxY * scaleX | 0) - 1;
            width = (region._width * scaleX | 0) + 2;
            height = (region._height * scaleY | 0) + 2;
            ctx.rect(x, y, width, height);
        }

        ctx.clip();
        //end add clip
    },

    _endDrawDirtyRegion: function(ctx) {
        ctx.restore();
    },

    _debugDrawDirtyRegion: function(ctxWrapper) {
        if(!this._debugDirtyRegion) return;
        var ctx = ctxWrapper.getContext();
        var dirtyList = this._dirtyRegion.getDirtyRegions();
        //add clip
        ctxWrapper.setTransform({a:1, b:0, c:0, d:1, tx:0,ty:0}, 1, 1);

        ctx.beginPath();

        var x = 0, y = 0, width = 0, height = 0, scaleX = ctxWrapper._scaleX, scaleY = ctxWrapper._scaleY;
        for(var index = 0, count = dirtyList.length; index < count; ++index) {
            var region = dirtyList[index];
            x = (region._minX * scaleX | 0) - 1;
            y = (-region._maxY * scaleX | 0) - 1;
            width = (region._width * scaleX | 0) + 2;
            height = (region._height * scaleY | 0) + 2;
            ctx.rect(x, y, width, height);
        }
        var oldstyle = ctx.fillStyle;
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.fillStyle = oldstyle;
        //end add clip
    },
    /**
     * drawing all renderer command to context (default is cc._renderContext)
     * @param {cc.CanvasContextWrapper} [ctx=cc._renderContext]
     */
    rendering: function (ctxWrapper) {
        var dirtyRegion = this._dirtyRegion = this._dirtyRegion || new cc.DirtyRegion();
        var viewport = cc._canvas;
        var wrapper = ctxWrapper || cc._renderContext;
        var ctx = wrapper.getContext();

        var scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        wrapper.setViewScale(scaleX,scaleY);
        wrapper.computeRealOffsetY();
        var dirtyList = this._dirtyRegion.getDirtyRegions();
        var locCmds = this._renderCmds, i, len;
        var allNeedDraw = this._allNeedDraw || !this._enableDirtyRegion;
        if(!allNeedDraw) {
            allNeedDraw = allNeedDraw || !this._collectDirtyRegion();
        }

        if(!allNeedDraw) {
            this._beginDrawDirtyRegion(wrapper);
        }

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, viewport.width, viewport.height);
        if (this._clearColor.r !== 0 ||
            this._clearColor.g !== 0 ||
            this._clearColor.b !== 0) {
            wrapper.setFillStyle(this._clearFillStyle);
            wrapper.setGlobalAlpha(this._clearColor.a);
            ctx.fillRect(0, 0, viewport.width, viewport.height);
        }

        for (i = 0, len = locCmds.length; i < len; i++) {
            var cmd = locCmds[i];
            if (!cmd._needDraw) continue;
            
            var needRendering = false;
            var cmdRegion = cmd._currentRegion;
            if (!cmdRegion || allNeedDraw) {
                needRendering = true;
            } else {
                for(var index = 0, count = dirtyList.length; index < count; ++index) {
                    if(dirtyList[index].intersects(cmdRegion)) {
                        needRendering = true;
                        break;
                    }
                }
            }
            if (needRendering) {
                cmd.rendering(wrapper, scaleX, scaleY);
            }
        }

        if (!allNeedDraw) {
            //draw debug info for dirty region if it is needed
            this._debugDrawDirtyRegion(wrapper);
            this._endDrawDirtyRegion(ctx);
        }

        dirtyRegion.clear();
        this._allNeedDraw = false;
    },

    /**
     * drawing all renderer command to cache canvas' context
     * @param {cc.CanvasContextWrapper} ctx
     * @param {Number} [instanceID]
     * @param {Number} [scaleX]
     * @param {Number} [scaleY]
     */
    _renderingToCacheCanvas: function (ctx, instanceID, scaleX, scaleY) {
        if (!ctx)
            cc.logID(7600);
        scaleX = scaleX === undefined ? 1 : scaleX;
        scaleY = scaleY === undefined ? 1 : scaleY;
        instanceID = instanceID || this._currentID;
        var locCmds = this._cacheToCanvasCmds[instanceID], i, len;
        ctx.computeRealOffsetY();
        for (i = 0, len = locCmds.length; i < len; i++) {
            locCmds[i].rendering(ctx, scaleX, scaleY);
        }
        this._removeCache(instanceID);

        var locIDs = this._cacheInstanceIds;
        if (locIDs.length === 0)
            this._isCacheToCanvasOn = false;
        else
            this._currentID = locIDs[locIDs.length - 1];
    },

    _turnToCacheMode: function (renderTextureID) {
        this._isCacheToCanvasOn = true;
        renderTextureID = renderTextureID || 0;
        this._cacheToCanvasCmds[renderTextureID] = [];
        if(this._cacheInstanceIds.indexOf(renderTextureID) === -1)
            this._cacheInstanceIds.push(renderTextureID);
        this._currentID = renderTextureID;
    },

    _turnToNormalMode: function () {
        this._isCacheToCanvasOn = false;
    },

    _removeCache: function (instanceID) {
        instanceID = instanceID || this._currentID;
        var cmds = this._cacheToCanvasCmds[instanceID];
        if (cmds) {
            cmds.length = 0;
            delete this._cacheToCanvasCmds[instanceID];
        }

        var locIDs = this._cacheInstanceIds;
        cc.js.array.remove(locIDs, instanceID);
    },

    resetFlag: function () {
        this.childrenOrderDirty = false;
        this._transformNodePool.length = 0;
    },

    transform: function () {
        var locPool = this._transformNodePool;
        //sort the pool
        locPool.sort(this._sortNodeByLevelAsc);

        //transform node
        for (var i = 0, len = locPool.length; i < len; i++) {
            locPool[i].updateStatus();
        }
        locPool.length = 0;
    },

    transformDirty: function () {
        return this._transformNodePool.length > 0;
    },

    _sortNodeByLevelAsc: function (n1, n2) {
        return n1._curLevel - n2._curLevel;
    },

    pushDirtyNode: function (node) {
        this._transformNodePool.push(node);
    },

    clear: function () {
    },

    clearRenderCommands: function () {
        this._renderCmds.length = 0;
        this._cacheInstanceIds.length = 0;
        this._isCacheToCanvasOn = false;
        this._allNeedDraw = true;
    },

    pushRenderCommand: function (cmd) {
        if(!cmd.rendering)
            return;
        if (this._isCacheToCanvasOn) {
            var currentId = this._currentID, locCmdBuffer = this._cacheToCanvasCmds;
            var cmdList = locCmdBuffer[currentId];
            if (cmdList.indexOf(cmd) === -1)
                cmdList.push(cmd);
        } else {
            if (this._renderCmds.indexOf(cmd) === -1)
                this._renderCmds.push(cmd);
        }
    }
};

(function () {
    cc.CanvasContextWrapper = function (context) {
        this._context = context;

        this._saveCount = 0;
        this._currentAlpha = context.globalAlpha;
        this._currentCompositeOperation = context.globalCompositeOperation;
        this._currentFillStyle = context.fillStyle;
        this._currentStrokeStyle = context.strokeStyle;

        this._offsetX = 0;
        this._offsetY = 0;
        this._realOffsetY = this.height;
        this._armatureMode = 0;
    };

    var proto = cc.CanvasContextWrapper.prototype;

    proto.resetCache = function(){
        var context = this._context;
        //call it after resize cc._canvas, because context will reset.
        this._currentAlpha = context.globalAlpha;
        this._currentCompositeOperation = context.globalCompositeOperation;
        this._currentFillStyle = context.fillStyle;
        this._currentStrokeStyle = context.strokeStyle;
        this._realOffsetY = this._context.canvas.height + this._offsetY;
    };

    proto.setOffset = function(x, y){
        this._offsetX = x;
        this._offsetY = y;
        this._realOffsetY = this._context.canvas.height + this._offsetY;
    };

    proto.computeRealOffsetY = function(){
        this._realOffsetY = this._context.canvas.height + this._offsetY;
    };

    proto.setViewScale = function(scaleX, scaleY){
        //call it at cc.renderCanvas.rendering
        this._scaleX = scaleX;
        this._scaleY = scaleY;
    };

    proto.getContext = function(){
        return this._context;
    };

    proto.save = function () {
        this._context.save();
        this._saveCount++;
    };

    proto.restore = function () {
        this._context.restore();
        this._currentAlpha = this._context.globalAlpha;
        this._saveCount--;
    };

    proto.setGlobalAlpha = function (alpha) {
        if (this._saveCount > 0) {
            this._context.globalAlpha = alpha;
        } else {
            if (this._currentAlpha !== alpha) {
                this._currentAlpha = alpha;
                this._context.globalAlpha = alpha;
            }
        }
    };

    proto.setCompositeOperation = function(compositionOperation){
        if (this._saveCount > 0) {
            this._context.globalCompositeOperation = compositionOperation;
        } else {
            if (this._currentCompositeOperation !== compositionOperation) {
                this._currentCompositeOperation = compositionOperation;
                this._context.globalCompositeOperation = compositionOperation;
            }
        }
    };

    proto.setFillStyle = function(fillStyle){
        this._context.fillStyle = fillStyle;
    };

    proto.setStrokeStyle = function(strokeStyle){
        if (this._saveCount > 0) {
            this._context.strokeStyle = strokeStyle;
        } else {
            if (this._currentStrokeStyle !== strokeStyle) {
                this._currentStrokeStyle = strokeStyle;
                this._context.strokeStyle = strokeStyle;
            }
        }
    };

    proto.setTransform = function(t, scaleX, scaleY){
        if (this._armatureMode > 0) {
            //ugly for armature
            this.restore();
            this.save();
            this._context.transform(t.a, -t.b, -t.c, t.d, t.tx * scaleX, -(t.ty * scaleY));
        } else {
            this._context.setTransform(t.a * scaleX, -t.b * scaleY, -t.c * scaleX, t.d * scaleY, this._offsetX + t.tx * scaleX, this._realOffsetY - (t.ty * scaleY));
        }
    };

    proto._switchToArmatureMode = function(enable, t, scaleX, scaleY){
        if(enable){
            this._armatureMode++;
            this._context.setTransform(t.a, t.c, t.b, t.d, this._offsetX + t.tx * scaleX, this._realOffsetY - (t.ty * scaleY));
            this.save();
        }else{
            this._armatureMode--;
            this.restore();
        }
    };
})();

