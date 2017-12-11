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

const RenderComponent = require('../core/components/CCRenderComponent');
const renderer = require('../core/renderer');
const renderEngine = require('../core/renderer/render-engine');
const SpriteMaterial = renderEngine.SpriteMaterial;
const RenderData = renderEngine.RenderData;

/**
 * !#en
 * cc.MotionStreak manages a Ribbon based on it's motion in absolute space.                 <br/>
 * You construct it with a fadeTime, minimum segment size, texture path, texture            <br/>
 * length and color. The fadeTime controls how long it takes each vertex in                 <br/>
 * the streak to fade out, the minimum segment size it how many pixels the                  <br/>
 * streak will move before adding a new ribbon segment, and the texture                     <br/>
 * length is the how many pixels the texture is stretched across. The texture               <br/>
 * is vertically aligned along the streak segment.
 * !#zh 运动轨迹，用于游戏对象的运动轨迹上实现拖尾渐隐效果。
 * @class MotionStreak
 * @extends Component
 */
var MotionStreak = cc.Class({
    name: 'cc.MotionStreak',

    // To avoid conflict with other render component, we haven't use ComponentUnderSG,
    // its implementation also requires some different approach:
    //   1.Needed a parent node to make motion streak's position global related.
    //   2.Need to update the position in each frame by itself because we don't know
    //     whether the global position have changed
    extends: RenderComponent,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.others/MotionStreak',
        help: 'i18n:COMPONENT.help_url.motionStreak',
        playOnFocus: true,
        executeInEditMode: true
    },

    ctor: function() {
        this._root = null;
        this._motionStreak = null;
    },

    properties: {
        /**
         * !#en
         * !#zh 在编辑器模式下预览拖尾效果。
         * @property {Boolean} preview
         * @default false
         */
        preview: {
            default: false,
            editorOnly: true,
            notify: CC_EDITOR && function () {
                this._motionStreak.reset();
                cc.engine.repaintInEditMode();
            },
            animatable: false
        },

        /**
         * !#en The fade time to fade.
         * !#zh 拖尾的渐隐时间，以秒为单位。
         * @property fadeTime
         * @type {Number}
         * @example
         * motionStreak.fadeTime = 3;
         */
        _fadeTime: 1,
        fadeTime: {
            get: function () {
                return this._fadeTime;
            },
            set: function (value) {
                this._fadeTime = value;
                this._applyFadeTime();
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fadeTime'
        },

        /**
         * !#en The minimum segment size.
         * !#zh 拖尾之间最小距离。
         * @property minSeg
         * @type {Number}
         * @example
         * motionStreak.minSeg = 3;
         */
        _minSeg: 1,
        minSeg: {
            get: function () {
                return this._minSeg;
            },
            set: function (value) {
                this._minSeg = value;
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.minSeg'
        },

        /**
         * !#en The stroke's width.
         * !#zh 拖尾的宽度。
         * @property stroke
         * @type {Number}
         * @example
         * motionStreak.stroke = 64;
         */
        _stroke: 64,
        stroke: {
            get: function () {
                return this._stroke;
            },
            set: function (value) {
                this._stroke = value;
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.stroke'
        },

        /**
         * !#en The texture of the MotionStreak.
         * !#zh 拖尾的贴图。
         * @property texture
         * @type {Texture2D}
         * @example
         * motionStreak.texture = newTexture;
         */
        _texture: {
            default: '',
            url: cc.Texture2D
        },
        texture: {
            get: function () {
                return this._texture;
            },
            set: function (value) {
                this._texture = value;
            },
            url: cc.Texture2D,
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.texture'
        },

        /**
         * !#en The color of the MotionStreak.
         * !#zh 拖尾的颜色
         * @property color
         * @type {Color}
         * @default cc.Color.WHITE
         * @example
         * motionStreak.color = new cc.Color(255, 255, 255);
         */
        _color: cc.Color.WHITE,
        color: {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color = value;
            },
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.color'
        },

        /**
         * !#en The fast Mode.
         * !#zh 是否启用了快速模式。当启用快速模式，新的点会被更快地添加，但精度较低。
         * @property fastMode
         * @type {Boolean}
         * @default false
         * @example
         * motionStreak.fastMode = true;
         */
        _fastMode: false,
        fastMode: {
            get: function () {
                return this._fastMode;
            },
            set: function (value) {
                this._fastMode = value;
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fastMode'
        }
    },

    onEnable: function () {
        this._activateMaterial();
        this.node._renderComponent = this;
        this._applyFadeTime();
    },

    onDisable: function () {
        RenderData.free(this._renderData);
        this._material = null;
        this._renderData = null;
        this.node._renderComponent = null;
    },

    _activateMaterial: function () {
        let url = this._texture;
        let texture = cc.textureUtil.loadImage(url);
        let material = renderer.materialUtil.get(url);
        
        // Get material
        if (!material) {
            material = new SpriteMaterial();
            material.texture = texture.getImpl();
            renderer.materialUtil.register(url, this._material);
        }

        this._material = material;
    },

    _applyFadeTime: function () {
        this._fadeDelta = 1/60;
        this._maxPoints = (0 | (this._fadeTime * 60));
        this._numPoints = 0;
    },

    onFocusInEditor: CC_EDITOR && function () {
        if (this.preview) {
            this.reset();
            cc.engine.repaintInEditMode();
        }
    },

    onLostFocusInEditor: CC_EDITOR && function () {
        if (this.preview) {
            this.reset();
            cc.engine.repaintInEditMode();
        }
    },

    /**
     * !#en Remove all living segments of the ribbon.
     * !#zh 删除当前所有的拖尾片段。
     * @method reset
     * @example
     * // stop particle system.
     * myParticleSystem.stopSystem();
     */
    reset: function () {
        this._numPoints = 0;
        if (this._renderData) {
            this._renderData.dataLength = 0;
        }
    },

    update: function (dt) {
        let renderData = this._renderData;
        if (!renderData) {
            renderData = this._renderData = RenderData.alloc();
        }
        let data = renderData._data;
        
        let node = this.node;
        node._updateWorldMatrix();
        let matrix = node._worldMatrix;
        let a = matrix.m00,
            b = matrix.m01,
            c = matrix.m04,
            d = matrix.m05,
            tx = matrix.m12,
            ty = matrix.m13;

        let stroke = this._stroke / 2;
        let lastPoint = this._lastPoint;
        if (!lastPoint) {
            lastPoint = this._lastPoint = cc.v2();
            lastPoint.x = tx;
            lastPoint.y = ty;
            this._numPoints = 1;
            renderData.dataLength = 2;
            data[0].x = tx;
            data[0].y = ty+stroke;
            data[1].x = tx;
            data[1].y = ty-stroke;
            return;
        }

        let maxPoints = this._maxPoints;
        let numPoints = this._numPoints;

        let seg = Math.min(dt/this._fadeDelta, maxPoints) | 0;

        if (seg === 0) {
            return;
        }

        let curLength = Math.min(numPoints + seg, maxPoints);
        renderData.dataLength = renderData.vertexCount = curLength * 2;
        renderData.indiceCount = (curLength - 1) * 6;

        for (let i = numPoints * 2 - 1; i >= 0; i--) {
            let dest = i + seg*2;
            if (dest >= maxPoints*2) continue;
            data[dest].x   = data[i].x;
            data[dest].y   = data[i].y;
        }
        
        let lastx = lastPoint.x, lasty = lastPoint.y;
        let angle = Math.PI - Math.atan2(ty - lasty, tx - lastx);
        let difx = Math.sin(angle) * stroke,
            dify = Math.cos(angle) * stroke;
        let lasttdx = data[seg*2].x;
        let lastbdx = data[seg*2+1].x;
        let lasttdy = data[seg*2].y;
        let lastbdy = data[seg*2+1].y;
        for (let i = 0; i < seg; i++) {
            let cur = i*2;
            let step = 1 - 1 / seg * i;
            data[cur].x = lasttdx + (tx + difx - lasttdx) * step;
            data[cur].y = lasttdy + (ty + dify - lasttdy) * step;
            data[cur+1].x = lastbdx + (tx - difx - lastbdx) * step;
            data[cur+1].y = lastbdy + (ty - dify - lastbdy) * step;
        }

        let color = this._color,
            cr = color.r,
            cg = color.g,
            cb = color.b,
            ca = color.a;

        for (let i = 0; i < curLength; i++) {
            let u = 1/(curLength-1)*i;
            let dest = i*2;
            data[dest].u = u;
            data[dest].v = 0;
            data[dest+1].u = u;
            data[dest+1].v = 1;

            let da = (1-1/(maxPoints-1)*i)*ca;
            data[dest].color = data[dest+1].color = ((da<<24) >>> 0) + (cb<<16) + (cg<<8) + cr;
        }

        this._numPoints = curLength;
        lastPoint.x = tx;
        lastPoint.y = ty;
    }
});

cc.MotionStreak = module.exports = MotionStreak;
