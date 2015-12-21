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

var SpriteType = cc.SpriteType;

/**
 * Renders a sprite in the scene.
 * @class Sprite
 * @extends _ComponentInSG
 */
var Sprite = cc.Class({
    name: 'cc.Sprite',
    extends: require('./CCComponentInSG'),

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/Sprite',
        inspector: 'app://editor/page/inspector/sprite.html'
    },

    properties: {
        _spriteFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        _type: SpriteType.SIMPLE,
        _useOriginalSize: true,

        /**
         * The Sprite Atlas.
         * @property _atlas
         * @type {SpriteAtlas}
         */
        _atlas: {
            default: '',
            type: cc.SpriteAtlas,
            tooltip: 'i18n:COMPONENT.sprite.atlas',
            editorOnly: true,
            visible: true
        },

        /**
         * The sprite frame of the sprite.
         * @property sprite
         * @type {SpriteFrame}
         */
        spriteFrame: {
            get: function () {
                return this._spriteFrame;
            },
            set: function (value, force) {
                var lastSprite = this._spriteFrame;
                this._spriteFrame = value;
                if (this._sgNode) {
                    this._applySprite(this._sgNode, lastSprite);
                    // color cleared after reset texture, should reapply color
                    this._sgNode.setColor(this.node._color);
                    this._sgNode.setOpacity(this.node._opacity);
                }
            },
            type: cc.SpriteFrame,
            tooltip: 'i18n:COMPONENT.sprite.sprite_frame',
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
            tooltip: 'i18n:COMPONENT.sprite.type',
        },

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
            tooltip: 'i18n:COMPONENT.sprite.original_size',
        },

        /**
         * Only for editor to calculate bounding box.
         */
        localSize: {
            get: function () {
                var sgNode = this._sgNode;
                if (!sgNode) {
                    return cc.size(0, 0);
                }
                return cc.size(sgNode.width, sgNode.height);
            },
            visible: false,
        }
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
    setScale9Enabled: function(enabled) {
        this.type = enabled ? cc.SpriteType.SLICED : cc.SpriteType.SIMPLE;
    },

    /**
     * Query whether the Scale9Sprite is enable 9-slice or not.
     * @method isScale9Enabled
     * @return {Boolean} True if 9-slice is enabled, false otherwise.
     */
    isScale9Enabled: function(){
        return this.type === cc.SpriteType.SLICED
    },

    /**
     * Get the original no 9-sliced sprite.
     * @method getSprite
     * @return {SpriteFrame} A sprite instance.
     */
    getSprite : function(){
        return this._spriteFrame;
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
        this._spriteFrame = this._sgNode.getSprite();
    },

    /**
     * Sets a new sprite frame to the sprite.
     * @method setSpriteFrame
     * @param {SpriteFrame} spriteFrame
     * @param {Rect} capInsets
     */
    setSpriteFrame: function (spriteFrame) {
        this.spriteFrame = spriteFrame;
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
    setInsetLeft: function(insetLeft){
        this._sgNode.setInsetLeft(insetLeft);
    },

    /**
     * Query the left sprite's cap inset.
     * @method getInsetLeft
     * @return {Number} The left sprite's cap inset.
     */
    getInsetLeft: function(){
        return this._sgNode.getInsetLeft();
    },

    /**
     * Change the top sprite's cap inset.
     * @method setInsetTop
     * @param {Number} topInset - The values to use for the cap inset.
     */
    setInsetTop: function(insetTop){
        this._sgNode.setInsetTop(insetTop);
    },

    /**
     * Query the top sprite's cap inset.
     * @method getInsetTop
     * @return {Number} The top sprite's cap inset.
     */
    getInsetTop: function(){
        return this._sgNode.getInsetTop();
    },

    /**
     * Change the right sprite's cap inset.
     * @method setInsetRight
     * @param {Number} rightInset - The values to use for the cap inset.
     */
    setInsetRight: function(insetRight){
        this._sgNode.setInsetRight(insetRight);
    },

    /**
     * Query the right sprite's cap inset.
     * @method getInsetRight
     * @return {Number} The right sprite's cap inset.
     */
    getInsetRight: function(){
        return this._sgNode.getInsetRight();
    },

    /**
     * Change the bottom sprite's cap inset.
     * @method setInsetBottom
     * @param {Number} bottomInset - The values to use for the cap inset.
     */
    setInsetBottom: function(insetBottom) {
        this._sgNode.setInsetBottom(insetBottom);
    },

    /**
     * @brief Query the bottom sprite's cap inset.
     * @method getInsetBottom
     * @return {Number} The bottom sprite's cap inset.
     */
    getInsetBottom: function(){
        return this._sgNode.getInsetBottom();
    },

    onLoad: function () {
        this._super();
        this.node.on('size-changed', this._resized, this);
    },

    onDestroy: function () {
        this._super();
        this.node.off('size-changed', this._resized, this);
    },

    _applyAtlas: CC_EDITOR && function ( spriteFrame ) {
        // Set atlas
        if (spriteFrame._atlasUuid) {
            var self = this;
            cc.AssetLibrary.loadAsset(spriteFrame._atlasUuid, function(err, asset) {
                self._atlas = asset;
            });
        } else {
            this._atlas = null;
        }
    },

    _applyCapInset: function (node) {
        if (this._type === SpriteType.SLICED) {
            var node = node || this._sgNode;
            node.setInsetTop(this._spriteFrame.insetTop);
            node.setInsetBottom(this._spriteFrame.insetBottom);
            node.setInsetRight(this._spriteFrame.insetRight);
            node.setInsetLeft(this._spriteFrame.insetLeft);
        }
    },

    _applySpriteSize: function (node) {
        var node = node || this._sgNode;
        if (this._useOriginalSize) {
            var rect = this._spriteFrame.getOriginalSize();
            node.setContentSize(cc.size(rect.width, rect.height));
        }
        else {
            node.setContentSize(this.node.getContentSize(true));
        }
    },

    _applySprite: function (sgNode, oldSprite) {
        if (oldSprite && oldSprite.off) {
            oldSprite.off('load', this._applyCapInset, this);
        }
        if (!this._spriteFrame) return;

        sgNode.setSpriteFrame(this._spriteFrame);
        var locLoaded = this._spriteFrame.textureLoaded();
        if (!locLoaded) {
            if ( !this._useOriginalSize ) {
                sgNode.setContentSize(this.node.getContentSize(true));
            }
            this._spriteFrame.once('load', function () {
                this._applyCapInset();
                this._applySpriteSize();
            }, this);
        }
        else {
            this._applyCapInset(sgNode);
            this._applySpriteSize(sgNode);
        }

        if (CC_EDITOR) {
            // Set atlas
            this._applyAtlas(this._spriteFrame);
        }
    },

    _createSgNode: function () {
        var sgNode = new cc.Scale9Sprite();
        sgNode.setRenderingType(this._type);
        this._applySprite(sgNode, null);
        return sgNode;
    },

    _resized: function () {
        this.useOriginalSize = false;
    },
});

var misc = require('../utils/misc');
var SameNameGetSets = ['atlas', 'capInsets', 'insetLeft', 'insetTop', 'insetRight', 'insetBottom'];
var DiffNameGetSets = {
    type: [ null, 'setRenderingType'],
    spriteFrame: ['getSprite', null],
};
misc.propertyDefine(Sprite, SameNameGetSets, DiffNameGetSets);

cc.Sprite = module.exports = Sprite;
