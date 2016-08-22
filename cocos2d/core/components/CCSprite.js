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

var Base = require('./CCRendererUnderSG');

/**
 * !#en Enum for sprite type.
 * !#zh Sprite 类型
 * @enum Sprite.SpriteType
 */
/**
 * !#en The simple type.
 * !#zh 普通类型
 * @property {Number} SIMPLE
 */
/**
 * !#en The sliced type.
 * !#zh 切片（九宫格）类型
 * @property {Number} SLICED
 */
/**
 * !#en The tiled type.
 * !#zh 平铺类型
 * @property {Number} TILED
 */
/**
 * !#en The filled type.
 * !#zh 填充类型
 * @property {Number} FILLED
 */
var SpriteType = cc.Scale9Sprite.RenderingType;

/**
 * !#en Enum for fill type.
 * !#zh 填充类型
 * @enum Sprite.FillType
 */
/**
 * !#en The horizontal fill.
 * !#zh 水平方向填充
 * @property {Number} HORIZONTAL
 */
/**
 * !#en The vertical fill.
 * !#zh 垂直方向填充
 * @property {Number} VERTICAL
 */
/**
 * !#en The radial fill.
 * !#zh 径向填充
 * @property {Number} RADIAL
 */
var FillType = cc.Scale9Sprite.FillType;

var BlendFactor = cc.BlendFunc.BlendFactor;

/**
 * !#en Sprite Size can track trimmed size, raw size or none.
 * !#zh 精灵尺寸调整模式
 * @enum Sprite.SizeMode
 */
var SizeMode = cc.Enum({
    /**
     * !#en Use the customized node size.
     * !#zh 使用节点预设的尺寸
     * @property {Number} CUSTOM
     */
    CUSTOM: 0,
    /**
     * !#en Match the trimmed size of the sprite frame automatically.
     * !#zh 自动适配为精灵裁剪后的尺寸
     * @property {Number} TRIMMED
     */
    TRIMMED: 1,
    /**
     * !#en Match the raw size of the sprite frame automatically.
     * !#zh 自动适配为精灵原图尺寸
     * @property {Number} RAW
     */
    RAW: 2
});

/**
 * !#en Renders a sprite in the scene.
 * !#zh 该组件用于在场景中渲染精灵。
 * @class Sprite
 * @extends _RendererUnderSG
 * @example
 *  // Create a new node and add sprite components.
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  node.parent = this.node;
 */
var Sprite = cc.Class({
    name: 'cc.Sprite',
    extends: Base,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
        help: 'i18n:COMPONENT.help_url.sprite',
        inspector: 'packages://inspector/inspectors/comps/sprite.js',
    },

    ctor: function() {
        this._blendFunc = new cc.BlendFunc(this._srcBlendFactor, this._dstBlendFactor);
    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        _type: SpriteType.SIMPLE,
        _sizeMode: SizeMode.TRIMMED,
        _fillType: 0,
        _fillCenter: cc.v2(0,0),
        _fillStart: 0,
        _fillRange: 0,
        _isTrimmedMode: true,
        _srcBlendFactor: BlendFactor.SRC_ALPHA,
        _dstBlendFactor: BlendFactor.ONE_MINUS_SRC_ALPHA,
        _atlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: 'i18n:COMPONENT.sprite.atlas',
            editorOnly: true,
            visible: true,
            animatable: false
        },

        /**
         * !#en The sprite frame of the sprite.
         * !#zh 精灵的精灵帧
         * @property spriteFrame
         * @type {SpriteFrame}
         * @example
         * sprite.spriteFrame = newSpriteFrame;
         */
        spriteFrame: {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value, force) {
                if (this._spriteFrame === value) {
                    return;
                }
                var lastSprite = this._spriteFrame;
                this._spriteFrame = value;
                this._applySpriteFrame(lastSprite);
                if (CC_EDITOR) {
                    this.node.emit('spriteframe-changed', this);
                }
            },
            type: cc.SpriteFrame,
        },

        /**
         * !#en The sprite render type.
         * !#zh 精灵渲染类型
         * @property type
         * @type {Sprite.SpriteType}
         * @example
         * sprite.type = cc.Sprite.Type.SIMPLE;
         */
        type: {
            get: function () {
                return this._type;
            },
            set: function (value) {
                this._type = value;
                this._sgNode.setRenderingType(this._type);
                // manual settings inset top, bttom, right, left.
                this._applyCapInset();
            },
            type: SpriteType,
            animatable: false,
            tooltip: 'i18n:COMPONENT.sprite.type',
        },

        /**
         * !#en
         * The fill type, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 精灵填充类型，仅渲染类型设置为 cc.Sprite.SpriteType.FILLED 时有效。
         * @property fillType
         * @type {Sprite.FillType}
         * @example
         * sprite.fillType = cc.Sprite.FillType.HORIZONTAL;
         */
        fillType : {
            get: function () {
                return this._fillType;
            },
            set: function(value) {
                this._fillType = value;
                this._sgNode && this._sgNode.setFillType(value);
            },
            type: FillType,
            tooltip: 'i18n:COMPONENT.sprite.fill_type'
        },

        /**
         * !#en
         * The fill Center, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充中心点，仅渲染类型设置为 cc.Sprite.SpriteType.FILLED 时有效。
         * @property fillCenter
         * @type {Vec2}
         * @example
         * sprite.fillCenter = new cc.Vec2(0, 0);
         */
        fillCenter: {
            get: function() {
                return this._fillCenter;
            },
            set: function(value) {
                this._fillCenter = cc.v2(value);
                this._sgNode && this._sgNode.setFillCenter(this._fillCenter);
            },
            tooltip: 'i18n:COMPONENT.sprite.fill_center',
        },

        /**
         * !#en
         * The fill Start, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充起始点，仅渲染类型设置为 cc.Sprite.SpriteType.FILLED 时有效。
         * @property fillStart
         * @type {Number}
         * @example
         * // -1 To 1 between the numbers
         * sprite.fillStart = 0.5;
         */
        fillStart: {
            get: function() {
                return this._fillStart;
            },
            set: function(value) {
                this._fillStart = cc.clampf(value, -1, 1);
                this._sgNode && this._sgNode.setFillStart(value);
            },
            tooltip: 'i18n:COMPONENT.sprite.fill_start'
        },

        /**
         * !#en
         * The fill Range, This will only have any effect if the "type" is set to “cc.Sprite.Type.FILLED”.
         * !#zh
         * 填充范围，仅渲染类型设置为 cc.Sprite.SpriteType.FILLED 时有效。
         * @property fillRange
         * @type {Number}
         * @example
         * // -1 To 1 between the numbers
         * sprite.fillRange = 1;
         */
        fillRange: {
            get: function() {
                return this._fillRange;
            },
            set: function(value) {
                this._fillRange = cc.clampf(value, -1, 1);
                this._sgNode && this._sgNode.setFillRange(value);
            },
            tooltip: 'i18n:COMPONENT.sprite.fill_range'
        },
        /**
         * !#en specify the frame is trimmed or not.
         * !#zh 是否使用裁剪模式
         * @property trim
         * @type {Boolean}
         * @example
         * sprite.trim = true;
         */
        trim: {
            get: function () {
                return this._isTrimmedMode;
            },
            set: function (value) {
                if (this._isTrimmedMode !== value) {
                    this._isTrimmedMode = value;
                    this._sgNode.enableTrimmedContentSize(value);
                }
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.sprite.trim'
        },

        /**
         * !#en specify the source Blend Factor.
         * !#zh 指定原图的混合模式
         * @property srcBlendFactor
         * @type {BlendFactor}
         * @example
         * sprite.srcBlendFactor = cc.BlendFunc.BlendFactor.ONE;
         */
        srcBlendFactor: {
            get: function() {
                return this._srcBlendFactor;
            },
            set: function(value) {
                this._srcBlendFactor = value;
                this._blendFunc.src = value;
                this._sgNode.setBlendFunc(this._blendFunc);
            },
            animatable: false,
            type:BlendFactor,
            tooltip: 'i18n:COMPONENT.sprite.src_blend_factor'
        },

        /**
         * !#en specify the destination Blend Factor.
         * !#zh 指定目标的混合模式
         * @property dstBlendFactor
         * @type {BlendFactor}
         * @example
         * sprite.dstBlendFactor = cc.BlendFunc.BlendFactor.ONE;
         */
        dstBlendFactor: {
            get: function() {
                return this._dstBlendFactor;
            },
            set: function(value) {
                this._dstBlendFactor = value;
                this._blendFunc.dst = value;
                this._sgNode.setBlendFunc(this._blendFunc);
            },
            animatable: false,
            type: BlendFactor,
            tooltip: 'i18n:COMPONENT.sprite.dst_blend_factor'
        },

        /**
         * !#en specify the size tracing mode.
         * !#zh 精灵尺寸调整模式
         * @property sizeMode
         * @type {Sprite.SizeMode}
         * @example
         * sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
         */
        sizeMode: {
            get: function () {
                return this._sizeMode;
            },
            set: function (value) {
                this._sizeMode = value;
                if (value !== SizeMode.CUSTOM) {
                    this._applySpriteSize();
                }
            },
            animatable: false,
            type: SizeMode,
            tooltip: 'i18n:COMPONENT.sprite.size_mode'
        }
    },

    statics: {
        FillType: FillType,
        Type: SpriteType,
        SizeMode: SizeMode,
    },

    setVisible: function (visible) {
        this.enabled = visible;
    },

    /**
     * !#en Change the left sprite's cap inset.
     * !#zh 设置精灵左边框-用于九宫格。
     * @method setInsetLeft
     * @param {Number} insetLeft - The values to use for the cap inset.
     * @example
     * sprite.setInsetLeft(5);
     */
    setInsetLeft: function (insetLeft) {
        this._sgNode.setInsetLeft(insetLeft);
    },

    /**
     * !#en Query the left sprite's cap inset.
     * !#zh 获取精灵左边框
     * @method getInsetLeft
     * @return {Number} The left sprite's cap inset.
     * @example
     * var insetLeft = sprite.getInsetLeft();
     * cc.log("Inset Left:" + insetLeft);
     */
    getInsetLeft: function () {
        return this._sgNode.getInsetLeft();
    },

    /**
     * !#en Change the top sprite's cap inset.
     * !#zh 设置精灵上边框-用于九宫格。
     * @method setInsetTop
     * @param {Number} insetTop - The values to use for the cap inset.
     * @example
     * sprite.setInsetTop(5);
     */
    setInsetTop: function (insetTop) {
        this._sgNode.setInsetTop(insetTop);
    },

    /**
     * !#en Query the top sprite's cap inset.
     * !#zh 获取精灵上边框。
     * @method getInsetTop
     * @return {Number} The top sprite's cap inset.
     * @example
     * var insetTop = sprite.getInsetTop();
     * cc.log("Inset Top:" + insetTop);
     */
    getInsetTop: function () {
        return this._sgNode.getInsetTop();
    },

    /**
     * !#en Change the right sprite's cap inset.
     * !#zh 设置精灵右边框-用于九宫格。
     * @method setInsetRight
     * @param {Number} insetRight - The values to use for the cap inset.
     * @example
     * sprite.setInsetRight(5);
     */
    setInsetRight: function (insetRight) {
        this._sgNode.setInsetRight(insetRight);
    },

    /**
     * !#en Query the right sprite's cap inset.
     * !#zh 获取精灵右边框。
     * @method getInsetRight
     * @return {Number} The right sprite's cap inset.
     * @example
     * var insetRight = sprite.getInsetRight();
     * cc.log("Inset Right:" + insetRight);
     */
    getInsetRight: function () {
        return this._sgNode.getInsetRight();
    },

    /**
     * !#en Change the bottom sprite's cap inset.
     * !#zh 设置精灵下边框-用于九宫格。
     * @method setInsetBottom
     * @param {Number} bottomInset - The values to use for the cap inset.
     * @example
     * sprite.setInsetBottom(5);
     */
    setInsetBottom: function (insetBottom) {
        this._sgNode.setInsetBottom(insetBottom);
    },

    /**
     * !#en Query the bottom sprite's cap inset.
     * !#zh 获取精灵下边框。
     * @method getInsetBottom
     * @return {Number} The bottom sprite's cap inset.
     * @example
     * var insetBottom = sprite.getInsetBottom();
     * cc.log("Inset Bottom:" + insetBottom);
     */
    getInsetBottom: function () {
        return this._sgNode.getInsetBottom();
    },

    onEnable: function () {
        if (this._sgNode) {
            if (this._spriteFrame && this._spriteFrame.textureLoaded()) {
                this._sgNode.setVisible(true);
            }
        }
    },

    _applyAtlas: CC_EDITOR && function (spriteFrame) {
        // Set atlas
        if (spriteFrame && spriteFrame._atlasUuid) {
            var self = this;
            cc.AssetLibrary.loadAsset(spriteFrame._atlasUuid, function (err, asset) {
                self._atlas = asset;
            });
        } else {
            this._atlas = null;
        }
    },

    _applyCapInset: function () {
        if (this._type === SpriteType.SLICED && this._spriteFrame) {
            var sgNode = this._sgNode;
            sgNode.setInsetTop(this._spriteFrame.insetTop);
            sgNode.setInsetBottom(this._spriteFrame.insetBottom);
            sgNode.setInsetRight(this._spriteFrame.insetRight);
            sgNode.setInsetLeft(this._spriteFrame.insetLeft);
        }
    },

    _applySpriteSize: function () {
        if (SizeMode.CUSTOM === this._sizeMode || !this._spriteFrame) {
            this.node.setContentSize(this.node.getContentSize(true));
        } else if (SizeMode.RAW === this._sizeMode) {
            var size = this._spriteFrame.getOriginalSize();
            this.node.setContentSize(size);
        } else if (SizeMode.TRIMMED === this._sizeMode) {
            var rect = this._spriteFrame.getRect();
            this.node.setContentSize(cc.size(rect.width, rect.height));
        } else {
            this.node.setContentSize(this.node.getContentSize(true));
        }
    },

    _onSpriteFrameLoaded: function (event) {
        var self = this;
        var sgNode = this._sgNode;
        sgNode.setSpriteFrame(self._spriteFrame);
        self._applyCapInset();
        self._applySpriteSize();
        if (self.enabledInHierarchy && !sgNode.isVisible()) {
            sgNode.setVisible(true);
        }
    },

    _applySpriteFrame: function (oldFrame) {
        var sgNode = this._sgNode;
        if (oldFrame && oldFrame.off) {
            oldFrame.off('load', this._onSpriteFrameLoaded, this);
        }

        var spriteFrame = this._spriteFrame;
        if (spriteFrame) {
            if (spriteFrame.textureLoaded()) {
                this._onSpriteFrameLoaded(null);
            }
            else {
                spriteFrame.once('load', this._onSpriteFrameLoaded, this);
                spriteFrame.ensureLoadTexture();
            }
        }
        else {
            sgNode.setVisible(false);
        }

        if (CC_EDITOR) {
            // Set atlas
            this._applyAtlas(spriteFrame);
        }
    },

    _createSgNode: function () {
        return new cc.Scale9Sprite();
    },

    _initSgNode: function () {
        this._applySpriteFrame(null);
        var sgNode = this._sgNode;

        // should keep the size of the sg node the same as entity,
        // otherwise setContentSize may not take effect
        sgNode.setContentSize(this.node.getContentSize(true));
        this._applySpriteSize();

        sgNode.setRenderingType(this._type);
        sgNode.setFillType(this._fillType);
        sgNode.setFillCenter(this._fillCenter);
        sgNode.setFillStart(this._fillStart);
        sgNode.setFillRange(this._fillRange);
        sgNode.enableTrimmedContentSize(this._isTrimmedMode);
        this._blendFunc.src = this._srcBlendFactor;
        this._blendFunc.dst = this._dstBlendFactor;
        sgNode.setBlendFunc(this._blendFunc);
    },

    _resized: CC_EDITOR && function () {
        if (this._spriteFrame) {
            var actualSize = this.node.getContentSize();
            var expectedW = actualSize.width;
            var expectedH = actualSize.height;
            if (this._sizeMode === SizeMode.RAW) {
                var size = this._spriteFrame.getOriginalSize();
                expectedW = size.width;
                expectedH = size.height;
            } else if (this._sizeMode === SizeMode.TRIMMED) {
                var rect = this._spriteFrame.getRect();
                expectedW = rect.width;
                expectedH = rect.height;

            } else {

            }

            if (expectedW !== actualSize.width || expectedH !== actualSize.height) {
                this._sizeMode = SizeMode.CUSTOM;
            }
        }
    },
});

if (CC_EDITOR) {
    // override __preload
    Sprite.prototype.__superPreload = Base.prototype.__preload;
    Sprite.prototype.__preload = function () {
        this.__superPreload();
        this.node.on('size-changed', this._resized, this);
    };
    // override onDestroy
    Sprite.prototype.__superOnDestroy = Base.prototype.onDestroy;
    Sprite.prototype.onDestroy = function () {
        this.__superOnDestroy();
        this.node.off('size-changed', this._resized, this);
    };
}

var misc = require('../utils/misc');
var SameNameGetSets = ['atlas', 'capInsets', 'insetLeft', 'insetTop', 'insetRight', 'insetBottom'];
var DiffNameGetSets = {
    type: [null, 'setRenderingType']
};
misc.propertyDefine(Sprite, SameNameGetSets, DiffNameGetSets);

cc.Sprite = module.exports = Sprite;
