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

import spine from './spine-core.js';
import { js } from '../../core';

function overrideDefineArrayProp (prototype, getPropVector, name): void {
    Object.defineProperty(prototype, name, {
        get (): any[] {
            const array: any[] = [];
            const vectors = getPropVector.call(this);
            const count = vectors.size();
            for (let i = 0; i < count; i++) {
                const objPtr = vectors.get(i);
                array.push(objPtr);
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return array;
        },
    });
}

function overrideClass (wasm): void {
    spine.wasmUtil = wasm.SpineWasmUtil;
    spine.wasmUtil.wasm = wasm;
    spine.wasmUtil.spineWasmInit();

    spine.MathUtils = wasm.MathUtils;
    spine.Color = wasm.Color;
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
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
        },
        {
            proto: prototype,
            property: 'shearX',
            getter: prototype.getShearX,
        },
        {
            proto: prototype,
            property: 'shearY',
            getter: prototype.getShearY,
        },
        {
            proto: prototype,
            property: 'transformMode',
            getter: prototype.getTransformMode,
        },
        {
            proto: prototype,
            property: 'skinRequired',
            getter: prototype.getSkinRequired,
        },
        // {
        //     proto: spine.BoneData.prototype,
        //     property: 'color',
        //     getter: spine.BoneData.prototype.getProp_color,
        // },
    ];
    propertyPolyfills.forEach((prop): void => {
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
        },
        {
            proto: prototype,
            property: 'bendDirection',
            getter: prototype.getBendDirection,
        },
        {
            proto: prototype,
            property: 'compress',
            getter: prototype.getCompress,
        },
        {
            proto: prototype,
            property: 'stretch',
            getter: prototype.getStretch,
        },
        {
            proto: prototype,
            property: 'uniform',
            getter: prototype.getUniform,
        },
        {
            proto: prototype,
            property: 'mix',
            getter: prototype.getMix,
        },
        {
            proto: prototype,
            property: 'softness',
            getter: prototype.getSoftness,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'positionMode',
            getter: prototype.getPositionMode,
        },
        {
            proto: prototype,
            property: 'spacingMode',
            getter: prototype.getSpacingMode,
        },
        {
            proto: prototype,
            property: 'rotateMode',
            getter: prototype.getRotateMode,
        },
        {
            proto: prototype,
            property: 'offsetRotation',
            getter: prototype.getOffsetRotation,
        },
        {
            proto: prototype,
            property: 'position',
            getter: prototype.getPosition,
        },
        {
            proto: prototype,
            property: 'spacing',
            getter: prototype.getSpacing,
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
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'floatValue',
            getter: prototype.getFloatValue,
        },
        {
            proto: prototype,
            property: 'stringValue',
            getter: prototype.getStringValue,
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
        },
        {
            proto: prototype,
            property: 'balance',
            getter: prototype.getBalance,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'floatValue',
            getter: prototype.getFloatValue,
        },
        {
            proto: prototype,
            property: 'stringValue',
            getter: prototype.getStringValue,
        },
        {
            proto: prototype,
            property: 'audioPath',
            getter: prototype.getAudioPath,
        },
        {
            proto: prototype,
            property: 'volume',
            getter: prototype.getVolume,
        },
        {
            proto: prototype,
            property: 'balance',
            getter: prototype.getBalance,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_MeshAttachment (): void {
    const prototype = spine.MeshAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'path',
            getter: prototype.getPath,
        },
        {
            proto: prototype,
            property: 'regionUVs',
            getter: prototype.getRegionUVs,
        },
        {
            proto: prototype,
            property: 'uvs',
            getter: prototype.getUvs,
        },
        {
            proto: prototype,
            property: 'triangles',
            getter: prototype.getTriangles,
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
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
        },
        {
            proto: prototype,
            property: 'hullLength',
            getter: prototype.getHullLength,
        },
        {
            proto: prototype,
            property: 'edges',
            getter: prototype.getEdges,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_PathAttachment (): void {
    const prototype = spine.PathAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'closed',
            getter: prototype.getClosed,
        },
        {
            proto: prototype,
            property: 'constantSpeed',
            getter: prototype.getConstantSpeed,
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
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
}

function overrideProperty_RegionAttachment (): void {
    const prototype = spine.RegionAttachment.prototype as any;
    const propertyPolyfills = [
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
        },
        {
            proto: prototype,
            property: 'width',
            getter: prototype.getWidth,
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
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
        },
        {
            proto: prototype,
            property: 'rendererObject',
            getter: prototype.getRendererObject,
        },
        // {
        //     proto: prototype,
        //     property: 'region',
        //     getter: prototype.getProp_region,
        // },
        {
            proto: prototype,
            property: 'offset',
            getter: prototype.getOffset,
        },
        {
            proto: prototype,
            property: 'uvs',
            getter: prototype.getUVs,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
            property: 'name',
            getter: prototype.getName,
        },
        {
            proto: prototype,
            property: 'boneData',
            getter: prototype.getBoneData,
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
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'bendDirection',
            getter: prototype.getBendDirection,
        },
        {
            proto: prototype,
            property: 'compress',
            getter: prototype.getCompress,
        },
        {
            proto: prototype,
            property: 'stretch',
            getter: prototype.getStretch,
        },
        {
            proto: prototype,
            property: 'mix',
            getter: prototype.getMix,
        },
        {
            proto: prototype,
            property: 'softness',
            getter: prototype.getSoftness,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'position',
            getter: prototype.getPosition,
        },
        {
            proto: prototype,
            property: 'spacing',
            getter: prototype.getSpacing,
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
            property: 'active',
            getter: prototype.getActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
            property: 'active',
            getter: prototype.getActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
        {
            proto: prototype,
            property: 'rotation',
            getter: prototype.getRotation,
        },
        {
            proto: prototype,
            property: 'scaleX',
            getter: prototype.getScaleX,
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
        },
        {
            proto: prototype,
            property: 'shearX',
            getter: prototype.getShearX,
        },
        {
            proto: prototype,
            property: 'shearY',
            getter: prototype.getShearY,
        },
        {
            proto: prototype,
            property: 'ax',
            getter: prototype.getAX,
        },
        {
            proto: prototype,
            property: 'ay',
            getter: prototype.getAY,
        },
        {
            proto: prototype,
            property: 'arotation',
            getter: prototype.getARotation,
        },
        {
            proto: prototype,
            property: 'ascaleX',
            getter: prototype.getAScaleX,
        },
        {
            proto: prototype,
            property: 'ascaleY',
            getter: prototype.getAScaleY,
        },
        {
            proto: prototype,
            property: 'ashearX',
            getter: prototype.getAShearX,
        },
        {
            proto: prototype,
            property: 'ashearY',
            getter: prototype.getAShearY,
        },
        {
            proto: prototype,
            property: 'appliedValid',
            getter: prototype.getAppliedValid,
        },
        {
            proto: prototype,
            property: 'a',
            getter: prototype.getA,
        },
        {
            proto: prototype,
            property: 'b',
            getter: prototype.getB,
        },
        {
            proto: prototype,
            property: 'c',
            getter: prototype.getC,
        },
        {
            proto: prototype,
            property: 'd',
            getter: prototype.getD,
        },
        {
            proto: prototype,
            property: 'worldY',
            getter: prototype.getWorldY,
        },
        {
            proto: prototype,
            property: 'worldX',
            getter: prototype.getWorldX,
        },
        {
            proto: prototype,
            property: 'active',
            getter: prototype.getActive,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
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
            property: 'deform',
            getter: prototype.getDeform,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
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
}

function overrideProperty_SkinEntry (): void {
    const prototype = spine.SkinEntry.prototype as any;
    const propertyPolyfills = [
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
            property: 'UVs',
            getter: prototype.getUVs,
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
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
        {
            proto: prototype,
            property: 'width',
            getter: prototype.getWidth,
        },
        {
            proto: prototype,
            property: 'height',
            getter: prototype.getHeight,
        },
        {
            proto: prototype,
            property: 'version',
            getter: prototype.getVersion,
        },
        {
            proto: prototype,
            property: 'hash',
            getter: prototype.getHash,
        },
        {
            proto: prototype,
            property: 'fps',
            getter: prototype.getFps,
        },
        {
            proto: prototype,
            property: 'imagesPath',
            getter: prototype.getImagesPath,
        },
        {
            proto: prototype,
            property: 'audioPath',
            getter: prototype.getAudioPath,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        {
            proto: prototype,
            property: 'attachmentNames',
            getter: prototype.getAttachmentNames,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
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
        {
            proto: prototype,
            property: 'frameVertices',
            getter: prototype.getFrameVertices,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
    overrideDefineArrayProp(prototype, prototype.getFrames, 'frames');
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
        },
        {
            proto: prototype,
            property: 'holdPrevious',
            getter: prototype.getHoldPrevious,
        },
        {
            proto: prototype,
            property: 'eventThreshold',
            getter: prototype.getEventThreshold,
        },
        {
            proto: prototype,
            property: 'attachmentThreshold',
            getter: prototype.getAttachmentThreshold,
        },
        {
            proto: prototype,
            property: 'drawOrderThreshold',
            getter: prototype.getDrawOrderThreshold,
        },
        {
            proto: prototype,
            property: 'animationStart',
            getter: prototype.getAnimationStart,
        },
        {
            proto: prototype,
            property: 'animationEnd',
            getter: prototype.getAnimationEnd,
        },
        {
            proto: prototype,
            property: 'animationLast',
            getter: prototype.getAnimationLast,
        },
        {
            proto: prototype,
            property: 'delay',
            getter: prototype.getDelay,
        },
        {
            proto: prototype,
            property: 'trackTime',
            getter: prototype.getTrackTime,
        },
        {
            proto: prototype,
            property: 'trackEnd',
            getter: prototype.getTrackEnd,
        },
        {
            proto: prototype,
            property: 'timeScale',
            getter: prototype.getTimeScale,
        },
        {
            proto: prototype,
            property: 'alpha',
            getter: prototype.getAlpha,
        },
        {
            proto: prototype,
            property: 'mixTime',
            getter: prototype.getMixTime,
        },
        {
            proto: prototype,
            property: 'mixDuration',
            getter: prototype.getMixDuration,
        },
        {
            proto: prototype,
            property: 'mixBlend',
            getter: prototype.getMixBlend,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
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
        // {
        //     proto: prototype,
        //     property: 'timelines',
        //     getter: prototype.getProp_timelines,
        // },
        {
            proto: prototype,
            property: 'duration',
            getter: prototype.getDuration,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });
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
            property: '_updateCache',
            getter: prototype.getUpdateCache,
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
        },
        {
            proto: prototype,
            property: 'scaleY',
            getter: prototype.getScaleY,
        },
        {
            proto: prototype,
            property: 'x',
            getter: prototype.getX,
        },
        {
            proto: prototype,
            property: 'y',
            getter: prototype.getY,
        },
    ];
    propertyPolyfills.forEach((prop): void => {
        js.getset(prop.proto, prop.property, prop.getter);
    });

    overrideDefineArrayProp(prototype, prototype.getBones, 'bones');
    overrideDefineArrayProp(prototype, prototype.getSlots, 'slots');
    overrideDefineArrayProp(prototype, prototype.getDrawOrder, 'drawOrder');
    overrideDefineArrayProp(prototype, prototype.getIkConstraints, 'ikConstraints');
    overrideDefineArrayProp(prototype, prototype.getTransformConstraints, 'transformConstraints');
    overrideDefineArrayProp(prototype, prototype.getPathConstraints, 'pathConstraints');
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
    overrideProperty_TextureAtlas();
    overrideProperty_SlotData();
    overrideProperty_IkConstraint();
    overrideProperty_PathConstraint();
    overrideProperty_TransformConstraintData();
    overrideProperty_TransformConstraint();
    overrideProperty_Bone();
    overrideProperty_Slot();
    overrideProperty_Skin();
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
