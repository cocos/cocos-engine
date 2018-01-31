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

/**
 * !#en A distortion used to change the rendering of simple sprite.If will take effect after sprite component is added.
 * !#zh 扭曲效果组件,用于改变SIMPLE类型sprite的渲染,只有当sprite组件已经添加后,才能起作用.
 * @class SpriteDistortion
 * @extends Component
 * @example
 *  // Create a new node and add sprite components.
 *  var node = new cc.Node("New Sprite");
 *  var sprite = node.addComponent(cc.Sprite);
 *  var spriteDistortion = node.addComponent(cc.SpriteDistortion);
 *  node.parent = this.node;
 */

var SpriteDistortion = cc.Class({
    name: 'cc.SpriteDistortion', extends: require('./CCComponent'),
    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.renderers/SpriteDistortion',
        executeInEditMode: true,
        requireComponent: cc.Sprite,
    },

    ctor: function() {
        this._spriteSGNode = null;
    },

    properties: {
        /**
         * !#en Change the UV offset for distortion rendering.
         * !#zh 在渲染时改变UV的整体偏移.
         * @property offset
         * @type {Vec2}
         * @example
         * distortion.offset = new cc.Vec2(0.5, 0.3);;
         */
        _distortionOffset: cc.v2(0.0,0.0),
        offset: {
            get: function() {
                return this._distortionOffset;
            },
            set:function(value) {
                this._distortionOffset.x = value.x;
                this._distortionOffset.y = value.y;
                if(this._spriteSGNode) {
                    this._spriteSGNode.setDistortionOffset(this._distortionOffset);
                }
            }
        },

        /**
         * !#en Change the UV scale for distortion rendering.
         * !#zh 在渲染时改变UV的寻址系数
         * @property tiling
         * @type {Vec2}
         * @example
         * distortion.tiling = new cc.Vec2(0.5, 0.3);;
         */
        _distortionTiling: cc.v2(1.0,1.0),
        tiling: {
            get: function() {
                return this._distortionTiling;
            },
            set:function(value) {
                this._distortionTiling.x = value.x;
                this._distortionTiling.y = value.y;
                if(this._spriteSGNode) {
                    this._spriteSGNode.setDistortionTiling(this._distortionTiling);
                }
            }
        },
    },

    onEnable: function () {
        var sprite = this.node.getComponent('cc.Sprite');
        var sgNode = this._spriteSGNode = sprite && sprite._sgNode;
        if(this._spriteSGNode) {
            sgNode.setState(cc.Scale9Sprite.state.DISTORTION);
            sgNode.setDistortionOffset(this._distortionOffset);
            sgNode.setDistortionTiling(this._distortionTiling);
        }
    },

    onDisable: function () {
        if(this._spriteSGNode) {
            this._spriteSGNode.setState(cc.Scale9Sprite.state.NORMAL);
        }

        this._spriteSGNode = null;
    },

});

cc.SpriteDistortion = module.exports = SpriteDistortion;
