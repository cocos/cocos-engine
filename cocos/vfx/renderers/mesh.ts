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

import { Mesh } from '../../3d';
import { Color, Quat, Vec3, Vec4, assertIsTrue } from '../../core';
import { Material, RenderingSubMesh } from '../../asset/assets';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { BufferInfo, BufferUsageBit, deviceManager, MemoryUsageBit, Buffer, FormatInfos, PrimitiveMode, AttributeName } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { globalDynamicBufferMap, vfxManager } from '../vfx-manager';
import { CC_VFX_E_IS_WORLD_SPACE, CC_VFX_RENDERER_TYPE, CC_VFX_RENDERER_TYPE_MESH, E_IS_WORLD_SPACE, E_LOCAL_ROTATION, E_RENDER_SCALE, E_WORLD_ROTATION, meshColorRGBA8,
    meshNormal, meshPosition, meshUv, P_COLOR, P_MESH_ORIENTATION, P_POSITION, P_SCALE, P_SUB_UV_INDEX1, P_VELOCITY, vfxPColor, vfxPMeshOrientation, vfxPPosition, vfxPScale, vfxPSubUVIndex } from '../define';
import { ParticleDataSet, EmitterDataSet } from '../data-set';
import { ParticleRenderer } from '../particle-renderer';
import { Vec3ArrayParameter, FloatArrayParameter, ColorArrayParameter, QuatParameter, Vec3Parameter, BoolParameter } from '../parameters';

export enum MeshFacingMode {
    NONE,
    VELOCITY,
    CAMERA
}
@ccclass('cc.MeshParticleRenderer')
export class MeshParticleRenderer extends ParticleRenderer {
    get name (): string {
        return 'MeshRenderer';
    }
    /**
     * @zh 粒子发射的模型。
     */
    @type(Mesh)
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        if (this._mesh === val) return;
        this._mesh = val;
        this.destroy();
    }

    private destroy () {
        if (this._renderingSubMesh) {
            this._renderingSubMesh.vertexBuffers[0].destroy();
            this._renderingSubMesh.indexBuffer?.destroy();
            this._renderingSubMesh = null;
        }
        this._insBuffers.length = 0;
    }

    public facingMode= MeshFacingMode.NONE;

    @serializable
    private _mesh: Mesh | null = null;
    @serializable
    private _subUVTilesAndVelLenScale = new Vec4(1, 1, 1, 1);
    private _isSubUVTilesAndVelLenScaleDirty = true;
    private _defines: MacroRecord = { [CC_VFX_RENDERER_TYPE]: CC_VFX_RENDERER_TYPE_MESH };
    private _vertexStreamAttributes = [
        meshPosition, meshUv, meshNormal, meshColorRGBA8, vfxPPosition,
        vfxPMeshOrientation, vfxPScale, vfxPSubUVIndex, vfxPColor,
    ];
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private _insBuffers: Buffer[] = [];
    private declare _dynamicBuffer: Float32Array;
    private declare _dynamicBufferUintView: Uint32Array;
    private _vertexStreamSize = 0;
    private _vertexAttributeHash = '';

    private _ensureVBO (count: number) {
        assertIsTrue(globalDynamicBufferMap[this._vertexAttributeHash]);
        const dynamicVBO = globalDynamicBufferMap[this._vertexAttributeHash];
        dynamicVBO.markDirty();
        this._firstInstance = dynamicVBO.usedCount;
        dynamicVBO.usedCount += count;
        this._dynamicBuffer = dynamicVBO.floatDataView;
        this._dynamicBufferUintView = dynamicVBO.uintDataView;
    }

    public render (particles: ParticleDataSet, emitter: EmitterDataSet) {
        const material = this.material;
        const mesh = this._mesh;
        if (!material || !mesh) {
            return;
        }
        const { count } = particles;
        this._compileMaterial(material, particles, emitter);
        this._updateRotation(material, particles, emitter);
        this._updateRenderScale(material, particles, emitter);
        this._updateRenderingSubMesh(mesh, material, particles, emitter);
        this._ensureVBO(particles.count);
        const dynamicBuffer = this._dynamicBuffer;
        const dynamicBufferUintView = this._dynamicBufferUintView;
        const vertDynAttrsFloatCount = this._vertexStreamSize / 4;
        const bufferStart = this._firstInstance * vertDynAttrsFloatCount;
        const vertexStreamSizeDynamic = this._vertexStreamSize;
        if (particles.hasParameter(P_POSITION)) {
            const position = particles.getParameterUnsafe<Vec3ArrayParameter>(P_POSITION).data;
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset] = position[xOffset];
                dynamicBuffer[offset + 1] = position[yOffset];
                dynamicBuffer[offset + 2] = position[zOffset];
            }
        }
        if (particles.hasParameter(P_MESH_ORIENTATION)) {
            const rotation = particles.getParameterUnsafe<Vec3ArrayParameter>(P_MESH_ORIENTATION).data;
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 3] = rotation[xOffset];
                dynamicBuffer[offset + 4] = rotation[yOffset];
                dynamicBuffer[offset + 5] = rotation[zOffset];
            }
        }
        if (particles.hasParameter(P_SCALE)) {
            const scale = particles.getParameterUnsafe<Vec3ArrayParameter>(P_SCALE).data;
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 6] = scale[xOffset];
                dynamicBuffer[offset + 7] = scale[yOffset];
                dynamicBuffer[offset + 8] = scale[zOffset];
            }
        }
        if (particles.hasParameter(P_SUB_UV_INDEX1)) {
            const subUVIndex = particles.getParameterUnsafe<FloatArrayParameter>(P_SUB_UV_INDEX1);
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                dynamicBuffer[offset + 9] = subUVIndex[i];
            }
        }
        if (particles.hasParameter(P_COLOR)) {
            const color = particles.getParameterUnsafe<ColorArrayParameter>(P_COLOR).data;
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                dynamicBufferUintView[offset + 10] = color[i];
            }
        }
        if (particles.hasParameter(P_VELOCITY)) {
            const velocity = particles.getParameterUnsafe<Vec3ArrayParameter>(P_VELOCITY);
            const velocityData = velocity.data;
            for (let i = 0; i < count; i++) {
                let offset = i * vertexStreamSizeDynamic;
                offset += bufferStart;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 11] += velocityData[xOffset];
                dynamicBuffer[offset + 12] += velocityData[yOffset];
                dynamicBuffer[offset + 13] += velocityData[zOffset];
            }
        }
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material) {
        if (!this._isSubUVTilesAndVelLenScaleDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
    }

    private _updateRotation (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let currentRotation: Quat;
        if (this.facingMode === MeshFacingMode.NONE) {
            currentRotation = Quat.IDENTITY;
        } else if (this.facingMode === MeshFacingMode.VELOCITY) {
            currentRotation = emitter.getParameterUnsafe<QuatParameter>(E_WORLD_ROTATION).data;
        } else if (this.facingMode === MeshFacingMode.CAMERA) {
            currentRotation = Quat.IDENTITY;
            // const cameraLst: Camera[]| undefined = this.node.scene.renderScene?.cameras;
            // if (cameraLst !== undefined) {
            //     for (let i = 0; i < cameraLst?.length; ++i) {
            //         const camera:Camera = cameraLst[i];
            //         // eslint-disable-next-line max-len
            //         const checkCamera: boolean = (!EDITOR || legacyCC.GAME_VIEW) ? (camera.visibility & this.node.layer) === this.node.layer : camera.name === 'Editor Camera';
            //         if (checkCamera) {
            //             Quat.fromViewUp(rotation, camera.forward);
            //             break;
            //         }
            //     }
            // }
        } else {
            currentRotation = Quat.IDENTITY;
        }
        if (!Quat.equals(currentRotation, this._rotation)) {
            this._rotation.set(currentRotation.x, currentRotation.y, currentRotation.z, currentRotation.w);
            material.setProperty('nodeRotation', this._rotation);
        }
    }

    private _updateRenderScale (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        const renderScale = emitter.getParameterUnsafe<Vec3Parameter>(E_RENDER_SCALE).data;
        if (!Vec3.equals(renderScale, this._renderScale)) {
            this._renderScale.set(renderScale.x, renderScale.y, renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let needRecompile = false;
        const isWorldSpace = emitter.getParameterUnsafe<BoolParameter>(E_IS_WORLD_SPACE).data;
        if (this._defines[CC_VFX_E_IS_WORLD_SPACE] !== isWorldSpace) {
            this._defines[CC_VFX_E_IS_WORLD_SPACE] = isWorldSpace;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(this._defines);
        }
    }

    private _updateAttributes (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let vertexStreamSizeDynamic = 0;
        this._vertexAttributeHash = '';
        for (let i = 0, length = this._vertexStreamAttributes.length; i < length; i++) {
            const attrib = this._vertexStreamAttributes[i];
            if (attrib.stream === 1) {
                vertexStreamSizeDynamic += FormatInfos[attrib.format].size;
                this._vertexAttributeHash += `n${attrib.name}f${attrib.format}n${attrib.isNormalized}l${attrib.location}`;
            }
        }
        this._vertexAttributeHash += 'vertex';
        this._vertexStreamSize = vertexStreamSizeDynamic;
    }

    private _updateRenderingSubMesh (mesh: Mesh, material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        if (!this._renderingSubMesh) {
            this._updateAttributes(material, particles, emitter);
            const vertCount = mesh.struct.vertexBundles[mesh.struct.primitives[0].vertexBundelIndices[0]].view.count;
            const indexCount = mesh.struct.primitives[0].indexView!.count;
            const vertexStreamSizeStatic = 0;
            const vertexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                vertexStreamSizeStatic * vertCount,
                vertexStreamSizeStatic,
            ));
            const vertStaticAttrsFloatCount = vertexStreamSizeStatic / 4;
            const vBuffer: ArrayBuffer = new ArrayBuffer(vertexStreamSizeStatic * vertCount);
            let offset = 0;
            let vIdx = this._vertexStreamAttributes.findIndex((val) => val.name === AttributeName.ATTR_TEX_COORD); // find ATTR_TEX_COORD index
            mesh.copyAttribute(0, AttributeName.ATTR_TEX_COORD, vBuffer, vertexStreamSizeStatic, offset);  // copy mesh uv to ATTR_TEX_COORD
            offset += FormatInfos[this._vertexStreamAttributes[vIdx].format].size; // find ATTR_TEX_COORD offset
            vIdx = this._vertexStreamAttributes.findIndex((val) => val.name === AttributeName.ATTR_POSITION); // find ATTR_TEX_COORD3 index
            mesh.copyAttribute(0, AttributeName.ATTR_POSITION, vBuffer, vertexStreamSizeStatic, offset);  // copy mesh position to ATTR_TEX_COORD3
            offset += FormatInfos[this._vertexStreamAttributes[vIdx].format].size; // find ATTR_TEX_COORD offset
            mesh.copyAttribute(0, AttributeName.ATTR_NORMAL, vBuffer, vertexStreamSizeStatic, offset);  // copy mesh normal to ATTR_NORMAL
            offset += FormatInfos[this._vertexStreamAttributes[vIdx].format].size; // find ATTR_TEX_COORD offset
            if (!mesh.copyAttribute(0, AttributeName.ATTR_COLOR, vBuffer, vertexStreamSizeStatic, offset)) {  // copy mesh color to ATTR_COLOR1
                offset += FormatInfos[this._vertexStreamAttributes[vIdx].format].size;
                const vb = new Uint32Array(vBuffer);
                for (let iVertex = 0; iVertex < vertCount; ++iVertex) {
                    vb[iVertex * vertStaticAttrsFloatCount + offset / 4] = Color.WHITE._val;
                }
            }
            vertexBuffer.update(vBuffer);
            const indexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                Uint16Array.BYTES_PER_ELEMENT * indexCount,
                Uint16Array.BYTES_PER_ELEMENT,
            ));
            const indices: Uint16Array = new Uint16Array(indexCount);
            mesh.copyIndices(0, indices);
            indexBuffer.update(indices);

            const dynamicBuffer = vfxManager.getOrCreateDynamicVBO(this._vertexAttributeHash, this._vertexStreamSize);

            this._insBuffers.push(vertexBuffer);
            this._insBuffers.push(dynamicBuffer);
            this._renderingSubMesh = new RenderingSubMesh(this._insBuffers, this._vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, indexBuffer);
        }
        this._instanceCount = particles.count;
    }
}
