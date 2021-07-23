/* eslint-disable default-case */
/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 */

/**
 * @packageDocumentation
 * @module tiledmap
 */

import { ccclass } from 'cc.decorator';

import { EDITOR } from 'internal:constants';
import { Renderable2D } from '../2d/framework/renderable-2d';
import { SpriteFrame } from '../2d/assets/sprite-frame';
import { Component } from '../core/components';
import { TMXMapInfo } from './tmx-xml-parser';
import { Color, IVec2Like, Mat4, Size, Texture2D, Vec2, Vec3, Node, warn, logID, CCBoolean, director } from '../core';
import { TiledTile } from './tiled-tile';
import { MeshRenderData } from '../2d/renderer/render-data';
import { Batcher2D } from '../2d/renderer/batcher-2d';
import {
    MixedGID, GID, Orientation, TiledTextureGrids, TMXTilesetInfo, RenderOrder, StaggerAxis, StaggerIndex, TileFlag,
    GIDFlags, TiledGrid, TiledAnimationType, PropertiesInfo, TMXLayerInfo,
} from './tiled-types';
import { fillTextureGrids } from './tiled-utils';
import { NodeEventType } from '../core/scene-graph/node-event';

const _mat4_temp = new Mat4();
const _vec2_temp = new Vec2();
const _vec3_temp = new Vec3();
const _vec3_temp2 = new Vec3();
const _tempRowCol = { row: 0, col: 0 };

@ccclass('cc.TiledUserNodeData')
export class TiledUserNodeData extends Component {
    _index = -1;
    _row = -1;
    _col = -1;
    _tiledLayer: TiledLayer | null = null;
    constructor () {
        super();
    }
}

export interface TiledMeshData {
    renderData: MeshRenderData;
    texture: Texture2D | null;
}

interface TiledSubNodeData {
    subNodes: (null | TiledUserNodeData)[];
}

type TiledMeshDataArray = (TiledMeshData | TiledSubNodeData)[];

/**
 * @en Render the TMX layer.
 * @zh 渲染 TMX layer。
 * @class TiledLayer
 * @extends Component
 */
@ccclass('cc.TiledLayer')
export class TiledLayer extends Renderable2D {
    // [row][col] = {count: 0, nodesList: []};
    protected _userNodeGrid: { [key: number]: { count: number;[key: number]: { count: number, list: (TiledUserNodeData | null)[] } } } = {};
    protected _userNodeMap: { [key: string]: TiledUserNodeData } = {};// [id] = node;
    protected _userNodeDirty = false;

    // store the layer tiles node, index is caculated by 'x + width * y', format likes '[0]=tileNode0,[1]=tileNode1, ...'
    public tiledTiles: (TiledTile | null)[] = [];

    // // store the layer tilesets index array
    // _tilesetIndexArr: number[] = [];
    // // tileset index to array index
    // _tilesetIndexToArrIndex: { [key: number]: number } = {};

    protected _viewPort = { x: -1, y: -1, width: -1, height: -1 };
    protected _cullingRect = {
        leftDown: { row: -1, col: -1 },
        rightTop: { row: -1, col: -1 },
    };
    get cullingRect () { return this._cullingRect; }

    protected _cullingDirty = true;
    protected _rightTop = { row: -1, col: -1 };
    get rightTop () { return this._rightTop; }

    protected _layerInfo: TMXLayerInfo | null = null;
    protected _mapInfo: TMXMapInfo | null = null;

    // record max or min tile texture offset,
    // it will make culling rect more large, which insure culling rect correct.
    protected _topOffset = 0;
    protected _downOffset = 0;
    protected _leftOffset = 0;
    protected _rightOffset = 0;

    // store the layer tiles, index is caculated by 'x + width * y', format likes '[0]=gid0,[1]=gid1, ...'
    public tiles: MixedGID[] = [];

    // vertex array
    public vertices: { minCol: number, maxCol: number, [key: number]: { left: number, bottom: number, index: number } }[] = [];
    // vertices dirty
    protected _verticesDirty = true;

    protected _layerName = '';
    protected _layerSize?: Size;

    get layerSize () { return this._layerSize!; }

    protected _minGID?: GID;
    protected _maxGID?: GID;
    protected _layerOrientation: null | Orientation = null;

    protected _opacity?: number;
    protected _tintColor?: Color;

    // store all layer gid corresponding texture info, index is gid, format likes '[gid0]=tex-info,[gid1]=tex-info, ...'
    public texGrids: TiledTextureGrids | null = null;
    // store all tileset texture, index is tileset index, format likes '[0]=texture0, [1]=texture1, ...'
    protected _textures: SpriteFrame[] = [];
    protected _tilesets: TMXTilesetInfo[] = [];

    protected _leftDownToCenterX = 0;
    protected _leftDownToCenterY = 0;

    protected _hasTiledNodeGrid = false;
    protected _hasAniGrid = false;
    protected _animations: TiledAnimationType | null = null;

    // switch of culling
    protected _enableCulling?: boolean;

    public colorChanged = false;

    protected _properties?: PropertiesInfo;
    public renderOrder?: RenderOrder;
    protected _staggerAxis?: StaggerAxis;
    protected _staggerIndex?: StaggerIndex;
    protected _hexSideLength?: number;

    protected _mapTileSize?: Size;
    protected _odd_even?: number;
    protected _diffX1?: number;
    protected _diffY1?: number;
    protected _useAutomaticVertexZ?: boolean;
    protected _vertexZvalue?: number;
    protected _offset?: Vec2;

    protected _meshRenderDataArray: TiledMeshDataArray | null = null;

    get meshRenderDataArray () { return this._meshRenderDataArray; }
    get leftDownToCenterX () { return this._leftDownToCenterX; }
    get leftDownToCenterY () { return this._leftDownToCenterY; }

    constructor () {
        super();
    }

    public hasTiledNode () {
        return this._hasTiledNodeGrid;
    }

    public hasAnimation () {
        return this._hasAniGrid;
    }

    /**
     * @en enable or disable culling
     * @zh 开启或关闭裁剪。
     * @method enableCulling
     * @param value
     */
    set enableCulling (value: boolean) {
        if (this._enableCulling !== value) {
            this._enableCulling = value;
            this._cullingDirty = true;
            this.markForUpdateRenderData();
        }
    }
    get enableCulling () { return this._enableCulling!; }

    /**
     * @en Adds user's node into layer.
     * @zh 添加用户节点。
     * @method addUserNode
     * @param {cc.Node} node
     * @return {Boolean}
     */
    public addUserNode (node: Node) {
        let dataComp = node.getComponent(TiledUserNodeData);
        if (dataComp) {
            warn('CCTiledLayer:addUserNode node has been added');
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
        node.on(NodeEventType.TRANSFORM_CHANGED, this._userNodePosChange, dataComp);
        node.on(NodeEventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
        return true;
    }

    /**
     * @en Removes user's node.
     * @zh 移除用户节点。
     * @method removeUserNode
     * @param {cc.Node} node
     * @return {Boolean}
     */
    public removeUserNode (node: Node) {
        const dataComp = node.getComponent(TiledUserNodeData);
        if (!dataComp) {
            warn('CCTiledLayer:removeUserNode node is not exist');
            return false;
        }
        node.off(NodeEventType.TRANSFORM_CHANGED, this._userNodePosChange, dataComp);
        node.off(NodeEventType.SIZE_CHANGED, this._userNodeSizeChange, dataComp);
        this._removeUserNodeFromGrid(dataComp);
        delete this._userNodeMap[node.uuid];
        node._removeComponent(dataComp);
        dataComp.destroy();
        node.removeFromParent();
        // node._renderFlag &= ~RenderFlow.FLAG_BREAK_FLOW;
        return true;
    }

    /**
     * @en Destroy user's node.
     * @zh 销毁用户节点。
     * @method destroyUserNode
     * @param {cc.Node} node
     */
    public destroyUserNode (node: Node) {
        this.removeUserNode(node);
        node.destroy();
    }

    // acording layer anchor point to calculate node layer pos
    protected _nodeLocalPosToLayerPos (nodePos: IVec2Like, out: IVec2Like) {
        out.x = nodePos.x + this._leftDownToCenterX;
        out.y = nodePos.y + this._leftDownToCenterY;
    }

    public getNodesByRowCol (row: number, col: number) {
        const rowData = this._userNodeGrid[row];
        if (!rowData) return null;
        return rowData[col];
    }

    public getNodesCountByRow (row) {
        const rowData = this._userNodeGrid[row];
        if (!rowData) return 0;
        return rowData.count;
    }

    protected _updateAllUserNode () {
        this._userNodeGrid = {};
        for (const dataId in this._userNodeMap) {
            const dataComp = this._userNodeMap[dataId];
            this._nodeLocalPosToLayerPos(dataComp.node.getPosition(), _vec2_temp);
            this._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);
            this._addUserNodeToGrid(dataComp, _tempRowCol);
            this._updateCullingOffsetByUserNode(dataComp.node);
        }
    }

    protected _updateCullingOffsetByUserNode (node_: Node) {
        const node = node_._uiProps.uiTransformComp!.contentSize;
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

    protected _userNodeSizeChange () {
        const dataComp: TiledUserNodeData = this as unknown as any;
        const node = dataComp.node;
        const self = dataComp._tiledLayer!;
        self._updateCullingOffsetByUserNode(node);
        self._userNodeDirty = true;
        self.markForUpdateRenderData();
    }

    protected _userNodePosChange () {
        const dataComp: TiledUserNodeData = this as unknown as any;
        const node = dataComp.node;
        const self = dataComp._tiledLayer!;
        self._nodeLocalPosToLayerPos(node.getPosition(), _vec2_temp);
        self._positionToRowCol(_vec2_temp.x, _vec2_temp.y, _tempRowCol);
        self._limitInLayer(_tempRowCol);
        // users pos not change
        if (_tempRowCol.row === dataComp._row && _tempRowCol.col === dataComp._col) return;

        self._removeUserNodeFromGrid(dataComp);
        self._addUserNodeToGrid(dataComp, _tempRowCol);
    }

    protected _removeUserNodeFromGrid (dataComp: TiledUserNodeData) {
        const row = dataComp._row;
        const col = dataComp._col;
        const index = dataComp._index;

        const rowData = this._userNodeGrid[row];
        const colData = rowData && rowData[col];
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
        this.markForUpdateRenderData();
    }

    protected _limitInLayer (rowCol: { row: number, col: number }) {
        const row = rowCol.row;
        const col = rowCol.col;
        if (row < 0) rowCol.row = 0;
        if (row > this._rightTop.row) rowCol.row = this._rightTop.row;
        if (col < 0) rowCol.col = 0;
        if (col > this._rightTop.col) rowCol.col = this._rightTop.col;
    }

    protected _addUserNodeToGrid (dataComp: TiledUserNodeData, tempRowCol: { col: number, row: number }) {
        const row = tempRowCol.row;
        const col = tempRowCol.col;
        const rowData = this._userNodeGrid[row] = this._userNodeGrid[row] || { count: 0 };
        const colData = rowData[col] = rowData[col] || { count: 0, list: [] };
        dataComp._row = row;
        dataComp._col = col;
        dataComp._index = colData.list.length;
        rowData.count++;
        colData.count++;
        colData.list.push(dataComp);
        this._userNodeDirty = true;
    }

    public isUserNodeDirty () {
        return this._userNodeDirty;
    }

    public setUserNodeDirty (value) {
        this._userNodeDirty = value;
    }

    onEnable () {
        super.onEnable();
        this.node.on(NodeEventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
        this.node.on(NodeEventType.TRANSFORM_CHANGED, this.updateCulling, this);
        this.node.on(NodeEventType.SIZE_CHANGED, this.updateCulling, this);
        this.node.parent!.on(NodeEventType.TRANSFORM_CHANGED, this.updateCulling, this);
        this.node.parent!.on(NodeEventType.SIZE_CHANGED, this.updateCulling, this);
        this.markForUpdateRenderData();
        // delay 1 frame, since camera's matrix data is dirty
        this.scheduleOnce(this.updateCulling.bind(this));
    }

    onDisable () {
        super.onDisable();
        this.node.parent!.off(NodeEventType.SIZE_CHANGED, this.updateCulling, this);
        this.node.parent!.off(NodeEventType.TRANSFORM_CHANGED, this.updateCulling, this);
        this.node.off(NodeEventType.SIZE_CHANGED, this.updateCulling, this);
        this.node.off(NodeEventType.TRANSFORM_CHANGED, this.updateCulling, this);
        this.node.off(NodeEventType.ANCHOR_CHANGED, this._syncAnchorPoint, this);
    }

    protected _syncAnchorPoint () {
        const node = this.node;
        const trans = node._uiProps.uiTransformComp!;
        const scale = node.getScale();
        this._leftDownToCenterX = trans.width * trans.anchorX * scale.x;
        this._leftDownToCenterY = trans.height * trans.anchorY * scale.y;
        this._cullingDirty = true;
        this.markForUpdateRenderData();
    }

    onDestroy () {
        super.onDestroy();
    }

    /**
     * @en Gets the layer name.
     * @zh 获取层的名称。
     * @method getLayerName
     * @return {String}
     * @example
     * let layerName = tiledLayer.getLayerName();
     * cc.log(layerName);
     */
    public getLayerName (): string {
        return this._layerName;
    }

    /**
     * @en Set the layer name.
     * @zh 设置层的名称
     * @method SetLayerName
     * @param {String} layerName
     * @example
     * tiledLayer.setLayerName("New Layer");
     */
    public setLayerName (layerName: string) {
        this._layerName = layerName;
    }

    /**
     * @en Return the value for the specific property name.
     * @zh 获取指定属性名的值。
     * @method getProperty
     * @param {String} propertyName
     * @return {*}
     * @example
     * let property = tiledLayer.getProperty("info");
     * cc.log(property);
     */
    public getProperty (propertyName: string) {
        return this._properties![propertyName];
    }

    /**
     * @en Returns the position in pixels of a given tile coordinate.
     * @zh 获取指定 tile 的像素坐标。
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
    public getPositionAt (pos: IVec2Like | number, y?: number): Vec2 | null {
        let x;
        if (y !== undefined) {
            x = Math.floor(pos as number);
            y = Math.floor(y);
        } else {
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

    public isInvalidPosition (x: number, y: number) {
        return x >= this._layerSize!.width || y >= this._layerSize!.height || x < 0 || y < 0;
    }

    protected _positionForIsoAt (x: number, y: number): Vec2 {
        let offsetX = 0;
        let offsetY = 0;
        const index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        const gidAndFlags = this.tiles[index];
        if (gidAndFlags) {
            const gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0);
            const tileset = this.texGrids!.get(gid as unknown as GID)!.tileset;
            const offset = tileset.tileOffset;
            offsetX = offset.x;
            offsetY = offset.y;
        }

        return new Vec2(
            this._mapTileSize!.width * 0.5 * (this._layerSize!.height + x - y - 1) + offsetX,
            this._mapTileSize!.height * 0.5 * (this._layerSize!.width - x + this._layerSize!.height - y - 2) - offsetY,
        );
    }

    protected _positionForOrthoAt (x: number, y: number): Vec2 {
        let offsetX = 0;
        let offsetY = 0;
        const index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        const gidAndFlags = this.tiles[index];
        if (gidAndFlags) {
            const gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0) as unknown as GID;
            const tileset = this.texGrids!.get(gid)!.tileset;
            const offset = tileset.tileOffset;
            offsetX = offset.x;
            offsetY = offset.y;
        }

        return new Vec2(
            x * this._mapTileSize!.width + offsetX,
            (this._layerSize!.height - y - 1) * this._mapTileSize!.height - offsetY,
        );
    }

    protected _positionForHexAt (col: number, row: number): Vec2 {
        const tileWidth = this._mapTileSize!.width;
        const tileHeight = this._mapTileSize!.height;
        const rows = this._layerSize!.height;

        const index = Math.floor(col) + Math.floor(row) * this._layerSize!.width;
        const gid = ((this.tiles[index] as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0;
        let offset: IVec2Like;
        if (this.texGrids!.get(gid as unknown as GID)) {
            offset = this.texGrids!.get(gid as unknown as GID)!.tileset.tileOffset;
        } else {
            offset = { x: 0, y: 0 };
        }

        const odd_even = (this._staggerIndex === StaggerIndex.STAGGERINDEX_ODD) ? 1 : -1;
        let x = 0;
        let y = 0;
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
        return new Vec2(x, y);
    }

    /**
     * @en
     * Sets the tiles gid (gid = tile global id) at a given tiles rect.
     * @zh
     * 设置给定区域的 tile 的 gid (gid = tile 全局 id)，
     * @method setTilesGIDAt
     * @param {Array} gids an array contains gid
     * @param {Number} beginCol begin col number
     * @param {Number} beginRow begin row number
     * @param {Number} totalCols count of column
     * @example
     * tiledLayer.setTilesGIDAt([1, 1, 1, 1], 10, 10, 2)
     */
    public setTilesGIDAt (gids: number[], beginCol: number, beginRow: number, totalCols: number) {
        if (!gids || gids.length === 0 || totalCols <= 0) return;
        if (beginRow < 0) beginRow = 0;
        if (beginCol < 0) beginCol = 0;
        let gidsIdx = 0;
        const endCol = beginCol + totalCols;
        for (let row = beginRow; ; row++) {
            for (let col = beginCol; col < endCol; col++) {
                if (gidsIdx >= gids.length) return;
                this._updateTileForGID(gids[gidsIdx] as unknown as MixedGID, col, row);
                gidsIdx++;
            }
        }
    }

    /**
     * @en
     * Sets the tile gid (gid = tile global id) at a given tile coordinate.<br />
     * The Tile GID can be obtained by using the method "tileGIDAt" or by using the TMX editor . Tileset Mgr +1.<br />
     * If a tile is already placed at that position, then it will be removed.
     * @zh
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
    public setTileGIDAt (gid: MixedGID, x: number, y: number, flags?: number) {
        const ugid = ((gid as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0;

        x = Math.floor(x);
        y = Math.floor(y);
        if (this.isInvalidPosition(x, y)) {
            throw new Error('cc.TiledLayer.setTileGIDAt(): invalid position');
        }
        if (!this.tiles || !this._tilesets || this._tilesets.length === 0) {
            logID(7238);
            return;
        }
        if (ugid !== 0 && ugid < (this._tilesets[0].firstGid as unknown as number)) {
            logID(7239, gid);
            return;
        }

        flags = flags || 0;
        this._updateTileForGID(((ugid | flags) >>> 0) as unknown as MixedGID, x, y);
    }

    protected _updateTileForGID (gidAndFlags: MixedGID, x: number, y: number): void {
        const idx = 0 | (x + y * this._layerSize!.width);
        if (idx >= this.tiles.length) return;

        const oldGIDAndFlags = this.tiles[idx];
        if (gidAndFlags === oldGIDAndFlags) return;

        const gid = (((gidAndFlags as unknown as number) & TileFlag.FLIPPED_MASK) >>> 0);
        const grid = this.texGrids!.get(gid as unknown as GID);

        if (grid) {
            this.tiles[idx] = gidAndFlags;
            this._updateVertex(x, y);
        } else {
            this.tiles[idx] = 0 as unknown as MixedGID;
        }
        this._cullingDirty = true;
    }

    /**
     * @en
     * Returns the tile gid at a given tile coordinate. <br />
     * if it returns 0, it means that the tile is empty. <br />
     * @zh
     * 通过给定的 tile 坐标、flags（可选）返回 tile 的 GID. <br />
     * 如果它返回 0，则表示该 tile 为空。<br />
     * @method getTileGIDAt
     * @param {Vec2} pos
     * @return {Number}
     * @example
     * let tileGid = tiledLayer.getTileGIDAt(0, 0);
     */
    public getTileGIDAt (x: number, y: number): number | null {
        if (this.isInvalidPosition(x, y)) {
            throw new Error('cc.TiledLayer.getTileGIDAt(): invalid position');
        }
        if (!this.tiles) {
            logID(7237);
            return null;
        }

        const index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        const tile = this.tiles[index] as unknown as number;

        return ((tile & TileFlag.FLIPPED_MASK) >>> 0);
    }
    /**
     * @en
     * Returns the tile flags at a given tile coordinate. <br />
     * @zh
     * 通过给定的 tile 坐标, 返回 tile 的 flags. <br />
     * 如果它返回 null，则表示该 tile 为空。<br />
     * @method getTileGIDAt
     * @param {number}} x
     * @param {number}} y
     * @return {Number}
     * @example
     * let tileGid = tiledLayer.getTileGIDAt(0, 0);
     */
    public getTileFlagsAt (x: number, y: number) {
        if (this.isInvalidPosition(x, y)) {
            throw new Error('TiledLayer.getTileFlagsAt: invalid position');
        }
        if (!this.tiles) {
            logID(7240);
            return null;
        }

        const idx = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        // Bits on the far end of the 32-bit global tile ID are used for tile flags
        const tile = this.tiles[idx] as unknown as number;

        return ((tile & TileFlag.FLIPPED_ALL) >>> 0) as unknown as GIDFlags;
    }

    public setCullingDirty (value: boolean) {
        this._cullingDirty = value;
    }

    public isCullingDirty (): boolean {
        return this._cullingDirty;
    }

    // 'x, y' is the position of viewPort, which's anchor point is at the center of rect.
    // 'width, height' is the size of viewPort.
    public updateViewPort (x: number, y: number, width: number, height: number): void {
        if (this._viewPort.width === width
            && this._viewPort.height === height
            && this._viewPort.x === x
            && this._viewPort.y === y) {
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

        const vpx = this._viewPort.x - this._offset!.x + this._leftDownToCenterX;
        const vpy = this._viewPort.y - this._offset!.y + this._leftDownToCenterY;

        let leftDownX = vpx - this._leftOffset;
        let leftDownY = vpy - this._downOffset;
        const rightTopX = vpx + width + this._rightOffset;
        const rightTopY = vpy + height + this._topOffset;

        const leftDown = this._cullingRect.leftDown;
        const rightTop = this._cullingRect.rightTop;

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
            this.markForUpdateRenderData();
        }
    }

    // the result may not precise, but it dose't matter, it just uses to be got range
    protected _positionToRowCol (x: number, y: number, result: { col: number, row: number }): { col: number, row: number } {
        const maptw = this._mapTileSize!.width;
        const mapth = this._mapTileSize!.height;
        const maptw2 = maptw * 0.5;
        const mapth2 = mapth * 0.5;
        let row = 0;
        let col = 0;
        let diffX2 = 0;
        let diffY2 = 0;
        const axis = this._staggerAxis;

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

    public updateCulling () {
        if (EDITOR) {
            this.enableCulling = false;
        } else if (this._enableCulling) {
            this.node.updateWorldTransform();
            Mat4.invert(_mat4_temp, this.node.getWorldMatrix());
            const camera = director.root!.batcher2D.getFirstRenderCamera(this.node);
            if (camera) {
                _vec3_temp.x = 0;
                _vec3_temp.y = 0;
                _vec3_temp.z = 0;
                _vec3_temp2.x = camera.width;
                _vec3_temp2.y = camera.height;
                _vec3_temp2.z = 0;
                camera.screenToWorld(_vec3_temp, _vec3_temp);
                camera.screenToWorld(_vec3_temp2, _vec3_temp2);
                // camera.getScreenToWorldPoint(_vec2_temp, _vec2_temp);
                // camera.getScreenToWorldPoint(_vec2_temp2, _vec2_temp2);
                Vec3.transformMat4(_vec3_temp, _vec3_temp, _mat4_temp);
                Vec3.transformMat4(_vec3_temp2, _vec3_temp2, _mat4_temp);
                this.updateViewPort(_vec3_temp.x, _vec3_temp.y, _vec3_temp2.x - _vec3_temp.x, _vec3_temp2.y - _vec3_temp.y);
            }
        }
    }

    /**
     * @en Layer orientation, which is the same as the map orientation.
     * @zh 获取 Layer 方向(同地图方向)。
     * @method getLayerOrientation
     * @return {Number}
     * @example
     * let orientation = tiledLayer.getLayerOrientation();
     * cc.log("Layer Orientation: " + orientation);
     */
    public getLayerOrientation () {
        return this._layerOrientation;
    }

    /**
     * @en properties from the layer. They can be added using Tiled.
     * @zh 获取 layer 的属性，可以使用 Tiled 编辑器添加属性。
     * @method getProperties
     * @return {Object}
     * @example
     * let properties = tiledLayer.getProperties();
     * cc.log("Properties: " + properties);
     */
    public getProperties () {
        return this._properties;
    }

    protected _updateVertex (col: number, row: number) {
        const FLIPPED_MASK = TileFlag.FLIPPED_MASK;

        const vertices = this.vertices;

        const layerOrientation = this._layerOrientation;
        const tiles = this.tiles;

        if (!tiles) {
            return;
        }

        const rightTop = this._rightTop;
        const maptw = this._mapTileSize!.width;
        const mapth = this._mapTileSize!.height;
        const maptw2 = maptw * 0.5;
        const mapth2 = mapth * 0.5;
        const rows = this._layerSize!.height;
        const cols = this._layerSize!.width;
        const grids = this.texGrids!;

        let left = 0;
        let bottom = 0;
        let axis: StaggerAxis;
        let diffX1: number;
        let diffY1: number;
        let odd_even: number;
        let diffX2: number;
        let diffY2: number;

        if (layerOrientation === Orientation.HEX) {
            axis = this._staggerAxis!;
            diffX1 = this._diffX1!;
            diffY1 = this._diffY1!;
            odd_even = this._odd_even!;
        }

        let cullingCol = 0;
        let cullingRow = 0;
        let gridGID: GID = 0 as unknown as GID;

        // grid border
        let topBorder = 0;
        let downBorder = 0; let leftBorder = 0;
        let rightBorder = 0;
        const index = row * cols + col;
        const gid = tiles[index];
        gridGID = (((gid as unknown as number) & FLIPPED_MASK) >>> 0) as unknown as GID;
        const grid = grids.get(gridGID)!;
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

        const rowData = vertices[cullingRow] = vertices[cullingRow] || { minCol: 0, maxCol: 0 };
        const colData = rowData[cullingCol] = rowData[cullingCol] || {};

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
        const tileOffset = grid.tileset.tileOffset;
        left += this._offset!.x + tileOffset.x + grid.offsetX;
        bottom += this._offset!.y - tileOffset.y - grid.offsetY;

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

    protected _updateVertices () {
        const vertices = this.vertices;
        vertices.length = 0;

        const tiles = this.tiles;
        if (!tiles) {
            return;
        }

        const rightTop = this._rightTop;
        rightTop.row = -1;
        rightTop.col = -1;

        const rows = this._layerSize!.height;
        const cols = this._layerSize!.width;

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
     * @en
     * Get the TiledTile with the tile coordinate.<br/>
     * If there is no tile in the specified coordinate and forceCreate parameter is true, <br/>
     * then will create a new TiledTile at the coordinate.
     * The renderer will render the tile with the rotation, scale, position and color property of the TiledTile.
     * @zh
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
    public getTiledTileAt (x: number, y: number, forceCreate?: boolean) {
        if (this.isInvalidPosition(x, y)) {
            throw new Error('TiledLayer.getTiledTileAt: invalid position');
        }
        if (!this.tiles) {
            logID(7236);
            return null;
        }

        const index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        let tile = this.tiledTiles[index];
        if (!tile && forceCreate) {
            const node = new Node();
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
     * @en
     * Change tile to TiledTile at the specified coordinate.
     * @zh
     * 将指定的 tile 坐标替换为指定的 TiledTile。
     * @method setTiledTileAt
     * @param {Integer} x
     * @param {Integer} y
     * @param {cc.TiledTile} tiledTile
     * @return {cc.TiledTile}
     */
    public setTiledTileAt (x: number, y: number, tiledTile: TiledTile | null): TiledTile | null {
        if (this.isInvalidPosition(x, y)) {
            throw new Error('TiledLayer.setTiledTileAt: invalid position');
        }
        if (!this.tiles) {
            logID(7236);
            return null;
        }

        const index = Math.floor(x) + Math.floor(y) * this._layerSize!.width;
        this.tiledTiles[index] = tiledTile;
        this._cullingDirty = true;

        if (tiledTile) {
            this._hasTiledNodeGrid = true;
        } else {
            this._hasTiledNodeGrid = this.tiledTiles.some((tiledNode) => !!tiledNode);
        }

        return tiledTile;
    }

    /**
     * @en Return texture.
     * @zh 获取纹理。
     * @method getTexture
     * @param index The index of textures
     * @return {Texture2D}
     */
    public getTexture (index?: number): SpriteFrame | null {
        index = index || 0;
        if (this._textures && index >= 0 && this._textures.length > index) {
            return this._textures[index];
        }
        return null;
    }

    /**
     * @en Return texture.
     * @zh 获取纹理。
     * @method getTextures
     * @return {Texture2D}
     */
    public getTextures () {
        return this._textures;
    }

    /**
     * @en Set the texture.
     * @zh 设置纹理。
     * @method setTexture
     * @param {SpriteFrame} texture
     */
    public setTexture (texture: SpriteFrame) {
        this.setTextures([texture]);
    }

    /**
     * @en Set the texture.
     * @zh 设置纹理。
     * @method setTexture
     * @param {SpriteFrame} textures
     */
    public setTextures (textures: SpriteFrame[]) {
        this._textures = textures;
        this.markForUpdateRenderData();
    }

    /**
     * @en Gets layer size.
     * @zh 获得层大小。
     * @method getLayerSize
     * @return {Size}
     * @example
     * let size = tiledLayer.getLayerSize();
     * cc.log("layer size: " + size);
     */
    public getLayerSize (): Size {
        return this._layerSize!;
    }

    /**
     * @en Size of the map's tile (could be different from the tile's size).
     * @zh 获取 tile 的大小( tile 的大小可能会有所不同)。
     * @method getMapTileSize
     * @return {Size}
     * @example
     * let mapTileSize = tiledLayer.getMapTileSize();
     * cc.log("MapTile size: " + mapTileSize);
     */
    public getMapTileSize (): Size {
        return this._mapTileSize!;
    }

    /**
     * @en Gets Tile set first information for the layer.
     * @zh 获取 layer 索引位置为0的 Tileset 信息。
     * @method getTileSet
     * @param index The index of tilesets
     * @return {TMXTilesetInfo}
     */
    public getTileSet (index: number): TMXTilesetInfo | null {
        index = index || 0;
        if (this._tilesets && index >= 0 && this._tilesets.length > index) {
            return this._tilesets[index];
        }
        return null;
    }

    /**
     * @en Gets tile set all information for the layer.
     * @zh 获取 layer 所有的 Tileset 信息。
     * @method getTileSet
     * @return {TMXTilesetInfo}
     */
    public getTileSets (): TMXTilesetInfo[] {
        return this._tilesets;
    }

    /**
     * @en Sets tile set information for the layer.
     * @zh 设置 layer 的 tileset 信息。
     * @method setTileSet
     * @param {TMXTilesetInfo} tileset
     */
    public setTileSet (tileset: TMXTilesetInfo) {
        this.setTileSets([tileset]);
    }

    /**
     * @en Sets Tile set information for the layer.
     * @zh 设置 layer 的 Tileset 信息。
     * @method setTileSets
     * @param {TMXTilesetInfo} tilesets
     */
    public setTileSets (tilesets: TMXTilesetInfo[]) {
        this._tilesets = tilesets;
        const textures: SpriteFrame[] = this._textures = [];
        const texGrids = this.texGrids!;
        texGrids.clear();
        for (let i = 0; i < tilesets.length; i++) {
            const tileset = tilesets[i];
            if (tileset) {
                textures[i] = tileset.sourceImage!;
            }
        }

        for (let i = 0, l = tilesets.length; i < l; ++i) {
            const tilesetInfo = tilesets[i];
            if (!tilesetInfo) continue;
            fillTextureGrids(tilesetInfo, texGrids, tilesetInfo.sourceImage);
        }
        this._prepareToRender();
    }

    public init (layerInfo: TMXLayerInfo, mapInfo: TMXMapInfo, tilesets: TMXTilesetInfo[], textures: SpriteFrame[], texGrids: TiledTextureGrids) {
        this._cullingDirty = true;
        this._layerInfo = layerInfo;
        this._mapInfo = mapInfo;

        const size = layerInfo.layerSize!;

        // layerInfo
        this._layerName = layerInfo.name;
        this.tiles = layerInfo.tiles as unknown as any;
        this._properties = layerInfo.properties;
        this._layerSize = size;
        this._minGID = layerInfo.minGID;
        this._maxGID = layerInfo.maxGID;
        this._opacity = layerInfo.opacity;

        if (layerInfo.tintColor) {
            this._tintColor = layerInfo.tintColor;
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
        this.texGrids = texGrids;

        // mapInfo
        this._layerOrientation = mapInfo.orientation;
        this._mapTileSize = mapInfo.getTileSize();

        const maptw = this._mapTileSize.width;
        const mapth = this._mapTileSize.height;
        const layerW = this._layerSize.width;
        const layerH = this._layerSize.height;

        if (this._layerOrientation === Orientation.HEX) {
            let width = 0;
            let height = 0;

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
            const wh = layerW + layerH;
            this.node._uiProps.uiTransformComp!.setContentSize(maptw * 0.5 * wh, mapth * 0.5 * wh);
        } else {
            this.node._uiProps.uiTransformComp!.setContentSize(layerW * maptw, layerH * mapth);
        }

        // offset (after layer orientation is set);
        this._offset = new Vec2(layerInfo.offset.x, -layerInfo.offset.y);
        this._useAutomaticVertexZ = false;
        this._vertexZvalue = 0;
        this._syncAnchorPoint();
        this._prepareToRender();
    }

    protected _prepareToRender () {
        this._updateVertices();
        this._updateAllUserNode();
    }

    public requestMeshRenderData () {
        if (!this._meshRenderDataArray) {
            this._meshRenderDataArray = [];
        }
        const arr = this._meshRenderDataArray as any[];
        while (arr.length > 0 && arr[arr.length - 1].subNodes && arr[arr.length - 1].subNodes.length === 0) {
            arr.pop();
        }
        if (arr.length > 0) {
            const last = arr[arr.length - 1];
            if (last.renderData && last.renderData.byteCount === 0) {
                return last as TiledMeshData;
            }
        }

        const renderData = new MeshRenderData();
        const comb = { renderData, texture: null };
        Object.defineProperty(renderData, 'material', { get: () => this.getRenderMaterial(0) });
        this._meshRenderDataArray.push(comb);
        return comb;
    }

    public requestSubNodesData () {
        if (!this._meshRenderDataArray) {
            this._meshRenderDataArray = [];
        }
        const arr = this._meshRenderDataArray as any[];
        while (arr.length > 0 && arr[arr.length - 1].renderData && arr[arr.length - 1].renderData.byteCount === 0) {
            arr.pop();
        }
        if (arr.length > 0) {
            if (arr[arr.length - 1].subNodes && arr[arr.length - 1].subNodes.length === 0) {
                return arr[arr.length - 1] as TiledSubNodeData;
            }
        }

        const renderData: (TiledUserNodeData | null)[] = [];
        const comb = { subNodes: renderData };
        this._meshRenderDataArray.push(comb);
        return comb;
    }

    public destroyRenderData () {
        if (this._meshRenderDataArray) {
            this._meshRenderDataArray.forEach((rd) => { if ((rd as TiledMeshData).renderData) (rd as TiledMeshData).renderData.reset(); });
            this._meshRenderDataArray.length = 0;
        }
    }

    protected _flushAssembler () {
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

    // 当前的 _meshRenderDataArray 的索引, 以便 fillBuffers 选取 RenderData
    public _meshRenderDataArrayIdx = 0;
    protected _render (ui: Batcher2D) {
        if (this._meshRenderDataArray) {
            for (let i = 0; i < this._meshRenderDataArray.length; i++) {
                this._meshRenderDataArrayIdx = i;
                const m = this._meshRenderDataArray[i];
                if ((m as TiledSubNodeData).subNodes) {
                    // 提前处理 User Nodes
                    (m as TiledSubNodeData).subNodes.forEach((c) => {
                        if (c) ui.walk(c.node);
                    });
                } else if ((m as TiledMeshData).texture) {
                    // NOTE: 由于 commitComp 只支持单张纹理, 故分多次提交
                    ui.commitComp(this, (m as TiledMeshData).texture, this._assembler, null);
                }
            }
            this.node._static = true;
        }
    }
}
