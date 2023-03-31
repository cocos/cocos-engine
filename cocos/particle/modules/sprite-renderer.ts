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
import { Enum, Material, Quat, RenderingSubMesh, Vec3, Vec4, Vec2 } from '../../core';
import { displayName, displayOrder, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { Attribute, Buffer, AttributeName, BufferInfo, BufferUsageBit, deviceManager, DrawInfo, DRAW_INFO_SIZE, Format, FormatInfos, IndirectBuffer, MemoryUsageBit, PrimitiveMode } from '../../core/gfx';
import { MacroRecord, MaterialInstance } from '../../core/renderer';
import { AlignmentSpace, Space } from '../enum';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { CC_RENDER_MODE, CC_USE_WORLD_SPACE, meshPosition, meshUv, particleColor, particleFrameId, particlePosition, particleRotation, particleSize, particleVelocity, RendererModule, ROTATION_OVER_TIME_MODULE_ENABLE } from './renderer';

const fixedVertexBuffer = new Float32Array([
    0, 0, 0, 0, 0, 0, // bottom-left
    1, 0, 0, 1, 0, 0, // bottom-right
    0, 1, 0, 0, 1, 0, // top-left
    1, 1, 0, 1, 1, 0, // top-right
]);
const fixedIndexBuffer = new Uint16Array([
    0, 1, 2, 3, 2, 1,
]);
/**
 * 粒子的生成模式。
 * @enum ParticleSystemRenderer.RenderMode
 */
export enum RenderMode {
    /**
     * 粒子始终面向摄像机。
     */
    BILLBOARD,

    /**
     * 粒子始终面向摄像机但会根据参数进行拉伸。
     */
    STRETCHED_BILLBOARD,

    /**
     * 粒子始终与 XZ 平面平行。
     */
    HORIZONTAL_BILLBOARD,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机。
     */
    VERTICAL_BILLBOARD,
}
export class SpriteRendererModule extends RendererModule {
    /**
     * @zh 设定粒子生成模式。
     */
    @type(Enum(RenderMode))
    @displayOrder(0)
    @tooltip('i18n:particleSystemRenderer.renderMode')
    public get renderMode () {
        return this._renderMode;
    }

    public set renderMode (val) {
        this._renderMode = val;
    }

    @tooltip('i18n:particleSystemRenderer.velocityScale')
    @visible(function (this: SpriteRendererModule) { return this.renderMode === RenderMode.STRETCHED_BILLBOARD; })
    public get velocityScale () {
        return this._subUVTilesAndVelLenScale.z;
    }

    public set velocityScale (val) {
        this._subUVTilesAndVelLenScale.z = val;
    }

    @tooltip('i18n:particleSystemRenderer.lengthScale')
    @visible(function (this: SpriteRendererModule) { return this.renderMode === RenderMode.STRETCHED_BILLBOARD; })
    public get lengthScale () {
        return this._subUVTilesAndVelLenScale.w;
    }

    public set lengthScale (val) {
        this._subUVTilesAndVelLenScale.w = val;
        this._isSubUVTilesAndVelLenScaleDirty = true;
    }

    @serializable
    private _alignmentSpace = AlignmentSpace.LOCAL;
    @serializable
    private _renderMode = RenderMode.BILLBOARD;
    @serializable
    private _subUVTilesAndVelLenScale = new Vec4(1, 1, 1, 1);
    private _isSubUVTilesAndVelLenScaleDirty = true;
    private _defines: MacroRecord = {};
    private _vertexStreamAttributes = [meshPosition, meshUv, particlePosition, particleRotation, particleSize, particleFrameId, particleColor, particleVelocity];
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private _renderingSubMesh: RenderingSubMesh | null = null;
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

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        const material = this.material;
        if (!material) {
            return;
        }
        const { count } = particles;
        this._compileMaterial(material, particles, params, context);
        this._updateSubUvTilesAndVelocityLengthScale(material, particles, params, context);
        this._updateRotation(material, particles, params, context);
        this._updateRenderScale(material, particles, params, context);
        this._updateRenderingSubMesh(material, particles, params, context);
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
        if (particles.hasParameter(BuiltinParticleParameter.SIZE)) {
            const size = particles.size.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBuffer[offset + 6] = size[xOffset];
                dynamicBuffer[offset + 7] = size[yOffset];
                dynamicBuffer[offset + 8] = size[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.FRAME_INDEX)) {
            const frameIndex = particles.frameIndex.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBuffer[offset + 9] = frameIndex[i];
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

    private _updateSubUvTilesAndVelocityLengthScale (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!this._isSubUVTilesAndVelLenScaleDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
    }

    private _updateRotation (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        let currentRotation: Quat;
        if (this._alignmentSpace === AlignmentSpace.LOCAL) {
            currentRotation = context.localRotation;
        } else if (this._alignmentSpace === AlignmentSpace.WORLD) {
            currentRotation = context.worldRotation;
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

    private _updateRenderScale (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        let currentScale: Vec3;
        switch (params.scaleSpace) {
        case Space.LOCAL:
            currentScale = context.localScale;
            break;
        case Space.WORLD:
            currentScale = context.worldScale;
            break;
        default:
            currentScale = Vec3.ONE;
            break;
        }
        if (!Vec3.equals(currentScale, this._renderScale)) {
            this._renderScale.set(currentScale.x, currentScale.y, currentScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        let needRecompile = false;
        if (this._defines[CC_USE_WORLD_SPACE] !== (params.simulationSpace === Space.WORLD)) {
            this._defines[CC_USE_WORLD_SPACE] = params.simulationSpace === Space.WORLD;
            needRecompile = true;
        }

        if (this._defines[CC_RENDER_MODE] !== this.renderMode) {
            this._defines[CC_RENDER_MODE] = this.renderMode;
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

    private _updateAttributes (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        let vertexStreamSizeDynamic = 0;
        for (let i = 0, length = this._vertexStreamAttributes.length; i < length; i++) {
            if (this._vertexStreamAttributes[i].stream === 1) {
                vertexStreamSizeDynamic += FormatInfos[this._vertexStreamAttributes[i].format].size;
            }
        }
        this._vertexStreamSize = vertexStreamSizeDynamic;
    }

    private _updateRenderingSubMesh (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!this._renderingSubMesh) {
            this._updateAttributes(material, particles, params, context);
            const vertexStreamSizeStatic = 0;
            const vertexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                vertexStreamSizeStatic * 4,
                vertexStreamSizeStatic,
            ));
            vertexBuffer.update(fixedVertexBuffer);
            const indexBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
                BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST,
                MemoryUsageBit.DEVICE,
                Uint16Array.BYTES_PER_ELEMENT * 6,
                Uint16Array.BYTES_PER_ELEMENT,
            ));
            indexBuffer.update(fixedIndexBuffer);
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
            this._iaInfo.drawInfos[0].vertexCount = 4;
            this._iaInfo.drawInfos[0].indexCount = 6;
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
