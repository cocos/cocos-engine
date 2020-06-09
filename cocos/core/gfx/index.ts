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
import { legacyCC } from '../global-exports';

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
export * from './texture';
export * from './window';

legacyCC.GFXDevice = GFXDevice;
legacyCC.GFXBuffer = GFXBuffer;
legacyCC.GFXTexture = GFXTexture;
legacyCC.GFXSampler = GFXSampler;
legacyCC.GFXShader = GFXShader;
legacyCC.GFXInputAssembler = GFXInputAssembler;
legacyCC.GFXRenderPass = GFXRenderPass;
legacyCC.GFXFramebuffer = GFXFramebuffer;
legacyCC.GFXPipelineLayout = GFXPipelineLayout;
legacyCC.GFXPipelineState = GFXPipelineState;
legacyCC.GFXCommandBuffer = GFXCommandBuffer;
legacyCC.GFXQueue = GFXQueue;

Object.assign(legacyCC, GFXDefines);
