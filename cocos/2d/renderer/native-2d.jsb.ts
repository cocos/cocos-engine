import type {
    NativeRenderDrawInfo as N2dNativeRenderDrawInfo,
    NativeBatcher2d as N2dNativeBatcher2d,
    NativeUIMeshBuffer as N2dNativeUIMeshBuffer,
    NativeRenderEntity as N2dNativeRenderEntity,
    NativeUIModelProxy as N2dNativeUIModelProxy,
    NativeStencilManager as N2dNativeStencilManager,
} from './native-2d';

// 2d
declare const n2d: any;

export const NativeRenderDrawInfo: typeof N2dNativeRenderDrawInfo = n2d.RenderDrawInfo;
export type NativeRenderDrawInfo = N2dNativeRenderDrawInfo;
export const NativeBatcher2d: typeof N2dNativeBatcher2d = n2d.Batcher2d;
export type NativeBatcher2d = N2dNativeBatcher2d;
export const NativeUIMeshBuffer: typeof N2dNativeUIMeshBuffer = n2d.UIMeshBuffer;
export type NativeUIMeshBuffer = N2dNativeUIMeshBuffer;
export const NativeRenderEntity: typeof N2dNativeRenderEntity = n2d.RenderEntity;
export type NativeRenderEntity = N2dNativeRenderEntity;
export const NativeUIModelProxy: typeof N2dNativeUIModelProxy = n2d.UIModelProxy;
export type NativeUIModelProxy = N2dNativeUIModelProxy;
export const NativeStencilManager: typeof N2dNativeStencilManager = n2d.StencilManager;
export type NativeStencilManager = N2dNativeStencilManager;