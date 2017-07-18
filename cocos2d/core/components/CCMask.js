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
require('../../clipping-nodes/CCClippingNode');
require('../../clipping-nodes/CCClippingNodeCanvasRenderCmd');
require('../../clipping-nodes/CCClippingNodeWebGLRenderCmd');
var Base = cc._RendererInSG;

/**
 * !#en the type for mask.
 * !#zh 遮罩组件类型
 * @enum Mask.Type
 */
var MaskType = cc.Enum({
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

/**
 * !#en The Mask Component
 * !#zh 遮罩组件
 * @class Mask
 * @extends _RendererInSG
 */
var Mask = cc.Class({
    name: 'cc.Mask',
    extends: Base,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Mask',
        help: 'i18n:COMPONENT.help_url.mask',
        inspector: 'packages://inspector/inspectors/comps/mask.js'
    },

    properties: {
        _clippingStencil: {
            default: null,
            serializable: false,
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
                this._type = value;
                this._refreshStencil();
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
            default: null,
            type: cc.SpriteFrame,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.spriteFrame',
            notify: function() {
                this._refreshStencil();
            }
        },

        /**
         * !#en
         * The alpha threshold.(Not supported Canvas Mode) <br/>
         * The content is drawn only where the stencil have pixel with alpha greater than the alphaThreshold. <br/>
         * Should be a float between 0 and 1. <br/>
         * This default to 1 (so alpha test is disabled).
         * !#zh
         * Alpha 阈值（不支持 Canvas 模式）<br/>
         * 只有当模板的像素的 alpha 大于 alphaThreshold 时，才会绘制内容。<br/>
         * 该数值 0 ~ 1 之间的浮点数，默认值为 1（因此禁用 alpha）
         * @property alphaThreshold
         * @type {Number}
         * @default 1
         */
        alphaThreshold: {
            default: 1,
            type: cc.Float,
            range: [0, 1, 0.1],
            slide: true,
            tooltip: CC_DEV && 'i18n:COMPONENT.mask.alphaThreshold',
            notify: function() {
                if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
                    cc.warnID(4201);
                    return;
                }
                this._sgNode.setAlphaThreshold(this.alphaThreshold);
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
            notify: function() {
                if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
                    cc.warnID(4202);
                    return;
                }
                this._sgNode.setInverted(this.inverted);
            }
        },

        /**
         * !#en The segements for ellipse mask.
         * !#zh 椭圆遮罩的曲线细分数
         * @property segements
         * @type {Number}
         * @default 64
         */
        _segements: 64,
        segements: {
            get: function () {
                return this._segements;
            },
            set: function (value) {
                this._segements = value < 3 ? 3 : value;
                this._refreshStencil();
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

    _resizeNodeToTargetNode: CC_EDITOR && function () {
        if(this.spriteFrame) {
            var rect = this.spriteFrame.getRect();
            this.node.setContentSize(rect.width, rect.height);
        }
    },

    _createSgNode: function () {
        return new cc.ClippingNode();
    },

    _initSgNode: function () {},

    _hitTest: function (point) {
        var size = this.node.getContentSize(),
            w = size.width,
            h = size.height,
            trans = this.node.getNodeToWorldTransform();

        if (this.type === MaskType.RECT || this.type === MaskType.IMAGE_STENCIL) {
            var rect = cc.rect(0, 0, w, h);
            cc._rectApplyAffineTransformIn(rect, trans);
            var left = point.x - rect.x,
                right = rect.x + rect.width - point.x,
                bottom = point.y - rect.y,
                top = rect.y + rect.height - point.y;
            if (left >= 0 && right >= 0 && top >= 0 && bottom >= 0) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (this.type === MaskType.ELLIPSE) {
            var a = w / 2, b = h / 2;
            var cx = trans.a * a + trans.c * b + trans.tx;
            var cy = trans.b * a + trans.d * b + trans.ty;
            var px = point.x - cx, py = point.y - cy;
            if (px * px / (a * a) + py * py / (b * b) < 1) {
                return true;
            }
            else {
                return false;
            }
        }
    },

    onEnable: function () {
        this._super();
        if (this.spriteFrame) {
            this.spriteFrame.ensureLoadTexture();
        }
        this._refreshStencil();
        this.node.on('size-changed', this._refreshStencil, this);
        this.node.on('anchor-changed', this._refreshStencil, this);
    },

    onDisable: function () {
        this._super();
        this.node.off('size-changed', this._refreshStencil, this);
        this.node.off('anchor-changed', this._refreshStencil, this);
    },

    _calculateCircle: function(center, radius, segements) {
        var polies =[];
        var anglePerStep = Math.PI * 2 / segements;
        for(var step = 0; step < segements; ++ step) {
            polies.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x,
                radius.y * Math.sin(anglePerStep * step) + center.y));
        }

        return polies;
    },

    _refreshStencil: function () {
        // Check whether the conditions are met
        if (this.type === MaskType.IMAGE_STENCIL &&
            cc._renderType !== cc.game.RENDER_TYPE_WEBGL && !CC_JSB) {
            cc.warnID(4200);
            return;
        }

        var contentSize = this.node.getContentSize();
        var anchorPoint = this.node.getAnchorPoint();
        var stencil = this._clippingStencil;
        if (this._type === MaskType.IMAGE_STENCIL) {
            var isSgSprite = stencil instanceof cc.Scale9Sprite;
            if (!isSgSprite || stencil._spriteFrame !== this.spriteFrame) {
                stencil = new cc.Scale9Sprite();
                stencil.setSpriteFrame(this.spriteFrame);
                this._sgNode.setStencil(stencil);
            }
            stencil.setContentSize(contentSize);
            stencil.setAnchorPoint(anchorPoint);
            this._sgNode.setAlphaThreshold(this.alphaThreshold);
        }
        else {
            var isDrawNode = stencil instanceof cc.DrawNode;
            if (!isDrawNode) {
                stencil = new cc.DrawNode();
                if (CC_JSB) {
                    stencil.retain();
                }
                this._sgNode.setStencil(stencil);
            }
            var width = contentSize.width;
            var height = contentSize.height;
            var x = - width * anchorPoint.x;
            var y = - height * anchorPoint.y;
            var color = cc.color(255, 255, 255, 0);
            stencil.clear();
            if (this._type === MaskType.RECT) {
                var rectangle = [cc.v2(x, y),
                    cc.v2(x + width, y),
                    cc.v2(x + width, y + height),
                    cc.v2(x, y + height)];
                stencil.drawPoly(rectangle, color, 0, color);
            }
            else if (this._type === MaskType.ELLIPSE) {
                var center = cc.v2(x + width / 2, y + height / 2);
                var radius = {
                    x: width / 2,
                    y: height / 2
                };
                stencil.drawPoly(this._calculateCircle(center, radius, this._segements), color, 0, color);
            }
        }
        this._sgNode.setInverted(this.inverted);
        this._clippingStencil = stencil;
        if (!CC_JSB) {
            cc.renderer.childrenOrderDirty = true;
        }
    }
});

if (CC_JSB) {
    // override onDestroy
    Mask.prototype.__superOnDestroy = Base.prototype.onDestroy;
    Mask.prototype.onDestroy = function () {
        this.__superOnDestroy();
        if (this._clippingStencil) {
            this._clippingStencil.release();
            this._clippingStencil = null;
        }
    };
}

cc.Mask = module.exports = Mask;
