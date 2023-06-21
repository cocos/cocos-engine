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
import { ccclass, serializable, type } from 'cc.decorator';
import { vfxManager } from '../vfx-manager';
import { Material, RenderingSubMesh } from '../../asset/assets';
import { Enum, Quat, Vec3, Vec4 } from '../../core';
import { FormatInfos, PrimitiveMode, BufferUsageBit } from '../../gfx';
import { MacroRecord } from '../../render-scene';
import { CC_VFX_E_IS_WORLD_SPACE, CC_VFX_P_COLOR, CC_VFX_P_POSITION, CC_VFX_P_SPRITE_ROTATION, CC_VFX_P_SPRITE_SIZE, CC_VFX_P_SUB_UV_INDEX, CC_VFX_P_VELOCITY, CC_VFX_RENDERER_TYPE, CC_VFX_RENDERER_TYPE_SPRITE, CC_VFX_SPRITE_ALIGNMENT_MODE, CC_VFX_SPRITE_FACING_MODE, E_IS_WORLD_SPACE, E_PARTICLE_NUM, E_RENDER_SCALE, P_COLOR, P_POSITION, P_SPRITE_ROTATION, P_SPRITE_SIZE, P_SUB_UV_INDEX1, P_VELOCITY, vfxPColor, vfxPPosition, vfxPSpriteRotation, vfxPSpriteSize, vfxPSubUVIndex, vfxPVelocity } from '../define';
import { ParticleRenderer } from '../particle-renderer';
import { VFXDynamicBuffer } from '../vfx-dynamic-buffer';
import { VFXParameterMap } from '../vfx-parameter-map';
import { VFXParameterBinding, VFXParameterRegistry } from '../vfx-parameter';
import { AABB } from '../../core/geometry';

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
    get name () {
        return 'SpriteRenderer';
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

    @type(VFXParameterBinding)
    public get positionBinding () {
        if (!this._positionBinding) {
            this._positionBinding = new VFXParameterBinding(P_POSITION);
        }
        return this._positionBinding;
    }

    public set positionBinding (val) {
        this._positionBinding = val;
    }

    @type(VFXParameterBinding)
    public get colorBinding () {
        if (!this._colorBinding) {
            this._colorBinding = new VFXParameterBinding(P_COLOR);
        }
        return this._colorBinding;
    }

    public set colorBinding (val) {
        this._colorBinding = val;
    }

    @type(VFXParameterBinding)
    public get velocityBinding () {
        if (!this._velocityBinding) {
            this._velocityBinding = new VFXParameterBinding(P_VELOCITY);
        }
        return this._velocityBinding;
    }

    public set velocityBinding (val) {
        this._velocityBinding = val;
    }

    @type(VFXParameterBinding)
    public get spriteRotationBinding () {
        if (!this._spriteRotationBinding) {
            this._spriteRotationBinding = new VFXParameterBinding(P_SPRITE_ROTATION);
        }
        return this._spriteRotationBinding;
    }

    public set spriteRotationBinding (val) {
        this._spriteRotationBinding = val;
    }

    @type(VFXParameterBinding)
    public get spriteSizeBinding () {
        if (!this._spriteSizeBinding) {
            this._spriteSizeBinding = new VFXParameterBinding(P_SPRITE_SIZE);
        }
        return this._spriteSizeBinding;
    }

    public set spriteSizeBinding (val) {
        this._spriteSizeBinding = val;
    }

    @type(VFXParameterBinding)
    public get subUVIndexBinding () {
        if (!this._subUVIndexBinding) {
            this._subUVIndexBinding = new VFXParameterBinding(P_SUB_UV_INDEX1);
        }
        return this._subUVIndexBinding;
    }

    public set subUVIndexBinding (val) {
        this._subUVIndexBinding = val;
    }

    @serializable
    private _positionBinding: VFXParameterBinding | null = null;
    @serializable
    private _colorBinding: VFXParameterBinding | null = null;
    @serializable
    private _velocityBinding: VFXParameterBinding | null = null;
    @serializable
    private _spriteRotationBinding: VFXParameterBinding | null = null;
    @serializable
    private _spriteSizeBinding: VFXParameterBinding | null = null;
    @serializable
    private _subUVIndexBinding: VFXParameterBinding | null = null;

    private _subUVTilesAndVelLenScale = new Vec4(1, 1, 1, 1);
    private _isSubUVTilesAndVelLenScaleDirty = true;
    private _defines: MacroRecord = { [CC_VFX_RENDERER_TYPE]: CC_VFX_RENDERER_TYPE_SPRITE };
    private _renderScale = new Vec4();
    private _rotation = new Quat();
    private _vertexStreamSize = 0;
    private _vertexAttributeHash = '';
    private declare _dynamicVBO: VFXDynamicBuffer;

    public render (parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry) {
        const material = this.material;
        if (!material) {
            return;
        }
        const count = parameterMap.getUint32Value(E_PARTICLE_NUM).data;
        this._compileMaterial(material, parameterMap);
        this._updateSubUvTilesAndVelocityLengthScale(material);
        this._updateRotation(material, parameterMap);
        this._updateRenderScale(material, parameterMap);
        this._updateRenderingSubMesh(material, parameterMap);
        this._ensureVBO(count);
        this._fillVertexData(parameterMap, count);
        this._isMaterialDirty = false;
    }

    private _fillVertexData (parameterMap: VFXParameterMap, count: number) {
        const dynamicBufferFloatView = this._dynamicVBO.floatDataView;
        const dynamicBufferUintView = this._dynamicVBO.uint32DataView;
        const vertexStreamSizeDynamic = this._vertexStreamSize / 4;
        const firstInstance = this._firstInstance;

        let offset = 0;
        const define = this._defines;
        if (define[CC_VFX_P_POSITION]) {
            parameterMap.getVec3ArrayValue(P_POSITION).copyToTypedArray(dynamicBufferFloatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        if (define[CC_VFX_P_SPRITE_ROTATION]) {
            parameterMap.getFloatArrayVale(P_SPRITE_ROTATION).copyToTypedArray(dynamicBufferFloatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_SPRITE_SIZE]) {
            parameterMap.getVec2ArrayValue(P_SPRITE_SIZE).copyToTypedArray(dynamicBufferFloatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 2;
        }
        if (define[CC_VFX_P_COLOR]) {
            parameterMap.getColorArrayValue(P_COLOR).copyToTypedArray(dynamicBufferUintView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_SUB_UV_INDEX]) {
            parameterMap.getFloatArrayVale(P_SUB_UV_INDEX1).copyToTypedArray(dynamicBufferFloatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 1;
        }
        if (define[CC_VFX_P_VELOCITY]) {
            parameterMap.getVec3ArrayValue(P_VELOCITY).copyToTypedArray(dynamicBufferFloatView, firstInstance, vertexStreamSizeDynamic, offset, 0, count);
            offset += 3;
        }
        this._instanceCount = count;
    }

    private _ensureVBO (count: number) {
        this._firstInstance = this._dynamicVBO.usedCount;
        this._dynamicVBO.usedCount += count;
    }

    private _updateSubUvTilesAndVelocityLengthScale (material: Material) {
        if (!this._isSubUVTilesAndVelLenScaleDirty && !this._isMaterialDirty) {
            return;
        }
        material.setProperty('frameTile_velLenScale', this._subUVTilesAndVelLenScale);
        this._isSubUVTilesAndVelLenScaleDirty = false;
    }

    private _updateRotation (material: Material, parameterMap: VFXParameterMap) {
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

    private _updateRenderScale (material: Material, parameterMap: VFXParameterMap) {
        const renderScale = parameterMap.getVec3Value(E_RENDER_SCALE).data;
        if (!Vec3.equals(renderScale, this._renderScale) || this._isMaterialDirty) {
            this._renderScale.set(renderScale.x, renderScale.y, renderScale.z);
            material.setProperty('scale', this._renderScale);
        }
    }

    private _compileMaterial (material: Material, parameterMap: VFXParameterMap) {
        let needRecompile = this._isMaterialDirty;
        const define = this._defines;
        const isWorldSpace = parameterMap.getBoolValue(E_IS_WORLD_SPACE).data;
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

        const hasPosition = parameterMap.has(P_POSITION);
        if (define[CC_VFX_P_POSITION] !== hasPosition) {
            define[CC_VFX_P_POSITION] = hasPosition;
            needRecompile = true;
        }

        const hasSpriteRotation = parameterMap.has(P_SPRITE_ROTATION);
        if (define[CC_VFX_P_SPRITE_ROTATION] !== hasSpriteRotation) {
            define[CC_VFX_P_SPRITE_ROTATION] = hasSpriteRotation;
            needRecompile = true;
        }

        const hasSpriteSize = parameterMap.has(P_SPRITE_SIZE);
        if (define[CC_VFX_P_SPRITE_SIZE] !== hasSpriteSize) {
            define[CC_VFX_P_SPRITE_SIZE] = hasSpriteSize;
            needRecompile = true;
        }

        const hasColor = parameterMap.has(P_COLOR);
        if (define[CC_VFX_P_COLOR] !== hasColor) {
            define[CC_VFX_P_COLOR] = hasColor;
            needRecompile = true;
        }

        const hasSubUVIndex = parameterMap.has(P_SUB_UV_INDEX1);
        if (define[CC_VFX_P_SUB_UV_INDEX] !== hasSubUVIndex) {
            define[CC_VFX_P_SUB_UV_INDEX] = hasSubUVIndex;
            needRecompile = true;
        }

        const hasVelocity = parameterMap.has(P_VELOCITY);
        if (define[CC_VFX_P_VELOCITY] !== hasVelocity) {
            define[CC_VFX_P_VELOCITY] = hasVelocity;
            needRecompile = true;
        }

        if (needRecompile) {
            material.recompileShaders(define);
        }
    }

    private _updateAttributes (material: Material, parameterMap: VFXParameterMap) {
        let vertexStreamSizeDynamic = 0;
        let hash = 'sprite';
        const vertexStreamAttributes = vfxManager.sharedSpriteVertexBufferAttributes.slice();
        const define = this._defines;

        if (define[CC_VFX_P_POSITION]) {
            vertexStreamAttributes.push(vfxPPosition);
            vertexStreamSizeDynamic += FormatInfos[vfxPPosition.format].size;
            hash += `_${vfxPPosition.name}`;
        }
        if (define[CC_VFX_P_SPRITE_ROTATION]) {
            vertexStreamAttributes.push(vfxPSpriteRotation);
            vertexStreamSizeDynamic += FormatInfos[vfxPSpriteRotation.format].size;
            hash += `_${vfxPSpriteRotation.name}`;
        }
        if (define[CC_VFX_P_SPRITE_SIZE]) {
            vertexStreamAttributes.push(vfxPSpriteSize);
            vertexStreamSizeDynamic += FormatInfos[vfxPSpriteSize.format].size;
            hash += `_${vfxPSpriteSize.name}`;
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
        if (define[CC_VFX_P_VELOCITY]) {
            vertexStreamAttributes.push(vfxPVelocity);
            vertexStreamSizeDynamic += FormatInfos[vfxPVelocity.format].size;
            hash += `_${vfxPVelocity.name}`;
        }
        this._vertexAttributeHash = hash;
        this._vertexStreamSize = vertexStreamSizeDynamic;
        return vertexStreamAttributes;
    }

    private _updateRenderingSubMesh (material: Material, parameterMap: VFXParameterMap) {
        if (!this._renderingSubMesh) {
            const vertexStreamAttributes = this._updateAttributes(material, parameterMap);
            this._dynamicVBO = vfxManager.getOrCreateDynamicBuffer(this._vertexAttributeHash, this._vertexStreamSize, BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST);
            this._renderingSubMesh = new RenderingSubMesh(
                [vfxManager.getOrCreateSharedSpriteVertexBuffer(), this._dynamicVBO.buffer],
                vertexStreamAttributes,
                PrimitiveMode.TRIANGLE_LIST, vfxManager.getOrCreateSharedSpriteIndexBuffer(),
            );
            this._vertexCount = vfxManager.sharedSpriteVertexCount;
            this._indexCount = vfxManager.sharedSpriteIndexCount;
        }
    }

    public updateBounds (bounds: AABB, parameterMap: VFXParameterMap, parameterRegistry: VFXParameterRegistry): void {
        throw new Error('Method not implemented.');
    }
}
