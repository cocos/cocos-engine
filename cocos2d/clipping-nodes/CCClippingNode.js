/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2012 Pierre-David Bélanger

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
 * <p>
 *     cc.ClippingNode is a subclass of ccsg.Node.                                                            <br/>
 *     It draws its content (children) clipped using a stencil.                                               <br/>
 *     The stencil is an other ccsg.Node that will not be drawn.                                               <br/>
 *     The clipping is done using the alpha part of the stencil (adjusted with an alphaThreshold).
 * </p>
 * @class
 * @extends _ccsg.Node
 * @param {_ccsg.Node} [stencil=null]
 *
 * @property {Number}   alphaThreshold  - Threshold for alpha value.
 * @property {Boolean}  inverted        - Indicate whether in inverted mode.
 * @property {_ccsg.Node}  stencil         - he ccsg.Node to use as a stencil to do the clipping.
 */
cc.ClippingNode = _ccsg.Node.extend(/** @lends cc.ClippingNode# */{
    inverted: false,
    _alphaThreshold: 0,

    _stencil: null,
    _className: "ClippingNode",

    _originStencilProgram: null,

    /**
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
     * @param {_ccsg.Node} [stencil=null]
     */
    ctor: function (stencil) {
        stencil = stencil || null;
        _ccsg.Node.prototype.ctor.call(this);
        this._stencil = stencil;
        if (stencil) {
            this._originStencilProgram = stencil.getShaderProgram();
        }
        this.alphaThreshold = 1;
        this.inverted = false;
        this._renderCmd.initStencilBits();
    },

    /**
     * <p>
     *     Event callback that is invoked every time when node enters the 'stage'.                                   <br/>
     *     If the CCNode enters the 'stage' with a transition, this event is called when the transition starts.        <br/>
     *     During onEnter you can't access a "sister/brother" node.                                                    <br/>
     *     If you override onEnter, you must call its parent's onEnter function with this._super().
     * </p>
     * @function
     */
    onEnter: function () {
        _ccsg.Node.prototype.onEnter.call(this);
        if (this._stencil)
            this._stencil.performRecursive(_ccsg.Node.performType.onEnter);
    },

    /**
     * <p>
     *     Event callback that is invoked when the node enters in the 'stage'.                                                        <br/>
     *     If the node enters the 'stage' with a transition, this event is called when the transition finishes.                       <br/>
     *     If you override onEnterTransitionDidFinish, you shall call its parent's onEnterTransitionDidFinish with this._super()
     * </p>
     * @function
     */
    onEnterTransitionDidFinish: function () {
        _ccsg.Node.prototype.onEnterTransitionDidFinish.call(this);
        if (this._stencil)
            this._stencil.performRecursive(_ccsg.Node.performType.onEnterTransitionDidFinish);
    },

    /**
     * <p>
     *     callback that is called every time the node leaves the 'stage'.  <br/>
     *     If the node leaves the 'stage' with a transition, this callback is called when the transition starts. <br/>
     *     If you override onExitTransitionDidStart, you shall call its parent's onExitTransitionDidStart with this._super()
     * </p>
     * @function
     */
    onExitTransitionDidStart: function () {
        if (this._stencil) {
            this._stencil.performRecursive(_ccsg.Node.performType.onExitTransitionDidStart);
        }
        _ccsg.Node.prototype.onExitTransitionDidStart.call(this);
    },

    /**
     * <p>
     * callback that is called every time the node leaves the 'stage'. <br/>
     * If the node leaves the 'stage' with a transition, this callback is called when the transition finishes. <br/>
     * During onExit you can't access a sibling node.                                                             <br/>
     * If you override onExit, you shall call its parent's onExit with this._super().
     * </p>
     * @function
     */
    onExit: function () {
        if (this._stencil) {
            this._stencil.performRecursive(_ccsg.Node.performType.onExit);
        }
        _ccsg.Node.prototype.onExit.call(this);
    },

    visit: function (parent) {
        this._renderCmd.clippingVisit(parent && parent._renderCmd);
    },

    _visitChildren: function () {
        if (this._reorderChildDirty) {
            this.sortAllChildren();
        }
        var children = this._children, child;
        for (var i = 0, len = children.length; i < len; i++) {
            child = children[i];
            if (child && child._visible) {
                child.visit(this);
            }
        }
        this._renderCmd._dirtyFlag = 0;
    },

    /**
     * <p>
     * The alpha threshold.                                                                                   <br/>
     * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold.     <br/>
     * Should be a float between 0 and 1.                                                                     <br/>
     * This default to 1 (so alpha test is disabled).
     * </P>
     * @return {Number}
     */
    getAlphaThreshold: function () {
        return this._alphaThreshold;
    },

    /**
     * set alpha threshold.
     * @param {Number} alphaThreshold
     */
    setAlphaThreshold: function (alphaThreshold) {
        if (alphaThreshold === 1 && alphaThreshold !== this._alphaThreshold) {
            // should reset program used by _stencil
            this._renderCmd.resetProgramByStencil();
        }
        this._alphaThreshold = alphaThreshold;
    },

    /**
     * <p>
     *     Inverted. If this is set to YES,                                                                 <br/>
     *     the stencil is inverted, so the content is drawn where the stencil is NOT drawn.                 <br/>
     *     This default to NO.
     * </p>
     * @return {Boolean}
     */
    isInverted: function () {
        return this.inverted;
    },

    /**
     * set whether or not invert of stencil
     * @param {Boolean} inverted
     */
    setInverted: function (inverted) {
        this.inverted = inverted;
    },

    /**
     * The ccsg.Node to use as a stencil to do the clipping.                                   <br/>
     * The stencil node will be retained. This default to nil.
     * @return {_ccsg.Node}
     */
    getStencil: function () {
        return this._stencil;
    },

    /**
     * Set stencil.
     * @function
     * @param {_ccsg.Node} stencil
     */
    setStencil: function (stencil) {
        if(this._stencil === stencil)
            return;

        if (stencil)
            this._originStencilProgram = stencil.getShaderProgram();

        this._renderCmd.setStencil(stencil);
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.ClippingNode.CanvasRenderCmd(this);
        else
            return new cc.ClippingNode.WebGLRenderCmd(this);
    }
});

cc.ClippingNode.stencilBits = -1;

var _p = cc.ClippingNode.prototype;

// Extended properties
cc.defineGetterSetter(_p, "stencil", _p.getStencil, _p.setStencil);
cc.defineGetterSetter(_p, "alphaThreshold", _p.getAlphaThreshold, _p.setAlphaThreshold);
