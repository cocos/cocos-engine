var gaf = gaf || {};

gaf._stateHasCtx = function(state)
{
    // Check for tint color offset
    if( state.hasColorTransform &&
       (state.colorTransform.offset.r > 0 ||
        state.colorTransform.offset.g > 0 ||
        state.colorTransform.offset.b > 0 ||
        state.colorTransform.offset.a > 0)
    )
    {
        return true;
    }

    // Check for color transform filter
    if(state.hasEffect)
    {
        for(var i = 0, total = state.effect.length; i < total; ++i)
        {
            if(state.effect[i].type === gaf.EFFECT_COLOR_MATRIX)
                return true;
        }
    }
    return false;
};

gaf.Object = cc.Node.extend
({
    _asset : null,
    _className : "GAFObject",
    _id : gaf.IDNONE,
    _gafproto : null,
    _parentTimeLine : null,
    _lastVisibleInFrame : 0,
    _filterStack : null,
    _cascadeColorMult : null,
    _cascadeColorOffset : null,
    _needsCtx : false,
    _usedAtlasScale: 1,

    // Public methods
    ctor: function(scale)
    {
        if(arguments.length == 1)
        {
            this._usedAtlasScale = scale;
        }
        this._super();
        this._cascadeColorMult = cc.color(255, 255, 255, 255);
        this._cascadeColorOffset = cc.color(0, 0, 0, 0);
        this._filterStack = [];
    },

    /**
     * @method setAnimationStartedNextLoopDelegate
     * @param {function(Object)} delegate
     */
    setAnimationStartedNextLoopDelegate : function (delegate) {},

    /**
     * @method setAnimationFinishedPlayDelegate
     * @param {function(Object)} delegate
     */
    setAnimationFinishedPlayDelegate : function (delegate) {},

    /**
     * @method setLooped
     * @param {bool} looped
     */
    setLooped : function (looped) {},

    /**
     * @method getBoundingBoxForCurrentFrame
     * @return {cc.Rect}
     */
    getBoundingBoxForCurrentFrame : function () {return null;},

    /**
     * @method setFps
     * @param {uint} fps
     */
    setFps : function (fps) {},

    /**
     * @method getObjectByName
     * @param {String} name - name of the object to find
     * @return {gaf.Object}
     */
    getObjectByName : function (name) {return null;},

    /**
     * @method clearSequence
     */
    clearSequence : function () {},

    /**
     * @method getIsAnimationRunning
     * @return {bool}
     */
    getIsAnimationRunning : function () {return false;},

    /**
     * @method getSequences
     * @return [string] - list of sequences if has any
     */
    getSequences : function(){return [];},


    /**
     * @method gotoAndStop
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndStop : function (value) {},

    /**
     * @method getStartFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getStartFrame : function (frameLabel) {return gaf.IDNONE;},

    /**
     * @method setFramePlayedDelegate
     * @param {function(Object, frame)} delegate
     */
    setFramePlayedDelegate : function (delegate) {},

    /**
     * @method getCurrentFrameIndex
     * @return {uint}
     */
    getCurrentFrameIndex : function () {
        return gaf.IDNONE;
    },

    /**
     * @method getTotalFrameCount
     * @return {uint}
     */
    getTotalFrameCount : function () {return 0;},

    /**
     * @method start
     */
    start : function () {},

    /**
     * @method stop
     */
    stop : function () {},

    /**
     * @method isVisibleInCurrentFrame
     * @return {bool}
     */
    isVisibleInCurrentFrame : function ()
    {
        /*if (this._parentTimeLine &&
            ((this._parentTimeLine.getCurrentFrameIndex() + 1) != this._lastVisibleInFrame))
        {
            return false;
        }
        else
        {
            return true;
        }*/
        return !(this._parentTimeLine && ((this._parentTimeLine.getCurrentFrameIndex() + 1) != this._lastVisibleInFrame));
    },

    /**
     * @method isDone
     * @return {bool}
     */
    isDone : function () {return true;},

    /**
     * @method playSequence
     * @param {String} name - name of the sequence to play
     * @param {bool} looped - play looped
     * @param {bool} resume - whether to resume animation if stopped. True by default
     * @return {bool}
     */
    playSequence : function (name, looped, resume) {return false;},

    /**
     * @method isReversed
     * @return {bool}
     */
    isReversed : function () {return false;},

    /**
     * @method setSequenceDelegate
     * @param {function(Object, sequenceName)} delegate
     */
    setSequenceDelegate : function (delegate) {},

    /**
     * @method setFrame
     * @param {uint} index
     * @return {bool}
     */
    setFrame : function (index) {return false;},

    /**
     * @method setControlDelegate
     * @param {function} func
     */
    setControlDelegate : function (func) {},

    /**
     * @method getEndFrame
     * @param {String} frameLabel
     * @return {uint}
     */
    getEndFrame : function (frameLabel) {return gaf.IDNONE;},

    /**
     * @method pauseAnimation
     */
    pauseAnimation : function () {},

    /**
     * @method gotoAndPlay
     * @param {uint|String} value - label ot frame number
     * @return {bool}
     */
    gotoAndPlay : function (value) {},

    /**
     * @method isLooped
     * @return {bool}
     */
    isLooped : function () {return false;},

    /**
     * @method resumeAnimation
     */
    resumeAnimation : function () {},

    /**
     * @method setReversed
     * @param {bool} reversed
     */
    setReversed : function (reversed) {},

    /**
     * @method hasSequences
     * @return {bool}
     */
    hasSequences : function () {return false;},

    /**
     * @method getFps
     * @return {uint}
     */
    getFps : function () {return 60;},

    /**
     * @method setLocator
     * @param {bool} locator
     * Locator object will not draw itself, but its children will be drawn
     */
    setLocator : function (locator){},

    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._additionalTransform, affineTransform))
        {
            this.setAdditionalTransform(affineTransform);
        }
    },

    getExternalTransform : function()
    {
        return this._additionalTransform;
    },

    setAnimationRunning: function () {},

    ////////////////
    // Private
    ////////////////
    _enableTick: function(val){},

    _resetState : function()
    {},

    _updateVisibility : function(state, parent)
    {
        var alphaOffset = state.hasColorTransform ? state.colorTransform.offset.a : 0;
        this.setOpacity(state.alpha + alphaOffset);
        //return this.isVisible();
    },

    // @Override
    isVisible : function()
    {
        return this.getOpacity() > 0;
    },

    // @Override
    visit: function(parentCmd)
    {
        if(this.isVisibleInCurrentFrame())
        {
            this._super(parentCmd);
        }
    },

    _getFilters : function(){return null},

    _processAnimation : function(){},


    _applyState : function(state, parent)
    {
        this._applyStateSuper(state, parent);
    },

    _applyStateSuper : function(state, parent)
    {
        this._needsCtx = parent._needsCtx;
        this._filterStack.length = 0; // clear
        this._parentTimeLine = parent; // only gaf time line can call applyState. Assign it as parent
        if(this._usedAtlasScale != 1)
        {
            var newMat = cc.clone(state.matrix);
            newMat.tx *= this._usedAtlasScale;
            newMat.ty *= this._usedAtlasScale;
            this.setExternalTransform(newMat); // apply transformations of the state
        }
        else
        {
            this.setExternalTransform(state.matrix); // apply transformations of the state
        }
        // Cascade filters
        // TODO: apply more than one filter
        if (state.hasEffect) {
            this._filterStack = this._filterStack.concat(state.effect);
            this._needsCtx = true;
        }
        if (parent._filterStack && parent._filterStack.length > 0) {
            this._filterStack = this._filterStack.concat(parent._filterStack);
        }

        if(this._filterStack.length > 0 && this._filterStack[0].type === gaf.EFFECT_COLOR_MATRIX)
        {
            this._needsCtx = true;
        }

        // Cascade color transformations

        // If state has a tint, then we should process it
        if (state.hasColorTransform)
        {
            this._cascadeColorMult.r = state.colorTransform.mult.r * parent._cascadeColorMult.r / 255;
            this._cascadeColorMult.g = state.colorTransform.mult.g * parent._cascadeColorMult.g / 255;
            this._cascadeColorMult.b = state.colorTransform.mult.b * parent._cascadeColorMult.b / 255;
            this._cascadeColorMult.a = state.colorTransform.mult.a * parent._cascadeColorMult.a / 255;

            this._cascadeColorOffset.r = state.colorTransform.offset.r + parent._cascadeColorOffset.r;
            this._cascadeColorOffset.g = state.colorTransform.offset.g + parent._cascadeColorOffset.g;
            this._cascadeColorOffset.b = state.colorTransform.offset.b + parent._cascadeColorOffset.b;
            this._cascadeColorOffset.a = state.colorTransform.offset.a + parent._cascadeColorOffset.a;
        }
        else
        {
            this._cascadeColorMult.r = parent._cascadeColorMult.r;
            this._cascadeColorMult.g = parent._cascadeColorMult.g;
            this._cascadeColorMult.b = parent._cascadeColorMult.b;
            this._cascadeColorMult.a = state.alpha * (parent._cascadeColorMult.a / 255);

            this._cascadeColorOffset.r = parent._cascadeColorOffset.r;
            this._cascadeColorOffset.g = parent._cascadeColorOffset.g;
            this._cascadeColorOffset.b = parent._cascadeColorOffset.b;
            this._cascadeColorOffset.a = parent._cascadeColorOffset.a;
        }

        if (this._cascadeColorOffset.r > 0 ||
            this._cascadeColorOffset.g > 0 ||
            this._cascadeColorOffset.b > 0 ||
            this._cascadeColorOffset.a > 0)
        {
            this._needsCtx = true;
        }
    },

    _initRendererCmd: function()
    {
        this._renderCmd = cc.renderer.getRenderCmd(this);
        this._renderCmd._visit = this._renderCmd.visit;
        var self = this;
        this._renderCmd.visit = function(parentCmd) {
            if(self.isVisibleInCurrentFrame()){
                this._visit(parentCmd);
            }
        }
    },

    _getNode : function()
    {
        return this;
    },

    setAnchorPoint : function(point, y)
    {
        if (y === undefined)
        {
            this._super(point.x, point.y - 1);
        }
        else
        {
            this._super(point, y - 1);
        }
    }

});

gaf.Object._createNullObject = function()
{
    var ret = new gaf.Object();
    ret.isVisible = function(){return true};
    return ret;
};
