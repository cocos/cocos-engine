/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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

export const TERRAIN_LOD_VERTS = 33;
export const TERRAIN_LOD_TILES = 32;
export const TERRAIN_LOD_LEVELS = 4;
export const TERRAIN_LOD_NORTH_INDEX = 0;
export const TERRAIN_LOD_SOUTH_INDEX = 1;
export const TERRAIN_LOD_WEST_INDEX = 2;
export const TERRAIN_LOD_EAST_INDEX = 3;
export const TERRAIN_LOD_MAX_DISTANCE = 100000000000000.0;

export class TerrainLodKey {
    public level: number = 0;
    public north: number = 0;
    public south: number = 0;
    public west: number = 0;
    public east: number = 0;

    public compare (rk: TerrainLodKey) {
        return this.level === rk.level && this.north === rk.north && this.south === rk.south && this.west === rk.west && this.east === rk.east;
    }
}

export class TerrainIndexPool {
    public size: number = 0;
    public indices: Uint16Array|null = null;
}

export class TerrainIndexData {
    public key: TerrainLodKey = new TerrainLodKey;
    public start: number = 0;
    public size: number = 0;
    public buffer: Uint16Array|null = null;
    public primCount: number = 0;
}

export class TerrainLod {
    public static ConnecterIndex(i, j, k) {
        return i * (TERRAIN_LOD_LEVELS * TERRAIN_LOD_LEVELS) + j * TERRAIN_LOD_LEVELS + k;
    }

    public mBodyIndex: TerrainIndexPool[];
    public mConnecterIndex: TerrainIndexPool[];
    public mIndexMap: TerrainIndexData[] = [];
    public mIndexBuffer: Uint16Array = new Uint16Array;

    constructor () {
        this.mBodyIndex = new Array<TerrainIndexPool>(TERRAIN_LOD_LEVELS);
        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            this.mBodyIndex[i] = new TerrainIndexPool();
        }

        this.mConnecterIndex = new Array<TerrainIndexPool>(TERRAIN_LOD_LEVELS * TERRAIN_LOD_LEVELS * 4);
        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            for (let j = 0; j < TERRAIN_LOD_LEVELS; ++j) {
                for (let k = 0; k < 4; ++k) {
                    this.mConnecterIndex[TerrainLod.ConnecterIndex(i, j, k)] = new TerrainIndexPool();
                }
            }
        }

        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            this._genBodyIndex(i);
        }

        for (let i = 0; i < 1; ++i) {
            for (let j = 0; j < TERRAIN_LOD_LEVELS; ++j) {
                this._genConnecterIndexNorth(i, j);
                this._genConnecterIndexSouth(i, j);
                this._genConnecterIndexWest(i, j);
                this._genConnecterIndexEast(i, j);
            }
        }

        const levels = TERRAIN_LOD_LEVELS;
        for (let l = 0; l < levels; ++l) {
            for (let n = 0; n < levels; ++n) {
                if (n < l) {
                    continue;
                }

                for (let s = 0; s < levels; ++s) {
                    if (s < l) {
                        continue;
                    }

                    for (let w = 0; w < levels; ++w) {
                        if (w < l) {
                            continue;
                        }

                        for (let e = 0; e < levels; ++e) {
                            if (e < l) {
                                continue;
                            }

                            const k = new TerrainLodKey();
                            k.level = l;
                            k.north = n;
                            k.south = s;
                            k.west = w;
                            k.east = e;
                            this._genIndexData(k);
                        }
                    }
                }
            }
        }
    }

    public getIndexData (k: TerrainLodKey) {
        for (let i = 0; i < this.mIndexMap.length; ++i) {
            if (this.mIndexMap[i].key.compare(k)) {
                return this.mIndexMap[i];
            }
        }

        return null;
    }

    private _genBodyIndex (level: number) {
        const step = 1 << level;
        let tiles = TERRAIN_LOD_TILES >> level;
        let start = 0;

        if (level < TERRAIN_LOD_LEVELS - 1)  {
            tiles -= 2;
            start = step * TERRAIN_LOD_VERTS + step;
        }

        if (tiles === 0 || tiles === 0) {
            return;
        }

        const count = tiles * tiles * 6;
        this.mBodyIndex[level].indices = new Uint16Array(count);

        let index = 0;
        const indices = new Uint16Array(count);

        // generate triangle list cw
        //
        let row_c = start;
        let row_n = row_c + TERRAIN_LOD_VERTS * step;
        for (let y = 0; y < tiles; ++y) {
            for (let x = 0; x < tiles; ++x) {
                /*
                indices[index++] = row_n + x * step;
                indices[index++] = row_c + x * step;
                indices[index++] = row_n + (x + 1) * step;

                indices[index++] = row_n + (x + 1) * step;
                indices[index++] = row_c + x * step;
                indices[index++] = row_c + (x + 1) * step;
                */

                indices[index++] = row_n + x * step;
                indices[index++] = row_n + (x + 1) * step;
                indices[index++] = row_c + x * step;

                indices[index++] = row_n + (x + 1) * step;
                indices[index++] = row_c + (x + 1) * step;
                indices[index++] = row_c + x * step;
            }

            row_c += TERRAIN_LOD_VERTS * step;
            row_n += TERRAIN_LOD_VERTS * step;
        }

        this.mBodyIndex[level].size = index;
        this.mBodyIndex[level].indices = indices;
    }

    private _genConnecterIndexNorth (level: number, connecter: number) {
        const connecterIndex = TerrainLod.ConnecterIndex(level, connecter, TERRAIN_LOD_NORTH_INDEX);

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[connecterIndex].size = 0;
            this.mConnecterIndex[connecterIndex].indices = null;
            return;
        }

        const self_step = 1 << level;
        const neighbor_step = 1 << connecter;
        const self_tile = TERRAIN_LOD_TILES >> level;
        const neighbor_tile = TERRAIN_LOD_TILES >> connecter;
        const count = self_tile * 2 + 2;

        let index = 0;
        const indices = new Uint16Array(count);

        // starter
        indices[index++] = 0;
        indices[index++] = 0;

        // middler
        for (let i = 1; i < self_tile; ++i) {
            const x1 = i * self_step;
            const y1 = self_step;
            const x0 = x1 / neighbor_step * neighbor_step;
            const y0 = y1 - self_step;

            const index0 = y1 * TERRAIN_LOD_VERTS + x1;
            const index1 = y0 * TERRAIN_LOD_VERTS + x0;

            indices[index++] = index0;
            indices[index++] = index1;
        }

        // ender
        indices[index++] = TERRAIN_LOD_VERTS - 1;
        indices[index++] = TERRAIN_LOD_VERTS - 1;

        this.mConnecterIndex[connecterIndex].size = index;
        this.mConnecterIndex[connecterIndex].indices = indices;
    }

    private _genConnecterIndexSouth (level: number, connecter: number) {
        const connecterIndex = TerrainLod.ConnecterIndex(level, connecter, TERRAIN_LOD_SOUTH_INDEX);

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[connecterIndex].size = 0;
            this.mConnecterIndex[connecterIndex].indices = null;
            return;
        }

        const self_step = 1 << level;
        const neighbor_step = 1 << connecter;
        const self_tile = TERRAIN_LOD_TILES >> level;
        const neighbor_tile = TERRAIN_LOD_TILES >> connecter;
        const count = self_tile * 2 + 2;

        let index = 0;
        const indices = new Uint16Array(count);

        // starter
        indices[index++] = TERRAIN_LOD_TILES * TERRAIN_LOD_VERTS;
        indices[index++] = TERRAIN_LOD_TILES * TERRAIN_LOD_VERTS;

        // middler
        for (let i = 1; i < self_tile; ++i) {
            const x0 = i * self_step;
            const y0 = TERRAIN_LOD_VERTS - 1 - self_step;
            const x1 = x0 / neighbor_step * neighbor_step;
            const y1 = y0 + self_step;

            const index0 = y1 * TERRAIN_LOD_VERTS + x1;
            const index1 = y0 * TERRAIN_LOD_VERTS + x0;

            indices[index++] = index0;
            indices[index++] = index1;
        }

        // ender
        indices[index++] = TERRAIN_LOD_VERTS * TERRAIN_LOD_VERTS - 1;
        indices[index++] = TERRAIN_LOD_VERTS * TERRAIN_LOD_VERTS - 1;

        this.mConnecterIndex[connecterIndex].size = index;
        this.mConnecterIndex[connecterIndex].indices = indices;
    }

    private _genConnecterIndexWest (level: number, connecter: number) {
        const connecterIndex = TerrainLod.ConnecterIndex(level, connecter, TERRAIN_LOD_WEST_INDEX);

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[connecterIndex].size = 0;
            this.mConnecterIndex[connecterIndex].indices = null;
            return;
        }

        const self_step = 1 << level;
        const neighbor_step = 1 << connecter;
        const self_tile = TERRAIN_LOD_TILES >> level;
        const neighbor_tile = TERRAIN_LOD_TILES >> connecter;
        const count = self_tile * 2 + 2;

        let index = 0;
        const indices = new Uint16Array(count);

        // starter
        indices[index++] = 0;
        indices[index++] = 0;

        // middler
        for (let i = 1; i < self_tile; ++i)  {
            const x0 = 0;
            const y0 = i * self_step / neighbor_step * neighbor_step;
            const x1 = self_step;
            const y1 = i * self_step;

            const index0 = y0 * TERRAIN_LOD_VERTS + x0;
            const index1 = y1 * TERRAIN_LOD_VERTS + x1;

            indices[index++] = index0;
            indices[index++] = index1;
        }

        // ender
        indices[index++] = TERRAIN_LOD_TILES * TERRAIN_LOD_VERTS;
        indices[index++] = TERRAIN_LOD_TILES * TERRAIN_LOD_VERTS;

        this.mConnecterIndex[connecterIndex].size = index;
        this.mConnecterIndex[connecterIndex].indices = indices;
    }

    private _genConnecterIndexEast (level: number, connecter: number) {
        const connecterIndex = TerrainLod.ConnecterIndex(level, connecter, TERRAIN_LOD_EAST_INDEX);

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[connecterIndex].size = 0;
            this.mConnecterIndex[connecterIndex].indices = null;
            return;
        }

        const self_step = 1 << level;
        const neighbor_step = 1 << connecter;
        const self_tile = TERRAIN_LOD_TILES >> level;
        const neighbor_tile = TERRAIN_LOD_TILES >> connecter;
        const count = self_tile * 2 + 2;

        let index = 0;
        const indices = new Uint16Array(count);

        // starter
        indices[index++] = TERRAIN_LOD_VERTS - 1;
        indices[index++] = TERRAIN_LOD_VERTS - 1;

        // middler
        for (let i = 1; i < self_tile; ++i) {
            const x0 = TERRAIN_LOD_VERTS - 1 - self_step;
            const y0 = i * self_step;
            const x1 = TERRAIN_LOD_VERTS - 1;
            const y1 = i * self_step / neighbor_step * neighbor_step;

            const index0 = y0 * TERRAIN_LOD_VERTS + x0;
            const index1 = y1 * TERRAIN_LOD_VERTS + x1;

            indices[index++] = index0;
            indices[index++] = index1;
        }

        // ender
        indices[index++] = TERRAIN_LOD_VERTS * TERRAIN_LOD_VERTS - 1;
        indices[index++] = TERRAIN_LOD_VERTS * TERRAIN_LOD_VERTS - 1;

        this.mConnecterIndex[connecterIndex].size = index;
        this.mConnecterIndex[connecterIndex].indices = indices;
    }

    private _getConnenterIndex(i, j, k) {
        return this.mConnecterIndex[TerrainLod.ConnecterIndex(i, j, k)];
    }

    private _genIndexData(k: TerrainLodKey) {
        let data = this.getIndexData(k);
        if (data != null) {
            return data;
        }
      
        const body = this.mBodyIndex[k.level];
        const north = this._getConnenterIndex(k.level, k.north, TERRAIN_LOD_NORTH_INDEX);
        const south = this._getConnenterIndex(k.level, k.south, TERRAIN_LOD_SOUTH_INDEX);
        const west = this._getConnenterIndex(k.level, k.west, TERRAIN_LOD_WEST_INDEX);
        const east = this._getConnenterIndex(k.level, k.east, TERRAIN_LOD_EAST_INDEX);

        data = new TerrainIndexData;
        data.size = 0;
        data.primCount = 0;

        if (body.indices != null)
            data.size += body.size;
        if (north.indices)
            data.size += (north.size - 2) * 3;
        if (south.indices)
            data.size += (south.size - 2) * 3;
        if (west.indices)
            data.size += (west.size - 2) * 3;
        if (east.indices)
            data.size += (east.size - 2) * 3;

        if (data.size === 0) {
            return null;
        }

        let index = 0;
        data.buffer = new Uint16Array(data.size);
        data.key.level = k.level;
        data.key.east = k.east;
        data.key.west = k.west;
        data.key.north = k.north;
        data.key.south = k.south;

        if (body.indices) {
            for (let i = 0; i < body.size; ++i) {
                data.buffer[index++] = body.indices[i];
            }
        }

        if (north.indices) {
            for (let i = 0; i < north.size - 2; i += 2)  {
                const a = north.indices[i + 0];
                const b = north.indices[i + 1];
                const c = north.indices[i + 2];
                const d = north.indices[i + 3];

                data.buffer[index++] = a;
                data.buffer[index++] = c;
                data.buffer[index++] = b;
                data.buffer[index++] = c;
                data.buffer[index++] = d;
                data.buffer[index++] = b;
            }
        }

        if (south.indices)  {
            for (let i = 0; i < south.size - 2; i += 2)  {
                const a = south.indices[i + 0];
                const b = south.indices[i + 1];
                const c = south.indices[i + 2];
                const d = south.indices[i + 3];

                data.buffer[index++] = a;
                data.buffer[index++] = c;
                data.buffer[index++] = b;
                data.buffer[index++] = c;
                data.buffer[index++] = d;
                data.buffer[index++] = b;
            }
        }

        if (west.indices) {
            for (let i = 0; i < west.size - 2; i += 2)  {
                const a = west.indices[i + 0];
                const b = west.indices[i + 1];
                const c = west.indices[i + 2];
                const d = west.indices[i + 3];

                data.buffer[index++] = a;
                data.buffer[index++] = c;
                data.buffer[index++] = b;
                data.buffer[index++] = c;
                data.buffer[index++] = d;
                data.buffer[index++] = b;
            }
        }

        if (east.indices)  {
            for (let i = 0; i < east.size - 2; i += 2) {
                const a = east.indices[i + 0];
                const b = east.indices[i + 1];
                const c = east.indices[i + 2];
                const d = east.indices[i + 3];

                data.buffer[index++] = a;
                data.buffer[index++] = c;
                data.buffer[index++] = b;
                data.buffer[index++] = c;
                data.buffer[index++] = d;
                data.buffer[index++] = b;
            }
        }

        data.primCount = index / 3;
        data.start = this.mIndexBuffer.length;
        this.mIndexMap.push(data);

        const temp = new Uint16Array(data.start + data.size);
        temp.set(this.mIndexBuffer, 0);
        temp.set(data.buffer, data.start);
        this.mIndexBuffer = temp;

        return data;
    }
}
