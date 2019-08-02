/**
 * @category gemotry-utils
 */

import { Vec3 } from '../../core/math';
import { FixedArray } from '../memop';
import aabb from './aabb';
import intersect from './intersect';

const mul = (out, v, x, y, z) => {
    return Vec3.set(out, v.x * x, v.y * y, v.z * z);
};

class OctreeBlock {
    public minPos: Vec3;
    public maxPos: Vec3;
    public boundingBox: aabb;
    public capacity: number;
    public depth: number;
    public maxDepth: number;
    public blocks: null | OctreeBlock[];
    public entries: FixedArray;

    private _getBoundingShape: Function;

    constructor (minPos, maxPos, capacity, depth, maxDepth, getBoundingShape) {
        this.minPos = minPos;
        this.maxPos = maxPos;
        this.boundingBox = aabb.fromPoints(aabb.create(), minPos, maxPos);
        this.capacity = capacity;
        this.depth = depth;
        this.maxDepth = maxDepth;
        this._getBoundingShape = getBoundingShape;
        this.blocks = null;
        this.entries = new FixedArray(this.capacity);
    }

    public addEntry (entry) {
        if (this.blocks) {
            for (const block of this.blocks) {
                block.addEntry(entry);
            }
        } else {
            const shape = this._getBoundingShape(entry);
            if (!intersect.resolve(this.boundingBox, shape)) { return; }
            this.entries.push(entry);
            if (this.entries.length >= this.capacity && this.depth < this.maxDepth) {
                this.blocks = Octree.createBlocks(this.minPos, this.maxPos, this.entries,
                    this.capacity, this.depth, this.maxDepth, this._getBoundingShape);
                this.entries.reset();
            }
        }
    }

    public removeEntry (entry) {
        if (this.blocks) {
            for (const block of this.blocks) {
                block.removeEntry(entry);
            }
        } else {
            this.entries.fastRemove(this.entries.indexOf(entry));
        }
    }

    public select (out, shape) {
        if (!intersect.resolve(this.boundingBox, shape)) { return; }
        if (this.blocks) {
            for (const block of this.blocks) {
                block.select(out, shape);
            }
        } else {
            for (let i = 0; i < this.entries.length; i++) {
                out.add(this.entries.data[i]);
            }
        }
    }

    public frustumSelect (out, frustum) {
        if (!intersect.aabb_frustum(this.boundingBox, frustum)) { return; }
        if (this.blocks) {
            for (const block of this.blocks) {
                block.frustumSelect(out, frustum);
            }
        } else {
            for (let i = 0; i < this.entries.length; i++) {
                out.add(this.entries.data[i]);
            }
        }
    }
}

/**
 * An octree acceleration data structure
 * @example
 * ```
 * let octree = new Octree();
 * octree.build(models, model => {
 *   return model._boundingShape;
 * });
 * octree.select(enums.SHAPE_FRUSTUM, view._frustum);
 * ```
 */
export default class Octree {

    /**
     * Create sub blocks and populate them with given entries
     * @param {Vec3} worldMin - min position of the parent bounding box
     * @param {Vec3} worldMax - max position of the parent bounding box
     * @param {Array<Object>} entries - the entries to be inserted
     * @param {number} blockCapacity - maximum capacity for each block node
     * before it's been subdivided, might be exceeded if `maxDepth` is reached
     * @param {number} curDepth - depth before subdivided
     * @param {number} maxDepth - maximum depth of this tree
     * @param {function(entry: Object): Object} getBoundingShape - a function takes an entry and returns its primitive info
     * @return {OctreeBlock[]} the sub blocks
     */
    public static createBlocks (worldMin, worldMax, entries, blockCapacity, curDepth, maxDepth, getBoundingShape) {
        const blocks: OctreeBlock[] = [];
        const blockSize = new Vec3();
        Vec3.multiplyScalar(blockSize, Vec3.subtract(blockSize, worldMax, worldMin), 0.5);
        for (let x = 0; x < 2; x++) {
            for (let y = 0; y < 2; y++) {
                for (let z = 0; z < 2; z++) {
                    const localMin = new Vec3();
                    const localMax = new Vec3();
                    Vec3.add(localMin, worldMin, mul(localMin, blockSize, x, y, z));
                    Vec3.add(localMax, worldMin, mul(localMax, blockSize, x + 1, y + 1, z + 1));
                    const block = new OctreeBlock(localMin, localMax,
                        blockCapacity, curDepth + 1, maxDepth, getBoundingShape);
                    for (let i = 0; i < entries.length; i++) {
                        const entry = (entries.data || entries)[i];
                        block.addEntry(entry);
                    }
                    blocks.push(block);
                }
            }
        }
        return blocks;
    }

    public blockCapacity: number;
    public maxDepth: number;
    public blocks: OctreeBlock[];
    public dynamics: any[];

    private _selection: Set<any>;
    private _getBoundingShape: Function;

    /**
     * Create a octree structure
     * @param {number} blockCapacity - maximum capacity for each block node
     * before it's been subdivided, might be exceeded if `maxDepth` is reached
     * @param {number} maxDepth - maximum depth of this tree
     */
    constructor (blockCapacity = 32, maxDepth = 5) {
        this.blockCapacity = blockCapacity;
        this.maxDepth = maxDepth;
        this.blocks = [];
        this.dynamics = [];
        this._selection = new Set();
        this._getBoundingShape = () => this._getBoundingShape;
    }

    /**
     * Build this octree from given entries.
     * Root Boundary is the bounding box of all the entries.
     * @param {Array<Object>} entries - a collection of entries to be queried later
     * @param {function(entry: Object): Object} getBoundingShape
     *  - a function takes an entry and returns its primitive info
     */
    public build (entries, getBoundingShape) {
        // calc world min & max
        const worldMin = new Vec3(Infinity, Infinity, Infinity);
        const worldMax = new Vec3(-Infinity, -Infinity, -Infinity);
        const minPos = new Vec3();
        const maxPos = new Vec3();
        const staticEntries: any[] = []; this.dynamics = [];
        for (let i = 0; i < entries.length; i++) {
            const entry = (entries.data || entries)[i];
            const shape = getBoundingShape(entry);
            if (!shape) {
                this.dynamics.push(entry);
            } else {
                shape.getBoundary(minPos, maxPos);
                Vec3.min(worldMin, worldMin, minPos);
                Vec3.max(worldMax, worldMax, maxPos);
                staticEntries.push(entry);
            }
        }
        this.blocks = Octree.createBlocks(worldMin, worldMax, staticEntries,
            this.blockCapacity, 0, this.maxDepth, getBoundingShape);
        this._getBoundingShape = getBoundingShape;
    }

    /**
     * Add an entry to this tree. Should be called after `build`.
     * @param {Object} entry - the new entry
     */
    public addEntry (entry) {
        if (!this._getBoundingShape(entry).shape) {
            this.dynamics.push(entry);
            return;
        }
        for (const block of this.blocks) {
            block.addEntry(entry);
        }
    }

    /**
     * Remove an entry from this tree. Should be called after `build`.
     * @param {Object} entry - the entry to be removed
     */
    public removeEntry (entry) {
        if (!this._getBoundingShape(entry).shape) {
            this.dynamics.splice(this.dynamics.indexOf(entry), 1);
            return;
        }
        for (const block of this.blocks) {
            block.removeEntry(entry);
        }
    }

    /**
     * Select all the entries overlapping the given primitive
     * @param {Object} shape - the selecting primitive
     * @return {Set<Object>} the resulting set of entries
     */
    public select (shape) {
        this._selection.clear();
        for (const block of this.blocks) {
            block.select(this._selection, shape);
        }
        for (const dynamic of this.dynamics) {
            this._selection.add(dynamic);
        }
        return this._selection;
    }

    /**
     * Specialized selection for frustums
     * @param {Object} frustum - the selecting frustum
     * @return {Set<Object>} the resulting set of entries
     */
    public frustumSelect (frustum) {
        this._selection.clear();
        for (const block of this.blocks) {
            block.frustumSelect(this._selection, frustum);
        }
        for (const dynamic of this.dynamics) {
            this._selection.add(dynamic);
        }
        return this._selection;
    }
}
