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
 import { Material, RenderingSubMesh } from '../../asset/assets';
 import { Color, Vec3 } from '../../core';
 import { Attribute, Format, FormatInfos, PrimitiveMode, BufferUsageBit } from '../../gfx';
 import { MacroRecord } from '../../render-scene';
import { EmitterDataSet, ParticleDataSet } from '../data-set';
import { CC_VFX_P_COLOR, P_COLOR, P_POSITION, P_RIBBON_ID, P_RIBBON_LINK_ORDER, P_RIBBON_WIDTH } from '../define';
 import { ColorArrayParameter, FloatArrayParameter } from '../parameters';
 import { ParticleRenderer } from '../particle-renderer';
import { VFXDynamicBuffer } from '../vfx-dynamic-buffer';
 import { vfxManager } from '../vfx-manager';
import { Handle } from '../vfx-parameter';
 
 const ribbonPosition = new Attribute('a_particle_position', Format.RGB32F, false, 0, true);       // ribbon position
 const ribbonSize = new Attribute('a_particle_size', Format.RGB32F, false, 0, true);               // ribbon scale
 const ribbonColor = new Attribute('a_particle_color', Format.RGBA8, true, 0, true);               // ribbon color
 const ribbonVelocity = new Attribute('a_particle_velocity', Format.RGB32F, false, 1, true);       // ribbon velocity
 
 const RIBBON_IBO_HASH = 'ribbon-index';
 
 const _pos1: Vec3 = new Vec3();
 const _pos2: Vec3 = new Vec3();
 const _tmp_pos: Vec3 = new Vec3();
 const _tmp_color: Color = new Color();
 const _tmp_velo1: Vec3 = new Vec3();
 const _tmp_velo2: Vec3 = new Vec3();
 
 class ParticleOrder {
     public particle: Handle;
     public order: number;
 
     constructor (particle: Handle, order: number) {
         this.particle = particle;
         this.order = order;
     }
 }
 
 class Segment {
     public start: Handle;
     public end: Handle;
     public velocity: Vec3;
 
     constructor (particles: ParticleDataSet, start: Handle, end: Handle) {
         this.start = start;
         this.end = end;
         const positions = particles.getVec3ArrayParameter(P_POSITION);
         positions.getVec3At(_pos1, start);
         positions.getVec3At(_pos2, end);
         this.velocity = new Vec3();
         Vec3.subtract(this.velocity, _pos1, _pos2);
     }
 }
 
 export class RibbonParticleRenderer extends ParticleRenderer {
     private _defines: MacroRecord = {};
     private declare _dynamicVBO: VFXDynamicBuffer;
     private declare _dynamicIBO: VFXDynamicBuffer;
     private _vertexStreamSize = 0;
     private _vertexAttributeHash = '';
 
     private _particleOrders: Map<number, ParticleOrder[]> = new Map<number, ParticleOrder[]>(); // ribbonID-order
     private _particleSegments: Map<number, Segment[]> = new Map<number, Segment[]>(); // ribbonID-segment
     private _segmentCount = 0;
 
     get name (): string {
         return 'RibbonRenderer';
     }
 
     private _ensureVBO (count: number) { // count is particle count
         this._firstVertex = this._dynamicVBO.usedCount;
         this._dynamicVBO.usedCount += count * 2; // 2 vertices per particle
 
         this._firstIndex = this._dynamicIBO.usedCount;
         this._dynamicIBO.usedCount += count * 3; // 3 indices per particle
     }
 
     private _compileMaterial (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
         let needRecompile = this._isMaterialDirty;
         const define = this._defines;
 
         const hasColor = particles.hasParameter(P_COLOR);
         if (define[CC_VFX_P_COLOR] !== hasColor) {
             define[CC_VFX_P_COLOR] = hasColor;
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
         const define = this._defines;
         const vertexStreamAttributes: Attribute[] = [];
 
         vertexStreamAttributes.push(ribbonPosition);
         this._addAttrib(ribbonPosition);
         vertexStreamSizeDynamic += FormatInfos[ribbonPosition.format].size;
 
         vertexStreamAttributes.push(ribbonSize);
         this._addAttrib(ribbonSize);
         vertexStreamSizeDynamic += FormatInfos[ribbonSize.format].size;
         
         if (define[CC_VFX_P_COLOR]) {
             vertexStreamAttributes.push(ribbonColor);
             this._addAttrib(ribbonColor);
             vertexStreamSizeDynamic += FormatInfos[ribbonColor.format].size;
         }
 
         vertexStreamAttributes.push(ribbonVelocity);
         this._addAttrib(ribbonVelocity);
         vertexStreamSizeDynamic += FormatInfos[ribbonVelocity.format].size;
 
         this._vertexAttributeHash += 'vertex';
         this._vertexStreamSize = vertexStreamSizeDynamic;
         return vertexStreamAttributes;
     }
 
     private clearCollects () {
         this._particleOrders.clear();
         this._particleSegments.clear();
         this._segmentCount = 0;
     }
 
     private collectSegments (particles: ParticleDataSet) {
         const ribbonIds = particles.getUint32ArrayParameter(P_RIBBON_ID);
         const linkOrders = particles.getFloatArrayParameter(P_RIBBON_LINK_ORDER);
         for (let p: Handle = 0; p < particles.count; ++p) {
             const ribbonId: number = ribbonIds.getUint32At(p);
             let target: ParticleOrder[] | undefined = this._particleOrders.get(ribbonId);
             if (!target) {
                 this._particleOrders.set(ribbonId, []);
                 target = this._particleOrders.get(ribbonId);
             }
             const linkOrder: number = linkOrders.getFloatAt(p);
             target?.push(new ParticleOrder(p, linkOrder));
         }
         this._particleOrders.forEach((value , key) =>{
             const orders: ParticleOrder[] = value;
             orders.sort((a, b) => (a.order < b.order ? -1 : 1));
             let target: Segment[] | undefined = this._particleSegments.get(key);
             if (!target) {
                 this._particleSegments.set(key, []);
                 target = this._particleSegments.get(key);
             }
             for (let oi = 0; oi < orders.length; ++oi) {
                 const order1: ParticleOrder = orders[oi];
                 if (oi + 1 < orders.length) {
                     const order2: ParticleOrder = orders[oi + 1];
                     const segment: Segment = new Segment(particles, order1.particle, order2.particle);
                     target?.push(segment);
                     this._segmentCount++;
                 }
             }
         });
     }
 
     private assemble (particles: ParticleDataSet) {
         const define = this._defines;
         this._vertexCount = 0;
         this._indexCount = 0;
         this._ensureVBO(this._segmentCount * 2); // 2 particles per segment
 
         const dynamicBufferFloatView = this._dynamicVBO.floatDataView;
         const dynamicBufferUintView = this._dynamicVBO.uint32DataView;
         const indexView = this._dynamicIBO.uint16DataView;
         const vertDynAttrsFloatCount = this._vertexStreamSize / 4;
         const bufferStart = this._firstVertex * vertDynAttrsFloatCount;
         const indexStart = this._firstIndex;
 
         let vboOffset = bufferStart;
         let iboOffset = indexStart;
         let indexCurr = 0;
 
         const positions = particles.getVec3ArrayParameter(P_POSITION);
         let sizes: FloatArrayParameter | null = null;
         if (particles.hasParameter(P_RIBBON_WIDTH)) {
             sizes = particles.getFloatArrayParameter(P_RIBBON_WIDTH);
         }
         let colors: ColorArrayParameter | null = null;
         if (particles.hasParameter(P_COLOR)) {
             colors = particles.getColorArrayParameter(P_COLOR);
         }
 
         this._particleSegments.forEach((value , key) =>{
             const segments: Segment[] = value;
             
             for (let seg = 0; seg < segments.length; ++seg) {
                 const segment: Segment = segments[seg];
                 const p1: Handle = segment.start;
                 const p2: Handle = segment.end;
 
                 _tmp_velo1.set(segment.velocity);
                 _tmp_velo2.set(segment.velocity);
 
                 if (seg - 1 >= 0) {
                     const prev: Segment = segments[seg - 1];
                     _tmp_velo1.set(_tmp_velo1.x + prev.velocity.x, _tmp_velo1.y + prev.velocity.y, _tmp_velo1.z + prev.velocity.z);
                     _tmp_velo1.multiplyScalar(0.5);
                 }
 
                 if (seg + 1 < segments.length) {
                     const next: Segment = segments[seg + 1];
                     _tmp_velo2.set(_tmp_velo2.x + next.velocity.x, _tmp_velo2.y + next.velocity.y, _tmp_velo2.z + next.velocity.z);
                     _tmp_velo2.multiplyScalar(0.5);
                 }
 
                 // p0
                 // fill position
                 positions.getVec3At(_tmp_pos, p1);
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.z;
                 // fill size
                 let width = 1.0;
                 if (sizes) {
                     width = sizes.getFloatAt(p1);
                 }
                 dynamicBufferFloatView[vboOffset++] = -1.0;
                 dynamicBufferFloatView[vboOffset++] = 1.0;
                 dynamicBufferFloatView[vboOffset++] = width * 0.5;
                 // fill color
                 if (colors) {
                     colors.getColorAt(_tmp_color, p1);
                     dynamicBufferUintView[vboOffset++] = _tmp_color._val;
                 }
                 // fill velocity
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.z;
 
                 // p1
                 // fill position
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.z;
                 // fill size
                 dynamicBufferFloatView[vboOffset++] = 1.0;
                 dynamicBufferFloatView[vboOffset++] = 1.0;
                 dynamicBufferFloatView[vboOffset++] = width * 0.5;
                 // fill color
                 if (colors) {
                     dynamicBufferUintView[vboOffset++] = _tmp_color._val;
                 }
                 // fill velocity
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo1.z;
 
                 // p2
                 // fill position
                 positions.getVec3At(_tmp_pos, p2);
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.z;
                 // fill size
                 if (sizes) {
                     width = sizes.getFloatAt(p2);
                 }
                 dynamicBufferFloatView[vboOffset++] = -1.0;
                 dynamicBufferFloatView[vboOffset++] = -1.0;
                 dynamicBufferFloatView[vboOffset++] = width * 0.5;
                 // fill color
                 if (colors) {
                     colors.getColorAt(_tmp_color, p2);
                     dynamicBufferUintView[vboOffset++] = _tmp_color._val;
                 }
                 // fill velocity
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.z;
 
                 // p3
                 // fill position
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_pos.z;
                 // fill size
                 dynamicBufferFloatView[vboOffset++] = 1.0;
                 dynamicBufferFloatView[vboOffset++] = -1.0;
                 dynamicBufferFloatView[vboOffset++] = width * 0.5;
                 // fill color
                 if (colors) {
                     dynamicBufferUintView[vboOffset++] = _tmp_color._val;
                 }
                 // fill velocity
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.x;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.y;
                 dynamicBufferFloatView[vboOffset++] = _tmp_velo2.z;
 
                 // fill index
                 indexView[iboOffset++] = indexCurr + 0;
                 indexView[iboOffset++] = indexCurr + 1;
                 indexView[iboOffset++] = indexCurr + 2;
                 indexView[iboOffset++] = indexCurr + 2;
                 indexView[iboOffset++] = indexCurr + 3;
                 indexView[iboOffset++] = indexCurr + 1;
                 indexCurr += 4;
 
                 this._vertexCount += 4; // 4 vertices per segment
                 this._indexCount += 6; // 6 indices per segment
             }
         });
     }
 
     public render (particles: ParticleDataSet, emitter: EmitterDataSet) {
         if (!particles.hasParameter(P_POSITION)) {
             console.error('particles without position data');
             return;
         }
         this.clearCollects();
         this.collectSegments(particles);
 
         const material = this.material;
         if (!material) {
             return;
         }
         this._compileMaterial(material, particles, emitter);
         this._updateRenderingSubMesh(material, particles, emitter);
         this._isMaterialDirty = false;
 
         this.assemble(particles);
     }
 
     private _updateRenderingSubMesh (material: Material, particles: ParticleDataSet, emitter: EmitterDataSet) {
         if (!this._renderingSubMesh) {
             const vertexStreamAttributes = this._updateAttributes(material, particles, emitter);
 
             this._dynamicVBO = vfxManager.getOrCreateDynamicBuffer(this._vertexAttributeHash, this._vertexStreamSize, BufferUsageBit.VERTEX | BufferUsageBit.TRANSFER_DST);
             this._dynamicIBO = vfxManager.getOrCreateDynamicBuffer(RIBBON_IBO_HASH, Uint16Array.BYTES_PER_ELEMENT, BufferUsageBit.INDEX | BufferUsageBit.TRANSFER_DST);
 
             this._renderingSubMesh = new RenderingSubMesh([this._dynamicVBO.buffer], vertexStreamAttributes,
                 PrimitiveMode.TRIANGLE_LIST, this._dynamicIBO.buffer);
             
             // no instance
             this._instanceCount = 0;
             this._firstInstance = 0;
         }
     }
 }
 