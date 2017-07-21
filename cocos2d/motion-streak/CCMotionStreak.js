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
require('./CCSGMotionStreak');
require('./CCSGMotionStreakWebGLRenderCmd');
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
    extends: cc.Component,

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
                if (this._motionStreak) {
                    this._motionStreak.setFadeTime(value);
                }
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
                if (this._motionStreak) {
                    this._motionStreak.setMinSeg(value);
                }
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
                if (this._motionStreak) {
                    this._motionStreak.setStroke(value);
                }
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
                if (this._motionStreak) {
                    if (value && cc.js.isString(value))
                        value = cc.textureCache.addImage(value);

                    this._motionStreak.setTexture(value);
                }
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
                if (this._motionStreak) {
                    this._motionStreak.tintWithColor(value);
                }
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
                if (this._motionStreak) {
                    this._motionStreak.setFastMode(value);
                }
            },
            animatable: false,
            tooltip: CC_DEV && 'i18n:COMPONENT.motionStreak.fastMode'
        }
    },

    onFocusInEditor: CC_EDITOR && function () {
        if (this.preview) {
            this._motionStreak.reset();
        }
    },

    onLostFocusInEditor: CC_EDITOR && function () {
        if (this.preview) {
            this._motionStreak.reset();
            this._motionStreak.update();
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
        this._motionStreak.reset();
    },

    __preload: function () {
        if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL && !CC_JSB) {
            cc.warnID(5900);
            return;
        }
        this._root = new _ccsg.Node();
        var motionStreak = new _ccsg.MotionStreak();
        motionStreak.initWithFade(this._fadeTime, this._minSeg, this._stroke, this.node.color, this._texture || null);
        motionStreak.setFastMode(this._fastMode);
        this._root.addChild(motionStreak);
        var sgNode = this.node._sgNode;
        if (sgNode) {
            sgNode.addChild(this._root, -10);
        }
        this._motionStreak = motionStreak;

    },

    onEnable: function () {
        this.node.on('position-changed', this._onNodePositionChanged, this);
    },

    onDisable: function () {
        this.node.off('position-changed', this._onNodePositionChanged, this);
    },

    _onNodePositionChanged: function () {
        if (CC_EDITOR && !this.preview) {
            return;
        }
        if (this._motionStreak) {
            // add root for let the global coordinates effective
            var node = this.node;
            var worldMt = node.getNodeToWorldTransform();
            // calculation anchor coordinates
            var tx = worldMt.tx - (node.width / 2 + node.anchorX * node.width);
            var ty = worldMt.ty - (node.height / 2 + node.anchorY * node.height);
            this._root.setPosition(-tx, -ty);
            this._motionStreak.setPosition(tx, ty);
        }
    }
});

cc.MotionStreak = module.exports = MotionStreak;
