/****************************************************************************
 Copyright (c) 2019-2021 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
****************************************************************************/

#pragma once

#ifndef __OHOS__
    #define GL_GLES_PROTOTYPES 0
    #include <GLES2/gl2.h>
    #include <GLES2/gl2ext.h>
#else
    #define GL_GLES_PROTOTYPES 0
    #include <GLES3/gl32.h> //OHOS
    #include "patch/gl2ext.h"
#endif

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated from GLES spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */

/* GLES2W_GENERATE_GLES_DECLARATION */
/* GL_ES_VERSION_2_0 */
extern PFNGLACTIVETEXTUREPROC                       glActiveTexture;
extern PFNGLATTACHSHADERPROC                        glAttachShader;
extern PFNGLBINDATTRIBLOCATIONPROC                  glBindAttribLocation;
extern PFNGLBINDBUFFERPROC                          glBindBuffer;
extern PFNGLBINDFRAMEBUFFERPROC                     glBindFramebuffer;
extern PFNGLBINDRENDERBUFFERPROC                    glBindRenderbuffer;
extern PFNGLBINDTEXTUREPROC                         glBindTexture;
extern PFNGLBLENDCOLORPROC                          glBlendColor;
extern PFNGLBLENDEQUATIONPROC                       glBlendEquation;
extern PFNGLBLENDEQUATIONSEPARATEPROC               glBlendEquationSeparate;
extern PFNGLBLENDFUNCPROC                           glBlendFunc;
extern PFNGLBLENDFUNCSEPARATEPROC                   glBlendFuncSeparate;
extern PFNGLBUFFERDATAPROC                          glBufferData;
extern PFNGLBUFFERSUBDATAPROC                       glBufferSubData;
extern PFNGLCHECKFRAMEBUFFERSTATUSPROC              glCheckFramebufferStatus;
extern PFNGLCLEARPROC                               glClear;
extern PFNGLCLEARCOLORPROC                          glClearColor;
extern PFNGLCLEARDEPTHFPROC                         glClearDepthf;
extern PFNGLCLEARSTENCILPROC                        glClearStencil;
extern PFNGLCOLORMASKPROC                           glColorMask;
extern PFNGLCOMPILESHADERPROC                       glCompileShader;
extern PFNGLCOMPRESSEDTEXIMAGE2DPROC                glCompressedTexImage2D;
extern PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC             glCompressedTexSubImage2D;
extern PFNGLCOPYTEXIMAGE2DPROC                      glCopyTexImage2D;
extern PFNGLCOPYTEXSUBIMAGE2DPROC                   glCopyTexSubImage2D;
extern PFNGLCREATEPROGRAMPROC                       glCreateProgram;
extern PFNGLCREATESHADERPROC                        glCreateShader;
extern PFNGLCULLFACEPROC                            glCullFace;
extern PFNGLDELETEBUFFERSPROC                       glDeleteBuffers;
extern PFNGLDELETEFRAMEBUFFERSPROC                  glDeleteFramebuffers;
extern PFNGLDELETEPROGRAMPROC                       glDeleteProgram;
extern PFNGLDELETERENDERBUFFERSPROC                 glDeleteRenderbuffers;
extern PFNGLDELETESHADERPROC                        glDeleteShader;
extern PFNGLDELETETEXTURESPROC                      glDeleteTextures;
extern PFNGLDEPTHFUNCPROC                           glDepthFunc;
extern PFNGLDEPTHMASKPROC                           glDepthMask;
extern PFNGLDEPTHRANGEFPROC                         glDepthRangef;
extern PFNGLDETACHSHADERPROC                        glDetachShader;
extern PFNGLDISABLEPROC                             glDisable;
extern PFNGLDISABLEVERTEXATTRIBARRAYPROC            glDisableVertexAttribArray;
extern PFNGLDRAWARRAYSPROC                          glDrawArrays;
extern PFNGLDRAWELEMENTSPROC                        glDrawElements;
extern PFNGLENABLEPROC                              glEnable;
extern PFNGLENABLEVERTEXATTRIBARRAYPROC             glEnableVertexAttribArray;
extern PFNGLFINISHPROC                              glFinish;
extern PFNGLFLUSHPROC                               glFlush;
extern PFNGLFRAMEBUFFERRENDERBUFFERPROC             glFramebufferRenderbuffer;
extern PFNGLFRAMEBUFFERTEXTURE2DPROC                glFramebufferTexture2D;
extern PFNGLFRONTFACEPROC                           glFrontFace;
extern PFNGLGENBUFFERSPROC                          glGenBuffers;
extern PFNGLGENERATEMIPMAPPROC                      glGenerateMipmap;
extern PFNGLGENFRAMEBUFFERSPROC                     glGenFramebuffers;
extern PFNGLGENRENDERBUFFERSPROC                    glGenRenderbuffers;
extern PFNGLGENTEXTURESPROC                         glGenTextures;
extern PFNGLGETACTIVEATTRIBPROC                     glGetActiveAttrib;
extern PFNGLGETACTIVEUNIFORMPROC                    glGetActiveUniform;
extern PFNGLGETATTACHEDSHADERSPROC                  glGetAttachedShaders;
extern PFNGLGETATTRIBLOCATIONPROC                   glGetAttribLocation;
extern PFNGLGETBOOLEANVPROC                         glGetBooleanv;
extern PFNGLGETBUFFERPARAMETERIVPROC                glGetBufferParameteriv;
extern PFNGLGETERRORPROC                            glGetError;
extern PFNGLGETFLOATVPROC                           glGetFloatv;
extern PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC glGetFramebufferAttachmentParameteriv;
extern PFNGLGETINTEGERVPROC                         glGetIntegerv;
extern PFNGLGETPROGRAMIVPROC                        glGetProgramiv;
extern PFNGLGETPROGRAMINFOLOGPROC                   glGetProgramInfoLog;
extern PFNGLGETRENDERBUFFERPARAMETERIVPROC          glGetRenderbufferParameteriv;
extern PFNGLGETSHADERIVPROC                         glGetShaderiv;
extern PFNGLGETSHADERINFOLOGPROC                    glGetShaderInfoLog;
extern PFNGLGETSHADERPRECISIONFORMATPROC            glGetShaderPrecisionFormat;
extern PFNGLGETSHADERSOURCEPROC                     glGetShaderSource;
extern PFNGLGETSTRINGPROC                           glGetString;
extern PFNGLGETTEXPARAMETERFVPROC                   glGetTexParameterfv;
extern PFNGLGETTEXPARAMETERIVPROC                   glGetTexParameteriv;
extern PFNGLGETUNIFORMFVPROC                        glGetUniformfv;
extern PFNGLGETUNIFORMIVPROC                        glGetUniformiv;
extern PFNGLGETUNIFORMLOCATIONPROC                  glGetUniformLocation;
extern PFNGLGETVERTEXATTRIBFVPROC                   glGetVertexAttribfv;
extern PFNGLGETVERTEXATTRIBIVPROC                   glGetVertexAttribiv;
extern PFNGLGETVERTEXATTRIBPOINTERVPROC             glGetVertexAttribPointerv;
extern PFNGLHINTPROC                                glHint;
extern PFNGLISBUFFERPROC                            glIsBuffer;
extern PFNGLISENABLEDPROC                           glIsEnabled;
extern PFNGLISFRAMEBUFFERPROC                       glIsFramebuffer;
extern PFNGLISPROGRAMPROC                           glIsProgram;
extern PFNGLISRENDERBUFFERPROC                      glIsRenderbuffer;
extern PFNGLISSHADERPROC                            glIsShader;
extern PFNGLISTEXTUREPROC                           glIsTexture;
extern PFNGLLINEWIDTHPROC                           glLineWidth;
extern PFNGLLINKPROGRAMPROC                         glLinkProgram;
extern PFNGLPIXELSTOREIPROC                         glPixelStorei;
extern PFNGLPOLYGONOFFSETPROC                       glPolygonOffset;
extern PFNGLREADPIXELSPROC                          glReadPixels;
extern PFNGLRELEASESHADERCOMPILERPROC               glReleaseShaderCompiler;
extern PFNGLRENDERBUFFERSTORAGEPROC                 glRenderbufferStorage;
extern PFNGLSAMPLECOVERAGEPROC                      glSampleCoverage;
extern PFNGLSCISSORPROC                             glScissor;
extern PFNGLSHADERBINARYPROC                        glShaderBinary;
extern PFNGLSHADERSOURCEPROC                        glShaderSource;
extern PFNGLSTENCILFUNCPROC                         glStencilFunc;
extern PFNGLSTENCILFUNCSEPARATEPROC                 glStencilFuncSeparate;
extern PFNGLSTENCILMASKPROC                         glStencilMask;
extern PFNGLSTENCILMASKSEPARATEPROC                 glStencilMaskSeparate;
extern PFNGLSTENCILOPPROC                           glStencilOp;
extern PFNGLSTENCILOPSEPARATEPROC                   glStencilOpSeparate;
extern PFNGLTEXIMAGE2DPROC                          glTexImage2D;
extern PFNGLTEXPARAMETERFPROC                       glTexParameterf;
extern PFNGLTEXPARAMETERFVPROC                      glTexParameterfv;
extern PFNGLTEXPARAMETERIPROC                       glTexParameteri;
extern PFNGLTEXPARAMETERIVPROC                      glTexParameteriv;
extern PFNGLTEXSUBIMAGE2DPROC                       glTexSubImage2D;
extern PFNGLUNIFORM1FPROC                           glUniform1f;
extern PFNGLUNIFORM1FVPROC                          glUniform1fv;
extern PFNGLUNIFORM1IPROC                           glUniform1i;
extern PFNGLUNIFORM1IVPROC                          glUniform1iv;
extern PFNGLUNIFORM2FPROC                           glUniform2f;
extern PFNGLUNIFORM2FVPROC                          glUniform2fv;
extern PFNGLUNIFORM2IPROC                           glUniform2i;
extern PFNGLUNIFORM2IVPROC                          glUniform2iv;
extern PFNGLUNIFORM3FPROC                           glUniform3f;
extern PFNGLUNIFORM3FVPROC                          glUniform3fv;
extern PFNGLUNIFORM3IPROC                           glUniform3i;
extern PFNGLUNIFORM3IVPROC                          glUniform3iv;
extern PFNGLUNIFORM4FPROC                           glUniform4f;
extern PFNGLUNIFORM4FVPROC                          glUniform4fv;
extern PFNGLUNIFORM4IPROC                           glUniform4i;
extern PFNGLUNIFORM4IVPROC                          glUniform4iv;
extern PFNGLUNIFORMMATRIX2FVPROC                    glUniformMatrix2fv;
extern PFNGLUNIFORMMATRIX3FVPROC                    glUniformMatrix3fv;
extern PFNGLUNIFORMMATRIX4FVPROC                    glUniformMatrix4fv;
extern PFNGLUSEPROGRAMPROC                          glUseProgram;
extern PFNGLVALIDATEPROGRAMPROC                     glValidateProgram;
extern PFNGLVERTEXATTRIB1FPROC                      glVertexAttrib1f;
extern PFNGLVERTEXATTRIB1FVPROC                     glVertexAttrib1fv;
extern PFNGLVERTEXATTRIB2FPROC                      glVertexAttrib2f;
extern PFNGLVERTEXATTRIB2FVPROC                     glVertexAttrib2fv;
extern PFNGLVERTEXATTRIB3FPROC                      glVertexAttrib3f;
extern PFNGLVERTEXATTRIB3FVPROC                     glVertexAttrib3fv;
extern PFNGLVERTEXATTRIB4FPROC                      glVertexAttrib4f;
extern PFNGLVERTEXATTRIB4FVPROC                     glVertexAttrib4fv;
extern PFNGLVERTEXATTRIBPOINTERPROC                 glVertexAttribPointer;
extern PFNGLVIEWPORTPROC                            glViewport;

#if defined(GL_AMD_framebuffer_multisample_advanced)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEADVANCEDAMDPROC      glRenderbufferStorageMultisampleAdvancedAMD;
extern PFNGLNAMEDRENDERBUFFERSTORAGEMULTISAMPLEADVANCEDAMDPROC glNamedRenderbufferStorageMultisampleAdvancedAMD;
#endif /* defined(GL_AMD_framebuffer_multisample_advanced) */

#if defined(GL_AMD_performance_monitor)
extern PFNGLGETPERFMONITORGROUPSAMDPROC        glGetPerfMonitorGroupsAMD;
extern PFNGLGETPERFMONITORCOUNTERSAMDPROC      glGetPerfMonitorCountersAMD;
extern PFNGLGETPERFMONITORGROUPSTRINGAMDPROC   glGetPerfMonitorGroupStringAMD;
extern PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC glGetPerfMonitorCounterStringAMD;
extern PFNGLGETPERFMONITORCOUNTERINFOAMDPROC   glGetPerfMonitorCounterInfoAMD;
extern PFNGLGENPERFMONITORSAMDPROC             glGenPerfMonitorsAMD;
extern PFNGLDELETEPERFMONITORSAMDPROC          glDeletePerfMonitorsAMD;
extern PFNGLSELECTPERFMONITORCOUNTERSAMDPROC   glSelectPerfMonitorCountersAMD;
extern PFNGLBEGINPERFMONITORAMDPROC            glBeginPerfMonitorAMD;
extern PFNGLENDPERFMONITORAMDPROC              glEndPerfMonitorAMD;
extern PFNGLGETPERFMONITORCOUNTERDATAAMDPROC   glGetPerfMonitorCounterDataAMD;
#endif /* defined(GL_AMD_performance_monitor) */

#if defined(GL_ANGLE_framebuffer_blit)
extern PFNGLBLITFRAMEBUFFERANGLEPROC glBlitFramebufferANGLE;
#endif /* defined(GL_ANGLE_framebuffer_blit) */

#if defined(GL_ANGLE_framebuffer_multisample)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEANGLEPROC glRenderbufferStorageMultisampleANGLE;
#endif /* defined(GL_ANGLE_framebuffer_multisample) */

#if defined(GL_ANGLE_instanced_arrays)
extern PFNGLDRAWARRAYSINSTANCEDANGLEPROC   glDrawArraysInstancedANGLE;
extern PFNGLDRAWELEMENTSINSTANCEDANGLEPROC glDrawElementsInstancedANGLE;
extern PFNGLVERTEXATTRIBDIVISORANGLEPROC   glVertexAttribDivisorANGLE;
#endif /* defined(GL_ANGLE_instanced_arrays) */

#if defined(GL_ANGLE_translated_shader_source)
extern PFNGLGETTRANSLATEDSHADERSOURCEANGLEPROC glGetTranslatedShaderSourceANGLE;
#endif /* defined(GL_ANGLE_translated_shader_source) */

#if defined(GL_APPLE_copy_texture_levels)
extern PFNGLCOPYTEXTURELEVELSAPPLEPROC glCopyTextureLevelsAPPLE;
#endif /* defined(GL_APPLE_copy_texture_levels) */

#if defined(GL_APPLE_framebuffer_multisample)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEAPPLEPROC glRenderbufferStorageMultisampleAPPLE;
extern PFNGLRESOLVEMULTISAMPLEFRAMEBUFFERAPPLEPROC  glResolveMultisampleFramebufferAPPLE;
#endif /* defined(GL_APPLE_framebuffer_multisample) */

#if defined(GL_APPLE_sync)
extern PFNGLFENCESYNCAPPLEPROC      glFenceSyncAPPLE;
extern PFNGLISSYNCAPPLEPROC         glIsSyncAPPLE;
extern PFNGLDELETESYNCAPPLEPROC     glDeleteSyncAPPLE;
extern PFNGLCLIENTWAITSYNCAPPLEPROC glClientWaitSyncAPPLE;
extern PFNGLWAITSYNCAPPLEPROC       glWaitSyncAPPLE;
extern PFNGLGETINTEGER64VAPPLEPROC  glGetInteger64vAPPLE;
extern PFNGLGETSYNCIVAPPLEPROC      glGetSyncivAPPLE;
#endif /* defined(GL_APPLE_sync) */

#if defined(GL_EXT_EGL_image_storage)
extern PFNGLEGLIMAGETARGETTEXSTORAGEEXTPROC glEGLImageTargetTexStorageEXT;

extern PFNGLEGLIMAGETARGETTEXTURESTORAGEEXTPROC glEGLImageTargetTextureStorageEXT;
#endif /* defined(GL_EXT_EGL_image_storage) */

#if defined(GL_EXT_base_instance)
extern PFNGLDRAWARRAYSINSTANCEDBASEINSTANCEEXTPROC             glDrawArraysInstancedBaseInstanceEXT;
extern PFNGLDRAWELEMENTSINSTANCEDBASEINSTANCEEXTPROC           glDrawElementsInstancedBaseInstanceEXT;
extern PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXBASEINSTANCEEXTPROC glDrawElementsInstancedBaseVertexBaseInstanceEXT;
#endif /* defined(GL_EXT_base_instance) */

#if defined(GL_EXT_blend_func_extended)
extern PFNGLBINDFRAGDATALOCATIONINDEXEDEXTPROC     glBindFragDataLocationIndexedEXT;
extern PFNGLBINDFRAGDATALOCATIONEXTPROC            glBindFragDataLocationEXT;
extern PFNGLGETPROGRAMRESOURCELOCATIONINDEXEXTPROC glGetProgramResourceLocationIndexEXT;
extern PFNGLGETFRAGDATAINDEXEXTPROC                glGetFragDataIndexEXT;
#endif /* defined(GL_EXT_blend_func_extended) */

#if defined(GL_EXT_buffer_storage)
extern PFNGLBUFFERSTORAGEEXTPROC glBufferStorageEXT;
#endif /* defined(GL_EXT_buffer_storage) */

#if defined(GL_EXT_clear_texture)
extern PFNGLCLEARTEXIMAGEEXTPROC    glClearTexImageEXT;
extern PFNGLCLEARTEXSUBIMAGEEXTPROC glClearTexSubImageEXT;
#endif /* defined(GL_EXT_clear_texture) */

#if defined(GL_EXT_clip_control)
extern PFNGLCLIPCONTROLEXTPROC glClipControlEXT;
#endif /* defined(GL_EXT_clip_control) */

#if defined(GL_EXT_copy_image)
extern PFNGLCOPYIMAGESUBDATAEXTPROC glCopyImageSubDataEXT;
#endif /* defined(GL_EXT_copy_image) */

#if defined(GL_EXT_debug_label)
extern PFNGLLABELOBJECTEXTPROC    glLabelObjectEXT;
extern PFNGLGETOBJECTLABELEXTPROC glGetObjectLabelEXT;
#endif /* defined(GL_EXT_debug_label) */

#if defined(GL_EXT_debug_marker)
extern PFNGLINSERTEVENTMARKEREXTPROC glInsertEventMarkerEXT;
extern PFNGLPUSHGROUPMARKEREXTPROC   glPushGroupMarkerEXT;
extern PFNGLPOPGROUPMARKEREXTPROC    glPopGroupMarkerEXT;
#endif /* defined(GL_EXT_debug_marker) */

#if defined(GL_EXT_discard_framebuffer)
extern PFNGLDISCARDFRAMEBUFFEREXTPROC glDiscardFramebufferEXT;
#endif /* defined(GL_EXT_discard_framebuffer) */

#if defined(GL_EXT_disjoint_timer_query)
extern PFNGLGENQUERIESEXTPROC          glGenQueriesEXT;
extern PFNGLDELETEQUERIESEXTPROC       glDeleteQueriesEXT;
extern PFNGLISQUERYEXTPROC             glIsQueryEXT;
extern PFNGLBEGINQUERYEXTPROC          glBeginQueryEXT;
extern PFNGLENDQUERYEXTPROC            glEndQueryEXT;
extern PFNGLQUERYCOUNTEREXTPROC        glQueryCounterEXT;
extern PFNGLGETQUERYIVEXTPROC          glGetQueryivEXT;
extern PFNGLGETQUERYOBJECTIVEXTPROC    glGetQueryObjectivEXT;
extern PFNGLGETQUERYOBJECTUIVEXTPROC   glGetQueryObjectuivEXT;
extern PFNGLGETQUERYOBJECTI64VEXTPROC  glGetQueryObjecti64vEXT;
extern PFNGLGETQUERYOBJECTUI64VEXTPROC glGetQueryObjectui64vEXT;
extern PFNGLGETINTEGER64VEXTPROC       glGetInteger64vEXT;
#endif /* defined(GL_EXT_disjoint_timer_query) */

#if defined(GL_EXT_draw_buffers)
extern PFNGLDRAWBUFFERSEXTPROC glDrawBuffersEXT;
#endif /* defined(GL_EXT_draw_buffers) */

#if defined(GL_EXT_draw_buffers_indexed)
extern PFNGLENABLEIEXTPROC                glEnableiEXT;
extern PFNGLDISABLEIEXTPROC               glDisableiEXT;
extern PFNGLBLENDEQUATIONIEXTPROC         glBlendEquationiEXT;
extern PFNGLBLENDEQUATIONSEPARATEIEXTPROC glBlendEquationSeparateiEXT;
extern PFNGLBLENDFUNCIEXTPROC             glBlendFunciEXT;
extern PFNGLBLENDFUNCSEPARATEIEXTPROC     glBlendFuncSeparateiEXT;
extern PFNGLCOLORMASKIEXTPROC             glColorMaskiEXT;
extern PFNGLISENABLEDIEXTPROC             glIsEnablediEXT;
#endif /* defined(GL_EXT_draw_buffers_indexed) */

#if defined(GL_EXT_draw_elements_base_vertex)
extern PFNGLDRAWELEMENTSBASEVERTEXEXTPROC          glDrawElementsBaseVertexEXT;
extern PFNGLDRAWRANGEELEMENTSBASEVERTEXEXTPROC     glDrawRangeElementsBaseVertexEXT;
extern PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXEXTPROC glDrawElementsInstancedBaseVertexEXT;
extern PFNGLMULTIDRAWELEMENTSBASEVERTEXEXTPROC     glMultiDrawElementsBaseVertexEXT;
#endif /* defined(GL_EXT_draw_elements_base_vertex) */

#if defined(GL_EXT_draw_instanced)
extern PFNGLDRAWARRAYSINSTANCEDEXTPROC   glDrawArraysInstancedEXT;
extern PFNGLDRAWELEMENTSINSTANCEDEXTPROC glDrawElementsInstancedEXT;
#endif /* defined(GL_EXT_draw_instanced) */

#if defined(GL_EXT_draw_transform_feedback)
extern PFNGLDRAWTRANSFORMFEEDBACKEXTPROC          glDrawTransformFeedbackEXT;
extern PFNGLDRAWTRANSFORMFEEDBACKINSTANCEDEXTPROC glDrawTransformFeedbackInstancedEXT;
#endif /* defined(GL_EXT_draw_transform_feedback) */

#if defined(GL_EXT_external_buffer)
extern PFNGLBUFFERSTORAGEEXTERNALEXTPROC      glBufferStorageExternalEXT;
extern PFNGLNAMEDBUFFERSTORAGEEXTERNALEXTPROC glNamedBufferStorageExternalEXT;
#endif /* defined(GL_EXT_external_buffer) */

#if defined(GL_EXT_geometry_shader)
extern PFNGLFRAMEBUFFERTEXTUREEXTPROC glFramebufferTextureEXT;
#endif /* defined(GL_EXT_geometry_shader) */

#if defined(GL_EXT_instanced_arrays)
extern PFNGLVERTEXATTRIBDIVISOREXTPROC glVertexAttribDivisorEXT;
#endif /* defined(GL_EXT_instanced_arrays) */

#if defined(GL_EXT_map_buffer_range)
extern PFNGLMAPBUFFERRANGEEXTPROC         glMapBufferRangeEXT;
extern PFNGLFLUSHMAPPEDBUFFERRANGEEXTPROC glFlushMappedBufferRangeEXT;
#endif /* defined(GL_EXT_map_buffer_range) */

#if defined(GL_EXT_memory_object)
extern PFNGLGETUNSIGNEDBYTEVEXTPROC           glGetUnsignedBytevEXT;
extern PFNGLGETUNSIGNEDBYTEI_VEXTPROC         glGetUnsignedBytei_vEXT; // NOLINT(readability-identifier-naming)
extern PFNGLDELETEMEMORYOBJECTSEXTPROC        glDeleteMemoryObjectsEXT;
extern PFNGLISMEMORYOBJECTEXTPROC             glIsMemoryObjectEXT;
extern PFNGLCREATEMEMORYOBJECTSEXTPROC        glCreateMemoryObjectsEXT;
extern PFNGLMEMORYOBJECTPARAMETERIVEXTPROC    glMemoryObjectParameterivEXT;
extern PFNGLGETMEMORYOBJECTPARAMETERIVEXTPROC glGetMemoryObjectParameterivEXT;
extern PFNGLTEXSTORAGEMEM2DEXTPROC            glTexStorageMem2DEXT;
extern PFNGLTEXSTORAGEMEM2DMULTISAMPLEEXTPROC glTexStorageMem2DMultisampleEXT;
extern PFNGLTEXSTORAGEMEM3DEXTPROC            glTexStorageMem3DEXT;
extern PFNGLTEXSTORAGEMEM3DMULTISAMPLEEXTPROC glTexStorageMem3DMultisampleEXT;
extern PFNGLBUFFERSTORAGEMEMEXTPROC           glBufferStorageMemEXT;

extern PFNGLTEXTURESTORAGEMEM2DEXTPROC            glTextureStorageMem2DEXT;
extern PFNGLTEXTURESTORAGEMEM2DMULTISAMPLEEXTPROC glTextureStorageMem2DMultisampleEXT;
extern PFNGLTEXTURESTORAGEMEM3DEXTPROC            glTextureStorageMem3DEXT;
extern PFNGLTEXTURESTORAGEMEM3DMULTISAMPLEEXTPROC glTextureStorageMem3DMultisampleEXT;
extern PFNGLNAMEDBUFFERSTORAGEMEMEXTPROC          glNamedBufferStorageMemEXT;
#endif /* defined(GL_EXT_memory_object) */

#if defined(GL_EXT_memory_object_fd)
extern PFNGLIMPORTMEMORYFDEXTPROC glImportMemoryFdEXT;
#endif /* defined(GL_EXT_memory_object_fd) */

#if defined(GL_EXT_memory_object_win32)
extern PFNGLIMPORTMEMORYWIN32HANDLEEXTPROC glImportMemoryWin32HandleEXT;
extern PFNGLIMPORTMEMORYWIN32NAMEEXTPROC   glImportMemoryWin32NameEXT;
#endif /* defined(GL_EXT_memory_object_win32) */

#if defined(GL_EXT_multi_draw_arrays)
extern PFNGLMULTIDRAWARRAYSEXTPROC   glMultiDrawArraysEXT;
extern PFNGLMULTIDRAWELEMENTSEXTPROC glMultiDrawElementsEXT;
#endif /* defined(GL_EXT_multi_draw_arrays) */

#if defined(GL_EXT_multi_draw_indirect)
extern PFNGLMULTIDRAWARRAYSINDIRECTEXTPROC   glMultiDrawArraysIndirectEXT;
extern PFNGLMULTIDRAWELEMENTSINDIRECTEXTPROC glMultiDrawElementsIndirectEXT;
#endif /* defined(GL_EXT_multi_draw_indirect) */

#if defined(GL_EXT_multisampled_render_to_texture)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC  glRenderbufferStorageMultisampleEXT;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC glFramebufferTexture2DMultisampleEXT;
#endif /* defined(GL_EXT_multisampled_render_to_texture) */

#if defined(GL_EXT_multiview_draw_buffers)
extern PFNGLREADBUFFERINDEXEDEXTPROC  glReadBufferIndexedEXT;
extern PFNGLDRAWBUFFERSINDEXEDEXTPROC glDrawBuffersIndexedEXT;
extern PFNGLGETINTEGERI_VEXTPROC      glGetIntegeri_vEXT; // NOLINT(readability-identifier-naming)
#endif /* defined(GL_EXT_multiview_draw_buffers) */

#if defined(GL_EXT_polygon_offset_clamp)
extern PFNGLPOLYGONOFFSETCLAMPEXTPROC glPolygonOffsetClampEXT;
#endif /* defined(GL_EXT_polygon_offset_clamp) */

#if defined(GL_EXT_primitive_bounding_box)
extern PFNGLPRIMITIVEBOUNDINGBOXEXTPROC glPrimitiveBoundingBoxEXT;
#endif /* defined(GL_EXT_primitive_bounding_box) */

#if defined(GL_EXT_raster_multisample)
extern PFNGLRASTERSAMPLESEXTPROC glRasterSamplesEXT;
#endif /* defined(GL_EXT_raster_multisample) */

#if defined(GL_EXT_robustness)
extern PFNGLGETGRAPHICSRESETSTATUSEXTPROC glGetGraphicsResetStatusEXT;
extern PFNGLREADNPIXELSEXTPROC            glReadnPixelsEXT;
extern PFNGLGETNUNIFORMFVEXTPROC          glGetnUniformfvEXT;
extern PFNGLGETNUNIFORMIVEXTPROC          glGetnUniformivEXT;
#endif /* defined(GL_EXT_robustness) */

#if defined(GL_EXT_semaphore)
extern PFNGLGENSEMAPHORESEXTPROC              glGenSemaphoresEXT;
extern PFNGLDELETESEMAPHORESEXTPROC           glDeleteSemaphoresEXT;
extern PFNGLISSEMAPHOREEXTPROC                glIsSemaphoreEXT;
extern PFNGLSEMAPHOREPARAMETERUI64VEXTPROC    glSemaphoreParameterui64vEXT;
extern PFNGLGETSEMAPHOREPARAMETERUI64VEXTPROC glGetSemaphoreParameterui64vEXT;
extern PFNGLWAITSEMAPHOREEXTPROC              glWaitSemaphoreEXT;
extern PFNGLSIGNALSEMAPHOREEXTPROC            glSignalSemaphoreEXT;
#endif /* defined(GL_EXT_semaphore) */

#if defined(GL_EXT_semaphore_fd)
extern PFNGLIMPORTSEMAPHOREFDEXTPROC glImportSemaphoreFdEXT;
#endif /* defined(GL_EXT_semaphore_fd) */

#if defined(GL_EXT_semaphore_win32)
extern PFNGLIMPORTSEMAPHOREWIN32HANDLEEXTPROC glImportSemaphoreWin32HandleEXT;
extern PFNGLIMPORTSEMAPHOREWIN32NAMEEXTPROC   glImportSemaphoreWin32NameEXT;
#endif /* defined(GL_EXT_semaphore_win32) */

#if defined(GL_EXT_separate_shader_objects)
extern PFNGLACTIVESHADERPROGRAMEXTPROC       glActiveShaderProgramEXT;
extern PFNGLBINDPROGRAMPIPELINEEXTPROC       glBindProgramPipelineEXT;
extern PFNGLCREATESHADERPROGRAMVEXTPROC      glCreateShaderProgramvEXT;
extern PFNGLDELETEPROGRAMPIPELINESEXTPROC    glDeleteProgramPipelinesEXT;
extern PFNGLGENPROGRAMPIPELINESEXTPROC       glGenProgramPipelinesEXT;
extern PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC glGetProgramPipelineInfoLogEXT;
extern PFNGLGETPROGRAMPIPELINEIVEXTPROC      glGetProgramPipelineivEXT;
extern PFNGLISPROGRAMPIPELINEEXTPROC         glIsProgramPipelineEXT;
extern PFNGLPROGRAMPARAMETERIEXTPROC         glProgramParameteriEXT;
extern PFNGLPROGRAMUNIFORM1FEXTPROC          glProgramUniform1fEXT;
extern PFNGLPROGRAMUNIFORM1FVEXTPROC         glProgramUniform1fvEXT;
extern PFNGLPROGRAMUNIFORM1IEXTPROC          glProgramUniform1iEXT;
extern PFNGLPROGRAMUNIFORM1IVEXTPROC         glProgramUniform1ivEXT;
extern PFNGLPROGRAMUNIFORM2FEXTPROC          glProgramUniform2fEXT;
extern PFNGLPROGRAMUNIFORM2FVEXTPROC         glProgramUniform2fvEXT;
extern PFNGLPROGRAMUNIFORM2IEXTPROC          glProgramUniform2iEXT;
extern PFNGLPROGRAMUNIFORM2IVEXTPROC         glProgramUniform2ivEXT;
extern PFNGLPROGRAMUNIFORM3FEXTPROC          glProgramUniform3fEXT;
extern PFNGLPROGRAMUNIFORM3FVEXTPROC         glProgramUniform3fvEXT;
extern PFNGLPROGRAMUNIFORM3IEXTPROC          glProgramUniform3iEXT;
extern PFNGLPROGRAMUNIFORM3IVEXTPROC         glProgramUniform3ivEXT;
extern PFNGLPROGRAMUNIFORM4FEXTPROC          glProgramUniform4fEXT;
extern PFNGLPROGRAMUNIFORM4FVEXTPROC         glProgramUniform4fvEXT;
extern PFNGLPROGRAMUNIFORM4IEXTPROC          glProgramUniform4iEXT;
extern PFNGLPROGRAMUNIFORM4IVEXTPROC         glProgramUniform4ivEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC   glProgramUniformMatrix2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC   glProgramUniformMatrix3fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC   glProgramUniformMatrix4fvEXT;
extern PFNGLUSEPROGRAMSTAGESEXTPROC          glUseProgramStagesEXT;
extern PFNGLVALIDATEPROGRAMPIPELINEEXTPROC   glValidateProgramPipelineEXT;

extern PFNGLPROGRAMUNIFORM1UIEXTPROC         glProgramUniform1uiEXT;
extern PFNGLPROGRAMUNIFORM2UIEXTPROC         glProgramUniform2uiEXT;
extern PFNGLPROGRAMUNIFORM3UIEXTPROC         glProgramUniform3uiEXT;
extern PFNGLPROGRAMUNIFORM4UIEXTPROC         glProgramUniform4uiEXT;
extern PFNGLPROGRAMUNIFORM1UIVEXTPROC        glProgramUniform1uivEXT;
extern PFNGLPROGRAMUNIFORM2UIVEXTPROC        glProgramUniform2uivEXT;
extern PFNGLPROGRAMUNIFORM3UIVEXTPROC        glProgramUniform3uivEXT;
extern PFNGLPROGRAMUNIFORM4UIVEXTPROC        glProgramUniform4uivEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC glProgramUniformMatrix2x3fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC glProgramUniformMatrix3x2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC glProgramUniformMatrix2x4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC glProgramUniformMatrix4x2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC glProgramUniformMatrix3x4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC glProgramUniformMatrix4x3fvEXT;
#endif /* defined(GL_EXT_separate_shader_objects) */

#if defined(GL_EXT_shader_framebuffer_fetch_non_coherent)
extern PFNGLFRAMEBUFFERFETCHBARRIEREXTPROC glFramebufferFetchBarrierEXT;
#endif /* defined(GL_EXT_shader_framebuffer_fetch_non_coherent) */

#if defined(GL_EXT_shader_pixel_local_storage2)
extern PFNGLFRAMEBUFFERPIXELLOCALSTORAGESIZEEXTPROC    glFramebufferPixelLocalStorageSizeEXT;
extern PFNGLGETFRAMEBUFFERPIXELLOCALSTORAGESIZEEXTPROC glGetFramebufferPixelLocalStorageSizeEXT;
extern PFNGLCLEARPIXELLOCALSTORAGEUIEXTPROC            glClearPixelLocalStorageuiEXT;
#endif /* defined(GL_EXT_shader_pixel_local_storage2) */

#if defined(GL_EXT_sparse_texture)
extern PFNGLTEXPAGECOMMITMENTEXTPROC glTexPageCommitmentEXT;
#endif /* defined(GL_EXT_sparse_texture) */

#if defined(GL_EXT_tessellation_shader)
extern PFNGLPATCHPARAMETERIEXTPROC glPatchParameteriEXT;
#endif /* defined(GL_EXT_tessellation_shader) */

#if defined(GL_EXT_texture_border_clamp)
extern PFNGLTEXPARAMETERIIVEXTPROC         glTexParameterIivEXT;
extern PFNGLTEXPARAMETERIUIVEXTPROC        glTexParameterIuivEXT;
extern PFNGLGETTEXPARAMETERIIVEXTPROC      glGetTexParameterIivEXT;
extern PFNGLGETTEXPARAMETERIUIVEXTPROC     glGetTexParameterIuivEXT;
extern PFNGLSAMPLERPARAMETERIIVEXTPROC     glSamplerParameterIivEXT;
extern PFNGLSAMPLERPARAMETERIUIVEXTPROC    glSamplerParameterIuivEXT;
extern PFNGLGETSAMPLERPARAMETERIIVEXTPROC  glGetSamplerParameterIivEXT;
extern PFNGLGETSAMPLERPARAMETERIUIVEXTPROC glGetSamplerParameterIuivEXT;
#endif /* defined(GL_EXT_texture_border_clamp) */

#if defined(GL_EXT_texture_buffer)
extern PFNGLTEXBUFFEREXTPROC      glTexBufferEXT;
extern PFNGLTEXBUFFERRANGEEXTPROC glTexBufferRangeEXT;
#endif /* defined(GL_EXT_texture_buffer) */

#if defined(GL_EXT_texture_storage)
extern PFNGLTEXSTORAGE1DEXTPROC glTexStorage1DEXT;
extern PFNGLTEXSTORAGE2DEXTPROC glTexStorage2DEXT;
extern PFNGLTEXSTORAGE3DEXTPROC glTexStorage3DEXT;

extern PFNGLTEXTURESTORAGE1DEXTPROC glTextureStorage1DEXT;
extern PFNGLTEXTURESTORAGE2DEXTPROC glTextureStorage2DEXT;
extern PFNGLTEXTURESTORAGE3DEXTPROC glTextureStorage3DEXT;
#endif /* defined(GL_EXT_texture_storage) */

#if defined(GL_EXT_texture_view)
extern PFNGLTEXTUREVIEWEXTPROC glTextureViewEXT;
#endif /* defined(GL_EXT_texture_view) */

#if defined(GL_NV_timeline_semaphore)
extern PFNGLCREATESEMAPHORESNVPROC        glCreateSemaphoresNV;
extern PFNGLSEMAPHOREPARAMETERIVNVPROC    glSemaphoreParameterivNV;
extern PFNGLGETSEMAPHOREPARAMETERIVNVPROC glGetSemaphoreParameterivNV;
#endif /* defined(GL_NV_timeline_semaphore) */

#if defined(GL_EXT_win32_keyed_mutex)
extern PFNGLACQUIREKEYEDMUTEXWIN32EXTPROC glAcquireKeyedMutexWin32EXT;
extern PFNGLRELEASEKEYEDMUTEXWIN32EXTPROC glReleaseKeyedMutexWin32EXT;
#endif /* defined(GL_EXT_win32_keyed_mutex) */

#if defined(GL_EXT_window_rectangles)
extern PFNGLWINDOWRECTANGLESEXTPROC glWindowRectanglesEXT;
#endif /* defined(GL_EXT_window_rectangles) */

#if defined(GL_IMG_bindless_texture)
extern PFNGLGETTEXTUREHANDLEIMGPROC          glGetTextureHandleIMG;
extern PFNGLGETTEXTURESAMPLERHANDLEIMGPROC   glGetTextureSamplerHandleIMG;
extern PFNGLUNIFORMHANDLEUI64IMGPROC         glUniformHandleui64IMG;
extern PFNGLUNIFORMHANDLEUI64VIMGPROC        glUniformHandleui64vIMG;
extern PFNGLPROGRAMUNIFORMHANDLEUI64IMGPROC  glProgramUniformHandleui64IMG;
extern PFNGLPROGRAMUNIFORMHANDLEUI64VIMGPROC glProgramUniformHandleui64vIMG;
#endif /* defined(GL_IMG_bindless_texture) */

#if defined(GL_IMG_framebuffer_downsample)
extern PFNGLFRAMEBUFFERTEXTURE2DDOWNSAMPLEIMGPROC    glFramebufferTexture2DDownsampleIMG;
extern PFNGLFRAMEBUFFERTEXTURELAYERDOWNSAMPLEIMGPROC glFramebufferTextureLayerDownsampleIMG;
#endif /* defined(GL_IMG_framebuffer_downsample) */

#if defined(GL_IMG_multisampled_render_to_texture)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEIMGPROC  glRenderbufferStorageMultisampleIMG;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC glFramebufferTexture2DMultisampleIMG;
#endif /* defined(GL_IMG_multisampled_render_to_texture) */

#if defined(GL_INTEL_framebuffer_CMAA)
extern PFNGLAPPLYFRAMEBUFFERATTACHMENTCMAAINTELPROC glApplyFramebufferAttachmentCMAAINTEL;
#endif /* defined(GL_INTEL_framebuffer_CMAA) */

#if defined(GL_INTEL_performance_query)
extern PFNGLBEGINPERFQUERYINTELPROC       glBeginPerfQueryINTEL;
extern PFNGLCREATEPERFQUERYINTELPROC      glCreatePerfQueryINTEL;
extern PFNGLDELETEPERFQUERYINTELPROC      glDeletePerfQueryINTEL;
extern PFNGLENDPERFQUERYINTELPROC         glEndPerfQueryINTEL;
extern PFNGLGETFIRSTPERFQUERYIDINTELPROC  glGetFirstPerfQueryIdINTEL;
extern PFNGLGETNEXTPERFQUERYIDINTELPROC   glGetNextPerfQueryIdINTEL;
extern PFNGLGETPERFCOUNTERINFOINTELPROC   glGetPerfCounterInfoINTEL;
extern PFNGLGETPERFQUERYDATAINTELPROC     glGetPerfQueryDataINTEL;
extern PFNGLGETPERFQUERYIDBYNAMEINTELPROC glGetPerfQueryIdByNameINTEL;
extern PFNGLGETPERFQUERYINFOINTELPROC     glGetPerfQueryInfoINTEL;
#endif /* defined(GL_INTEL_performance_query) */

#if defined(GL_KHR_blend_equation_advanced)
extern PFNGLBLENDBARRIERKHRPROC glBlendBarrierKHR;
#endif /* defined(GL_KHR_blend_equation_advanced) */

#if defined(GL_KHR_debug)
extern PFNGLDEBUGMESSAGECONTROLKHRPROC  glDebugMessageControlKHR;
extern PFNGLDEBUGMESSAGEINSERTKHRPROC   glDebugMessageInsertKHR;
extern PFNGLDEBUGMESSAGECALLBACKKHRPROC glDebugMessageCallbackKHR;
extern PFNGLGETDEBUGMESSAGELOGKHRPROC   glGetDebugMessageLogKHR;
extern PFNGLPUSHDEBUGGROUPKHRPROC       glPushDebugGroupKHR;
extern PFNGLPOPDEBUGGROUPKHRPROC        glPopDebugGroupKHR;
extern PFNGLOBJECTLABELKHRPROC          glObjectLabelKHR;
extern PFNGLGETOBJECTLABELKHRPROC       glGetObjectLabelKHR;
extern PFNGLOBJECTPTRLABELKHRPROC       glObjectPtrLabelKHR;
extern PFNGLGETOBJECTPTRLABELKHRPROC    glGetObjectPtrLabelKHR;
extern PFNGLGETPOINTERVKHRPROC          glGetPointervKHR;
#endif /* defined(GL_KHR_debug) */

#if defined(GL_KHR_robustness)
extern PFNGLGETGRAPHICSRESETSTATUSKHRPROC glGetGraphicsResetStatusKHR;
extern PFNGLREADNPIXELSKHRPROC            glReadnPixelsKHR;
extern PFNGLGETNUNIFORMFVKHRPROC          glGetnUniformfvKHR;
extern PFNGLGETNUNIFORMIVKHRPROC          glGetnUniformivKHR;
extern PFNGLGETNUNIFORMUIVKHRPROC         glGetnUniformuivKHR;
#endif /* defined(GL_KHR_robustness) */

#if defined(GL_KHR_parallel_shader_compile)
extern PFNGLMAXSHADERCOMPILERTHREADSKHRPROC glMaxShaderCompilerThreadsKHR;
#endif /* defined(GL_KHR_parallel_shader_compile) */

#if defined(GL_MESA_framebuffer_flip_y)
extern PFNGLFRAMEBUFFERPARAMETERIMESAPROC     glFramebufferParameteriMESA;
extern PFNGLGETFRAMEBUFFERPARAMETERIVMESAPROC glGetFramebufferParameterivMESA;
#endif /* defined(GL_MESA_framebuffer_flip_y) */

#if defined(GL_NV_bindless_texture)
extern PFNGLGETTEXTUREHANDLENVPROC             glGetTextureHandleNV;
extern PFNGLGETTEXTURESAMPLERHANDLENVPROC      glGetTextureSamplerHandleNV;
extern PFNGLMAKETEXTUREHANDLERESIDENTNVPROC    glMakeTextureHandleResidentNV;
extern PFNGLMAKETEXTUREHANDLENONRESIDENTNVPROC glMakeTextureHandleNonResidentNV;
extern PFNGLGETIMAGEHANDLENVPROC               glGetImageHandleNV;
extern PFNGLMAKEIMAGEHANDLERESIDENTNVPROC      glMakeImageHandleResidentNV;
extern PFNGLMAKEIMAGEHANDLENONRESIDENTNVPROC   glMakeImageHandleNonResidentNV;
extern PFNGLUNIFORMHANDLEUI64NVPROC            glUniformHandleui64NV;
extern PFNGLUNIFORMHANDLEUI64VNVPROC           glUniformHandleui64vNV;
extern PFNGLPROGRAMUNIFORMHANDLEUI64NVPROC     glProgramUniformHandleui64NV;
extern PFNGLPROGRAMUNIFORMHANDLEUI64VNVPROC    glProgramUniformHandleui64vNV;
extern PFNGLISTEXTUREHANDLERESIDENTNVPROC      glIsTextureHandleResidentNV;
extern PFNGLISIMAGEHANDLERESIDENTNVPROC        glIsImageHandleResidentNV;
#endif /* defined(GL_NV_bindless_texture) */

#if defined(GL_NV_blend_equation_advanced)
extern PFNGLBLENDPARAMETERINVPROC glBlendParameteriNV;
extern PFNGLBLENDBARRIERNVPROC    glBlendBarrierNV;
#endif /* defined(GL_NV_blend_equation_advanced) */

#if defined(GL_NV_clip_space_w_scaling)
extern PFNGLVIEWPORTPOSITIONWSCALENVPROC glViewportPositionWScaleNV;
#endif /* defined(GL_NV_clip_space_w_scaling) */

#if defined(GL_NV_conditional_render)
extern PFNGLBEGINCONDITIONALRENDERNVPROC glBeginConditionalRenderNV;
extern PFNGLENDCONDITIONALRENDERNVPROC   glEndConditionalRenderNV;
#endif /* defined(GL_NV_conditional_render) */

#if defined(GL_NV_conservative_raster)
extern PFNGLSUBPIXELPRECISIONBIASNVPROC glSubpixelPrecisionBiasNV;
#endif /* defined(GL_NV_conservative_raster) */

#if defined(GL_NV_conservative_raster_pre_snap_triangles)
extern PFNGLCONSERVATIVERASTERPARAMETERINVPROC glConservativeRasterParameteriNV;
#endif /* defined(GL_NV_conservative_raster_pre_snap_triangles) */

#if defined(GL_NV_copy_buffer)
extern PFNGLCOPYBUFFERSUBDATANVPROC glCopyBufferSubDataNV;
#endif /* defined(GL_NV_copy_buffer) */

#if defined(GL_NV_coverage_sample)
extern PFNGLCOVERAGEMASKNVPROC      glCoverageMaskNV;
extern PFNGLCOVERAGEOPERATIONNVPROC glCoverageOperationNV;
#endif /* defined(GL_NV_coverage_sample) */

#if defined(GL_NV_draw_buffers)
extern PFNGLDRAWBUFFERSNVPROC glDrawBuffersNV;
#endif /* defined(GL_NV_draw_buffers) */

#if defined(GL_NV_draw_instanced)
extern PFNGLDRAWARRAYSINSTANCEDNVPROC   glDrawArraysInstancedNV;
extern PFNGLDRAWELEMENTSINSTANCEDNVPROC glDrawElementsInstancedNV;
#endif /* defined(GL_NV_draw_instanced) */

#if defined(GL_NV_draw_vulkan_image)
extern PFNGLDRAWVKIMAGENVPROC       glDrawVkImageNV;
extern PFNGLGETVKPROCADDRNVPROC     glGetVkProcAddrNV;
extern PFNGLWAITVKSEMAPHORENVPROC   glWaitVkSemaphoreNV;
extern PFNGLSIGNALVKSEMAPHORENVPROC glSignalVkSemaphoreNV;
extern PFNGLSIGNALVKFENCENVPROC     glSignalVkFenceNV;
#endif /* defined(GL_NV_draw_vulkan_image) */

#if defined(GL_NV_fence)
extern PFNGLDELETEFENCESNVPROC glDeleteFencesNV;
extern PFNGLGENFENCESNVPROC    glGenFencesNV;
extern PFNGLISFENCENVPROC      glIsFenceNV;
extern PFNGLTESTFENCENVPROC    glTestFenceNV;
extern PFNGLGETFENCEIVNVPROC   glGetFenceivNV;
extern PFNGLFINISHFENCENVPROC  glFinishFenceNV;
extern PFNGLSETFENCENVPROC     glSetFenceNV;
#endif /* defined(GL_NV_fence) */

#if defined(GL_NV_fragment_coverage_to_color)
extern PFNGLFRAGMENTCOVERAGECOLORNVPROC glFragmentCoverageColorNV;
#endif /* defined(GL_NV_fragment_coverage_to_color) */

#if defined(GL_NV_framebuffer_blit)
extern PFNGLBLITFRAMEBUFFERNVPROC glBlitFramebufferNV;
#endif /* defined(GL_NV_framebuffer_blit) */

#if defined(GL_NV_framebuffer_mixed_samples)
extern PFNGLCOVERAGEMODULATIONTABLENVPROC    glCoverageModulationTableNV;
extern PFNGLGETCOVERAGEMODULATIONTABLENVPROC glGetCoverageModulationTableNV;
extern PFNGLCOVERAGEMODULATIONNVPROC         glCoverageModulationNV;
#endif /* defined(GL_NV_framebuffer_mixed_samples) */

#if defined(GL_NV_framebuffer_multisample)
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLENVPROC glRenderbufferStorageMultisampleNV;
#endif /* defined(GL_NV_framebuffer_multisample) */

#if defined(GL_NV_gpu_shader5)
extern PFNGLUNIFORM1I64NVPROC    glUniform1i64NV;
extern PFNGLUNIFORM2I64NVPROC    glUniform2i64NV;
extern PFNGLUNIFORM3I64NVPROC    glUniform3i64NV;
extern PFNGLUNIFORM4I64NVPROC    glUniform4i64NV;
extern PFNGLUNIFORM1I64VNVPROC   glUniform1i64vNV;
extern PFNGLUNIFORM2I64VNVPROC   glUniform2i64vNV;
extern PFNGLUNIFORM3I64VNVPROC   glUniform3i64vNV;
extern PFNGLUNIFORM4I64VNVPROC   glUniform4i64vNV;
extern PFNGLUNIFORM1UI64NVPROC   glUniform1ui64NV;
extern PFNGLUNIFORM2UI64NVPROC   glUniform2ui64NV;
extern PFNGLUNIFORM3UI64NVPROC   glUniform3ui64NV;
extern PFNGLUNIFORM4UI64NVPROC   glUniform4ui64NV;
extern PFNGLUNIFORM1UI64VNVPROC  glUniform1ui64vNV;
extern PFNGLUNIFORM2UI64VNVPROC  glUniform2ui64vNV;
extern PFNGLUNIFORM3UI64VNVPROC  glUniform3ui64vNV;
extern PFNGLUNIFORM4UI64VNVPROC  glUniform4ui64vNV;
extern PFNGLGETUNIFORMI64VNVPROC glGetUniformi64vNV;

extern PFNGLPROGRAMUNIFORM1I64NVPROC   glProgramUniform1i64NV;
extern PFNGLPROGRAMUNIFORM2I64NVPROC   glProgramUniform2i64NV;
extern PFNGLPROGRAMUNIFORM3I64NVPROC   glProgramUniform3i64NV;
extern PFNGLPROGRAMUNIFORM4I64NVPROC   glProgramUniform4i64NV;
extern PFNGLPROGRAMUNIFORM1I64VNVPROC  glProgramUniform1i64vNV;
extern PFNGLPROGRAMUNIFORM2I64VNVPROC  glProgramUniform2i64vNV;
extern PFNGLPROGRAMUNIFORM3I64VNVPROC  glProgramUniform3i64vNV;
extern PFNGLPROGRAMUNIFORM4I64VNVPROC  glProgramUniform4i64vNV;
extern PFNGLPROGRAMUNIFORM1UI64NVPROC  glProgramUniform1ui64NV;
extern PFNGLPROGRAMUNIFORM2UI64NVPROC  glProgramUniform2ui64NV;
extern PFNGLPROGRAMUNIFORM3UI64NVPROC  glProgramUniform3ui64NV;
extern PFNGLPROGRAMUNIFORM4UI64NVPROC  glProgramUniform4ui64NV;
extern PFNGLPROGRAMUNIFORM1UI64VNVPROC glProgramUniform1ui64vNV;
extern PFNGLPROGRAMUNIFORM2UI64VNVPROC glProgramUniform2ui64vNV;
extern PFNGLPROGRAMUNIFORM3UI64VNVPROC glProgramUniform3ui64vNV;
extern PFNGLPROGRAMUNIFORM4UI64VNVPROC glProgramUniform4ui64vNV;
#endif /* defined(GL_NV_gpu_shader5) */

#if defined(GL_NV_instanced_arrays)
extern PFNGLVERTEXATTRIBDIVISORNVPROC glVertexAttribDivisorNV;
#endif /* defined(GL_NV_instanced_arrays) */

#if defined(GL_NV_internalformat_sample_query)
extern PFNGLGETINTERNALFORMATSAMPLEIVNVPROC glGetInternalformatSampleivNV;
#endif /* defined(GL_NV_internalformat_sample_query) */

#if defined(GL_NV_memory_attachment)
extern PFNGLGETMEMORYOBJECTDETACHEDRESOURCESUIVNVPROC glGetMemoryObjectDetachedResourcesuivNV;
extern PFNGLRESETMEMORYOBJECTPARAMETERNVPROC          glResetMemoryObjectParameterNV;
extern PFNGLTEXATTACHMEMORYNVPROC                     glTexAttachMemoryNV;
extern PFNGLBUFFERATTACHMEMORYNVPROC                  glBufferAttachMemoryNV;

extern PFNGLTEXTUREATTACHMEMORYNVPROC     glTextureAttachMemoryNV;
extern PFNGLNAMEDBUFFERATTACHMEMORYNVPROC glNamedBufferAttachMemoryNV;
#endif /* defined(GL_NV_memory_attachment) */

#if defined(GL_NV_memory_object_sparse)
extern PFNGLBUFFERPAGECOMMITMENTMEMNVPROC glBufferPageCommitmentMemNV;
extern PFNGLTEXPAGECOMMITMENTMEMNVPROC    glTexPageCommitmentMemNV;

extern PFNGLNAMEDBUFFERPAGECOMMITMENTMEMNVPROC glNamedBufferPageCommitmentMemNV;
extern PFNGLTEXTUREPAGECOMMITMENTMEMNVPROC     glTexturePageCommitmentMemNV;
#endif /* defined(GL_NV_memory_object_sparse) */

#if defined(GL_NV_mesh_shader)
extern PFNGLDRAWMESHTASKSNVPROC                   glDrawMeshTasksNV;
extern PFNGLDRAWMESHTASKSINDIRECTNVPROC           glDrawMeshTasksIndirectNV;
extern PFNGLMULTIDRAWMESHTASKSINDIRECTNVPROC      glMultiDrawMeshTasksIndirectNV;
extern PFNGLMULTIDRAWMESHTASKSINDIRECTCOUNTNVPROC glMultiDrawMeshTasksIndirectCountNV;
#endif /* defined(GL_NV_mesh_shader) */

#if defined(GL_NV_non_square_matrices)
extern PFNGLUNIFORMMATRIX2X3FVNVPROC glUniformMatrix2x3fvNV;
extern PFNGLUNIFORMMATRIX3X2FVNVPROC glUniformMatrix3x2fvNV;
extern PFNGLUNIFORMMATRIX2X4FVNVPROC glUniformMatrix2x4fvNV;
extern PFNGLUNIFORMMATRIX4X2FVNVPROC glUniformMatrix4x2fvNV;
extern PFNGLUNIFORMMATRIX3X4FVNVPROC glUniformMatrix3x4fvNV;
extern PFNGLUNIFORMMATRIX4X3FVNVPROC glUniformMatrix4x3fvNV;
#endif /* defined(GL_NV_non_square_matrices) */

#if defined(GL_NV_path_rendering)
extern PFNGLGENPATHSNVPROC                   glGenPathsNV;
extern PFNGLDELETEPATHSNVPROC                glDeletePathsNV;
extern PFNGLISPATHNVPROC                     glIsPathNV;
extern PFNGLPATHCOMMANDSNVPROC               glPathCommandsNV;
extern PFNGLPATHCOORDSNVPROC                 glPathCoordsNV;
extern PFNGLPATHSUBCOMMANDSNVPROC            glPathSubCommandsNV;
extern PFNGLPATHSUBCOORDSNVPROC              glPathSubCoordsNV;
extern PFNGLPATHSTRINGNVPROC                 glPathStringNV;
extern PFNGLPATHGLYPHSNVPROC                 glPathGlyphsNV;
extern PFNGLPATHGLYPHRANGENVPROC             glPathGlyphRangeNV;
extern PFNGLWEIGHTPATHSNVPROC                glWeightPathsNV;
extern PFNGLCOPYPATHNVPROC                   glCopyPathNV;
extern PFNGLINTERPOLATEPATHSNVPROC           glInterpolatePathsNV;
extern PFNGLTRANSFORMPATHNVPROC              glTransformPathNV;
extern PFNGLPATHPARAMETERIVNVPROC            glPathParameterivNV;
extern PFNGLPATHPARAMETERINVPROC             glPathParameteriNV;
extern PFNGLPATHPARAMETERFVNVPROC            glPathParameterfvNV;
extern PFNGLPATHPARAMETERFNVPROC             glPathParameterfNV;
extern PFNGLPATHDASHARRAYNVPROC              glPathDashArrayNV;
extern PFNGLPATHSTENCILFUNCNVPROC            glPathStencilFuncNV;
extern PFNGLPATHSTENCILDEPTHOFFSETNVPROC     glPathStencilDepthOffsetNV;
extern PFNGLSTENCILFILLPATHNVPROC            glStencilFillPathNV;
extern PFNGLSTENCILSTROKEPATHNVPROC          glStencilStrokePathNV;
extern PFNGLSTENCILFILLPATHINSTANCEDNVPROC   glStencilFillPathInstancedNV;
extern PFNGLSTENCILSTROKEPATHINSTANCEDNVPROC glStencilStrokePathInstancedNV;
extern PFNGLPATHCOVERDEPTHFUNCNVPROC         glPathCoverDepthFuncNV;
extern PFNGLCOVERFILLPATHNVPROC              glCoverFillPathNV;
extern PFNGLCOVERSTROKEPATHNVPROC            glCoverStrokePathNV;
extern PFNGLCOVERFILLPATHINSTANCEDNVPROC     glCoverFillPathInstancedNV;
extern PFNGLCOVERSTROKEPATHINSTANCEDNVPROC   glCoverStrokePathInstancedNV;
extern PFNGLGETPATHPARAMETERIVNVPROC         glGetPathParameterivNV;
extern PFNGLGETPATHPARAMETERFVNVPROC         glGetPathParameterfvNV;
extern PFNGLGETPATHCOMMANDSNVPROC            glGetPathCommandsNV;
extern PFNGLGETPATHCOORDSNVPROC              glGetPathCoordsNV;
extern PFNGLGETPATHDASHARRAYNVPROC           glGetPathDashArrayNV;
extern PFNGLGETPATHMETRICSNVPROC             glGetPathMetricsNV;
extern PFNGLGETPATHMETRICRANGENVPROC         glGetPathMetricRangeNV;
extern PFNGLGETPATHSPACINGNVPROC             glGetPathSpacingNV;
extern PFNGLISPOINTINFILLPATHNVPROC          glIsPointInFillPathNV;
extern PFNGLISPOINTINSTROKEPATHNVPROC        glIsPointInStrokePathNV;
extern PFNGLGETPATHLENGTHNVPROC              glGetPathLengthNV;
extern PFNGLPOINTALONGPATHNVPROC             glPointAlongPathNV;

extern PFNGLMATRIXLOAD3X2FNVPROC                      glMatrixLoad3x2fNV;
extern PFNGLMATRIXLOAD3X3FNVPROC                      glMatrixLoad3x3fNV;
extern PFNGLMATRIXLOADTRANSPOSE3X3FNVPROC             glMatrixLoadTranspose3x3fNV;
extern PFNGLMATRIXMULT3X2FNVPROC                      glMatrixMult3x2fNV;
extern PFNGLMATRIXMULT3X3FNVPROC                      glMatrixMult3x3fNV;
extern PFNGLMATRIXMULTTRANSPOSE3X3FNVPROC             glMatrixMultTranspose3x3fNV;
extern PFNGLSTENCILTHENCOVERFILLPATHNVPROC            glStencilThenCoverFillPathNV;
extern PFNGLSTENCILTHENCOVERSTROKEPATHNVPROC          glStencilThenCoverStrokePathNV;
extern PFNGLSTENCILTHENCOVERFILLPATHINSTANCEDNVPROC   glStencilThenCoverFillPathInstancedNV;
extern PFNGLSTENCILTHENCOVERSTROKEPATHINSTANCEDNVPROC glStencilThenCoverStrokePathInstancedNV;
extern PFNGLPATHGLYPHINDEXRANGENVPROC                 glPathGlyphIndexRangeNV;

extern PFNGLPATHGLYPHINDEXARRAYNVPROC         glPathGlyphIndexArrayNV;
extern PFNGLPATHMEMORYGLYPHINDEXARRAYNVPROC   glPathMemoryGlyphIndexArrayNV;
extern PFNGLPROGRAMPATHFRAGMENTINPUTGENNVPROC glProgramPathFragmentInputGenNV;
extern PFNGLGETPROGRAMRESOURCEFVNVPROC        glGetProgramResourcefvNV;

extern PFNGLMATRIXFRUSTUMEXTPROC        glMatrixFrustumEXT;
extern PFNGLMATRIXLOADIDENTITYEXTPROC   glMatrixLoadIdentityEXT;
extern PFNGLMATRIXLOADTRANSPOSEFEXTPROC glMatrixLoadTransposefEXT;
extern PFNGLMATRIXLOADTRANSPOSEDEXTPROC glMatrixLoadTransposedEXT;
extern PFNGLMATRIXLOADFEXTPROC          glMatrixLoadfEXT;
extern PFNGLMATRIXLOADDEXTPROC          glMatrixLoaddEXT;
extern PFNGLMATRIXMULTTRANSPOSEFEXTPROC glMatrixMultTransposefEXT;
extern PFNGLMATRIXMULTTRANSPOSEDEXTPROC glMatrixMultTransposedEXT;
extern PFNGLMATRIXMULTFEXTPROC          glMatrixMultfEXT;
extern PFNGLMATRIXMULTDEXTPROC          glMatrixMultdEXT;
extern PFNGLMATRIXORTHOEXTPROC          glMatrixOrthoEXT;
extern PFNGLMATRIXPOPEXTPROC            glMatrixPopEXT;
extern PFNGLMATRIXPUSHEXTPROC           glMatrixPushEXT;
extern PFNGLMATRIXROTATEFEXTPROC        glMatrixRotatefEXT;
extern PFNGLMATRIXROTATEDEXTPROC        glMatrixRotatedEXT;
extern PFNGLMATRIXSCALEFEXTPROC         glMatrixScalefEXT;
extern PFNGLMATRIXSCALEDEXTPROC         glMatrixScaledEXT;
extern PFNGLMATRIXTRANSLATEFEXTPROC     glMatrixTranslatefEXT;
extern PFNGLMATRIXTRANSLATEDEXTPROC     glMatrixTranslatedEXT;
#endif /* defined(GL_NV_path_rendering) */

#if defined(GL_NV_polygon_mode)
extern PFNGLPOLYGONMODENVPROC glPolygonModeNV;
#endif /* defined(GL_NV_polygon_mode) */

#if defined(GL_NV_read_buffer)
extern PFNGLREADBUFFERNVPROC glReadBufferNV;
#endif /* defined(GL_NV_read_buffer) */

#if defined(GL_NV_sample_locations)
extern PFNGLFRAMEBUFFERSAMPLELOCATIONSFVNVPROC      glFramebufferSampleLocationsfvNV;
extern PFNGLNAMEDFRAMEBUFFERSAMPLELOCATIONSFVNVPROC glNamedFramebufferSampleLocationsfvNV;
extern PFNGLRESOLVEDEPTHVALUESNVPROC                glResolveDepthValuesNV;
#endif /* defined(GL_NV_sample_locations) */

#if defined(GL_NV_scissor_exclusive)
extern PFNGLSCISSOREXCLUSIVENVPROC       glScissorExclusiveNV;
extern PFNGLSCISSOREXCLUSIVEARRAYVNVPROC glScissorExclusiveArrayvNV;
#endif /* defined(GL_NV_scissor_exclusive) */

#if defined(GL_NV_shading_rate_image)
extern PFNGLBINDSHADINGRATEIMAGENVPROC           glBindShadingRateImageNV;
extern PFNGLGETSHADINGRATEIMAGEPALETTENVPROC     glGetShadingRateImagePaletteNV;
extern PFNGLGETSHADINGRATESAMPLELOCATIONIVNVPROC glGetShadingRateSampleLocationivNV;
extern PFNGLSHADINGRATEIMAGEBARRIERNVPROC        glShadingRateImageBarrierNV;
extern PFNGLSHADINGRATEIMAGEPALETTENVPROC        glShadingRateImagePaletteNV;
extern PFNGLSHADINGRATESAMPLEORDERNVPROC         glShadingRateSampleOrderNV;
extern PFNGLSHADINGRATESAMPLEORDERCUSTOMNVPROC   glShadingRateSampleOrderCustomNV;
#endif /* defined(GL_NV_shading_rate_image) */

#if defined(GL_NV_viewport_array)
extern PFNGLVIEWPORTARRAYVNVPROC     glViewportArrayvNV;
extern PFNGLVIEWPORTINDEXEDFNVPROC   glViewportIndexedfNV;
extern PFNGLVIEWPORTINDEXEDFVNVPROC  glViewportIndexedfvNV;
extern PFNGLSCISSORARRAYVNVPROC      glScissorArrayvNV;
extern PFNGLSCISSORINDEXEDNVPROC     glScissorIndexedNV;
extern PFNGLSCISSORINDEXEDVNVPROC    glScissorIndexedvNV;
extern PFNGLDEPTHRANGEARRAYFVNVPROC  glDepthRangeArrayfvNV;
extern PFNGLDEPTHRANGEINDEXEDFNVPROC glDepthRangeIndexedfNV;
extern PFNGLGETFLOATI_VNVPROC        glGetFloati_vNV; // NOLINT(readability-identifier-naming)
extern PFNGLENABLEINVPROC            glEnableiNV;
extern PFNGLDISABLEINVPROC           glDisableiNV;
extern PFNGLISENABLEDINVPROC         glIsEnablediNV;
#endif /* defined(GL_NV_viewport_array) */

#if defined(GL_NV_viewport_swizzle)
extern PFNGLVIEWPORTSWIZZLENVPROC glViewportSwizzleNV;
#endif /* defined(GL_NV_viewport_swizzle) */

#if defined(GL_OES_EGL_image)
extern PFNGLEGLIMAGETARGETTEXTURE2DOESPROC           glEGLImageTargetTexture2DOES;
extern PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC glEGLImageTargetRenderbufferStorageOES;
#endif /* defined(GL_OES_EGL_image) */

#if defined(GL_OES_copy_image)
extern PFNGLCOPYIMAGESUBDATAOESPROC glCopyImageSubDataOES;
#endif /* defined(GL_OES_copy_image) */

#if defined(GL_OES_draw_buffers_indexed)
extern PFNGLENABLEIOESPROC                glEnableiOES;
extern PFNGLDISABLEIOESPROC               glDisableiOES;
extern PFNGLBLENDEQUATIONIOESPROC         glBlendEquationiOES;
extern PFNGLBLENDEQUATIONSEPARATEIOESPROC glBlendEquationSeparateiOES;
extern PFNGLBLENDFUNCIOESPROC             glBlendFunciOES;
extern PFNGLBLENDFUNCSEPARATEIOESPROC     glBlendFuncSeparateiOES;
extern PFNGLCOLORMASKIOESPROC             glColorMaskiOES;
extern PFNGLISENABLEDIOESPROC             glIsEnablediOES;
#endif /* defined(GL_OES_draw_buffers_indexed) */

#if defined(GL_OES_draw_elements_base_vertex)
extern PFNGLDRAWELEMENTSBASEVERTEXOESPROC          glDrawElementsBaseVertexOES;
extern PFNGLDRAWRANGEELEMENTSBASEVERTEXOESPROC     glDrawRangeElementsBaseVertexOES;
extern PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXOESPROC glDrawElementsInstancedBaseVertexOES;
#endif /* defined(GL_OES_draw_elements_base_vertex) */

#if defined(GL_OES_geometry_shader)
extern PFNGLFRAMEBUFFERTEXTUREOESPROC glFramebufferTextureOES;
#endif /* defined(GL_OES_geometry_shader) */

#if defined(GL_OES_get_program_binary)
extern PFNGLGETPROGRAMBINARYOESPROC glGetProgramBinaryOES;
extern PFNGLPROGRAMBINARYOESPROC    glProgramBinaryOES;
#endif /* defined(GL_OES_get_program_binary) */

#if defined(GL_OES_mapbuffer)
extern PFNGLMAPBUFFEROESPROC         glMapBufferOES;
extern PFNGLUNMAPBUFFEROESPROC       glUnmapBufferOES;
extern PFNGLGETBUFFERPOINTERVOESPROC glGetBufferPointervOES;
#endif /* defined(GL_OES_mapbuffer) */

#if defined(GL_OES_primitive_bounding_box)
extern PFNGLPRIMITIVEBOUNDINGBOXOESPROC glPrimitiveBoundingBoxOES;
#endif /* defined(GL_OES_primitive_bounding_box) */

#if defined(GL_OES_sample_shading)
extern PFNGLMINSAMPLESHADINGOESPROC glMinSampleShadingOES;
#endif /* defined(GL_OES_sample_shading) */

#if defined(GL_OES_tessellation_shader)
extern PFNGLPATCHPARAMETERIOESPROC glPatchParameteriOES;
#endif /* defined(GL_OES_tessellation_shader) */

#if defined(GL_OES_texture_3D)
extern PFNGLTEXIMAGE3DOESPROC              glTexImage3DOES;
extern PFNGLTEXSUBIMAGE3DOESPROC           glTexSubImage3DOES;
extern PFNGLCOPYTEXSUBIMAGE3DOESPROC       glCopyTexSubImage3DOES;
extern PFNGLCOMPRESSEDTEXIMAGE3DOESPROC    glCompressedTexImage3DOES;
extern PFNGLCOMPRESSEDTEXSUBIMAGE3DOESPROC glCompressedTexSubImage3DOES;
extern PFNGLFRAMEBUFFERTEXTURE3DOESPROC    glFramebufferTexture3DOES;
#endif /* defined(GL_OES_texture_3D) */

#if defined(GL_OES_texture_border_clamp)
extern PFNGLTEXPARAMETERIIVOESPROC         glTexParameterIivOES;
extern PFNGLTEXPARAMETERIUIVOESPROC        glTexParameterIuivOES;
extern PFNGLGETTEXPARAMETERIIVOESPROC      glGetTexParameterIivOES;
extern PFNGLGETTEXPARAMETERIUIVOESPROC     glGetTexParameterIuivOES;
extern PFNGLSAMPLERPARAMETERIIVOESPROC     glSamplerParameterIivOES;
extern PFNGLSAMPLERPARAMETERIUIVOESPROC    glSamplerParameterIuivOES;
extern PFNGLGETSAMPLERPARAMETERIIVOESPROC  glGetSamplerParameterIivOES;
extern PFNGLGETSAMPLERPARAMETERIUIVOESPROC glGetSamplerParameterIuivOES;
#endif /* defined(GL_OES_texture_border_clamp) */

#if defined(GL_OES_texture_buffer)
extern PFNGLTEXBUFFEROESPROC      glTexBufferOES;
extern PFNGLTEXBUFFERRANGEOESPROC glTexBufferRangeOES;
#endif /* defined(GL_OES_texture_buffer) */

#if defined(GL_OES_texture_storage_multisample_2d_array)
extern PFNGLTEXSTORAGE3DMULTISAMPLEOESPROC glTexStorage3DMultisampleOES;
#endif /* defined(GL_OES_texture_storage_multisample_2d_array) */

#if defined(GL_OES_texture_view)
extern PFNGLTEXTUREVIEWOESPROC glTextureViewOES;
#endif /* defined(GL_OES_texture_view) */

#if defined(GL_OES_vertex_array_object)
extern PFNGLBINDVERTEXARRAYOESPROC    glBindVertexArrayOES;
extern PFNGLDELETEVERTEXARRAYSOESPROC glDeleteVertexArraysOES;
extern PFNGLGENVERTEXARRAYSOESPROC    glGenVertexArraysOES;
extern PFNGLISVERTEXARRAYOESPROC      glIsVertexArrayOES;
#endif /* defined(GL_OES_vertex_array_object) */

#if defined(GL_OES_viewport_array)
extern PFNGLVIEWPORTARRAYVOESPROC     glViewportArrayvOES;
extern PFNGLVIEWPORTINDEXEDFOESPROC   glViewportIndexedfOES;
extern PFNGLVIEWPORTINDEXEDFVOESPROC  glViewportIndexedfvOES;
extern PFNGLSCISSORARRAYVOESPROC      glScissorArrayvOES;
extern PFNGLSCISSORINDEXEDOESPROC     glScissorIndexedOES;
extern PFNGLSCISSORINDEXEDVOESPROC    glScissorIndexedvOES;
extern PFNGLDEPTHRANGEARRAYFVOESPROC  glDepthRangeArrayfvOES;
extern PFNGLDEPTHRANGEINDEXEDFOESPROC glDepthRangeIndexedfOES;
extern PFNGLGETFLOATI_VOESPROC        glGetFloati_vOES; // NOLINT(readability-identifier-naming)
#endif /* defined(GL_OES_viewport_array) */

#if defined(GL_OVR_multiview)
extern PFNGLFRAMEBUFFERTEXTUREMULTIVIEWOVRPROC glFramebufferTextureMultiviewOVR;
#endif /* defined(GL_OVR_multiview) */

#if defined(GL_OVR_multiview_multisampled_render_to_texture)
extern PFNGLFRAMEBUFFERTEXTUREMULTISAMPLEMULTIVIEWOVRPROC glFramebufferTextureMultisampleMultiviewOVR;
#endif /* defined(GL_OVR_multiview_multisampled_render_to_texture) */

#if defined(GL_QCOM_alpha_test)
extern PFNGLALPHAFUNCQCOMPROC glAlphaFuncQCOM;
#endif /* defined(GL_QCOM_alpha_test) */

#if defined(GL_QCOM_driver_control)
extern PFNGLGETDRIVERCONTROLSQCOMPROC      glGetDriverControlsQCOM;
extern PFNGLGETDRIVERCONTROLSTRINGQCOMPROC glGetDriverControlStringQCOM;
extern PFNGLENABLEDRIVERCONTROLQCOMPROC    glEnableDriverControlQCOM;
extern PFNGLDISABLEDRIVERCONTROLQCOMPROC   glDisableDriverControlQCOM;
#endif /* defined(GL_QCOM_driver_control) */

#if defined(GL_QCOM_extended_get)
extern PFNGLEXTGETTEXTURESQCOMPROC             glExtGetTexturesQCOM;
extern PFNGLEXTGETBUFFERSQCOMPROC              glExtGetBuffersQCOM;
extern PFNGLEXTGETRENDERBUFFERSQCOMPROC        glExtGetRenderbuffersQCOM;
extern PFNGLEXTGETFRAMEBUFFERSQCOMPROC         glExtGetFramebuffersQCOM;
extern PFNGLEXTGETTEXLEVELPARAMETERIVQCOMPROC  glExtGetTexLevelParameterivQCOM;
extern PFNGLEXTTEXOBJECTSTATEOVERRIDEIQCOMPROC glExtTexObjectStateOverrideiQCOM;
extern PFNGLEXTGETTEXSUBIMAGEQCOMPROC          glExtGetTexSubImageQCOM;
extern PFNGLEXTGETBUFFERPOINTERVQCOMPROC       glExtGetBufferPointervQCOM;
#endif /* defined(GL_QCOM_extended_get) */

#if defined(GL_QCOM_extended_get2)
extern PFNGLEXTGETSHADERSQCOMPROC             glExtGetShadersQCOM;
extern PFNGLEXTGETPROGRAMSQCOMPROC            glExtGetProgramsQCOM;
extern PFNGLEXTISPROGRAMBINARYQCOMPROC        glExtIsProgramBinaryQCOM;
extern PFNGLEXTGETPROGRAMBINARYSOURCEQCOMPROC glExtGetProgramBinarySourceQCOM;
#endif /* defined(GL_QCOM_extended_get2) */

#if defined(GL_QCOM_framebuffer_foveated)
extern PFNGLFRAMEBUFFERFOVEATIONCONFIGQCOMPROC     glFramebufferFoveationConfigQCOM;
extern PFNGLFRAMEBUFFERFOVEATIONPARAMETERSQCOMPROC glFramebufferFoveationParametersQCOM;
#endif /* defined(GL_QCOM_framebuffer_foveated) */

#if defined(GL_QCOM_motion_estimation)
extern PFNGLTEXESTIMATEMOTIONQCOMPROC        glTexEstimateMotionQCOM;
extern PFNGLTEXESTIMATEMOTIONREGIONSQCOMPROC glTexEstimateMotionRegionsQCOM;
#endif /* defined(GL_QCOM_motion_estimation) */

#if defined(GL_QCOM_frame_extrapolation)
extern PFNGLEXTRAPOLATETEX2DQCOMPROC glExtrapolateTex2DQCOM;
#endif /* defined(GL_QCOM_frame_extrapolation) */

#if defined(GL_QCOM_texture_foveated)
extern PFNGLTEXTUREFOVEATIONPARAMETERSQCOMPROC glTextureFoveationParametersQCOM;
#endif /* defined(GL_QCOM_texture_foveated) */

#if defined(GL_QCOM_shader_framebuffer_fetch_noncoherent)
extern PFNGLFRAMEBUFFERFETCHBARRIERQCOMPROC glFramebufferFetchBarrierQCOM;
#endif /* defined(GL_QCOM_shader_framebuffer_fetch_noncoherent) */

#if defined(GL_QCOM_shading_rate)
extern PFNGLSHADINGRATEQCOMPROC glShadingRateQCOM;
#endif /* defined(GL_QCOM_shading_rate) */

#if defined(GL_QCOM_tiled_rendering)
extern PFNGLSTARTTILINGQCOMPROC glStartTilingQCOM;
extern PFNGLENDTILINGQCOMPROC   glEndTilingQCOM;
#endif /* defined(GL_QCOM_tiled_rendering) */

/* GLES2W_GENERATE_GLES_DECLARATION */

/**
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 * The above section is auto-generated from GLES spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 */

using PFNGLES2WLOADPROC = void *(*)(const char *);
void gles2wLoadProcs(PFNGLES2WLOADPROC gles2wLoad);
