/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/
/* eslint @typescript-eslint/no-explicit-any: "off" */
/* eslint @typescript-eslint/no-unsafe-argument: "off" */

import spine from './spine-core.js';
import { js } from '../../core';

function resizeArray (array, newSize): Array<any> {
    if (!array) return new Array(newSize);
    if (newSize === array.length) return array;
    if (newSize < array.length) return array.slice(0, newSize);
    else return new Array(newSize);
}

function overrideDefineArrayProp (prototype: any, getPropVector: any, name: string): void {
    const _name = `_${name}`;
    Object.defineProperty(prototype, name, {
        get (): any[] {
            const vectors = getPropVector.call(this);
            const count = vectors.size();
            let array = this[_name];
            array = resizeArray(array, count);
            for (let i = 0; i < count; i++) array[i] = vectors.get(i);
            this[_name] = array;
            return array;
        },
    });
}

function overrideDefineArrayArrayProp (prototype: any, getPropVector: any, name: string): void {
    const _name = `_${name}`;
    Object.defineProperty(prototype, name, {
        get (): any[] {
            const vectors = getPropVector.call(this);
            const count = vectors.size();
            let array = this[_name];
            array = resizeArray(array, count);
            for (let i = 0; i < count; i++) {
                const vectorI = vectors.get(i);
                const countJ = vectorI.size();
                let arrayJ: any[] = array[i];
                arrayJ = resizeArray(arrayJ, countJ);
                for (let j = 0; j < countJ; j++) arrayJ[j] = vectorI.get(j);
                array[i] = arrayJ;
            }
            this[_name] = array;
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return array;
        },
    });
}

function overrideDefineArrayFunction (prototype: any, getPropVector: any, name: string): void {
    const _name = `_${name}`;
    Object.defineProperty(prototype, name, {
        value () {
            const vectors = getPropVector.call(this);
            const count = vectors.size();
            let array = this[_name];
            array = resizeArray(array, count);
            for (let i = 0; i < count; i++) array[i] = vectors.get(i);
            this[_name] = array;
            return array;
        },
    });
}

function overrideDefinePtrStringFunction (prototype: any, getPtr: any, name: string): void {
    Object.defineProperty(prototype, name, {
        value (): string {
            let str = '';
            const ptr = getPtr.call(this);
            const HEAPU8 = spine.wasmUtil.wasm.HEAPU8;
            const length = this.length;
            const buffer = HEAPU8.subarray(ptr, ptr + length);
            str = String.fromCharCode(...buffer);
            return str;
        },
    });
}

function overrideClass (wasm): void {
    spine.wasmUtil = wasm.SpineWasmUtil;
    spine.wasmUtil.wasm = wasm;
    spine.wasmUtil.spineWasmInit();

    spine.SPVectorFloat = wasm.SPVectorFloat;

    spine.MathUtils = wasm.MathUtils;
    spine.Color = wasm.Color;
    spine.String = wasm.String;
    spine.Vector2 = wasm.Vector2;
    spine.Interpolation = wasm.Interpolation;
    spine.Triangulator = wasm.Triangulator;
    spine.ConstraintData = wasm.ConstraintData;
    spine.IkConstraintData = wasm.IkConstraintData;
    spine.PathConstraintData = wasm.PathConstraintData;
    spine.SkeletonBounds = wasm.SkeletonBounds;
    spine.Event = wasm.Event;
    spine.EventData = wasm.EventData;
    spine.Attachment = wasm.Attachment;
    spine.VertexAttachment = wasm.VertexAttachment;
    spine.BoundingBoxAttachment = wasm.BoundingBoxAttachment;
    spine.ClippingAttachment = wasm.ClippingAttachment;
    spine.MeshAttachment = wasm.MeshAttachment;
    spine.PathAttachment = wasm.PathAttachment;
    spine.PointAttachment = wasm.PointAttachment;
    spine.RegionAttachment = wasm.RegionAttachment;
    spine.AtlasAttachmentLoader = wasm.AtlasAttachmentLoader;
    spine.TextureAtlasPage = wasm.TextureAtlasPage;
    spine.TextureAtlasRegion = wasm.TextureAtlasRegion;
    spine.TextureAtlas = wasm.TextureAtlas;
    spine.PowOut = wasm.PowOut;
    spine.BoneData = wasm.BoneData;
    spine.SlotData = wasm.SlotData;
    spine.Updatable = wasm.Updatable;
    spine.IkConstraint = wasm.IkConstraint;
    spine.PathConstraint = wasm.PathConstraint;
    spine.TransformConstraintData = wasm.TransformConstraintData;
    spine.TransformConstraint = wasm.TransformConstraint;
    spine.Bone = wasm.Bone;
    spine.Slot = wasm.Slot;
    spine.Skin = wasm.Skin;
    spine.SkinEntry = wasm.SkinEntry;
    spine.SkeletonClipping = wasm.SkeletonClipping;
    spine.SkeletonData = wasm.SkeletonData;
    spine.TranslateTimeline = wasm.TranslateTimeline;
    spine.ScaleTimeline = wasm.ScaleTimeline;
    spine.ShearTimeline = wasm.ShearTimeline;
    spine.RotateTimeline = wasm.RotateTimeline;
    spine.ColorTimeline = wasm.ColorTimeline;
    spine.TwoColorTimeline = wasm.TwoColorTimeline;
    spine.AttachmentTimeline = wasm.AttachmentTimeline;
    spine.DeformTimeline = wasm.DeformTimeline;
    spine.EventTimeline = wasm.EventTimeline;
    spine.DrawOrderTimeline = wasm.DrawOrderTimeline;
    spine.IkConstraintTimeline = wasm.IkConstraintTimeline;
    spine.TransformConstraintTimeline = wasm.TransformConstraintTimeline;
    spine.PathConstraintPositionTimeline = wasm.PathConstraintPositionTimeline;
    spine.PathConstraintMixTimeline = wasm.PathConstraintMixTimeline;
    spine.TrackEntry = wasm.TrackEntry;
    spine.AnimationStateData = wasm.AnimationStateData;
    spine.AnimationState = wasm.AnimationState;
    spine.Animation = wasm.Animation;
    spine.EventQueue = wasm.EventQueue;
    //spine.AnimationStateListener = wasm.AnimationStateListener;
    spine.AnimationStateAdapter = wasm.AnimationStateAdapter;
    spine.Skeleton = wasm.Skeleton;
    spine.SkeletonBinary = wasm.SkeletonBinary;
    spine.SkeletonJson = wasm.SkeletonJson;
    spine.VertexEffect = wasm.VertexEffect;
    spine.JitterEffect = wasm.JitterEffect;
    spine.SwirlEffect = wasm.SwirlEffect;

    spine.SkeletonInstance = wasm.SkeletonInstance;
    spine.SkeletonSystem = wasm.SkeletonSystem;
}

function overrideProperty_String (): void {
    const prototype = spine.String.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'length',
            getter: prototype.length,
        },
        {
            proto: prototype,
            property: 'isEmpty',
            getter: prototype.isEmpty,
        },
        {
            proto: prototype,
            property: 'str',
            getter: prototype.str,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.get(prop.proto, prop.property, prop.getter);
    });
    overrideDefinePtrStringFunction(prototype, prototype.strPtr, 'strPtr');
}

function overrideProperty_Vector2 (): void {
    const prototype = spine.Vector2.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.get(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_BoneData (): void {
    const prototype = spine.BoneData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'index',
            getter: prototype.getIndex,
        },
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'parent',
            getter: prototype.getParent,
        },
        {
            proto: prototype,
            property: 'length',
            getter: prototype.getLength,
            setter: prototype.setLength,
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
            setter: prototype.setRotation,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
            setter: prototype.setScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
            setter: prototype.setScaleY,
        },
        {
            proto: prototype,
            property: 'shearX',
            getter: prototype.getShearX,
            setter: prototype.setShearX,
        },
        {
            proto: prototype,
            property: 'shearY',
            getter: prototype.getShearY,
            setter: prototype.setShearY,
        },
        {
            proto: prototype,
            property: 'transformMode',
            getter: prototype.getTransformMode,
            setter: prototype.setTransformMode,
        },
        {
            proto: prototype,
            property: 'skinRequired',
            getter: prototype.getSkinRequired,
            setter: prototype.setSkinRequired,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_Attachment (): void {
    const prototype = spine.Attachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
    ];
    propertyPolyfills.forEach((prop) => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_ConstraintData (): void {
    const prototype = spine.ConstraintData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'order',
            getter: prototype.getOrder,
            setter: prototype.setOder,
        },
        {
            proto: prototype,
            property: 'skinRequired',
            getter: prototype.getSkinRequired,
            setter: prototype.setSkinRequired,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_IkConstraintData (): void {
    const prototype = spine.IkConstraintData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
            setter: prototype.setTarget,
        },
        {
            proto: prototype,
            property: 'bendDirection',
            getter: prototype.getBendDirection,
            setter: prototype.setBendDirection,
        },
        {
            proto: prototype,
            property: 'compress',
            getter: prototype.getCompress,
            setter: prototype.setCompress,
        },
        {
            proto: prototype,
            property: 'stretch',
            getter: prototype.getStretch,
            setter: prototype.setStretch,
        },
        {
            proto: prototype,
            property: 'uniform',
            getter: prototype.getUniform,
            setter: prototype.setUniform,
        },
        {
            proto: prototype,
            property: 'mix',
            getter: prototype.getMix,
            setter: prototype.setMix,
        },
        {
            proto: prototype,
            property: 'softness',
            getter: prototype.getSoftness,
            setter: prototype.setSoftness,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_PathConstraintData (): void {
    const prototype = spine.PathConstraintData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
            setter: prototype.setTarget,
        },
        {
            proto: prototype,
            property: 'positionMode',
            getter: prototype.getPositionMode,
            setter: prototype.setPositionMode,
        },
        {
            proto: prototype,
            property: 'spacingMode',
            getter: prototype.getSpacingMode,
            setter: prototype.setSpacingMode,
        },
        {
            proto: prototype,
            property: 'rotateMode',
            getter: prototype.getRotateMode,
            setter: prototype.setRotateMode,
        },
        {
            proto: prototype,
            property: 'offsetRotation',
            getter: prototype.getOffsetRotation,
            setter: prototype.setOffsetRotation,
        },
        {
            proto: prototype,
            property: 'position',
            getter: prototype.getPosition,
            setter: prototype.setPosition,
        },
        {
            proto: prototype,
            property: 'spacing',
            getter: prototype.getSpacing,
            setter: prototype.setSpacing,
        },
        {
            proto: prototype,
            property: 'rotateMix',
            getter: prototype.getRotateMix,
            setter: prototype.setRotateMix,
        },
        {
            proto: prototype,
            property: 'translateMix',
            getter: prototype.getTranslateMix,
            setter: prototype.setTranslateMix,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_Event (): void {
    const prototype = spine.Event.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'intValue',
            getter: prototype.getIntValue,
            setter: prototype.setIntValue,
        },
        {
            proto: prototype,
            property: 'floatValue',
            getter: prototype.getFloatValue,
            setter: prototype.setFloatValue,
        },
        {
            proto: prototype,
            property: 'stringValue',
            getter: prototype.getStringValue,
            setter: prototype.setStringValue,
        },
        {
            proto: prototype,
            property: 'time',
            getter: prototype.getTime,
        },
        {
            proto: prototype,
            property: 'volume',
            getter: prototype.getVolume,
            setter: prototype.setVolume,
        },
        {
            proto: prototype,
            property: 'balance',
            getter: prototype.getBalance,
            setter: prototype.setBalance,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_EventData (): void {
    const prototype = spine.EventData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'intValue',
            getter: prototype.getIntValue,
            setter: prototype.setIntValue,
        },
        {
            proto: prototype,
            property: 'floatValue',
            getter: prototype.getFloatValue,
            setter: prototype.setFloatValue,
        },
        {
            proto: prototype,
            property: 'stringValue',
            getter: prototype.getStringValue,
            setter: prototype.setStringValue,
        },
        {
            proto: prototype,
            property: 'audioPath',
            getter: prototype.getAudioPath,
            setter: prototype.setAudioPath,
        },
        {
            proto: prototype,
            property: 'volume',
            getter: prototype.getVolume,
            setter: prototype.setVolume,
        },
        {
            proto: prototype,
            property: 'balance',
            getter: prototype.getBalance,
            setter: prototype.setBalance,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_VertexAttachment (): void {
    const prototype = spine.VertexAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'id',
            getter: prototype.getId,
        },
        {
            proto: prototype,
            property: 'worldVerticesLength',
            getter: prototype.getWorldVerticesLength,
            setter: prototype.setWorldVerticesLength,
        },
        {
            proto: prototype,
            property: 'deformAttachment',
            getter: prototype.getDeformAttachment,
            setter: prototype.setDeformAttachment,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
    overrideDefineArrayProp(prototype, prototype.getVertices, 'vertices');
    const originComputeWorldVertices = prototype.computeWorldVertices;
    const vectors = new spine.SPVectorFloat();
    Object.defineProperty(prototype, 'computeWorldVertices', {
        value (slot: spine.Slot, start: number, count: number, worldVertices: number[], offset: number, stride: number) {
            const length = worldVertices.length;
            vectors.resize(length, 0);
            for (let i = 0; i < length; i++) vectors.set(i, worldVertices[i]);
            originComputeWorldVertices.call(this, slot, start, count, vectors, offset, stride);
            for (let i = 0; i < length; i++) worldVertices[i] = vectors.get(i);
        },
    });
}

function overrideProperty_BoundingBoxAttachment (): void {
    const prototype = spine.BoundingBoxAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_ClippingAttachment (): void {
    const prototype = spine.ClippingAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'endSlot',
            getter: prototype.getEndSlot,
            setter: prototype.setEndSlot,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_MeshAttachment (): void {
    const prototype = spine.MeshAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'path',
            getter: prototype.getPath,
            setter: prototype.setPath,
        },
        {
            proto: prototype,
            property: 'color',
            getter: prototype.getColor,
        },
        {
            proto: prototype,
            property: 'width',
            getter: prototype.getWidth,
            setter: prototype.setWidth,
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
            setter: prototype.setHeight,
        },
        {
            proto: prototype,
            property: 'hullLength',
            getter: prototype.getHullLength,
            setter: prototype.setHullLength,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getRegionUVs, 'regionUVs');
    overrideDefineArrayProp(prototype, prototype.getUVs, 'uvs');
    overrideDefineArrayProp(prototype, prototype.getTriangles, 'triangles');
    overrideDefineArrayProp(prototype, prototype.getEdges, 'edges');
}

function overrideProperty_PathAttachment (): void {
    const prototype = spine.PathAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'closed',
            getter: prototype.getClosed,
            setter: prototype.setClosed,
        },
        {
            proto: prototype,
            property: 'constantSpeed',
            getter: prototype.getConstantSpeed,
            setter: prototype.setConstantSpeed,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getLengths, 'lengths');
}

function overrideProperty_PointAttachment (): void {
    const prototype = spine.PointAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
            setter: prototype.setRotation,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_RegionAttachment (): void {
    const prototype = spine.RegionAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
            setter: prototype.setScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
            setter: prototype.setScaleY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
            setter: prototype.setRotation,
        },
        {
            proto: prototype,
            property: 'width',
            getter: prototype.getWidth,
            setter: prototype.setWidth,
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
            setter: prototype.setHeight,
        },
        {
            proto: prototype,
            property: 'color',
            getter: prototype.getColor,
        },
        {
            proto: prototype,
            property: 'path',
            getter: prototype.getPath,
            setter: prototype.setPath,
        },
        {
            proto: prototype,
            property: 'rendererObject',
            getter: prototype.getRendererObject,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });

    overrideDefineArrayProp(prototype, prototype.getOffset, 'offset');
    const getUVs = prototype.getUVs;
    const setUVs = prototype.setUVs;
    const _uvs = '_uvs';
    Object.defineProperty(prototype, 'uvs', {
        get (): any {
            const vectors = getUVs.call(this);
            const count = vectors.size();
            let array = prototype[_uvs];
            array = resizeArray(array, count);
            for (let i = 0; i < count; i++) array[i] = vectors.get(i);
            prototype[_uvs] = array;
            return array;
        },
        set (value: number[]) {
            setUVs.call(this, value[0], value[1], value[2], value[3], value[4] === 1);
        },
    });

    const originComputeWorldVertices = prototype.computeWorldVertices;
    const vectors = new spine.SPVectorFloat();
    Object.defineProperty(prototype, 'computeWorldVertices', {
        value (bone: spine.Bone, worldVertices: number[], offset: number, stride: number) {
            const length = worldVertices.length;
            vectors.resize(length, 0);
            for (let i = 0; i < length; i++) vectors.set(i, worldVertices[i]);
            originComputeWorldVertices.call(this, bone, vectors, offset, stride);
            for (let i = 0; i < length; i++) worldVertices[i] = vectors.get(i);
        },
    });
}

function overrideProperty_TextureAtlas (): void {
    // const prototype = spine.TextureAtlas.prototype as any;
    // const propertyPolyfills = [
    //     {
    //         proto: prototype,
    //         property: 'pages',
    //         getter: prototype.getProp_pages,
    //     },
    //     {
    //         proto: prototype,
    //         property: 'regions',
    //         getter: prototype.getProp_regions,
    //     },
    // ];
    // propertyPolyfills.forEach((prop) => {
    //     js.getset(prop.proto, prop.property, prop.getter);
    // });
}

function overrideProperty_SlotData (): void {
    const prototype = spine.SlotData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'index',
            getter: prototype.getIndex,
        },
        {
            proto: prototype,
            property: 'boneData',
            getter: prototype.getBoneData,
        },
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'color',
            getter: prototype.getColor,
        },
        {
            proto: prototype,
            property: 'darkColor',
            getter: prototype.getDarkColor,
        },
        {
            proto: prototype,
            property: 'blendMode',
            getter: prototype.getBlendMode,
            setter: prototype.setBlendMode,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_IkConstraint (): void {
    const prototype = spine.IkConstraint.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
            setter: prototype.setTarget,
        },
        {
            proto: prototype,
            property: 'bendDirection',
            getter: prototype.getBendDirection,
            setter: prototype.setBendDirection,
        },
        {
            proto: prototype,
            property: 'compress',
            getter: prototype.getCompress,
            setter: prototype.setCompress,
        },
        {
            proto: prototype,
            property: 'stretch',
            getter: prototype.getStretch,
            setter: prototype.setStretch,
        },
        {
            proto: prototype,
            property: 'mix',
            getter: prototype.getMix,
            setter: prototype.setMix,
        },
        {
            proto: prototype,
            property: 'softness',
            getter: prototype.getSoftness,
            setter: prototype.setSoftness,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
            setter: prototype.setActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_PathConstraint (): void {
    const prototype = spine.PathConstraint.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
            setter: prototype.setTarget,
        },
        {
            proto: prototype,
            property: 'position',
            getter: prototype.getPosition,
            setter: prototype.setPosition,
        },
        {
            proto: prototype,
            property: 'spacing',
            getter: prototype.getSpacing,
            setter: prototype.setSpacing,
        },
        {
            proto: prototype,
            property: 'rotateMix',
            getter: prototype.getRotateMix,
            setter: prototype.setRotateMix,
        },
        {
            proto: prototype,
            property: 'translateMix',
            getter: prototype.getTranslateMix,
            setter: prototype.setTranslateMix,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
            setter: prototype.setActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_TransformConstraintData (): void {
    const prototype = spine.TransformConstraintData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
        },
        {
            proto: prototype,
            property: 'rotateMix',
            getter: prototype.getRotateMix,
        },
        {
            proto: prototype,
            property: 'translateMix',
            getter: prototype.getTranslateMix,
        },
        {
            proto: prototype,
            property: 'scaleMix',
            getter: prototype.getScaleMix,
        },
        {
            proto: prototype,
            property: 'shearMix',
            getter: prototype.getShearMix,
        },
        {
            proto: prototype,
            property: 'offsetRotation',
            getter: prototype.getOffsetRotation,
        },
        {
            proto: prototype,
            property: 'offsetX',
            getter: prototype.getOffsetX,
        },
        {
            proto: prototype,
            property: 'offsetY',
            getter: prototype.getOffsetY,
        },
        {
            proto: prototype,
            property: 'offsetScaleX',
            getter: prototype.getOffsetScaleX,
        },
        {
            proto: prototype,
            property: 'offsetScaleY',
            getter: prototype.getOffsetScaleY,
        },
        {
            proto: prototype,
            property: 'offsetShearY',
            getter: prototype.getOffsetShearY,
        },
        {
            proto: prototype,
            property: 'relative',
            getter: prototype.getRelative,
        },
        {
            proto: prototype,
            property: 'local',
            getter: prototype.getLocal,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_TransformConstraint (): void {
    const prototype = spine.TransformConstraint.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'target',
            getter: prototype.getTarget,
        },
        {
            proto: prototype,
            property: 'rotateMix',
            getter: prototype.getRotateMix,
            setter: prototype.setRotateMix,
        },
        {
            proto: prototype,
            property: 'translateMix',
            getter: prototype.getTranslateMix,
            setter: prototype.setTranslateMix,
        },
        {
            proto: prototype,
            property: 'scaleMix',
            getter: prototype.getScaleMix,
            setter: prototype.setScaleMix,
        },
        {
            proto: prototype,
            property: 'shearMix',
            getter: prototype.getShearMix,
            setter: prototype.setShearMix,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
            setter: prototype.setActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
}

function overrideProperty_Bone (): void {
    const prototype = spine.Bone.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'skeleton',
            getter: prototype.getSkeleton,
        },
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'parent',
            getter: prototype.getParent,
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
            setter: prototype.setRotation,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
            setter: prototype.setScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
            setter: prototype.setScaleY,
        },
        {
            proto: prototype,
            property: 'shearX',
            getter: prototype.getShearX,
            setter: prototype.setShearX,
        },
        {
            proto: prototype,
            property: 'shearY',
            getter: prototype.getShearY,
            setter: prototype.setShearY,
        },
        {
            proto: prototype,
            property: 'ax',
            getter: prototype.getAX,
            setter: prototype.setAX,
        },
        {
            proto: prototype,
            property: 'ay',
            getter: prototype.getAY,
            setter: prototype.setAY,
        },
        {
            proto: prototype,
            property: 'arotation',
            getter: prototype.getARotation,
            setter: prototype.setARotation,
        },
        {
            proto: prototype,
            property: 'ascaleX',
            getter: prototype.getAScaleX,
            setter: prototype.setAScaleX,
        },
        {
            proto: prototype,
            property: 'ascaleY',
            getter: prototype.getAScaleY,
            setter: prototype.setAScaleY,
        },
        {
            proto: prototype,
            property: 'ashearX',
            getter: prototype.getAShearX,
            setter: prototype.setAShearX,
        },
        {
            proto: prototype,
            property: 'ashearY',
            getter: prototype.getAShearY,
            setter: prototype.setAShearY,
        },
        {
            proto: prototype,
            property: 'appliedValid',
            getter: prototype.getAppliedValid,
            setter: prototype.setAppliedValid,
        },
        {
            proto: prototype,
            property: 'a',
            getter: prototype.getA,
            setter: prototype.setA,
        },
        {
            proto: prototype,
            property: 'b',
            getter: prototype.getB,
            setter: prototype.setB,
        },
        {
            proto: prototype,
            property: 'c',
            getter: prototype.getC,
            setter: prototype.setC,
        },
        {
            proto: prototype,
            property: 'd',
            getter: prototype.getD,
            setter: prototype.setD,
        },
        {
            proto: prototype,
            property: 'worldX',
            getter: prototype.getWorldX,
            setter: prototype.setWorldX,
        },
        {
            proto: prototype,
            property: 'worldY',
            getter: prototype.getWorldY,
            setter: prototype.setWorldY,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
            setter: prototype.setActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getChildren, 'children');
}

function overrideProperty_Slot (): void {
    const prototype = spine.Slot.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'bone',
            getter: prototype.getBone,
        },
        {
            proto: prototype,
            property: 'color',
            getter: prototype.getColor,
        },
        {
            proto: prototype,
            property: 'darkColor',
            getter: prototype.getDarkColor,
        },
        {
            proto: prototype,
            property: 'skeleton',
            getter: prototype.getSkeleton,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getDeform, 'deform');
}

function overrideProperty_Skin (): void {
    const prototype = spine.Skin.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
    overrideDefineArrayProp(prototype, prototype.getAttachments, 'attachments');
    overrideDefineArrayProp(prototype, prototype.getConstraints, 'constraints');
    overrideDefineArrayFunction(prototype, prototype.getAttachments, 'getAttachments');
    const originGetAttachmentsForSlot = prototype.getAttachmentsForSlot;
    Object.defineProperty(prototype, 'getAttachmentsForSlot', {
        value (slotIndex: number, attachments: Array<spine.SkinEntry>) {
            const vectors = originGetAttachmentsForSlot.call(this, slotIndex);
            const count = vectors.size();
            attachments = resizeArray(attachments, count);
            for (let i = 0; i < count; i++) attachments[i] = vectors.get(i);
            vectors.delete();
        },
    });
    const originFindNamesForSlot = prototype.findNamesForSlot;
    Object.defineProperty(prototype, 'findNamesForSlot', {
        value (slotIndex: number, names: Array<string>) {
            const vectors = originFindNamesForSlot.call(this, slotIndex);
            const count = vectors.size();
            names = resizeArray(names, count);
            for (let i = 0; i < count; i++) names[i] = vectors.get(i);
            vectors.delete();
        },
    });
}

function overrideProperty_SkinEntry (): void {
    const prototype = spine.SkinEntry.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'attachment',
            getter: prototype.getAttachment,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_SkeletonClipping (): void {
    const prototype = spine.SkeletonClipping.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'clippedVertices',
            getter: prototype.getClippedVertices,
        },
        {
            proto: prototype,
            property: 'clippedTriangles',
            getter: prototype.getClippedTriangles,
        },
        {
            proto: prototype,
            property: 'clippedUVs',
            getter: prototype.getClippedUVs,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_SkeletonData (): void {
    const prototype = spine.SkeletonData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'defaultSkin',
            getter: prototype.getDefaultSkin,
            setter: prototype.setDefaultSkin,
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
        {
            proto: prototype,
            property: 'width',
            getter: prototype.getWidth,
            setter: prototype.setWidth,
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
            setter: prototype.setHeight,
        },
        {
            proto: prototype,
            property: 'version',
            getter: prototype.getVersion,
            setter: prototype.setVersion,
        },
        {
            proto: prototype,
            property: 'hash',
            getter: prototype.getHash,
            setter: prototype.setHash,
        },
        {
            proto: prototype,
            property: 'fps',
            getter: prototype.getFps,
            setter: prototype.setFps,
        },
        {
            proto: prototype,
            property: 'imagesPath',
            getter: prototype.getImagesPath,
            setter: prototype.setImagesPath,
        },
        {
            proto: prototype,
            property: 'audioPath',
            getter: prototype.getAudioPath,
            setter: prototype.setAudioPath,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });

    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
    overrideDefineArrayProp(prototype, prototype.getSlots, 'slots');
    overrideDefineArrayProp(prototype, prototype.getSkins, 'skins');
    overrideDefineArrayProp(prototype, prototype.getAnimations, 'animations');
    overrideDefineArrayProp(prototype, prototype.getEvents, 'events');
    overrideDefineArrayProp(prototype, prototype.getIkConstraints, 'ikConstraints');
    overrideDefineArrayProp(prototype, prototype.getTransformConstraints, 'transformConstraints');
    overrideDefineArrayProp(prototype, prototype.getPathConstraints, 'pathConstraints');
}

function overrideProperty_RotateTimeline (): void {
    const prototype = spine.RotateTimeline.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'boneIndex',
            getter: prototype.getBoneIndex,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
}

function overrideProperty_ColorTimeline (): void {
    const prototype = spine.ColorTimeline.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'slotIndex',
            getter: prototype.getSlotIndex,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
}

function overrideProperty_TwoColorTimeline (): void {
    const prototype = spine.TwoColorTimeline.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'slotIndex',
            getter: prototype.getSlotIndex,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_AttachmentTimeline (): void {
    const prototype = spine.AttachmentTimeline.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'slotIndex',
            getter: prototype.getSlotIndex,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
    overrideDefineArrayProp(prototype, prototype.getAttachmentNames, 'attachmentNames');
}

function overrideProperty_DeformTimeline (): void {
    const prototype = spine.DeformTimeline.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'slotIndex',
            getter: prototype.getSlotIndex,
        },
        {
            proto: prototype,
            property: 'attachment',
            getter: prototype.getAttachment,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
    overrideDefineArrayArrayProp(prototype, prototype.getFrameVertices, 'frameVertices');
}

function overrideProperty_EventTimeline (): void {
    const prototype = spine.EventTimeline.prototype as any;
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
    overrideDefineArrayProp(prototype, prototype.getEvents, 'events');
}

function overrideProperty_DrawOrderTimeline (): void {
    const prototype = spine.DrawOrderTimeline.prototype as any;
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
}

function overrideProperty_TrackEntry (): void {
    const prototype = spine.TrackEntry.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'animation',
            getter: prototype.getAnimation,
        },
        {
            proto: prototype,
            property: 'next',
            getter: prototype.getNext,
        },
        {
            proto: prototype,
            property: 'mixingFrom',
            getter: prototype.getMixingFrom,
        },
        {
            proto: prototype,
            property: 'mixingTo',
            getter: prototype.getMixingTo,
        },
        {
            proto: prototype,
            property: 'trackIndex',
            getter: prototype.getTrackIndex,
        },
        {
            proto: prototype,
            property: 'loop',
            getter: prototype.getLoop,
            setter: prototype.setLoop,
        },
        {
            proto: prototype,
            property: 'holdPrevious',
            getter: prototype.getHoldPrevious,
            setter: prototype.setHoldPrevious,
        },
        {
            proto: prototype,
            property: 'eventThreshold',
            getter: prototype.getEventThreshold,
            setter: prototype.setEventThreshold,
        },
        {
            proto: prototype,
            property: 'attachmentThreshold',
            getter: prototype.getAttachmentThreshold,
            setter: prototype.setAttachmentThreshold,
        },
        {
            proto: prototype,
            property: 'drawOrderThreshold',
            getter: prototype.getDrawOrderThreshold,
            setter: prototype.setDrawOrderThreshold,
        },
        {
            proto: prototype,
            property: 'animationStart',
            getter: prototype.getAnimationStart,
            setter: prototype.setAnimationStart,
        },
        {
            proto: prototype,
            property: 'animationEnd',
            getter: prototype.getAnimationEnd,
            setter: prototype.setAnimationEnd,
        },
        {
            proto: prototype,
            property: 'animationLast',
            getter: prototype.getAnimationLast,
            setter: prototype.setAnimationLast,
        },
        {
            proto: prototype,
            property: 'delay',
            getter: prototype.getDelay,
            setter: prototype.setDelay,
        },
        {
            proto: prototype,
            property: 'trackTime',
            getter: prototype.getTrackTime,
            setter: prototype.setTrackTime,
        },
        {
            proto: prototype,
            property: 'trackEnd',
            getter: prototype.getTrackEnd,
            setter: prototype.setTrackEnd,
        },
        {
            proto: prototype,
            property: 'timeScale',
            getter: prototype.getTimeScale,
            setter: prototype.setTimeScale,
        },
        {
            proto: prototype,
            property: 'alpha',
            getter: prototype.getAlpha,
            setter: prototype.setAlpha,
        },
        {
            proto: prototype,
            property: 'mixTime',
            getter: prototype.getMixTime,
            setter: prototype.setMixTime,
        },
        {
            proto: prototype,
            property: 'mixDuration',
            getter: prototype.getMixDuration,
            setter: prototype.setMixDuration,
        },
        {
            proto: prototype,
            property: 'mixBlend',
            getter: prototype.getMixBlend,
            setter: prototype.setMixBlend,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_AnimationStateData (): void {
    const prototype = spine.AnimationStateData.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'defaultMix',
            getter: prototype.getDefaultMix,
        },
        {
            proto: prototype,
            property: 'skeletonData',
            getter: prototype.getSkeletonData,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_AnimationState (): void {
    const prototype = spine.AnimationState.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'timeScale',
            getter: prototype.getTimeScale,
            setter: prototype.setTimeScale,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });

    overrideDefineArrayProp(prototype, prototype.getTracks, 'tracks');
}

function overrideProperty_Animation (): void {
    const prototype = spine.Animation.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'duration',
            getter: prototype.getDuration,
            setter: prototype.setDuration,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
    overrideDefineArrayProp(prototype, prototype.getTimelines, 'timelines');
}

function overrideProperty_Skeleton (): void {
    const prototype = spine.Skeleton.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'data',
            getter: prototype.getData,
        },
        {
            proto: prototype,
            property: 'skin',
            getter: prototype.getSkin,
        },
        {
            proto: prototype,
            property: 'color',
            getter: prototype.getColor,
        },
        {
            proto: prototype,
            property: 'time',
            getter: prototype.getTime,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
            setter: prototype.setScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
            setter: prototype.setScaleY,
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
            setter: prototype.setX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
            setter: prototype.setY,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });

    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
    overrideDefineArrayProp(prototype, prototype.getSlots, 'slots');
    overrideDefineArrayProp(prototype, prototype.getDrawOrder, 'drawOrder');
    overrideDefineArrayProp(prototype, prototype.getIkConstraints, 'ikConstraints');
    overrideDefineArrayProp(prototype, prototype.getTransformConstraints, 'transformConstraints');
    overrideDefineArrayProp(prototype, prototype.getPathConstraints, 'pathConstraints');
    overrideDefineArrayProp(prototype, prototype.getUpdateCacheList, '_updateCache');
}

function overrideProperty_JitterEffect (): void {
    const prototype = spine.JitterEffect.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'jitterX',
            getter: prototype.getJitterX,
            setter: prototype.setJitterX,
        },
        {
            proto: prototype,
            property: 'jitterY',
            getter: prototype.getJitterY,
            setter: prototype.setJitterY,
        },
    ];
    propertyPolyfills.forEach((prop) => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

function overrideProperty_SwirlEffect (): void {
    const prototype = spine.SwirlEffect.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'centerX',
            getter: prototype.getCenterX,
            setter: prototype.setCenterX,
        },
        {
            proto: prototype,
            property: 'centerY',
            getter: prototype.getCenterY,
            setter: prototype.setCenterY,
        },
        {
            proto: prototype,
            property: 'radius',
            getter: prototype.getRadius,
            setter: prototype.setRadius,
        },
        {
            proto: prototype,
            property: 'angle',
            getter: prototype.getAngle,
            setter: prototype.setAngle,
        },
    ];
    propertyPolyfills.forEach((prop) => {
        js.getset(prop.proto, prop.property, prop.getter, prop.setter);
    });
}

export function overrideSpineDefine (wasm): void {
    overrideClass(wasm);
    overrideProperty_String();
    overrideProperty_Vector2();
    overrideProperty_BoneData();
    overrideProperty_ConstraintData();
    overrideProperty_IkConstraintData();
    overrideProperty_PathConstraintData();
    overrideProperty_Event();
    overrideProperty_EventData();
    overrideProperty_BoundingBoxAttachment();
    overrideProperty_ClippingAttachment();
    overrideProperty_MeshAttachment();
    overrideProperty_PathAttachment();
    overrideProperty_PointAttachment();
    overrideProperty_RegionAttachment();
    overrideProperty_VertexAttachment();
    overrideProperty_TextureAtlas();
    overrideProperty_SlotData();
    overrideProperty_IkConstraint();
    overrideProperty_PathConstraint();
    overrideProperty_TransformConstraintData();
    overrideProperty_TransformConstraint();
    overrideProperty_Bone();
    overrideProperty_Slot();
    overrideProperty_Skin();
    overrideProperty_Attachment();
    overrideProperty_SkinEntry();
    overrideProperty_SkeletonClipping();
    overrideProperty_SkeletonData();
    overrideProperty_RotateTimeline();
    overrideProperty_ColorTimeline();
    overrideProperty_TwoColorTimeline();
    overrideProperty_AttachmentTimeline();
    overrideProperty_DeformTimeline();
    overrideProperty_EventTimeline();
    overrideProperty_DrawOrderTimeline();
    overrideProperty_TrackEntry();
    overrideProperty_AnimationStateData();
    overrideProperty_AnimationState();
    overrideProperty_Animation();
    overrideProperty_Skeleton();
    overrideProperty_JitterEffect();
    overrideProperty_SwirlEffect();
}
