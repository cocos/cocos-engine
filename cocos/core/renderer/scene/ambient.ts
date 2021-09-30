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

 import { JSB } from 'internal:constants';
 import { Color, Vec3, Vec4 } from '../../math';
 import { legacyCC } from '../../global-exports';
 import { AmbientInfo } from '../../scene-graph/scene-globals';
 import { NativeAmbient } from './native-scene';
 
 export class Ambient {
     public static SUN_ILLUM = 65000.0;
     public static SKY_ILLUM = 20000.0;
 
     get colorArray (): Vec4 {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         if (isHDR) {
             return this._colorArray_hdr;
         } else {
             return this._colorArray_ldr;
         }
     }
 
     get albedoArray (): Vec4 {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         if (isHDR) {
             return this._albedoArray_hdr;
         } else {
             return this._albedoArray_ldr;
         }
     }
 
     /**
      * @en Enable ambient
      * @zh 是否开启环境光
      */
     set enabled (val: boolean) {
         this._enabled = val;
         if (JSB) {
             this._nativeObj!.enabled = val;
         }
     }
     get enabled (): boolean {
         return this._enabled;
     }
     /**
      * @en Sky color
      * @zh 天空颜色
      */
     get skyColor (): Color {
         return this._skyColor;
     }
 
     set skyColor (color: Color) {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         this._skyColor.set(color);
         if (isHDR) {
             this._colorArray_hdr.x = this._skyColor.x;
             this._colorArray_hdr.y = this._skyColor.y;
             this._colorArray_hdr.z = this._skyColor.z;
             this._colorArray_hdr.w = this._skyColor.w;
         } else {
             this._colorArray_ldr.x = this._skyColor.x;
             this._colorArray_ldr.y = this._skyColor.y;
             this._colorArray_ldr.z = this._skyColor.z;
             this._colorArray_ldr.w = this._skyColor.w;
         }
         if (JSB) {
             this._nativeObj!.skyColor = this._skyColor;
         }
     }
 
     set skyColorValue (color: Vec3) {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         const clampColor = (x: number) => Math.min(x * 255, 255);
         this._skyColor.set(clampColor(color.x), clampColor(color.y), clampColor(color.z), 255);
         if (isHDR) {
             this._colorArray_hdr.x = this._skyColor.x;
             this._colorArray_hdr.y = this._skyColor.y;
             this._colorArray_hdr.z = this._skyColor.z;
             this._colorArray_hdr.w = this._skyColor.w;
         } else {
             this._colorArray_ldr.x = this._skyColor.x;
             this._colorArray_ldr.y = this._skyColor.y;
             this._colorArray_ldr.z = this._skyColor.z;
             this._colorArray_ldr.w = this._skyColor.w;
         }
         if (JSB) {
             this._nativeObj!.skyColor = this._skyColor;
         }
     }
 
     /**
      * @en Sky illuminance
      * @zh 天空亮度
      */
     get skyIllum (): number {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         if (isHDR) {
             return this._skyIllum_hdr;
         } else {
             return this._skyIllum_ldr;
         }
     }
 
     set skyIllum (illum: number) {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         if (isHDR) {
             this._skyIllum_hdr = illum;
         } else {
             this._skyIllum_ldr = illum;
         }
         if (JSB) {
             this._nativeObj!.skyIllum = illum;
         }
     }
     /**
      * @en Ground color
      * @zh 地面颜色
      */
     get groundAlbedo (): Color {
         return this._groundAlbedo;
     }
 
     set groundAlbedo (color: Color) {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         this._groundAlbedo.set(color);
         if (isHDR) {
             this._albedoArray_hdr.x = this._groundAlbedo.x;
             this._albedoArray_hdr.y = this._groundAlbedo.y;
             this._albedoArray_hdr.z = this._groundAlbedo.z;
             this._albedoArray_hdr.w = this._groundAlbedo.w;
         } else {
             this._albedoArray_ldr.x = this._groundAlbedo.x;
             this._albedoArray_ldr.y = this._groundAlbedo.y;
             this._albedoArray_ldr.z = this._groundAlbedo.z;
             this._albedoArray_ldr.w = this._groundAlbedo.w;
         }
         if (JSB) {
             this._nativeObj!.groundAlbedo = this._groundAlbedo;
         }
     }
 
     set groundAlbedoValue (color: Vec3) {
         const isHDR = (legacyCC.director.root).pipeline.pipelineSceneData.isHDR;
         const clampColor = (x: number) => Math.min(x * 255, 255);
         this._groundAlbedo.set(clampColor(color.x), clampColor(color.y), clampColor(color.z), 255);
         if (isHDR) {
             this._albedoArray_hdr.x = this._groundAlbedo.x;
             this._albedoArray_hdr.y = this._groundAlbedo.y;
             this._albedoArray_hdr.z = this._groundAlbedo.z;
             this._albedoArray_hdr.w = this._groundAlbedo.w;
         } else {
             this._albedoArray_ldr.x = this._groundAlbedo.x;
             this._albedoArray_ldr.y = this._groundAlbedo.y;
             this._albedoArray_ldr.z = this._groundAlbedo.z;
             this._albedoArray_ldr.w = this._groundAlbedo.w;
         }
 
         if (JSB) {
             this._nativeObj!.groundAlbedo = this._groundAlbedo;
         }
     }
 
     protected _skyColor = new Color(51, 128, 204, 1.0);
     protected _groundAlbedo = new Color(51, 51, 51, 255);
 
     protected _albedoArray_hdr = new Vec4(0.2, 0.2, 0.2, 1.0);
     protected _colorArray_hdr = new Vec4(0.2, 0.5, 0.8, 1.0);
     protected _skyIllum_hdr = 0;
 
     protected _albedoArray_ldr = new Vec4(0.2, 0.2, 0.2, 1.0);
     protected _colorArray_ldr = new Vec4(0.2, 0.5, 0.8, 1.0);
     protected _skyIllum_ldr = 0;
 
     protected _enabled = false;
     protected declare _nativeObj: NativeAmbient | null;
 
     get native (): NativeAmbient {
         return this._nativeObj!;
     }
 
     constructor () {
         if (JSB) {
             this._nativeObj = new NativeAmbient();
         }
     }
 
     public initialize (ambientInfo: AmbientInfo) {
         this.skyColor = ambientInfo.skyColor;
         this.groundAlbedo = ambientInfo.groundAlbedo;
         this.skyIllum = ambientInfo.skyIllum;
 
         // Init HDR/LDR from serialized data on load
         this._colorArray_hdr = ambientInfo.skyColor_hdr;
         this._albedoArray_hdr = ambientInfo.groundAlbedo_hdr;
         this._skyIllum_hdr = ambientInfo.skyIllum_hdr;
 
         this._colorArray_ldr = ambientInfo.skyColor_ldr;
         this._albedoArray_ldr = ambientInfo.groundAlbedo_ldr;
         this._skyIllum_ldr = ambientInfo.skyIllum_ldr;
     }
 
     protected _destroy () {
         if (JSB) {
             this._nativeObj = null;
         }
     }
 
     public destroy () {
         this._destroy();
     }
 }
 
 legacyCC.Ambient = Ambient;
 