import { RenderScene } from '.';
import { BatchView2D, Pass } from '..';
import { IFlatBuffer } from '../../assets/rendering-sub-mesh';
import { AABB, Frustum } from '../../geometry';
import { Attribute, Buffer, ClearFlags, Color as GFXColor, DescriptorSet, Framebuffer, InputAssembler, Shader } from '../../gfx';
import { Color, Mat4, Rect, Vec2 } from '../../math';
import { RenderPriority } from '../../pipeline/define';
import { LightType } from './light';
import { SubModel } from './submodel';

export declare class NativeNode {
    public initWithData (data: TypedArray): void;
}

export declare class NativeModel {
    public setReceiveShadow (val: boolean): void;
    public setEnabled (val: boolean): void;
    public seVisFlag (val: number): void;
    public setTransform (n: Node): void;
    public setNode (n: Node): void;
    public setCastShadow (val: boolean): void;
    public setLocalBuffer (buf: Buffer | null): void;
    public setWolrdBounds (val: AABB | null): void;
    public addSubModel (val: NativeSubModel): void;
    public setInstmatWorldIdx (idx: number): void;
    public setInstancedBuffer (buffer: ArrayBuffer): void;
    public setInstanceAttributes (attrs: Attribute[]): void;
}

export declare class NativeLight {
    public setType (type: LightType): void;
    public setColor (color: Vec3): void;
    public setUseColorTemperature (enable: boolean): void;
    public setColorTemperatureRGB (color: Vec3): void;
    public setNode (n: Node): void;
}

export declare class NativeDirectionalLight extends NativeLight {
    public setDirection (dir: Vec3): void;
    public setIlluminance (lum: number): void;
}

export declare class NativeSphereLight extends NativeLight {
    public setPosition (pos: Vec3): void;
    public setAABB (aabb: AABB): void;
    public setSize (size: number): void;
    public setRange (range: number): void;
    public setIlluminance (lum: number): void;
}

export declare class NativeSpotLight extends NativeLight {
    public setDirection (dir: Vec3): void;
    public setFrustum (frs: Frustum): void;
    public setAABB (aabb: AABB): void;
    public setPosition (pos: Vec3): void;
    public setSize (size: number): void;
    public setRange (range: number): void;
    public setAspect (aspect: number): void;
    public setAngle (angle: number): void;
    public setIlluminance (lum: number): void;
}

export declare class NaitveSkybox {
    public enabled: boolean;
    public useIBL: boolean;
    public isRGBE: boolean;
    public model: NativeModel | null;
}

export declare class NativeFog {
    public type: number;
    public enabled: boolean;
    public color: Color;
    public density: number;
    public start: number;
    public end: number;
    public atten: number;
    public top: number;
    public range: number;
}

export declare class NativeRenderWindow {
    public hasOffScreenAttachments: boolean;
    public hasOnScreenAttachments: boolean;
    public frameBuffer: Framebuffer;
}

export declare class NativeCamera {
    public width: number;
    public height: number;
    public scene: NativeRenderScene | null;
    public frustum: Frustum;
    public matView: Mat4;
    public matViewProj: Mat4;
    public matViewProjInv: Mat4;
    public matProj: Mat4;
    public matProjInv: Mat4;
    public position: Vec3;
    public forward: Vec3;
    public node: NativeNode | null;
    public clearColor: GFXColor;
    public viewPort: Rect;
    public window: NativeRenderWindow | null;
    public visibility: number;
    public clearFlag: ClearFlags;
    public clearDepth: number;
    public clearStencil: number;
    public exposure: number;
}

export declare class NativePass {
    public update(): void;
    public setPriority(val: number): void;
    public setStage(val: number): void;
    public setPhase(val: number): void;
    public setPrimitive(val: number): void;
    public setRasterizerState(val): void;
    public setDepthStencilState(val): void;
    public setBlendState(val): void;
    public setDescriptorSet(val): void;
    public setBatchingScheme(val: number): void;
    public setDynamicState(val: number): void;
    public setHash(val: number): void;
    public setPipelineLayout(val): void;
}

export declare class NativeSubModel {
    public setDescriptorSet(val: DescriptorSet | null): void;
    public setInputAssembler(val: InputAssembler | null): void;
    public setRenderingSubMesh(val: IFlatBuffer[]): void;
    public setPlanarShader(val: Shader | null): void;
    public setPlanarInstanceShader(val: Shader | null): void;
    public setPasses(val: NativePass[]): void;
    public setShaders(val: (Shader | null)[]): void;
    public setPriority(val: RenderPriority): void;
}
export declare class NativeDrawBatch2D {
    public visFlags: BatchView2D;
    public inputAssembler: InputAssembler | null;
    public descriptorSet: DescriptorSet | null;
    public passes: NativePass[];
    public shaders: Shader[];
}

export declare class NativeRenderScene {
    public setMainLight (l: NativeLight | null): void;
    public addSphereLight (l: NativeLight | null): void;
    public removeSphereLight (l: NativeLight | null): void;
    public addSpotLight (l: NativeLight | null): void;
    public removeSpotLight (l: NativeLight | null): void;
    public removeSphereLights (): void;
    public removeSpotLights (): void;
    public addModel (m: NativeModel): void;
    public removeModel (m: NativeModel): void;
    public removeModels (): void;
    public addBatch (batch: NativeDrawBatch2D): void;
    public removeBatch (index: number): void;
    public removeBatches (): void;
}

export declare class NativeAmbient {
    public enabled: boolean;
    public skyColor: Color;
    public skyIllum: number;
    public groundAlbedo: Color;
}

export declare class NativeShadow {
    public normal: Vec3;
    public distance: number;
    public color: Color;
    public nearValue: number;
    public farValue: number;
    public aspect: number;
    public orthoSize: number;
    public size: Vec2;
    public pcfType: number;
    public shadowMapDirty: boolean;
    public bias: number;
    public packing: boolean;
    public linear: boolean;
    public selfShadow: boolean;
    public normalBias: number;
    public autoAdapt: boolean;
    public planarPass: NativePass;
    public instancePass: NativePass;
    public enabled: boolean;
    public shadowType: number;
}

export declare class NativeRoot {
    public cumulativeTime: number;
    public frameTime: number;
}

export declare class NativePipelineSharedSceneData {
    public isHDR: boolean;
    public shadingScale: number;
    public fpScale: number;
    public fog: NativeFog;
    public ambient: NativeAmbient;
    public skybox: NaitveSkybox;
    public shadow: NativeShadow;
    public deferredLightPassShader: Shader | null;
    public deferredLightPass: NativePass;
    public deferredPostPassShader: Shader | null;
    public deferredPostPass: NativePass;
}
