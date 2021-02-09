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

#define GL_GLES_PROTOTYPES 0
#include <GLES3/gl32.h>

#include <GLES3/gl3platform.h>
#include <KHR/khrplatform.h>

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
    glReadBuffer = (PFNGLREADBUFFERPROC)gles3wLoad("glReadBuffer");
    glDrawRangeElements = (PFNGLDRAWRANGEELEMENTSPROC)gles3wLoad("glDrawRangeElements");
    glTexImage3D = (PFNGLTEXIMAGE3DPROC)gles3wLoad("glTexImage3D");
    glTexSubImage3D = (PFNGLTEXSUBIMAGE3DPROC)gles3wLoad("glTexSubImage3D");
    glCopyTexSubImage3D = (PFNGLCOPYTEXSUBIMAGE3DPROC)gles3wLoad("glCopyTexSubImage3D");
    glCompressedTexImage3D = (PFNGLCOMPRESSEDTEXIMAGE3DPROC)gles3wLoad("glCompressedTexImage3D");
    glCompressedTexSubImage3D = (PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC)gles3wLoad("glCompressedTexSubImage3D");
    glGenQueries = (PFNGLGENQUERIESPROC)gles3wLoad("glGenQueries");
    glDeleteQueries = (PFNGLDELETEQUERIESPROC)gles3wLoad("glDeleteQueries");
    glIsQuery = (PFNGLISQUERYPROC)gles3wLoad("glIsQuery");
    glBeginQuery = (PFNGLBEGINQUERYPROC)gles3wLoad("glBeginQuery");
    glEndQuery = (PFNGLENDQUERYPROC)gles3wLoad("glEndQuery");
    glGetQueryiv = (PFNGLGETQUERYIVPROC)gles3wLoad("glGetQueryiv");
    glGetQueryObjectuiv = (PFNGLGETQUERYOBJECTUIVPROC)gles3wLoad("glGetQueryObjectuiv");
    glUnmapBuffer = (PFNGLUNMAPBUFFERPROC)gles3wLoad("glUnmapBuffer");
    glGetBufferPointerv = (PFNGLGETBUFFERPOINTERVPROC)gles3wLoad("glGetBufferPointerv");
    glDrawBuffers = (PFNGLDRAWBUFFERSPROC)gles3wLoad("glDrawBuffers");
    glUniformMatrix2x3fv = (PFNGLUNIFORMMATRIX2X3FVPROC)gles3wLoad("glUniformMatrix2x3fv");
    glUniformMatrix3x2fv = (PFNGLUNIFORMMATRIX3X2FVPROC)gles3wLoad("glUniformMatrix3x2fv");
    glUniformMatrix2x4fv = (PFNGLUNIFORMMATRIX2X4FVPROC)gles3wLoad("glUniformMatrix2x4fv");
    glUniformMatrix4x2fv = (PFNGLUNIFORMMATRIX4X2FVPROC)gles3wLoad("glUniformMatrix4x2fv");
    glUniformMatrix3x4fv = (PFNGLUNIFORMMATRIX3X4FVPROC)gles3wLoad("glUniformMatrix3x4fv");
    glUniformMatrix4x3fv = (PFNGLUNIFORMMATRIX4X3FVPROC)gles3wLoad("glUniformMatrix4x3fv");
    glBlitFramebuffer = (PFNGLBLITFRAMEBUFFERPROC)gles3wLoad("glBlitFramebuffer");
    glRenderbufferStorageMultisample = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC)gles3wLoad("glRenderbufferStorageMultisample");
    glFramebufferTextureLayer = (PFNGLFRAMEBUFFERTEXTURELAYERPROC)gles3wLoad("glFramebufferTextureLayer");
    glMapBufferRange = (PFNGLMAPBUFFERRANGEPROC)gles3wLoad("glMapBufferRange");
    glFlushMappedBufferRange = (PFNGLFLUSHMAPPEDBUFFERRANGEPROC)gles3wLoad("glFlushMappedBufferRange");
    glBindVertexArray = (PFNGLBINDVERTEXARRAYPROC)gles3wLoad("glBindVertexArray");
    glDeleteVertexArrays = (PFNGLDELETEVERTEXARRAYSPROC)gles3wLoad("glDeleteVertexArrays");
    glGenVertexArrays = (PFNGLGENVERTEXARRAYSPROC)gles3wLoad("glGenVertexArrays");
    glIsVertexArray = (PFNGLISVERTEXARRAYPROC)gles3wLoad("glIsVertexArray");
    glGetIntegeri_v = (PFNGLGETINTEGERI_VPROC)gles3wLoad("glGetIntegeri_v");
    glBeginTransformFeedback = (PFNGLBEGINTRANSFORMFEEDBACKPROC)gles3wLoad("glBeginTransformFeedback");
    glEndTransformFeedback = (PFNGLENDTRANSFORMFEEDBACKPROC)gles3wLoad("glEndTransformFeedback");
    glBindBufferRange = (PFNGLBINDBUFFERRANGEPROC)gles3wLoad("glBindBufferRange");
    glBindBufferBase = (PFNGLBINDBUFFERBASEPROC)gles3wLoad("glBindBufferBase");
    glTransformFeedbackVaryings = (PFNGLTRANSFORMFEEDBACKVARYINGSPROC)gles3wLoad("glTransformFeedbackVaryings");
    glGetTransformFeedbackVarying = (PFNGLGETTRANSFORMFEEDBACKVARYINGPROC)gles3wLoad("glGetTransformFeedbackVarying");
    glVertexAttribIPointer = (PFNGLVERTEXATTRIBIPOINTERPROC)gles3wLoad("glVertexAttribIPointer");
    glGetVertexAttribIiv = (PFNGLGETVERTEXATTRIBIIVPROC)gles3wLoad("glGetVertexAttribIiv");
    glGetVertexAttribIuiv = (PFNGLGETVERTEXATTRIBIUIVPROC)gles3wLoad("glGetVertexAttribIuiv");
    glVertexAttribI4i = (PFNGLVERTEXATTRIBI4IPROC)gles3wLoad("glVertexAttribI4i");
    glVertexAttribI4ui = (PFNGLVERTEXATTRIBI4UIPROC)gles3wLoad("glVertexAttribI4ui");
    glVertexAttribI4iv = (PFNGLVERTEXATTRIBI4IVPROC)gles3wLoad("glVertexAttribI4iv");
    glVertexAttribI4uiv = (PFNGLVERTEXATTRIBI4UIVPROC)gles3wLoad("glVertexAttribI4uiv");
    glGetUniformuiv = (PFNGLGETUNIFORMUIVPROC)gles3wLoad("glGetUniformuiv");
    glGetFragDataLocation = (PFNGLGETFRAGDATALOCATIONPROC)gles3wLoad("glGetFragDataLocation");
    glUniform1ui = (PFNGLUNIFORM1UIPROC)gles3wLoad("glUniform1ui");
    glUniform2ui = (PFNGLUNIFORM2UIPROC)gles3wLoad("glUniform2ui");
    glUniform3ui = (PFNGLUNIFORM3UIPROC)gles3wLoad("glUniform3ui");
    glUniform4ui = (PFNGLUNIFORM4UIPROC)gles3wLoad("glUniform4ui");
    glUniform1uiv = (PFNGLUNIFORM1UIVPROC)gles3wLoad("glUniform1uiv");
    glUniform2uiv = (PFNGLUNIFORM2UIVPROC)gles3wLoad("glUniform2uiv");
    glUniform3uiv = (PFNGLUNIFORM3UIVPROC)gles3wLoad("glUniform3uiv");
    glUniform4uiv = (PFNGLUNIFORM4UIVPROC)gles3wLoad("glUniform4uiv");
    glClearBufferiv = (PFNGLCLEARBUFFERIVPROC)gles3wLoad("glClearBufferiv");
    glClearBufferuiv = (PFNGLCLEARBUFFERUIVPROC)gles3wLoad("glClearBufferuiv");
    glClearBufferfv = (PFNGLCLEARBUFFERFVPROC)gles3wLoad("glClearBufferfv");
    glClearBufferfi = (PFNGLCLEARBUFFERFIPROC)gles3wLoad("glClearBufferfi");
    glGetStringi = (PFNGLGETSTRINGIPROC)gles3wLoad("glGetStringi");
    glCopyBufferSubData = (PFNGLCOPYBUFFERSUBDATAPROC)gles3wLoad("glCopyBufferSubData");
    glGetUniformIndices = (PFNGLGETUNIFORMINDICESPROC)gles3wLoad("glGetUniformIndices");
    glGetActiveUniformsiv = (PFNGLGETACTIVEUNIFORMSIVPROC)gles3wLoad("glGetActiveUniformsiv");
    glGetUniformBlockIndex = (PFNGLGETUNIFORMBLOCKINDEXPROC)gles3wLoad("glGetUniformBlockIndex");
    glGetActiveUniformBlockiv = (PFNGLGETACTIVEUNIFORMBLOCKIVPROC)gles3wLoad("glGetActiveUniformBlockiv");
    glGetActiveUniformBlockName = (PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC)gles3wLoad("glGetActiveUniformBlockName");
    glUniformBlockBinding = (PFNGLUNIFORMBLOCKBINDINGPROC)gles3wLoad("glUniformBlockBinding");
    glDrawArraysInstanced = (PFNGLDRAWARRAYSINSTANCEDPROC)gles3wLoad("glDrawArraysInstanced");
    glDrawElementsInstanced = (PFNGLDRAWELEMENTSINSTANCEDPROC)gles3wLoad("glDrawElementsInstanced");
    glFenceSync = (PFNGLFENCESYNCPROC)gles3wLoad("glFenceSync");
    glIsSync = (PFNGLISSYNCPROC)gles3wLoad("glIsSync");
    glDeleteSync = (PFNGLDELETESYNCPROC)gles3wLoad("glDeleteSync");
    glClientWaitSync = (PFNGLCLIENTWAITSYNCPROC)gles3wLoad("glClientWaitSync");
    glWaitSync = (PFNGLWAITSYNCPROC)gles3wLoad("glWaitSync");
    glGetInteger64v = (PFNGLGETINTEGER64VPROC)gles3wLoad("glGetInteger64v");
    glGetSynciv = (PFNGLGETSYNCIVPROC)gles3wLoad("glGetSynciv");
    glGetInteger64i_v = (PFNGLGETINTEGER64I_VPROC)gles3wLoad("glGetInteger64i_v");
    glGetBufferParameteri64v = (PFNGLGETBUFFERPARAMETERI64VPROC)gles3wLoad("glGetBufferParameteri64v");
    glGenSamplers = (PFNGLGENSAMPLERSPROC)gles3wLoad("glGenSamplers");
    glDeleteSamplers = (PFNGLDELETESAMPLERSPROC)gles3wLoad("glDeleteSamplers");
    glIsSampler = (PFNGLISSAMPLERPROC)gles3wLoad("glIsSampler");
    glBindSampler = (PFNGLBINDSAMPLERPROC)gles3wLoad("glBindSampler");
    glSamplerParameteri = (PFNGLSAMPLERPARAMETERIPROC)gles3wLoad("glSamplerParameteri");
    glSamplerParameteriv = (PFNGLSAMPLERPARAMETERIVPROC)gles3wLoad("glSamplerParameteriv");
    glSamplerParameterf = (PFNGLSAMPLERPARAMETERFPROC)gles3wLoad("glSamplerParameterf");
    glSamplerParameterfv = (PFNGLSAMPLERPARAMETERFVPROC)gles3wLoad("glSamplerParameterfv");
    glGetSamplerParameteriv = (PFNGLGETSAMPLERPARAMETERIVPROC)gles3wLoad("glGetSamplerParameteriv");
    glGetSamplerParameterfv = (PFNGLGETSAMPLERPARAMETERFVPROC)gles3wLoad("glGetSamplerParameterfv");
    glVertexAttribDivisor = (PFNGLVERTEXATTRIBDIVISORPROC)gles3wLoad("glVertexAttribDivisor");
    glBindTransformFeedback = (PFNGLBINDTRANSFORMFEEDBACKPROC)gles3wLoad("glBindTransformFeedback");
    glDeleteTransformFeedbacks = (PFNGLDELETETRANSFORMFEEDBACKSPROC)gles3wLoad("glDeleteTransformFeedbacks");
    glGenTransformFeedbacks = (PFNGLGENTRANSFORMFEEDBACKSPROC)gles3wLoad("glGenTransformFeedbacks");
    glIsTransformFeedback = (PFNGLISTRANSFORMFEEDBACKPROC)gles3wLoad("glIsTransformFeedback");
    glPauseTransformFeedback = (PFNGLPAUSETRANSFORMFEEDBACKPROC)gles3wLoad("glPauseTransformFeedback");
    glResumeTransformFeedback = (PFNGLRESUMETRANSFORMFEEDBACKPROC)gles3wLoad("glResumeTransformFeedback");
    glGetProgramBinary = (PFNGLGETPROGRAMBINARYPROC)gles3wLoad("glGetProgramBinary");
    glProgramBinary = (PFNGLPROGRAMBINARYPROC)gles3wLoad("glProgramBinary");
    glProgramParameteri = (PFNGLPROGRAMPARAMETERIPROC)gles3wLoad("glProgramParameteri");
    glInvalidateFramebuffer = (PFNGLINVALIDATEFRAMEBUFFERPROC)gles3wLoad("glInvalidateFramebuffer");
    glInvalidateSubFramebuffer = (PFNGLINVALIDATESUBFRAMEBUFFERPROC)gles3wLoad("glInvalidateSubFramebuffer");
    glTexStorage2D = (PFNGLTEXSTORAGE2DPROC)gles3wLoad("glTexStorage2D");
    glTexStorage3D = (PFNGLTEXSTORAGE3DPROC)gles3wLoad("glTexStorage3D");
    glGetInternalformativ = (PFNGLGETINTERNALFORMATIVPROC)gles3wLoad("glGetInternalformativ");


    /* GL_ES_VERSION_3_1 */
    glDispatchCompute = (PFNGLDISPATCHCOMPUTEPROC)gles3wLoad("glDispatchCompute");
    glDispatchComputeIndirect = (PFNGLDISPATCHCOMPUTEINDIRECTPROC)gles3wLoad("glDispatchComputeIndirect");

    glDrawArraysIndirect = (PFNGLDRAWARRAYSINDIRECTPROC)gles3wLoad("glDrawArraysIndirect");
    glDrawElementsIndirect = (PFNGLDRAWELEMENTSINDIRECTPROC)gles3wLoad("glDrawElementsIndirect");

    glFramebufferParameteri = (PFNGLFRAMEBUFFERPARAMETERIPROC)gles3wLoad("glFramebufferParameteri");
    glGetFramebufferParameteriv = (PFNGLGETFRAMEBUFFERPARAMETERIVPROC)gles3wLoad("glGetFramebufferParameteriv");

    glGetProgramInterfaceiv = (PFNGLGETPROGRAMINTERFACEIVPROC)gles3wLoad("glGetProgramInterfaceiv");
    glGetProgramResourceIndex = (PFNGLGETPROGRAMRESOURCEINDEXPROC)gles3wLoad("glGetProgramResourceIndex");
    glGetProgramResourceName = (PFNGLGETPROGRAMRESOURCENAMEPROC)gles3wLoad("glGetProgramResourceName");
    glGetProgramResourceiv = (PFNGLGETPROGRAMRESOURCEIVPROC)gles3wLoad("glGetProgramResourceiv");
    glGetProgramResourceLocation = (PFNGLGETPROGRAMRESOURCELOCATIONPROC)gles3wLoad("glGetProgramResourceLocation");

    glUseProgramStages = (PFNGLUSEPROGRAMSTAGESPROC)gles3wLoad("glUseProgramStages");
    glActiveShaderProgram = (PFNGLACTIVESHADERPROGRAMPROC)gles3wLoad("glActiveShaderProgram");
    glCreateShaderProgramv = (PFNGLCREATESHADERPROGRAMVPROC)gles3wLoad("glCreateShaderProgramv");
    glBindProgramPipeline = (PFNGLBINDPROGRAMPIPELINEPROC)gles3wLoad("glBindProgramPipeline");
    glDeleteProgramPipelines = (PFNGLDELETEPROGRAMPIPELINESPROC)gles3wLoad("glDeleteProgramPipelines");
    glGenProgramPipelines = (PFNGLGENPROGRAMPIPELINESPROC)gles3wLoad("glGenProgramPipelines");
    glIsProgramPipeline = (PFNGLISPROGRAMPIPELINEPROC)gles3wLoad("glIsProgramPipeline");
    glGetProgramPipelineiv = (PFNGLGETPROGRAMPIPELINEIVPROC)gles3wLoad("glGetProgramPipelineiv");
    glProgramUniform1i = (PFNGLPROGRAMUNIFORM1IPROC)gles3wLoad("glProgramUniform1i");
    glProgramUniform2i = (PFNGLPROGRAMUNIFORM2IPROC)gles3wLoad("glProgramUniform2i");
    glProgramUniform3i = (PFNGLPROGRAMUNIFORM3IPROC)gles3wLoad("glProgramUniform3i");
    glProgramUniform4i = (PFNGLPROGRAMUNIFORM4IPROC)gles3wLoad("glProgramUniform4i");
    glProgramUniform1ui = (PFNGLPROGRAMUNIFORM1UIPROC)gles3wLoad("glProgramUniform1ui");
    glProgramUniform2ui = (PFNGLPROGRAMUNIFORM2UIPROC)gles3wLoad("glProgramUniform2ui");
    glProgramUniform3ui = (PFNGLPROGRAMUNIFORM3UIPROC)gles3wLoad("glProgramUniform3ui");
    glProgramUniform4ui = (PFNGLPROGRAMUNIFORM4UIPROC)gles3wLoad("glProgramUniform4ui");
    glProgramUniform1f = (PFNGLPROGRAMUNIFORM1FPROC)gles3wLoad("glProgramUniform1f");
    glProgramUniform2f = (PFNGLPROGRAMUNIFORM2FPROC)gles3wLoad("glProgramUniform2f");
    glProgramUniform3f = (PFNGLPROGRAMUNIFORM3FPROC)gles3wLoad("glProgramUniform3f");
    glProgramUniform4f = (PFNGLPROGRAMUNIFORM4FPROC)gles3wLoad("glProgramUniform4f");
    glProgramUniform1iv = (PFNGLPROGRAMUNIFORM1IVPROC)gles3wLoad("glProgramUniform1iv");
    glProgramUniform2iv = (PFNGLPROGRAMUNIFORM2IVPROC)gles3wLoad("glProgramUniform2iv");
    glProgramUniform3iv = (PFNGLPROGRAMUNIFORM3IVPROC)gles3wLoad("glProgramUniform3iv");
    glProgramUniform4iv = (PFNGLPROGRAMUNIFORM4IVPROC)gles3wLoad("glProgramUniform4iv");
    glProgramUniform1uiv = (PFNGLPROGRAMUNIFORM1UIVPROC)gles3wLoad("glProgramUniform1uiv");
    glProgramUniform2uiv = (PFNGLPROGRAMUNIFORM2UIVPROC)gles3wLoad("glProgramUniform2uiv");
    glProgramUniform3uiv = (PFNGLPROGRAMUNIFORM3UIVPROC)gles3wLoad("glProgramUniform3uiv");
    glProgramUniform4uiv = (PFNGLPROGRAMUNIFORM4UIVPROC)gles3wLoad("glProgramUniform4uiv");
    glProgramUniform1fv = (PFNGLPROGRAMUNIFORM1FVPROC)gles3wLoad("glProgramUniform1fv");
    glProgramUniform2fv = (PFNGLPROGRAMUNIFORM2FVPROC)gles3wLoad("glProgramUniform2fv");
    glProgramUniform3fv = (PFNGLPROGRAMUNIFORM3FVPROC)gles3wLoad("glProgramUniform3fv");
    glProgramUniform4fv = (PFNGLPROGRAMUNIFORM4FVPROC)gles3wLoad("glProgramUniform4fv");
    glProgramUniformMatrix2fv = (PFNGLPROGRAMUNIFORMMATRIX2FVPROC)gles3wLoad("glProgramUniformMatrix2fv");
    glProgramUniformMatrix3fv = (PFNGLPROGRAMUNIFORMMATRIX3FVPROC)gles3wLoad("glProgramUniformMatrix3fv");
    glProgramUniformMatrix4fv = (PFNGLPROGRAMUNIFORMMATRIX4FVPROC)gles3wLoad("glProgramUniformMatrix4fv");
    glProgramUniformMatrix2x3fv = (PFNGLPROGRAMUNIFORMMATRIX2X3FVPROC)gles3wLoad("glProgramUniformMatrix2x3fv");
    glProgramUniformMatrix3x2fv = (PFNGLPROGRAMUNIFORMMATRIX3X2FVPROC)gles3wLoad("glProgramUniformMatrix3x2fv");
    glProgramUniformMatrix2x4fv = (PFNGLPROGRAMUNIFORMMATRIX2X4FVPROC)gles3wLoad("glProgramUniformMatrix2x4fv");
    glProgramUniformMatrix4x2fv = (PFNGLPROGRAMUNIFORMMATRIX4X2FVPROC)gles3wLoad("glProgramUniformMatrix4x2fv");
    glProgramUniformMatrix3x4fv = (PFNGLPROGRAMUNIFORMMATRIX3X4FVPROC)gles3wLoad("glProgramUniformMatrix3x4fv");
    glProgramUniformMatrix4x3fv = (PFNGLPROGRAMUNIFORMMATRIX4X3FVPROC)gles3wLoad("glProgramUniformMatrix4x3fv");
    glValidateProgramPipeline = (PFNGLVALIDATEPROGRAMPIPELINEPROC)gles3wLoad("glValidateProgramPipeline");
    glGetProgramPipelineInfoLog = (PFNGLGETPROGRAMPIPELINEINFOLOGPROC)gles3wLoad("glGetProgramPipelineInfoLog");

    glBindImageTexture = (PFNGLBINDIMAGETEXTUREPROC)gles3wLoad("glBindImageTexture");
    glGetBooleani_v = (PFNGLGETBOOLEANI_VPROC)gles3wLoad("glGetBooleani_v");
    glMemoryBarrier = (PFNGLMEMORYBARRIERPROC)gles3wLoad("glMemoryBarrier");
    glMemoryBarrierByRegion = (PFNGLMEMORYBARRIERBYREGIONPROC)gles3wLoad("glMemoryBarrierByRegion");

    glTexStorage2DMultisample = (PFNGLTEXSTORAGE2DMULTISAMPLEPROC)gles3wLoad("glTexStorage2DMultisample");
    glGetMultisamplefv = (PFNGLGETMULTISAMPLEFVPROC)gles3wLoad("glGetMultisamplefv");
    glSampleMaski = (PFNGLSAMPLEMASKIPROC)gles3wLoad("glSampleMaski");
    glGetTexLevelParameteriv = (PFNGLGETTEXLEVELPARAMETERIVPROC)gles3wLoad("glGetTexLevelParameteriv");
    glGetTexLevelParameterfv = (PFNGLGETTEXLEVELPARAMETERFVPROC)gles3wLoad("glGetTexLevelParameterfv");

    glBindVertexBuffer = (PFNGLBINDVERTEXBUFFERPROC)gles3wLoad("glBindVertexBuffer");
    glVertexAttribFormat = (PFNGLVERTEXATTRIBFORMATPROC)gles3wLoad("glVertexAttribFormat");
    glVertexAttribIFormat = (PFNGLVERTEXATTRIBIFORMATPROC)gles3wLoad("glVertexAttribIFormat");
    glVertexAttribBinding = (PFNGLVERTEXATTRIBBINDINGPROC)gles3wLoad("glVertexAttribBinding");
    glVertexBindingDivisor = (PFNGLVERTEXBINDINGDIVISORPROC)gles3wLoad("glVertexBindingDivisor");


    /* GL_ES_VERSION_3_2 */
    glBlendBarrier = (PFNGLBLENDBARRIERPROC)gles3wLoad("glBlendBarrier");

    glCopyImageSubData = (PFNGLCOPYIMAGESUBDATAPROC)gles3wLoad("glCopyImageSubData");

    glDebugMessageControl = (PFNGLDEBUGMESSAGECONTROLPROC)gles3wLoad("glDebugMessageControl");
    glDebugMessageInsert = (PFNGLDEBUGMESSAGEINSERTPROC)gles3wLoad("glDebugMessageInsert");
    glDebugMessageCallback = (PFNGLDEBUGMESSAGECALLBACKPROC)gles3wLoad("glDebugMessageCallback");
    glGetDebugMessageLog = (PFNGLGETDEBUGMESSAGELOGPROC)gles3wLoad("glGetDebugMessageLog");
    glPushDebugGroup = (PFNGLPUSHDEBUGGROUPPROC)gles3wLoad("glPushDebugGroup");
    glPopDebugGroup = (PFNGLPOPDEBUGGROUPPROC)gles3wLoad("glPopDebugGroup");
    glObjectLabel = (PFNGLOBJECTLABELPROC)gles3wLoad("glObjectLabel");
    glGetObjectLabel = (PFNGLGETOBJECTLABELPROC)gles3wLoad("glGetObjectLabel");
    glObjectPtrLabel = (PFNGLOBJECTPTRLABELPROC)gles3wLoad("glObjectPtrLabel");
    glGetObjectPtrLabel = (PFNGLGETOBJECTPTRLABELPROC)gles3wLoad("glGetObjectPtrLabel");
    glGetPointerv = (PFNGLGETPOINTERVPROC)gles3wLoad("glGetPointerv");

    glEnablei = (PFNGLENABLEIPROC)gles3wLoad("glEnablei");
    glDisablei = (PFNGLDISABLEIPROC)gles3wLoad("glDisablei");
    glBlendEquationi = (PFNGLBLENDEQUATIONIPROC)gles3wLoad("glBlendEquationi");
    glBlendEquationSeparatei = (PFNGLBLENDEQUATIONSEPARATEIPROC)gles3wLoad("glBlendEquationSeparatei");
    glBlendFunci = (PFNGLBLENDFUNCIPROC)gles3wLoad("glBlendFunci");
    glBlendFuncSeparatei = (PFNGLBLENDFUNCSEPARATEIPROC)gles3wLoad("glBlendFuncSeparatei");
    glColorMaski = (PFNGLCOLORMASKIPROC)gles3wLoad("glColorMaski");
    glIsEnabledi = (PFNGLISENABLEDIPROC)gles3wLoad("glIsEnabledi");

    glDrawElementsBaseVertex = (PFNGLDRAWELEMENTSBASEVERTEXPROC)gles3wLoad("glDrawElementsBaseVertex");
    glDrawRangeElementsBaseVertex = (PFNGLDRAWRANGEELEMENTSBASEVERTEXPROC)gles3wLoad("glDrawRangeElementsBaseVertex");
    glDrawElementsInstancedBaseVertex = (PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXPROC)gles3wLoad("glDrawElementsInstancedBaseVertex");

    glFramebufferTexture = (PFNGLFRAMEBUFFERTEXTUREPROC)gles3wLoad("glFramebufferTexture");

    glPrimitiveBoundingBox = (PFNGLPRIMITIVEBOUNDINGBOXPROC)gles3wLoad("glPrimitiveBoundingBox");

    glGetGraphicsResetStatus = (PFNGLGETGRAPHICSRESETSTATUSPROC)gles3wLoad("glGetGraphicsResetStatus");
    glReadnPixels = (PFNGLREADNPIXELSPROC)gles3wLoad("glReadnPixels");
    glGetnUniformfv = (PFNGLGETNUNIFORMFVPROC)gles3wLoad("glGetnUniformfv");
    glGetnUniformiv = (PFNGLGETNUNIFORMIVPROC)gles3wLoad("glGetnUniformiv");
    glGetnUniformuiv = (PFNGLGETNUNIFORMUIVPROC)gles3wLoad("glGetnUniformuiv");

    glMinSampleShading = (PFNGLMINSAMPLESHADINGPROC)gles3wLoad("glMinSampleShading");

    glPatchParameteri = (PFNGLPATCHPARAMETERIPROC)gles3wLoad("glPatchParameteri");

    glTexParameterIiv = (PFNGLTEXPARAMETERIIVPROC)gles3wLoad("glTexParameterIiv");
    glTexParameterIuiv = (PFNGLTEXPARAMETERIUIVPROC)gles3wLoad("glTexParameterIuiv");
    glGetTexParameterIiv = (PFNGLGETTEXPARAMETERIIVPROC)gles3wLoad("glGetTexParameterIiv");
    glGetTexParameterIuiv = (PFNGLGETTEXPARAMETERIUIVPROC)gles3wLoad("glGetTexParameterIuiv");
    glSamplerParameterIiv = (PFNGLSAMPLERPARAMETERIIVPROC)gles3wLoad("glSamplerParameterIiv");
    glSamplerParameterIuiv = (PFNGLSAMPLERPARAMETERIUIVPROC)gles3wLoad("glSamplerParameterIuiv");
    glGetSamplerParameterIiv = (PFNGLGETSAMPLERPARAMETERIIVPROC)gles3wLoad("glGetSamplerParameterIiv");
    glGetSamplerParameterIuiv = (PFNGLGETSAMPLERPARAMETERIUIVPROC)gles3wLoad("glGetSamplerParameterIuiv");

    glTexBuffer = (PFNGLTEXBUFFERPROC)gles3wLoad("glTexBuffer");
    glTexBufferRange = (PFNGLTEXBUFFERRANGEPROC)gles3wLoad("glTexBufferRange");

    glTexStorage3DMultisample = (PFNGLTEXSTORAGE3DMULTISAMPLEPROC)gles3wLoad("glTexStorage3DMultisample");


    /* GLES3W_GENERATE_GLES_LOAD */

    /**
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     * The above section is auto-generated from GLES spec by running:
     * node tools/gles-wrangler-generator/generate.js
     * ========================= !DO NOT CHANGE THE ABOVE SECTION MANUALLY! =========================
     */
}
