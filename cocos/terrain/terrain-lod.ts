export const TERRAIN_LOD_VERTS = 33;
export const TERRAIN_LOD_TILES = 32;
export const TERRAIN_LOD_LEVELS = 4;
export const TERRAIN_LOD_NORTH_INDEX = 0;
export const TERRAIN_LOD_SOUTH_INDEX = 1;
export const TERRAIN_LOD_WEST_INDEX = 2;
export const TERRAIN_LOD_EAST_INDEX = 3;

export class TerrainIndexPool {
    public size: number = 0;
    public indices: Uint16Array|null = null;
}

export class TerrainIndexData {
    public start: number;
    public size: number;
    public buffer: Uint16Array|null = null;
    public prim_count: number;
}

export class TerrainLodKey {
    public level: number;
    public north: number;
    public south: number;
    public west: number;
    public east: number;

    public compare (rk: TerrainLodKey) {
        return this.level === rk.level && this.north === rk.north && this.south === rk.south && this.west === rk.west && this.east === rk.east;
    }
}

export class TerrainLod {
    public mBodyIndex: TerrainIndexPool[] = TerrainIndexPool[TERRAIN_LOD_LEVELS];
    public mConnecterIndex: TerrainIndexPool[][][] = TerrainIndexPool[TERRAIN_LOD_LEVELS][TERRAIN_LOD_LEVELS][4];

    constructor () {
        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            this.mBodyIndex[i] = new TerrainIndexPool();
        }

        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            for (let j = 0; j < TERRAIN_LOD_LEVELS; ++j) {
                for (let k = 0; k < 4; ++k) {
                    this.mConnecterIndex[i][j][k] = new TerrainIndexPool();
                }
            }
        }

        this.genBodyIndex();
        this.genConnecterIndex();

        /*
        for (let l = 0; l < TERRAIN_LOD_LEVELS; ++l) {
            for (let n = 0; n < TERRAIN_LOD_LEVELS; ++n) {
                if (n < l) {
                    continue;
                }

                for (let s = 0; s < TERRAIN_LOD_LEVELS; ++s) {
                    if (s < l) {
                        continue;
                    }

                    for (let w = 0; w < TERRAIN_LOD_LEVELS; ++w) {
                        if (w < l) {
                            continue;
                        }

                        for (let e = 0; e < TERRAIN_LOD_LEVELS; ++e) {
                            if (e < l) {
                                continue;
                            }

                            const k = new TerrainLodKey();
                            k.level = l;
                            k.north = n;
                            k.south = s;
                            k.west = w;
                            k.east = e;
                            getIndexData(k, true);
                        }
                    }
                }
            }
        }
        */
    }

    private genBodyIndex () {
        for (let i = 0; i < TERRAIN_LOD_LEVELS; ++i) {
            this._genBodyIndex(i);
        }
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

    private genConnecterIndex () {
        for (let i = 0; i < TERRAIN_LOD_VERTS; ++i) {
            for (let j = 0; j < TERRAIN_LOD_VERTS; ++j) {
                this._genConnecterIndexNorth(i, j);
                this._genConnecterIndexSouth(i, j);
                this._genConnecterIndexWest(i, j);
                this._genConnecterIndexEast(i, j);
            }
        }
    }

    private _genConnecterIndexNorth (level: number, connecter: number) {
        const TN_NorthIndex = TERRAIN_LOD_NORTH_INDEX;

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[level][connecter][TN_NorthIndex].size = 0;
            this.mConnecterIndex[level][connecter][TN_NorthIndex].indices = null;
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

        this.mConnecterIndex[level][connecter][TN_NorthIndex].size = index;
        this.mConnecterIndex[level][connecter][TN_NorthIndex].indices = indices;
    }

    private _genConnecterIndexSouth (level: number, connecter: number) {
        const TN_SouthIndex = TERRAIN_LOD_SOUTH_INDEX;

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[level][connecter][TN_SouthIndex].size = 0;
            this.mConnecterIndex[level][connecter][TN_SouthIndex].indices = null;
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

        this.mConnecterIndex[level][connecter][TN_SouthIndex].size = index;
        this.mConnecterIndex[level][connecter][TN_SouthIndex].indices = indices;
    }

    private _genConnecterIndexWest (level: number, connecter: number) {
        const TN_WestIndex = TERRAIN_LOD_WEST_INDEX;

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[level][connecter][TN_WestIndex].size = 0;
            this.mConnecterIndex[level][connecter][TN_WestIndex].indices = null;
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

        this.mConnecterIndex[level][connecter][TN_WestIndex].size = index;
        this.mConnecterIndex[level][connecter][TN_WestIndex].indices = indices;
    }

    private _genConnecterIndexEast (level: number, connecter: number) {
        const TN_EastIndex = TERRAIN_LOD_EAST_INDEX;

        if (connecter < level || level === TERRAIN_LOD_LEVELS - 1) {
            this.mConnecterIndex[level][connecter][TN_EastIndex].size = 0;
            this.mConnecterIndex[level][connecter][TN_EastIndex].indices = null;
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

        this.mConnecterIndex[level][connecter][TN_EastIndex].size = index;
        this.mConnecterIndex[level][connecter][TN_EastIndex].indices = indices;
    }
}
