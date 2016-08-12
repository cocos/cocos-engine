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

var Base = cc._RendererInSG;

/**
 * @class Mask
 * @extends _RendererInSG
 */

/**
 * !#en the type for mask.
 * !#zh 遮罩组件的类型
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
    ELLIPSE: 1
});

var Mask = cc.Class({
    name: 'cc.Mask',
    extends: Base,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Mask',
        help: 'i18n:COMPONENT.help_url.mask',
    },

    properties: {
        _clippingStencil: {
            default: null,
            serializable: false,
        },

        _type:0,
        _segements: 64,

        /**
         * !#en The mask type.
         * !#zh 遮罩类型
         * @property type
         * @type {MaskType}
         * @example
         * mask.type = MaskType.RECT;
         */
        type: {
            get: function() {
                return this._type;
            },
            set: function(value) {
                this._type = value;
                this._refreshStencil();
            },
            type: MaskType
        },

        /**
         * !#en The segements for ellipse mask.
         * !#zh 椭圆遮罩的曲线细分数
         * @property segements
         * @type {Number}
         * @default 64
         */
        segements: {
            get: function() {
                return this._segements;
            },
            set: function(value) {
                if(value < 3) value = 3;
                this._segements = value;
                this._refreshStencil();
            },
            type: cc.Integer
        },
    },

    statics: {
        Type: MaskType,
    },

    _createSgNode: function () {
        this._clippingStencil = new cc.DrawNode();
        if (CC_JSB) {
            this._clippingStencil.retain();
        }
        return new cc.ClippingNode(this._clippingStencil);
    },

    _initSgNode: function () {},

    _hitTest: function (point) {
        var size = this.node.getContentSize(),
            w = size.width,
            h = size.height,
            trans = this.node.getNodeToWorldTransform();

        if (this._type === MaskType.RECT) {
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
        else {
            var a = w/2, b = h/2;
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
        this._refreshStencil();
        this._super();
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
        var contentSize = this.node.getContentSize();
        var anchorPoint = this.node.getAnchorPoint();
        var width = contentSize.width;
        var height = contentSize.height;
        var x = - width * anchorPoint.x;
        var y = - height * anchorPoint.y;
        var color = cc.color(255, 255, 255, 0);
        this._clippingStencil.clear();
        if(this._type === MaskType.RECT) {
            var rectangle = [ cc.v2(x, y),
                cc.v2(x + width, y),
                cc.v2(x + width, y + height),
                cc.v2(x, y + height) ];
            this._clippingStencil.drawPoly(rectangle, color, 0, color);
        } else {
            var center = cc.v2(x + width /2, y+height/2);
            var radius = {x: width/2, y: height/2};
            var segements = this._segements;
            this._clippingStencil.drawPoly(this._calculateCircle(center, radius, segements), color, 0, color);
        }
    }
});

if (CC_JSB) {
    // override onDestroy
    Mask.prototype.__superOnDestroy = Base.prototype.onDestroy;
    Mask.prototype.onDestroy = function () {
        this.__superOnDestroy();
        this._clippingStencil.release();
        this._clippingStencil = null;
    };
}

cc.Mask = module.exports = Mask;
