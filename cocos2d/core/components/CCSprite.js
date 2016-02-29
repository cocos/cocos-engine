/****************************************************************************
 Copyright (c) 2015 Chukong Technologies Inc.

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
 * Enum for sprite type
 * @enum SpriteType
 */
 /**
 * @property {Number} SIMPLE
 */
/**
 * @property {Number} SLICED
 */
/**
 * @property {Number} TILED
 */
/**
 * @property {Number} FILLED
 */
var SpriteType = cc.Scale9Sprite.RenderingType;

var FillType = cc.Scale9Sprite.FillType;

var BlendFactor = cc.BlendFunc.BlendFactor;
/**
 * Sprite Size can track trimmed size, raw size or none
 * @enum SizeMode
 */
var SizeMode = cc.Enum({
    /**
     * @property {Number} CUSTOM
     */
    CUSTOM: 0,
    /**
     * @property {Number} TRIMMED
     */
    TRIMMED: 1,
    /**
     * @property {Number} RAW
     */
    RAW: 2
});
/**
 * Renders a sprite in the scene.
 * @class Sprite
 * @extends _RendererUnderSG
 */
var Sprite = cc.Class({
    name: 'cc.Sprite',
    extends: require('./CCRendererUnderSG'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
        inspector: 'app://editor/page/inspector/sprite.html'
    },

    ctor: function() {
        this._blendFunc = cc.BlendFunc.ALPHA_NON_PREMULTIPLIED;
    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        _type: SpriteType.SIMPLE,
        //FIXME:_useOriginalSize is deprecated, since v0.8, it need to be deleted
        _useOriginalSize: true,
        _sizeMode: -1,
        _fillType: 0,
        _fillCenter: cc.v2(0,0),
        _fillStart: 0,
        _fillRange: 0,
        _isTrimmedMode: true,
        /**
         * The Sprite Atlas.
         * @property _atlas
         * @type {SpriteAtlas}
         */
        _atlas: {
            default: null,
            type: cc.SpriteAtlas,
            tooltip: 'i18n:COMPONENT.sprite.atlas',
            editorOnly: true,
            visible: true,
            animatable: false
        },

        /**
         * The sprite frame of the sprite.
         * @property spriteFrame
         * @type {SpriteFrame}
         */
        spriteFrame: {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value, force) {
                var lastSprite = this._spriteFrame;
                this._spriteFrame = value;
                this._applySpriteFrame(lastSprite);
                // color cleared after reset texture, should re-apply color
                this._sgNode.setColor(this.node._color);
                this._sgNode.setOpacity(this.node._opacity);
            },
            type: cc.SpriteFrame,
        },

        /**
         * The sprite type.
         * @property type
         * @type {SpriteType}
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
         * Filled type
         *  @property
         */
        fillType : {
            get: function () {
                return this._fillType;
            },
            set: function(value) {
                this._fillType = value;
                this._sgNode && this._sgNode.setFillType(value);
            },
            type: FillType
        },

        fillCenter: {
            get: function() {
                return this._fillCenter;
            },
            set: function(value) {
                this._fillCenter = cc.v2(value);
                this._sgNode && this._sgNode.setFillCenter(this._fillCenter);
            },
        },

        fillStart: {
            get: function() {
                return this._fillStart;
            },
            set: function(value) {
                this._fillStart = cc.clampf(value, -1, 1);
                this._sgNode && this._sgNode.setFillStart(value);
            },
        },

        fillRange: {
            get: function() {
                return this._fillRange;
            },
            set: function(value) {
                this._fillRange = cc.clampf(value, -1, 1);
                this._sgNode && this._sgNode.setFillRange(value);
            },
        },
        /**
         * specify the rendering mode
         * @property isTrimmedMode
         * @type {Boolean}
         */
        isTrimmedMode: {
            get: function () {
                return this._isTrimmedMode;
            },
            set: function (value) {
                if (this._isTrimmedMode !== value) {
                    this._isTrimmedMode = value;
                    this._sgNode.enableTrimmedContentSize(value);
                }
            },
            animatable: false
        },

        /**
         * specify the source Blend Factor
         * @property srcBlendFactor
         * @type {BlendFactor}
         */
        srcBlendFactor: {
            get: function() {
                return this._blendFunc.src;
            },
            set: function(value) {
                this._blendFunc.src = value;
                this._sgNode.setBlendFunc(this._blendFunc);
            },
            animatable: false,
            type:BlendFactor
        },

        /**
         * specify the destination Blend Factor
         * @property dstBlendFactor
         * @type {BlendFactor}
         */
        dstBlendFactor: {
            get: function() {
                return this._blendFunc.dst;
            },
            set: function(value) {
                this._blendFunc.dst = value;
                this._sgNode.setBlendFunc(this._blendFunc);
            },
            animatable: false,
            type: BlendFactor
        },

        //FIXME:_useOriginalSize is deprecated, since v0.8, it need to be deleted
        useOriginalSize: {
            get: function () {
                return this._useOriginalSize;
            },
            set: function (value) {
                this._useOriginalSize = value;
                if (value) {
                    this._applySpriteSize();
                }
            },
            animatable: false,
            tooltip: 'i18n:COMPONENT.sprite.original_size',
        },
        /**
         * specify the size tracing mode
         * @property sizeMode
         * @type {SizeMode}
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
            type: SizeMode
        }
    },

    statics: {
        FillType: FillType,
        Type: SpriteType,
        SizeMode: SizeMode,
    },

    /**
     * Sets whether the sprite is visible or not.
     * @method setVisible
     * @param {Boolean} visible
     * @override
     */
    setVisible: function (visible) {
        this.enabled = visible;
    },

    /**
     * Toggle 9-slice feature.
     * If Scale9Sprite is 9-slice disabled, the Scale9Sprite will rendered as a normal sprite.
     * @method setScale9Enabled
     * @param {Boolean} enabled - True to enable 9-slice, false otherwise.
     */
    setScale9Enabled: function (enabled) {
        this.type = enabled ? cc.Scale9Sprite.RenderingType.SLICED : cc.Scale9Sprite.RenderingType.SIMPLE;
    },

    /**
     * Query whether the Scale9Sprite is enable 9-slice or not.
     * @method isScale9Enabled
     * @return {Boolean} True if 9-slice is enabled, false otherwise.
     */
    isScale9Enabled: function () {
        return this.type === cc.Scale9Sprite.RenderingType.SLICED;
    },

    /**
     * Initializes a 9-slice sprite with a texture file, a delimitation zone and
     * with the specified cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithFile
     * @param {String} file - The name of the texture file.
     * @param {Rect} rect - The rectangle that describes the sub-part of the texture that
     * is the whole image. If the shape is the whole texture, set this to the texture's full rect.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithFile: function (file) {
        this._sgNode.initWithFile(file);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame and with the specified
     * cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithSpriteFrame
     * @param {SpriteFrame} spriteFrame - The sprite frame object.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithSpriteFrame: function (spriteFrame) {
        this._spriteFrame = spriteFrame;
        this._sgNode.initWithSpriteFrame(spriteFrame);
    },

    /**
     * Initializes a 9-slice sprite with an sprite frame name and with the specified
     * cap insets.
     * Once the sprite is created, you can then call its "setContentSize:" method
     * to resize the sprite will all it's 9-slice goodness intract.
     * It respects the anchorPoint too.
     *
     * @method initWithSpriteFrameName
     * @param {String} spriteFrameName - The sprite frame name.
     * @param {Rect} capInsets - The values to use for the cap insets.
     */
    initWithSpriteFrameName: function (spriteFrameName) {
        var initialized = this._sgNode.initWithSpriteFrame(spriteFrameName);
        if (initialized === false) {
            return;
        }
        this._spriteFrame = this._sgNode.getSpriteFrame();
    },

    /**
     * Query the sprite's original size.
     * @method getOriginalSize
     * @return {Size} Sprite size.
     */
    getOriginalSize: function () {
        return this._sgNode.getOriginalSize();
    },

    /**
     * Change the left sprite's cap inset.
     * @method setInsetLeft
     * @param {Number} leftInset - The values to use for the cap inset.
     */
    setInsetLeft: function (insetLeft) {
        this._sgNode.setInsetLeft(insetLeft);
    },

    /**
     * Query the left sprite's cap inset.
     * @method getInsetLeft
     * @return {Number} The left sprite's cap inset.
     */
    getInsetLeft: function () {
        return this._sgNode.getInsetLeft();
    },

    /**
     * Change the top sprite's cap inset.
     * @method setInsetTop
     * @param {Number} topInset - The values to use for the cap inset.
     */
    setInsetTop: function (insetTop) {
        this._sgNode.setInsetTop(insetTop);
    },

    /**
     * Query the top sprite's cap inset.
     * @method getInsetTop
     * @return {Number} The top sprite's cap inset.
     */
    getInsetTop: function () {
        return this._sgNode.getInsetTop();
    },

    /**
     * Change the right sprite's cap inset.
     * @method setInsetRight
     * @param {Number} rightInset - The values to use for the cap inset.
     */
    setInsetRight: function (insetRight) {
        this._sgNode.setInsetRight(insetRight);
    },

    /**
     * Query the right sprite's cap inset.
     * @method getInsetRight
     * @return {Number} The right sprite's cap inset.
     */
    getInsetRight: function () {
        return this._sgNode.getInsetRight();
    },

    /**
     * Change the bottom sprite's cap inset.
     * @method setInsetBottom
     * @param {Number} bottomInset - The values to use for the cap inset.
     */
    setInsetBottom: function (insetBottom) {
        this._sgNode.setInsetBottom(insetBottom);
    },

    /**
     * @brief Query the bottom sprite's cap inset.
     * @method getInsetBottom
     * @return {Number} The bottom sprite's cap inset.
     */
    getInsetBottom: function () {
        return this._sgNode.getInsetBottom();
    },

    onLoad: function () {
        this._super();
        this.node.on('size-changed', this._resized, this);
    },

    onEnable: function () {
        if (this._sgNode) {
            if (this._spriteFrame && this._spriteFrame.textureLoaded()) {
                this._sgNode.setVisible(true);
            }
        }
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
    },

    _validateSizeMode: function() {
        //do processing
        if (-1 === this._sizeMode) {
            //FIXME:_useOriginalSize is deprecated, since v0.8, it need to be deleted
            if (this._useOriginalSize) {
                this._sizeMode = SizeMode.TRIMMED;
            } else {
                this._sizeMode = SizeMode.CUSTOM;
            }
            this._isTrimmedMode = true;
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

        if (this._spriteFrame) {
            if (this._spriteFrame.textureLoaded()) {
                this._onSpriteFrameLoaded(null);
            }
            else {
                this._spriteFrame.once('load', this._onSpriteFrameLoaded, this);
            }
        }
        else {
            sgNode.setVisible(false);
        }

        if (CC_EDITOR) {
            // Set atlas
            this._applyAtlas(this._spriteFrame);
        }
    },

    _createSgNode: function () {
        return new cc.Scale9Sprite();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        
        this._validateSizeMode();
        this._applySpriteFrame(null);

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
        sgNode.setBlendFunc(this._blendFunc);
    },

    _resized: function () {
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

var misc = require('../utils/misc');
var SameNameGetSets = ['atlas', 'capInsets', 'insetLeft', 'insetTop', 'insetRight', 'insetBottom'];
var DiffNameGetSets = {
    type: [null, 'setRenderingType']
};
misc.propertyDefine(Sprite, SameNameGetSets, DiffNameGetSets);

cc.Sprite = module.exports = Sprite;
