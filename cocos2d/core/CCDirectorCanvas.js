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

require('./CCDirector');
require('./CCGame');

cc.game.once(cc.game.EVENT_RENDERER_INITED, function () {

    if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
        var _p = cc.Director.prototype;

        _p.getProjection = function (projection) {
            return this._projection;
        };

        _p.setProjection = function (projection) {
            this._projection = projection;
            this.emit(cc.Director.EVENT_PROJECTION_CHANGED, this);
        };

        _p.setDepthTest = function () {
        };

        _p.setClearColor = function (clearColor) {
            cc.rendererWebGL._clearColor = clearColor;
            cc.rendererWebGL._clearFillStyle = 'rgb(' + clearColor.r + ',' + clearColor.g + ',' + clearColor.b +')' ;
        };

        _p.setOpenGLView = function (openGLView) {
            // set size
            this._winSizeInPoints.width = cc._canvas.width;      //this._openGLView.getDesignResolutionSize();
            this._winSizeInPoints.height = cc._canvas.height;
            this._openGLView = openGLView || cc.view;
            if (cc.eventManager)
                cc.eventManager.setEnabled(true);
        };

        _p.getVisibleSize = function () {
            //if (this._openGLView) {
            //return this._openGLView.getVisibleSize();
            //} else {
            return this.getWinSize();
            //}
        };

        _p.getVisibleOrigin = function () {
            //if (this._openGLView) {
            //return this._openGLView.getVisibleOrigin();
            //} else {
            return cc.p(0, 0);
            //}
        };
    }
});