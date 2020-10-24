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
* @packageDocumentation
* @module ui
*/

import { ccclass, type } from 'cc.decorator';

import { UIRenderable } from '../core/components/ui-base/ui-renderable';
import { Component } from '../core/components';

import visibleRect from '../core/platform/visible-rect';

import * as cc from "../core"
import {  PropertiesInfo, TiledAnimationType, TMXLayerInfo, TMXMapInfo } from './TMXXMLParser';
import { IVec2Like, SystemEventType } from '../core';
import { TiledTile } from './TiledTile';
import { EDITOR } from 'internal:constants';
import { legacyCC } from '../core/global-exports';
import { MeshRenderData } from '../core/renderer/ui/render-data';
import { UI } from '../core/renderer/ui/ui';
import { MixedGID, GID, Orientation, TiledTextureGrids, TMXTilesetInfo, RenderOrder, StaggerAxis, StaggerIndex, TileFlag, GIDFlags, TiledGrid } from './TiledTypes';

import {fillTextureGrids, loadAllTextures} from "./TiledUtils";

let _mat4_temp = cc.mat4();
let _vec2_temp = cc.v2();
// let _vec2_temp2 = cc.v2();
// let _vec2_temp3 = cc.v2();
let _vec3_temp = new cc.Vec3;
let _vec3_temp2 = new cc.Vec3;
let _tempRowCol = { row: 0, col: 0 };

@ccclass('cc.TiledUserNodeData')
export class TiledUserNodeData extends Component {
    _index = -1;
    _row = -1;
    _col = -1;
    _tiledLayer: TiledLayer | null = null;
    constructor() {
        super();
    }
}

/**
 * !#en Render the TMX layer.
 * !#zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */
@ccclass('cc.TiledLayer')
export class TiledLayer extends UIRenderable {

    // editor: {
    //     inspector: 'packages://inspector/inspectors/comps/tiled-layer.js',
    // }

    _userNodeGrid: { [key: number]: { count: number;[key: number]: { count: number, list: (TiledUserNodeData | null)[] } } } = {};// [row][col] = {count: 0, nodesList: []};
    _userNodeMap: { [key: string]: TiledUserNodeData } = {};// [id] = node;
    _userNodeDirty = false;

    // store the layer tiles node, index is caculated by 'x + width * y', format likes '[0]=tileNode0,[1]=tileNode1, ...'
    _tiledTiles: (TiledTile | null)[] = [];

    // // store the layer tilesets index array
    // _tilesetIndexArr: number[] = [];
    // // tileset index to array index
    // _tilesetIndexToArrIndex: { [key: number]: number } = {};

    _viewPort = { x: -1, y: -1, width: -1, height: -1 };
    _cullingRect = {
        leftDown: { row: -1, col: -1 },
        rightTop: { row: -1, col: -1 }
    };

    _cullingDirty = true;
    _rightTop = { row: -1, col: -1 };

    _layerInfo: TMXLayerInfo | null = null;
    _mapInfo: TMXMapInfo | null = null;

    // record max or min tile texture offset,
    // it will make culling rect more large, which insure culling rect correct.
    _topOffset = 0;
    _downOffset = 0;
    _leftOffset = 0;
    _rightOffset = 0;

    // store the layer tiles, index is caculated by 'x + width * y', format likes '[0]=gid0,[1]=gid1, ...'
    _tiles: MixedGID[] = [];
    // vertex array
    _vertices: { minCol: number, maxCol: number, [key: number]: { left: number, bottom: number, index: number } }[] = [];
    // vertices dirty
    _verticesDirty = true;

    _layerName = '';
    _layerSize?: cc.Size;
    _minGID?: GID;
    _maxGID?: GID;
    _layerOrientation: null | Orientation = null;

    _opacity?: number;
    _tintColor?: cc.Color;

    // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'
    _texGrids: TiledTextureGrids | null = null;
    // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'
    _textures: cc.SpriteFrame[] = [];
    _tilesets: TMXTilesetInfo[] = [];

    _leftDownToCenterX = 0;
    _leftDownToCenterY = 0;

    _hasTiledNodeGrid = false;
    _hasAniGrid = false;
    _animations: TiledAnimationType | null = null;

    // switch of culling
    _enableCulling?: boolean;

    _colorChanged = false;

    _properties?: PropertiesInfo;
    renderOrder?: RenderOrder;
    _staggerAxis?: StaggerAxis;
    _staggerIndex?: StaggerIndex;
    _hexSideLength?: number;

    _mapTileSize?: cc.Size;
    _odd_even?: number;
    _diffX1?: number;
    _diffY1?: number;
    _useAutomaticVertexZ?: boolean;
    _vertexZvalue?: number;
    _offset?: cc.Vec2;

    _meshRenderDataArray: { renderData: MeshRenderData, texture: cc.Texture2D | null }[] | null = null;
    constructor() {
        super();
    }

    @type(cc.CCBoolean)
    _diamondTile: boolean = false;

    @type(cc.CCBoolean)
    get diamondTile() {
        return this._diamondTile;
    }
    set diamondTile(value) {
        this._diamondTile = value;
    }

    _hasTiledNode() {
        return this._hasTiledNodeGrid;
    }

    _hasAnimation() {
        return this._hasAniGrid;
    }

    /**
     * !#en enable or disable culling
     * !#zh 开启或关闭裁剪。
     * @method enableCulling
     * @param value
     */
    enableCulling(value: boolean) {
        if (this._enableCulling !== value) {
            this._enableCulling = value;
            this._cullingDirty = true;
        }
    }

    /**
     * !#en Adds user's node into layer.
     * !#zh 添加用户节点。
     * @method addUserNode
     * @param {cc.Node} node
     * @return {Boolean}
     */
    addUserNode(node: cc.Node) {
        let dataComp = node.getComponent(TiledUserNodeData);
        if (dataComp) {
            cc.warn("CCTiledLayer:addUserNode node has been added");
            return false;
        }

        dataComp = node.addComponent(TiledUserNodeData);
        node.parent = this.node;
        // node._renderFlag |= RenderFlow.FLAG_BREAK_FLOW;
        this._userNodeMap[node.uuid] = dataComp;

        dataComp._row = -1;
        dataComp._col = -1;
        dataComp._tiledLayer = this;

        this._nodeLocalPosToLayerPos(node.getPosition(), _vec2_temp);
        this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);
        this._addUserNodeToGrid(dataComp, _tempRowCol);
        this._updateCullingOffsetByUserNode(node);
        node.on(cc.Node.EventType.TRANSFORM_CHANGED, this._userNodePosChange, dataComp);
        node.on(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
        return true;
    }

    /**
     * !#en Removes user's node.
     * !#zh 移除用户节点。
     * @method removeUserNode
     * @param {cc.Node} node
     * @return {Boolean}
     */
    removeUserNode(node: cc.Node) {
        let dataComp = node.getComponent(TiledUserNodeData);
        if (!dataComp) {
            cc.warn("CCTiledLayer:removeUserNode node is not exist");
            return false;
        }
        node.off(cc.Node.EventType.TRANSFORM_CHANGED, this._userNodePosChange, dataComp);
        node.off(cc.Node.EventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
        this._removeUserNodeFromGrid(dataComp);
        delete this._userNodeMap[node.uuid];
        node._removeComponent(dataComp);
        dataComp.destroy();
        node.removeFromParent();
        // node._renderFlag &= ~RenderFlow.FLAG_BREAK_FLOW;
        return true;
    }

    /**
     * !#en Destroy user's node.
     * !#zh 销毁用户节点。
     * @method destroyUserNode
     * @param {cc.Node} node
     */
    destroyUserNode(node: cc.Node) {
        this.removeUserNode(node);
        node.destroy();
    }

    // acording layer anchor point to calculate node layer pos
    _nodeLocalPosToLayerPos(nodePos: IVec2Like, out: IVec2Like) {
        out.x = nodePos.x + this._leftDownToCenterX;
        out.y = nodePos.y + this._leftDownToCenterY;
    }

    _getNodesByRowCol(row: number, col: number) {
        let rowData = this._userNodeGrid[row];
        if (!rowData) return null;
        return rowData[col];
    }

    _getNodesCountByRow(row) {
        let rowData = this._userNodeGrid[row];
        if (!rowData) return 0;
        return rowData.count;
    }

    _updateAllUserNode() {
        this._userNodeGrid = {};
        for (let dataId in this._userNodeMap) {
            let dataComp = this._userNodeMap[dataId];
            this._nodeLocalPosToLayerPos(dataComp.node.getPosition(), _vec2_temp);
            this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);
            this._addUserNodeToGrid(dataComp, _tempRowCol);
            this._updateCullingOffsetByUserNode(dataComp.node);
        }
    }

    _updateCullingOffsetByUserNode(node_: cc.Node) {
        let node = node_._uiProps.uiTransformComp!.contentSize;
        if (this._topOffset < node.height) {
            this._topOffset = node.height;
        }
        if (this._downOffset < node.height) {
            this._downOffset = node.height;
        }
        if (this._leftOffset < node.width) {
            this._leftOffset = node.width;
        }
        if (this._rightOffset < node.width) {
            this._rightOffset = node.width;
        }
    }

    _userNodeSizeChange() {
        let dataComp: TiledUserNodeData = this as unknown as any;
        let node = dataComp.node;
        let self = dataComp._tiledLayer!;
        self._updateCullingOffsetByUserNode(node);
    }

    _userNodePosChange() {
        let dataComp: TiledUserNodeData = this as unknown as any;
        let node = dataComp.node;
        let self = dataComp._tiledLayer!;
        self._nodeLocalPosToLayerPos(node.getPosition(), _vec2_temp);
        self._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);
        self._limitInLayer(_tempRowCol);
        // users pos not change
        if (_tempRowCol.row === dataComp._row && _tempRowCol.col === dataComp._col) return;

        self._removeUserNodeFromGrid(dataComp);
        self._addUserNodeToGrid(dataComp, _tempRowCol);
    }

    _removeUserNodeFromGrid(dataComp: TiledUserNodeData) {
        let row = dataComp._row;
        let col = dataComp._col;
        let index = dataComp._index;

        let rowData = this._userNodeGrid[row];
        let colData = rowData && rowData[col];
        if (colData) {
            rowData.count--;
            colData.count--;
            colData.list[index] = null;
            if (colData.count <= 0) {
                colData.list.length = 0;
                colData.count = 0;
            }
        }

        dataComp._row = -1;
        dataComp._col = -1;
        dataComp._index = -1;
        this._userNodeDirty = true;
    }

    _limitInLayer(rowCol: { row: number, col: number }) {
        let row = rowCol.row;
        let col = rowCol.col;
        if (row < 0) rowCol.row = 0;
        if (row > this._rightTop.row) rowCol.row = this._rightTop.row;
        if (col < 0) rowCol.col = 0;
        if (col > this._rightTop.col) rowCol.col = this._rightTop.col;
    }

    _addUserNodeToGrid(dataComp: TiledUserNodeData, tempRowCol: { col: number, row: number }) {
        let row = tempRowCol.row;
        let col = tempRowCol.col;
        let rowData = this._userNodeGrid[row] = this._userNodeGrid[row] || { count: 0 };
        let colData = rowData[col] = rowData[col] || { count: 0, list: [] };
        dataComp._row = row;
        dataComp._col = col;
        dataComp._index = colData.list.length;
        rowData.count++;
        colData.count++;
        colData.list.push(dataComp);
        this._userNodeDirty = true;
    }

    _isUserNodeDirty() {
        return this._userNodeDirty;
    }

    _setUserNodeDirty(value) {
        this._userNodeDirty = value;
    }

    onEnable() {
        super.onEnable()
        this.node.on(SystemEventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
        this.markForUpdateRenderData();
    }

    onDisable() {
        super.onDisable();
        this.node.off(SystemEventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
    }

    _syncAnchorPoint() {
        let node = this.node;
        let trans = node._uiProps.uiTransformComp!;
        let scale = node.getScale();
        this._leftDownToCenterX = trans.width * trans.anchorX * scale.x;
        this._leftDownToCenterY = trans.height * trans.anchorY * scale.y;
        this._cullingDirty = true;
        this.markForUpdateRenderData();
    }

    onDestroy() {
        super.onDestroy();
    }

    /**
     * !#en Gets the layer name.
     * !#zh 获取层的名称。
     * @method getLayerName
     * @return {String}
     * @example
     * let layerName = tiledLayer.getLayerName();
     * cc.log(layerName);
     */
    getLayerName(): string {
        return this._layerName;
    }

    /**
     * !#en Set the layer name.
     * !#zh 设置层的名称
     * @method SetLayerName
     * @param {String} layerName
     * @example
     * tiledLayer.setLayerName("New Layer");
     */
    setLayerName(layerName: string) {
        this._layerName = layerName;
    }

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
    getProperty(propertyName: string) {
        return this._properties![propertyName];
    }

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
    getPositionAt(pos: IVec2Like | number, y?: number): cc.Vec2 | null {
        let x;
        if (y !== undefined) {
            x = Math.floor(pos as number);
            y = Math.floor(y);
        }
        else {
            x = Math.floor((pos as IVec2Like).x);
            y = Math.floor((pos as IVec2Like).y);
        }

        switch (this._layerOrientation) {
            case Orientation.ORTHO:
                return this._positionForOrthoAt(x, y);
            case Orientation.ISO:
                return this._positionForIsoAt(x, y);
            case Orientation.HEX:
                return this._positionForHexAt(x, y);
        }
        return null;
    }

    _isInvalidPosition(x: number, y: number) {
        return x >= this._layerSize!.width || y >= this._layerSize!.height || x < 0 || y < 0;
    }

    _positionForIsoAt(x: number, y: number): cc.Vec2 {
        let offsetX = 0, offsetY = 0;
        let index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        let gidAndFlags = this._tiles[index];
        if (gidAndFlags) {
            let gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0);
            let tileset = this._texGrids!.get(gid as unknown as GID)!.tileset;
            let offset = tileset.tileOffset;
            offsetX = offset.x;
            offsetY = offset.y;
        }

        return cc.v2(
            this._mapTileSize!.width * 0.5 * (this._layerSize!.height + x - y - 1) + offsetX,
            this._mapTileSize!.height * 0.5 * (this._layerSize!.width - x + this._layerSize!.height - y - 2) - offsetY
        );
    }

    _positionForOrthoAt(x: number, y: number): cc.Vec2 {
        let offsetX = 0, offsetY = 0;
        let index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        let gidAndFlags = this._tiles[index];
        if (gidAndFlags) {
            let gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0) as unknown as GID;
            let tileset = this._texGrids!.get(gid)!.tileset;
            let offset = tileset.tileOffset;
            offsetX = offset.x;
            offsetY = offset.y;
        }

        return cc.v2(
            x * this._mapTileSize!.width + offsetX,
            (this._layerSize!.height - y - 1) * this._mapTileSize!.height - offsetY
        );
    }

    _positionForHexAt(col: number, row: number): cc.Vec2 {
        let tileWidth = this._mapTileSize!.width;
        let tileHeight = this._mapTileSize!.height;
        let rows = this._layerSize!.height;

        let index = Math.floor(col) + Math.floor(row) * this._layerSize!.width;
        let gid = ((this._tiles[index] as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0;
        let offset;
        if (this._texGrids!.get(gid as unknown as GID)) {
            offset = this._texGrids!.get(gid as unknown as GID)!.tileset.tileOffset;
        } else {
            offset = { x: 0, y: 0 }
        }

        let odd_even = (this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        let x = 0, y = 0;
        let diffX = 0;
        let diffY = 0;
        switch (this._staggerAxis) {
            case StaggerAxis.STAGGERAXIS_Y:
                diffX = 0;
                if (row % 2 === 1) {
                    diffX = tileWidth / 2 * odd_even;
                }
                x = col * tileWidth + diffX + offset.x;
                y = (rows - row - 1) * (tileHeight - (tileHeight - this._hexSideLength!) / 2) - offset.y;
                break;
            case StaggerAxis.STAGGERAXIS_X:
                diffY = 0;
                if (col % 2 === 1) {
                    diffY = tileHeight / 2 * -odd_even;
                }
                x = col * (tileWidth - (tileWidth - this._hexSideLength!) / 2) + offset.x;
                y = (rows - row - 1) * tileHeight + diffY - offset.y;
                break;
        }
        return cc.v2(x, y);
    }

    /**
     * !#en
     * Sets the tiles gid (gid = tile global id) at a given tiles rect.
     * !#zh
     * 设置给定区域的 tile 的 gid (gid = tile 全局 id)，
     * @method setTilesGIDAt
     * @param {Array} gids an array contains gid
     * @param {Number} beginCol begin col number
     * @param {Number} beginRow begin row number
     * @param {Number} totalCols count of column
     * @example
     * tiledLayer.setTilesGIDAt([1, 1, 1, 1], 10, 10, 2)
     */
    setTilesGIDAt(gids, beginCol, beginRow, totalCols) {
        if (!gids || gids.length === 0 || totalCols <= 0) return;
        if (beginRow < 0) beginRow = 0;
        if (beginCol < 0) beginCol = 0;
        let gidsIdx = 0;
        let endCol = beginCol + totalCols;
        for (let row = beginRow; ; row++) {
            for (let col = beginCol; col < endCol; col++) {
                if (gidsIdx >= gids.length) return;
                this._updateTileForGID(gids[gidsIdx], col, row);
                gidsIdx++;
            }
        }
    }

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
    setTileGIDAt(gid: MixedGID, x: number, y: number, flags?: number) {

        let ugid = ((gid as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0;

        x = Math.floor(x);
        y = Math.floor(y);
        if (this._isInvalidPosition(x, y)) {
            throw new Error("cc.TiledLayer.setTileGIDAt(): invalid position");
        }
        if (!this._tiles || !this._tilesets || this._tilesets.length === 0) {
            cc.logID(7238);
            return;
        }
        if (ugid !== 0 && ugid < (this._tilesets[0].firstGid as unknown as number)) {
            cc.logID(7239, gid);
            return;
        }

        flags = flags || 0;
        this._updateTileForGID(((ugid | flags) >>> 0) as unknown as MixedGID, x, y);
    }

    _updateTileForGID(gidAndFlags: MixedGID, x: number, y: number): void {
        let idx = 0 | (x + y * this._layerSize!.width);
        if (idx >= this._tiles.length) return;

        let oldGIDAndFlags = this._tiles[idx];
        if (gidAndFlags === oldGIDAndFlags) return;

        let gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0);
        let grid = this._texGrids!.get(gid as unknown as GID);

        if (grid) {
            this._tiles[idx] = gidAndFlags;
            this._updateVertex(x, y);
        } else {
            this._tiles[idx] = 0 as unknown as MixedGID;
        }
        this._cullingDirty = true;
    }

    /**
     * !#en
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * !#zh
     * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
     * 如果它返回 0，则表示该 tile 为空。<br />
     * @method getTileGIDAt
     * @param {Vec2} pos
     * @return {Number}
     * @example
     * let tileGid = tiledLayer.getTileGIDAt(0, 0);
     */
    getTileGIDAt(x: number, y: number): GID | null {
        if (this._isInvalidPosition(x, y)) {
            throw new Error("cc.TiledLayer.getTileGIDAt(): invalid position");
        }
        if (!this._tiles) {
            cc.logID(7237);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[index] as unknown as number;

        return ((tile & TileFlag.FLIPPED_MASK) >>> 0) as unknown as GID;
    }

    getTileFlagsAt(pos: IVec2Like) {
        if (!pos) {
            throw new Error("TiledLayer.getTileFlagsAt: pos should be non-null");
        }
        if (this._isInvalidPosition(pos.x, pos.y)) {
            throw new Error("TiledLayer.getTileFlagsAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7240);
            return null;
        }

        let idx = Math.floor(pos.x) + Math.floor(pos.y) * this._layerSize!.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        let tile = this._tiles[idx] as unknown as number;

        return ((tile & TileFlag.FLIPPED_ALL) >>> 0) as unknown as GIDFlags;
    }

    _setCullingDirty(value: boolean) {
        this._cullingDirty = value;
    }

    _isCullingDirty(): boolean {
        return this._cullingDirty;
    }

    // 'x, y' is the position of viewPort, which's anchor point is at the center of rect.
    // 'width, height' is the size of viewPort.
    updateViewPort(x: number, y: number, width: number, height: number): void {
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
        if (this._layerOrientation === Orientation.ISO) {
            reserveLine = 2;
        }

        let vpx = this._viewPort.x - this._offset!.x + this._leftDownToCenterX;
        let vpy = this._viewPort.y - this._offset!.y + this._leftDownToCenterY;

        let leftDownX = vpx - this._leftOffset;
        let leftDownY = vpy - this._downOffset;
        let rightTopX = vpx + width + this._rightOffset;
        let rightTopY = vpy + height + this._topOffset;

        let leftDown = this._cullingRect.leftDown;
        let rightTop = this._cullingRect.rightTop;

        if (leftDownX < 0) leftDownX = 0;
        if (leftDownY < 0) leftDownY = 0;

        // calc left down
        this._positionToRowCol(leftDownX, leftDownY, _tempRowCol);
        // make range large
        _tempRowCol.row -= reserveLine;
        _tempRowCol.col -= reserveLine;
        // insure left down row col greater than 0
        _tempRowCol.row = _tempRowCol.row > 0 ? _tempRowCol.row : 0;
        _tempRowCol.col = _tempRowCol.col > 0 ? _tempRowCol.col : 0;

        if (_tempRowCol.row !== leftDown.row || _tempRowCol.col !== leftDown.col) {
            leftDown.row = _tempRowCol.row;
            leftDown.col = _tempRowCol.col;
            this._cullingDirty = true;
        }

        // show nothing
        if (rightTopX < 0 || rightTopY < 0) {
            _tempRowCol.row = -1;
            _tempRowCol.col = -1;
        } else {
            // calc right top
            this._positionToRowCol(rightTopX, rightTopY, _tempRowCol);
            // make range large
            _tempRowCol.row++;
            _tempRowCol.col++;
        }

        // avoid range out of max rect
        if (_tempRowCol.row > this._rightTop.row) _tempRowCol.row = this._rightTop.row;
        if (_tempRowCol.col > this._rightTop.col) _tempRowCol.col = this._rightTop.col;

        if (_tempRowCol.row !== rightTop.row || _tempRowCol.col !== rightTop.col) {
            rightTop.row = _tempRowCol.row;
            rightTop.col = _tempRowCol.col;
            this._cullingDirty = true;
        }
    }

    // the result may not precise, but it dose't matter, it just uses to be got range
    _positionToRowCol(x: number, y: number, result: { col: number, row: number }): { col: number, row: number } {

        let maptw = this._mapTileSize!.width,
            mapth = this._mapTileSize!.height,
            maptw2 = maptw * 0.5,
            mapth2 = mapth * 0.5;
        let row = 0, col = 0, diffX2 = 0, diffY2 = 0, axis = this._staggerAxis;

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
                    row = Math.floor(y / (mapth - this._diffY1!));
                    diffX2 = row % 2 === 1 ? maptw2 * this._odd_even! : 0;
                    col = Math.floor((x - diffX2) / maptw);
                } else {
                    col = Math.floor(x / (maptw - this._diffX1!));
                    diffY2 = col % 2 === 1 ? mapth2 * -this._odd_even! : 0;
                    row = Math.floor((y - diffY2) / mapth);
                }
                break;
        }
        result.row = row;
        result.col = col;
        return result;
    }

    _updateCulling() {
        if (EDITOR) {
            this.enableCulling(false);
        } else if (this._enableCulling) {
            this.node.updateWorldTransform();
            cc.Mat4.invert(_mat4_temp, this.node.getWorldMatrix());
            let rect = visibleRect;
            //FIXME:culling
            let camera = this.node._uiProps.uiTransformComp!._canvas!.camera;
            if (camera) {
                _vec3_temp.x = 0;
                _vec3_temp.y = 0;
                _vec3_temp.z = 0;
                _vec3_temp2.x = _vec3_temp2.x + rect.width;
                _vec3_temp2.y = _vec3_temp2.y + rect.height;
                _vec3_temp2.z = 0;
                camera.screenToWorld(_vec3_temp, _vec3_temp);
                camera.screenToWorld(_vec3_temp2, _vec3_temp2);
                // camera.getScreenToWorldPoint(_vec2_temp, _vec2_temp);
                // camera.getScreenToWorldPoint(_vec2_temp2, _vec2_temp2);
                cc.Vec2.transformMat4(_vec3_temp, _vec3_temp, _mat4_temp);
                cc.Vec2.transformMat4(_vec3_temp2, _vec3_temp2, _mat4_temp);
                this.updateViewPort(_vec3_temp.x, _vec3_temp.y, _vec3_temp2.x - _vec3_temp.x, _vec3_temp2.y - _vec3_temp.y);
            }
        }
    }

    /**
     * !#en Layer orientation, which is the same as the map orientation.
     * !#zh 获取 Layer 方向(同地图方向)。
     * @method getLayerOrientation
     * @return {Number}
     * @example
     * let orientation = tiledLayer.getLayerOrientation();
     * cc.log("Layer Orientation: " + orientation);
     */
    getLayerOrientation() {
        return this._layerOrientation;
    }

    /**
     * !#en properties from the layer. They can be added using Tiled.
     * !#zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
     * @method getProperties
     * @return {Object}
     * @example
     * let properties = tiledLayer.getProperties();
     * cc.log("Properties: " + properties);
     */
    getProperties() {
        return this._properties;
    }

    _updateVertex(col: number, row: number) {
        const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

        let vertices = this._vertices;

        let layerOrientation = this._layerOrientation,
            tiles = this._tiles;

        if (!tiles) {
            return;
        }

        let rightTop = this._rightTop;
        let maptw = this._mapTileSize!.width,
            mapth = this._mapTileSize!.height,
            maptw2 = maptw * 0.5,
            mapth2 = mapth * 0.5,
            rows = this._layerSize!.height,
            cols = this._layerSize!.width,
            grids = this._texGrids!;

        let gid: MixedGID;
        let left: number = 0;
        let bottom: number = 0;
        let axis: StaggerAxis;
        let diffX1: number;
        let diffY1: number;
        let odd_even: number;
        let diffX2: number;
        let diffY2: number;
        let grid: TiledGrid;

        if (layerOrientation === Orientation.HEX) {
            axis = this._staggerAxis!;
            diffX1 = this._diffX1!;
            diffY1 = this._diffY1!;
            odd_even = this._odd_even!;
        }

        let cullingCol = 0, cullingRow = 0;
        let tileOffset: cc.Vec2;
        let gridGID: GID = 0 as unknown as GID;

        // grid border
        let topBorder = 0, downBorder = 0, leftBorder = 0, rightBorder = 0;
        let index = row * cols + col;
        gid = tiles[index];
        gridGID = (((gid as unknown as number) & FLIPPED_MASK) >>> 0) as unknown as GID;
        grid = grids.get(gridGID)!;
        if (!grid) {
            return;
        }

        // if has animation, grid must be updated per frame
        if (this._animations!.get(gridGID)) {
            this._hasAniGrid = this._hasAniGrid || true;
        }

        switch (layerOrientation) {
            // left top to right dowm
            case Orientation.ORTHO:
                cullingCol = col;
                cullingRow = rows - row - 1;
                left = cullingCol * maptw;
                bottom = cullingRow * mapth;
                break;
            // right top to left down
            case Orientation.ISO:
                // if not consider about col, then left is 'w/2 * (rows - row - 1)'
                // if consider about col then left must add 'w/2 * col'
                // so left is 'w/2 * (rows - row - 1) + w/2 * col'
                // combine expression is 'w/2 * (rows - row + col -1)'
                cullingCol = rows + col - row - 1;
                // if not consider about row, then bottom is 'h/2 * (cols - col -1)'
                // if consider about row then bottom must add 'h/2 * (rows - row - 1)'
                // so bottom is 'h/2 * (cols - col -1) + h/2 * (rows - row - 1)'
                // combine expressionn is 'h/2 * (rows + cols - col - row - 2)'
                cullingRow = rows + cols - col - row - 2;
                left = maptw2 * cullingCol;
                bottom = mapth2 * cullingRow;
                break;
            // left top to right dowm
            case Orientation.HEX:
                diffX2 = (axis! === StaggerAxis.STAGGERAXIS_Y && row % 2 === 1) ? maptw2 * odd_even! : 0;
                diffY2 = (axis! === StaggerAxis.STAGGERAXIS_X && col % 2 === 1) ? mapth2 * -odd_even! : 0;

                left = col * (maptw - diffX1!) + diffX2;
                bottom = (rows - row - 1) * (mapth - diffY1!) + diffY2;
                cullingCol = col;
                cullingRow = rows - row - 1;
                break;
        }

        let rowData = vertices[cullingRow] = vertices[cullingRow] || { minCol: 0, maxCol: 0 };
        let colData = rowData[cullingCol] = rowData[cullingCol] || {};

        // record each row range, it will faster when culling grid
        if (rowData.minCol > cullingCol) {
            rowData.minCol = cullingCol;
        }

        if (rowData.maxCol < cullingCol) {
            rowData.maxCol = cullingCol;
        }

        // record max rect, when viewPort is bigger than layer, can make it smaller
        if (rightTop.row < cullingRow) {
            rightTop.row = cullingRow;
        }

        if (rightTop.col < cullingCol) {
            rightTop.col = cullingCol;
        }

        // _offset is whole layer offset
        // tileOffset is tileset offset which is related to each grid
        // tileOffset coordinate system's y axis is opposite with engine's y axis.
        tileOffset = grid.tileset.tileOffset!;
        left += this._offset!.x + tileOffset!.x + grid.offsetX;
        bottom += this._offset!.y - tileOffset!.y - grid.offsetY;

        topBorder = -tileOffset.y + grid.tileset._tileSize.height - mapth;
        topBorder = topBorder < 0 ? 0 : topBorder;
        downBorder = tileOffset.y < 0 ? 0 : tileOffset.y;
        leftBorder = -tileOffset.x < 0 ? 0 : -tileOffset.x;
        rightBorder = tileOffset.x + grid.tileset._tileSize.width - maptw;
        rightBorder = rightBorder < 0 ? 0 : rightBorder;

        if (this._rightOffset < leftBorder) {
            this._rightOffset = leftBorder;
        }

        if (this._leftOffset < rightBorder) {
            this._leftOffset = rightBorder;
        }

        if (this._topOffset < downBorder) {
            this._topOffset = downBorder;
        }

        if (this._downOffset < topBorder) {
            this._downOffset = topBorder;
        }

        colData.left = left;
        colData.bottom = bottom;
        // this index is tiledmap grid index
        colData.index = index;

        this._cullingDirty = true;
    }

    _updateVertices() {
        let vertices = this._vertices;
        vertices.length = 0;

        let tiles = this._tiles;
        if (!tiles) {
            return;
        }

        let rightTop = this._rightTop;
        rightTop.row = -1;
        rightTop.col = -1;

        let rows = this._layerSize!.height,
            cols = this._layerSize!.width;

        this._topOffset = 0;
        this._downOffset = 0;
        this._leftOffset = 0;
        this._rightOffset = 0;
        this._hasAniGrid = false;

        for (let row = 0; row < rows; ++row) {
            for (let col = 0; col < cols; ++col) {
                this._updateVertex(col, row);
            }
        }
        this._verticesDirty = false;
    }

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
    getTiledTileAt(x: number, y: number, forceCreate?: boolean) {
        if (this._isInvalidPosition(x, y)) {
            throw new Error("TiledLayer.getTiledTileAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7236);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        let tile = this._tiledTiles[index];
        if (!tile && forceCreate) {
            let node = new cc.Node();
            tile = node.addComponent(TiledTile);
            tile._x = x;
            tile._y = y;
            tile._layer = this;
            tile.updateInfo();
            node.parent = this.node;
            return tile;
        }
        return tile;
    }

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
    setTiledTileAt(x: number, y: number, tiledTile: TiledTile | null): TiledTile | null {
        if (this._isInvalidPosition(x, y)) {
            throw new Error("TiledLayer.setTiledTileAt: invalid position");
        }
        if (!this._tiles) {
            cc.logID(7236);
            return null;
        }

        let index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        this._tiledTiles[index] = tiledTile;
        this._cullingDirty = true;

        if (tiledTile) {
            this._hasTiledNodeGrid = true;
        } else {
            this._hasTiledNodeGrid = this._tiledTiles.some(function (tiledNode) {
                return !!tiledNode;
            });
        }

        return tiledTile;
    }

    /**
     * !#en Return texture.
     * !#zh 获取纹理。
     * @method getTexture
     * @param index The index of textures
     * @return {Texture2D}
     */
    getTexture(index?: number): cc.SpriteFrame | null {
        index = index || 0;
        if (this._textures && index >= 0 && this._textures.length > index) {
            return this._textures[index];
        }
        return null;
    }

    /**
     * !#en Return texture.
     * !#zh 获取纹理。
     * @method getTextures
     * @return {Texture2D}
     */
    getTextures() {
        return this._textures;
    }

    /**
     * !#en Set the texture.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {SpriteFrame} texture
     */
    setTexture(texture: cc.SpriteFrame) {
        this.setTextures([texture]);
    }

    /**
     * !#en Set the texture.
     * !#zh 设置纹理。
     * @method setTexture
     * @param {SpriteFrame} textures
     */
    setTextures(textures: cc.SpriteFrame[]) {
        this._textures = textures;
        this.markForUpdateRenderData();
    }

    /**
     * !#en Gets layer size.
     * !#zh 获得层大小。
     * @method getLayerSize
     * @return {Size}
     * @example
     * let size = tiledLayer.getLayerSize();
     * cc.log("layer size: " + size);
     */
    getLayerSize(): cc.Size {
        return this._layerSize!;
    }

    /**
     * !#en Size of the map's tile (could be different from the tile's size).
     * !#zh 获取 tile 的大小( tile 的大小可能会有所不同)。
     * @method getMapTileSize
     * @return {Size}
     * @example
     * let mapTileSize = tiledLayer.getMapTileSize();
     * cc.log("MapTile size: " + mapTileSize);
     */
    getMapTileSize(): cc.Size {
        return this._mapTileSize!;
    }

    /**
     * !#en Gets Tile set first information for the layer.
     * !#zh 获取 layer 索引位置为0的 Tileset 信息。
     * @method getTileSet
     * @param index The index of tilesets
     * @return {TMXTilesetInfo}
     */
    getTileSet(index: number): TMXTilesetInfo | null {
        index = index || 0;
        if (this._tilesets && index >= 0 && this._tilesets.length > index) {
            return this._tilesets[index];
        }
        return null;
    }

    /**
     * !#en Gets tile set all information for the layer.
     * !#zh 获取 layer 所有的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     */
    getTileSets(): TMXTilesetInfo[] {
        return this._tilesets;
    }

    /**
     * !#en Sets tile set information for the layer.
     * !#zh 设置 layer 的 tileset 信息。
     * @method setTileSet
     * @param {TMXTilesetInfo} tileset
     */
    setTileSet(tileset: TMXTilesetInfo) {
        this.setTileSets([tileset]);
    }

    /**
     * !#en Sets Tile set information for the layer.
     * !#zh 设置 layer 的 Tileset 信息。
     * @method setTileSets
     * @param {TMXTilesetInfo} tilesets
     */
    setTileSets(tilesets: TMXTilesetInfo[]) {
        this._tilesets = tilesets;
        let textures: cc.SpriteFrame[] = this._textures = [];
        let texGrids = this._texGrids!;
        texGrids.clear();
        for (let i = 0; i < tilesets.length; i++) {
            let tileset = tilesets[i];
            if (tileset) {
                textures[i] = tileset.sourceImage!;
            }
        }

        let self = this;
        loadAllTextures(textures, function () {
            for (let i = 0, l = tilesets.length; i < l; ++i) {
                let tilesetInfo = tilesets[i];
                if (!tilesetInfo) continue;

                // let idx = texIdCache.get(tilesetInfo.sourceImage!.texture as cc.Texture2D)
                // if (idx === undefined) {
                //     texIdCache.set(tilesetInfo.sourceImage!.texture as cc.Texture2D, i);
                //     idx = i;
                // }
                fillTextureGrids(tilesetInfo, texGrids, tilesetInfo.sourceImage);
            }
            self._prepareToRender();
        }.bind(this));
    }

    // _traverseAllGrid() {
    //     let tiles = this._tiles;
    //     let texGrids = this._texGrids!;
    //     let tilesetIndexArr = this._tilesetIndexArr;
    //     let tilesetIndexToArrIndex = this._tilesetIndexToArrIndex = {};

    //     const TileFlag = TileFlag;
    //     const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

    //     tilesetIndexArr.length = 0;
    //     for (let i = 0; i < tiles.length; i++) {
    //         let gid = (((tiles[i] as unknown as number) & FLIPPED_MASK) >>> 0);
    //         if (gid === 0) continue;
    //         let grid = texGrids.get(gid as unknown as GID);
    //         if (!grid) {
    //             cc.error("CCTiledLayer:_traverseAllGrid grid is null, gid is:", gid);
    //             continue;
    //         }
    //         let textureID = grid.texId as unknown as number;
    //         if (tilesetIndexToArrIndex[textureID] !== undefined) continue;
    //         tilesetIndexToArrIndex[textureID] = tilesetIndexArr.length;
    //         tilesetIndexArr.push(textureID);
    //     }
    // }

    _init(layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo, tilesets: TMXTilesetInfo[], textures: cc.SpriteFrame[], texGrids: TiledTextureGrids) {

        this._cullingDirty = true;
        this._layerInfo = layerInfo;
        this._mapInfo = mapInfo;

        let size = layerInfo._layerSize!;

        // layerInfo
        this._layerName = layerInfo.name;
        this._tiles = layerInfo._tiles as unknown as any;
        this._properties = layerInfo.properties;
        this._layerSize = size;
        this._minGID = layerInfo._minGID;
        this._maxGID = layerInfo._maxGID;
        this._opacity = layerInfo._opacity;

        if (layerInfo.tintColor) {
            this._tintColor = cc.color(layerInfo.tintColor);
            // this.node.color = this._tintColor;
        }

        this.renderOrder = mapInfo.renderOrder;
        this._staggerAxis = mapInfo.getStaggerAxis()!;
        this._staggerIndex = mapInfo.getStaggerIndex()!;
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

        let maptw = this._mapTileSize.width;
        let mapth = this._mapTileSize.height;
        let layerW = this._layerSize.width;
        let layerH = this._layerSize.height;

        if (this._layerOrientation === Orientation.HEX) {
            
            let width = 0, height = 0;

            this._odd_even = (this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
            if (this._staggerAxis === StaggerAxis.STAGGERAXIS_X) {
                this._diffX1 = (maptw - this._hexSideLength) / 2;
                this._diffY1 = 0;
                height = mapth * (layerH + 0.5);
                width = (maptw + this._hexSideLength) * Math.floor(layerW / 2) + maptw * (layerW % 2);
            } else {
                this._diffX1 = 0;
                this._diffY1 = (mapth - this._hexSideLength) / 2;
                width = maptw * (layerW + 0.5);
                height = (mapth + this._hexSideLength) * Math.floor(layerH / 2) + mapth * (layerH % 2);
            }
            this.node._uiProps.uiTransformComp!.setContentSize(width, height);
        } else if (this._layerOrientation === Orientation.ISO) {
            let wh = layerW + layerH;
            this.node._uiProps.uiTransformComp!.setContentSize(maptw * 0.5 * wh, mapth * 0.5 * wh);
        } else {
            this.node._uiProps.uiTransformComp!.setContentSize(layerW * maptw, layerH * mapth);
        }

        // offset (after layer orientation is set);
        this._offset = cc.v2(layerInfo.offset.x, -layerInfo.offset.y);
        this._useAutomaticVertexZ = false;
        this._vertexZvalue = 0;
        this._syncAnchorPoint();
        this._prepareToRender();
    }

    _prepareToRender() {
        this._updateVertices();
        // this._traverseAllGrid();
        this._updateAllUserNode();
    }

    public requestMeshRenderData() {
        if(!this._meshRenderDataArray) { 
            this._meshRenderDataArray = new Array();
        }
        let renderData = new MeshRenderData();
        let comb = { renderData, texture: null };
        Object.defineProperty(renderData, 'material', { get: () => { return this.getRenderMaterial(0); } });
        this._meshRenderDataArray.push(comb);
        return comb;
    }


    public destroyRenderData() {
        if (this._meshRenderDataArray) {
            this._meshRenderDataArray.forEach(rd => rd.renderData.reset());
            this._meshRenderDataArray = null;
        }
    }

    public resetRenderData() {
        if (this._meshRenderDataArray) {
            this._meshRenderDataArray.forEach(x => x.renderData.reset());
        }
    }

    public markForUpdateRenderData(enable: boolean = true) {
        this._renderFlag = this._canRender();
        if (enable && this._renderFlag) {
            this._renderDataFlag = enable;
        } else if (!enable) {
            this._renderDataFlag = enable;
        }
    }

    protected _flushAssembler() {
        const assembler = TiledLayer.Assembler!.getAssembler(this);
        if (this._assembler !== assembler) {
            this._assembler = assembler;
        }
        if (!this._meshRenderDataArray) {
            if (this._assembler && this._assembler.createData) {
                this._assembler.createData(this);
                this.markForUpdateRenderData();
                this._updateColor();
            }
        }
    }


    _renderDataIndex: number = 0;
    protected _render(ui: UI) {
        if (this._meshRenderDataArray) {
            for (let i = 0; i < this._meshRenderDataArray.length; i++) {
                this._renderDataIndex = i;
                let m = this._meshRenderDataArray[i];
                if (m.texture) {
                    ui.commitComp(this, m.texture.getGFXTexture(), this._assembler, m.texture.getGFXSampler());
                }
            }
        }
    }
}


legacyCC.TiledLayer = TiledLayer;