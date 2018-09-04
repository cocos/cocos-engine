import gfx from '../gfx';

export const gfxFilters = {
  'linear': gfx.FILTER_LINEAR,
  'nearest': gfx.FILTER_NEAREST,
};

export const gfxWraps = {
  'repeat': gfx.WRAP_REPEAT,
  'clamp': gfx.WRAP_CLAMP,
  'mirror': gfx.WRAP_MIRROR,
};

export const gfxTextureFmts = {
  // compress formats
  'rgb-dxt1': gfx.TEXTURE_FMT_RGB_DXT1,
  'rgba-dxt1': gfx.TEXTURE_FMT_RGBA_DXT1,
  'rgba-dxt3': gfx.TEXTURE_FMT_RGBA_DXT3,
  'rgba-dxt5': gfx.TEXTURE_FMT_RGBA_DXT5,
  'rgb-etc1': gfx.TEXTURE_FMT_RGB_ETC1,
  'rgb-pvrtc-2bppv1': gfx.TEXTURE_FMT_RGB_PVRTC_2BPPV1,
  'rgba-pvrtc-2bppv1': gfx.TEXTURE_FMT_RGBA_PVRTC_2BPPV1,
  'rgb-pvrtc-4bppv1': gfx.TEXTURE_FMT_RGB_PVRTC_4BPPV1,
  'rgba-pvrtc-4bppv1': gfx.TEXTURE_FMT_RGBA_PVRTC_4BPPV1,

  // normal formats
  'a8': gfx.TEXTURE_FMT_A8,
  'l8': gfx.TEXTURE_FMT_L8,
  'l8-a8': gfx.TEXTURE_FMT_L8_A8,
  'r5-g6-b5': gfx.TEXTURE_FMT_R5_G6_B5,
  'r5-g5-b5-a1': gfx.TEXTURE_FMT_R5_G5_B5_A1,
  'r4-g4-b4-a4': gfx.TEXTURE_FMT_R4_G4_B4_A4,
  'rgb8': gfx.TEXTURE_FMT_RGB8,
  'rgba8': gfx.TEXTURE_FMT_RGBA8,
  'rgb16f': gfx.TEXTURE_FMT_RGB16F,
  'rgba16f': gfx.TEXTURE_FMT_RGBA16F,
  'rgb32f': gfx.TEXTURE_FMT_RGB32F,
  'rgba32f': gfx.TEXTURE_FMT_RGBA32F,
  'r32f': gfx.TEXTURE_FMT_R32F,
  '111110f': gfx.TEXTURE_FMT_111110F,
  'srgb': gfx.TEXTURE_FMT_SRGB,
  'srgba': gfx.TEXTURE_FMT_SRGBA,

  // depth formats
  'd16': gfx.TEXTURE_FMT_D16,
  'd32': gfx.TEXTURE_FMT_D32,
  'd24s8': gfx.TEXTURE_FMT_D24S8,
};