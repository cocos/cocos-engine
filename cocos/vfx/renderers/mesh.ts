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
import { ccclass, displayOrder, serializable, tooltip, type } from '../../core/data/decorators';
import { BufferInfo, BufferUsageBit, deviceManager, DrawInfo, DRAW_INFO_SIZE, IndirectBuffer, MemoryUsageBit, Buffer, FormatInfos, PrimitiveMode, AttributeName } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { AlignmentSpace } from '../enum';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { CC_RENDER_MODE, CC_USE_WORLD_SPACE, meshColorRGBA8, meshNormal, meshPosition, meshUv, particleColor, particleFrameIndex, particlePosition, particleRotation, particleSize, particleVelocity, RENDER_MODE_MESH, ROTATION_OVER_TIME_MODULE_ENABLE, ParticleRenderer } from '../particle-renderer';
import { EmitterDataSet } from '../emitter-data-set';

@ccclass('cc.MeshParticleRenderer')
export class MeshParticleRenderer extends ParticleRenderer {
    get name (): string {
        return 'MeshRenderer';
    }
    /**
     * @zh 粒子发射的模型。
     */
    @type(Mesh)
    @displayOrder(7)
    @tooltip('i18n:particleSystemRenderer.mesh')
    public get mesh () {
        return this._mesh;
    }

    public set mesh (val) {
        if (this._mesh === val) return;
        this._mesh = val;
        this._renderingSubMesh?.destroy();
        this._renderingSubMesh = null;
    }

    @serializable
    private _mesh: Mesh | null = null;
    @serializable
    private _alignmentSpace = AlignmentSpace.LOCAL;
    @serializable
    private _subUVTilesAndVelLenScale = new Vec4(1, 1, 1, 1);
    private _isSubUVTilesAndVelLenScaleDirty = true;
    private _defines: MacroRecord = { [CC_RENDER_MODE]: RENDER_MODE_MESH };
    private _vertexStreamAttributes = [
        meshPosition, meshUv, meshNormal, meshColorRGBA8, particlePosition,
        particleRotation, particleSize, particleFrameIndex, particleColor, particleVelocity,
    ];
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private _insBuffers: Buffer[] = [];
    private declare _dynamicBuffer: Float32Array;
    private declare _dynamicBufferUintView: Uint32Array;
    private _vertexStreamSize = 0;
    private _iaInfo = new IndirectBuffer([new DrawInfo()]);
    private _iaInfoBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
        BufferUsageBit.INDIRECT,
        MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
        DRAW_INFO_SIZE,
        DRAW_INFO_SIZE,
    ));

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
        const dynamicBuffer = this._dynamicBuffer;
        const dynamicBufferUintView = this._dynamicBufferUintView;
        const vertexStreamSizeDynamic = this._vertexStreamSize;
        if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const position = particles.position.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset] = position[xOffset];
                dynamicBuffer[offset + 1] = position[yOffset];
                dynamicBuffer[offset + 2] = position[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
            const rotation = particles.rotation.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 3] = rotation[xOffset];
                dynamicBuffer[offset + 4] = rotation[yOffset];
                dynamicBuffer[offset + 5] = rotation[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SCALE)) {
            const scale = particles.scale.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 6] = scale[xOffset];
                dynamicBuffer[offset + 7] = scale[yOffset];
                dynamicBuffer[offset + 8] = scale[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SUB_UV_INDEX)) {
            const subUVIndex = particles.subUVIndex.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBuffer[offset + 9] = subUVIndex[i];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.COLOR)) {
            const color = particles.color.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBufferUintView[offset + 10] = color[i];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            const { velocity } = particles;
            const velocityData = velocity.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 11] += velocityData[xOffset];
                dynamicBuffer[offset + 12] += velocityData[yOffset];
                dynamicBuffer[offset + 13] += velocityData[zOffset];
            }
        }
        this._insBuffers[1].update(dynamicBuffer); // update dynamic buffer
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material) {
        if (!this._isSubUVTilesAndVelLenScaleDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
    }

    private _updateRotation (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let currentRotation: Quat;
        if (this._alignmentSpace === AlignmentSpace.LOCAL) {
            currentRotation = emitter.localRotation;
        } else if (this._alignmentSpace === AlignmentSpace.WORLD) {
            currentRotation = emitter.worldRotation;
        } else if (this._alignmentSpace === AlignmentSpace.VIEW) {
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
        if (!Vec3.equals(emitter.renderScale, this._renderScale)) {
            this._renderScale.set(emitter.renderScale.x, emitter.renderScale.y, emitter.renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let needRecompile = false;
        if (this._defines[CC_USE_WORLD_SPACE] !== emitter.isWorldSpace) {
            this._defines[CC_USE_WORLD_SPACE] = emitter.isWorldSpace;
            needRecompile = true;
        }

        if (this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] !== true) {
            this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] = true;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(this._defines);
        }
    }

    private _updateAttributes (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let vertexStreamSizeDynamic = 0;
        for (let i = 0, length = this._vertexStreamAttributes.length; i < length; i++) {
            if (this._vertexStreamAttributes[i].stream === 1) {
                vertexStreamSizeDynamic += FormatInfos[this._vertexStreamAttributes[i].format].size;
            }
        }
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
            const dynamicBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
                this._vertexStreamSize * particles.capacity,
                this._vertexStreamSize,
            ));
            this._dynamicBuffer = new Float32Array(new ArrayBuffer(particles.capacity * this._vertexStreamSize));
            this._dynamicBufferUintView = new Uint32Array(this._dynamicBuffer.buffer);
            this._insBuffers.push(vertexBuffer);
            this._insBuffers.push(dynamicBuffer);
            this._iaInfo.drawInfos[0].vertexCount = vertCount;
            this._iaInfo.drawInfos[0].indexCount = indexCount;
            this._iaInfoBuffer.update(this._iaInfo);
            this._renderingSubMesh = new RenderingSubMesh(this._insBuffers, this._vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        }
        if (this._dynamicBuffer.byteLength !== particles.capacity * this._vertexStreamSize) {
            this._dynamicBuffer = new Float32Array(new ArrayBuffer(particles.capacity * this._vertexStreamSize));
            this._dynamicBufferUintView = new Uint32Array(this._dynamicBuffer.buffer);
            this._insBuffers[1].resize(particles.capacity * this._vertexStreamSize);
        }
    }
}
