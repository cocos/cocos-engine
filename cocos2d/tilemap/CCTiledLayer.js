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
const RenderComponent = require('../core/components/CCRenderComponent');
const Material = require('../core/assets/material/CCMaterial');
const RenderFlow = require('../core/renderer/render-flow');

import { mat4, vec2 } from '../core/vmath';
let _mat4_temp = mat4.create();
let _vec2_temp = vec2.create();

/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */
let TiledLayer = cc.Class({
    name: 'cc.TiledLayer',

    // Inherits from the abstract class directly,
    // because TiledLayer not create or maintains the sgNode by itself.
    extends: RenderComponent,

    editor: {
        inspector: 'packages://inspector/inspectors/comps/tiled-layer.js',
    },

    properties: {
        // use to test map clip, default visible false
        _debugClip:{
            default: false,
            notify () {
                if (this._debugClip) {
                    this._enableClipNode();
                } else {
                    this._disableClipNode();
                }
            },
            serializable: false,
            editorOnly: true,
            visible: false,
            animatable: false,
            displayName: "Debug Clip Rect",
        },
    },

    ctor () {
        this._userNodeGrid = {};// [row][col] = {count: 0, nodesList: []};
        this._userNodeMap = {};// [id] = node;
        this._userNodeId = 1;
        this._userNodeDirty = false;

        // store the layer tiles node, index is caculated by 'x + width * y', format likes '[0]=tileNode0,[1]=tileNode1, ...'
        this._tiledTiles = [];

        // store the layer tilesets index array
        this._tilesetIndexArr = [];
        // texture id to material index
        this._texIdToMatIndex = {};

        this._viewPort = {x:-1, y:-1, width:-1, height:-1};
        this._clipRect = {
            leftDown:{row:-1, col:-1},
            rightTop:{row:-1, col:-1}
        };
        this._clipDirty = true;
        this._rightTop = {row:-1, col:-1};

        this._layerInfo = null;
        this._mapInfo = null;

        // record max or min tile texture offset, 
        // it will make clip rect more large, which insure clip rect correct.
        this._topOffset = 0;
        this._downOffset = 0;
        this._leftOffset = 0;
        this._rightOffset = 0;

        this._tempRowCol = {row:0, col:0};

        // store the layer tiles, index is caculated by 'x + width * y', format likes '[0]=gid0,[1]=gid1, ...'
        this._tiles = [];
        // vertex array
        this._vertices = [];
        // vertices dirty
        this._verticesDirty = true;

        this._layerName = '';
        this._layerOrientation = null;
        // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'
        this._texGrids = null;
        // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'
        this._textures = null;
        this._tilesets = null;

        // use to debug layer clip range
        this._clipHandleNode = null;

        this._leftDownToCenterX = 0;
        this._leftDownToCenterY = 0;

        this._hasAniGrid = false;
        this._animations = null;

        // switch of clip
        this._enableClip = cc.macro.ENABLE_TILEDMAP_CULLING;
    },

    _hasAnimation () {
        return this._hasAniGrid;
    },

    /**
     * !#en enable or disable clip
     * !#zh 开启或关闭裁剪。
     * @method enableClip
     * @param value
     */
    enableClip (value) {
        if (this._enableClip != value) {
            this._enableClip = value;
            this._clipDirty = true;
        }
    },

    /**
     * !#en Adds user's node into layer.
     * !#zh 添加用户节点。
     * @method addUserNode
     * @param node
     */
    addUserNode (node) {
        let nodeId = node._nodeId_;
        if (nodeId) {
            cc.warn("CCTiledLayer:insertUserNode node has insert");
            return;
        }

        node._nodeId_ = this._userNodeId;
        node._row_ = -1;
        node._col_ = -1;
        node._tiledLayer_ = this;
        node.parent = this.node;
        node._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;

        this._userNodeMap[node._nodeId_] = node;

        let tempRowCol = this._tempRowCol;
        this._positionToRowCol(node.x, node.y, tempRowCol);
        this._addUserNodeToGrid(node, tempRowCol);
        this._updateClipOffsetByUserNode(node);
        node.on(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, node);
        node.on(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, node);
        this._userNodeId++;
        // nodeId is too large
        if (this._userNodeId >= Number.MAX_SAFE_INTEGER) {
            this._updateAllUserNode();
        }
    },

    /**
     * !#en Removes user's node.
     * !#zh 移除用户节点。
     * @method removeUserNode
     * @param node
     */
    removeUserNode (node) {
        let nodeId = node._nodeId_;
        if (!nodeId) {
            cc.warn("CCTiledLayer:removeUserNode node is not exist");
            return;
        }
        node.off(cc.Node.EventType.POSITION_CHANGED, this._userNodePosChange, node);
        node.off(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, node);
        this._removeUserNodeFromGrid(node);
        if (nodeId) {
            delete this._userNodeMap[nodeId];
        }
        node._index_ = null;
        node._row_ = null;
        node._col_ = null;
        node._nodeId_ = null;
        node.removeFromParent(true);
        node._renderFlag &= ~RenderFlow.FLAG_BREAK_FLOW;
    },

    /**
     * !#en Destroy user's node.
     * !#zh 销毁用户节点。
     * @method destroyUserNode
     * @param node
     */
    destroyUserNode (node) {
        this.removeUserNode(node);
        node.destroy();
    },

    _getNodesByRowCol (row, col) {
        let rowData = this._userNodeGrid[row];
        if (!rowData) return null;
        return rowData[col];
    },

    _getNodesCountByRow (row) {
        let rowData = this._userNodeGrid[row];
        if (!rowData) return 0;
        return rowData.count;
    },

    _updateAllUserNode () {
        let oldUserNodeMap = this._userNodeMap;
        this._userNodeGrid = {};
        let newUserNodeMap = this._userNodeMap = {};
        this._userNodeId = 1;
        for (let nodeId in oldUserNodeMap) {
            let node = oldUserNodeMap[nodeId];
            node._nodeId_ = this._userNodeId;
            this._userNodeId ++;
            newUserNodeMap[node._nodeId_] = node;

            let tempRowCol = this._tempRowCol;
            this._positionToRowCol(node.x, node.y, tempRowCol);
            this._addUserNodeToGrid(node, tempRowCol);
            this._updateClipOffsetByUserNode(node);
        }
    },

    _updateClipOffsetByUserNode (node) {
        if (this._topOffset < node.height) {
            this._topOffset = node.height;
        }
        if (this._downOffset > -node.height) {
            this._downOffset = -node.height;
        }
        if (this._leftOffset > -node.width) {
            this._leftOffset = -node.width;
        }
        if (this._rightOffset < node.width) {
            this._rightOffset = node.width;
        }
    },

    _userNodeSizeChange () {
        let node = this;
        let self = node._tiledLayer_;
        self._updateClipOffsetByUserNode(node);
    },

    _userNodePosChange () {
        let node = this;
        let self = node._tiledLayer_;
        let tempRowCol = self._tempRowCol;
        self._positionToRowCol(node.x, node.y, tempRowCol);
        // users pos not change
        if (tempRowCol.row === node._row_ && tempRowCol.col === node._col_) return;

        self._removeUserNodeFromGrid(node);
        self._addUserNodeToGrid(node, tempRowCol);
    },

    _removeUserNodeFromGrid (node) {
        let nodeId = node._nodeId_;
        if (!nodeId) return;
        let row = node._row_;
        let col = node._col_;
        let index = node._index_;

        let rowData = this._userNodeGrid[row];
        let colData = rowData && rowData[col];
        if (colData) {
            rowData.count --;
            colData.count --;
            colData.list[index] = null;
            if (colData.count <= 0) {
                colData.list.length = 0;
                colData.count = 0;
            }
        }

        node._row_ = -1;
        node._col_ = -1;
        node._index_ = -1;
        this._userNodeDirty = true;
    },

    _isInLayer (row, col) {
        return row >= 0 && col >= 0 && row <= this._rightTop.row && col <= this._rightTop.col;
    },

    _addUserNodeToGrid (node, tempRowCol) {
        let row = tempRowCol.row;
        let col = tempRowCol.col;
        if (this._isInLayer(row, col)) {
            let rowData = this._userNodeGrid[row] = this._userNodeGrid[row] || {count : 0};
            let colData = rowData[col] = rowData[col] || {count : 0, list: []};
            node._row_ = row;
            node._col_ = col;
            node._index_ = colData.list.length;
            rowData.count++;
            colData.count++;
            colData.list.push(node);
        } else {
            node._row_ = -1;
            node._col_ = -1;
            node._index_ = -1;
        }
        this._userNodeDirty = true;
    },

    _isUserNodeDirty () {
        return this._userNodeDirty;
    },

    _setUserNodeDirty (value) {
        this._userNodeDirty = value;
    },

    onEnable () {
        this._super();
        this.node.on(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
        this._activateMaterial();
    },

    onDisable () {
        this.node.off(cc.Node.EventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
    },

    _syncAnchorPoint () {
        this._leftDownToCenterX = this.node.width * this.node.anchorX;
        this._leftDownToCenterY = this.node.height * this.node.anchorY;
    },

    onDestroy () {
        this._super();
        if (this._buffer) {
            this._buffer.destroy();
            this._buffer = null;
        }
    },

    __preload () {
        this._disableClipNode();
    },

    /**
     * !#en Gets the layer name.
     * !#zh 获取层的名称。
     * @method getLayerName
     * @return {String}
     * @example
     * let layerName = tiledLayer.getLayerName();
     * cc.log(layerName);
     */
    getLayerName () {
        return this._layerName;
    },

    /**
     * !#en Set the layer name.
     * !#zh 设置层的名称
     * @method SetLayerName
     * @param {String} layerName
     * @example
     * tiledLayer.setLayerName("New Layer");
     */
    setLayerName (layerName) {
        this._layerName = layerName;
    },

    /**
     * !#en Return the value for the specific property name.
     * !#zh 获取指定属性名的值。
     * @method getProperty
     * @param {String} propertyName
     * @return {*}
     * @example
     * let property = tiledLayer.getProperty("info");
     * cc.log(property);
     */
    getProperty (propertyName) {
        return this._properties[propertyName];
    },

    /**
     * !#en Returns the position in pixels of a given tile coordinate.
     * !#zh 获取指定 tile 的像素坐标。
     * @method getPositionAt
     * @param {Vec2|Number} pos position or x
     * @param {Number} [y]
     * @return {Vec2}
     * @example
     * let pos = tiledLayer.getPositionAt(cc.v2(0, 0));
     * cc.log("Pos: " + pos);
     * let pos = tiledLayer.getPositionAt(0, 0);
     * cc.log("Pos: " + pos);
     */
    getPositionAt (pos, y) {
        let x;
        if (y !== undefined) {
            x = Math.floor(pos);
            y = Math.floor(y);
        }
        else {
            x = Math.floor(pos.x);
            y = Math.floor(pos.y);
        }
        
        let ret;
        switch (this._layerOrientation) {
            case cc.TiledMap.Orientation.ORTHO:
                ret = this._positionForOrthoAt(x, y);
                break;
            case cc.TiledMap.Orientation.ISO:
                ret = this._positionForIsoAt(x, y);
                break;
            case cc.TiledMap.Orientation.HEX:
                ret = this._positionForHexAt(x, y);
                break;
        }
        return ret;
    },

    _isInvalidPosition (x, y) {
        if (x && typeof x === 'object') {
            let pos = x;
            y = pos.y;
            x = pos.x;
        }
        return x >= this._layerSize.width || y >= this._layerSize.height || x < 0 || y < 0;
    },

    _positionForIsoAt (x, y) {
        return cc.v2(
            this._mapTileSize.width / 2 * ( this._layerSize.width + x - y - 1),
            this._mapTileSize.height / 2 * (( this._layerSize.height * 2 - x - y) - 2)
        );
    },

    _positionForOrthoAt (x, y) {
        return cc.v2(
            x * this._mapTileSize.width,
            (this._layerSize.height - y - 1) * this._mapTileSize.height
        );
    },

    _positionForHexAt (col, row) {
        let tileWidth = this._mapTileSize.width;
        let tileHeight = this._mapTileSize.height;
        let rows = this._layerSize.height;

        let index = Math.floor(col) + Math.floor(row) * this._layerSize.width;
        let gid = this._tiles[index];
        let tileset = this._texGrids[gid].tileset;
        let offset = tileset.tileOffset;

        let centerWidth = this.node.width / 2;
        let centerHeight = this.node.height / 2;
        let odd_even = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        let x = 0, y = 0;
        let diffX = 0;
        let diffX1 = 0;
        let diffY = 0;
        let diffY1 = 0;
        switch (this._staggerAxis) {
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_Y:
                diffX = 0;
                diffX1 = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? 0 : tileWidth / 2;
                if (row % 2 === 1) {
                    diffX = tileWidth / 2 * odd_even;
                }
                x = col * tileWidth + diffX + diffX1 + offset.x - centerWidth;
                y = (rows - row - 1) * (tileHeight - (tileHeight - this._hexSideLength) / 2) - offset.y - centerHeight;
                break;
            case cc.TiledMap.StaggerAxis.STAGGERAXIS_X:
                diffY = 0;
                diffY1 = (this._staggerIndex === cc.TiledMap.StaggerIndex.STAGGERINDEX_ODD) ? tileHeight / 2 : 0;
                if (col % 2 === 1) {
                    diffY = tileHeight / 2 * -odd_even;
                }
                x = col * (tileWidth - (tileWidth - this._hexSideLength) / 2) + offset.x - centerWidth;
                y = (rows - row - 1) * tileHeight + diffY + diffY1 - offset.y - centerHeight;
                break;
        }
        return cc.v2(x, y);
    },

    /**
     * !#en
     * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.
     * !#zh
     * 设置给定坐标的 tile 的 gid (gid = tile 全局 id)，
     * tile 的 GID 可以使用方法 “tileGIDAt” 来获得。<br />
     * 如果一个 tile 已经放在那个位置，那么它将被删除。
     * @method setTileGIDAt
     * @param {Number} gid
     * @param {Vec2|Number} posOrX position or x
     * @param {Number} flagsOrY flags or y
     * @param {Number} [flags]
     * @example
     * tiledLayer.setTileGIDAt(1001, 10, 10, 1)
     */
    setTileGIDAt (gid, posOrX, flagsOrY, flags) {
        if (posOrX === undefined) {
            throw new Error("cc.TiledLayer.setTileGIDAt(): pos should be non-null");
        }
        let pos;
        if (flags !== undefined || !(posOrX instanceof cc.Vec2)) {
            // four parameters or posOrX is not a Vec2 object
            pos = cc.v2(posOrX, flagsOrY);
        } else {
            pos = posOrX;
            flags = flagsOrY;
        }

        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
        if (this._isInvalidPosition(pos)) {
            throw new Error("cc.TiledLayer.setTileGIDAt(): invalid position");
        }
        if (!this._tiles || !this._tilesets || this._tilesets.length == 0) {
            cc.logID(7238);
            return;
        }
        if (gid !== 0 && gid < this._tilesets[0].firstGid) {
            cc.logID(7239, gid);
            return;
        }

        flags = flags || 0;
        let currentFlags = this.getTileFlagsAt(pos);
        let currentGID = this.getTileGIDAt(pos);

        if (currentGID === gid && currentFlags === flags) return;

        let gidAndFlags = (gid | flags) >>> 0;
        this._updateTileForGID(gidAndFlags, pos);
    },

    _updateTileForGID (gid, pos) {
        if (gid !== 0 && !this._texGrids[gid]) {
            return;
        }

        let idx = 0 | (pos.x + pos.y * this._layerSize.width);
        if (idx < this._tiles.length) {
            this._tiles[idx] = gid;
        }
    },

    /**
     * !#en
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * !#zh
     * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
     * 如果它返回 0，则表示该 tile 为空。<br />
     * @method getTileGIDAt
     * @param {Vec2|Number} pos or x
     * @param {Number} [y]
     * @return {Number}
     * @example
     * let tileGid = tiledLayer.getTileGIDAt(0, 0);
     */
    getTileGIDAt (pos, y) {
        if (pos === undefined) {
            throw new Error("cc.TiledLayer.getTileGIDAt(): pos should be non-null");
        }
        let x = pos;
        if (y === undefined) {
            x = pos.x;
            y = pos.y;
        }
        if (this._isInvalidPosition(x, y)) {
            throw new Error("cc.TiledLayer.getTileGIDAt(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7237);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[index];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_MASK) >>> 0;
    },

    getTileFlagsAt (pos, y) {
        if (!pos) {
            throw new Error("TiledLayer.getTileFlagsAt: pos should be non-null");
        }
        if (y !== undefined) {
            pos = cc.v2(pos, y);
        }
        if (this._isInvalidPosition(pos)) {
            throw new Error("TiledLayer.getTileFlagsAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7240);
            return null;
        }

        let idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[idx];

        return (tile & cc.TiledMap.TileFlag.FLIPPED_ALL) >>> 0;
    },

    // just for enable test clip
    _enableClipNode () {
        this._clipHandleNode = this.node.getChildByName("TESTCLIP");
        if (!this._clipHandleNode) {
            this._clipHandleNode = new cc.Node();
            this._clipHandleNode.name = 'TESTCLIP';
            this._clipHandleNode.parent = this.node;
            this._clipHandleNode.anchorX = 0;
            this._clipHandleNode.anchorY = 0;
            this._clipHandleNode.width = 300;
            this._clipHandleNode.height = 300;
        }
    },

    // just for disable test clip
    _disableClipNode () {
        this._clipHandleNode = this.node.getChildByName("TESTCLIP");
        if (this._clipHandleNode) {
            this._clipHandleNode.destroy();
            this._clipHandleNode = null;
        }
    },

    _setClipDirty (value) {
        this._clipDirty = value;
    },

    _isClipDirty () {
        return this._clipDirty;
    },

    // 'x, y' is the position of viewPort, which's anchor point is at the center of rect.
    // 'width, height' is the size of viewPort.
    _updateViewPort (x, y, width, height) {
        if (this._viewPort.width === width && 
            this._viewPort.height === height &&
            this._viewPort.x === x &&
            this._viewPort.y === y) {
            return;
        }
        this._viewPort.x = x;
        this._viewPort.y = y;
        this._viewPort.width = width;
        this._viewPort.height = height;

        // if map's type is iso, reserve bottom line is 2 to avoid show empty grid because of iso grid arithmetic
        let reserveLine = 1;
        if (this._layerOrientation === cc.TiledMap.Orientation.ISO) {
            reserveLine = 2;
        }

        let vpx = this._viewPort.x - this._offset.x + this._leftDownToCenterX;
        let vpy = this._viewPort.y - this._offset.y + this._leftDownToCenterY;

        let leftDownX = vpx + this._leftOffset;
        let leftDownY = vpy + this._downOffset;
        let rightTopX = vpx + width + this._rightOffset;
        let rightTopY = vpy + height + this._topOffset;

        let leftDown = this._clipRect.leftDown;
        let rightTop = this._clipRect.rightTop;
        let tempRowCol = this._tempRowCol;

        if (leftDownX < 0) leftDownX = 0;
        if (leftDownY < 0) leftDownY = 0;

        // calc left down
        this._positionToRowCol(leftDownX, leftDownY, tempRowCol);
        // make range large
        tempRowCol.row-=reserveLine;
        tempRowCol.col-=reserveLine;
        // insure left down row col greater than 0
        tempRowCol.row = tempRowCol.row > 0 ? tempRowCol.row : 0;
        tempRowCol.col = tempRowCol.col > 0 ? tempRowCol.col : 0;        

        if (tempRowCol.row !== leftDown.row || tempRowCol.col !== leftDown.col) {
            leftDown.row = tempRowCol.row;
            leftDown.col = tempRowCol.col;
            this._clipDirty = true;
        }

        // show nothing
        if (rightTopX < 0 || rightTopY < 0) {
            tempRowCol.row = -1;
            tempRowCol.col = -1;
        } else {
            // calc right top
            this._positionToRowCol(rightTopX, rightTopY, tempRowCol);
            // make range large
            tempRowCol.row++;
            tempRowCol.col++;
        }

        // avoid range out of max rect
        if (tempRowCol.row > this._rightTop.row) tempRowCol.row = this._rightTop.row;
        if (tempRowCol.col > this._rightTop.col) tempRowCol.col = this._rightTop.col;

        if (tempRowCol.row !== rightTop.row || tempRowCol.col !== rightTop.col) {
            rightTop.row = tempRowCol.row;
            rightTop.col = tempRowCol.col;
            this._clipDirty = true;
        }
    },

    // the result may not precise, but it dose't matter, it just uses to be got range
    _positionToRowCol (x, y, result) {
        const TiledMap = cc.TiledMap;
        const Orientation = TiledMap.Orientation;
        const StaggerAxis = TiledMap.StaggerAxis;

        let maptw = this._mapTileSize.width,
            mapth = this._mapTileSize.height,
            maptw2 = maptw * 0.5,
            mapth2 = mapth * 0.5;
        let row = 0, col = 0, diffX2 = 0, diffY2 = 0, axis = this._staggerAxis;
        let cols = this._layerSize.width;

        switch (this._layerOrientation) {
            // left top to right dowm
            case Orientation.ORTHO:
                col = Math.floor(x / maptw);
                row = Math.floor(y / mapth);
                break;
            // right top to left down
            // iso can be treat as special hex whose hex side length is 0
            case Orientation.ISO:
                col = Math.floor(x / maptw2);
                row = Math.floor(y / mapth2);
                break;
            // left top to right dowm
            case Orientation.HEX:
                if (axis === StaggerAxis.STAGGERAXIS_Y) {
                    row = Math.floor(y / (mapth - this._diffY1));
                    diffX2 = row % 2 === 1 ? maptw2 * this._odd_even : 0;
                    col = Math.floor((x - diffX2) / maptw);
                } else {
                    col = Math.floor(x / (maptw - this._diffX1));
                    diffY2 = col % 2 === 1 ? mapth2 * -this._odd_even : 0;
                    row = Math.floor((y - diffY2) / mapth);
                }
                break;
        }
        result.row = row;
        result.col = col;
        return result;
    },

    update () {
        if (CC_EDITOR) {
            if (this._clipHandleNode) {
                this._updateViewPort(this._clipHandleNode.x, this._clipHandleNode.y, this._clipHandleNode.width, this._clipHandleNode.height);
                this.enableClip(true);
            } else {
                this.enableClip(false);
            }
        } else if (this._enableClip) {
            this.node._updateWorldMatrix();
            mat4.invert(_mat4_temp, this.node._worldMatrix);
            let rect = cc.visibleRect;
            let camera = cc.Camera.findCamera(this.node);
            if (camera) {
                _vec2_temp.x = 0;
                _vec2_temp.y = 0;
                camera.getCameraToWorldPoint(_vec2_temp, _vec2_temp);
                vec2.transformMat4(_vec2_temp, _vec2_temp, _mat4_temp);
                this._updateViewPort(_vec2_temp.x, _vec2_temp.y, rect.width, rect.height);
            }
        }
    },

    /**
     * !#en Layer orientation, which is the same as the map orientation.
     * !#zh 获取 Layer 方向(同地图方向)。
     * @method getLayerOrientation
     * @return {Number}
     * @example
     * let orientation = tiledLayer.getLayerOrientation();
     * cc.log("Layer Orientation: " + orientation);
     */
    getLayerOrientation () {
        return this._layerOrientation;
    },

    /**
     * !#en properties from the layer. They can be added using Tiled.
     * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
     * @method getProperties
     * @return {Array}
     * @example
     * let properties = tiledLayer.getProperties();
     * cc.log("Properties: " + properties);
     */
    getProperties () {
        return this._properties;
    },

    _updateVertices () {
        const TiledMap = cc.TiledMap;
        const TileFlag = TiledMap.TileFlag;
        const FLIPPED_MASK = TileFlag.FLIPPED_MASK;
        const StaggerAxis = TiledMap.StaggerAxis;
        const Orientation = TiledMap.Orientation;

        let vertices = this._vertices;
        vertices.length = 0;

        let layerOrientation = this._layerOrientation,
            tiles = this._tiles;

        if (!tiles) {
            return;
        }

        let rightTop = this._rightTop;
        rightTop.row = -1;
        rightTop.col = -1;

        let maptw = this._mapTileSize.width,
            mapth = this._mapTileSize.height,
            maptw2 = maptw * 0.5,
            mapth2 = mapth * 0.5,
            rows = this._layerSize.height,
            cols = this._layerSize.width,
            grids = this._texGrids;
        
        let colOffset = 0, gid, grid, left, bottom,
            axis, diffX1, diffY1, odd_even, diffX2, diffY2;

        if (layerOrientation === Orientation.HEX) {
            axis = this._staggerAxis;
            diffX1 = this._diffX1;
            diffY1 = this._diffY1;
            odd_even = this._odd_even;
        }

        let clipCol = 0, clipRow = 0;
        let tileOffset = null, gridGID = 0;

        this._topOffset = 0;
        this._downOffset = 0;
        this._leftOffset = 0;
        this._rightOffset = 0;
        this._hasAniGrid = false;

        for (let row = 0; row < rows; ++row) {
            for (let col = 0; col < cols; ++col) {
                let index = colOffset + col;
                gid = tiles[index];
                gridGID = ((gid & FLIPPED_MASK) >>> 0);
                grid = grids[gridGID];

                // if has animation, grid must be updated per frame
                if (this._animations[gridGID]) {
                    this._hasAniGrid = true;
                }

                if (!grid) {
                    continue;
                }

                switch (layerOrientation) {
                    // left top to right dowm
                    case Orientation.ORTHO:
                        clipCol = col;
                        clipRow = rows - row - 1;
                        left = clipCol * maptw;
                        bottom = clipRow * mapth;
                        break;
                    // right top to left down
                    case Orientation.ISO:
                        // if not consider about col, then left is 'w/2 * (rows - row - 1)'
                        // if consider about col then left must add 'w/2 * col'
                        // so left is 'w/2 * (rows - row - 1) + w/2 * col'
                        // combine expression is 'w/2 * (rows - row + col -1)'
                        clipCol = rows + col - row - 1;
                        // if not consider about row, then bottom 'h/2 * (cols - col -1)'
                        // if consider about row then bottom must add 'h/2 * (rows - row - 1)'
                        // so bottom is 'h/2 * (cols - col -1) + h/2 * (rows - row - 1)'
                        // combine expressionn is 'h/2 * (rows + cols - col - row - 2)'
                        clipRow = rows + cols - col - row - 2;
                        left = maptw2 * clipCol;
                        bottom = mapth2 * clipRow;
                        break;
                    // left top to right dowm
                    case Orientation.HEX:
                        diffX2 = (axis === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1) ? maptw2 * odd_even : 0;
                        diffY2 = (axis === StaggerAxis.STAGGERAXIS_X && col % 2 === 1) ? mapth2 * -odd_even : 0;

                        left = col * (maptw - diffX1) + diffX2;
                        bottom = (rows - row - 1) * (mapth - diffY1) + diffY2;
                        clipCol = col;
                        clipRow = rows - row - 1;
                        break;
                }

                let rowData = vertices[clipRow] = vertices[clipRow] || {minCol:0, maxCol:0};
                let colData = rowData[clipCol] = rowData[clipCol] || {};
                
                // record each row range, it will faster when clip grid
                if (rowData.minCol > clipCol) {
                    rowData.minCol = clipCol;
                }

                if (rowData.maxCol < clipCol) {
                    rowData.maxCol = clipCol;
                }

                // record max rect, when viewPort is bigger than layer, can make it smaller
                if (rightTop.row < clipRow) {
                    rightTop.row = clipRow;
                }

                if (rightTop.col < clipCol) {
                    rightTop.col = clipCol;
                }

                // _offset is whole layer offset
                // tileOffset is tileset offset which is related to each grid
                // tileOffset coordinate system's y axis is opposite with engine's y axis.
                tileOffset = grid.tileset.tileOffset;
                left += this._offset.x + tileOffset.x;
                bottom += this._offset.y - tileOffset.y;

                // record the far left, handle the offset like the shape '←' which is negative number, 
                // so must get negation
                if (this._leftOffset < -tileOffset.x) {
                    this._leftOffset = -tileOffset.x;
                }

                // record the far right, handle the offset like the shape '→' which is positive number, 
                // so must get negation
                if (this._rightOffset > -tileOffset.x) {
                    this._rightOffset = -tileOffset.x;
                }

                // record the far top, handle the offset like the shape '↓' which is positive number,
                // so need not get negation
                if (this._topOffset < tileOffset.y) {
                    this._topOffset = tileOffset.y;
                }

                // record the far down, handle the offset like the shape '↑' which is negative number,
                // so need not get negation
                if (this._downOffset > tileOffset.y) {
                    this._downOffset = tileOffset.y;
                }

                colData.left = left;
                colData.bottom = bottom;
                // this index is tiledmap grid index
                colData.index = index; 
            }
            colOffset += cols;
        }
        this._verticesDirty = false;
    },

    /**
     * !#en
     * Get the TiledTile with the tile coordinate.<br/>
     * If there is no tile in the specified coordinate and forceCreate parameter is true, <br/>
     * then will create a new TiledTile at the coordinate.
     * The renderer will render the tile with the rotation, scale, position and color property of the TiledTile.
     * !#zh
     * 通过指定的 tile 坐标获取对应的 TiledTile。 <br/>
     * 如果指定的坐标没有 tile，并且设置了 forceCreate 那么将会在指定的坐标创建一个新的 TiledTile 。<br/>
     * 在渲染这个 tile 的时候，将会使用 TiledTile 的节点的旋转、缩放、位移、颜色属性。<br/>
     * @method getTiledTileAt
     * @param {Integer} x
     * @param {Integer} y
     * @param {Boolean} forceCreate
     * @return {cc.TiledTile}
     * @example
     * let tile = tiledLayer.getTiledTileAt(100, 100, true);
     * cc.log(tile);
     */
    getTiledTileAt (x, y, forceCreate) {
        if (this._isInvalidPosition(x, y)) {
            throw new Error("TiledLayer.getTiledTileAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7236);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        let tile = this._tiledTiles[index];
        if (!tile && forceCreate) {
            let node = new cc.Node();
            tile = node.addComponent(cc.TiledTile);
            tile._x = x;
            tile._y = y;
            tile._layer = this;
            tile._updateInfo();
            node.parent = this.node;
            return tile;
        }
        return tile;
    },

    /** 
     * !#en
     * Change tile to TiledTile at the specified coordinate.
     * !#zh
     * 将指定的 tile 坐标替换为指定的 TiledTile。
     * @method setTiledTileAt
     * @param {Integer} x
     * @param {Integer} y
     * @param {cc.TiledTile} tiledTile
     * @return {cc.TiledTile}
     */
    setTiledTileAt (x, y, tiledTile) {
        if (this._isInvalidPosition(x, y)) {
            throw new Error("TiledLayer.setTiledTileAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7236);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize.width;
        return this._tiledTiles[index] = tiledTile;
    },

    /**
     * !#en Return texture.
     * !#zh 获取纹理。
     * @method getTexture
     * @return {Texture2D}
     */
    getTexture () {
        if (this._textures && this._textures.length > 0) {
            return this._textures[0];
        }
        return null;
    },

    /**
     * !#en Return texture.
     * !#zh 获取纹理。
     * @method getTextures
     * @return {Texture2D}
     */
    getTextures () {
        return this._textures;
    },

    /**
     * !#en Set the texture.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {Texture2D} texture
     */
    setTexture (texture){
        this.setTextures([texture]);
    },

    /**
     * !#en Set the texture.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {Texture2D} textures
     */
    setTextures (textures) {
        this._textures = textures;
        this._activateMaterial();
    },

    /**
     * !#en Gets layer size.
     * !#zh 获得层大小。
     * @method getLayerSize
     * @return {Size}
     * @example
     * let size = tiledLayer.getLayerSize();
     * cc.log("layer size: " + size);
     */
    getLayerSize () {
        return this._layerSize;
    },

    /**
     * !#en Size of the map's tile (could be different from the tile's size).
     * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
     * @method getMapTileSize
     * @return {Size}
     * @example
     * let mapTileSize = tiledLayer.getMapTileSize();
     * cc.log("MapTile size: " + mapTileSize);
     */
    getMapTileSize () {
        return this._mapTileSize;
    },

    /**
     * !#en Gets Tile set first information for the layer.
     * !#zh 获取 layer 索引位置为0的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     */
    getTileSet () {
        if (this._tilesets && this._tilesets.length > 0) {
            return this._tilesets[0];
        }
        return null;
    },

    /**
     * !#en Gets tile set all information for the layer.
     * !#zh 获取 layer 所有的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     */
    getTileSets () {
        return this._tilesets;
    },

    /**
     * !#en Sets tile set information for the layer.
     * !#zh 设置 layer 的 tileset 信息。
     * @method setTileSet
     * @param {TMXTilesetInfo} tileset
     */
    setTileSet (tileset) {
        this.setTileSets([tileset]);
    },

    /**
     * !#en Sets Tile set information for the layer.
     * !#zh 设置 layer 的 Tileset 信息。
     * @method setTileSets
     * @param {TMXTilesetInfo} tilesets
     */
    setTileSets (tilesets) {
        this._tilesets = tilesets;
        let textures = this._textures = [];
        let texGrids = this._texGrids = [];
        for (let i = 0; i < tilesets.length; i++) {
            let tileset = tilesets[i];
            if (tileset) {
                textures[i] = tileset.sourceImage;
            }
        }

        cc.TiledMap.loadAllTextures (textures, function () {
            for (let i = 0, l = tilesets.length; i < l; ++i) {
                let tilesetInfo = tilesets[i];
                if (!tilesetInfo) continue;
                cc.TiledMap.fillTextureGrids(tilesetInfo, texGrids, i);
            }
            this._prepareToRender();
        }.bind(this));
    },

    _traverseAllGrid () {
        let tiles = this._tiles;
        let texGrids = this._texGrids;
        let tilesetIndexArr = this._tilesetIndexArr;
        let tilesetIdxMap = {};

        const TiledMap = cc.TiledMap;
        const TileFlag = TiledMap.TileFlag;
        const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

        tilesetIndexArr.length = 0;
        for (let i = 0; i < tiles.length; i++) {
            let gid = tiles[i];
            if (gid === 0) continue;
            gid = ((gid & FLIPPED_MASK) >>> 0);
            let grid = texGrids[gid];
            if (!grid) {
                cc.error("CCTiledLayer:_traverseAllGrid grid is null, gid is:", gid);
                continue;
            }
            let tilesetIdx = grid.texId;
            if (tilesetIdxMap[tilesetIdx]) continue;
            tilesetIdxMap[tilesetIdx] = true;
            tilesetIndexArr.push(tilesetIdx);
        }
    },

    _init (layerInfo, mapInfo, tilesets, textures, texGrids) {
        
        this._layerInfo = layerInfo;
        this._mapInfo = mapInfo;

        let size = layerInfo._layerSize;

        // layerInfo
        this._layerName = layerInfo.name;
        this._tiles = layerInfo._tiles;
        this._properties = layerInfo.properties;
        this._layerSize = size;
        this._minGID = layerInfo._minGID;
        this._maxGID = layerInfo._maxGID;
        this._opacity = layerInfo._opacity;
        this._staggerAxis = mapInfo.getStaggerAxis();
        this._staggerIndex = mapInfo.getStaggerIndex();
        this._hexSideLength = mapInfo.getHexSideLength();
        this._animations = mapInfo.getTileAnimations();

        // tilesets
        this._tilesets = tilesets;
        // textures
        this._textures = textures;
        // grid texture
        this._texGrids = texGrids;

        // mapInfo
        this._layerOrientation = mapInfo.orientation;
        this._mapTileSize = mapInfo.getTileSize();

        if (this._layerOrientation === cc.TiledMap.Orientation.HEX) {
            // handle hex map
            const TiledMap = cc.TiledMap;
            const StaggerAxis = TiledMap.StaggerAxis;
            const StaggerIndex = TiledMap.StaggerIndex;

            let maptw = this._mapTileSize.width;
            let mapth = this._mapTileSize.height;
            let width = 0, height = 0;

            this._odd_even = (this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;

            if (this._staggerAxis === StaggerAxis.STAGGERAXIS_X) {
                this._diffX1 = (maptw - this._hexSideLength) / 2;
                this._diffY1 = 0;
                height = mapth * (this._layerSize.height + 0.5);
                width = (maptw + this._hexSideLength) * Math.floor(this._layerSize.width / 2) + maptw * (this._layerSize.width % 2);
            } else {
                this._diffX1 = 0;
                this._diffY1 = (mapth - this._hexSideLength) / 2;
                width = maptw * (this._layerSize.width + 0.5);
                height = (mapth + this._hexSideLength) * Math.floor(this._layerSize.height / 2) + mapth * (this._layerSize.height % 2);
            }
            this.node.setContentSize(width, height);
        } else {
            this.node.setContentSize(this._layerSize.width * this._mapTileSize.width,
                this._layerSize.height * this._mapTileSize.height);
        }

        // offset (after layer orientation is set);
        this._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);
        this._useAutomaticVertexZ = false;
        this._vertexZvalue = 0;
        this._syncAnchorPoint();
        this._prepareToRender();
    },

    _prepareToRender () {
        this._updateVertices();
        this._traverseAllGrid();
        this._updateAllUserNode();
        this._activateMaterial();
    },

    _activateMaterial () {
        let tilesetIndexArr = this._tilesetIndexArr;
        if (tilesetIndexArr.length === 0) {
            this.disableRender();
            return;
        }

        let texIdMatIdx = this._texIdToMatIndex = {};
        let textures = this._textures;

        for (let i = 0; i < tilesetIndexArr.length; i++) {
            let tilesetIdx = tilesetIndexArr[i];
            let texture = textures[tilesetIdx];

            let material = this.sharedMaterials[i];
            if (!material) {
                material = Material.getInstantiatedBuiltinMaterial('sprite', this);
                material.define('USE_TEXTURE', true);
                material.define('_USE_MODEL', true);
            }
            else {
                material = Material.getInstantiatedMaterial(material, this);
            }

            material.setProperty('texture', texture);
            this.setMaterial(i, material);

            texIdMatIdx[tilesetIdx] = i;
        }

        this.markForUpdateRenderData(true);
        this.markForRender(false);
        this.markForCustomIARender(true);
    },
});

cc.TiledLayer = module.exports = TiledLayer;
