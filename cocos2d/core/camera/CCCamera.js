/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

const AffineTrans = require('../utils/affine-transform');
const renderEngine = require('../renderer/render-engine');
const renderer = require('../renderer/index');

const mat4 = cc.vmath.mat4;
const vec2 = cc.vmath.vec2;
const vec3 = cc.vmath.vec3;

let _mat4_temp_1 = mat4.create();
let _mat4_temp_2 = mat4.create();
let _vec3_temp_1 = vec3.create();
let _vec3_temp_2 = vec3.create();

let _cameras = [];

/**
 * !#en Values for Camera.clearFlags, determining what to clear when rendering a Camera.
 * !#zh 摄像机清除标记位，决定摄像机渲染时会清除哪些状态
 * @enum Camera.ClearFlags
 */
let ClearFlags = cc.Enum({
    COLOR: 1,
    DEPTH: 2,
    STENCIL: 4,
});

/**
 * !#en
 * Camera is usefull when making reel game or other games which need scroll screen.
 * Using camera will be more efficient than moving node to scroll screen.
 * Camera 
 * !#zh
 * 摄像机在制作卷轴或是其他需要移动屏幕的游戏时比较有用，使用摄像机将会比移动节点来移动屏幕更加高效。
 * @class Camera
 * @extends Component
 */
let Camera = cc.Class({
    name: 'cc.Camera',
    extends: cc.Component,
    
    ctor () {
        let camera = new renderEngine.Camera();

        camera.setStages([
            'transparent'
        ]);

        this._fov = Math.PI * 60 / 180;
        camera.setFov(this._fov);
        camera.setNear(0.1);
        camera.setFar(1024);

        let view = new renderEngine.View();
        camera.view = view;
        camera.dirty = true;

        this._matrixDirty = true;

        this._camera = camera;
    },

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/Camera',
        inspector: 'packages://inspector/inspectors/comps/camera.js',
        executeInEditMode: false
    },

    properties: {
        _cullingMask: 0xffffffff,
        _clearFlags: 0,
        _backgroundColor: cc.color(51, 77, 120, 255),
        _depth: 0,
        _zoomRatio: 1,

        /**
         * !#en
         * The camera zoom ratio.
         * !#zh
         * 摄像机缩放比率
         * @property {Number} zoomRatio
         */
        zoomRatio: {
            get () {
                return this._zoomRatio;
            },
            set (value) {
                this._zoomRatio = value;
                this._matrixDirty = true;
            }
        },

        /**
         * !#en
         * This is used to render parts of the scene selectively.
         * !#zh
         * 决定摄像机会渲染场景的哪一部分。
         * @property {Number} cullingMask
         */
        cullingMask: {
            get () {
                return this._cullingMask;
            },
            set (value) {
                this._cullingMask = value;
                this._updateCameraMask();
            }
        },

        /**
         * !#en
         * Determining what to clear when camera rendering.
         * !#zh
         * 决定摄像机渲染时会清除哪些状态。
         * @property {Number} clearFlags
         */
        clearFlags: {
            get () {
                return this._clearFlags;
            },
            set (value) {
                this._clearFlags = value;
                this._camera.setClearFlags(value);
            }
        },

        /**
         * !#en
         * The color with which the screen will be cleared.
         * !#zh
         * 摄像机用于清除屏幕的背景色。
         */
        backgroundColor: {
            get () {
                return this._backgroundColor;
            },
            set (value) {
                this._backgroundColor = value;
                this._updateBackgroundColor();
            }
        },

        /**
         * !#en
         * Camera's depth in the camera rendering order.
         * !#zh
         * 摄像机深度，用于决定摄像机的渲染顺序。
         */
        depth: {
            get () {
                return this._depth;
            },
            set (value) {
                this._depth = value;
                this._camera.setDepth(value);
            }
        }
    },

    statics: {
        /**
         * !#en
         * The first enabled camera.
         * !#zh
         * 第一个被激活的摄像机。
         * @property {Camera} main
         * @static
         */
        main: null,

        /**
         * !#en
         * All enabled cameras.
         * !#zh
         * 激活的所有摄像机。
         * @property {[Camera]} cameras
         * @static
         */
        cameras: _cameras,

        ClearFlags: ClearFlags,

        /**
         * !#en
         * Get the first camera which the node belong to.
         * !#zh
         * 获取节点所在的第一个摄像机。
         * @method findCamera
         * @param {Node} node 
         * @return {Camera}
         * @static
         */
        findCamera (node) {
            for (let i = 0, l = _cameras.length; i < l; i++) {
                let camera = _cameras[i];
                if (camera.containsNode(node)) {
                    return camera;
                }
            }

            return null;
        }
    },

    _updateCameraMask () {
        this._camera._cullingMask = this._cullingMask;
        this._camera.view._cullingMask = this._cullingMask;
    },

    _updateBackgroundColor () {
        let color = this._backgroundColor;
        this._camera.setColor(
            color.r / 255,
            color.g / 255,
            color.b / 255,
            color.a / 255,
        );
    },

    _onMatrixDirty () {
        this._matrixDirty = true;
    },

    onLoad () {
        this._camera.setNode(this.node);
        this._camera.setClearFlags(this._clearFlags);
        this._camera.setDepth(this._depth);
        this._updateBackgroundColor();
        this._updateCameraMask();
    },

    onEnable () {
        this.node.on('world-matrix-changed', this._onMatrixDirty, this);

        this._matrixDirty = true;
        renderer.scene.addCamera(this._camera);
        _cameras.push(this);
    },

    onDisable () {
        this.node.off('world-matrix-changed', this._onMatrixDirty, this);

        renderer.scene.removeCamera(this._camera);
        cc.js.array.remove(_cameras, this);
    },

    /**
     * !#en
     * Returns the matrix that transform the node's (local) space coordinates into the camera's space coordinates.
     * !#zh
     * 返回一个将节点坐标系转换到摄像机坐标系下的矩阵
     * @method getNodeToCameraTransform
     * @param {Node} node - the node which should transform
     * @return {AffineTransform}
     */
    getNodeToCameraTransform (node) {
        let out = AffineTrans.identity();
        node.getWorldMatrix(_mat4_temp_2);
        if (this.containsNode(node)) {
            this.getWorldToCameraMatrix(_mat4_temp_1);
            mat4.mul(_mat4_temp_2, _mat4_temp_2, _mat4_temp_1);
        }
        AffineTrans.fromMat4(out, _mat4_temp_2);
        return out;
    },

    /**
     * !#en
     * Conver a camera coordinates point to world coordinates.
     * !#zh
     * 将一个摄像机坐标系下的点转换到世界坐标系下。
     * @method getCameraToWorldPoint
     * @param {Vec2} point - the point which should transform
     * @param {Vec2} out - the point to receive the result
     * @return {Vec2}
     */
    getCameraToWorldPoint (point, out) {
        out = out || cc.v2();
        this.getCameraToWorldMatrix(_mat4_temp_1);
        vec2.transformMat4(out, point, _mat4_temp_1);
        return out;
    },

    /**
     * !#en
     * Conver a world coordinates point to camera coordinates.
     * !#zh
     * 将一个世界坐标系下的点转换到摄像机坐标系下。
     * @param {Vec2} point 
     * @param {Vec2} out - the point to receive the result
     * @return {Vec2}
     */
    getWorldToCameraPoint (point, out) {
        out = out || cc.v2();
        this.getWorldToCameraMatrix(_mat4_temp_1);
        vec2.transformMat4(out, point, _mat4_temp_1);
        return out;
    },

    /**
     * !#en
     * Get the camera to world matrix
     * !#zh
     * 获取摄像机坐标系到世界坐标系的矩阵
     * @param {Mat4} out - the matrix to receive the result
     * @return {Mat4}
     */
    getCameraToWorldMatrix (out) {
        this.getWorldToCameraMatrix(out);
        mat4.invert(out, out);
        return out;
    },


    /**
     * !#en
     * Get the world to camera matrix
     * !#zh
     * 获取世界坐标系到摄像机坐标系的矩阵
     * @param {Mat4} out - the matrix to receive the result
     * @return {Mat4}
     */
    getWorldToCameraMatrix (out) {
        this.node.getWorldRT(_mat4_temp_1);

        let zoomRatio = this.zoomRatio;
        _mat4_temp_1.m00 *= zoomRatio;
        _mat4_temp_1.m01 *= zoomRatio;
        _mat4_temp_1.m04 *= zoomRatio;
        _mat4_temp_1.m05 *= zoomRatio;

        let m12 = _mat4_temp_1.m12;
        let m13 = _mat4_temp_1.m13;

        let center = cc.visibleRect.center;
        _mat4_temp_1.m12 = center.x - (_mat4_temp_1.m00 * m12 + _mat4_temp_1.m04 * m13);
        _mat4_temp_1.m13 = center.y - (_mat4_temp_1.m01 * m12 + _mat4_temp_1.m05 * m13);

        if (out !== _mat4_temp_1) {
            mat4.copy(out, _mat4_temp_1);
        }
        return out;
    },

    /**
     * !#en
     * Check whether the node is in the camera.
     * !#zh
     * 检测节点是否被此摄像机影响
     * @method containsNode
     * @param {Node} node - the node which need to check
     * @return {Boolean}
     */
    containsNode (node) {
        return node._cullingMask === this.cullingMask;
    },

    lateUpdate: !CC_EDITOR && function () {
        let node = this.node;
        node.getWorldMatrix(_mat4_temp_1);
        
        if (!this._matrixDirty) return;
        
        let camera = this._camera;
        let fov = Math.atan(Math.tan(this._fov/2) / this.zoomRatio)*2;
        camera.setFov(fov);

        _vec3_temp_1.x = _mat4_temp_1.m12;
        _vec3_temp_1.y = _mat4_temp_1.m13;
        _vec3_temp_1.z = 0;

        node.z = cc.visibleRect.height / 1.1566;
        node.lookAt(_vec3_temp_1);

        this._matrixDirty = false;
        camera.dirty = true;
    }
});

module.exports = cc.Camera = Camera;
