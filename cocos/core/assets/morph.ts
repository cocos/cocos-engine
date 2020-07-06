/**
 * @hidden
 */

import { GFXAttributeName, GFXDevice } from '../gfx';
import { Mesh } from './mesh';
import { StdMorphRendering } from './morph-rendering';
import { IMacroPatch, IPSOCreateInfo } from '../renderer';

export interface Morph {
    /**
     * Morph data of each sub-mesh.
     */
    subMeshMorphs: Array<SubMeshMorph | null>;

    /**
     * Common initial weights of each sub-mesh.
     */
    weights?: number[];
}

export interface MorphTarget {
    /**
     * Displacement of each target attribute.
     */
    displacements: Mesh.IBufferView[];
}

export interface SubMeshMorph {
    /**
     * Attributes to morph.
     */
    attributes: GFXAttributeName[];

    /**
     * Targets.
     */
    targets: MorphTarget[];

    /**
     * Initial weights of each target.
     */
    weights?: number[];
}

export function createMorphRendering (mesh: Mesh, gfxDevice: GFXDevice): MorphRendering | null {
    return new StdMorphRendering(mesh, gfxDevice);
}

/**
 * Class which control rendering of a morph resource.
 */
export interface MorphRendering {
    createInstance (): MorphRenderingInstance;
}

/**
 * This rendering instance of a morph resource.
 */
export interface MorphRenderingInstance {
    /**
     * Sets weights of targets of specified sub mesh.
     * @param subMeshIndex 
     * @param weights 
     */
    setWeights (subMeshIndex: number, weights: number[]): void;

    /**
     * Adapts pipeline state to do the rendering.
     * @param subMeshIndex 
     * @param pipelineState 
     */
    adaptPipelineState(subMeshIndex: number, pipelineCreateInfo: IPSOCreateInfo): void;

    requiredPatches(subMeshIndex: number): IMacroPatch[] | undefined;

    /**
     * Destroy the rendering instance.
     */
    destroy(): void;
}
