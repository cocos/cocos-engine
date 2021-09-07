/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Format, ComparisonFunc, Address, Filter } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export function toWGPUNativeFormat (format: Format): wgpuWasmModule.Format | undefined {
    switch (format) {
        case Format.RGBA8:
            return wgpuWasmModule.Format.RGBA8;
        case Format.BGRA8:
            return wgpuWasmModule.Format.BGRA8;
        case Format.DEPTH:
            return wgpuWasmModule.Format.DEPTH;
        case Format.DEPTH_STENCIL:
            return wgpuWasmModule.Format.DEPTH_STENCIL;
        default:
            console.log('unsupport format');
    }
}

export function toWGPUNativeFilter (filter: Filter): wgpuWasmModule.Filter | undefined {
    switch (filter) {
        case Filter.NONE:
            return wgpuWasmModule.Filter.NONE;
        case Filter.POINT:
            return wgpuWasmModule.Filter.POINT;
        case Filter.LINEAR:
            return wgpuWasmModule.Filter.LINEAR;
        case Filter.ANISOTROPIC:
            return wgpuWasmModule.Filter.ANISOTROPIC;
        default:
            console.log('unsupport filter');
    }
}

export function toWGPUNativeAddressMode (address: Address): wgpuWasmModule.Address | undefined {
    switch (address) {
        case Address.WRAP:
            return wgpuWasmModule.Address.WRAP;
        case Address.MIRROR:
            return wgpuWasmModule.Address.MIRROR;
        case Address.CLAMP:
            return wgpuWasmModule.Address.CLAMP;
        case Address.BORDER:
            return wgpuWasmModule.Address.BORDER;
        default:
            console.log('unsupport address mode');
    }
}

// NEVER,
// LESS,
// EQUAL,
// LESS_EQUAL,
// GREATER,
// NOT_EQUAL,
// GREATER_EQUAL,
// ALWAYS,

export function toWGPUNativeCompareFunc (cmpFunc: ComparisonFunc): wgpuWasmModule.ComparisonFunc | undefined {
    switch (cmpFunc) {
        case ComparisonFunc.NEVER:
            return wgpuWasmModule.ComparisonFunc.NEVER;
        case ComparisonFunc.LESS:
            return wgpuWasmModule.ComparisonFunc.LESS;
        case ComparisonFunc.EQUAL:
            return wgpuWasmModule.ComparisonFunc.EQUAL;
        case ComparisonFunc.LESS_EQUAL:
            return wgpuWasmModule.ComparisonFunc.LESS_EQUAL;
        case ComparisonFunc.GREATER:
            return wgpuWasmModule.ComparisonFunc.GREATER;
        case ComparisonFunc.NOT_EQUAL:
            return wgpuWasmModule.ComparisonFunc.NOT_EQUAL;
        case ComparisonFunc.GREATER_EQUAL:
            return wgpuWasmModule.ComparisonFunc.GREATER_EQUAL;
        case ComparisonFunc.ALWAYS:
            return wgpuWasmModule.ComparisonFunc.ALWAYS;
        default:
            console.log('unsupport compare func');
    }
}
