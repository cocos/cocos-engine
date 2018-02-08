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
require('../kazmath');
var eventManager = require('./event-manager');

var math = cc.math;

cc.game.once(cc.game.EVENT_RENDERER_INITED, function () {

    // Do nothing under other render mode
    if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL) {
        return;
    }

    /**
     * OpenGL projection protocol
     * @class
     * @extends cc._Class
     */
    cc.DirectorDelegate = cc._Class.extend(/** @lends cc.DirectorDelegate# */{
        /**
         * Called by CCDirector when the projection is updated, and "custom" projection is used
         */
        updateProjection: function () {
        }
    });

    var _p = cc.Director.prototype;

    var recursiveChild = function(node){
        if(node && node._renderCmd){
            node._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.transformDirty);
            var i, children = node._children;
            for(i=0; i<children.length; i++){
                recursiveChild(children[i]);
            }
        }
    };

    cc.Director._getInstance().on(cc.Director.EVENT_PROJECTION_CHANGED, function(){
        var stack = cc.director._scenesStack;
        for(var  i=0; i<stack.length; i++)
            recursiveChild(stack[i]);
    });

    _p.setProjection = function (projection) {
        var _t = this;
        var size = _t._winSizeInPoints;

        _t.setViewport();

        var view = _t._openGLView,
            ox = view._viewPortRect.x / view._scaleX,
            oy = view._viewPortRect.y / view._scaleY;

        switch (projection) {
            case cc.Director.PROJECTION_2D:
                math.glMatrixMode(math.KM_GL_PROJECTION);
                math.glLoadIdentity();
                var orthoMatrix = math.Matrix4.createOrthographicProjection(
                    0,
                    size.width,
                    0,
                    size.height,
                    -1024, 1024);
                math.glMultMatrix(orthoMatrix);
                math.glMatrixMode(math.KM_GL_MODELVIEW);
                math.glLoadIdentity();
                break;
            case cc.Director.PROJECTION_3D:
                var zeye = _t.getZEye();
                var matrixPerspective = new math.Matrix4(), matrixLookup = new math.Matrix4();
                math.glMatrixMode(math.KM_GL_PROJECTION);
                math.glLoadIdentity();

                // issue #1334
                matrixPerspective = math.Matrix4.createPerspectiveProjection(60, size.width / size.height, 0.1, zeye * 2);

                math.glMultMatrix(matrixPerspective);

                var eye = new math.Vec3(-ox + size.width / 2, -oy + size.height / 2, zeye);
                var center = new math.Vec3(-ox + size.width / 2, -oy + size.height / 2, 0.0);
                var up = new math.Vec3(0.0, 1.0, 0.0);
                matrixLookup.lookAt(eye, center, up);
                math.glMultMatrix(matrixLookup);

                math.glMatrixMode(math.KM_GL_MODELVIEW);
                math.glLoadIdentity();
                break;
            case cc.Director.PROJECTION_CUSTOM:
                if (_t._projectionDelegate)
                    _t._projectionDelegate.updateProjection();
                break;
            default:
                cc.logID(1201);
                break;
        }
        _t._projection = projection;
        _t.emit(cc.Director.EVENT_PROJECTION_CHANGED, _t);
        cc.gl.setProjectionMatrixDirty();
        cc.renderer.childrenOrderDirty = true;
    };

    _p.setDepthTest = function (on) {
        cc.renderer.setDepthTest(on);
    };

    _p.setClearColor = function (clearColor) {
        var locClearColor = cc.renderer._clearColor;
        locClearColor.r = clearColor.r / 255;
        locClearColor.g = clearColor.g / 255;
        locClearColor.b = clearColor.b / 255;
        locClearColor.a = clearColor.a / 255;
    };

    _p.setOpenGLView = function (openGLView) {
        var _t = this;
        // set size
        _t._winSizeInPoints.width = cc._canvas.width;      //_t._openGLView.getDesignResolutionSize();
        _t._winSizeInPoints.height = cc._canvas.height;
        _t._openGLView = openGLView || cc.view;

        // Configuration. Gather GPU info
        if (!CC_QQPLAY) {
            var conf = cc.configuration;
            conf.gatherGPUInfo();
        }

        // set size
        //_t._winSizeInPoints = _t._openGLView.getDesignResolutionSize();
        //_t._winSizeInPixels = cc.size(_t._winSizeInPoints.width * _t._contentScaleFactor, _t._winSizeInPoints.height * _t._contentScaleFactor);

        //if (_t._openGLView != openGLView) {
        // because EAGLView is not kind of CCObject

        //if (_t._openGLView)
        _t.setGLDefaultValues();

        /* if (_t._contentScaleFactor != 1) {
         _t.updateContentScaleFactor();
         }*/

        //}
        if (eventManager)
            eventManager.setEnabled(true);
    };

    _p.getVisibleSize = function () {
        //if (this._openGLView) {
        return this._openGLView.getVisibleSize();
        //} else {
        //return this.getWinSize();
        //}
    };

    _p.getVisibleOrigin = function () {
        //if (this._openGLView) {
        return this._openGLView.getVisibleOrigin();
        //} else {
        //return cc.p(0,0);
        //}
    };

    _p.getZEye = function () {
        return (this._winSizeInPoints.height / 1.1566 );
    };

    _p.setViewport = function () {
        var view = this._openGLView;
        if (view) {
            var locWinSizeInPoints = this._winSizeInPoints;
            view.setViewPortInPoints(-view._viewPortRect.x/view._scaleX, -view._viewPortRect.y/view._scaleY, locWinSizeInPoints.width, locWinSizeInPoints.height);
        }
    };

    _p.getOpenGLView = function () {
        return this._openGLView;
    };

    _p.getProjection = function () {
        return this._projection;
    };

    _p.setAlphaBlending = function (on) {
        if (on)
            cc.gl.blendFunc(cc.macro.BLEND_SRC, cc.macro.BLEND_DST);
        else
            cc.gl.blendFunc(cc.macro.ONE, cc.macro.ZERO);
        //cc.checkGLErrorDebug();
    };

    _p.setGLDefaultValues = function () {
        var _t = this;
        _t.setAlphaBlending(true);
        _t.setProjection(_t._projection);

        // set other opengl default values
        cc._renderContext.clearColor(0.0, 0.0, 0.0, 0.0);
    };
});
