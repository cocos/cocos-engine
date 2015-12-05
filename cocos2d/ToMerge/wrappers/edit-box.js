var Vec2 = cc.Vec2;

var NodeWrapper = require('./node');

var EditBoxWrapper = cc.Class({
    name: 'cc.EditBoxWrapper',
    extends: NodeWrapper,

    properties: {
        normalBackground: {
            default: '',
            url: cc.Texture2D,

            notify: function() {
                if (!this.targetN) {
                    return;
                }
                var value = this.normalBackground;
                var normalScale9Sprite = new cc.Scale9Sprite(value);
                normalScale9Sprite.setPreferredSize(this.targetN.getContentSize());
                var oldPosition = this.targetN.getPosition();

                this.targetN.initWithSizeAndBackgroundSprite(this.targetN.getContentSize(), normalScale9Sprite);
                this.targetN.setPosition(oldPosition);
            }
        },
        childrenN: {
            get: function() {
                return [];
            }
        },
        size: {
            get: function() {
                var size = this.targetN.getPreferredSize();
                return new Vec2(size.width, size.height);
            },

            set: function(value) {
                if (value instanceof Vec2) {
                    this.targetN.setPreferredSize(cc.size(value.x, value.y));
                } else {
                    cc.error('The value must be cc.Vec2 -> size.');
                }
            }
        },
        _placeholder: {
            default: 'input your text here'
        },
        placeholder: {
            get: function() {
                return this.targetN.getPlaceHolder();
            },
            set: function(value) {
                if (typeof value === 'string') {
                    this.targetN.setPlaceHolder(value);
                } else {
                    cc.error('The value must be string -> placeholder');
                }
            }
        },
        text: {
            get: function() {
                return this.targetN.getString();
            },
            set: function(value) {
                if (typeof value === 'string') {
                    this.targetN.setString(value);
                } else {
                    cc.error('The value must be string -> text.');
                }
            }
        },
        _text: {
            default: ''
        },
        fontColor: {
            default: cc.Color.WHITE,
            type: cc.Color,

            notify: function() {
                if (!this.targetN) return;

                var value = this.fontColor;
                if (value instanceof cc.Color) {
                    this.targetN.setFontColor(value);
                } else {
                    cc.error('The value must be cc.Color -> fontColor.');
                }
            }
        },
        fontName: {
            default: 'Arial',

            notify: function() {
                if (!this.targetN) return;

                var value = this.fontName;
                if (typeof value === 'string') {
                    this.targetN.setFontName(value);
                } else {
                    cc.error('The value must be a string -> fontName.');
                }
            }
        },
        fontSize: {
            default: 14,

            notify: function() {
                if (!this.targetN) return;

                var value = this.fontSize;
                if (!isNaN(value)) {
                    this.targetN.setFontSize(value);
                } else {
                    cc.error('The value is NaN.');
                }
            }
        },
        placeholderColor: {
            default: cc.Color.WHITE,
            type: cc.Color,

            notify: function() {
                if (!this.targetN) return;

                var value = this.placeholderColor;
                if (value instanceof cc.Color) {
                    this.targetN.setPlaceholderFontColor(value);
                } else {
                    cc.error('The value must be cc.Color -> placeholderColor.');
                }
            }
        },
        placeholderSize: {
            default: 12,

            notify: function() {
                if (!this.targetN) return;

                var value = this.placeholderSize;
                if (!isNaN(value)) {
                    this.targetN.setPlaceholderFontSize(value);
                } else {
                    cc.error('The value is NaN!');
                }
            }
        },
        maxLength: {
            get: function() {
                return this.targetN.getMaxLength();
            },
            set: function(value) {
                if (!isNaN(value)) {
                    this.targetN.setMaxLength(value);
                } else {
                    cc.error('The value is NaN!');
                }
            }
        },
        _maxLength: {
            default: 50
        },
        inputMode: {
            default: cc.EditBox.InputMode.ANY,
            type: cc.EditBox.InputMode,
            notify: function() {
                if (!this.targetN) return;

                var value = this.inputMode;
                if (!isNaN(value)) {
                    this.targetN.setInputMode(value);
                } else {
                    cc.error('The value must be cc.EditBox.InputMode -> inputMode.');
                }
            }
        },
        inputFlag: {
            default: cc.EditBox.InputFlag.SENSITIVE,
            type: cc.EditBox.InputFlag,
            notify: function() {
                if (!this.targetN) return;

                var value = this.inputFlag;
                if (!isNaN(value)) {
                    this.targetN.setInputFlag(value);
                } else {
                    cc.error('The value must be cc.EditBox.InputFlag -> inputFlag.');
                }
            }
        },
        keyboardType: {
            default: cc.KeyboardReturnType.DEFAULT,
            type: cc.KeyboardReturnType,
            notify: function() {
                if (!this.targetN) return;

                var value = this.keyboardType;
                if (!isNaN(value)) {
                    this.targetN.setReturnType(value);
                } else {
                    cc.error('The value must be cc.KeyboardReturnType -> keyboardType.');
                }
            }

        }
    },
    onBeforeSerialize: function() {
        NodeWrapper.prototype.onBeforeSerialize.call(this);

        this._text = this.text;
        this._placeholder = this.placeholder;
        this._maxLength = this.maxLength;
    },

    createNode: function(node) {
        var contentSize;
        if (this._size) {
            contentSize = cc.size(this._size[0], this._size[1]);
        } else {
            contentSize = cc.size(100, 50);
        }

        var normalScale9Sprite;
        if (this.normalBackground) {
            normalScale9Sprite = new cc.Scale9Sprite(this.normalBackground);
        } else {
            normalScale9Sprite = new cc.Scale9Sprite();
        }

        node = node || new cc.EditBox(contentSize, normalScale9Sprite, new cc.Scale9Sprite(), new cc.Scale9Sprite());
        NodeWrapper.prototype.createNode.call(this, node);

        node.setPreferredSize(contentSize);
        node.setString(this._text);
        node.setFontColor(this.fontColor);
        node.setFontSize(this.fontSize);
        node.setFontName(this.fontName);
        node.setPlaceHolder(this._placeholder);
        node.setPlaceholderFontSize(this.placeholderSize);
        node.setPlaceholderFontColor(this.placeholderColor);
        node.setMaxLength(this._maxLength);
        node.setInputMode(this.inputMode);
        node.setInputFlag(this.inputFlag);
        node.setReturnType(this.keyboardType);

        return node;
    }
});

cc.EditBoxWrapper = module.exports = EditBoxWrapper;
