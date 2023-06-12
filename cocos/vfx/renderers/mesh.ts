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
import { Color, Quat, Vec3, Vec4 } from '../../core';
import { Material, RenderingSubMesh } from '../../asset/assets';
import { ccclass, serializable, type } from '../../core/data/decorators';
import { BufferInfo, BufferUsageBit, deviceManager, MemoryUsageBit, FormatInfos, PrimitiveMode, AttributeName } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { vfxManager } from '../vfx-manager';
import { CC_VFX_E_IS_WORLD_SPACE, CC_VFX_P_COLOR, CC_VFX_P_MESH_ORIENTATION, CC_VFX_P_POSITION, CC_VFX_P_SCALE, CC_VFX_P_SUB_UV_INDEX, CC_VFX_RENDERER_TYPE, CC_VFX_RENDERER_TYPE_MESH, E_IS_WORLD_SPACE, E_RENDER_SCALE, E_WORLD_ROTATION, meshColorRGBA8,
    meshNormal, meshPosition, meshUv, P_COLOR, P_MESH_ORIENTATION, P_POSITION, P_SCALE, P_SUB_UV_INDEX1, vfxPColor, vfxPMeshOrientation, vfxPPosition, vfxPScale, vfxPSubUVIndex } from '../define';
import { ParticleRenderer } from '../particle-renderer';
import { VFXQuat, VFXVec3, VFXBool } from '../parameters';
import { VFXDynamicBuffer } from '../vfx-dynamic-buffer';
import { VFXParameterMap } from '../vfx-parameter-map';

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
    private declare _dynamicVBO: VFXDynamicBuffer;
    private _vertexStreamSize = 0;
    private _vertexAttributeHash = '';

    public render (parameterMap: VFXParameterMap, count: number) {
        const material = this.material;
        const mesh = this._mesh;
        if (!material || !mesh) {
            return;
        }
        this._compileMaterial(material, parameterMap);
        this._updateRotation(material, parameterMap);
        this._updateRenderScale(material, parameterMap);
        this._updateRenderingSubMesh(mesh, material, parameterMap);
        this._ensureVBO(count);
        this._fillVertexData(parameterMap, count);
    }

    private _ensureVBO (count: number) {
        this._firstInstance = this._dynamicVBO.usedCount;
        this._dynamicVBO.usedCount += count;
    }

    private _fillVertexData (parameterMap: VFXParameterMap, count: number) {
        const floatView = this._dynamicVBO.floatDataView;
        const uintView = this._dynamicVBO.uint32DataView;
        const vertexStreamSizeDynamic = this._vertexStreamSize / 4;
        const firstInstance = this._firstInstance;

        let offset = 0;
        const define = this._defines;
        if (define[CC_VFX_P_POSITION]) {
            parameterMap.getVec3ArrayValue(P_POSITION).copyToTypedArray(floatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_VFX_P_MESH_ORIENTATION]) {
            parameterMap.getVec3ArrayValue(P_MESH_ORIENTATION).copyToTypedArray(floatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_VFX_P_SCALE]) {
            parameterMap.getVec3ArrayValue(P_SCALE).copyToTypedArray(floatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_VFX_P_COLOR]) {
            parameterMap.getColorArrayValue(P_COLOR).copyToTypedArray(uintView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_SUB_UV_INDEX]) {
            parameterMap.getFloatArrayVale(P_SUB_UV_INDEX1).copyToTypedArray(floatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        this._instanceCount = count;
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material) {
        if (!this._isSubUVTilesAndVelLenScaleDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
    }

    private _updateRotation (material: Material, parameterMap: VFXParameterMap) {
        let currentRotation: Quat;
        if (this.facingMode === MeshFacingMode.NONE) {
            currentRotation = Quat.IDENTITY;
        } else if (this.facingMode === MeshFacingMode.VELOCITY) {
            currentRotation = parameterMap.getValueUnsafe<VFXQuat>(E_WORLD_ROTATION).data;
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

    private _updateRenderScale (material: Material, parameterMap: VFXParameterMap) {
        const renderScale = parameterMap.getValueUnsafe<VFXVec3>(E_RENDER_SCALE).data;
        if (!Vec3.equals(renderScale, this._renderScale)) {
            this._renderScale.set(renderScale.x, renderScale.y, renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, parameterMap: VFXParameterMap) {
        let needRecompile = false;
        const isWorldSpace = parameterMap.getValueUnsafe<VFXBool>(E_IS_WORLD_SPACE).data;
        const define = this._defines;
        if (define[CC_VFX_E_IS_WORLD_SPACE] !== isWorldSpace) {
            define[CC_VFX_E_IS_WORLD_SPACE] = isWorldSpace;
            needRecompile = true;
        }

        const hasPosition = parameterMap.hasParameter(P_POSITION);
        if (define[CC_VFX_P_POSITION] !== hasPosition) {
            define[CC_VFX_P_POSITION] = hasPosition;
            needRecompile = true;
        }

        const hasMeshOrientation = parameterMap.hasParameter(P_MESH_ORIENTATION);
        if (define[CC_VFX_P_MESH_ORIENTATION] !== hasMeshOrientation) {
            define[CC_VFX_P_MESH_ORIENTATION] = hasMeshOrientation;
            needRecompile = true;
        }

        const hasScale = parameterMap.hasParameter(P_SCALE);
        if (define[CC_VFX_P_SCALE] !== hasScale) {
            define[CC_VFX_P_SCALE] = hasScale;
            needRecompile = true;
        }

        const hasColor = parameterMap.hasParameter(P_COLOR);
        if (define[CC_VFX_P_COLOR] !== hasColor) {
            define[CC_VFX_P_COLOR] = hasColor;
            needRecompile = true;
        }

        const hasSubUVIndex = parameterMap.hasParameter(P_SUB_UV_INDEX1);
        if (define[CC_VFX_P_SUB_UV_INDEX] !== hasSubUVIndex) {
            define[CC_VFX_P_SUB_UV_INDEX] = hasSubUVIndex;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(this._defines);
        }
    }

    private _updateAttributes (material: Material, parameterMap: VFXParameterMap) {
        let vertexStreamSizeDynamic = 0;
        let hash = 'mesh';
        const vertexStreamAttributes = [meshPosition, meshUv, meshNormal, meshColorRGBA8];
        const define = this._defines;

        if (define[CC_VFX_P_POSITION]) {
            vertexStreamAttributes.push(vfxPPosition);
            vertexStreamSizeDynamic += FormatInfos[vfxPPosition.format].size;
            hash += `_${vfxPPosition.name}`;
        }
        if (define[CC_VFX_P_MESH_ORIENTATION]) {
            vertexStreamAttributes.push(vfxPMeshOrientation);
            vertexStreamSizeDynamic += FormatInfos[vfxPMeshOrientation.format].size;
            hash += `_${vfxPMeshOrientation.name}`;
        }
        if (define[CC_VFX_P_SCALE]) {
            vertexStreamAttributes.push(vfxPScale);
            vertexStreamSizeDynamic += FormatInfos[vfxPScale.format].size;
            hash += `_${vfxPScale.name}`;
        }
        if (define[CC_VFX_P_COLOR]) {
            vertexStreamAttributes.push(vfxPColor);
            vertexStreamSizeDynamic += FormatInfos[vfxPColor.format].size;
            hash += `_${vfxPColor.name}`;
        }
        if (define[CC_VFX_P_SUB_UV_INDEX]) {
            vertexStreamAttributes.push(vfxPSubUVIndex);
            vertexStreamSizeDynamic += FormatInfos[vfxPSubUVIndex.format].size;
            hash += `_${vfxPSubUVIndex.name}`;
        }

        this._vertexAttributeHash = hash;
        this._vertexStreamSize = vertexStreamSizeDynamic;
        return vertexStreamAttributes;
    }

    private _updateRenderingSubMesh (mesh: Mesh, material: Material, parameterMap: VFXParameterMap) {
        if (!this._renderingSubMesh) {
            const vertexStreamAttributes = this._updateAttributes(material, parameterMap);
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

            const dynamicBuffer = vfxManager.getOrCreateDynamicBuffer(this._vertexAttributeHash, this._vertexStreamSize, BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST);
            this._renderingSubMesh = new RenderingSubMesh([vertexBuffer, dynamicBuffer.buffer], vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, indexBuffer);
        }
    }
}
