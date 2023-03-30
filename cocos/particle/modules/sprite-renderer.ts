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
import { Enum, Material, Quat, RenderingSubMesh, Vec4 } from '../../core';
import { displayName, displayOrder, serializable, tooltip, type, visible } from '../../core/data/decorators';
import { Attribute, AttributeName, BufferInfo, BufferUsageBit, deviceManager, DrawInfo, DRAW_INFO_SIZE, Format, FormatInfos, IndirectBuffer, MemoryUsageBit, PrimitiveMode } from '../../core/gfx';
import { MacroRecord, MaterialInstance } from '../../core/renderer';
import { AlignmentSpace, Space } from '../enum';
import { ParticleEmitterParams, ParticleExecContext } from '../particle-base';
import { BuiltinParticleParameter, ParticleDataSet } from '../particle-data-set';
import { RendererModule } from './renderer';

const CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
const CC_RENDER_MODE = 'CC_RENDER_MODE';
const INSTANCE_PARTICLE = 'CC_INSTANCE_PARTICLE';

const meshPosition = new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0);           // mesh position
const meshUv = new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 0);                // mesh uv
const particlePosition = new Attribute('a_particle_position', Format.RGB32F, false, 1, true);       // particle position
const particleRotation = new Attribute('a_particle_rotation', Format.RGB32F, false, 1, true);        // particle rotation
const particleSize = new Attribute('a_particle_size', Format.RGB32F, false, 1, true);               // particle size
const particleFrameId = new Attribute('a_particle_frame_id', Format.R32F, false, 1, true);          // particle frame id
const particleColor = new Attribute('a_particle_color', Format.RGBA8, true, 1, true);               // particle color
const particleVelocity = new Attribute('a_particle_velocity', Format.RGB32F, false, 1, true);       // particle velocity
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
        return this._velocityScale;
    }

    public set velocityScale (val) {
        this._velocityScale = val;
    }

    @tooltip('i18n:particleSystemRenderer.lengthScale')
    @visible(function (this: SpriteRendererModule) { return this.renderMode === RenderMode.STRETCHED_BILLBOARD; })
    public get lengthScale () {
        return this._lengthScale;
    }

    public set lengthScale (val) {
        this._lengthScale = val;
    }

    @serializable
    private _velocityScale = 1;
    @serializable
    private _lengthScale = 1;
    private _alignmentSpace = AlignmentSpace.LOCAL;
    @serializable
    private _renderMode = RenderMode.BILLBOARD;
    private _defines: MacroRecord = {};
    private _vertexStreamAttributes: Attribute[] = [meshPosition, meshUv, particlePosition, particleRotation, particleSize, particleFrameId, particleColor, particleVelocity];
    private _frameTile_velLenScale = new Vec4(1, 1, 0, 0);
    private _tmp_velLenScale = new Vec4(1, 1, 0, 0);
    private _node_scale = new Vec4();
    private _rotation = new Quat();
    private _renderingSubMesh: RenderingSubMesh | null = null;
    private _insBuffers: Buffer[] = [];
    private _dynamicBuffer: Float32Array | null = null;
    private _dynamicBufferUintView: Uint32Array | null = null;
    private _insIndices: Buffer | null = null;
    private _vertexStreamSize = 0;
    private _iaInfo = new IndirectBuffer([new DrawInfo()]);
    private _iaInfoBuffer = deviceManager.gfxDevice.createBuffer(new BufferInfo(
        BufferUsageBit.INDIRECT,
        MemoryUsageBit.HOST | MemoryUsageBit.DEVICE,
        DRAW_INFO_SIZE,
        DRAW_INFO_SIZE,
    ));

    public execute (particles: ParticleDataSet, params: ParticleEmitterParams, context: ParticleExecContext) {
        if (!this.material) {
            return;
        }
        const material = this.material;
        this._defines[CC_USE_WORLD_SPACE] = params.simulationSpace === Space.WORLD;
        this._defines[CC_RENDER_MODE] = this.renderMode;
        material.recompileShaders(this._defines);
        switch (params.scaleSpace) {
        case Space.LOCAL:
            this._node_scale.set(context.localScale.x, context.localScale.y, context.localScale.z);
            break;
        case Space.WORLD:
            this._node_scale.set(context.worldScale.x, context.worldScale.y, context.worldScale.z);
            break;
        default:
            break;
        }
        material.setProperty('scale', this._node_scale);
        if (this._alignmentSpace === AlignmentSpace.LOCAL) {
            this._rotation.set(context.localRotation);
        } else if (this._alignmentSpace === AlignmentSpace.WORLD) {
            this._rotation.set(context.worldRotation);
        } else if (this._alignmentSpace === AlignmentSpace.VIEW) {
            // Quat.fromEuler(_node_rot, 0.0, 0.0, 0.0);
            this._rotation.set(0.0, 0.0, 0.0, 1.0);
        } else {
            this._rotation.set(0.0, 0.0, 0.0, 1.0);
        }
        material.setProperty('nodeRotation', this._rotation);
        if (particles.hasParameter(BuiltinParticleParameter.POSITION)) {
            const position = particles.position.data;
            for (let i = 0; i < count; i++) {
                const offset = i * this._vertDynamicAttrsFloatCount;
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
                const offset = i * this._vertDynamicAttrsFloatCount;
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
                const offset = i * this._vertDynamicAttrsFloatCount;
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
                const offset = i * this._vertDynamicAttrsFloatCount;
                dynamicBuffer[offset + 9] = frameIndex[i];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.COLOR)) {
            const color = particles.color.data;
            for (let i = 0; i < count; i++) {
                const offset = i * this._vertDynamicAttrsFloatCount;
                dynamicBufferUintView[offset + 10] = color[i];
            }
        }
        if (particles.hasParameter(BuiltinParticleParameter.VELOCITY)) {
            const { velocity } = particles;
            const velocityData = velocity.data;
            for (let i = 0; i < count; i++) {
                const offset = i * this._vertDynamicAttrsFloatCount;
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

    private _updateAttributes () {
        let vertexStreamSizeDynamic = 0;
        for (let i = 0, length = this._vertexStreamAttributes.length; i < length; i++) {
            vertexStreamSizeDynamic += FormatInfos[this._vertexStreamAttributes[i].format].size;
        }
        this._vertexStreamSize = vertexStreamSizeDynamic;
    }

    private _generateMesh () {
        if (!this._renderingSubMesh) {
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
                6 * Uint16Array.BYTES_PER_ELEMENT,
                Uint16Array.BYTES_PER_ELEMENT,
            ));
            indexBuffer.update(fixedIndexBuffer);
            this._iaInfo.drawInfos[0].vertexCount = 4;
            this._iaInfo.drawInfos[0].indexCount = 6;
            this._iaInfoBuffer.update(this._iaInfo);
            this._renderingSubMesh = new RenderingSubMesh(this._insBuffers, this._vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, indexBuffer, this._iaInfoBuffer);
        }
    }
}
