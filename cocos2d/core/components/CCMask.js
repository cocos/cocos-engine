/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import gfx from '../../renderer/gfx';

const misc = require('../utils/misc');
const RenderComponent = require('./CCRenderComponent');
const RenderFlow = require('../renderer/render-flow');
const Graphics = require('../graphics/graphics');

import Mat4 from '../value-types/mat4';
import Vec2 from '../value-types/vec2';
import MaterialVariant from '../assets/material/material-variant';

let _vec2_temp = new Vec2();
let _mat4_temp = new Mat4();

let _circlepoints =[];
function _calculateCircle (center, radius, segements) {
    _circlepoints.length = 0;
    let anglePerStep = Math.PI * 2 / segements;
    for (let step = 0; step < segements; ++step) {
        _circlepoints.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x,
            radius.y * Math.sin(anglePerStep * step) + center.y));
    }

    return _circlepoints;
}

/**
 * !#en the type for mask.
 * !#zh 遮罩组件类型
 * @enum Mask.Type
 */
let MaskType = cc.Enum({
    /**
     * !#en Rect mask.
     * !#zh 使用矩形作为遮罩
     * @property {Number} RECT
     */
    RECT: 0,
    /**
     * !#en Ellipse Mask.
     * !#zh 使用椭圆作为遮罩
     * @property {Number} ELLIPSE
     */
    ELLIPSE: 1,
    /**
     * !#en Image Stencil Mask.
     * !#zh 使用图像模版作为遮罩
     * @property {Number} IMAGE_STENCIL
     */
    IMAGE_STENCIL: 2,
});

const SEGEMENTS_MIN = 3;
const SEGEMENTS_MAX = 10000;

/**
 * !#en The Mask Component
 * !#zh 遮罩组件
 * @class Mask
 * @extends RenderComponent
 */
let Mask = cc.Class({
    name: 'cc.Mask',
    extends: RenderComponent,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Mask',
        help: 'i18n:COMPONENT.help_url.mask',
        inspector: 'packages://inspector/inspectors/comps/mask.js'
    },

    ctor () {
        this._graphics = null;

        this._enableMaterial = null;
        this._exitMaterial = null;
        this._clearMaterial = null;
    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },

        /**
         * !#en The mask type.
         * !#zh 遮罩类型
         * @property type
         * @type {Mask.Type}
         * @example
         * mask.type = cc.Mask.Type.RECT;
         */
        _type: MaskType.RECT,
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                if (this._type !== value) {
                    this._resetAssembler();
                }

                this._type = value;
                if (this._type !== MaskType.IMAGE_STENCIL) {
                    this.spriteFrame = null;
                    this.alphaThreshold = 0;
                    this._updateGraphics();
                }
                
                this._activateMaterial();
            },
            type: MaskType,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.type',
        },

        /**
         * !#en The mask image
         * !#zh 遮罩所需要的贴图
         * @property spriteFrame
         * @type {SpriteFrame}
         * @default null
         * @example
         * mask.spriteFrame = newSpriteFrame;
         */
        spriteFrame: {
            type: cc.SpriteFrame,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.spriteFrame',
            get: function () {
                return this._spriteFrame;
            },
            set: function (value) {
                let lastSprite = this._spriteFrame;
                if (CC_EDITOR) {
                    if ((lastSprite && lastSprite._uuid) === (value && value._uuid)) {
                        return;
                    }
                }
                else {
                    if (lastSprite === value) {
                        return;
                    }
                }

                if (lastSprite) {
                    lastSprite.off('load', this.setVertsDirty, this);
                }

                this._spriteFrame = value;
                
                this.setVertsDirty();
                this._updateMaterial();
            },
        },

        /**
         * !#en
         * The alpha threshold.(Not supported Canvas Mode) <br/>
         * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
         * Should be a float between 0 and 1. <br/>
         * This default to 0.1.
         * When it's set to 1, the stencil will discard all pixels, nothing will be shown.
         * !#zh
         * Alpha 阈值（不支持 Canvas 模式）<br/>
         * 只有当模板的像素的 alpha 大于等于 alphaThreshold 时，才会绘制内容。<br/>
         * 该数值 0 ~ 1 之间的浮点数，默认值为 0.1
         * 当被设置为 1 时，会丢弃所有蒙版像素，所以不会显示任何内容
         * @property alphaThreshold
         * @type {Number}
         * @default 0.1
         */
        alphaThreshold: {
            default: 0.1,
            type: cc.Float,
            range: [0, 1, 0.1],
            slide: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.alphaThreshold',
            notify: function () {
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    cc.warnID(4201);
                    return;
                }
                this._updateMaterial();
            }
        },

        /**
         * !#en Reverse mask (Not supported Canvas Mode)
         * !#zh 反向遮罩（不支持 Canvas 模式）
         * @property inverted
         * @type {Boolean}
         * @default false
         */
        inverted: {
            default: false,
            type: cc.Boolean,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.inverted',
            notify: function () {
                if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
                    cc.warnID(4202);
                }
            }
        },

        /**
         * TODO: remove segments, not supported by graphics
         * !#en The segements for ellipse mask.
         * !#zh 椭圆遮罩的曲线细分数
         * @property segements
         * @type {Number}
         * @default 64
         */
        _segments: 64,
        segements: {
            get: function () {
                return this._segments;
            },
            set: function (value) {
                this._segments = misc.clampf(value, SEGEMENTS_MIN, SEGEMENTS_MAX);
                this._updateGraphics();
            },
            type: cc.Integer,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.segements',
        },

        _resizeToTarget: {
            animatable: false,
            set: function (value) {
                if(value) {
                    this._resizeNodeToTargetNode();
                }
            }
        }
    },

    statics: {
        Type: MaskType,
    },

    onRestore () {
        this._activateMaterial();
    },

    onEnable () {
        this._super();
        if (this._type !== MaskType.IMAGE_STENCIL) {
            this._updateGraphics();
        }
        else if (this._spriteFrame) {
            this._spriteFrame.once('load', this.setVertsDirty, this);
        }

        this.node.on(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
        this.node.on(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
        this.node.on(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);
    },

    onDisable () {
        this._super();

        this.node.off(cc.Node.EventType.POSITION_CHANGED, this._updateGraphics, this);
        this.node.off(cc.Node.EventType.ROTATION_CHANGED, this._updateGraphics, this);
        this.node.off(cc.Node.EventType.SCALE_CHANGED, this._updateGraphics, this);
        this.node.off(cc.Node.EventType.SIZE_CHANGED, this._updateGraphics, this);
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._updateGraphics, this);
        
        this.node._renderFlag &= ~RenderFlow.FLAG_POST_RENDER;
    },

    onDestroy () {
        this._super();
        this._removeGraphics();

        if (this._spriteFrame) {
            this._spriteFrame.off('load', this.setVertsDirty, this);
        }
    },

    _resizeNodeToTargetNode: CC_EDITOR && function () {
        if(this.spriteFrame) {
            let rect = this.spriteFrame.getRect();
            this.node.setContentSize(rect.width, rect.height);
        }
    },

    _validateRender () {
        if (this._type !== MaskType.IMAGE_STENCIL) return;

        let spriteFrame = this._spriteFrame;
        if (spriteFrame && 
            spriteFrame.textureLoaded()) {
            return;
        }

        this.disableRender();
    },

    _activateMaterial () {
        this._createGraphics();
        
        // Init material
        let material = this._materials[0];
        if (!material) {
            material = MaterialVariant.createWithBuiltin('2d-sprite', this);
        }
        else {
            material = MaterialVariant.create(material, this);
        }

        material.define('USE_ALPHA_TEST', true);

        // Reset material
        if (this._type === MaskType.IMAGE_STENCIL) {
            material.define('CC_USE_MODEL', false);
            material.define('USE_TEXTURE', true);
        }
        else {
            material.define('CC_USE_MODEL', true);
            material.define('USE_TEXTURE', false);
        }

        if (!this._enableMaterial) {
            this._enableMaterial = MaterialVariant.createWithBuiltin('2d-sprite', this);
        }
    
        if (!this._exitMaterial) {
            this._exitMaterial = MaterialVariant.createWithBuiltin('2d-sprite', this);
            this._exitMaterial.setStencilEnabled(gfx.STENCIL_DISABLE);
        }

        if (!this._clearMaterial) {
            this._clearMaterial = MaterialVariant.createWithBuiltin('clear-stencil', this);
        }

        this.setMaterial(0, material);

        this._graphics._materials[0] = material;

        this._updateMaterial();
    },

    _updateMaterial () {
        let material = this._materials[0];
        if (!material) return;

        if (this._type === MaskType.IMAGE_STENCIL && this.spriteFrame) {
            let texture = this.spriteFrame.getTexture();
            material.setProperty('texture', texture);
        }
        material.setProperty('alphaThreshold', this.alphaThreshold);
    },

    _createGraphics () {
        if (!this._graphics) {
            this._graphics = new Graphics();
            cc.Assembler.init(this._graphics);
            this._graphics.node = this.node;
            this._graphics.lineWidth = 0;
            this._graphics.strokeColor = cc.color(0, 0, 0, 0);
        }
    },

    _updateGraphics () {
        if (!this.enabledInHierarchy) return;
        let node = this.node;
        let graphics = this._graphics;
        // Share render data with graphics content
        graphics.clear(false);
        let width = node._contentSize.width;
        let height = node._contentSize.height;
        let x = -width * node._anchorPoint.x;
        let y = -height * node._anchorPoint.y;
        if (this._type === MaskType.RECT) {
            graphics.rect(x, y, width, height);
        }
        else if (this._type === MaskType.ELLIPSE) {
            let center = cc.v2(x + width / 2, y + height / 2);
            let radius = {
                x: width / 2,
                y: height / 2
            };
            let points = _calculateCircle(center, radius, this._segments);
            for (let i = 0; i < points.length; ++i) {
                let point = points[i];
                if (i === 0) {
                    graphics.moveTo(point.x, point.y);
                }
                else {
                    graphics.lineTo(point.x, point.y);
                }
            }
            graphics.close();
        }
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            graphics.stroke();
        }
        else {
            graphics.fill();
        }
        this.setVertsDirty();
    },

    _removeGraphics () {
        if (this._graphics) {
            this._graphics.destroy();
            this._graphics._destroyImmediate(); // FIX: cocos-creator/2d-tasks#2511. TODO: cocos-creator/2d-tasks#2516
            this._graphics = null;
        }
    },

    _hitTest (cameraPt) {
        let node = this.node;
        let size = node.getContentSize(),
            w = size.width,
            h = size.height,
            testPt = _vec2_temp;
        
        node._updateWorldMatrix();
        // If scale is 0, it can't be hit.
        if (!Mat4.invert(_mat4_temp, node._worldMatrix)) {
            return false;
        }
        Vec2.transformMat4(testPt, cameraPt, _mat4_temp);
        testPt.x += node._anchorPoint.x * w;
        testPt.y += node._anchorPoint.y * h;

        let result = false;
        if (this.type === MaskType.RECT || this.type === MaskType.IMAGE_STENCIL) {
            result = testPt.x >= 0 && testPt.y >= 0 && testPt.x <= w && testPt.y <= h;
        }
        else if (this.type === MaskType.ELLIPSE) {
            let rx = w / 2, ry = h / 2;
            let px = testPt.x - 0.5 * w, py = testPt.y - 0.5 * h;
            result = px * px / (rx * rx) + py * py / (ry * ry) < 1;
        }
        if (this.inverted) {
            result = !result;
        }
        return result;
    },

    markForRender (enable) {
        let flag = RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | RenderFlow.FLAG_POST_RENDER;
        if (enable) {
            this.node._renderFlag |= flag;
            this.markForValidate();
        }
        else if (!enable) {
            this.node._renderFlag &= ~flag;
        }
    },

    disableRender () {
        this.node._renderFlag &= ~(RenderFlow.FLAG_RENDER | RenderFlow.FLAG_UPDATE_RENDER_DATA | 
                                   RenderFlow.FLAG_POST_RENDER);
    },
});

cc.Mask = module.exports = Mask;
