/**
 * @packageDocumentation
 * @hidden
 */

import spine from '../lib/spine-core.js';
import { IAssembler } from '../../2d/renderer/base';
import { Batcher2D } from '../../2d/renderer/batcher-2d';
import { FrameColor } from '../skeleton-cache';
import { MaterialInstance } from '../../core/renderer';
import { SkeletonTexture } from '../skeleton-texture';
import { vfmtPosUvColor, vfmtPosUvTwoColor } from '../../2d/renderer/vertex-format';
import { Skeleton, SpineMaterialType } from '../skeleton';
import { Color, director, Mat4, Node, Texture2D } from '../../core';
import { BlendFactor } from '../../core/gfx';
import { legacyCC } from '../../core/global-exports';
import { StaticVBAccessor, StaticVBChunk } from '../../2d/renderer/static-vb-accessor';
import { RenderData } from '../../2d/renderer/render-data';

const FLAG_BATCH = 0x10;
const FLAG_TWO_COLOR = 0x01;

let _handleVal = 0x00;
const _quadTriangles = [0, 1, 2, 2, 3, 0];
const _slotColor = new Color(0, 0, 255, 255);
const _boneColor = new Color(255, 0, 0, 255);
const _originColor = new Color(0, 255, 0, 255);
const _meshColor = new Color(255, 255, 0, 255);

const _finalColor: spine.Color = new spine.Color(1, 1, 1, 1);
const _darkColor: spine.Color = new spine.Color(1, 1, 1, 1);
const _tempPos: spine.Vector2 = new spine.Vector2();
const _tempUv: spine.Vector2 = new spine.Vector2();

let _premultipliedAlpha: boolean;
let _multiplier;
let _slotRangeStart: number;
let _slotRangeEnd: number;
let _useTint: boolean;
let _debugSlots: boolean;
let _debugBones: boolean;
let _debugMesh: boolean;
let _nodeR: number;
let _nodeG: number;
let _nodeB: number;
let _nodeA: number;
const _finalColor32: Float32Array = new Float32Array(4);
const _darkColor32: Float32Array = new Float32Array(4);
let _perVertexSize: number;
let _perClipVertexSize: number;

let _vertexFloatCount = 0;
let _vertexCount = 0;
let _vertexOffset = 0;
let _vertexFloatOffset = 0;
let _indexCount = 0;
let _indexOffset = 0;
let _actualVCount = 0;
let _actualICount = 0;
let _tempr: number;
let _tempg: number;
let _tempb: number;
let _inRange: boolean;
let _mustFlush: boolean;
let _x: number;
let _y: number;
let _m00: number;
let _m04: number;
let _m12: number;
let _m01: number;
let _m05: number;
let _m13: number;
let _r: number;
let _g: number;
let _b: number;
let _fr: number;
let _fg: number;
let _fb: number;
let _fa: number;
let _dr: number;
let _dg: number;
let _db: number;
let _da: number;
let _comp: Skeleton | undefined;
let _node: Node | undefined;
let _renderData: RenderData | null;
let _ibuf: Uint16Array;
let _vbuf: Float32Array;
let _needColor: boolean;
let _vertexEffect: spine.VertexEffect | null = null;
let _currentMaterial: MaterialInstance | null = null;
let _currentTexture: Texture2D | null = null;

function _getSlotMaterial (blendMode: spine.BlendMode) {
    let src: BlendFactor;
    let dst: BlendFactor;
    switch (blendMode) {
    case spine.BlendMode.Additive:
        src =  _premultipliedAlpha ? BlendFactor.ONE :  BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE;
        break;
    case spine.BlendMode.Multiply:
        src = BlendFactor.DST_COLOR;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    case spine.BlendMode.Screen:
        src = BlendFactor.ONE;
        dst = BlendFactor.ONE_MINUS_SRC_COLOR;
        break;
    case spine.BlendMode.Normal:
    default:
        src = _premultipliedAlpha ? BlendFactor.ONE : BlendFactor.SRC_ALPHA;
        dst = BlendFactor.ONE_MINUS_SRC_ALPHA;
        break;
    }
    return _comp!.getMaterialForBlendAndTint(src, dst, _useTint ? SpineMaterialType.TWO_COLORED : SpineMaterialType.COLORED_TEXTURED);
}

function _handleColor (color: FrameColor) {
    // temp rgb has multiply 255, so need divide 255;
    _fa = color.fa * _nodeA;
    _multiplier = _premultipliedAlpha ? _fa / 255 :  1;
    _r = _nodeR * _multiplier;
    _g = _nodeG * _multiplier;
    _b = _nodeB * _multiplier;

    _fr = color.fr * _r;
    _fg = color.fg * _g;
    _fb = color.fb * _b;
    _finalColor32[0] = _fr / 255.0;
    _finalColor32[1] = _fg / 255.0;
    _finalColor32[2] = _fb / 255.0;
    _finalColor32[3] = _fa / 255.0;

    _dr = color.dr * _r;
    _dg = color.dg * _g;
    _db = color.db * _b;
    _da =   _premultipliedAlpha ? 255 :  0;
    _darkColor32[0] = _dr / 255.0;
    _darkColor32[1] = _dg / 255.0;
    _darkColor32[2] = _db / 255.0;
    _darkColor32[3] = _da / 255.0;
}

const _tmpColor4 = new Float32Array(4);
function _spineColorToFloat32Array4 (spineColor: spine.Color) {
    _tmpColor4[0] = spineColor.r / 255.0;
    _tmpColor4[1] = spineColor.g / 255.0;
    _tmpColor4[2] = spineColor.b / 255.0;
    _tmpColor4[3] = spineColor.a / 255.0;
    return _tmpColor4;
}

function _vfmtFloatSize (useTint: boolean) {
    return useTint ? 3 + 2 + 4 + 4 : 3 + 2 + 4;
}

let _accessor: StaticVBAccessor = null!;
let _tintAccessor: StaticVBAccessor = null!;

/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const simple: IAssembler = {
    vCount: 32767,
    ensureAccessor (useTint: boolean) {
        let accessor = useTint ? _tintAccessor : _accessor;
        if (!accessor) {
            const device = director.root!.device;
            const batcher = director.root!.batcher2D;
            const attributes = useTint ? vfmtPosUvTwoColor : vfmtPosUvColor;
            if (useTint) {
                accessor = _tintAccessor = new StaticVBAccessor(device, attributes, this.vCount);
                // Register to batcher so that batcher can upload buffers after batching process
                batcher.registerBufferAccessor(Number.parseInt('SPINE_TINT', 36), _tintAccessor);
            } else {
                accessor = _accessor = new StaticVBAccessor(device, attributes, this.vCount);
                // Register to batcher so that batcher can upload buffers after batching process
                batcher.registerBufferAccessor(Number.parseInt('SPINE', 36), _accessor);
            }
        }
        return accessor;
    },

    createData (comp: Skeleton) {
        let rd = comp.renderData;
        if (!rd) {
            const useTint = comp.useTint || comp.isAnimationCached();
            const accessor = this.ensureAccessor(useTint) as StaticVBAccessor;
            const skins = comp._skeleton!.data.skins;
            let vCount = 0;
            let iCount = 0;
            for (let i = 0; i < skins.length; ++i) {
                const attachments = skins[i].attachments;
                for (let j = 0; j < attachments.length; j++) {
                    const entry = attachments[j];
                    for (const key in entry) {
                        const skin = entry[key];
                        if (skin instanceof spine.RegionAttachment) {
                            vCount += 4;
                            iCount += 6;
                        } else if (skin instanceof spine.MeshAttachment) {
                            vCount += skin.worldVerticesLength >> 1;
                            iCount += skin.triangles.length;
                        }
                    }
                }
            }
            rd = RenderData.add(useTint ? vfmtPosUvTwoColor : vfmtPosUvColor, accessor);
            rd.resize(vCount, iCount);
            if (!rd.indices || iCount !== rd.indices.length) {
                rd.indices = new Uint16Array(iCount);
            }
            comp.maxVertexCount = vCount;
            comp.maxIndexCount = iCount;
        }
        return rd;
    },

    updateRenderData (comp: Skeleton, batcher: Batcher2D) {
        _comp = comp;
        const skeleton = comp._skeleton;
        if (!comp.isAnimationCached() && skeleton) {
            skeleton.updateWorldTransform();
        }
        if (skeleton) {
            updateComponentRenderData(comp, batcher);
        }
    },

    updateColor (comp: Skeleton) {
        if (!comp) return;
        _comp = comp;
        _comp.markForUpdateRenderData();
    },

    fillBuffers (comp: Skeleton, renderer: Batcher2D) {
        // Fill indices
    },
};

function updateComponentRenderData (comp: Skeleton, batcher: Batcher2D) {
    if (!comp._skeleton) return;

    const nodeColor = comp.color;
    _nodeR = nodeColor.r / 255;
    _nodeG = nodeColor.g / 255;
    _nodeB = nodeColor.b / 255;
    _nodeA = nodeColor.a / 255;

    _useTint = comp.useTint || comp.isAnimationCached();
    // x y u v color1 color2 or x y u v color
    _perVertexSize = _vfmtFloatSize(_useTint);

    // Reuse draw list
    comp.drawList.reset();
    _comp = comp;
    _node = comp.node;
    _renderData = comp.renderData!;

    _currentMaterial = null;

    _mustFlush = true;
    _premultipliedAlpha = comp.premultipliedAlpha;
    _multiplier = 1.0;
    _handleVal = 0x00;
    _needColor = false;
    _vertexEffect = comp._effectDelegate && comp._effectDelegate._vertexEffect as any;

    if (nodeColor._val !== 0xffffffff ||  _premultipliedAlpha) {
        _needColor = true;
    }

    if (_useTint) {
        _handleVal |= FLAG_TWO_COLOR;
    }

    let worldMat: Mat4 | undefined;
    if (_comp.enableBatch) {
        worldMat = _node.worldMatrix as Mat4;
        _mustFlush = false;
        _handleVal |= FLAG_BATCH;
    }

    if (comp.isAnimationCached()) {
        // Traverse input assembler.
        cacheTraverse(worldMat);
    } else {
        if (_vertexEffect) _vertexEffect.begin(comp._skeleton);
        realTimeTraverse(batcher, worldMat);
        if (_vertexEffect) _vertexEffect.end();
    }
    // Ensure mesh buffer update
    const accessor = _useTint ? _tintAccessor : _accessor;
    accessor.getMeshBuffer(_renderData.chunk.bufferId).setDirty();

    // sync attached node matrix
    comp.attachUtil._syncAttachedNode();

    // Clear temp var.
    _node = undefined;
    _comp = undefined;
    _vertexEffect = null;
}

function updateChunkForClip (clippedVertices: number[], clippedTriangles: number[]) {
    const oldVertexCount = _vertexCount;
    const oldIndexCount = _indexCount;
    const rd = _renderData!;
    _indexCount = clippedTriangles.length;
    _vertexCount = clippedVertices.length / _perClipVertexSize;
    _vertexFloatCount = _vertexCount * _perVertexSize;

    // Augment render data size, clipper could create more triangles than expected
    _actualVCount += _vertexCount - oldVertexCount;
    _actualICount += _indexCount - oldIndexCount;
    const oldIndices = _ibuf;
    const oldChunkOffset = rd.chunk.vertexOffset;
    let updateIBuf = false;
    if (_actualVCount > rd.vertexCount) {
        rd.resizeAndCopy(_actualVCount, _actualICount > rd.indexCount ? _actualICount : rd.indexCount);
        _vbuf = rd.chunk.vb;
        updateIBuf = true;
    }
    if (_actualICount > _ibuf.length) {
        _ibuf = rd.indices = new Uint16Array(_actualICount);
        updateIBuf = true;
    }
    // Vertex buffer chunk have been moved, so need to correct all indices
    if (updateIBuf) {
        const correction = rd.chunk.vertexOffset - oldChunkOffset;
        for (let i = 0; i < _indexOffset; ++i) {
            _ibuf[i] = oldIndices[i] + correction;
        }
    }
}

function fillVertices (skeletonColor: spine.Color,
    attachmentColor: spine.Color,
    slotColor: spine.Color,
    clipper: spine.SkeletonClipping,
    slot: spine.Slot) {
    _finalColor.a = slotColor.a * attachmentColor.a * skeletonColor.a * _nodeA * 255;
    _multiplier =  _premultipliedAlpha ? _finalColor.a : 255;
    _tempr = _nodeR * attachmentColor.r * skeletonColor.r * _multiplier;
    _tempg = _nodeG * attachmentColor.g * skeletonColor.g * _multiplier;
    _tempb = _nodeB * attachmentColor.b * skeletonColor.b * _multiplier;

    _finalColor.r = _tempr * slotColor.r;
    _finalColor.g = _tempg * slotColor.g;
    _finalColor.b = _tempb * slotColor.b;

    if (slot.darkColor == null) {
        _darkColor.set(0.0, 0.0, 0.0, 1.0);
    } else {
        _darkColor.r = slot.darkColor.r * _tempr;
        _darkColor.g = slot.darkColor.g * _tempg;
        _darkColor.b = slot.darkColor.b * _tempb;
    }
    _darkColor.a = _premultipliedAlpha ? 255 : 0;

    if (!clipper.isClipping()) {
        if (_vertexEffect) {
            for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
                _tempPos.x = _vbuf[v];
                _tempPos.y = _vbuf[v + 1];
                _tempUv.x = _vbuf[v + 3];
                _tempUv.y = _vbuf[v + 4];
                _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

                _vbuf[v] = _tempPos.x;        // x
                _vbuf[v + 1] = _tempPos.y;        // y
                _vbuf[v + 3] = _tempUv.x;         // u
                _vbuf[v + 4] = _tempUv.y;         // v

                _vbuf.set(_spineColorToFloat32Array4(_finalColor), v + 5);
                if (_useTint) {
                    _vbuf.set(_spineColorToFloat32Array4(_darkColor), v + 9); // dark color
                }
            }
        } else {
            _finalColor32.set(_spineColorToFloat32Array4(_finalColor));
            _darkColor32.set(_spineColorToFloat32Array4(_darkColor));

            for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount; v < n; v += _perVertexSize) {
                _vbuf.set(_finalColor32, v + 5);          // light color
                if (_useTint) {
                    _vbuf.set(_darkColor32, v + 9);      // dark color
                }
            }
        }
    } else {
        _perClipVertexSize = _useTint ? 12 : 8; // const
        const vertices = _vbuf.subarray(_vertexFloatOffset);
        const uvs = _vbuf.subarray(_vertexFloatOffset + 3);

        clipper.clipTriangles(vertices, _vertexFloatCount,
            _ibuf.subarray(_indexOffset), _indexCount, uvs, _finalColor, _darkColor, _useTint,
            _perVertexSize);
        const clippedVertices = clipper.clippedVertices;
        const clippedTriangles = clipper.clippedTriangles;

        // Update vertex and index count, reallocate vertex buffer chunk if needed
        updateChunkForClip(clippedVertices, clippedTriangles);

        // fill indices
        if (clippedTriangles.length > 0) {
            _ibuf.set(clippedTriangles, _indexOffset);
        }

        // fill vertices contain x y u v light color dark color
        if (_vertexEffect) {
            for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += _perClipVertexSize, offset += _perVertexSize) {
                _tempPos.x = clippedVertices[v];
                _tempPos.y = clippedVertices[v + 1];
                _finalColor.set(clippedVertices[v + 2], clippedVertices[v + 3], clippedVertices[v + 4], clippedVertices[v + 5]);
                _tempUv.x = clippedVertices[v + 6];
                _tempUv.y = clippedVertices[v + 7];
                if (_useTint) {
                    _darkColor.set(clippedVertices[v + 8], clippedVertices[v + 9], clippedVertices[v + 10], clippedVertices[v + 11]);
                } else {
                    _darkColor.set(0, 0, 0, 0);
                }
                _vertexEffect.transform(_tempPos, _tempUv, _finalColor, _darkColor);

                _vbuf[offset] = _tempPos.x;             // x
                _vbuf[offset + 1] = _tempPos.y;         // y
                _vbuf[offset + 3] = _tempUv.x;          // u
                _vbuf[offset + 4] = _tempUv.y;          // v
                _vbuf.set(_spineColorToFloat32Array4(_finalColor), offset + 5);
                if (_useTint) {
                    _vbuf.set(_spineColorToFloat32Array4(_darkColor), offset + 9);
                }
            }
        } else {
            // x y r g b a u v (rr gg bb aa)
            for (let v = 0, n = clippedVertices.length, offset = _vertexFloatOffset; v < n; v += _perClipVertexSize, offset += _perVertexSize) {
                _vbuf[offset] = clippedVertices[v];         // x
                _vbuf[offset + 1] = clippedVertices[v + 1];     // y
                _vbuf[offset + 3] = clippedVertices[v + 6];     // u
                _vbuf[offset + 4] = clippedVertices[v + 7];     // v

                _vbuf[offset + 5] = clippedVertices[v + 2] / 255.0;
                _vbuf[offset + 6] = clippedVertices[v + 3] / 255.0;
                _vbuf[offset + 7] = clippedVertices[v + 4] / 255.0;
                _vbuf[offset + 8] = clippedVertices[v + 5] / 255.0;

                if (_useTint) {
                    _vbuf[offset + 9] = clippedVertices[v + 8] / 255.0;
                    _vbuf[offset + 10] = clippedVertices[v + 9] / 255.0;
                    _vbuf[offset + 11] = clippedVertices[v + 10] / 255.0;
                    _vbuf[offset + 12] = clippedVertices[v + 11] / 255.0;
                }
            }
        }
    }
}

function realTimeTraverse (batcher: Batcher2D, worldMat?: Mat4) {
    const rd = _renderData!;
    _vbuf = rd.chunk.vb;
    _ibuf = rd.indices!;
    _actualVCount = _comp!.maxVertexCount;
    _actualICount = _comp!.maxIndexCount;

    const locSkeleton = _comp!._skeleton!;
    const skeletonColor = locSkeleton.color;
    const graphics = _comp!._debugRenderer!;
    const clipper = _comp!._clipper!;
    let material: MaterialInstance | null = null;
    let attachment: spine.Attachment;
    let uvs: spine.ArrayLike<number>;
    let triangles: number[];
    let isRegion: boolean;
    let isMesh: boolean;
    let isClip: boolean;
    let slot: spine.Slot;

    _slotRangeStart = _comp!._startSlotIndex;
    _slotRangeEnd = _comp!._endSlotIndex;
    _inRange = false;
    if (_slotRangeStart === -1) _inRange = true;

    _debugSlots = _comp!.debugSlots;
    _debugBones = _comp!.debugBones;
    _debugMesh = _comp!.debugMesh;
    if (graphics && (_debugBones || _debugSlots || _debugMesh)) {
        graphics.clear();
        graphics.lineWidth = 5;
    }

    // x y u v r1 g1 b1 a1 r2 g2 b2 a2 or x y u v r g b a
    _perClipVertexSize = 12;

    _vertexFloatCount = 0;
    _vertexOffset = 0;
    _vertexFloatOffset = 0;
    _indexCount = 0;
    _indexOffset = 0;

    let prevDrawIndexOffset = 0;

    for (let slotIdx = 0, slotCount = locSkeleton.drawOrder.length; slotIdx < slotCount; slotIdx++) {
        slot = locSkeleton.drawOrder[slotIdx];

        if (slot === undefined) {
            continue;
        }

        if (_slotRangeStart >= 0 && _slotRangeStart === slot.data.index) {
            _inRange = true;
        }

        if (!_inRange) {
            clipper.clipEndWithSlot(slot);
            continue;
        }

        if (_slotRangeEnd >= 0 && _slotRangeEnd === slot.data.index) {
            _inRange = false;
        }

        _vertexFloatCount = 0;
        _indexCount = 0;

        attachment = slot.getAttachment();
        if (!attachment) {
            clipper.clipEndWithSlot(slot);
            continue;
        }

        isRegion = attachment instanceof spine.RegionAttachment;
        isMesh = attachment instanceof spine.MeshAttachment;
        isClip = attachment instanceof spine.ClippingAttachment;

        if (isClip) {
            clipper.clipStart(slot, attachment as spine.ClippingAttachment);
            continue;
        }

        if (!isRegion && !isMesh) {
            clipper.clipEndWithSlot(slot);
            continue;
        }

        const texture = ((attachment as any).region.texture as SkeletonTexture).getRealTexture();
        material = _getSlotMaterial(slot.data.blendMode);
        if (!material) {
            clipper.clipEndWithSlot(slot);
            continue;
        }

        if (!_currentMaterial) _currentMaterial = material;

        if (_mustFlush || material.hash !== _currentMaterial.hash || (texture && _currentTexture !== texture)) {
            _mustFlush = false;
            const cumulatedCount = _indexOffset - prevDrawIndexOffset;
            // Submit draw data
            if (cumulatedCount > 0) {
                _comp!._requestDrawData(_currentMaterial, _currentTexture!, prevDrawIndexOffset, cumulatedCount);
                prevDrawIndexOffset = _indexOffset;
            }
            _currentTexture = texture;
            _currentMaterial = material;
        }

        if (isRegion) {
            triangles = _quadTriangles;

            _vertexCount = 4;
            _vertexFloatCount = _vertexCount * _perVertexSize;
            _indexCount = 6;

            // compute vertex and fill x y
            (attachment as spine.RegionAttachment).computeWorldVertices(slot.bone, _vbuf, _vertexFloatOffset, _perVertexSize);

            // draw debug slots if enabled graphics
            if (graphics && _debugSlots) {
                graphics.strokeColor = _slotColor;
                graphics.moveTo(_vbuf[_vertexFloatOffset], _vbuf[_vertexFloatOffset + 1]);
                for (let ii = _vertexFloatOffset + _perVertexSize, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
                    graphics.lineTo(_vbuf[ii], _vbuf[ii + 1]);
                }
                graphics.close();
                graphics.stroke();
            }
        } else if (isMesh) {
            const mattachment = attachment as spine.MeshAttachment;
            triangles = mattachment.triangles;

            // insure capacity
            _vertexCount = (mattachment.worldVerticesLength >> 1);
            _vertexFloatCount = _vertexCount * _perVertexSize;
            _indexCount = triangles.length;

            // compute vertex and fill x y
            mattachment.computeWorldVertices(slot, 0, mattachment.worldVerticesLength, _vbuf, _vertexFloatOffset, _perVertexSize);

            // draw debug mesh if enabled graphics
            if (graphics && _debugMesh) {
                graphics.strokeColor = _meshColor;

                for (let ii = 0, nn = triangles.length; ii < nn; ii += 3) {
                    const v1 = triangles[ii] * _perVertexSize + _vertexFloatOffset;
                    const v2 = triangles[ii + 1] * _perVertexSize + _vertexFloatOffset;
                    const v3 = triangles[ii + 2] * _perVertexSize + _vertexFloatOffset;

                    graphics.moveTo(_vbuf[v1], _vbuf[v1 + 1]);
                    graphics.lineTo(_vbuf[v2], _vbuf[v2 + 1]);
                    graphics.lineTo(_vbuf[v3], _vbuf[v3 + 1]);
                    graphics.close();
                    graphics.stroke();
                }
            }
        }

        if (_vertexFloatCount === 0 || _indexCount === 0) {
            clipper.clipEndWithSlot(slot);
            continue;
        }

        const meshAttachment = attachment as spine.MeshAttachment;

        // fill indices
        _ibuf = rd.indices!;
        _ibuf.set(triangles!, _indexOffset);
        // fill u v
        uvs = meshAttachment.uvs;
        for (let v = _vertexFloatOffset, n = _vertexFloatOffset + _vertexFloatCount, u = 0; v < n; v += _perVertexSize, u += 2) {
            _vbuf[v + 3] = uvs[u];           // u
            _vbuf[v + 4] = uvs[u + 1];       // v
        }

        // ATTENTION: This process could change _ibuf and _vbuf reference due to clipping
        fillVertices(skeletonColor, meshAttachment.color, slot.color, clipper, slot);

        if (_indexCount > 0) {
            const chunkOffset = rd.chunk.vertexOffset;
            for (let ii = _indexOffset, nn = _indexOffset + _indexCount; ii < nn; ii++) {
                _ibuf[ii] += _vertexOffset + chunkOffset;
            }

            if (worldMat) {
                _m00 = worldMat.m00;
                _m04 = worldMat.m04;
                _m12 = worldMat.m12;
                _m01 = worldMat.m01;
                _m05 = worldMat.m05;
                _m13 = worldMat.m13;
                for (let ii = _vertexFloatOffset, nn = _vertexFloatOffset + _vertexFloatCount; ii < nn; ii += _perVertexSize) {
                    _x = _vbuf[ii];
                    _y = _vbuf[ii + 1];
                    _vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                    _vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
                }
            }
        }
        _vertexFloatOffset += _vertexFloatCount;
        _vertexOffset += _vertexCount;
        _indexOffset += _indexCount;
        _vertexCount = 0;
        _indexCount = 0;

        clipper.clipEndWithSlot(slot);
    }

    const cumulatedCount = _indexOffset - prevDrawIndexOffset;
    if (_currentTexture && cumulatedCount > 0) {
        _comp!._requestDrawData(_currentMaterial!, _currentTexture, prevDrawIndexOffset, cumulatedCount);
    }

    clipper.clipEnd();

    if (graphics && _debugBones) {
        let bone: spine.Bone;
        graphics.strokeColor = _boneColor;
        graphics.fillColor = _slotColor; // Root bone color is same as slot color.

        for (let i = 0, n = locSkeleton.bones.length; i < n; i++) {
            bone = locSkeleton.bones[i];
            const x = bone.data.length * bone.a + bone.worldX;
            const y = bone.data.length * bone.c + bone.worldY;

            // Bone lengths.
            graphics.moveTo(bone.worldX, bone.worldY);
            graphics.lineTo(x, y);
            graphics.stroke();

            // Bone origins.
            graphics.circle(bone.worldX, bone.worldY, Math.PI * 1.5);
            graphics.fill();
            if (i === 0) {
                graphics.fillColor = _originColor;
            }
        }
    }
}

function cacheTraverse (worldMat?: Mat4) {
    const frame = _comp!._curFrame;
    if (!frame) return;

    const segments = frame.segments;
    if (segments.length === 0) return;

    _perClipVertexSize = 12;
    _vertexFloatOffset = 0;
    _indexCount = 0;
    _vertexOffset = 0;
    _indexOffset = 0;

    let material: MaterialInstance | null = null;
    const vertices = frame.vertices;
    const indices = frame.indices;

    let chunkOffset = 0;
    let frameVFOffset = 0;
    let frameIndexOffset = 0;
    let segVFCount = 0;
    if (worldMat) {
        _m00 = worldMat.m00;
        _m01 = worldMat.m01;
        _m04 = worldMat.m04;
        _m05 = worldMat.m05;
        _m12 = worldMat.m12;
        _m13 = worldMat.m13;
    }

    const justTranslate = _m00 === 1 && _m01 === 0 && _m04 === 0 && _m05 === 1;
    const needBatch = (_handleVal & FLAG_BATCH);
    const calcTranslate = needBatch && justTranslate;

    const colors = frame.colors;
    let colorOffset = 0;
    let nowColor = colors[colorOffset++];
    let maxVFOffset = nowColor.vfOffset;
    _handleColor(nowColor);

    let prevDrawIndexOffset = 0;
    const rd = _renderData!;
    const vbuf = rd.chunk.vb;
    const ibuf = rd.indices!;
    for (let i = 0, n = segments.length; i < n; i++) {
        const segInfo = segments[i];
        material = _getSlotMaterial(segInfo.blendMode!);
        if (!material) continue;
        if (!_currentMaterial) _currentMaterial = material;

        if (_mustFlush || material.hash !== _currentMaterial.hash || (segInfo.tex && segInfo.tex !== _currentTexture)) {
            _mustFlush = false;
            const cumulatedCount = _indexOffset - prevDrawIndexOffset;
            // Submit draw data
            if (cumulatedCount > 0) {
                _comp!._requestDrawData(_currentMaterial, _currentTexture!, prevDrawIndexOffset, cumulatedCount);
                prevDrawIndexOffset = _indexOffset;
            }
            _currentMaterial = material;
            _currentTexture = segInfo.tex!;
        }

        _vertexCount = segInfo.vertexCount;
        _indexCount = segInfo.indexCount;

        // Fill indices
        chunkOffset = rd.chunk.vertexOffset;
        for (let ii = _indexOffset, il = _indexOffset + _indexCount; ii < il; ii++) {
            ibuf[ii] = chunkOffset + _vertexOffset + indices[frameIndexOffset++];
        }

        // Fill vertices
        segVFCount = segInfo.vfCount;
        vbuf.set(vertices.subarray(frameVFOffset, frameVFOffset + segVFCount), frameVFOffset);

        // Update local position to world position
        if (calcTranslate) {
            for (let ii = frameVFOffset, il = frameVFOffset + segVFCount; ii < il; ii += _perVertexSize) {
                vbuf[ii] += _m12;
                vbuf[ii + 1] += _m13;
            }
        } else if (needBatch) {
            for (let ii = frameVFOffset, il = frameVFOffset + segVFCount; ii < il; ii += _perVertexSize) {
                _x = vbuf[ii];
                _y = vbuf[ii + 1];
                vbuf[ii] = _x * _m00 + _y * _m04 + _m12;
                vbuf[ii + 1] = _x * _m01 + _y * _m05 + _m13;
            }
        }

        // Update color
        if (_needColor) {
            // handle color
            // tip: step of frameColorOffset should fix with vertex attributes, (xyzuvrgbargba--xyuvcc)
            let frameColorOffset = frameVFOffset / 13 * 6;
            for (let ii = frameVFOffset, iEnd = frameVFOffset + segVFCount; ii < iEnd; ii += _perVertexSize, frameColorOffset += 6) {
                if (frameColorOffset >= maxVFOffset) {
                    nowColor = colors[colorOffset++];
                    _handleColor(nowColor);
                    maxVFOffset = nowColor.vfOffset;
                }
                vbuf.set(_finalColor32, ii + 5);
                vbuf.set(_darkColor32, ii + 9);
            }
        }

        // Segment increment
        frameVFOffset += segVFCount;
        _vertexOffset += _vertexCount;
        _indexOffset += _indexCount;
        _vertexCount = 0;
        _indexCount = 0;
    }

    const cumulatedCount = _indexOffset - prevDrawIndexOffset;
    if (_currentTexture && cumulatedCount > 0) {
        _comp!._requestDrawData(_currentMaterial!, _currentTexture, prevDrawIndexOffset, cumulatedCount);
    }
}

legacyCC.internal.SpineAssembler = simple;
