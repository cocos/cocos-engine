/****************************************************************************
Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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

#if defined(_WIN32) && !defined(ANDROID)
    #define WIN32_LEAN_AND_MEAN 1
    #include <windows.h>

static HMODULE libegl = NULL;
static HMODULE libgles = NULL;

static bool open_libgl(void) {
    libegl = LoadLibraryA("libEGL.dll");
    libgles = LoadLibraryA("libGLESv2.dll");
    return (libegl && libgles);
}

static void *get_egl_proc(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = (void *)GetProcAddress(libegl, proc);
    return res;
}

static void *get_gles_proc(const char *proc) {
    void *res = (void *)eglGetProcAddress(proc);
    if (!res) res = (void *)GetProcAddress(libgles, proc);
    return res;
}
#elif defined(__EMSCRIPTEN__)
static void open_libgl() {}
static void *get_egl_proc(const char *proc) {
    return (void *)eglGetProcAddress(proc);
}
static void *get_gles_proc(const char *proc) {
    return (void *)eglGetProcAddress(proc);
}
#else
    #include <dlfcn.h>

static void *libegl = nullptr;
static void *libgles = nullptr;

static bool open_libgl(void) {
    libegl = dlopen("libEGL.so", RTLD_LAZY | RTLD_GLOBAL);
    libgles = dlopen("libGLESv2.so", RTLD_LAZY | RTLD_GLOBAL);
    return (libegl && libgles);
}

static void *get_egl_proc(const char *proc) {
    void *res = nullptr;
    if (eglGetProcAddress) res = (void *)eglGetProcAddress(proc);
    if (!res) res = dlsym(libegl, proc);
    return res;
}

static void *get_gles_proc(const char *proc) {
    void *res = (void *)eglGetProcAddress(proc);
    if (!res) res = dlsym(libgles, proc);
    return res;
}
#endif

static void load_procs(void);

bool gles3wInit(void) {
    if (!open_libgl()) {
        return 0;
    }

    load_procs();

    return 1;
}

PFNEGLCHOOSECONFIGPROC eglChooseConfig;
PFNEGLCREATECONTEXTPROC eglCreateContext;
PFNEGLCREATEWINDOWSURFACEPROC eglCreateWindowSurface;
PFNEGLDESTROYCONTEXTPROC eglDestroyContext;
PFNEGLDESTROYSURFACEPROC eglDestroySurface;
PFNEGLGETDISPLAYPROC eglGetDisplay;
PFNEGLGETERRORPROC eglGetError;
PFNEGLINITIALIZEPROC eglInitialize;
PFNEGLMAKECURRENTPROC eglMakeCurrent;
PFNEGLQUERYSTRINGPROC eglQueryString;
PFNEGLSWAPBUFFERSPROC eglSwapBuffers;
PFNEGLSWAPINTERVALPROC eglSwapInterval;
PFNEGLBINDAPIPROC eglBindAPI;
PFNEGLGETPROCADDRESSPROC eglGetProcAddress;
PFNEGLGETCONFIGATTRIBPROC eglGetConfigAttrib;

PFNGLACTIVETEXTUREPROC glActiveTexture;
PFNGLATTACHSHADERPROC glAttachShader;
PFNGLBINDATTRIBLOCATIONPROC glBindAttribLocation;
PFNGLBINDBUFFERPROC glBindBuffer;
PFNGLBINDFRAMEBUFFERPROC glBindFramebuffer;
PFNGLBINDRENDERBUFFERPROC glBindRenderbuffer;
PFNGLBINDTEXTUREPROC glBindTexture;
PFNGLBLENDCOLORPROC glBlendColor;
PFNGLBLENDEQUATIONPROC glBlendEquation;
PFNGLBLENDEQUATIONSEPARATEPROC glBlendEquationSeparate;
PFNGLBLENDFUNCPROC glBlendFunc;
PFNGLBLENDFUNCSEPARATEPROC glBlendFuncSeparate;
PFNGLBUFFERDATAPROC glBufferData;
PFNGLBUFFERSUBDATAPROC glBufferSubData;
PFNGLCHECKFRAMEBUFFERSTATUSPROC glCheckFramebufferStatus;
PFNGLCLEARPROC glClear;
PFNGLCLEARCOLORPROC glClearColor;
PFNGLCLEARDEPTHFPROC glClearDepthf;
PFNGLCLEARSTENCILPROC glClearStencil;
PFNGLCOLORMASKPROC glColorMask;
PFNGLCOMPILESHADERPROC glCompileShader;
PFNGLCOMPRESSEDTEXIMAGE2DPROC glCompressedTexImage2D;
PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC glCompressedTexSubImage2D;
PFNGLCOPYTEXIMAGE2DPROC glCopyTexImage2D;
PFNGLCOPYTEXSUBIMAGE2DPROC glCopyTexSubImage2D;
PFNGLCREATEPROGRAMPROC glCreateProgram;
PFNGLCREATESHADERPROC glCreateShader;
PFNGLCULLFACEPROC glCullFace;
PFNGLDELETEBUFFERSPROC glDeleteBuffers;
PFNGLDELETEFRAMEBUFFERSPROC glDeleteFramebuffers;
PFNGLDELETEPROGRAMPROC glDeleteProgram;
PFNGLDELETERENDERBUFFERSPROC glDeleteRenderbuffers;
PFNGLDELETESHADERPROC glDeleteShader;
PFNGLDELETETEXTURESPROC glDeleteTextures;
PFNGLDEPTHFUNCPROC glDepthFunc;
PFNGLDEPTHMASKPROC glDepthMask;
PFNGLDEPTHRANGEFPROC glDepthRangef;
PFNGLDETACHSHADERPROC glDetachShader;
PFNGLDISABLEPROC glDisable;
PFNGLDISABLEVERTEXATTRIBARRAYPROC glDisableVertexAttribArray;
PFNGLDRAWARRAYSPROC glDrawArrays;
PFNGLDRAWELEMENTSPROC glDrawElements;
PFNGLENABLEPROC glEnable;
PFNGLENABLEVERTEXATTRIBARRAYPROC glEnableVertexAttribArray;
PFNGLFINISHPROC glFinish;
PFNGLFLUSHPROC glFlush;
PFNGLFRAMEBUFFERRENDERBUFFERPROC glFramebufferRenderbuffer;
PFNGLFRAMEBUFFERTEXTURE2DPROC glFramebufferTexture2D;
PFNGLFRONTFACEPROC glFrontFace;
PFNGLGENBUFFERSPROC glGenBuffers;
PFNGLGENERATEMIPMAPPROC glGenerateMipmap;
PFNGLGENFRAMEBUFFERSPROC glGenFramebuffers;
PFNGLGENRENDERBUFFERSPROC glGenRenderbuffers;
PFNGLGENTEXTURESPROC glGenTextures;
PFNGLGETACTIVEATTRIBPROC glGetActiveAttrib;
PFNGLGETACTIVEUNIFORMPROC glGetActiveUniform;
PFNGLGETATTACHEDSHADERSPROC glGetAttachedShaders;
PFNGLGETATTRIBLOCATIONPROC glGetAttribLocation;
PFNGLGETBOOLEANVPROC glGetBooleanv;
PFNGLGETBUFFERPARAMETERIVPROC glGetBufferParameteriv;
PFNGLGETERRORPROC glGetError;
PFNGLGETFLOATVPROC glGetFloatv;
PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC glGetFramebufferAttachmentParameteriv;
PFNGLGETINTEGERVPROC glGetIntegerv;
PFNGLGETPROGRAMIVPROC glGetProgramiv;
PFNGLGETPROGRAMINFOLOGPROC glGetProgramInfoLog;
PFNGLGETRENDERBUFFERPARAMETERIVPROC glGetRenderbufferParameteriv;
PFNGLGETSHADERIVPROC glGetShaderiv;
PFNGLGETSHADERINFOLOGPROC glGetShaderInfoLog;
PFNGLGETSHADERPRECISIONFORMATPROC glGetShaderPrecisionFormat;
PFNGLGETSHADERSOURCEPROC glGetShaderSource;
PFNGLGETSTRINGPROC glGetString;
PFNGLGETTEXPARAMETERFVPROC glGetTexParameterfv;
PFNGLGETTEXPARAMETERIVPROC glGetTexParameteriv;
PFNGLGETUNIFORMFVPROC glGetUniformfv;
PFNGLGETUNIFORMIVPROC glGetUniformiv;
PFNGLGETUNIFORMLOCATIONPROC glGetUniformLocation;
PFNGLGETVERTEXATTRIBFVPROC glGetVertexAttribfv;
PFNGLGETVERTEXATTRIBIVPROC glGetVertexAttribiv;
PFNGLGETVERTEXATTRIBPOINTERVPROC glGetVertexAttribPointerv;
PFNGLHINTPROC glHint;
PFNGLISBUFFERPROC glIsBuffer;
PFNGLISENABLEDPROC glIsEnabled;
PFNGLISFRAMEBUFFERPROC glIsFramebuffer;
PFNGLISPROGRAMPROC glIsProgram;
PFNGLISRENDERBUFFERPROC glIsRenderbuffer;
PFNGLISSHADERPROC glIsShader;
PFNGLISTEXTUREPROC glIsTexture;
PFNGLLINEWIDTHPROC glLineWidth;
PFNGLLINKPROGRAMPROC glLinkProgram;
PFNGLPIXELSTOREIPROC glPixelStorei;
PFNGLPOLYGONOFFSETPROC glPolygonOffset;
PFNGLREADPIXELSPROC glReadPixels;
PFNGLRELEASESHADERCOMPILERPROC glReleaseShaderCompiler;
PFNGLRENDERBUFFERSTORAGEPROC glRenderbufferStorage;
PFNGLSAMPLECOVERAGEPROC glSampleCoverage;
PFNGLSCISSORPROC glScissor;
PFNGLSHADERBINARYPROC glShaderBinary;
PFNGLSHADERSOURCEPROC glShaderSource;
PFNGLSTENCILFUNCPROC glStencilFunc;
PFNGLSTENCILFUNCSEPARATEPROC glStencilFuncSeparate;
PFNGLSTENCILMASKPROC glStencilMask;
PFNGLSTENCILMASKSEPARATEPROC glStencilMaskSeparate;
PFNGLSTENCILOPPROC glStencilOp;
PFNGLSTENCILOPSEPARATEPROC glStencilOpSeparate;
PFNGLTEXIMAGE2DPROC glTexImage2D;
PFNGLTEXPARAMETERFPROC glTexParameterf;
PFNGLTEXPARAMETERFVPROC glTexParameterfv;
PFNGLTEXPARAMETERIPROC glTexParameteri;
PFNGLTEXPARAMETERIVPROC glTexParameteriv;
PFNGLTEXSUBIMAGE2DPROC glTexSubImage2D;
PFNGLUNIFORM1FPROC glUniform1f;
PFNGLUNIFORM1FVPROC glUniform1fv;
PFNGLUNIFORM1IPROC glUniform1i;
PFNGLUNIFORM1IVPROC glUniform1iv;
PFNGLUNIFORM2FPROC glUniform2f;
PFNGLUNIFORM2FVPROC glUniform2fv;
PFNGLUNIFORM2IPROC glUniform2i;
PFNGLUNIFORM2IVPROC glUniform2iv;
PFNGLUNIFORM3FPROC glUniform3f;
PFNGLUNIFORM3FVPROC glUniform3fv;
PFNGLUNIFORM3IPROC glUniform3i;
PFNGLUNIFORM3IVPROC glUniform3iv;
PFNGLUNIFORM4FPROC glUniform4f;
PFNGLUNIFORM4FVPROC glUniform4fv;
PFNGLUNIFORM4IPROC glUniform4i;
PFNGLUNIFORM4IVPROC glUniform4iv;
PFNGLUNIFORMMATRIX2FVPROC glUniformMatrix2fv;
PFNGLUNIFORMMATRIX3FVPROC glUniformMatrix3fv;
PFNGLUNIFORMMATRIX4FVPROC glUniformMatrix4fv;
PFNGLUSEPROGRAMPROC glUseProgram;
PFNGLVALIDATEPROGRAMPROC glValidateProgram;
PFNGLVERTEXATTRIB1FPROC glVertexAttrib1f;
PFNGLVERTEXATTRIB1FVPROC glVertexAttrib1fv;
PFNGLVERTEXATTRIB2FPROC glVertexAttrib2f;
PFNGLVERTEXATTRIB2FVPROC glVertexAttrib2fv;
PFNGLVERTEXATTRIB3FPROC glVertexAttrib3f;
PFNGLVERTEXATTRIB3FVPROC glVertexAttrib3fv;
PFNGLVERTEXATTRIB4FPROC glVertexAttrib4f;
PFNGLVERTEXATTRIB4FVPROC glVertexAttrib4fv;
PFNGLVERTEXATTRIBPOINTERPROC glVertexAttribPointer;
PFNGLVIEWPORTPROC glViewport;
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
PFNGLUSEPROGRAMSTAGESEXTPROC glUseProgramStagesEXT;
PFNGLACTIVESHADERPROGRAMEXTPROC glActiveShaderProgramEXT;
PFNGLCREATESHADERPROGRAMVEXTPROC glCreateShaderProgramvEXT;
PFNGLBINDPROGRAMPIPELINEEXTPROC glBindProgramPipelineEXT;
PFNGLDELETEPROGRAMPIPELINESEXTPROC glDeleteProgramPipelinesEXT;
PFNGLGENPROGRAMPIPELINESEXTPROC glGenProgramPipelinesEXT;
PFNGLISPROGRAMPIPELINEEXTPROC glIsProgramPipelineEXT;
PFNGLPROGRAMPARAMETERIEXTPROC glProgramParameteriEXT;
PFNGLGETPROGRAMPIPELINEIVEXTPROC glGetProgramPipelineivEXT;
PFNGLPROGRAMUNIFORM1IEXTPROC glProgramUniform1iEXT;
PFNGLPROGRAMUNIFORM2IEXTPROC glProgramUniform2iEXT;
PFNGLPROGRAMUNIFORM3IEXTPROC glProgramUniform3iEXT;
PFNGLPROGRAMUNIFORM4IEXTPROC glProgramUniform4iEXT;
PFNGLPROGRAMUNIFORM1FEXTPROC glProgramUniform1fEXT;
PFNGLPROGRAMUNIFORM2FEXTPROC glProgramUniform2fEXT;
PFNGLPROGRAMUNIFORM3FEXTPROC glProgramUniform3fEXT;
PFNGLPROGRAMUNIFORM4FEXTPROC glProgramUniform4fEXT;
PFNGLPROGRAMUNIFORM1IVEXTPROC glProgramUniform1ivEXT;
PFNGLPROGRAMUNIFORM2IVEXTPROC glProgramUniform2ivEXT;
PFNGLPROGRAMUNIFORM3IVEXTPROC glProgramUniform3ivEXT;
PFNGLPROGRAMUNIFORM4IVEXTPROC glProgramUniform4ivEXT;
PFNGLPROGRAMUNIFORM1FVEXTPROC glProgramUniform1fvEXT;
PFNGLPROGRAMUNIFORM2FVEXTPROC glProgramUniform2fvEXT;
PFNGLPROGRAMUNIFORM3FVEXTPROC glProgramUniform3fvEXT;
PFNGLPROGRAMUNIFORM4FVEXTPROC glProgramUniform4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC glProgramUniformMatrix2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC glProgramUniformMatrix3fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC glProgramUniformMatrix4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC glProgramUniformMatrix2x3fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC glProgramUniformMatrix3x2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC glProgramUniformMatrix2x4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC glProgramUniformMatrix4x2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC glProgramUniformMatrix3x4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC glProgramUniformMatrix4x3fvEXT;
PFNGLVALIDATEPROGRAMPIPELINEEXTPROC glValidateProgramPipelineEXT;
PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC glGetProgramPipelineInfoLogEXT;
PFNGLLABELOBJECTEXTPROC glLabelObjectEXT;
PFNGLGETOBJECTLABELEXTPROC glGetObjectLabelEXT;
PFNGLINSERTEVENTMARKEREXTPROC glInsertEventMarkerEXT;
PFNGLPUSHGROUPMARKEREXTPROC glPushGroupMarkerEXT;
PFNGLPOPGROUPMARKEREXTPROC glPopGroupMarkerEXT;

PFNGLDEBUGMESSAGECONTROLKHRPROC glDebugMessageControlKHR;
PFNGLDEBUGMESSAGECALLBACKKHRPROC glDebugMessageCallbackKHR;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC glFramebufferTexture2DMultisampleEXT;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC glFramebufferTexture2DMultisampleIMG;

PFNGLDISPATCHCOMPUTEPROC glDispatchCompute;
PFNGLDISPATCHCOMPUTEINDIRECTPROC glDispatchComputeIndirect;
PFNGLGETPROGRAMINTERFACEIVPROC glGetProgramInterfaceiv;
PFNGLGETPROGRAMRESOURCENAMEPROC glGetProgramResourceName;
PFNGLGETPROGRAMRESOURCEIVPROC glGetProgramResourceiv;
PFNGLBINDIMAGETEXTUREPROC glBindImageTexture;
PFNGLMEMORYBARRIERPROC glMemoryBarrier;
PFNGLMEMORYBARRIERBYREGIONPROC glMemoryBarrierByRegion;

static void load_procs(void) {
    eglGetProcAddress = (PFNEGLGETPROCADDRESSPROC)get_egl_proc("eglGetProcAddress");
    eglChooseConfig = (PFNEGLCHOOSECONFIGPROC)get_egl_proc("eglChooseConfig");
    eglCreateContext = (PFNEGLCREATECONTEXTPROC)get_egl_proc("eglCreateContext");
    eglCreateWindowSurface = (PFNEGLCREATEWINDOWSURFACEPROC)get_egl_proc("eglCreateWindowSurface");
    eglDestroyContext = (PFNEGLDESTROYCONTEXTPROC)get_egl_proc("eglDestroyContext");
    eglDestroySurface = (PFNEGLDESTROYSURFACEPROC)get_egl_proc("eglDestroySurface");
    eglGetDisplay = (PFNEGLGETDISPLAYPROC)get_egl_proc("eglGetDisplay");
    eglGetError = (PFNEGLGETERRORPROC)get_egl_proc("eglGetError");
    eglInitialize = (PFNEGLINITIALIZEPROC)get_egl_proc("eglInitialize");
    eglMakeCurrent = (PFNEGLMAKECURRENTPROC)get_egl_proc("eglMakeCurrent");
    eglQueryString = (PFNEGLQUERYSTRINGPROC)get_egl_proc("eglQueryString");
    eglSwapBuffers = (PFNEGLSWAPBUFFERSPROC)get_egl_proc("eglSwapBuffers");
    eglSwapInterval = (PFNEGLSWAPINTERVALPROC)get_egl_proc("eglSwapInterval");
    eglBindAPI = (PFNEGLBINDAPIPROC)get_egl_proc("eglBindAPI");
    eglGetConfigAttrib = (PFNEGLGETCONFIGATTRIBPROC)get_egl_proc("eglGetConfigAttrib");

    glActiveTexture = (PFNGLACTIVETEXTUREPROC)get_gles_proc("glActiveTexture");
    glAttachShader = (PFNGLATTACHSHADERPROC)get_gles_proc("glAttachShader");
    glBindAttribLocation = (PFNGLBINDATTRIBLOCATIONPROC)get_gles_proc("glBindAttribLocation");
    glBindBuffer = (PFNGLBINDBUFFERPROC)get_gles_proc("glBindBuffer");
    glBindFramebuffer = (PFNGLBINDFRAMEBUFFERPROC)get_gles_proc("glBindFramebuffer");
    glBindRenderbuffer = (PFNGLBINDRENDERBUFFERPROC)get_gles_proc("glBindRenderbuffer");
    glBindTexture = (PFNGLBINDTEXTUREPROC)get_gles_proc("glBindTexture");
    glBlendColor = (PFNGLBLENDCOLORPROC)get_gles_proc("glBlendColor");
    glBlendEquation = (PFNGLBLENDEQUATIONPROC)get_gles_proc("glBlendEquation");
    glBlendEquationSeparate = (PFNGLBLENDEQUATIONSEPARATEPROC)get_gles_proc("glBlendEquationSeparate");
    glBlendFunc = (PFNGLBLENDFUNCPROC)get_gles_proc("glBlendFunc");
    glBlendFuncSeparate = (PFNGLBLENDFUNCSEPARATEPROC)get_gles_proc("glBlendFuncSeparate");
    glBufferData = (PFNGLBUFFERDATAPROC)get_gles_proc("glBufferData");
    glBufferSubData = (PFNGLBUFFERSUBDATAPROC)get_gles_proc("glBufferSubData");
    glCheckFramebufferStatus = (PFNGLCHECKFRAMEBUFFERSTATUSPROC)get_gles_proc("glCheckFramebufferStatus");
    glClear = (PFNGLCLEARPROC)get_gles_proc("glClear");
    glClearColor = (PFNGLCLEARCOLORPROC)get_gles_proc("glClearColor");
    glClearDepthf = (PFNGLCLEARDEPTHFPROC)get_gles_proc("glClearDepthf");
    glClearStencil = (PFNGLCLEARSTENCILPROC)get_gles_proc("glClearStencil");
    glColorMask = (PFNGLCOLORMASKPROC)get_gles_proc("glColorMask");
    glCompileShader = (PFNGLCOMPILESHADERPROC)get_gles_proc("glCompileShader");
    glCompressedTexImage2D = (PFNGLCOMPRESSEDTEXIMAGE2DPROC)get_gles_proc("glCompressedTexImage2D");
    glCompressedTexSubImage2D = (PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC)get_gles_proc("glCompressedTexSubImage2D");
    glCopyTexImage2D = (PFNGLCOPYTEXIMAGE2DPROC)get_gles_proc("glCopyTexImage2D");
    glCopyTexSubImage2D = (PFNGLCOPYTEXSUBIMAGE2DPROC)get_gles_proc("glCopyTexSubImage2D");
    glCreateProgram = (PFNGLCREATEPROGRAMPROC)get_gles_proc("glCreateProgram");
    glCreateShader = (PFNGLCREATESHADERPROC)get_gles_proc("glCreateShader");
    glCullFace = (PFNGLCULLFACEPROC)get_gles_proc("glCullFace");
    glDeleteBuffers = (PFNGLDELETEBUFFERSPROC)get_gles_proc("glDeleteBuffers");
    glDeleteFramebuffers = (PFNGLDELETEFRAMEBUFFERSPROC)get_gles_proc("glDeleteFramebuffers");
    glDeleteProgram = (PFNGLDELETEPROGRAMPROC)get_gles_proc("glDeleteProgram");
    glDeleteRenderbuffers = (PFNGLDELETERENDERBUFFERSPROC)get_gles_proc("glDeleteRenderbuffers");
    glDeleteShader = (PFNGLDELETESHADERPROC)get_gles_proc("glDeleteShader");
    glDeleteTextures = (PFNGLDELETETEXTURESPROC)get_gles_proc("glDeleteTextures");
    glDepthFunc = (PFNGLDEPTHFUNCPROC)get_gles_proc("glDepthFunc");
    glDepthMask = (PFNGLDEPTHMASKPROC)get_gles_proc("glDepthMask");
    glDepthRangef = (PFNGLDEPTHRANGEFPROC)get_gles_proc("glDepthRangef");
    glDetachShader = (PFNGLDETACHSHADERPROC)get_gles_proc("glDetachShader");
    glDisable = (PFNGLDISABLEPROC)get_gles_proc("glDisable");
    glDisableVertexAttribArray = (PFNGLDISABLEVERTEXATTRIBARRAYPROC)get_gles_proc("glDisableVertexAttribArray");
    glDrawArrays = (PFNGLDRAWARRAYSPROC)get_gles_proc("glDrawArrays");
    glDrawElements = (PFNGLDRAWELEMENTSPROC)get_gles_proc("glDrawElements");
    glEnable = (PFNGLENABLEPROC)get_gles_proc("glEnable");
    glEnableVertexAttribArray = (PFNGLENABLEVERTEXATTRIBARRAYPROC)get_gles_proc("glEnableVertexAttribArray");
    glFinish = (PFNGLFINISHPROC)get_gles_proc("glFinish");
    glFlush = (PFNGLFLUSHPROC)get_gles_proc("glFlush");
    glFramebufferRenderbuffer = (PFNGLFRAMEBUFFERRENDERBUFFERPROC)get_gles_proc("glFramebufferRenderbuffer");
    glFramebufferTexture2D = (PFNGLFRAMEBUFFERTEXTURE2DPROC)get_gles_proc("glFramebufferTexture2D");
    glFrontFace = (PFNGLFRONTFACEPROC)get_gles_proc("glFrontFace");
    glGenBuffers = (PFNGLGENBUFFERSPROC)get_gles_proc("glGenBuffers");
    glGenerateMipmap = (PFNGLGENERATEMIPMAPPROC)get_gles_proc("glGenerateMipmap");
    glGenFramebuffers = (PFNGLGENFRAMEBUFFERSPROC)get_gles_proc("glGenFramebuffers");
    glGenRenderbuffers = (PFNGLGENRENDERBUFFERSPROC)get_gles_proc("glGenRenderbuffers");
    glGenTextures = (PFNGLGENTEXTURESPROC)get_gles_proc("glGenTextures");
    glGetActiveAttrib = (PFNGLGETACTIVEATTRIBPROC)get_gles_proc("glGetActiveAttrib");
    glGetActiveUniform = (PFNGLGETACTIVEUNIFORMPROC)get_gles_proc("glGetActiveUniform");
    glGetAttachedShaders = (PFNGLGETATTACHEDSHADERSPROC)get_gles_proc("glGetAttachedShaders");
    glGetAttribLocation = (PFNGLGETATTRIBLOCATIONPROC)get_gles_proc("glGetAttribLocation");
    glGetBooleanv = (PFNGLGETBOOLEANVPROC)get_gles_proc("glGetBooleanv");
    glGetBufferParameteriv = (PFNGLGETBUFFERPARAMETERIVPROC)get_gles_proc("glGetBufferParameteriv");
    glGetError = (PFNGLGETERRORPROC)get_gles_proc("glGetError");
    glGetFloatv = (PFNGLGETFLOATVPROC)get_gles_proc("glGetFloatv");
    glGetFramebufferAttachmentParameteriv = (PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC)get_gles_proc("glGetFramebufferAttachmentParameteriv");
    glGetIntegerv = (PFNGLGETINTEGERVPROC)get_gles_proc("glGetIntegerv");
    glGetProgramiv = (PFNGLGETPROGRAMIVPROC)get_gles_proc("glGetProgramiv");
    glGetProgramInfoLog = (PFNGLGETPROGRAMINFOLOGPROC)get_gles_proc("glGetProgramInfoLog");
    glGetRenderbufferParameteriv = (PFNGLGETRENDERBUFFERPARAMETERIVPROC)get_gles_proc("glGetRenderbufferParameteriv");
    glGetShaderiv = (PFNGLGETSHADERIVPROC)get_gles_proc("glGetShaderiv");
    glGetShaderInfoLog = (PFNGLGETSHADERINFOLOGPROC)get_gles_proc("glGetShaderInfoLog");
    glGetShaderPrecisionFormat = (PFNGLGETSHADERPRECISIONFORMATPROC)get_gles_proc("glGetShaderPrecisionFormat");
    glGetShaderSource = (PFNGLGETSHADERSOURCEPROC)get_gles_proc("glGetShaderSource");
    glGetString = (PFNGLGETSTRINGPROC)get_gles_proc("glGetString");
    glGetTexParameterfv = (PFNGLGETTEXPARAMETERFVPROC)get_gles_proc("glGetTexParameterfv");
    glGetTexParameteriv = (PFNGLGETTEXPARAMETERIVPROC)get_gles_proc("glGetTexParameteriv");
    glGetUniformfv = (PFNGLGETUNIFORMFVPROC)get_gles_proc("glGetUniformfv");
    glGetUniformiv = (PFNGLGETUNIFORMIVPROC)get_gles_proc("glGetUniformiv");
    glGetUniformLocation = (PFNGLGETUNIFORMLOCATIONPROC)get_gles_proc("glGetUniformLocation");
    glGetVertexAttribfv = (PFNGLGETVERTEXATTRIBFVPROC)get_gles_proc("glGetVertexAttribfv");
    glGetVertexAttribiv = (PFNGLGETVERTEXATTRIBIVPROC)get_gles_proc("glGetVertexAttribiv");
    glGetVertexAttribPointerv = (PFNGLGETVERTEXATTRIBPOINTERVPROC)get_gles_proc("glGetVertexAttribPointerv");
    glHint = (PFNGLHINTPROC)get_gles_proc("glHint");
    glIsBuffer = (PFNGLISBUFFERPROC)get_gles_proc("glIsBuffer");
    glIsEnabled = (PFNGLISENABLEDPROC)get_gles_proc("glIsEnabled");
    glIsFramebuffer = (PFNGLISFRAMEBUFFERPROC)get_gles_proc("glIsFramebuffer");
    glIsProgram = (PFNGLISPROGRAMPROC)get_gles_proc("glIsProgram");
    glIsRenderbuffer = (PFNGLISRENDERBUFFERPROC)get_gles_proc("glIsRenderbuffer");
    glIsShader = (PFNGLISSHADERPROC)get_gles_proc("glIsShader");
    glIsTexture = (PFNGLISTEXTUREPROC)get_gles_proc("glIsTexture");
    glLineWidth = (PFNGLLINEWIDTHPROC)get_gles_proc("glLineWidth");
    glLinkProgram = (PFNGLLINKPROGRAMPROC)get_gles_proc("glLinkProgram");
    glPixelStorei = (PFNGLPIXELSTOREIPROC)get_gles_proc("glPixelStorei");
    glPolygonOffset = (PFNGLPOLYGONOFFSETPROC)get_gles_proc("glPolygonOffset");
    glReadPixels = (PFNGLREADPIXELSPROC)get_gles_proc("glReadPixels");
    glReleaseShaderCompiler = (PFNGLRELEASESHADERCOMPILERPROC)get_gles_proc("glReleaseShaderCompiler");
    glRenderbufferStorage = (PFNGLRENDERBUFFERSTORAGEPROC)get_gles_proc("glRenderbufferStorage");
    glSampleCoverage = (PFNGLSAMPLECOVERAGEPROC)get_gles_proc("glSampleCoverage");
    glScissor = (PFNGLSCISSORPROC)get_gles_proc("glScissor");
    glShaderBinary = (PFNGLSHADERBINARYPROC)get_gles_proc("glShaderBinary");
    glShaderSource = (PFNGLSHADERSOURCEPROC)get_gles_proc("glShaderSource");
    glStencilFunc = (PFNGLSTENCILFUNCPROC)get_gles_proc("glStencilFunc");
    glStencilFuncSeparate = (PFNGLSTENCILFUNCSEPARATEPROC)get_gles_proc("glStencilFuncSeparate");
    glStencilMask = (PFNGLSTENCILMASKPROC)get_gles_proc("glStencilMask");
    glStencilMaskSeparate = (PFNGLSTENCILMASKSEPARATEPROC)get_gles_proc("glStencilMaskSeparate");
    glStencilOp = (PFNGLSTENCILOPPROC)get_gles_proc("glStencilOp");
    glStencilOpSeparate = (PFNGLSTENCILOPSEPARATEPROC)get_gles_proc("glStencilOpSeparate");
    glTexImage2D = (PFNGLTEXIMAGE2DPROC)get_gles_proc("glTexImage2D");
    glTexParameterf = (PFNGLTEXPARAMETERFPROC)get_gles_proc("glTexParameterf");
    glTexParameterfv = (PFNGLTEXPARAMETERFVPROC)get_gles_proc("glTexParameterfv");
    glTexParameteri = (PFNGLTEXPARAMETERIPROC)get_gles_proc("glTexParameteri");
    glTexParameteriv = (PFNGLTEXPARAMETERIVPROC)get_gles_proc("glTexParameteriv");
    glTexSubImage2D = (PFNGLTEXSUBIMAGE2DPROC)get_gles_proc("glTexSubImage2D");
    glUniform1f = (PFNGLUNIFORM1FPROC)get_gles_proc("glUniform1f");
    glUniform1fv = (PFNGLUNIFORM1FVPROC)get_gles_proc("glUniform1fv");
    glUniform1i = (PFNGLUNIFORM1IPROC)get_gles_proc("glUniform1i");
    glUniform1iv = (PFNGLUNIFORM1IVPROC)get_gles_proc("glUniform1iv");
    glUniform2f = (PFNGLUNIFORM2FPROC)get_gles_proc("glUniform2f");
    glUniform2fv = (PFNGLUNIFORM2FVPROC)get_gles_proc("glUniform2fv");
    glUniform2i = (PFNGLUNIFORM2IPROC)get_gles_proc("glUniform2i");
    glUniform2iv = (PFNGLUNIFORM2IVPROC)get_gles_proc("glUniform2iv");
    glUniform3f = (PFNGLUNIFORM3FPROC)get_gles_proc("glUniform3f");
    glUniform3fv = (PFNGLUNIFORM3FVPROC)get_gles_proc("glUniform3fv");
    glUniform3i = (PFNGLUNIFORM3IPROC)get_gles_proc("glUniform3i");
    glUniform3iv = (PFNGLUNIFORM3IVPROC)get_gles_proc("glUniform3iv");
    glUniform4f = (PFNGLUNIFORM4FPROC)get_gles_proc("glUniform4f");
    glUniform4fv = (PFNGLUNIFORM4FVPROC)get_gles_proc("glUniform4fv");
    glUniform4i = (PFNGLUNIFORM4IPROC)get_gles_proc("glUniform4i");
    glUniform4iv = (PFNGLUNIFORM4IVPROC)get_gles_proc("glUniform4iv");
    glUniformMatrix2fv = (PFNGLUNIFORMMATRIX2FVPROC)get_gles_proc("glUniformMatrix2fv");
    glUniformMatrix3fv = (PFNGLUNIFORMMATRIX3FVPROC)get_gles_proc("glUniformMatrix3fv");
    glUniformMatrix4fv = (PFNGLUNIFORMMATRIX4FVPROC)get_gles_proc("glUniformMatrix4fv");
    glUseProgram = (PFNGLUSEPROGRAMPROC)get_gles_proc("glUseProgram");
    glValidateProgram = (PFNGLVALIDATEPROGRAMPROC)get_gles_proc("glValidateProgram");
    glVertexAttrib1f = (PFNGLVERTEXATTRIB1FPROC)get_gles_proc("glVertexAttrib1f");
    glVertexAttrib1fv = (PFNGLVERTEXATTRIB1FVPROC)get_gles_proc("glVertexAttrib1fv");
    glVertexAttrib2f = (PFNGLVERTEXATTRIB2FPROC)get_gles_proc("glVertexAttrib2f");
    glVertexAttrib2fv = (PFNGLVERTEXATTRIB2FVPROC)get_gles_proc("glVertexAttrib2fv");
    glVertexAttrib3f = (PFNGLVERTEXATTRIB3FPROC)get_gles_proc("glVertexAttrib3f");
    glVertexAttrib3fv = (PFNGLVERTEXATTRIB3FVPROC)get_gles_proc("glVertexAttrib3fv");
    glVertexAttrib4f = (PFNGLVERTEXATTRIB4FPROC)get_gles_proc("glVertexAttrib4f");
    glVertexAttrib4fv = (PFNGLVERTEXATTRIB4FVPROC)get_gles_proc("glVertexAttrib4fv");
    glVertexAttribPointer = (PFNGLVERTEXATTRIBPOINTERPROC)get_gles_proc("glVertexAttribPointer");
    glViewport = (PFNGLVIEWPORTPROC)get_gles_proc("glViewport");
    glReadBuffer = (PFNGLREADBUFFERPROC)get_gles_proc("glReadBuffer");
    glDrawRangeElements = (PFNGLDRAWRANGEELEMENTSPROC)get_gles_proc("glDrawRangeElements");
    glTexImage3D = (PFNGLTEXIMAGE3DPROC)get_gles_proc("glTexImage3D");
    glTexSubImage3D = (PFNGLTEXSUBIMAGE3DPROC)get_gles_proc("glTexSubImage3D");
    glCopyTexSubImage3D = (PFNGLCOPYTEXSUBIMAGE3DPROC)get_gles_proc("glCopyTexSubImage3D");
    glCompressedTexImage3D = (PFNGLCOMPRESSEDTEXIMAGE3DPROC)get_gles_proc("glCompressedTexImage3D");
    glCompressedTexSubImage3D = (PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC)get_gles_proc("glCompressedTexSubImage3D");
    glGenQueries = (PFNGLGENQUERIESPROC)get_gles_proc("glGenQueries");
    glDeleteQueries = (PFNGLDELETEQUERIESPROC)get_gles_proc("glDeleteQueries");
    glIsQuery = (PFNGLISQUERYPROC)get_gles_proc("glIsQuery");
    glBeginQuery = (PFNGLBEGINQUERYPROC)get_gles_proc("glBeginQuery");
    glEndQuery = (PFNGLENDQUERYPROC)get_gles_proc("glEndQuery");
    glGetQueryiv = (PFNGLGETQUERYIVPROC)get_gles_proc("glGetQueryiv");
    glGetQueryObjectuiv = (PFNGLGETQUERYOBJECTUIVPROC)get_gles_proc("glGetQueryObjectuiv");
    glUnmapBuffer = (PFNGLUNMAPBUFFERPROC)get_gles_proc("glUnmapBuffer");
    glGetBufferPointerv = (PFNGLGETBUFFERPOINTERVPROC)get_gles_proc("glGetBufferPointerv");
    glDrawBuffers = (PFNGLDRAWBUFFERSPROC)get_gles_proc("glDrawBuffers");
    glUniformMatrix2x3fv = (PFNGLUNIFORMMATRIX2X3FVPROC)get_gles_proc("glUniformMatrix2x3fv");
    glUniformMatrix3x2fv = (PFNGLUNIFORMMATRIX3X2FVPROC)get_gles_proc("glUniformMatrix3x2fv");
    glUniformMatrix2x4fv = (PFNGLUNIFORMMATRIX2X4FVPROC)get_gles_proc("glUniformMatrix2x4fv");
    glUniformMatrix4x2fv = (PFNGLUNIFORMMATRIX4X2FVPROC)get_gles_proc("glUniformMatrix4x2fv");
    glUniformMatrix3x4fv = (PFNGLUNIFORMMATRIX3X4FVPROC)get_gles_proc("glUniformMatrix3x4fv");
    glUniformMatrix4x3fv = (PFNGLUNIFORMMATRIX4X3FVPROC)get_gles_proc("glUniformMatrix4x3fv");
    glBlitFramebuffer = (PFNGLBLITFRAMEBUFFERPROC)get_gles_proc("glBlitFramebuffer");
    glRenderbufferStorageMultisample = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC)get_gles_proc("glRenderbufferStorageMultisample");
    glFramebufferTextureLayer = (PFNGLFRAMEBUFFERTEXTURELAYERPROC)get_gles_proc("glFramebufferTextureLayer");
    glMapBufferRange = (PFNGLMAPBUFFERRANGEPROC)get_gles_proc("glMapBufferRange");
    glFlushMappedBufferRange = (PFNGLFLUSHMAPPEDBUFFERRANGEPROC)get_gles_proc("glFlushMappedBufferRange");
    glBindVertexArray = (PFNGLBINDVERTEXARRAYPROC)get_gles_proc("glBindVertexArray");
    glDeleteVertexArrays = (PFNGLDELETEVERTEXARRAYSPROC)get_gles_proc("glDeleteVertexArrays");
    glGenVertexArrays = (PFNGLGENVERTEXARRAYSPROC)get_gles_proc("glGenVertexArrays");
    glIsVertexArray = (PFNGLISVERTEXARRAYPROC)get_gles_proc("glIsVertexArray");
    glGetIntegeri_v = (PFNGLGETINTEGERI_VPROC)get_gles_proc("glGetIntegeri_v");
    glBeginTransformFeedback = (PFNGLBEGINTRANSFORMFEEDBACKPROC)get_gles_proc("glBeginTransformFeedback");
    glEndTransformFeedback = (PFNGLENDTRANSFORMFEEDBACKPROC)get_gles_proc("glEndTransformFeedback");
    glBindBufferRange = (PFNGLBINDBUFFERRANGEPROC)get_gles_proc("glBindBufferRange");
    glBindBufferBase = (PFNGLBINDBUFFERBASEPROC)get_gles_proc("glBindBufferBase");
    glTransformFeedbackVaryings = (PFNGLTRANSFORMFEEDBACKVARYINGSPROC)get_gles_proc("glTransformFeedbackVaryings");
    glGetTransformFeedbackVarying = (PFNGLGETTRANSFORMFEEDBACKVARYINGPROC)get_gles_proc("glGetTransformFeedbackVarying");
    glVertexAttribIPointer = (PFNGLVERTEXATTRIBIPOINTERPROC)get_gles_proc("glVertexAttribIPointer");
    glGetVertexAttribIiv = (PFNGLGETVERTEXATTRIBIIVPROC)get_gles_proc("glGetVertexAttribIiv");
    glGetVertexAttribIuiv = (PFNGLGETVERTEXATTRIBIUIVPROC)get_gles_proc("glGetVertexAttribIuiv");
    glVertexAttribI4i = (PFNGLVERTEXATTRIBI4IPROC)get_gles_proc("glVertexAttribI4i");
    glVertexAttribI4ui = (PFNGLVERTEXATTRIBI4UIPROC)get_gles_proc("glVertexAttribI4ui");
    glVertexAttribI4iv = (PFNGLVERTEXATTRIBI4IVPROC)get_gles_proc("glVertexAttribI4iv");
    glVertexAttribI4uiv = (PFNGLVERTEXATTRIBI4UIVPROC)get_gles_proc("glVertexAttribI4uiv");
    glGetUniformuiv = (PFNGLGETUNIFORMUIVPROC)get_gles_proc("glGetUniformuiv");
    glGetFragDataLocation = (PFNGLGETFRAGDATALOCATIONPROC)get_gles_proc("glGetFragDataLocation");
    glUniform1ui = (PFNGLUNIFORM1UIPROC)get_gles_proc("glUniform1ui");
    glUniform2ui = (PFNGLUNIFORM2UIPROC)get_gles_proc("glUniform2ui");
    glUniform3ui = (PFNGLUNIFORM3UIPROC)get_gles_proc("glUniform3ui");
    glUniform4ui = (PFNGLUNIFORM4UIPROC)get_gles_proc("glUniform4ui");
    glUniform1uiv = (PFNGLUNIFORM1UIVPROC)get_gles_proc("glUniform1uiv");
    glUniform2uiv = (PFNGLUNIFORM2UIVPROC)get_gles_proc("glUniform2uiv");
    glUniform3uiv = (PFNGLUNIFORM3UIVPROC)get_gles_proc("glUniform3uiv");
    glUniform4uiv = (PFNGLUNIFORM4UIVPROC)get_gles_proc("glUniform4uiv");
    glClearBufferiv = (PFNGLCLEARBUFFERIVPROC)get_gles_proc("glClearBufferiv");
    glClearBufferuiv = (PFNGLCLEARBUFFERUIVPROC)get_gles_proc("glClearBufferuiv");
    glClearBufferfv = (PFNGLCLEARBUFFERFVPROC)get_gles_proc("glClearBufferfv");
    glClearBufferfi = (PFNGLCLEARBUFFERFIPROC)get_gles_proc("glClearBufferfi");
    glGetStringi = (PFNGLGETSTRINGIPROC)get_gles_proc("glGetStringi");
    glCopyBufferSubData = (PFNGLCOPYBUFFERSUBDATAPROC)get_gles_proc("glCopyBufferSubData");
    glGetUniformIndices = (PFNGLGETUNIFORMINDICESPROC)get_gles_proc("glGetUniformIndices");
    glGetActiveUniformsiv = (PFNGLGETACTIVEUNIFORMSIVPROC)get_gles_proc("glGetActiveUniformsiv");
    glGetUniformBlockIndex = (PFNGLGETUNIFORMBLOCKINDEXPROC)get_gles_proc("glGetUniformBlockIndex");
    glGetActiveUniformBlockiv = (PFNGLGETACTIVEUNIFORMBLOCKIVPROC)get_gles_proc("glGetActiveUniformBlockiv");
    glGetActiveUniformBlockName = (PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC)get_gles_proc("glGetActiveUniformBlockName");
    glUniformBlockBinding = (PFNGLUNIFORMBLOCKBINDINGPROC)get_gles_proc("glUniformBlockBinding");
    glDrawArraysInstanced = (PFNGLDRAWARRAYSINSTANCEDPROC)get_gles_proc("glDrawArraysInstanced");
    glDrawElementsInstanced = (PFNGLDRAWELEMENTSINSTANCEDPROC)get_gles_proc("glDrawElementsInstanced");
    glFenceSync = (PFNGLFENCESYNCPROC)get_gles_proc("glFenceSync");
    glIsSync = (PFNGLISSYNCPROC)get_gles_proc("glIsSync");
    glDeleteSync = (PFNGLDELETESYNCPROC)get_gles_proc("glDeleteSync");
    glClientWaitSync = (PFNGLCLIENTWAITSYNCPROC)get_gles_proc("glClientWaitSync");
    glWaitSync = (PFNGLWAITSYNCPROC)get_gles_proc("glWaitSync");
    glGetInteger64v = (PFNGLGETINTEGER64VPROC)get_gles_proc("glGetInteger64v");
    glGetSynciv = (PFNGLGETSYNCIVPROC)get_gles_proc("glGetSynciv");
    glGetInteger64i_v = (PFNGLGETINTEGER64I_VPROC)get_gles_proc("glGetInteger64i_v");
    glGetBufferParameteri64v = (PFNGLGETBUFFERPARAMETERI64VPROC)get_gles_proc("glGetBufferParameteri64v");
    glGenSamplers = (PFNGLGENSAMPLERSPROC)get_gles_proc("glGenSamplers");
    glDeleteSamplers = (PFNGLDELETESAMPLERSPROC)get_gles_proc("glDeleteSamplers");
    glIsSampler = (PFNGLISSAMPLERPROC)get_gles_proc("glIsSampler");
    glBindSampler = (PFNGLBINDSAMPLERPROC)get_gles_proc("glBindSampler");
    glSamplerParameteri = (PFNGLSAMPLERPARAMETERIPROC)get_gles_proc("glSamplerParameteri");
    glSamplerParameteriv = (PFNGLSAMPLERPARAMETERIVPROC)get_gles_proc("glSamplerParameteriv");
    glSamplerParameterf = (PFNGLSAMPLERPARAMETERFPROC)get_gles_proc("glSamplerParameterf");
    glSamplerParameterfv = (PFNGLSAMPLERPARAMETERFVPROC)get_gles_proc("glSamplerParameterfv");
    glGetSamplerParameteriv = (PFNGLGETSAMPLERPARAMETERIVPROC)get_gles_proc("glGetSamplerParameteriv");
    glGetSamplerParameterfv = (PFNGLGETSAMPLERPARAMETERFVPROC)get_gles_proc("glGetSamplerParameterfv");
    glVertexAttribDivisor = (PFNGLVERTEXATTRIBDIVISORPROC)get_gles_proc("glVertexAttribDivisor");
    glBindTransformFeedback = (PFNGLBINDTRANSFORMFEEDBACKPROC)get_gles_proc("glBindTransformFeedback");
    glDeleteTransformFeedbacks = (PFNGLDELETETRANSFORMFEEDBACKSPROC)get_gles_proc("glDeleteTransformFeedbacks");
    glGenTransformFeedbacks = (PFNGLGENTRANSFORMFEEDBACKSPROC)get_gles_proc("glGenTransformFeedbacks");
    glIsTransformFeedback = (PFNGLISTRANSFORMFEEDBACKPROC)get_gles_proc("glIsTransformFeedback");
    glPauseTransformFeedback = (PFNGLPAUSETRANSFORMFEEDBACKPROC)get_gles_proc("glPauseTransformFeedback");
    glResumeTransformFeedback = (PFNGLRESUMETRANSFORMFEEDBACKPROC)get_gles_proc("glResumeTransformFeedback");
    glGetProgramBinary = (PFNGLGETPROGRAMBINARYPROC)get_gles_proc("glGetProgramBinary");
    glProgramBinary = (PFNGLPROGRAMBINARYPROC)get_gles_proc("glProgramBinary");
    glProgramParameteri = (PFNGLPROGRAMPARAMETERIPROC)get_gles_proc("glProgramParameteri");
    glInvalidateFramebuffer = (PFNGLINVALIDATEFRAMEBUFFERPROC)get_gles_proc("glInvalidateFramebuffer");
    glInvalidateSubFramebuffer = (PFNGLINVALIDATESUBFRAMEBUFFERPROC)get_gles_proc("glInvalidateSubFramebuffer");
    glTexStorage2D = (PFNGLTEXSTORAGE2DPROC)get_gles_proc("glTexStorage2D");
    glTexStorage3D = (PFNGLTEXSTORAGE3DPROC)get_gles_proc("glTexStorage3D");
    glGetInternalformativ = (PFNGLGETINTERNALFORMATIVPROC)get_gles_proc("glGetInternalformativ");
    glLabelObjectEXT = (PFNGLLABELOBJECTEXTPROC)get_gles_proc("glLabelObjectEXT");
    glGetObjectLabelEXT = (PFNGLGETOBJECTLABELEXTPROC)get_gles_proc("glGetObjectLabelEXT");
    glInsertEventMarkerEXT = (PFNGLINSERTEVENTMARKEREXTPROC)get_gles_proc("glInsertEventMarkerEXT");
    glPushGroupMarkerEXT = (PFNGLPUSHGROUPMARKEREXTPROC)get_gles_proc("glPushGroupMarkerEXT");
    glPopGroupMarkerEXT = (PFNGLPOPGROUPMARKEREXTPROC)get_gles_proc("glPopGroupMarkerEXT");
    glUseProgramStagesEXT = (PFNGLUSEPROGRAMSTAGESEXTPROC)get_gles_proc("glUseProgramStagesEXT");
    glActiveShaderProgramEXT = (PFNGLACTIVESHADERPROGRAMEXTPROC)get_gles_proc("glActiveShaderProgramEXT");
    glCreateShaderProgramvEXT = (PFNGLCREATESHADERPROGRAMVEXTPROC)get_gles_proc("glCreateShaderProgramvEXT");
    glBindProgramPipelineEXT = (PFNGLBINDPROGRAMPIPELINEEXTPROC)get_gles_proc("glBindProgramPipelineEXT");
    glDeleteProgramPipelinesEXT = (PFNGLDELETEPROGRAMPIPELINESEXTPROC)get_gles_proc("glDeleteProgramPipelinesEXT");
    glGenProgramPipelinesEXT = (PFNGLGENPROGRAMPIPELINESEXTPROC)get_gles_proc("glGenProgramPipelinesEXT");
    glIsProgramPipelineEXT = (PFNGLISPROGRAMPIPELINEEXTPROC)get_gles_proc("glIsProgramPipelineEXT");
    glProgramParameteriEXT = (PFNGLPROGRAMPARAMETERIEXTPROC)get_gles_proc("glProgramParameteriEXT");
    glGetProgramPipelineivEXT = (PFNGLGETPROGRAMPIPELINEIVEXTPROC)get_gles_proc("glGetProgramPipelineivEXT");
    glProgramUniform1iEXT = (PFNGLPROGRAMUNIFORM1IEXTPROC)get_gles_proc("glProgramUniform1iEXT");
    glProgramUniform2iEXT = (PFNGLPROGRAMUNIFORM2IEXTPROC)get_gles_proc("glProgramUniform2iEXT");
    glProgramUniform3iEXT = (PFNGLPROGRAMUNIFORM3IEXTPROC)get_gles_proc("glProgramUniform3iEXT");
    glProgramUniform4iEXT = (PFNGLPROGRAMUNIFORM4IEXTPROC)get_gles_proc("glProgramUniform4iEXT");
    glProgramUniform1fEXT = (PFNGLPROGRAMUNIFORM1FEXTPROC)get_gles_proc("glProgramUniform1fEXT");
    glProgramUniform2fEXT = (PFNGLPROGRAMUNIFORM2FEXTPROC)get_gles_proc("glProgramUniform2fEXT");
    glProgramUniform3fEXT = (PFNGLPROGRAMUNIFORM3FEXTPROC)get_gles_proc("glProgramUniform3fEXT");
    glProgramUniform4fEXT = (PFNGLPROGRAMUNIFORM4FEXTPROC)get_gles_proc("glProgramUniform4fEXT");
    glProgramUniform1ivEXT = (PFNGLPROGRAMUNIFORM1IVEXTPROC)get_gles_proc("glProgramUniform1ivEXT");
    glProgramUniform2ivEXT = (PFNGLPROGRAMUNIFORM2IVEXTPROC)get_gles_proc("glProgramUniform2ivEXT");
    glProgramUniform3ivEXT = (PFNGLPROGRAMUNIFORM3IVEXTPROC)get_gles_proc("glProgramUniform3ivEXT");
    glProgramUniform4ivEXT = (PFNGLPROGRAMUNIFORM4IVEXTPROC)get_gles_proc("glProgramUniform4ivEXT");
    glProgramUniform1fvEXT = (PFNGLPROGRAMUNIFORM1FVEXTPROC)get_gles_proc("glProgramUniform1fvEXT");
    glProgramUniform2fvEXT = (PFNGLPROGRAMUNIFORM2FVEXTPROC)get_gles_proc("glProgramUniform2fvEXT");
    glProgramUniform3fvEXT = (PFNGLPROGRAMUNIFORM3FVEXTPROC)get_gles_proc("glProgramUniform3fvEXT");
    glProgramUniform4fvEXT = (PFNGLPROGRAMUNIFORM4FVEXTPROC)get_gles_proc("glProgramUniform4fvEXT");
    glProgramUniformMatrix2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC)get_gles_proc("glProgramUniformMatrix2fvEXT");
    glProgramUniformMatrix3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC)get_gles_proc("glProgramUniformMatrix3fvEXT");
    glProgramUniformMatrix4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC)get_gles_proc("glProgramUniformMatrix4fvEXT");
    glProgramUniformMatrix2x3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC)get_gles_proc("glProgramUniformMatrix2x3fvEXT");
    glProgramUniformMatrix4x2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC)get_gles_proc("glProgramUniformMatrix3x2fvEXT");
    glProgramUniformMatrix2x4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC)get_gles_proc("glProgramUniformMatrix2x4fvEXT");
    glProgramUniformMatrix4x2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC)get_gles_proc("glProgramUniformMatrix4x2fvEXT");
    glProgramUniformMatrix3x4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC)get_gles_proc("glProgramUniformMatrix3x4fvEXT");
    glProgramUniformMatrix4x3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC)get_gles_proc("glProgramUniformMatrix4x3fvEXT");
    glValidateProgramPipelineEXT = (PFNGLVALIDATEPROGRAMPIPELINEEXTPROC)get_gles_proc("glValidateProgramPipelineEXT");
    glGetProgramPipelineInfoLogEXT = (PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC)get_gles_proc("glGetProgramPipelineInfoLogEXT");

    glDebugMessageControlKHR = (PFNGLDEBUGMESSAGECONTROLKHRPROC)get_gles_proc("glDebugMessageControlKHR");
    glDebugMessageCallbackKHR = (PFNGLDEBUGMESSAGECALLBACKKHRPROC)get_gles_proc("glDebugMessageCallbackKHR");
    glFramebufferTexture2DMultisampleEXT = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC)get_gles_proc("glFramebufferTexture2DMultisampleEXT");
    glFramebufferTexture2DMultisampleIMG = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC)get_gles_proc("glFramebufferTexture2DMultisampleIMG");

    glDispatchCompute = (PFNGLDISPATCHCOMPUTEPROC)get_gles_proc("glDispatchCompute");
    glDispatchComputeIndirect = (PFNGLDISPATCHCOMPUTEINDIRECTPROC)get_gles_proc("glDispatchComputeIndirect");
    glGetProgramInterfaceiv = (PFNGLGETPROGRAMINTERFACEIVPROC)get_gles_proc("glGetProgramInterfaceiv");
    glGetProgramResourceName = (PFNGLGETPROGRAMRESOURCENAMEPROC)get_gles_proc("glGetProgramResourceName");
    glGetProgramResourceiv = (PFNGLGETPROGRAMRESOURCEIVPROC)get_gles_proc("glGetProgramResourceiv");
    glBindImageTexture = (PFNGLBINDIMAGETEXTUREPROC)get_gles_proc("glBindImageTexture");
    glMemoryBarrier = (PFNGLMEMORYBARRIERPROC)get_gles_proc("glMemoryBarrier");
    glMemoryBarrierByRegion = (PFNGLMEMORYBARRIERBYREGIONPROC)get_gles_proc("glMemoryBarrierByRegion");
}
