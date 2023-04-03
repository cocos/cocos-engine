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
import { Enum, Material, Quat, RenderingSubMesh, Vec3, Vec4, Vec2, Color } from '../../core';
import { ccclass, displayName, displayOrder, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { Attribute, Buffer, AttributeName, BufferInfo, BufferUsageBit, deviceManager, DrawInfo, DRAW_INFO_SIZE, Format, FormatInfos, IndirectBuffer, MemoryUsageBit, PrimitiveMode } from '../../core/gfx';
import { MacroRecord, MaterialInstance } from '../../core/renderer';
import { AlignmentSpace, Space } from '../enum';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { ModuleExecStage, ParticleModule } from '../particle-module';
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
@ccclass('cc.SpriteRendererModule')
@ParticleModule.register('SpriteRenderer', ModuleExecStage.RENDER)
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
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private declare _dynamicBuffer: Buffer;
    private declare _dynamicBufferFloatView: Float32Array;
    private declare _dynamicBufferUintView: Uint32Array;
    private _vertexStreamSize = 0;

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
        this._isMaterialDirty = false;
        const dynamicBufferFloatView = this._dynamicBufferFloatView;
        const dynamicBufferUintView = this._dynamicBufferUintView;
        const vertexStreamSizeDynamic = this._vertexStreamSize / 4;
        if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const position = particles.position.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBufferFloatView[offset] = position[xOffset];
                dynamicBufferFloatView[offset + 1] = position[yOffset];
                dynamicBufferFloatView[offset + 2] = position[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.ROTATION)) {
            const rotation = particles.rotation.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBufferFloatView[offset + 3] = rotation[xOffset];
                dynamicBufferFloatView[offset + 4] = rotation[yOffset];
                dynamicBufferFloatView[offset + 5] = rotation[zOffset];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.SIZE)) {
            const size = particles.size.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                const xOffset = i * 3;
                const yOffset = xOffset + 1;
                const zOffset = yOffset + 1;
                dynamicBufferFloatView[offset + 6] = size[xOffset];
                dynamicBufferFloatView[offset + 7] = size[yOffset];
                dynamicBufferFloatView[offset + 8] = size[zOffset];
            }
        } else {
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBufferFloatView[offset + 6] = 1;
                dynamicBufferFloatView[offset + 7] = 1;
                dynamicBufferFloatView[offset + 8] = 1;
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.COLOR)) {
            const color = particles.color.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBufferUintView[offset + 9] = color[i];
            }
        } else {
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBufferUintView[offset + 9] = Color.WHITE._val;
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.FRAME_INDEX)) {
            const frameIndex = particles.frameIndex.data;
            for (let i = 0; i < count; i++) {
                const offset = i * vertexStreamSizeDynamic;
                dynamicBufferFloatView[offset + 10] = frameIndex[i];
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
                dynamicBufferFloatView[offset + 11] += velocityData[xOffset];
                dynamicBufferFloatView[offset + 12] += velocityData[yOffset];
                dynamicBufferFloatView[offset + 13] += velocityData[zOffset];
            }
        }
        this._dynamicBuffer.update(dynamicBufferFloatView); // update dynamic buffer
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!this._isSubUVTilesAndVelLenScaleDirty && !this._isMaterialDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
        this._isSubUVTilesAndVelLenScaleDirty = false;
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
        if (!Quat.equals(currentRotation, this._rotation) || this._isMaterialDirty) {
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
        if (!Vec3.equals(currentScale, this._renderScale) || this._isMaterialDirty) {
            this._renderScale.set(currentScale.x, currentScale.y, currentScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        let needRecompile = this._isMaterialDirty;
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
        const vertexStreamAttributes = [meshPosition, meshUv, particlePosition, particleRotation, particleSize, particleColor, particleFrameId, particleVelocity];
        for (let i = 0, length = vertexStreamAttributes.length; i < length; i++) {
            if (vertexStreamAttributes[i].stream === 1) {
                vertexStreamSizeDynamic += FormatInfos[vertexStreamAttributes[i].format].size;
            }
        }
        this._vertexStreamSize = vertexStreamSizeDynamic;
        return vertexStreamAttributes;
    }

    private _updateRenderingSubMesh (material: Material, particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!this._renderingSubMesh) {
            const vertexStreamAttributes = this._updateAttributes(material, particles, params, context);
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
