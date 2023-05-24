/****************************************************************************
 Copyright (c) 2019-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#include "gles3w.h"

/**
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 * The following section is auto-generated from GLES spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
 */

/* GLES3W_GENERATE_GLES_DEFINITION */
/* GL_ES_VERSION_3_0 */
PFNGLREADBUFFERPROC glReadBuffer;
PFNGLDRAWRANGEELEMENTSPROC glDrawRangeElements;
PFNGLTEXIMAGE3DPROC glTexImage3D;
PFNGLTEXSUBIMAGE3DPROC glTexSubImage3D;
PFNGLCOPYTEXSUBIMAGE3DPROC glCopyTexSubImage3D;
PFNGLCOMPRESSEDTEXIMAGE3DPROC glCompressedTexImage3D;
PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC glCompressedTexSubImage3D;
PFNGLGENQUERIESPROC glGenQueries;
PFNGLDELETEQUERIESPROC glDeleteQueries;
PFNGLISQUERYPROC glIsQuery;
PFNGLBEGINQUERYPROC glBeginQuery;
PFNGLENDQUERYPROC glEndQuery;
PFNGLGETQUERYIVPROC glGetQueryiv;
PFNGLGETQUERYOBJECTUIVPROC glGetQueryObjectuiv;
PFNGLUNMAPBUFFERPROC glUnmapBuffer;
PFNGLGETBUFFERPOINTERVPROC glGetBufferPointerv;
PFNGLDRAWBUFFERSPROC glDrawBuffers;
PFNGLUNIFORMMATRIX2X3FVPROC glUniformMatrix2x3fv;
PFNGLUNIFORMMATRIX3X2FVPROC glUniformMatrix3x2fv;
PFNGLUNIFORMMATRIX2X4FVPROC glUniformMatrix2x4fv;
PFNGLUNIFORMMATRIX4X2FVPROC glUniformMatrix4x2fv;
PFNGLUNIFORMMATRIX3X4FVPROC glUniformMatrix3x4fv;
PFNGLUNIFORMMATRIX4X3FVPROC glUniformMatrix4x3fv;
PFNGLBLITFRAMEBUFFERPROC glBlitFramebuffer;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC glRenderbufferStorageMultisample;
PFNGLFRAMEBUFFERTEXTURELAYERPROC glFramebufferTextureLayer;
PFNGLMAPBUFFERRANGEPROC glMapBufferRange;
PFNGLFLUSHMAPPEDBUFFERRANGEPROC glFlushMappedBufferRange;
PFNGLBINDVERTEXARRAYPROC glBindVertexArray;
PFNGLDELETEVERTEXARRAYSPROC glDeleteVertexArrays;
PFNGLGENVERTEXARRAYSPROC glGenVertexArrays;
PFNGLISVERTEXARRAYPROC glIsVertexArray;
PFNGLGETINTEGERI_VPROC glGetIntegeri_v;
PFNGLBEGINTRANSFORMFEEDBACKPROC glBeginTransformFeedback;
PFNGLENDTRANSFORMFEEDBACKPROC glEndTransformFeedback;
PFNGLBINDBUFFERRANGEPROC glBindBufferRange;
PFNGLBINDBUFFERBASEPROC glBindBufferBase;
PFNGLTRANSFORMFEEDBACKVARYINGSPROC glTransformFeedbackVaryings;
PFNGLGETTRANSFORMFEEDBACKVARYINGPROC glGetTransformFeedbackVarying;
PFNGLVERTEXATTRIBIPOINTERPROC glVertexAttribIPointer;
PFNGLGETVERTEXATTRIBIIVPROC glGetVertexAttribIiv;
PFNGLGETVERTEXATTRIBIUIVPROC glGetVertexAttribIuiv;
PFNGLVERTEXATTRIBI4IPROC glVertexAttribI4i;
PFNGLVERTEXATTRIBI4UIPROC glVertexAttribI4ui;
PFNGLVERTEXATTRIBI4IVPROC glVertexAttribI4iv;
PFNGLVERTEXATTRIBI4UIVPROC glVertexAttribI4uiv;
PFNGLGETUNIFORMUIVPROC glGetUniformuiv;
PFNGLGETFRAGDATALOCATIONPROC glGetFragDataLocation;
PFNGLUNIFORM1UIPROC glUniform1ui;
PFNGLUNIFORM2UIPROC glUniform2ui;
PFNGLUNIFORM3UIPROC glUniform3ui;
PFNGLUNIFORM4UIPROC glUniform4ui;
PFNGLUNIFORM1UIVPROC glUniform1uiv;
PFNGLUNIFORM2UIVPROC glUniform2uiv;
PFNGLUNIFORM3UIVPROC glUniform3uiv;
PFNGLUNIFORM4UIVPROC glUniform4uiv;
PFNGLCLEARBUFFERIVPROC glClearBufferiv;
PFNGLCLEARBUFFERUIVPROC glClearBufferuiv;
PFNGLCLEARBUFFERFVPROC glClearBufferfv;
PFNGLCLEARBUFFERFIPROC glClearBufferfi;
PFNGLGETSTRINGIPROC glGetStringi;
PFNGLCOPYBUFFERSUBDATAPROC glCopyBufferSubData;
PFNGLGETUNIFORMINDICESPROC glGetUniformIndices;
PFNGLGETACTIVEUNIFORMSIVPROC glGetActiveUniformsiv;
PFNGLGETUNIFORMBLOCKINDEXPROC glGetUniformBlockIndex;
PFNGLGETACTIVEUNIFORMBLOCKIVPROC glGetActiveUniformBlockiv;
PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC glGetActiveUniformBlockName;
PFNGLUNIFORMBLOCKBINDINGPROC glUniformBlockBinding;
PFNGLDRAWARRAYSINSTANCEDPROC glDrawArraysInstanced;
PFNGLDRAWELEMENTSINSTANCEDPROC glDrawElementsInstanced;
PFNGLFENCESYNCPROC glFenceSync;
PFNGLISSYNCPROC glIsSync;
PFNGLDELETESYNCPROC glDeleteSync;
PFNGLCLIENTWAITSYNCPROC glClientWaitSync;
PFNGLWAITSYNCPROC glWaitSync;
PFNGLGETINTEGER64VPROC glGetInteger64v;
PFNGLGETSYNCIVPROC glGetSynciv;
PFNGLGETINTEGER64I_VPROC glGetInteger64i_v;
PFNGLGETBUFFERPARAMETERI64VPROC glGetBufferParameteri64v;
PFNGLGENSAMPLERSPROC glGenSamplers;
PFNGLDELETESAMPLERSPROC glDeleteSamplers;
PFNGLISSAMPLERPROC glIsSampler;
PFNGLBINDSAMPLERPROC glBindSampler;
PFNGLSAMPLERPARAMETERIPROC glSamplerParameteri;
PFNGLSAMPLERPARAMETERIVPROC glSamplerParameteriv;
PFNGLSAMPLERPARAMETERFPROC glSamplerParameterf;
PFNGLSAMPLERPARAMETERFVPROC glSamplerParameterfv;
PFNGLGETSAMPLERPARAMETERIVPROC glGetSamplerParameteriv;
PFNGLGETSAMPLERPARAMETERFVPROC glGetSamplerParameterfv;
PFNGLVERTEXATTRIBDIVISORPROC glVertexAttribDivisor;
PFNGLBINDTRANSFORMFEEDBACKPROC glBindTransformFeedback;
PFNGLDELETETRANSFORMFEEDBACKSPROC glDeleteTransformFeedbacks;
PFNGLGENTRANSFORMFEEDBACKSPROC glGenTransformFeedbacks;
PFNGLISTRANSFORMFEEDBACKPROC glIsTransformFeedback;
PFNGLPAUSETRANSFORMFEEDBACKPROC glPauseTransformFeedback;
PFNGLRESUMETRANSFORMFEEDBACKPROC glResumeTransformFeedback;
PFNGLGETPROGRAMBINARYPROC glGetProgramBinary;
PFNGLPROGRAMBINARYPROC glProgramBinary;
PFNGLPROGRAMPARAMETERIPROC glProgramParameteri;
PFNGLINVALIDATEFRAMEBUFFERPROC glInvalidateFramebuffer;
PFNGLINVALIDATESUBFRAMEBUFFERPROC glInvalidateSubFramebuffer;
PFNGLTEXSTORAGE2DPROC glTexStorage2D;
PFNGLTEXSTORAGE3DPROC glTexStorage3D;
PFNGLGETINTERNALFORMATIVPROC glGetInternalformativ;

/* GL_ES_VERSION_3_1 */
PFNGLDISPATCHCOMPUTEPROC glDispatchCompute;
PFNGLDISPATCHCOMPUTEINDIRECTPROC glDispatchComputeIndirect;

PFNGLDRAWARRAYSINDIRECTPROC glDrawArraysIndirect;
PFNGLDRAWELEMENTSINDIRECTPROC glDrawElementsIndirect;

PFNGLFRAMEBUFFERPARAMETERIPROC glFramebufferParameteri;
PFNGLGETFRAMEBUFFERPARAMETERIVPROC glGetFramebufferParameteriv;

PFNGLGETPROGRAMINTERFACEIVPROC glGetProgramInterfaceiv;
PFNGLGETPROGRAMRESOURCEINDEXPROC glGetProgramResourceIndex;
PFNGLGETPROGRAMRESOURCENAMEPROC glGetProgramResourceName;
PFNGLGETPROGRAMRESOURCEIVPROC glGetProgramResourceiv;
PFNGLGETPROGRAMRESOURCELOCATIONPROC glGetProgramResourceLocation;

PFNGLUSEPROGRAMSTAGESPROC glUseProgramStages;
PFNGLACTIVESHADERPROGRAMPROC glActiveShaderProgram;
PFNGLCREATESHADERPROGRAMVPROC glCreateShaderProgramv;
PFNGLBINDPROGRAMPIPELINEPROC glBindProgramPipeline;
PFNGLDELETEPROGRAMPIPELINESPROC glDeleteProgramPipelines;
PFNGLGENPROGRAMPIPELINESPROC glGenProgramPipelines;
PFNGLISPROGRAMPIPELINEPROC glIsProgramPipeline;
PFNGLGETPROGRAMPIPELINEIVPROC glGetProgramPipelineiv;
PFNGLPROGRAMUNIFORM1IPROC glProgramUniform1i;
PFNGLPROGRAMUNIFORM2IPROC glProgramUniform2i;
PFNGLPROGRAMUNIFORM3IPROC glProgramUniform3i;
PFNGLPROGRAMUNIFORM4IPROC glProgramUniform4i;
PFNGLPROGRAMUNIFORM1UIPROC glProgramUniform1ui;
PFNGLPROGRAMUNIFORM2UIPROC glProgramUniform2ui;
PFNGLPROGRAMUNIFORM3UIPROC glProgramUniform3ui;
PFNGLPROGRAMUNIFORM4UIPROC glProgramUniform4ui;
PFNGLPROGRAMUNIFORM1FPROC glProgramUniform1f;
PFNGLPROGRAMUNIFORM2FPROC glProgramUniform2f;
PFNGLPROGRAMUNIFORM3FPROC glProgramUniform3f;
PFNGLPROGRAMUNIFORM4FPROC glProgramUniform4f;
PFNGLPROGRAMUNIFORM1IVPROC glProgramUniform1iv;
PFNGLPROGRAMUNIFORM2IVPROC glProgramUniform2iv;
PFNGLPROGRAMUNIFORM3IVPROC glProgramUniform3iv;
PFNGLPROGRAMUNIFORM4IVPROC glProgramUniform4iv;
PFNGLPROGRAMUNIFORM1UIVPROC glProgramUniform1uiv;
PFNGLPROGRAMUNIFORM2UIVPROC glProgramUniform2uiv;
PFNGLPROGRAMUNIFORM3UIVPROC glProgramUniform3uiv;
PFNGLPROGRAMUNIFORM4UIVPROC glProgramUniform4uiv;
PFNGLPROGRAMUNIFORM1FVPROC glProgramUniform1fv;
PFNGLPROGRAMUNIFORM2FVPROC glProgramUniform2fv;
PFNGLPROGRAMUNIFORM3FVPROC glProgramUniform3fv;
PFNGLPROGRAMUNIFORM4FVPROC glProgramUniform4fv;
PFNGLPROGRAMUNIFORMMATRIX2FVPROC glProgramUniformMatrix2fv;
PFNGLPROGRAMUNIFORMMATRIX3FVPROC glProgramUniformMatrix3fv;
PFNGLPROGRAMUNIFORMMATRIX4FVPROC glProgramUniformMatrix4fv;
PFNGLPROGRAMUNIFORMMATRIX2X3FVPROC glProgramUniformMatrix2x3fv;
PFNGLPROGRAMUNIFORMMATRIX3X2FVPROC glProgramUniformMatrix3x2fv;
PFNGLPROGRAMUNIFORMMATRIX2X4FVPROC glProgramUniformMatrix2x4fv;
PFNGLPROGRAMUNIFORMMATRIX4X2FVPROC glProgramUniformMatrix4x2fv;
PFNGLPROGRAMUNIFORMMATRIX3X4FVPROC glProgramUniformMatrix3x4fv;
PFNGLPROGRAMUNIFORMMATRIX4X3FVPROC glProgramUniformMatrix4x3fv;
PFNGLVALIDATEPROGRAMPIPELINEPROC glValidateProgramPipeline;
PFNGLGETPROGRAMPIPELINEINFOLOGPROC glGetProgramPipelineInfoLog;

PFNGLBINDIMAGETEXTUREPROC glBindImageTexture;
PFNGLGETBOOLEANI_VPROC glGetBooleani_v;
PFNGLMEMORYBARRIERPROC glMemoryBarrier;
PFNGLMEMORYBARRIERBYREGIONPROC glMemoryBarrierByRegion;

PFNGLTEXSTORAGE2DMULTISAMPLEPROC glTexStorage2DMultisample;
PFNGLGETMULTISAMPLEFVPROC glGetMultisamplefv;
PFNGLSAMPLEMASKIPROC glSampleMaski;
PFNGLGETTEXLEVELPARAMETERIVPROC glGetTexLevelParameteriv;
PFNGLGETTEXLEVELPARAMETERFVPROC glGetTexLevelParameterfv;

PFNGLBINDVERTEXBUFFERPROC glBindVertexBuffer;
PFNGLVERTEXATTRIBFORMATPROC glVertexAttribFormat;
PFNGLVERTEXATTRIBIFORMATPROC glVertexAttribIFormat;
PFNGLVERTEXATTRIBBINDINGPROC glVertexAttribBinding;
PFNGLVERTEXBINDINGDIVISORPROC glVertexBindingDivisor;

/* GL_ES_VERSION_3_2 */
PFNGLBLENDBARRIERPROC glBlendBarrier;

PFNGLCOPYIMAGESUBDATAPROC glCopyImageSubData;

PFNGLDEBUGMESSAGECONTROLPROC glDebugMessageControl;
PFNGLDEBUGMESSAGEINSERTPROC glDebugMessageInsert;
PFNGLDEBUGMESSAGECALLBACKPROC glDebugMessageCallback;
PFNGLGETDEBUGMESSAGELOGPROC glGetDebugMessageLog;
PFNGLPUSHDEBUGGROUPPROC glPushDebugGroup;
PFNGLPOPDEBUGGROUPPROC glPopDebugGroup;
PFNGLOBJECTLABELPROC glObjectLabel;
PFNGLGETOBJECTLABELPROC glGetObjectLabel;
PFNGLOBJECTPTRLABELPROC glObjectPtrLabel;
PFNGLGETOBJECTPTRLABELPROC glGetObjectPtrLabel;
PFNGLGETPOINTERVPROC glGetPointerv;

PFNGLENABLEIPROC glEnablei;
PFNGLDISABLEIPROC glDisablei;
PFNGLBLENDEQUATIONIPROC glBlendEquationi;
PFNGLBLENDEQUATIONSEPARATEIPROC glBlendEquationSeparatei;
PFNGLBLENDFUNCIPROC glBlendFunci;
PFNGLBLENDFUNCSEPARATEIPROC glBlendFuncSeparatei;
PFNGLCOLORMASKIPROC glColorMaski;
PFNGLISENABLEDIPROC glIsEnabledi;

PFNGLDRAWELEMENTSBASEVERTEXPROC glDrawElementsBaseVertex;
PFNGLDRAWRANGEELEMENTSBASEVERTEXPROC glDrawRangeElementsBaseVertex;
PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXPROC glDrawElementsInstancedBaseVertex;

PFNGLFRAMEBUFFERTEXTUREPROC glFramebufferTexture;

PFNGLPRIMITIVEBOUNDINGBOXPROC glPrimitiveBoundingBox;

PFNGLGETGRAPHICSRESETSTATUSPROC glGetGraphicsResetStatus;
PFNGLREADNPIXELSPROC glReadnPixels;
PFNGLGETNUNIFORMFVPROC glGetnUniformfv;
PFNGLGETNUNIFORMIVPROC glGetnUniformiv;
PFNGLGETNUNIFORMUIVPROC glGetnUniformuiv;

PFNGLMINSAMPLESHADINGPROC glMinSampleShading;

PFNGLPATCHPARAMETERIPROC glPatchParameteri;

PFNGLTEXPARAMETERIIVPROC glTexParameterIiv;
PFNGLTEXPARAMETERIUIVPROC glTexParameterIuiv;
PFNGLGETTEXPARAMETERIIVPROC glGetTexParameterIiv;
PFNGLGETTEXPARAMETERIUIVPROC glGetTexParameterIuiv;
PFNGLSAMPLERPARAMETERIIVPROC glSamplerParameterIiv;
PFNGLSAMPLERPARAMETERIUIVPROC glSamplerParameterIuiv;
PFNGLGETSAMPLERPARAMETERIIVPROC glGetSamplerParameterIiv;
PFNGLGETSAMPLERPARAMETERIUIVPROC glGetSamplerParameterIuiv;

PFNGLTEXBUFFERPROC glTexBuffer;
PFNGLTEXBUFFERRANGEPROC glTexBufferRange;

PFNGLTEXSTORAGE3DMULTISAMPLEPROC glTexStorage3DMultisample;

/* GLES3W_GENERATE_GLES_DEFINITION */

/**
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 * The above section is auto-generated from GLES spec by running:
 * node tools/gles-wrangler-generator/generate.js
 * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
 */

void gles3wLoadProcs(PFNGLES3WLOADPROC gles3wLoad) {
    /**
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     * The following section is auto-generated from GLES spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
     */

    /* GLES3W_GENERATE_GLES_LOAD */
    /* GL_ES_VERSION_3_0 */
    glReadBuffer = reinterpret_cast<PFNGLREADBUFFERPROC>(gles3wLoad("glReadBuffer"));
    glDrawRangeElements = reinterpret_cast<PFNGLDRAWRANGEELEMENTSPROC>(gles3wLoad("glDrawRangeElements"));
    glTexImage3D = reinterpret_cast<PFNGLTEXIMAGE3DPROC>(gles3wLoad("glTexImage3D"));
    glTexSubImage3D = reinterpret_cast<PFNGLTEXSUBIMAGE3DPROC>(gles3wLoad("glTexSubImage3D"));
    glCopyTexSubImage3D = reinterpret_cast<PFNGLCOPYTEXSUBIMAGE3DPROC>(gles3wLoad("glCopyTexSubImage3D"));
    glCompressedTexImage3D = reinterpret_cast<PFNGLCOMPRESSEDTEXIMAGE3DPROC>(gles3wLoad("glCompressedTexImage3D"));
    glCompressedTexSubImage3D = reinterpret_cast<PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC>(gles3wLoad("glCompressedTexSubImage3D"));
    glGenQueries = reinterpret_cast<PFNGLGENQUERIESPROC>(gles3wLoad("glGenQueries"));
    glDeleteQueries = reinterpret_cast<PFNGLDELETEQUERIESPROC>(gles3wLoad("glDeleteQueries"));
    glIsQuery = reinterpret_cast<PFNGLISQUERYPROC>(gles3wLoad("glIsQuery"));
    glBeginQuery = reinterpret_cast<PFNGLBEGINQUERYPROC>(gles3wLoad("glBeginQuery"));
    glEndQuery = reinterpret_cast<PFNGLENDQUERYPROC>(gles3wLoad("glEndQuery"));
    glGetQueryiv = reinterpret_cast<PFNGLGETQUERYIVPROC>(gles3wLoad("glGetQueryiv"));
    glGetQueryObjectuiv = reinterpret_cast<PFNGLGETQUERYOBJECTUIVPROC>(gles3wLoad("glGetQueryObjectuiv"));
    glUnmapBuffer = reinterpret_cast<PFNGLUNMAPBUFFERPROC>(gles3wLoad("glUnmapBuffer"));
    glGetBufferPointerv = reinterpret_cast<PFNGLGETBUFFERPOINTERVPROC>(gles3wLoad("glGetBufferPointerv"));
    glDrawBuffers = reinterpret_cast<PFNGLDRAWBUFFERSPROC>(gles3wLoad("glDrawBuffers"));
    glUniformMatrix2x3fv = reinterpret_cast<PFNGLUNIFORMMATRIX2X3FVPROC>(gles3wLoad("glUniformMatrix2x3fv"));
    glUniformMatrix3x2fv = reinterpret_cast<PFNGLUNIFORMMATRIX3X2FVPROC>(gles3wLoad("glUniformMatrix3x2fv"));
    glUniformMatrix2x4fv = reinterpret_cast<PFNGLUNIFORMMATRIX2X4FVPROC>(gles3wLoad("glUniformMatrix2x4fv"));
    glUniformMatrix4x2fv = reinterpret_cast<PFNGLUNIFORMMATRIX4X2FVPROC>(gles3wLoad("glUniformMatrix4x2fv"));
    glUniformMatrix3x4fv = reinterpret_cast<PFNGLUNIFORMMATRIX3X4FVPROC>(gles3wLoad("glUniformMatrix3x4fv"));
    glUniformMatrix4x3fv = reinterpret_cast<PFNGLUNIFORMMATRIX4X3FVPROC>(gles3wLoad("glUniformMatrix4x3fv"));
    glBlitFramebuffer = reinterpret_cast<PFNGLBLITFRAMEBUFFERPROC>(gles3wLoad("glBlitFramebuffer"));
    glRenderbufferStorageMultisample = reinterpret_cast<PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC>(gles3wLoad("glRenderbufferStorageMultisample"));
    glFramebufferTextureLayer = reinterpret_cast<PFNGLFRAMEBUFFERTEXTURELAYERPROC>(gles3wLoad("glFramebufferTextureLayer"));
    glMapBufferRange = reinterpret_cast<PFNGLMAPBUFFERRANGEPROC>(gles3wLoad("glMapBufferRange"));
    glFlushMappedBufferRange = reinterpret_cast<PFNGLFLUSHMAPPEDBUFFERRANGEPROC>(gles3wLoad("glFlushMappedBufferRange"));
    glBindVertexArray = reinterpret_cast<PFNGLBINDVERTEXARRAYPROC>(gles3wLoad("glBindVertexArray"));
    glDeleteVertexArrays = reinterpret_cast<PFNGLDELETEVERTEXARRAYSPROC>(gles3wLoad("glDeleteVertexArrays"));
    glGenVertexArrays = reinterpret_cast<PFNGLGENVERTEXARRAYSPROC>(gles3wLoad("glGenVertexArrays"));
    glIsVertexArray = reinterpret_cast<PFNGLISVERTEXARRAYPROC>(gles3wLoad("glIsVertexArray"));
    glGetIntegeri_v = reinterpret_cast<PFNGLGETINTEGERI_VPROC>(gles3wLoad("glGetIntegeri_v"));
    glBeginTransformFeedback = reinterpret_cast<PFNGLBEGINTRANSFORMFEEDBACKPROC>(gles3wLoad("glBeginTransformFeedback"));
    glEndTransformFeedback = reinterpret_cast<PFNGLENDTRANSFORMFEEDBACKPROC>(gles3wLoad("glEndTransformFeedback"));
    glBindBufferRange = reinterpret_cast<PFNGLBINDBUFFERRANGEPROC>(gles3wLoad("glBindBufferRange"));
    glBindBufferBase = reinterpret_cast<PFNGLBINDBUFFERBASEPROC>(gles3wLoad("glBindBufferBase"));
    glTransformFeedbackVaryings = reinterpret_cast<PFNGLTRANSFORMFEEDBACKVARYINGSPROC>(gles3wLoad("glTransformFeedbackVaryings"));
    glGetTransformFeedbackVarying = reinterpret_cast<PFNGLGETTRANSFORMFEEDBACKVARYINGPROC>(gles3wLoad("glGetTransformFeedbackVarying"));
    glVertexAttribIPointer = reinterpret_cast<PFNGLVERTEXATTRIBIPOINTERPROC>(gles3wLoad("glVertexAttribIPointer"));
    glGetVertexAttribIiv = reinterpret_cast<PFNGLGETVERTEXATTRIBIIVPROC>(gles3wLoad("glGetVertexAttribIiv"));
    glGetVertexAttribIuiv = reinterpret_cast<PFNGLGETVERTEXATTRIBIUIVPROC>(gles3wLoad("glGetVertexAttribIuiv"));
    glVertexAttribI4i = reinterpret_cast<PFNGLVERTEXATTRIBI4IPROC>(gles3wLoad("glVertexAttribI4i"));
    glVertexAttribI4ui = reinterpret_cast<PFNGLVERTEXATTRIBI4UIPROC>(gles3wLoad("glVertexAttribI4ui"));
    glVertexAttribI4iv = reinterpret_cast<PFNGLVERTEXATTRIBI4IVPROC>(gles3wLoad("glVertexAttribI4iv"));
    glVertexAttribI4uiv = reinterpret_cast<PFNGLVERTEXATTRIBI4UIVPROC>(gles3wLoad("glVertexAttribI4uiv"));
    glGetUniformuiv = reinterpret_cast<PFNGLGETUNIFORMUIVPROC>(gles3wLoad("glGetUniformuiv"));
    glGetFragDataLocation = reinterpret_cast<PFNGLGETFRAGDATALOCATIONPROC>(gles3wLoad("glGetFragDataLocation"));
    glUniform1ui = reinterpret_cast<PFNGLUNIFORM1UIPROC>(gles3wLoad("glUniform1ui"));
    glUniform2ui = reinterpret_cast<PFNGLUNIFORM2UIPROC>(gles3wLoad("glUniform2ui"));
    glUniform3ui = reinterpret_cast<PFNGLUNIFORM3UIPROC>(gles3wLoad("glUniform3ui"));
    glUniform4ui = reinterpret_cast<PFNGLUNIFORM4UIPROC>(gles3wLoad("glUniform4ui"));
    glUniform1uiv = reinterpret_cast<PFNGLUNIFORM1UIVPROC>(gles3wLoad("glUniform1uiv"));
    glUniform2uiv = reinterpret_cast<PFNGLUNIFORM2UIVPROC>(gles3wLoad("glUniform2uiv"));
    glUniform3uiv = reinterpret_cast<PFNGLUNIFORM3UIVPROC>(gles3wLoad("glUniform3uiv"));
    glUniform4uiv = reinterpret_cast<PFNGLUNIFORM4UIVPROC>(gles3wLoad("glUniform4uiv"));
    glClearBufferiv = reinterpret_cast<PFNGLCLEARBUFFERIVPROC>(gles3wLoad("glClearBufferiv"));
    glClearBufferuiv = reinterpret_cast<PFNGLCLEARBUFFERUIVPROC>(gles3wLoad("glClearBufferuiv"));
    glClearBufferfv = reinterpret_cast<PFNGLCLEARBUFFERFVPROC>(gles3wLoad("glClearBufferfv"));
    glClearBufferfi = reinterpret_cast<PFNGLCLEARBUFFERFIPROC>(gles3wLoad("glClearBufferfi"));
    glGetStringi = reinterpret_cast<PFNGLGETSTRINGIPROC>(gles3wLoad("glGetStringi"));
    glCopyBufferSubData = reinterpret_cast<PFNGLCOPYBUFFERSUBDATAPROC>(gles3wLoad("glCopyBufferSubData"));
    glGetUniformIndices = reinterpret_cast<PFNGLGETUNIFORMINDICESPROC>(gles3wLoad("glGetUniformIndices"));
    glGetActiveUniformsiv = reinterpret_cast<PFNGLGETACTIVEUNIFORMSIVPROC>(gles3wLoad("glGetActiveUniformsiv"));
    glGetUniformBlockIndex = reinterpret_cast<PFNGLGETUNIFORMBLOCKINDEXPROC>(gles3wLoad("glGetUniformBlockIndex"));
    glGetActiveUniformBlockiv = reinterpret_cast<PFNGLGETACTIVEUNIFORMBLOCKIVPROC>(gles3wLoad("glGetActiveUniformBlockiv"));
    glGetActiveUniformBlockName = reinterpret_cast<PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC>(gles3wLoad("glGetActiveUniformBlockName"));
    glUniformBlockBinding = reinterpret_cast<PFNGLUNIFORMBLOCKBINDINGPROC>(gles3wLoad("glUniformBlockBinding"));
    glDrawArraysInstanced = reinterpret_cast<PFNGLDRAWARRAYSINSTANCEDPROC>(gles3wLoad("glDrawArraysInstanced"));
    glDrawElementsInstanced = reinterpret_cast<PFNGLDRAWELEMENTSINSTANCEDPROC>(gles3wLoad("glDrawElementsInstanced"));
    glFenceSync = reinterpret_cast<PFNGLFENCESYNCPROC>(gles3wLoad("glFenceSync"));
    glIsSync = reinterpret_cast<PFNGLISSYNCPROC>(gles3wLoad("glIsSync"));
    glDeleteSync = reinterpret_cast<PFNGLDELETESYNCPROC>(gles3wLoad("glDeleteSync"));
    glClientWaitSync = reinterpret_cast<PFNGLCLIENTWAITSYNCPROC>(gles3wLoad("glClientWaitSync"));
    glWaitSync = reinterpret_cast<PFNGLWAITSYNCPROC>(gles3wLoad("glWaitSync"));
    glGetInteger64v = reinterpret_cast<PFNGLGETINTEGER64VPROC>(gles3wLoad("glGetInteger64v"));
    glGetSynciv = reinterpret_cast<PFNGLGETSYNCIVPROC>(gles3wLoad("glGetSynciv"));
    glGetInteger64i_v = reinterpret_cast<PFNGLGETINTEGER64I_VPROC>(gles3wLoad("glGetInteger64i_v"));
    glGetBufferParameteri64v = reinterpret_cast<PFNGLGETBUFFERPARAMETERI64VPROC>(gles3wLoad("glGetBufferParameteri64v"));
    glGenSamplers = reinterpret_cast<PFNGLGENSAMPLERSPROC>(gles3wLoad("glGenSamplers"));
    glDeleteSamplers = reinterpret_cast<PFNGLDELETESAMPLERSPROC>(gles3wLoad("glDeleteSamplers"));
    glIsSampler = reinterpret_cast<PFNGLISSAMPLERPROC>(gles3wLoad("glIsSampler"));
    glBindSampler = reinterpret_cast<PFNGLBINDSAMPLERPROC>(gles3wLoad("glBindSampler"));
    glSamplerParameteri = reinterpret_cast<PFNGLSAMPLERPARAMETERIPROC>(gles3wLoad("glSamplerParameteri"));
    glSamplerParameteriv = reinterpret_cast<PFNGLSAMPLERPARAMETERIVPROC>(gles3wLoad("glSamplerParameteriv"));
    glSamplerParameterf = reinterpret_cast<PFNGLSAMPLERPARAMETERFPROC>(gles3wLoad("glSamplerParameterf"));
    glSamplerParameterfv = reinterpret_cast<PFNGLSAMPLERPARAMETERFVPROC>(gles3wLoad("glSamplerParameterfv"));
    glGetSamplerParameteriv = reinterpret_cast<PFNGLGETSAMPLERPARAMETERIVPROC>(gles3wLoad("glGetSamplerParameteriv"));
    glGetSamplerParameterfv = reinterpret_cast<PFNGLGETSAMPLERPARAMETERFVPROC>(gles3wLoad("glGetSamplerParameterfv"));
    glVertexAttribDivisor = reinterpret_cast<PFNGLVERTEXATTRIBDIVISORPROC>(gles3wLoad("glVertexAttribDivisor"));
    glBindTransformFeedback = reinterpret_cast<PFNGLBINDTRANSFORMFEEDBACKPROC>(gles3wLoad("glBindTransformFeedback"));
    glDeleteTransformFeedbacks = reinterpret_cast<PFNGLDELETETRANSFORMFEEDBACKSPROC>(gles3wLoad("glDeleteTransformFeedbacks"));
    glGenTransformFeedbacks = reinterpret_cast<PFNGLGENTRANSFORMFEEDBACKSPROC>(gles3wLoad("glGenTransformFeedbacks"));
    glIsTransformFeedback = reinterpret_cast<PFNGLISTRANSFORMFEEDBACKPROC>(gles3wLoad("glIsTransformFeedback"));
    glPauseTransformFeedback = reinterpret_cast<PFNGLPAUSETRANSFORMFEEDBACKPROC>(gles3wLoad("glPauseTransformFeedback"));
    glResumeTransformFeedback = reinterpret_cast<PFNGLRESUMETRANSFORMFEEDBACKPROC>(gles3wLoad("glResumeTransformFeedback"));
    glGetProgramBinary = reinterpret_cast<PFNGLGETPROGRAMBINARYPROC>(gles3wLoad("glGetProgramBinary"));
    glProgramBinary = reinterpret_cast<PFNGLPROGRAMBINARYPROC>(gles3wLoad("glProgramBinary"));
    glProgramParameteri = reinterpret_cast<PFNGLPROGRAMPARAMETERIPROC>(gles3wLoad("glProgramParameteri"));
    glInvalidateFramebuffer = reinterpret_cast<PFNGLINVALIDATEFRAMEBUFFERPROC>(gles3wLoad("glInvalidateFramebuffer"));
    glInvalidateSubFramebuffer = reinterpret_cast<PFNGLINVALIDATESUBFRAMEBUFFERPROC>(gles3wLoad("glInvalidateSubFramebuffer"));
    glTexStorage2D = reinterpret_cast<PFNGLTEXSTORAGE2DPROC>(gles3wLoad("glTexStorage2D"));
    glTexStorage3D = reinterpret_cast<PFNGLTEXSTORAGE3DPROC>(gles3wLoad("glTexStorage3D"));
    glGetInternalformativ = reinterpret_cast<PFNGLGETINTERNALFORMATIVPROC>(gles3wLoad("glGetInternalformativ"));

    /* GL_ES_VERSION_3_1 */
    glDispatchCompute = reinterpret_cast<PFNGLDISPATCHCOMPUTEPROC>(gles3wLoad("glDispatchCompute"));
    glDispatchComputeIndirect = reinterpret_cast<PFNGLDISPATCHCOMPUTEINDIRECTPROC>(gles3wLoad("glDispatchComputeIndirect"));

    glDrawArraysIndirect = reinterpret_cast<PFNGLDRAWARRAYSINDIRECTPROC>(gles3wLoad("glDrawArraysIndirect"));
    glDrawElementsIndirect = reinterpret_cast<PFNGLDRAWELEMENTSINDIRECTPROC>(gles3wLoad("glDrawElementsIndirect"));

    glFramebufferParameteri = reinterpret_cast<PFNGLFRAMEBUFFERPARAMETERIPROC>(gles3wLoad("glFramebufferParameteri"));
    glGetFramebufferParameteriv = reinterpret_cast<PFNGLGETFRAMEBUFFERPARAMETERIVPROC>(gles3wLoad("glGetFramebufferParameteriv"));

    glGetProgramInterfaceiv = reinterpret_cast<PFNGLGETPROGRAMINTERFACEIVPROC>(gles3wLoad("glGetProgramInterfaceiv"));
    glGetProgramResourceIndex = reinterpret_cast<PFNGLGETPROGRAMRESOURCEINDEXPROC>(gles3wLoad("glGetProgramResourceIndex"));
    glGetProgramResourceName = reinterpret_cast<PFNGLGETPROGRAMRESOURCENAMEPROC>(gles3wLoad("glGetProgramResourceName"));
    glGetProgramResourceiv = reinterpret_cast<PFNGLGETPROGRAMRESOURCEIVPROC>(gles3wLoad("glGetProgramResourceiv"));
    glGetProgramResourceLocation = reinterpret_cast<PFNGLGETPROGRAMRESOURCELOCATIONPROC>(gles3wLoad("glGetProgramResourceLocation"));

    glUseProgramStages = reinterpret_cast<PFNGLUSEPROGRAMSTAGESPROC>(gles3wLoad("glUseProgramStages"));
    glActiveShaderProgram = reinterpret_cast<PFNGLACTIVESHADERPROGRAMPROC>(gles3wLoad("glActiveShaderProgram"));
    glCreateShaderProgramv = reinterpret_cast<PFNGLCREATESHADERPROGRAMVPROC>(gles3wLoad("glCreateShaderProgramv"));
    glBindProgramPipeline = reinterpret_cast<PFNGLBINDPROGRAMPIPELINEPROC>(gles3wLoad("glBindProgramPipeline"));
    glDeleteProgramPipelines = reinterpret_cast<PFNGLDELETEPROGRAMPIPELINESPROC>(gles3wLoad("glDeleteProgramPipelines"));
    glGenProgramPipelines = reinterpret_cast<PFNGLGENPROGRAMPIPELINESPROC>(gles3wLoad("glGenProgramPipelines"));
    glIsProgramPipeline = reinterpret_cast<PFNGLISPROGRAMPIPELINEPROC>(gles3wLoad("glIsProgramPipeline"));
    glGetProgramPipelineiv = reinterpret_cast<PFNGLGETPROGRAMPIPELINEIVPROC>(gles3wLoad("glGetProgramPipelineiv"));
    glProgramUniform1i = reinterpret_cast<PFNGLPROGRAMUNIFORM1IPROC>(gles3wLoad("glProgramUniform1i"));
    glProgramUniform2i = reinterpret_cast<PFNGLPROGRAMUNIFORM2IPROC>(gles3wLoad("glProgramUniform2i"));
    glProgramUniform3i = reinterpret_cast<PFNGLPROGRAMUNIFORM3IPROC>(gles3wLoad("glProgramUniform3i"));
    glProgramUniform4i = reinterpret_cast<PFNGLPROGRAMUNIFORM4IPROC>(gles3wLoad("glProgramUniform4i"));
    glProgramUniform1ui = reinterpret_cast<PFNGLPROGRAMUNIFORM1UIPROC>(gles3wLoad("glProgramUniform1ui"));
    glProgramUniform2ui = reinterpret_cast<PFNGLPROGRAMUNIFORM2UIPROC>(gles3wLoad("glProgramUniform2ui"));
    glProgramUniform3ui = reinterpret_cast<PFNGLPROGRAMUNIFORM3UIPROC>(gles3wLoad("glProgramUniform3ui"));
    glProgramUniform4ui = reinterpret_cast<PFNGLPROGRAMUNIFORM4UIPROC>(gles3wLoad("glProgramUniform4ui"));
    glProgramUniform1f = reinterpret_cast<PFNGLPROGRAMUNIFORM1FPROC>(gles3wLoad("glProgramUniform1f"));
    glProgramUniform2f = reinterpret_cast<PFNGLPROGRAMUNIFORM2FPROC>(gles3wLoad("glProgramUniform2f"));
    glProgramUniform3f = reinterpret_cast<PFNGLPROGRAMUNIFORM3FPROC>(gles3wLoad("glProgramUniform3f"));
    glProgramUniform4f = reinterpret_cast<PFNGLPROGRAMUNIFORM4FPROC>(gles3wLoad("glProgramUniform4f"));
    glProgramUniform1iv = reinterpret_cast<PFNGLPROGRAMUNIFORM1IVPROC>(gles3wLoad("glProgramUniform1iv"));
    glProgramUniform2iv = reinterpret_cast<PFNGLPROGRAMUNIFORM2IVPROC>(gles3wLoad("glProgramUniform2iv"));
    glProgramUniform3iv = reinterpret_cast<PFNGLPROGRAMUNIFORM3IVPROC>(gles3wLoad("glProgramUniform3iv"));
    glProgramUniform4iv = reinterpret_cast<PFNGLPROGRAMUNIFORM4IVPROC>(gles3wLoad("glProgramUniform4iv"));
    glProgramUniform1uiv = reinterpret_cast<PFNGLPROGRAMUNIFORM1UIVPROC>(gles3wLoad("glProgramUniform1uiv"));
    glProgramUniform2uiv = reinterpret_cast<PFNGLPROGRAMUNIFORM2UIVPROC>(gles3wLoad("glProgramUniform2uiv"));
    glProgramUniform3uiv = reinterpret_cast<PFNGLPROGRAMUNIFORM3UIVPROC>(gles3wLoad("glProgramUniform3uiv"));
    glProgramUniform4uiv = reinterpret_cast<PFNGLPROGRAMUNIFORM4UIVPROC>(gles3wLoad("glProgramUniform4uiv"));
    glProgramUniform1fv = reinterpret_cast<PFNGLPROGRAMUNIFORM1FVPROC>(gles3wLoad("glProgramUniform1fv"));
    glProgramUniform2fv = reinterpret_cast<PFNGLPROGRAMUNIFORM2FVPROC>(gles3wLoad("glProgramUniform2fv"));
    glProgramUniform3fv = reinterpret_cast<PFNGLPROGRAMUNIFORM3FVPROC>(gles3wLoad("glProgramUniform3fv"));
    glProgramUniform4fv = reinterpret_cast<PFNGLPROGRAMUNIFORM4FVPROC>(gles3wLoad("glProgramUniform4fv"));
    glProgramUniformMatrix2fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX2FVPROC>(gles3wLoad("glProgramUniformMatrix2fv"));
    glProgramUniformMatrix3fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX3FVPROC>(gles3wLoad("glProgramUniformMatrix3fv"));
    glProgramUniformMatrix4fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX4FVPROC>(gles3wLoad("glProgramUniformMatrix4fv"));
    glProgramUniformMatrix2x3fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX2X3FVPROC>(gles3wLoad("glProgramUniformMatrix2x3fv"));
    glProgramUniformMatrix3x2fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX3X2FVPROC>(gles3wLoad("glProgramUniformMatrix3x2fv"));
    glProgramUniformMatrix2x4fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX2X4FVPROC>(gles3wLoad("glProgramUniformMatrix2x4fv"));
    glProgramUniformMatrix4x2fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX4X2FVPROC>(gles3wLoad("glProgramUniformMatrix4x2fv"));
    glProgramUniformMatrix3x4fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX3X4FVPROC>(gles3wLoad("glProgramUniformMatrix3x4fv"));
    glProgramUniformMatrix4x3fv = reinterpret_cast<PFNGLPROGRAMUNIFORMMATRIX4X3FVPROC>(gles3wLoad("glProgramUniformMatrix4x3fv"));
    glValidateProgramPipeline = reinterpret_cast<PFNGLVALIDATEPROGRAMPIPELINEPROC>(gles3wLoad("glValidateProgramPipeline"));
    glGetProgramPipelineInfoLog = reinterpret_cast<PFNGLGETPROGRAMPIPELINEINFOLOGPROC>(gles3wLoad("glGetProgramPipelineInfoLog"));

    glBindImageTexture = reinterpret_cast<PFNGLBINDIMAGETEXTUREPROC>(gles3wLoad("glBindImageTexture"));
    glGetBooleani_v = reinterpret_cast<PFNGLGETBOOLEANI_VPROC>(gles3wLoad("glGetBooleani_v"));
    glMemoryBarrier = reinterpret_cast<PFNGLMEMORYBARRIERPROC>(gles3wLoad("glMemoryBarrier"));
    glMemoryBarrierByRegion = reinterpret_cast<PFNGLMEMORYBARRIERBYREGIONPROC>(gles3wLoad("glMemoryBarrierByRegion"));

    glTexStorage2DMultisample = reinterpret_cast<PFNGLTEXSTORAGE2DMULTISAMPLEPROC>(gles3wLoad("glTexStorage2DMultisample"));
    glGetMultisamplefv = reinterpret_cast<PFNGLGETMULTISAMPLEFVPROC>(gles3wLoad("glGetMultisamplefv"));
    glSampleMaski = reinterpret_cast<PFNGLSAMPLEMASKIPROC>(gles3wLoad("glSampleMaski"));
    glGetTexLevelParameteriv = reinterpret_cast<PFNGLGETTEXLEVELPARAMETERIVPROC>(gles3wLoad("glGetTexLevelParameteriv"));
    glGetTexLevelParameterfv = reinterpret_cast<PFNGLGETTEXLEVELPARAMETERFVPROC>(gles3wLoad("glGetTexLevelParameterfv"));

    glBindVertexBuffer = reinterpret_cast<PFNGLBINDVERTEXBUFFERPROC>(gles3wLoad("glBindVertexBuffer"));
    glVertexAttribFormat = reinterpret_cast<PFNGLVERTEXATTRIBFORMATPROC>(gles3wLoad("glVertexAttribFormat"));
    glVertexAttribIFormat = reinterpret_cast<PFNGLVERTEXATTRIBIFORMATPROC>(gles3wLoad("glVertexAttribIFormat"));
    glVertexAttribBinding = reinterpret_cast<PFNGLVERTEXATTRIBBINDINGPROC>(gles3wLoad("glVertexAttribBinding"));
    glVertexBindingDivisor = reinterpret_cast<PFNGLVERTEXBINDINGDIVISORPROC>(gles3wLoad("glVertexBindingDivisor"));

    /* GL_ES_VERSION_3_2 */
    glBlendBarrier = reinterpret_cast<PFNGLBLENDBARRIERPROC>(gles3wLoad("glBlendBarrier"));

    glCopyImageSubData = reinterpret_cast<PFNGLCOPYIMAGESUBDATAPROC>(gles3wLoad("glCopyImageSubData"));

    glDebugMessageControl = reinterpret_cast<PFNGLDEBUGMESSAGECONTROLPROC>(gles3wLoad("glDebugMessageControl"));
    glDebugMessageInsert = reinterpret_cast<PFNGLDEBUGMESSAGEINSERTPROC>(gles3wLoad("glDebugMessageInsert"));
    glDebugMessageCallback = reinterpret_cast<PFNGLDEBUGMESSAGECALLBACKPROC>(gles3wLoad("glDebugMessageCallback"));
    glGetDebugMessageLog = reinterpret_cast<PFNGLGETDEBUGMESSAGELOGPROC>(gles3wLoad("glGetDebugMessageLog"));
    glPushDebugGroup = reinterpret_cast<PFNGLPUSHDEBUGGROUPPROC>(gles3wLoad("glPushDebugGroup"));
    glPopDebugGroup = reinterpret_cast<PFNGLPOPDEBUGGROUPPROC>(gles3wLoad("glPopDebugGroup"));
    glObjectLabel = reinterpret_cast<PFNGLOBJECTLABELPROC>(gles3wLoad("glObjectLabel"));
    glGetObjectLabel = reinterpret_cast<PFNGLGETOBJECTLABELPROC>(gles3wLoad("glGetObjectLabel"));
    glObjectPtrLabel = reinterpret_cast<PFNGLOBJECTPTRLABELPROC>(gles3wLoad("glObjectPtrLabel"));
    glGetObjectPtrLabel = reinterpret_cast<PFNGLGETOBJECTPTRLABELPROC>(gles3wLoad("glGetObjectPtrLabel"));
    glGetPointerv = reinterpret_cast<PFNGLGETPOINTERVPROC>(gles3wLoad("glGetPointerv"));

    glEnablei = reinterpret_cast<PFNGLENABLEIPROC>(gles3wLoad("glEnablei"));
    glDisablei = reinterpret_cast<PFNGLDISABLEIPROC>(gles3wLoad("glDisablei"));
    glBlendEquationi = reinterpret_cast<PFNGLBLENDEQUATIONIPROC>(gles3wLoad("glBlendEquationi"));
    glBlendEquationSeparatei = reinterpret_cast<PFNGLBLENDEQUATIONSEPARATEIPROC>(gles3wLoad("glBlendEquationSeparatei"));
    glBlendFunci = reinterpret_cast<PFNGLBLENDFUNCIPROC>(gles3wLoad("glBlendFunci"));
    glBlendFuncSeparatei = reinterpret_cast<PFNGLBLENDFUNCSEPARATEIPROC>(gles3wLoad("glBlendFuncSeparatei"));
    glColorMaski = reinterpret_cast<PFNGLCOLORMASKIPROC>(gles3wLoad("glColorMaski"));
    glIsEnabledi = reinterpret_cast<PFNGLISENABLEDIPROC>(gles3wLoad("glIsEnabledi"));

    glDrawElementsBaseVertex = reinterpret_cast<PFNGLDRAWELEMENTSBASEVERTEXPROC>(gles3wLoad("glDrawElementsBaseVertex"));
    glDrawRangeElementsBaseVertex = reinterpret_cast<PFNGLDRAWRANGEELEMENTSBASEVERTEXPROC>(gles3wLoad("glDrawRangeElementsBaseVertex"));
    glDrawElementsInstancedBaseVertex = reinterpret_cast<PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXPROC>(gles3wLoad("glDrawElementsInstancedBaseVertex"));

    glFramebufferTexture = reinterpret_cast<PFNGLFRAMEBUFFERTEXTUREPROC>(gles3wLoad("glFramebufferTexture"));

    glPrimitiveBoundingBox = reinterpret_cast<PFNGLPRIMITIVEBOUNDINGBOXPROC>(gles3wLoad("glPrimitiveBoundingBox"));

    glGetGraphicsResetStatus = reinterpret_cast<PFNGLGETGRAPHICSRESETSTATUSPROC>(gles3wLoad("glGetGraphicsResetStatus"));
    glReadnPixels = reinterpret_cast<PFNGLREADNPIXELSPROC>(gles3wLoad("glReadnPixels"));
    glGetnUniformfv = reinterpret_cast<PFNGLGETNUNIFORMFVPROC>(gles3wLoad("glGetnUniformfv"));
    glGetnUniformiv = reinterpret_cast<PFNGLGETNUNIFORMIVPROC>(gles3wLoad("glGetnUniformiv"));
    glGetnUniformuiv = reinterpret_cast<PFNGLGETNUNIFORMUIVPROC>(gles3wLoad("glGetnUniformuiv"));

    glMinSampleShading = reinterpret_cast<PFNGLMINSAMPLESHADINGPROC>(gles3wLoad("glMinSampleShading"));

    glPatchParameteri = reinterpret_cast<PFNGLPATCHPARAMETERIPROC>(gles3wLoad("glPatchParameteri"));

    glTexParameterIiv = reinterpret_cast<PFNGLTEXPARAMETERIIVPROC>(gles3wLoad("glTexParameterIiv"));
    glTexParameterIuiv = reinterpret_cast<PFNGLTEXPARAMETERIUIVPROC>(gles3wLoad("glTexParameterIuiv"));
    glGetTexParameterIiv = reinterpret_cast<PFNGLGETTEXPARAMETERIIVPROC>(gles3wLoad("glGetTexParameterIiv"));
    glGetTexParameterIuiv = reinterpret_cast<PFNGLGETTEXPARAMETERIUIVPROC>(gles3wLoad("glGetTexParameterIuiv"));
    glSamplerParameterIiv = reinterpret_cast<PFNGLSAMPLERPARAMETERIIVPROC>(gles3wLoad("glSamplerParameterIiv"));
    glSamplerParameterIuiv = reinterpret_cast<PFNGLSAMPLERPARAMETERIUIVPROC>(gles3wLoad("glSamplerParameterIuiv"));
    glGetSamplerParameterIiv = reinterpret_cast<PFNGLGETSAMPLERPARAMETERIIVPROC>(gles3wLoad("glGetSamplerParameterIiv"));
    glGetSamplerParameterIuiv = reinterpret_cast<PFNGLGETSAMPLERPARAMETERIUIVPROC>(gles3wLoad("glGetSamplerParameterIuiv"));

    glTexBuffer = reinterpret_cast<PFNGLTEXBUFFERPROC>(gles3wLoad("glTexBuffer"));
    glTexBufferRange = reinterpret_cast<PFNGLTEXBUFFERRANGEPROC>(gles3wLoad("glTexBufferRange"));

    glTexStorage3DMultisample = reinterpret_cast<PFNGLTEXSTORAGE3DMULTISAMPLEPROC>(gles3wLoad("glTexStorage3DMultisample"));

    /* GLES3W_GENERATE_GLES_LOAD */

    /**
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     * The above section is auto-generated from GLES spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     */
}
