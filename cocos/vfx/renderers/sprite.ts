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
import { ccclass, displayName, displayOrder, serializable, tooltip, type, visible } from 'cc.decorator';
import { Material, RenderingSubMesh } from '../../asset/assets';
import { Enum, Quat, Vec3, Vec4 } from '../../core';
import { Buffer, BufferInfo, BufferUsageBit, deviceManager, FormatInfos, MemoryUsageBit, PrimitiveMode } from '../../gfx';
import { MacroRecord, MaterialInstance } from '../../render-scene';
import { AlignmentSpace, ScalingMode, Space } from '../enum';
import { VFXEmitterParams, ModuleExecContext, VFXEmitterState } from '../base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { CC_PARTICLE_COLOR, CC_PARTICLE_FRAME_INDEX, CC_PARTICLE_POSITION, CC_PARTICLE_ROTATION, CC_PARTICLE_SIZE, CC_PARTICLE_VELOCITY, CC_RENDER_MODE, CC_USE_WORLD_SPACE, meshPosition, meshUv, particleColor, particleFrameIndex, particlePosition, particleRotation, particleSize, particleVelocity, ROTATION_OVER_TIME_MODULE_ENABLE, ParticleRenderer } from '../particle-renderer';
import { EmitterDataSet } from '../emitter-data-set';

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
@ccclass('cc.SpriteParticleRenderer')
export class SpriteParticleRenderer extends ParticleRenderer {
    get name (): string {
        return 'SpriteRenderer';
    }
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
    @visible(function (this: SpriteParticleRenderer) { return this.renderMode === RenderMode.STRETCHED_BILLBOARD; })
    public get velocityScale () {
        return this._subUVTilesAndVelLenScale.z;
    }

    public set velocityScale (val) {
        this._subUVTilesAndVelLenScale.z = val;
    }

    @tooltip('i18n:particleSystemRenderer.lengthScale')
    @visible(function (this: SpriteParticleRenderer) { return this.renderMode === RenderMode.STRETCHED_BILLBOARD; })
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
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private declare _dynamicBuffer: Buffer;
    private declare _dynamicBufferFloatView: Float32Array;
    private declare _dynamicBufferUintView: Uint32Array;
    private _vertexStreamSize = 0;

    public render (particles: ParticleDataSet, emitter: EmitterDataSet) {
        const material = this.material;
        if (!material) {
            return;
        }
        const { count } = particles;
        this._compileMaterial(material, particles, emitter);
        this._updateSubUvTilesAndVelocityLengthScale(material);
        this._updateRotation(material, particles, emitter);
        this._updateRenderScale(material, particles, emitter);
        this._updateRenderingSubMesh(material, particles, emitter);
        this._isMaterialDirty = false;
        const dynamicBufferFloatView = this._dynamicBufferFloatView;
        const dynamicBufferUintView = this._dynamicBufferUintView;
        const vertexStreamSizeDynamic = this._vertexStreamSize / 4;
        let offset = 0;
        const define = this._defines;
        if (define[CC_PARTICLE_POSITION]) {
            particles.position.copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_PARTICLE_ROTATION]) {
            particles.rotation.copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_PARTICLE_SIZE]) {
            particles.scale.copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_PARTICLE_COLOR]) {
            particles.color.copyToTypedArray(dynamicBufferUintView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_PARTICLE_FRAME_INDEX]) {
            particles.subUVIndex.copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_PARTICLE_VELOCITY]) {
            particles.velocity.copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        this._dynamicBuffer.update(dynamicBufferFloatView); // update dynamic buffer
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material) {
        if (!this._isSubUVTilesAndVelLenScaleDirty && !this._isMaterialDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
        this._isSubUVTilesAndVelLenScaleDirty = false;
    }

    private _updateRotation (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let currentRotation: Quat;
        if (this._alignmentSpace === AlignmentSpace.LOCAL) {
            currentRotation = emitter.localRotation;
        } else if (this._alignmentSpace === AlignmentSpace.WORLD) {
            currentRotation = emitter.worldRotation;
        } else if (this._alignmentSpace === AlignmentSpace.VIEW) {
            currentRotation = Quat.IDENTITY;
        } else {
            currentRotation = Quat.IDENTITY;
        }
        if (!Quat.equals(currentRotation, this._rotation) || this._isMaterialDirty) {
            this._rotation.set(currentRotation.x, currentRotation.y, currentRotation.z, currentRotation.w);
            material.setProperty('nodeRotation', this._rotation);
        }
    }

    private _updateRenderScale (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        if (!Vec3.equals(emitter.renderScale, this._renderScale) || this._isMaterialDirty) {
            this._renderScale.set(emitter.renderScale.x, emitter.renderScale.y, emitter.renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let needRecompile = this._isMaterialDirty;
        const define = this._defines;
        if (define[CC_USE_WORLD_SPACE] !== emitter.isWorldSpace) {
            define[CC_USE_WORLD_SPACE] = emitter.isWorldSpace;
            needRecompile = true;
        }

        if (define[CC_RENDER_MODE] !== this.renderMode) {
            define[CC_RENDER_MODE] = this.renderMode;
            needRecompile = true;
        }

        if (define[ROTATION_OVER_TIME_MODULE_ENABLE] !== true) {
            define[ROTATION_OVER_TIME_MODULE_ENABLE] = true;
            needRecompile = true;
        }

        const hasPosition = particles.hasParameter(BuiltinParticleParameter.POSITION);
        if (define[CC_PARTICLE_POSITION] !== hasPosition) {
            define[CC_PARTICLE_POSITION] = hasPosition;
            needRecompile = true;
        }

        const hasRotation = particles.hasParameter(BuiltinParticleParameter.ROTATION);
        if (define[CC_PARTICLE_ROTATION] !== hasRotation) {
            define[CC_PARTICLE_ROTATION] = hasRotation;
            needRecompile = true;
        }

        const hasSize = particles.hasParameter(BuiltinParticleParameter.SCALE);
        if (define[CC_PARTICLE_SIZE] !== hasSize) {
            define[CC_PARTICLE_SIZE] = hasSize;
            needRecompile = true;
        }

        const hasColor = particles.hasParameter(BuiltinParticleParameter.COLOR);
        if (define[CC_PARTICLE_COLOR] !== hasColor) {
            define[CC_PARTICLE_COLOR] = hasColor;
            needRecompile = true;
        }

        const hasFrameIndex = particles.hasParameter(BuiltinParticleParameter.SUB_UV_INDEX);
        if (define[CC_PARTICLE_FRAME_INDEX] !== hasFrameIndex) {
            define[CC_PARTICLE_FRAME_INDEX] = hasFrameIndex;
            needRecompile = true;
        }

        const hasVelocity = particles.hasParameter(BuiltinParticleParameter.VELOCITY);
        if (define[CC_PARTICLE_VELOCITY] !== hasVelocity) {
            define[CC_PARTICLE_VELOCITY] = hasVelocity;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(define);
        }
    }

    private _updateAttributes (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let vertexStreamSizeDynamic = 0;
        const vertexStreamAttributes = [meshPosition, meshUv];
        const define = this._defines;
        if (define[CC_PARTICLE_POSITION]) {
            vertexStreamAttributes.push(particlePosition);
            vertexStreamSizeDynamic += FormatInfos[particlePosition.format].size;
        }
        if (define[CC_PARTICLE_ROTATION]) {
            vertexStreamAttributes.push(particleRotation);
            vertexStreamSizeDynamic += FormatInfos[particleRotation.format].size;
        }
        if (define[CC_PARTICLE_SIZE]) {
            vertexStreamAttributes.push(particleSize);
            vertexStreamSizeDynamic += FormatInfos[particleSize.format].size;
        }
        if (define[CC_PARTICLE_COLOR]) {
            vertexStreamAttributes.push(particleColor);
            vertexStreamSizeDynamic += FormatInfos[particleColor.format].size;
        }
        if (define[CC_PARTICLE_FRAME_INDEX]) {
            vertexStreamAttributes.push(particleFrameIndex);
            vertexStreamSizeDynamic += FormatInfos[particleFrameIndex.format].size;
        }
        if (define[CC_PARTICLE_VELOCITY]) {
            vertexStreamAttributes.push(particleVelocity);
            vertexStreamSizeDynamic += FormatInfos[particleVelocity.format].size;
        }
        this._vertexStreamSize = vertexStreamSizeDynamic;
        return vertexStreamAttributes;
    }

    private _updateRenderingSubMesh (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        if (!this._renderingSubMesh) {
            const vertexStreamAttributes = this._updateAttributes(material, particles, emitter);
            const vertexStreamSizeStatic = 24;
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
            this._dynamicBufferFloatView = new Float32Array(new ArrayBuffer(particles.capacity * this._vertexStreamSize));
            this._dynamicBufferUintView = new Uint32Array(this._dynamicBufferFloatView.buffer);
            this._dynamicBuffer = dynamicBuffer;
            this._renderingSubMesh = new RenderingSubMesh([vertexBuffer, dynamicBuffer], vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, indexBuffer);
            this._vertexCount = 4;
            this._indexCount = 6;
        }
        if (this._dynamicBufferFloatView.byteLength !== particles.capacity * this._vertexStreamSize) {
            this._dynamicBufferFloatView = new Float32Array(new ArrayBuffer(particles.capacity * this._vertexStreamSize));
            this._dynamicBufferUintView = new Uint32Array(this._dynamicBufferFloatView.buffer);
            this._dynamicBuffer.resize(particles.capacity * this._vertexStreamSize);
        }
        this._instanceCount = particles.count;
    }
}
