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

/**
 * !#en TiledTile can control the specified map tile. 
 * It will apply the node rotation, scale, translate to the map tile.
 * You can change the TiledTile's gid to change the map tile's style.
 * !#zh TiledTile 可以单独对某一个地图块进行操作。
 * 他会将节点的旋转，缩放，平移操作应用在这个地图块上，并可以通过更换当前地图块的 gid 来更换地图块的显示样式。
 * @class TiledTile
 * @extends Component
 */
let TiledTile = cc.Class({
    name: 'cc.TiledTile',
    extends: cc.Component,

    editor: CC_EDITOR && {
        executeInEditMode: true,
        menu: 'i18n:MAIN_MENU.component.renderers/TiledTile',
    },

    ctor () {
        this._layer = null;
    },

    properties: {
        _x: 0,
        _y: 0,

        /**
         * !#en Specify the TiledTile horizontal coordinate，use map tile as the unit.
         * !#zh 指定 TiledTile 的横向坐标，以地图块为单位
         * @property {Number} x
         * @default 0
         */
        x: {
            get () {
                return this._x;
            },
            set (value) {
                if (value === this._x) return;
                if (this._layer && this._layer._isInvalidPosition(value, this._y)) {
                    cc.warn(`Invalid x, the valid value is between [%s] ~ [%s]`, 0, this._layer._layerSize.width);
                    return;
                }
                this._resetTile();
                this._x = value;
                this._updateInfo();
            },
            type: cc.Integer
        },

        /**
         * !#en Specify the TiledTile vertical coordinate，use map tile as the unit.
         * !#zh 指定 TiledTile 的纵向坐标，以地图块为单位
         * @property {Number} y
         * @default 0
         */
        y: {
            get () {
                return this._y;
            },
            set (value) {
                if (value === this._y) return;
                if (this._layer && this._layer._isInvalidPosition(this._x, value)) {
                    cc.warn(`Invalid y, the valid value is between [%s] ~ [%s]`, 0, this._layer._layerSize.height);
                    return;
                }
                this._resetTile();
                this._y = value;
                this._updateInfo();
            },
            type: cc.Integer
        },

        /**
         * !#en Specify the TiledTile gid.
         * !#zh 指定 TiledTile 的 gid 值
         * @property {Number} gid
         * @default 0
         */
        gid: {
            get () {
                if (this._layer) {
                    return this._layer.getTileGIDAt(this._x, this._y);
                }
                return 0;
            },
            set (value) {
                if (this._layer) {
                    this._layer.setTileGIDAt(value, this._x, this._y);
                }
            },
            type: cc.Integer
        }
    },

    onEnable () {
        let parent = this.node.parent;
        this._layer = parent.getComponent(cc.TiledLayer);
        this._resetTile();
        this._updateInfo();
    },

    onDisable () {
        this._resetTile();
    },

    _resetTile () {
        if (this._layer && this._layer.getTiledTileAt(this._x, this._y) === this) {
            this._layer.setTiledTileAt(this._x, this._y, null);
        }
    },

    _updateInfo () {
        if (!this._layer) return;

        let x = this._x,  y = this._y;
        if (this._layer.getTiledTileAt(x, y)) {
            cc.warn('There is already a TiledTile at [%s, %s]', x, y);
            return;
        }
        this.node.setPosition(this._layer.getPositionAt(x, y));
        this._layer.setTiledTileAt(x, y, this);
    },
});

cc.TiledTile = module.exports = TiledTile;
