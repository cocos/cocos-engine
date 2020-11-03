declare const gfx: any;

import {
    BlendFactor,
    BlendOp,
    ColorMask,
    ComparisonFunc,
    CullMode,
    PolygonMode,
    ShadeModel,
    StencilOp,
} from './define';
import { Color } from './define-class';
import { RawBufferHandle, RawBufferPool, BlendTargetArrayPool, NULL_HANDLE, BlendTargetArrayHandle } from '../renderer/core/memory-pools';

export class RasterizerState {
    private h: RawBufferHandle;
    private v: Uint32Array;
    private fv: Float32Array;

    constructor (
        isDiscard: boolean = false,
        polygonMode: PolygonMode = PolygonMode.FILL,
        shadeModel: ShadeModel = ShadeModel.GOURAND,
        cullMode: CullMode = CullMode.BACK,
        isFrontFaceCCW: boolean = true,
        depthBias: number = 0,
        depthBiasClamp: number = 0.0,
        depthBiasSlop: number = 0.0,
        isDepthClip: boolean = true,
        isMultisample: boolean = false,
        lineWidth: number = 1.0,
    ) {
        this.h = RawBufferPool.alloc(11 * 4);
        const buffer = RawBufferPool.getBuffer(this.h);
        this.v = new Uint32Array(buffer);
        this.fv = new Float32Array(buffer);
        this.v[0] = isDiscard ? 1 : 0;
        this.v[1] = polygonMode;
        this.v[2] = shadeModel;
        this.v[3] = cullMode;
        this.v[4] = isFrontFaceCCW ? 1 : 0;
        this.fv[5] = depthBias;
        this.fv[6] = depthBiasClamp;
        this.fv[7] = depthBiasSlop;
        this.v[8] = isDepthClip ? 1 : 0;
        this.v[9] = isMultisample ? 1 : 0;
        this.fv[10] = lineWidth;
    }

    get isDiscard (): boolean {
        if (this.v[0]) return true; 
        else return false;
    }
    set isDiscard (val: boolean) { this.v[0] = val ? 1 : 0 }
    get polygonMode (): PolygonMode { return this.v[1]; }
    set polygonMode (val: PolygonMode) { this.v[1] = val; }
    get shadeModel (): ShadeModel { return this.v[2]; }
    set shadeModel (val: ShadeModel) { this.v[2] = val; }
    get cullMode (): CullMode { return this.v[3]; }
    set cullMode (val: CullMode) { this.v[3] = val; }
    get isFrontFaceCCW (): boolean {
        if (this.v[4]) return true;
        else return false;
    }
    set isFrontFaceCCW (val: boolean) { this.v[4] = val ? 1 : 0; }
    get depthBias (): number { return this.fv[5]; }
    set depthBias (val: number) { this.fv[5] = val; }
    get depthBiasClamp (): number { return this.fv[6]; }
    set depthBiasClamp (val: number) { this.fv[6] = val; }
    get depthBiasSlop (): number { return this.fv[7]; }
    set depthBiasSlop (val: number) { this.fv[7] = val; }
    get isDepthClip (): boolean {
        if (this.v[8]) return true;
        else return false;
    }
    set isDepthClip (val: boolean) { this.v[8] = val ? 1 : 0 }
    get isMultisample (): boolean {
        if (this.v[9]) return true;
        else return false;
    }
    set isMultisample (val: boolean) { this.v[9] = val ? 1 : 0 }
    get lineWidth (): number { return this.v[10]; }
    set lineWidth (val: number) { this.v[10] = val; }
    get handle (): RawBufferHandle { return this.h; }

    public reset () {
        this.v.fill(0);
    }

    public destroy () {
        this.v = null;
        this.fv = null;
        if (this.h) {
            RawBufferPool.free(this.h);
            this.h = NULL_HANDLE;
        }
    }
}

/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export class DepthStencilState {
    private h: RawBufferHandle;
    private v: Uint32Array;

    constructor (
        depthTest: boolean = true,
        depthWrite: boolean = true,
        depthFunc: ComparisonFunc = ComparisonFunc.LESS,
        stencilTestFront: boolean = false,
        stencilFuncFront: ComparisonFunc = ComparisonFunc.ALWAYS,
        stencilReadMaskFront: number = 0xffff,
        stencilWriteMaskFront: number = 0xffff,
        stencilFailOpFront: StencilOp = StencilOp.KEEP,
        stencilZFailOpFront: StencilOp = StencilOp.KEEP,
        stencilPassOpFront: StencilOp = StencilOp.KEEP,
        stencilRefFront: number = 1,
        stencilTestBack: boolean = false,
        stencilFuncBack: ComparisonFunc = ComparisonFunc.ALWAYS,
        stencilReadMaskBack: number = 0xffff,
        stencilWriteMaskBack: number = 0xffff,
        stencilFailOpBack: StencilOp = StencilOp.KEEP,
        stencilZFailOpBack: StencilOp = StencilOp.KEEP,
        stencilPassOpBack: StencilOp = StencilOp.KEEP,
        stencilRefBack: number = 1,
    ) {
        this.h = RawBufferPool.alloc(19 * 4);
        this.v = new Uint32Array(RawBufferPool.getBuffer(this.h));
        this.v[0] = depthTest ? 1 : 0;
        this.v[1] = depthWrite ? 1 : 0;
        this.v[2] = depthFunc;
        this.v[3] = stencilTestFront ? 1 : 0;
        this.v[4] = stencilFuncFront;
        this.v[5] = stencilReadMaskFront;
        this.v[6] = stencilWriteMaskFront;
        this.v[7] = stencilFailOpFront;
        this.v[8] = stencilZFailOpFront;
        this.v[9] = stencilPassOpFront;
        this.v[10] = stencilRefFront;
        this.v[11] = stencilTestBack ? 1 : 0;
        this.v[12] = stencilFuncBack;
        this.v[13] = stencilReadMaskBack;
        this.v[14] = stencilWriteMaskBack;
        this.v[15] = stencilFailOpBack;
        this.v[16] = stencilZFailOpBack;
        this.v[17] = stencilPassOpBack;
        this.v[18] = stencilRefBack;
    }

    get depthTest (): boolean {
        if (this.v[0]) return true;
        else return false;
    }
    set depthTest(val: boolean) { this.v[0] = val ? 1 : 0 }
    get depthWrite (): boolean {
        if (this.v[1]) return true;
        else return false;
    }
    set depthWrite (val: boolean) { this.v[1] = val ? 1 : 0; }
    get depthFunc (): ComparisonFunc { return this.v[2]; }
    set depthFunc (val: ComparisonFunc) { this.v[2] = val; }
    get stencilTestFront (): boolean {
        if (this.v[3]) return true;
        else return false;
    }
    set stencilTestFront (val: boolean) { this.v[3] = val ? 1 : 0 }
    get stencilFuncFront (): ComparisonFunc { return this.v[4]; }
    set stencilFuncFront (val: ComparisonFunc) { this.v[4] = val; }
    get stencilReadMaskFront (): number { return this.v[5]; }
    set stencilReadMaskFront (val: number) { this.v[5] = val;}
    get stencilWriteMaskFront (): number { return this.v[6]; }
    set stencilWriteMaskFront (val: number) { this.v[6] = val; }
    get stencilFailOpFront (): StencilOp { return this.v[7]; }
    set stencilFailOpFront (val: StencilOp) { this.v[7] = val; } 
    get stencilZFailOpFront (): StencilOp { return this.v[8]; }
    set stencilZFailOpFront (val: StencilOp) { this.v[8] = val; }
    get stencilPassOpFront (): StencilOp { return this.v[9]; }
    set stencilPassOpFront (val: StencilOp) { this.v[9] = val; }
    get stencilRefFront (): number { return this.v[10]; }
    set stencilRefFront (val: number) { this.v[10] = val; }
    get stencilTestBack (): boolean {
        if (this.v[11]) return true;
        else return false;
    }
    set stencilTestBack (val: boolean) { this.v[11] = val ? 1 : 0; }
    get stencilFuncBack (): ComparisonFunc { return this.v[12]; }
    set stencilFuncBack (val: ComparisonFunc) { this.v[12] = val; }
    get stencilReadMaskBack (): number { return this.v[13]; }
    set stencilReadMaskBack (val: number) { this.v[13] = val; }
    get stencilWriteMaskBack (): number { return this.v[14]; }
    set stencilWriteMaskBack (val: number) { this.v[14] = val; }
    get stencilFailOpBack (): StencilOp { return this.v[15]; }
    set stencilFailOpBack (val: StencilOp) { this.v[15] = val; }
    get stencilZFailOpBack (): StencilOp { return this.v[16]; }
    set stencilZFailOpBack (val: StencilOp) { this.v[16] = val; }
    get stencilPassOpBack (): StencilOp { return this.v[17]; }
    set stencilPassOpBack (val: StencilOp) { this.v[17] = val; }
    get stencilRefBack (): number { return this.v[18]; }
    set stencilRefBack (val: number) { this.v[18] = val; }
    get handle (): RawBufferHandle { return this.h; }

    public reset () {
        this.v.fill(0);
    }

    public destroy () {
        this.v = null;

        RawBufferPool.free(this.h);
        this.h = NULL_HANDLE;
    }
}

/**
 * @en GFX blend target.
 * @zh GFX 混合目标。
 */
export class BlendTarget {
    private h: RawBufferHandle;
    private v: Uint32Array;

    constructor (
        blend: boolean = false,
        blendSrc: BlendFactor = BlendFactor.ONE,
        blendDst: BlendFactor = BlendFactor.ZERO,
        blendEq: BlendOp = BlendOp.ADD,
        blendSrcAlpha: BlendFactor = BlendFactor.ONE,
        blendDstAlpha: BlendFactor = BlendFactor.ZERO,
        blendAlphaEq: BlendOp = BlendOp.ADD,
        blendColorMask: ColorMask = ColorMask.ALL,
    ) {
        this.h = RawBufferPool.alloc(8 * 4);
        this.v = new Uint32Array(RawBufferPool.getBuffer(this.h));
        this.v[0] = blend ? 1 : 0;
        this.v[1] = blendSrc;
        this.v[2] = blendDst;
        this.v[3] = blendEq;
        this.v[4] = blendSrcAlpha;
        this.v[5] = blendDstAlpha;
        this.v[6] = blendAlphaEq;
        this.v[7] = blendColorMask;
    }

    get blend (): boolean {
        if (this.v[0]) return true;
        else return false;
    }
    set blend (val: boolean) { this.v[0] = val ? 1 : 0; }
    get blendSrc (): BlendFactor { return this.v[1]; }
    set blendSrc (val: BlendFactor) { this.v[1] = val; }
    get blendDst () { return this.v[2]; }
    set blendDst (val: BlendFactor) { this.v[2] = val; }
    get blendEq (): BlendOp { return this.v[3]; }
    set blendEq (val: BlendOp) { this.v[3] = val; }
    get blendSrcAlpha (): BlendFactor { return this.v[4]; }
    set blendSrcAlpha (val: BlendFactor) { this.v[4] = val; }
    get blendDstAlpha (): BlendFactor { return this.v[5]; }
    set blendDstAlpha (val: BlendFactor) { this.v[5] = val; }
    get blendAlphaEq (): BlendOp { return this.v[6]; }
    set blendAlphaEq (val: BlendOp) { this.v[6] = val; }
    get blendColorMask (): ColorMask { return this.v[7]; }
    set blendColorMask (val: ColorMask) { this.v[7] = val; }
    get handle (): RawBufferHandle { return this.h; }

    public reset () {
        this.v.fill(0);
    }

    public destroy () {
        this.v = null;

        RawBufferPool.free(this.h);
        this.h = NULL_HANDLE;
    }
}

export class BlendState {
    private h: RawBufferHandle;
    private v: Uint32Array;
    private fv: Float32Array;
    private hBt: BlendTargetArrayHandle;
    private targets: BlendTarget[];
    private color: Color;

    constructor (
        isA2C: boolean = false,
        isIndepend: boolean = false,
        blendColor: Color = new Color(),
        targets: BlendTarget[] = [new BlendTarget()],
    ) {
        this.targets = targets;
        this.color = blendColor;
        this.h = RawBufferPool.alloc(7 * 4);
        const buffer = RawBufferPool.getBuffer(this.h);
        this.v = new Uint32Array(buffer);
        this.fv = new Float32Array(buffer);
        this.v[0] = isA2C ? 1 : 0;
        this.v[1] = isIndepend ? 1 : 0;
        this.fv[2] = blendColor.x;
        this.fv[3] = blendColor.y;
        this.fv[4] = blendColor.z;
        this.fv[5] = blendColor.w;
        this.hBt = BlendTargetArrayPool.alloc();
        this.v[6] = this.hBt as unknown as number;
        for (let i = 0, len = targets.length; i < len; ++i) {
            BlendTargetArrayPool.push(this.hBt, targets[i].handle);
        }
    }

    get isA2c (): boolean {
        if (this.v[0]) return true;
        else return false;
    }
    set isA2c (val: boolean) { this.v[0] = val ? 1 : 0; }
    get isIndepend (): boolean {
        if (this.v[1]) return true;
        else return false;
    }
    set isIndepend (val: boolean) { this.v[1] = val ? 1 : 0; }
    get blendColor (): Color { return this.color; }
    set blendColor (color: Color) {
        this.color = color;
        this.fv[2] = color.x;
        this.fv[3] = color.y;
        this.fv[4] = color.z;
        this.fv[5] = color.w;
    }

    /**
     * @en Should use this function to set target, or it will not work
     * on native platforms, as native can not support this feature,
     * such as `blendState[i] = target;`.
     *
     * @param index The index to set target.
     * @param target The target to be set.
     */
    public setTarget (index: number, target: BlendTarget) {
        let tg = this.targets[index];
        if (!tg) {
            tg = this.targets[index] = new BlendTarget();
        }
        Object.assign(tg, target);
    }

    public reset () {
        this.v.fill(0);

        let targets = this.targets;
        for (let i = 1, len = targets.length; i < len; ++i) {
            targets[i].destroy();
        }
        targets.length = 1;
        targets[0].reset;
        this.v[6] = this.hBt as unknown as number;
        BlendTargetArrayPool.clear(this.hBt);
        BlendTargetArrayPool.push(this.hBt, targets[0].handle);
    }

    public destroy () {
        this.v = null;
        this.fv = null;

        RawBufferPool.free(this.h);
        this.h = NULL_HANDLE;
        
        BlendTargetArrayPool.free(this.hBt);
        this.hBt = NULL_HANDLE;

        for (let i = 0, len = this.targets.length; i < len; ++i) {
            this.targets[i].destroy();
        }
        this.targets = null;
    }
}

export const PipelineStateInfo = gfx.PipelineStateInfo;
export const InputState = gfx.InputState;
export const PipelineState = gfx.PipelineState;
