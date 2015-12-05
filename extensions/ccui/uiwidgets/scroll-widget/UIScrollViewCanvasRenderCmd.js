(function(){
    if(!ccui.ProtectedNode.CanvasRenderCmd)
        return;
    ccui.ScrollView.CanvasRenderCmd = function(renderable){
        ccui.Layout.CanvasRenderCmd.call(this, renderable);
        this._needDraw = true;
        this._dirty = false;
    };

    var proto = ccui.ScrollView.CanvasRenderCmd.prototype = Object.create(ccui.Layout.CanvasRenderCmd.prototype);
    proto.constructor = ccui.ScrollView.CanvasRenderCmd;

    proto.visit = function(parentCmd) {
        var node = this._node;
        if (!node._visible)
            return;
        cc.renderer.pushRenderCommand(this);
        var currentID = node.__instanceId;
        cc.renderer._turnToCacheMode(currentID);

        ccui.Layout.CanvasRenderCmd.prototype.visit.call(this, parentCmd);
        this._dirtyFlag = 0;
        cc.renderer._turnToNormalMode();
    };

    proto.rendering = function (ctx) {
        var currentID = this._node.__instanceId;
        var locCmds = cc.renderer._cacheToCanvasCmds[currentID], i, len,
            scaleX = cc.view.getScaleX(),
            scaleY = cc.view.getScaleY();
        var context = ctx || cc._renderContext;
        context.computeRealOffsetY();
        
        for (i = 0, len = locCmds.length; i < len; i++) {
            var checkNode = locCmds[i]._node;
            if(checkNode instanceof ccui.ScrollView)
                continue;
            if(checkNode && checkNode._parent && checkNode._parent._inViewRect === false)
                continue;
            locCmds[i].rendering(context, scaleX, scaleY);
        }
    };
})();