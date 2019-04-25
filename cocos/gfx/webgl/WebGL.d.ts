interface EXT_color_buffer_half_float {
    readonly RGBA16F_EXT: GLenum;
    readonly RGB16F_EXT: GLenum;
    readonly FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT: GLenum;
    readonly UNSIGNED_NORMALIZED_EXT: GLenum;
}

// note that ETC1 is not supported with the compressedTexSubImage2D() method
interface WEBGL_compressed_texture_etc1 {
    readonly COMPRESSED_RGB_ETC1_WEBGL: GLenum;
}

interface WEBGL_compressed_texture_etc {
    readonly COMPRESSED_R11_EAC: GLenum;
    readonly COMPRESSED_SIGNED_R11_EAC: GLenum;
    readonly COMPRESSED_RG11_EAC: GLenum;
    readonly COMPRESSED_SIGNED_RG11_EAC: GLenum;
    readonly COMPRESSED_RGB8_ETC2: GLenum;
    readonly COMPRESSED_RGBA8_ETC2_EAC: GLenum;
    readonly COMPRESSED_SRGB8_ETC2: GLenum;
    readonly COMPRESSED_SRGB8_ALPHA8_ETC2_EAC: GLenum;
    readonly COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2: GLenum;
    readonly COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2: GLenum;
}

interface WEBGL_compressed_texture_pvrtc {
    readonly COMPRESSED_RGB_PVRTC_4BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGBA_PVRTC_4BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGB_PVRTC_2BPPV1_IMG: GLenum;
    readonly COMPRESSED_RGBA_PVRTC_2BPPV1_IMG: GLenum;
}