/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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
 * <p>NodeGrid class is a class serves as a decorator of ccsg.Node,<br/>
 * Grid node can run grid actions over all its children   (WebGL only)
 * </p>
 * @type {Class}
 *
 * @property {cc.GridBase}  grid    - Grid object that is used when applying effects
 * @property {_ccsg.Node}      target  - <@writeonly>Target
 */
cc.NodeGrid = _ccsg.Node.extend({
    grid: null,
    _target: null,
    _gridRect:null,

    ctor: function (rect) {
        _ccsg.Node.prototype.ctor.call(this);
        if(rect === undefined) rect = cc.rect();
        this._gridRect = rect;
    },
    /**
     * Gets the grid object.
     * @returns {cc.GridBase}
     */
    getGrid: function () {
        return this.grid;
    },

    /**
     * Set the grid object.
     * @param {cc.GridBase} grid
     */
    setGrid: function (grid) {
        this.grid = grid;
    },

    /**
     * @brief Set the effect grid rect.
     * @param {cc.rect} rect.
     */
    setGridRect: function (rect) {
        this._gridRect = rect;
    },
    /**
     * @brief Get the effect grid rect.
     * @return {cc.rect} rect.
    */
    getGridRect: function () {
        return this._gridRect;
    },

    /**
     * Set the target
     * @param {_ccsg.Node} target
     */
    setTarget: function (target) {
        this._target = target;
    },

    _createRenderCmd: function(){
        if (cc._renderType === cc.game.RENDER_TYPE_WEBGL)
            return new cc.NodeGrid.WebGLRenderCmd(this);
        else
            return new _ccsg.Node.CanvasRenderCmd(this);            // cc.NodeGrid doesn't support Canvas mode.
    }
});

var _p = cc.NodeGrid.prototype;
// Extended property
/** @expose */
_p.grid;
/** @expose */
_p.target;
cc.defineGetterSetter(_p, "target", null, _p.setTarget);


/**
 * Creates a NodeGrid. <br />
 * Implementation cc.NodeGrid
 * @deprecated since v3.0 please new cc.NodeGrid instead.
 * @return {cc.NodeGrid}
 */
cc.NodeGrid.create = function () {
    return new cc.NodeGrid();
};
