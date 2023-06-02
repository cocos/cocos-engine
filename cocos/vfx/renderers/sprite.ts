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
import { globalDynamicBufferMap, globalSpriteIB, globalSpriteVB, vfxManager } from '../vfx-manager';

import { ccclass, serializable, type } from 'cc.decorator';
import { Material, RenderingSubMesh } from '../../asset/assets';
import { Enum, Quat, Vec3, Vec4, assertIsTrue } from '../../core';
import { Attribute, Buffer, FormatInfos, PrimitiveMode } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { CC_VFX_E_IS_WORLD_SPACE, CC_VFX_P_COLOR, CC_VFX_P_POSITION, CC_VFX_P_SPRITE_ROTATION, CC_VFX_P_SPRITE_SIZE, CC_VFX_P_SUB_UV_INDEX, CC_VFX_P_VELOCITY, CC_VFX_RENDERER_TYPE_SPRITE, CC_VFX_SPRITE_ALIGNMENT_MODE, CC_VFX_SPRITE_FACING_MODE, E_IS_WORLD_SPACE, E_RENDER_SCALE, meshPosition, meshUv, P_COLOR, P_POSITION, P_SPRITE_ROTATION, P_SPRITE_SIZE, P_SUB_UV_INDEX1, P_VELOCITY, vfxPColor, vfxPPosition, vfxPSpriteRotation, vfxPSpriteSize, vfxPSubUVIndex, vfxPVelocity } from '../define';
import { ParticleDataSet, EmitterDataSet } from '../data-set';
import { ParticleRenderer } from '../particle-renderer';
import { Vec3ArrayParameter, ColorArrayParameter, FloatArrayParameter, Vec3Parameter, BoolParameter, Vec2ArrayParameter } from '../parameters';

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
 * @en Particle alignment mode.
 * @zh 粒子的对齐模式。
 * @enum SpriteParticleRenderer.AlignmentMode
 */
export enum AlignmentMode {
    NONE,

    VELOCITY,

    CUSTOM,
}

/**
 * 粒子的朝向模式。
 * @enum SpriteParticleRenderer.FacingMode
 */
export enum SpriteFacingMode {
    /**
     * 粒子始终面向摄像机。
     */
    CAMERA,

    /**
     * 粒子始终与 XZ 平面平行。
     */
    HORIZONTAL,

    /**
     * 粒子始终与 Y 轴平行且朝向摄像机。
     */
    VERTICAL,

    /**
     * 粒子朝向自定义朝向矢量
     */
    CUSTOM,
}
@ccclass('cc.SpriteParticleRenderer')
export class SpriteParticleRenderer extends ParticleRenderer {
    get name (): string {
        return 'SpriteRenderer';
    }

    private destroy () {
        this._renderingSubMesh = null;
    }

    @type(Enum(AlignmentMode))
    @serializable
    private alignmentMode = AlignmentMode.NONE;
    /**
     * @zh 设定粒子朝向模式。
     */
    @type(Enum(SpriteFacingMode))
    @serializable
    public facingMode = SpriteFacingMode.CAMERA;

    private _subUVTilesAndVelLenScale = new Vec4(1, 1, 1, 1);
    private _isSubUVTilesAndVelLenScaleDirty = true;
    private _defines: MacroRecord = { CC_VFX_RENDERER_TYPE: CC_VFX_RENDERER_TYPE_SPRITE };
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private declare _dynamicBuffer: Buffer;
    private declare _dynamicBufferFloatView: Float32Array;
    private declare _dynamicBufferUintView: Uint32Array;
    private _vertexStreamSize = 0;
    private _vertexAttributeHash = '';

    private _ensureVBO (count: number) {
        assertIsTrue(globalDynamicBufferMap[this._vertexAttributeHash]);
        const dynamicVBO = globalDynamicBufferMap[this._vertexAttributeHash];
        dynamicVBO.markDirty();
        this._firstInstance = dynamicVBO.usedCount;
        dynamicVBO.usedCount += count;
        this._dynamicBufferFloatView = dynamicVBO.floatDataView;
        this._dynamicBufferUintView = dynamicVBO.uintDataView;
    }

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
        this._ensureVBO(particles.count);
        this._isMaterialDirty = false;
        const dynamicBufferFloatView = this._dynamicBufferFloatView;
        const dynamicBufferUintView = this._dynamicBufferUintView;
        const vertDynAttrsFloatCount = this._vertexStreamSize / 4;
        const bufferStart = this._firstInstance * vertDynAttrsFloatCount;
        const vertexStreamSizeDynamic = this._vertexStreamSize / 4;
        let offset = bufferStart;
        const define = this._defines;
        if (define[CC_VFX_P_POSITION]) {
            particles.getParameterUnsafe<Vec3ArrayParameter>(P_POSITION).copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_VFX_P_SPRITE_ROTATION]) {
            particles.getParameterUnsafe<FloatArrayParameter>(P_SPRITE_ROTATION).copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_SPRITE_SIZE]) {
            particles.getParameterUnsafe<Vec2ArrayParameter>(P_SPRITE_SIZE).copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 2;
        }
        if (define[CC_VFX_P_COLOR]) {
            particles.getParameterUnsafe<ColorArrayParameter>(P_COLOR).copyToTypedArray(dynamicBufferUintView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_SUB_UV_INDEX]) {
            particles.getParameterUnsafe<FloatArrayParameter>(P_SUB_UV_INDEX1).copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_VELOCITY]) {
            particles.getParameterUnsafe<Vec3ArrayParameter>(P_VELOCITY).copyToTypedArray(dynamicBufferFloatView, 0, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
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
        if (this.alignmentMode === AlignmentMode.NONE) {
            currentRotation = Quat.IDENTITY;
        } else if (this.alignmentMode === AlignmentMode.VELOCITY) {
            currentRotation =  Quat.IDENTITY;
        } else if (this.alignmentMode === AlignmentMode.CUSTOM) {
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
        const renderScale = emitter.getParameterUnsafe<Vec3Parameter>(E_RENDER_SCALE).data;
        if (!Vec3.equals(renderScale, this._renderScale) || this._isMaterialDirty) {
            this._renderScale.set(renderScale.x, renderScale.y, renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let needRecompile = this._isMaterialDirty;
        const define = this._defines;
        const isWorldSpace = emitter.getParameterUnsafe<BoolParameter>(E_IS_WORLD_SPACE).data;
        if (define[CC_VFX_E_IS_WORLD_SPACE] !== isWorldSpace) {
            define[CC_VFX_E_IS_WORLD_SPACE] = isWorldSpace;
            needRecompile = true;
        }

        if (define[CC_VFX_SPRITE_FACING_MODE] !== this.facingMode) {
            define[CC_VFX_SPRITE_FACING_MODE] = this.facingMode;
            needRecompile = true;
        }

        if (define[CC_VFX_SPRITE_ALIGNMENT_MODE] !== this.alignmentMode) {
            define[CC_VFX_SPRITE_ALIGNMENT_MODE] = this.alignmentMode;
            needRecompile = true;
        }

        const hasPosition = particles.hasParameter(P_POSITION);
        if (define[CC_VFX_P_POSITION] !== hasPosition) {
            define[CC_VFX_P_POSITION] = hasPosition;
            needRecompile = true;
        }

        const hasSpriteRotation = particles.hasParameter(P_SPRITE_ROTATION);
        if (define[CC_VFX_P_SPRITE_ROTATION] !== hasSpriteRotation) {
            define[CC_VFX_P_SPRITE_ROTATION] = hasSpriteRotation;
            needRecompile = true;
        }

        const hasSpriteSize = particles.hasParameter(P_SPRITE_SIZE);
        if (define[CC_VFX_P_SPRITE_SIZE] !== hasSpriteSize) {
            define[CC_VFX_P_SPRITE_SIZE] = hasSpriteSize;
            needRecompile = true;
        }

        const hasColor = particles.hasParameter(P_COLOR);
        if (define[CC_VFX_P_COLOR] !== hasColor) {
            define[CC_VFX_P_COLOR] = hasColor;
            needRecompile = true;
        }

        const hasSubUVIndex = particles.hasParameter(P_SUB_UV_INDEX1);
        if (define[CC_VFX_P_SUB_UV_INDEX] !== hasSubUVIndex) {
            define[CC_VFX_P_SUB_UV_INDEX] = hasSubUVIndex;
            needRecompile = true;
        }

        const hasVelocity = particles.hasParameter(P_VELOCITY);
        if (define[CC_VFX_P_VELOCITY] !== hasVelocity) {
            define[CC_VFX_P_VELOCITY] = hasVelocity;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(define);
        }
    }

    private _addAttrib (attrib: Attribute) {
        this._vertexAttributeHash += `n${attrib.name}f${attrib.format}n${attrib.isNormalized}l${attrib.location}`;
    }

    private _updateAttributes (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        let vertexStreamSizeDynamic = 0;
        this._vertexAttributeHash = '';
        const vertexStreamAttributes = [meshPosition, meshUv];
        const define = this._defines;

        if (define[CC_VFX_P_POSITION]) {
            vertexStreamAttributes.push(vfxPPosition);
            vertexStreamSizeDynamic += FormatInfos[vfxPPosition.format].size;
            this._addAttrib(vfxPPosition);
        }
        if (define[CC_VFX_P_SPRITE_ROTATION]) {
            vertexStreamAttributes.push(vfxPSpriteRotation);
            vertexStreamSizeDynamic += FormatInfos[vfxPSpriteRotation.format].size;
            this._addAttrib(vfxPSpriteRotation);
        }
        if (define[CC_VFX_P_SPRITE_SIZE]) {
            vertexStreamAttributes.push(vfxPSpriteSize);
            vertexStreamSizeDynamic += FormatInfos[vfxPSpriteSize.format].size;
            this._addAttrib(vfxPSpriteSize);
        }
        if (define[CC_VFX_P_COLOR]) {
            vertexStreamAttributes.push(vfxPColor);
            vertexStreamSizeDynamic += FormatInfos[vfxPColor.format].size;
            this._addAttrib(vfxPColor);
        }
        if (define[CC_VFX_P_SUB_UV_INDEX]) {
            vertexStreamAttributes.push(vfxPSubUVIndex);
            vertexStreamSizeDynamic += FormatInfos[vfxPSubUVIndex.format].size;
            this._addAttrib(vfxPSubUVIndex);
        }
        if (define[CC_VFX_P_VELOCITY]) {
            vertexStreamAttributes.push(vfxPVelocity);
            vertexStreamSizeDynamic += FormatInfos[vfxPVelocity.format].size;
            this._addAttrib(vfxPVelocity);
        }
        this._vertexAttributeHash += 'vertex';
        this._vertexStreamSize = vertexStreamSizeDynamic;
        return vertexStreamAttributes;
    }

    private _updateRenderingSubMesh (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
        if (!this._renderingSubMesh) {
            const vertexStreamAttributes = this._updateAttributes(material, particles, emitter);
            
            if (!globalSpriteVB || !globalSpriteIB) {
                vfxManager.createGlobalBuffer();
            }

            const dynamicBuffer = vfxManager.getOrCreateDynamicVBO(this._vertexAttributeHash, this._vertexStreamSize);

            this._dynamicBuffer = dynamicBuffer;
            
            if (globalSpriteVB && globalSpriteIB) {
                this._renderingSubMesh = new RenderingSubMesh([globalSpriteVB, dynamicBuffer], vertexStreamAttributes,
                    PrimitiveMode.TRIANGLE_LIST, globalSpriteIB);
            }
            this._vertexCount = 4;
            this._indexCount = 6;
        }
        this._instanceCount = particles.count;
    }
}
