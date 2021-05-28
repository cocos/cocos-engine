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

/**
 * @packageDocumentation
 * @module gfx
 */

declare const gfx: any;

declare type RecursivePartial<T> = {
    [P in keyof T]?:

        T[P] extends Array<infer U> ? Array<RecursivePartial<U>> :
        T[P] extends ReadonlyArray<infer V> ? ReadonlyArray<RecursivePartial<V>> : RecursivePartial<T[P]>;
};

import {
    BlendFactor,
    BlendOp,
    ColorMask,
    ComparisonFunc,
    CullMode,
    PolygonMode,
    ShadeModel,
    StencilOp,
    Color,
} from './base/define';
import { BlendTargetArrayPool, NULL_HANDLE, BlendTargetArrayHandle, RasterizerStateHandle, RasterizerStatePool, RasterizerStateView,
    DepthStencilStateHandle, DepthStencilStatePool, DepthStencilStateView, BlendTargetHandle, BlendTargetPool, BlendTargetView,
    BlendStateHandle, BlendStatePool, BlendStateView } from '../renderer/core/memory-pools';

export class RasterizerState {
    private h: RasterizerStateHandle;
    protected _nativeObj;
    constructor (
        isDiscard: boolean = false,
        polygonMode: PolygonMode = PolygonMode.FILL,
        shadeModel: ShadeModel = ShadeModel.GOURAND,
        cullMode: CullMode = CullMode.BACK,
        isFrontFaceCCW: boolean = true,
        depthBiasEnabled: boolean = false,
        depthBias: number = 0,
        depthBiasClamp: number = 0.0,
        depthBiasSlop: number = 0.0,
        isDepthClip: boolean = true,
        isMultisample: boolean = false,
        lineWidth: number = 1.0,
    ) {
        this._nativeObj = new gfx.RasterizerState();
        this.h = RasterizerStatePool.alloc();
        this.assignProperties(isDiscard, polygonMode, shadeModel, cullMode, isFrontFaceCCW,
            depthBiasEnabled, depthBias, depthBiasClamp, depthBiasSlop, isDepthClip, isMultisample, lineWidth);
    }

    get native() {
        return this._nativeObj;
    }

    get isDiscard (): boolean {
        if (RasterizerStatePool.get(this.h, RasterizerStateView.IS_DISCARD)) return true;
        else return false;
    }
    set isDiscard (val: boolean) {
        RasterizerStatePool.set(this.h, RasterizerStateView.IS_DISCARD, val ? 1 : 0)
        this._nativeObj.isDiscard = val;
    }
    get polygonMode (): PolygonMode { return RasterizerStatePool.get(this.h, RasterizerStateView.POLYGO_MODEL); }
    set polygonMode (val: PolygonMode) {
        RasterizerStatePool.set(this.h, RasterizerStateView.POLYGO_MODEL, val);
        this._nativeObj.polygonMode = val;
    }
    get shadeModel (): ShadeModel { return RasterizerStatePool.get(this.h, RasterizerStateView.SHADE_MODEL); }
    set shadeModel (val: ShadeModel) { 
        RasterizerStatePool.set(this.h, RasterizerStateView.SHADE_MODEL, val);
        this._nativeObj.shadeModel = val;
    }
    get cullMode (): CullMode { return RasterizerStatePool.get(this.h, RasterizerStateView.CULL_MODE); }
    set cullMode (val: CullMode) {
        RasterizerStatePool.set(this.h, RasterizerStateView.CULL_MODE, val);
        this._nativeObj.cullMode = val;
    }
    get isFrontFaceCCW (): boolean {
        if (RasterizerStatePool.get(this.h, RasterizerStateView.IS_FRONT_FACE_CCW)) return true;
        else return false;
    }
    set isFrontFaceCCW (val: boolean) {
        RasterizerStatePool.set(this.h, RasterizerStateView.IS_FRONT_FACE_CCW, val ? 1 : 0);
        this._nativeObj.isFrontFaceCCW = val;
    }
    get depthBiasEnabled (): boolean {
        if (RasterizerStatePool.get(this.h, RasterizerStateView.DEPTH_BIAS_ENABLED)) return true;
        else return false;
    }
    set depthBiasEnabled (val: boolean) {
        RasterizerStatePool.set(this.h, RasterizerStateView.DEPTH_BIAS_ENABLED, val ? 1 : 0);
        this._nativeObj.depthBiasEnabled = val;
    }
    get depthBias (): number { return RasterizerStatePool.get(this.h, RasterizerStateView.DEPTH_BIAS); }
    set depthBias (val: number) {
        RasterizerStatePool.set(this.h, RasterizerStateView.DEPTH_BIAS, val);
        this._nativeObj.depthBias = val;
    }
    get depthBiasClamp (): number { return RasterizerStatePool.get(this.h, RasterizerStateView.DEPTH_BIAS_CLAMP); }
    set depthBiasClamp (val: number) {
        RasterizerStatePool.set(this.h, RasterizerStateView.DEPTH_BIAS_CLAMP, val);
        this._nativeObj.depthBiasClamp = val;
    }
    get depthBiasSlop (): number { return RasterizerStatePool.get(this.h, RasterizerStateView.DEPTH_BIAS_SLOP); }
    set depthBiasSlop (val: number) {
        RasterizerStatePool.set(this.h, RasterizerStateView.DEPTH_BIAS_SLOP, val);
        this._nativeObj.depthBiasSlop = val;
    }
    get isDepthClip (): boolean {
        if (RasterizerStatePool.get(this.h, RasterizerStateView.IS_DEPTH_CLIP)) return true;
        else return false;
    }
    set isDepthClip (val: boolean) {
        RasterizerStatePool.set(this.h, RasterizerStateView.IS_DEPTH_CLIP, val ? 1 : 0);
        this._nativeObj.isDepthClip = val;
    }
    get isMultisample (): boolean {
        if (RasterizerStatePool.get(this.h, RasterizerStateView.IS_MULTI_SAMPLE)) return true;
        else return false;
    }
    set isMultisample (val: boolean) {
        RasterizerStatePool.set(this.h, RasterizerStateView.IS_MULTI_SAMPLE, val ? 1 : 0);
        this._nativeObj.isMultisample = val;
    }
    get lineWidth (): number { return RasterizerStatePool.get(this.h, RasterizerStateView.LINE_WIDTH); }
    set lineWidth (val: number) {
        RasterizerStatePool.set(this.h, RasterizerStateView.LINE_WIDTH, val);
        this._nativeObj.lineWidth = val;
    }
    get handle (): RasterizerStateHandle { return this.h; }

    public reset () {
        this.assignProperties(false, PolygonMode.FILL, ShadeModel.GOURAND, CullMode.BACK, true, false, 0,
            0.0, 0.0, true, false, 1.0);
    }

    public assign (rs: RecursivePartial<RasterizerState>) {
        if (!rs) return;
        this.assignProperties(rs.isDiscard, rs.polygonMode, rs.shadeModel, rs.cullMode, rs.isFrontFaceCCW,
            rs.depthBiasEnabled, rs.depthBias, rs.depthBiasClamp, rs.depthBiasSlop, rs.isDepthClip, rs.isMultisample, rs.lineWidth);
    }

    public destroy () {
        if (this.h) {
            RasterizerStatePool.free(this.h);
            this.h = NULL_HANDLE;
        }
        this._nativeObj = null;
    }

    private assignProperties (
        isDiscard?: boolean,
        polygonMode?: PolygonMode,
        shadeModel?: ShadeModel,
        cullMode?: CullMode,
        isFrontFaceCCW?: boolean,
        depthBiasEnabled?: boolean,
        depthBias?: number,
        depthBiasClamp?: number,
        depthBiasSlop?: number,
        isDepthClip?: boolean,
        isMultisample?: boolean,
        lineWidth?: number,
    ) {
        if (isDiscard !== undefined) this.isDiscard = isDiscard;
        if (polygonMode !== undefined) this.polygonMode = polygonMode;
        if (shadeModel !== undefined) this.shadeModel = shadeModel;
        if (cullMode !== undefined) this.cullMode = cullMode;
        if (isFrontFaceCCW !== undefined) this.isFrontFaceCCW = isFrontFaceCCW;
        if (depthBiasEnabled !== undefined) this.depthBiasEnabled = depthBiasEnabled;
        if (depthBias !== undefined) this.depthBias = depthBias;
        if (depthBiasClamp !== undefined) this.depthBiasClamp = depthBiasClamp;
        if (depthBiasSlop !== undefined) this.depthBiasSlop = depthBiasSlop;
        if (isDepthClip !== undefined) this.isDepthClip = isDepthClip;
        if (isMultisample !== undefined) this.isMultisample = isMultisample;
        if (lineWidth !== undefined) this.lineWidth = lineWidth;
    }
}

/**
 * @en GFX depth stencil state.
 * @zh GFX 深度模板状态。
 */
export class DepthStencilState {
    private h: DepthStencilStateHandle;
    protected _nativeObj;
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
        this._nativeObj = new gfx.DepthStencilState();
        this.h = DepthStencilStatePool.alloc();
        this.assignProperties(depthTest, depthWrite, depthFunc, stencilTestFront, stencilFuncFront, stencilReadMaskFront,
            stencilWriteMaskFront, stencilFailOpFront, stencilZFailOpFront, stencilPassOpFront, stencilRefFront,
            stencilTestBack, stencilFuncBack, stencilReadMaskBack, stencilWriteMaskBack, stencilFailOpBack,
            stencilZFailOpBack, stencilPassOpBack, stencilRefBack);
    }

    get native() {
        return this._nativeObj;
    }

    get depthTest (): boolean {
        if (DepthStencilStatePool.get(this.h, DepthStencilStateView.DEPTH_TEST)) return true;
        else return false;
    }
    set depthTest (val: boolean) {
        DepthStencilStatePool.set(this.h, DepthStencilStateView.DEPTH_TEST, val ? 1 : 0);
        this._nativeObj.depthTest = val;
    }
    get depthWrite (): boolean {
        if (DepthStencilStatePool.get(this.h, DepthStencilStateView.DEPTH_WRITE)) return true;
        else return false;
    }
    set depthWrite (val: boolean) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.DEPTH_WRITE, val ? 1 : 0); 
        this._nativeObj.depthWrite = val;
    }
    get depthFunc (): ComparisonFunc { return DepthStencilStatePool.get(this.h, DepthStencilStateView.DEPTH_FUNC); }
    set depthFunc (val: ComparisonFunc) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.DEPTH_FUNC, val); 
        this._nativeObj.depthFunc = val;
    }
    get stencilTestFront (): boolean {
        if (DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_TEST_FRONT)) return true;
        else return false;
    }
    set stencilTestFront (val: boolean) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_TEST_FRONT, val ? 1 : 0); 
        this._nativeObj.stencilTestFront = val;
    }
    get stencilFuncFront (): ComparisonFunc { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_FUNC_FRONT); }
    set stencilFuncFront (val: ComparisonFunc) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_FUNC_FRONT, val); 
        this._nativeObj.stencilFuncFront = val;
    }
    get stencilReadMaskFront (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_READ_MASK_FRONT); }
    set stencilReadMaskFront (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_READ_MASK_FRONT, val);
        this._nativeObj.stencilReadMaskFront = val;
    }
    get stencilWriteMaskFront (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_WRITE_MASK_FRONT); }
    set stencilWriteMaskFront (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_WRITE_MASK_FRONT, val); 
        this._nativeObj.stencilWriteMaskFront = val;
    }
    get stencilFailOpFront (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_FAIL_OP_FRONT); }
    set stencilFailOpFront (val: StencilOp) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_FAIL_OP_FRONT, val); 
        this._nativeObj.stencilFailOpFront = val;
    }
    get stencilZFailOpFront (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_Z_FAIL_OP_FRONT); }
    set stencilZFailOpFront (val: StencilOp) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_Z_FAIL_OP_FRONT, val); 
        this._nativeObj.stencilZFailOpFront = val;
    }
    get stencilPassOpFront (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_PASS_OP_FRONT); }
    set stencilPassOpFront (val: StencilOp) {
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_PASS_OP_FRONT, val);
        this._nativeObj.stencilPassOpFront = val;
    }
    get stencilRefFront (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_REF_FRONT); }
    set stencilRefFront (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_REF_FRONT, val); 
        this._nativeObj.stencilRefFront = val;
    }
    get stencilTestBack (): boolean {
        if (DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_TEST_BACK)) return true;
        else return false;
    }
    set stencilTestBack (val: boolean) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_TEST_BACK, val ? 1 : 0); 
        this._nativeObj.stencilTestBack = val;
    }
    get stencilFuncBack (): ComparisonFunc { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_FUNC_BACK); }
    set stencilFuncBack (val: ComparisonFunc) {
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_FUNC_BACK, val); 
        this._nativeObj.stencilFuncBack = val;
    }
    get stencilReadMaskBack (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_READ_MADK_BACK); }
    set stencilReadMaskBack (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_READ_MADK_BACK, val); 
        this._nativeObj.stencilReadMaskBack = val;
    }
    get stencilWriteMaskBack (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_WRITE_MASK_BACK); }
    set stencilWriteMaskBack (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_WRITE_MASK_BACK, val); 
        this._nativeObj.stencilWriteMaskBack = val;
    }
    get stencilFailOpBack (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_FAIL_OP_BACK); }
    set stencilFailOpBack (val: StencilOp) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_FAIL_OP_BACK, val); 
        this._nativeObj.stencilFailOpBack = val;
    }
    get stencilZFailOpBack (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_Z_FAIL_OP_BACK); }
    set stencilZFailOpBack (val: StencilOp) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_Z_FAIL_OP_BACK, val); 
        this._nativeObj.stencilZFailOpBack = val;
    }
    get stencilPassOpBack (): StencilOp { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_PASS_OP_BACK); }
    set stencilPassOpBack (val: StencilOp) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_PASS_OP_BACK, val); 
        this._nativeObj.stencilPassOpBack = val;
    }
    get stencilRefBack (): number { return DepthStencilStatePool.get(this.h, DepthStencilStateView.STENCIL_REF_BACK); }
    set stencilRefBack (val: number) { 
        DepthStencilStatePool.set(this.h, DepthStencilStateView.STENCIL_REF_BACK, val); 
        this._nativeObj.stencilRefBack = val;
    }
    get handle (): DepthStencilStateHandle { return this.h; }

    public reset () {
        this.assignProperties(true, true, ComparisonFunc.LESS, false, ComparisonFunc.ALWAYS, 0xffff, 0xffff,StencilOp.KEEP,
            StencilOp.KEEP, StencilOp.KEEP, 1, false, ComparisonFunc.ALWAYS, 0xffff, 0xffff, StencilOp.KEEP, StencilOp.KEEP, StencilOp.KEEP, 1);
    }

    public assign (dss: RecursivePartial<DepthStencilState>) {
        if (!dss) return;
        this.assignProperties(dss.depthTest, dss.depthWrite, dss.depthFunc, dss.stencilTestFront, dss.stencilFuncFront, dss.stencilReadMaskFront,
            dss.stencilWriteMaskFront, dss.stencilFailOpFront, dss.stencilZFailOpFront, dss.stencilPassOpFront, dss.stencilRefFront,
            dss.stencilTestBack, dss.stencilFuncBack, dss.stencilReadMaskBack, dss.stencilWriteMaskBack, dss.stencilFailOpBack,
            dss.stencilZFailOpBack, dss.stencilPassOpBack, dss.stencilRefBack);
    }

    public destroy () {
        DepthStencilStatePool.free(this.h);
        this.h = NULL_HANDLE;
        this._nativeObj = null;
    }

    private assignProperties (
        depthTest?: boolean,
        depthWrite?: boolean,
        depthFunc?: ComparisonFunc,
        stencilTestFront?: boolean,
        stencilFuncFront?: ComparisonFunc,
        stencilReadMaskFront?: number,
        stencilWriteMaskFront?: number,
        stencilFailOpFront?: StencilOp,
        stencilZFailOpFront?: StencilOp,
        stencilPassOpFront?: StencilOp,
        stencilRefFront?: number,
        stencilTestBack?: boolean,
        stencilFuncBack?: ComparisonFunc,
        stencilReadMaskBack?: number,
        stencilWriteMaskBack?: number,
        stencilFailOpBack?: StencilOp,
        stencilZFailOpBack?: StencilOp,
        stencilPassOpBack?: StencilOp,
        stencilRefBack?: number
    ) {
        if (depthTest !== undefined) this.depthTest = depthTest;
        if (depthWrite !== undefined) this.depthWrite = depthWrite;
        if (depthFunc !== undefined) this.depthFunc = depthFunc;
        if (stencilTestFront !== undefined) this.stencilTestFront = stencilTestFront;
        if (stencilFuncFront !== undefined) this.stencilFuncFront = stencilFuncFront;
        if (stencilReadMaskFront !== undefined) this.stencilReadMaskFront = stencilReadMaskFront;
        if (stencilWriteMaskFront !== undefined) this.stencilWriteMaskFront = stencilWriteMaskFront;
        if (stencilFailOpFront !== undefined) this.stencilFailOpFront = stencilFailOpFront;
        if (stencilZFailOpFront !== undefined) this.stencilZFailOpFront = stencilZFailOpFront;
        if (stencilPassOpFront !== undefined) this.stencilPassOpFront = stencilPassOpFront;
        if (stencilRefFront !== undefined) this.stencilRefFront = stencilRefFront;
        if (stencilTestBack !== undefined) this.stencilTestBack = stencilTestBack;
        if (stencilFuncBack !== undefined) this.stencilFuncBack = stencilFuncBack;
        if (stencilReadMaskBack !== undefined) this.stencilReadMaskBack = stencilReadMaskBack;
        if (stencilWriteMaskBack !== undefined) this.stencilWriteMaskBack = stencilWriteMaskBack;
        if (stencilFailOpBack !== undefined) this.stencilFailOpBack = stencilFailOpBack;
        if (stencilZFailOpBack !== undefined) this.stencilZFailOpBack = stencilZFailOpBack;
        if (stencilPassOpBack !== undefined) this.stencilPassOpBack = stencilPassOpBack;
        if (stencilRefBack !== undefined) this.stencilRefBack = stencilRefBack;
    }
}

/**
 * @en GFX blend target.
 * @zh GFX 混合目标。
 */
export class BlendTarget {
    private h: BlendTargetHandle;
    protected _nativeObj;

    get native() {
        return this._nativeObj;
    }

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
        this._nativeObj = new gfx.BlendTarget();
        this.h = BlendTargetPool.alloc();
        this.assignProperties(blend, blendSrc, blendDst, blendEq,
            blendSrcAlpha, blendDstAlpha, blendAlphaEq, blendColorMask);
    }

    get blend (): boolean {
        if (BlendTargetPool.get(this.h, BlendTargetView.BLEND)) return true;
        else return false;
    }
    set blend (val: boolean) {
        BlendTargetPool.set(this.h, BlendTargetView.BLEND, val ? 1 : 0);
        this._nativeObj.blend = val;
    }
    get blendSrc (): BlendFactor { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_SRC); }
    set blendSrc (val: BlendFactor) {
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_SRC, val);
        this._nativeObj.blendSrc = val;
    }
    get blendDst () { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_DST); }
    set blendDst (val: BlendFactor) {
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_DST, val);
        this._nativeObj.blendDst = val;
    }
    get blendEq (): BlendOp { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_EQ); }
    set blendEq (val: BlendOp) { 
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_EQ, val); 
        this._nativeObj.blendEq = val;
    }
    get blendSrcAlpha (): BlendFactor { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_SRC_ALPHA); }
    set blendSrcAlpha (val: BlendFactor) {
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_SRC_ALPHA, val); 
        this._nativeObj.blendSrcAlpha = val;
    }
    get blendDstAlpha (): BlendFactor { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_DST_ALPHA); }
    set blendDstAlpha (val: BlendFactor) { 
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_DST_ALPHA, val); 
        this._nativeObj.blendDstAlpha = val;
    }
    get blendAlphaEq (): BlendOp { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_ALPHA_EQ); }
    set blendAlphaEq (val: BlendOp) {
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_ALPHA_EQ, val); 
        this._nativeObj.blendAlphaEq = val;
    }
    get blendColorMask (): ColorMask { return BlendTargetPool.get(this.h, BlendTargetView.BLEND_COLOR_MASK); }
    set blendColorMask (val: ColorMask) { 
        BlendTargetPool.set(this.h, BlendTargetView.BLEND_COLOR_MASK, val); 
        this._nativeObj.blendColorMask = val;
    }
    get handle (): BlendTargetHandle { return this.h; }

    public reset () {
        this.assignProperties(false, BlendFactor.ONE, BlendFactor.ZERO, BlendOp.ADD,
            BlendFactor.ONE, BlendFactor.ZERO, BlendOp.ADD, ColorMask.ALL);
    }

    public destroy () {
        BlendTargetPool.free(this.h);
        this.h = NULL_HANDLE;
        this._nativeObj = null;
    }

    public assign (target: RecursivePartial<BlendTarget>) {
        if (!target) return;
        this.assignProperties(target.blend, target.blendSrc, target.blendDst, target.blendEq,
            target.blendSrcAlpha, target.blendDstAlpha, target.blendAlphaEq, target.blendColorMask);
    }

    private assignProperties (
        blend?: boolean,
        blendSrc?: BlendFactor,
        blendDst?: BlendFactor,
        blendEq?: BlendOp,
        blendSrcAlpha?: BlendFactor,
        blendDstAlpha?: BlendFactor,
        blendAlphaEq?: BlendOp,
        blendColorMask?: ColorMask
    ) {
        if (blend !== undefined) this.blend = blend;
        if (blendSrc !== undefined) this.blendSrc = blendSrc;
        if (blendDst !== undefined) this.blendDst = blendDst;
        if (blendEq !== undefined) this.blendEq = blendEq;
        if (blendSrcAlpha !== undefined) this.blendSrcAlpha = blendSrcAlpha;
        if (blendDstAlpha !== undefined) this.blendDstAlpha = blendDstAlpha;
        if (blendAlphaEq !== undefined) this.blendAlphaEq = blendAlphaEq;
        if (blendColorMask !== undefined) this.blendColorMask = blendColorMask;
    }
}

export class BlendState {
    private h: BlendStateHandle;
    private hBt: BlendTargetArrayHandle;
    private targets: BlendTarget[];
    private _blendColor: Color;
    protected _nativeObj;

    private _setTargets(targets: BlendTarget[]) {
        this.targets = targets;
        const nativeTars = targets.map(target => target.native);
        this._nativeObj.targets = nativeTars;
    }

    get native() {
        return this._nativeObj;
    }

    constructor (
        isA2C: boolean = false,
        isIndepend: boolean = false,
        blendColor: Color = new Color(),
        targets: BlendTarget[] = [new BlendTarget()],
    ) {
        this._nativeObj = new gfx.BlendState();
        this.h = BlendStatePool.alloc();
        this._setTargets(targets);
        this.blendColor = blendColor;
        this.isA2c = isA2C;
        this.isIndepend = isIndepend;
        this.blendColor = blendColor

        this.hBt = BlendTargetArrayPool.alloc();
        BlendStatePool.set(this.h, BlendStateView.BLEND_TARGET, this.hBt);
        for (let i = 0, len = targets.length; i < len; ++i) {
            BlendTargetArrayPool.push(this.hBt, targets[i].handle);
        }
    }

    get isA2c (): boolean {
        if (BlendStatePool.get(this.h, BlendStateView.IS_A2C)) return true;
        else return false;
    }
    set isA2c (val: boolean) {
        BlendStatePool.set(this.h, BlendStateView.IS_A2C, val ? 1 : 0);
        this._nativeObj.isA2C = val;
    }
    get isIndepend (): boolean {
        if (BlendStatePool.get(this.h, BlendStateView.IS_INDEPEND)) return true;
        else return false;
    }
    set isIndepend (val: boolean) { 
        BlendStatePool.set(this.h, BlendStateView.IS_INDEPEND, val ? 1 : 0); 
        this._nativeObj.isIndepend = val;
    }
    get blendColor (): Color { return this._blendColor; }
    set blendColor (color: Color) {
        this._blendColor = color;
        BlendStatePool.setVec4(this.h, BlendStateView.BLEND_COLOR, color);
        this._nativeObj.blendColor = color;
    }
    get handle (): BlendStateHandle { return this.h; }

    /**
     * @en Should use this function to set target, or it will not work
     * on native platforms, as native can not support this feature,
     * such as `blendState[i] = target;`.
     *
     * @param index The index to set target.
     * @param target The target to be set.
     */
    public setTarget (index: number, target: RecursivePartial<BlendTarget>) {
        let tg = this.targets[index];
        if (!tg) {
            tg = this.targets[index] = new BlendTarget();
            BlendTargetArrayPool.assign(this.hBt, index, tg.handle)
        }
        tg.assign(target);
        // TODO: define setTarget function
        this._setTargets(this.targets);
    }

    public reset () {
        this.isA2c = false;
        this.isIndepend = false;
        this.blendColor = new Color(0, 0, 0, 0);

        const targets = this.targets;
        for (let i = 1, len = targets.length; i < len; ++i) {
            targets[i].destroy();
        }
        targets.length = 1;
        targets[0].reset();
        BlendTargetArrayPool.clear(this.hBt);
        BlendTargetArrayPool.push(this.hBt, targets[0].handle);
        this._setTargets(targets);
    }

    public destroy () {
        BlendStatePool.free(this.h);
        this.h = NULL_HANDLE;

        BlendTargetArrayPool.free(this.hBt);
        this.hBt = NULL_HANDLE;

        for (let i = 0, len = this.targets.length; i < len; ++i) {
            this.targets[i].destroy();
        }
        this.targets = null;
        this._nativeObj = null;
    }
}

export const PipelineState = gfx.PipelineState;
export const PipelineStateInfo = gfx.PipelineStateInfo;
