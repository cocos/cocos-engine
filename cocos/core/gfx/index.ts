/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXCommandBuffer } from './command-buffer';
import * as GFXDefines from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineLayout } from './pipeline-layout';
import { GFXPipelineState } from './pipeline-state';
import { GFXQueue } from './queue';
import { GFXRenderPass } from './render-pass';
import { GFXSampler } from './sampler';
import { GFXShader } from './shader';
import { GFXTexture } from './texture';
import { GFXTextureView } from './texture-view';
import { legacyGlobalExports } from '../global-exports';

export * from './binding-layout';
export * from './buffer';
export * from './command-allocator';
export * from './command-buffer';
export * from './define';
export * from './device';
export * from './framebuffer';
export * from './input-assembler';
export * from './pipeline-layout';
export * from './pipeline-state';
export * from './queue';
export * from './render-pass';
export * from './sampler';
export * from './shader';
export * from './texture-view';
export * from './texture';
export * from './window';

legacyGlobalExports.GFXDevice = GFXDevice;
legacyGlobalExports.GFXBuffer = GFXBuffer;
legacyGlobalExports.GFXTexture = GFXTexture;
legacyGlobalExports.GFXTextureView = GFXTextureView;
legacyGlobalExports.GFXSampler = GFXSampler;
legacyGlobalExports.GFXShader = GFXShader;
legacyGlobalExports.GFXInputAssembler = GFXInputAssembler;
legacyGlobalExports.GFXRenderPass = GFXRenderPass;
legacyGlobalExports.GFXFramebuffer = GFXFramebuffer;
legacyGlobalExports.GFXPipelineLayout = GFXPipelineLayout;
legacyGlobalExports.GFXPipelineState = GFXPipelineState;
legacyGlobalExports.GFXCommandBuffer = GFXCommandBuffer;
legacyGlobalExports.GFXQueue = GFXQueue;

Object.assign(legacyGlobalExports, GFXDefines);
