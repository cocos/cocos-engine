interface EXT_color_buffer_float {}

interface EXT_disjoint_timer_query_webgl2 {
    readonly QUERY_COUNTER_BITS_EXT: GLenum;
    readonly TIME_ELAPSED_EXT: GLenum;
    readonly TIMESTAMP_EXT: GLenum;
    readonly GPU_DISJOINT_EXT: GLenum;

    queryCounterEXT(query: WebGLQuery, target: GLenum): void;
}

interface WEBGL_texture_storage_multisample {
    readonly TEXTURE_2D_MULTISAMPLE: number;

    texStorage2DMultisample(
        target: GLenum,
        samples: GLsizei,
        internalformat: GLenum,
        width: GLsizei,
        height: GLsizei,
        fixedsamplelocations: GLboolean): void;
}
