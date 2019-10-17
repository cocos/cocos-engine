#include "gles3w.h"

#if defined(_WIN32) && !defined(ANDROID)
#define WIN32_LEAN_AND_MEAN 1
#include <windows.h>
#include <EGL/egl.h>

static HMODULE libgl;

static int open_libgl(void)
{
    libgl = LoadLibraryA("libGLESv2.dll");
	return (libgl != NULL);
}

static void close_libgl(void)
{
    FreeLibrary(libgl);
}

static void *get_proc(const char *proc)
{
    void *res;

    res = (void*)eglGetProcAddress(proc);
    if (!res)
		res = (void*)GetProcAddress(libgl, proc);
    return res;
}
#elif defined(__APPLE__) || defined(__APPLE_CC__)
#import <TargetConditionals.h>
#import <CoreFoundation/CoreFoundation.h>
#import <UIKit/UIDevice.h>
#import <string>
#import <iostream>
#import <stdio.h>

// Routine to run a system command and retrieve the output.
// From http://stackoverflow.com/questions/478898/how-to-execute-a-command-and-get-output-of-command-within-c
std::string ES3_EXEC(const char* cmd) {
    FILE* pipe = popen(cmd, "r");
    if (!pipe) return "ERROR";
    char buffer[128];
    std::string result = "";
    while(!feof(pipe)) {
        if(fgets(buffer, 128, pipe) != NULL)
            result += buffer;
    }
    pclose(pipe);
    return result;
}

static CFBundleRef g_es3Bundle;
static CFURLRef g_es3BundleURL;

static int open_libgl(void)
{
    CFStringRef frameworkPath = CFSTR("/System/Library/Frameworks/OpenGLES.framework");
    NSString *sysVersion = [UIDevice currentDevice].systemVersion;
    NSArray *sysVersionComponents = [sysVersion componentsSeparatedByString:@"."];
	//BOOL isSimulator = ([[UIDevice currentDevice].model rangeOfString:@"Simulator"].location != NSNotFound);
	
#if TARGET_IPHONE_SIMULATOR
	bool isSimulator = true;
#else
	bool isSimulator = false;
#endif
	if(isSimulator)
    {
        // Ask where Xcode is installed
        std::string xcodePath = "/Applications/Xcode.app/Contents/Developer\n";

        // The result contains an end line character. Remove it.
        size_t pos = xcodePath.find("\n");
        xcodePath.erase(pos);

        char tempPath[PATH_MAX];
        sprintf(tempPath,
                "%s/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator%s.%s.sdk/System/Library/Frameworks/OpenGLES.framework",
                xcodePath.c_str(),
                [[sysVersionComponents objectAtIndex:0] cStringUsingEncoding:NSUTF8StringEncoding],
                [[sysVersionComponents objectAtIndex:1] cStringUsingEncoding:NSUTF8StringEncoding]);
        frameworkPath = CFStringCreateWithCString(kCFAllocatorDefault, tempPath, kCFStringEncodingUTF8);
    }

    g_es3BundleURL = CFURLCreateWithFileSystemPath(kCFAllocatorDefault,
                                              frameworkPath,
                                              kCFURLPOSIXPathStyle, true);

    CFRelease(frameworkPath);

    g_es3Bundle = CFBundleCreate(kCFAllocatorDefault, g_es3BundleURL);
    
    return (g_es3Bundle != NULL);
}

static void close_libgl(void)
{
    CFRelease(g_es3Bundle);
    CFRelease(g_es3BundleURL);
}

static void *get_proc(const char *proc)
{
    void *res;

    CFStringRef procname = CFStringCreateWithCString(kCFAllocatorDefault, proc,
                                                     kCFStringEncodingASCII);
    res = CFBundleGetFunctionPointerForName(g_es3Bundle, procname);
    CFRelease(procname);
    return res;
}
#else
#include <dlfcn.h>
#include <EGL/egl.h>

static void *libgl;

static int open_libgl(void)
{
    libgl = dlopen("libGLESv2.so", RTLD_LAZY | RTLD_GLOBAL);
	return (libgl != NULL);
}

static void close_libgl(void)
{
    dlclose(libgl);
}

static void *get_proc(const char *proc)
{
    void *res;
    res = dlsym(libgl, proc);
    return res;
}
#endif

static struct {
    int major, minor;
} version;

static int parse_version(void)
{
    if (!glGetIntegerv)
        return -1;

    glGetIntegerv(GL_MAJOR_VERSION, &version.major);
    glGetIntegerv(GL_MINOR_VERSION, &version.minor);

    if (version.major < 3)
        return -1;
    return 0;
}

static void load_procs(void);

int gles3wInit(void)
{
	if (!open_libgl())
	{
		return 0;
	}

    load_procs();
    close_libgl();
	parse_version();

    return 1;
}

int gles3wIsSupported(int major, int minor)
{
    if (major <= 3)
        return 0;
    if (version.major == major)
        return version.minor >= minor;
    return version.major >= major;
}

void *gles3wGetProcAddress(const char *proc)
{
    return get_proc(proc);
}

PFNGLACTIVETEXTUREPROC gles3wActiveTexture;
PFNGLATTACHSHADERPROC gles3wAttachShader;
PFNGLBINDATTRIBLOCATIONPROC gles3wBindAttribLocation;
PFNGLBINDBUFFERPROC gles3wBindBuffer;
PFNGLBINDFRAMEBUFFERPROC gles3wBindFramebuffer;
PFNGLBINDRENDERBUFFERPROC gles3wBindRenderbuffer;
PFNGLBINDTEXTUREPROC gles3wBindTexture;
PFNGLBLENDCOLORPROC gles3wBlendColor;
PFNGLBLENDEQUATIONPROC gles3wBlendEquation;
PFNGLBLENDEQUATIONSEPARATEPROC gles3wBlendEquationSeparate;
PFNGLBLENDFUNCPROC gles3wBlendFunc;
PFNGLBLENDFUNCSEPARATEPROC gles3wBlendFuncSeparate;
PFNGLBUFFERDATAPROC gles3wBufferData;
PFNGLBUFFERSUBDATAPROC gles3wBufferSubData;
PFNGLCHECKFRAMEBUFFERSTATUSPROC gles3wCheckFramebufferStatus;
PFNGLCLEARPROC gles3wClear;
PFNGLCLEARCOLORPROC gles3wClearColor;
PFNGLCLEARDEPTHFPROC gles3wClearDepthf;
PFNGLCLEARSTENCILPROC gles3wClearStencil;
PFNGLCOLORMASKPROC gles3wColorMask;
PFNGLCOMPILESHADERPROC gles3wCompileShader;
PFNGLCOMPRESSEDTEXIMAGE2DPROC gles3wCompressedTexImage2D;
PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC gles3wCompressedTexSubImage2D;
PFNGLCOPYTEXIMAGE2DPROC gles3wCopyTexImage2D;
PFNGLCOPYTEXSUBIMAGE2DPROC gles3wCopyTexSubImage2D;
PFNGLCREATEPROGRAMPROC gles3wCreateProgram;
PFNGLCREATESHADERPROC gles3wCreateShader;
PFNGLCULLFACEPROC gles3wCullFace;
PFNGLDELETEBUFFERSPROC gles3wDeleteBuffers;
PFNGLDELETEFRAMEBUFFERSPROC gles3wDeleteFramebuffers;
PFNGLDELETEPROGRAMPROC gles3wDeleteProgram;
PFNGLDELETERENDERBUFFERSPROC gles3wDeleteRenderbuffers;
PFNGLDELETESHADERPROC gles3wDeleteShader;
PFNGLDELETETEXTURESPROC gles3wDeleteTextures;
PFNGLDEPTHFUNCPROC gles3wDepthFunc;
PFNGLDEPTHMASKPROC gles3wDepthMask;
PFNGLDEPTHRANGEFPROC gles3wDepthRangef;
PFNGLDETACHSHADERPROC gles3wDetachShader;
PFNGLDISABLEPROC gles3wDisable;
PFNGLDISABLEVERTEXATTRIBARRAYPROC gles3wDisableVertexAttribArray;
PFNGLDRAWARRAYSPROC gles3wDrawArrays;
PFNGLDRAWELEMENTSPROC gles3wDrawElements;
PFNGLENABLEPROC gles3wEnable;
PFNGLENABLEVERTEXATTRIBARRAYPROC gles3wEnableVertexAttribArray;
PFNGLFINISHPROC gles3wFinish;
PFNGLFLUSHPROC gles3wFlush;
PFNGLFRAMEBUFFERRENDERBUFFERPROC gles3wFramebufferRenderbuffer;
PFNGLFRAMEBUFFERTEXTURE2DPROC gles3wFramebufferTexture2D;
PFNGLFRONTFACEPROC gles3wFrontFace;
PFNGLGENBUFFERSPROC gles3wGenBuffers;
PFNGLGENERATEMIPMAPPROC gles3wGenerateMipmap;
PFNGLGENFRAMEBUFFERSPROC gles3wGenFramebuffers;
PFNGLGENRENDERBUFFERSPROC gles3wGenRenderbuffers;
PFNGLGENTEXTURESPROC gles3wGenTextures;
PFNGLGETACTIVEATTRIBPROC gles3wGetActiveAttrib;
PFNGLGETACTIVEUNIFORMPROC gles3wGetActiveUniform;
PFNGLGETATTACHEDSHADERSPROC gles3wGetAttachedShaders;
PFNGLGETATTRIBLOCATIONPROC gles3wGetAttribLocation;
PFNGLGETBOOLEANVPROC gles3wGetBooleanv;
PFNGLGETBUFFERPARAMETERIVPROC gles3wGetBufferParameteriv;
PFNGLGETERRORPROC gles3wGetError;
PFNGLGETFLOATVPROC gles3wGetFloatv;
PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC gles3wGetFramebufferAttachmentParameteriv;
PFNGLGETINTEGERVPROC gles3wGetIntegerv;
PFNGLGETPROGRAMIVPROC gles3wGetProgramiv;
PFNGLGETPROGRAMINFOLOGPROC gles3wGetProgramInfoLog;
PFNGLGETRENDERBUFFERPARAMETERIVPROC gles3wGetRenderbufferParameteriv;
PFNGLGETSHADERIVPROC gles3wGetShaderiv;
PFNGLGETSHADERINFOLOGPROC gles3wGetShaderInfoLog;
PFNGLGETSHADERPRECISIONFORMATPROC gles3wGetShaderPrecisionFormat;
PFNGLGETSHADERSOURCEPROC gles3wGetShaderSource;
PFNGLGETSTRINGPROC gles3wGetString;
PFNGLGETTEXPARAMETERFVPROC gles3wGetTexParameterfv;
PFNGLGETTEXPARAMETERIVPROC gles3wGetTexParameteriv;
PFNGLGETUNIFORMFVPROC gles3wGetUniformfv;
PFNGLGETUNIFORMIVPROC gles3wGetUniformiv;
PFNGLGETUNIFORMLOCATIONPROC gles3wGetUniformLocation;
PFNGLGETVERTEXATTRIBFVPROC gles3wGetVertexAttribfv;
PFNGLGETVERTEXATTRIBIVPROC gles3wGetVertexAttribiv;
PFNGLGETVERTEXATTRIBPOINTERVPROC gles3wGetVertexAttribPointerv;
PFNGLHINTPROC gles3wHint;
PFNGLISBUFFERPROC gles3wIsBuffer;
PFNGLISENABLEDPROC gles3wIsEnabled;
PFNGLISFRAMEBUFFERPROC gles3wIsFramebuffer;
PFNGLISPROGRAMPROC gles3wIsProgram;
PFNGLISRENDERBUFFERPROC gles3wIsRenderbuffer;
PFNGLISSHADERPROC gles3wIsShader;
PFNGLISTEXTUREPROC gles3wIsTexture;
PFNGLLINEWIDTHPROC gles3wLineWidth;
PFNGLLINKPROGRAMPROC gles3wLinkProgram;
PFNGLPIXELSTOREIPROC gles3wPixelStorei;
PFNGLPOLYGONOFFSETPROC gles3wPolygonOffset;
PFNGLREADPIXELSPROC gles3wReadPixels;
PFNGLRELEASESHADERCOMPILERPROC gles3wReleaseShaderCompiler;
PFNGLRENDERBUFFERSTORAGEPROC gles3wRenderbufferStorage;
PFNGLSAMPLECOVERAGEPROC gles3wSampleCoverage;
PFNGLSCISSORPROC gles3wScissor;
PFNGLSHADERBINARYPROC gles3wShaderBinary;
PFNGLSHADERSOURCEPROC gles3wShaderSource;
PFNGLSTENCILFUNCPROC gles3wStencilFunc;
PFNGLSTENCILFUNCSEPARATEPROC gles3wStencilFuncSeparate;
PFNGLSTENCILMASKPROC gles3wStencilMask;
PFNGLSTENCILMASKSEPARATEPROC gles3wStencilMaskSeparate;
PFNGLSTENCILOPPROC gles3wStencilOp;
PFNGLSTENCILOPSEPARATEPROC gles3wStencilOpSeparate;
PFNGLTEXIMAGE2DPROC gles3wTexImage2D;
PFNGLTEXPARAMETERFPROC gles3wTexParameterf;
PFNGLTEXPARAMETERFVPROC gles3wTexParameterfv;
PFNGLTEXPARAMETERIPROC gles3wTexParameteri;
PFNGLTEXPARAMETERIVPROC gles3wTexParameteriv;
PFNGLTEXSUBIMAGE2DPROC gles3wTexSubImage2D;
PFNGLUNIFORM1FPROC gles3wUniform1f;
PFNGLUNIFORM1FVPROC gles3wUniform1fv;
PFNGLUNIFORM1IPROC gles3wUniform1i;
PFNGLUNIFORM1IVPROC gles3wUniform1iv;
PFNGLUNIFORM2FPROC gles3wUniform2f;
PFNGLUNIFORM2FVPROC gles3wUniform2fv;
PFNGLUNIFORM2IPROC gles3wUniform2i;
PFNGLUNIFORM2IVPROC gles3wUniform2iv;
PFNGLUNIFORM3FPROC gles3wUniform3f;
PFNGLUNIFORM3FVPROC gles3wUniform3fv;
PFNGLUNIFORM3IPROC gles3wUniform3i;
PFNGLUNIFORM3IVPROC gles3wUniform3iv;
PFNGLUNIFORM4FPROC gles3wUniform4f;
PFNGLUNIFORM4FVPROC gles3wUniform4fv;
PFNGLUNIFORM4IPROC gles3wUniform4i;
PFNGLUNIFORM4IVPROC gles3wUniform4iv;
PFNGLUNIFORMMATRIX2FVPROC gles3wUniformMatrix2fv;
PFNGLUNIFORMMATRIX3FVPROC gles3wUniformMatrix3fv;
PFNGLUNIFORMMATRIX4FVPROC gles3wUniformMatrix4fv;
PFNGLUSEPROGRAMPROC gles3wUseProgram;
PFNGLVALIDATEPROGRAMPROC gles3wValidateProgram;
PFNGLVERTEXATTRIB1FPROC gles3wVertexAttrib1f;
PFNGLVERTEXATTRIB1FVPROC gles3wVertexAttrib1fv;
PFNGLVERTEXATTRIB2FPROC gles3wVertexAttrib2f;
PFNGLVERTEXATTRIB2FVPROC gles3wVertexAttrib2fv;
PFNGLVERTEXATTRIB3FPROC gles3wVertexAttrib3f;
PFNGLVERTEXATTRIB3FVPROC gles3wVertexAttrib3fv;
PFNGLVERTEXATTRIB4FPROC gles3wVertexAttrib4f;
PFNGLVERTEXATTRIB4FVPROC gles3wVertexAttrib4fv;
PFNGLVERTEXATTRIBPOINTERPROC gles3wVertexAttribPointer;
PFNGLVIEWPORTPROC gles3wViewport;
PFNGLREADBUFFERPROC gles3wReadBuffer;
PFNGLDRAWRANGEELEMENTSPROC gles3wDrawRangeElements;
PFNGLTEXIMAGE3DPROC gles3wTexImage3D;
PFNGLTEXSUBIMAGE3DPROC gles3wTexSubImage3D;
PFNGLCOPYTEXSUBIMAGE3DPROC gles3wCopyTexSubImage3D;
PFNGLCOMPRESSEDTEXIMAGE3DPROC gles3wCompressedTexImage3D;
PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC gles3wCompressedTexSubImage3D;
PFNGLGENQUERIESPROC gles3wGenQueries;
PFNGLDELETEQUERIESPROC gles3wDeleteQueries;
PFNGLISQUERYPROC gles3wIsQuery;
PFNGLBEGINQUERYPROC gles3wBeginQuery;
PFNGLENDQUERYPROC gles3wEndQuery;
PFNGLGETQUERYIVPROC gles3wGetQueryiv;
PFNGLGETQUERYOBJECTUIVPROC gles3wGetQueryObjectuiv;
PFNGLUNMAPBUFFERPROC gles3wUnmapBuffer;
PFNGLGETBUFFERPOINTERVPROC gles3wGetBufferPointerv;
PFNGLDRAWBUFFERSPROC gles3wDrawBuffers;
PFNGLUNIFORMMATRIX2X3FVPROC gles3wUniformMatrix2x3fv;
PFNGLUNIFORMMATRIX3X2FVPROC gles3wUniformMatrix3x2fv;
PFNGLUNIFORMMATRIX2X4FVPROC gles3wUniformMatrix2x4fv;
PFNGLUNIFORMMATRIX4X2FVPROC gles3wUniformMatrix4x2fv;
PFNGLUNIFORMMATRIX3X4FVPROC gles3wUniformMatrix3x4fv;
PFNGLUNIFORMMATRIX4X3FVPROC gles3wUniformMatrix4x3fv;
PFNGLBLITFRAMEBUFFERPROC gles3wBlitFramebuffer;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC gles3wRenderbufferStorageMultisample;
PFNGLFRAMEBUFFERTEXTURELAYERPROC gles3wFramebufferTextureLayer;
PFNGLMAPBUFFERRANGEPROC gles3wMapBufferRange;
PFNGLFLUSHMAPPEDBUFFERRANGEPROC gles3wFlushMappedBufferRange;
PFNGLBINDVERTEXARRAYPROC gles3wBindVertexArray;
PFNGLDELETEVERTEXARRAYSPROC gles3wDeleteVertexArrays;
PFNGLGENVERTEXARRAYSPROC gles3wGenVertexArrays;
PFNGLISVERTEXARRAYPROC gles3wIsVertexArray;
PFNGLGETINTEGERI_VPROC gles3wGetIntegeri_v;
PFNGLBEGINTRANSFORMFEEDBACKPROC gles3wBeginTransformFeedback;
PFNGLENDTRANSFORMFEEDBACKPROC gles3wEndTransformFeedback;
PFNGLBINDBUFFERRANGEPROC gles3wBindBufferRange;
PFNGLBINDBUFFERBASEPROC gles3wBindBufferBase;
PFNGLTRANSFORMFEEDBACKVARYINGSPROC gles3wTransformFeedbackVaryings;
PFNGLGETTRANSFORMFEEDBACKVARYINGPROC gles3wGetTransformFeedbackVarying;
PFNGLVERTEXATTRIBIPOINTERPROC gles3wVertexAttribIPointer;
PFNGLGETVERTEXATTRIBIIVPROC gles3wGetVertexAttribIiv;
PFNGLGETVERTEXATTRIBIUIVPROC gles3wGetVertexAttribIuiv;
PFNGLVERTEXATTRIBI4IPROC gles3wVertexAttribI4i;
PFNGLVERTEXATTRIBI4UIPROC gles3wVertexAttribI4ui;
PFNGLVERTEXATTRIBI4IVPROC gles3wVertexAttribI4iv;
PFNGLVERTEXATTRIBI4UIVPROC gles3wVertexAttribI4uiv;
PFNGLGETUNIFORMUIVPROC gles3wGetUniformuiv;
PFNGLGETFRAGDATALOCATIONPROC gles3wGetFragDataLocation;
PFNGLUNIFORM1UIPROC gles3wUniform1ui;
PFNGLUNIFORM2UIPROC gles3wUniform2ui;
PFNGLUNIFORM3UIPROC gles3wUniform3ui;
PFNGLUNIFORM4UIPROC gles3wUniform4ui;
PFNGLUNIFORM1UIVPROC gles3wUniform1uiv;
PFNGLUNIFORM2UIVPROC gles3wUniform2uiv;
PFNGLUNIFORM3UIVPROC gles3wUniform3uiv;
PFNGLUNIFORM4UIVPROC gles3wUniform4uiv;
PFNGLCLEARBUFFERIVPROC gles3wClearBufferiv;
PFNGLCLEARBUFFERUIVPROC gles3wClearBufferuiv;
PFNGLCLEARBUFFERFVPROC gles3wClearBufferfv;
PFNGLCLEARBUFFERFIPROC gles3wClearBufferfi;
PFNGLGETSTRINGIPROC gles3wGetStringi;
PFNGLCOPYBUFFERSUBDATAPROC gles3wCopyBufferSubData;
PFNGLGETUNIFORMINDICESPROC gles3wGetUniformIndices;
PFNGLGETACTIVEUNIFORMSIVPROC gles3wGetActiveUniformsiv;
PFNGLGETUNIFORMBLOCKINDEXPROC gles3wGetUniformBlockIndex;
PFNGLGETACTIVEUNIFORMBLOCKIVPROC gles3wGetActiveUniformBlockiv;
PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC gles3wGetActiveUniformBlockName;
PFNGLUNIFORMBLOCKBINDINGPROC gles3wUniformBlockBinding;
PFNGLDRAWARRAYSINSTANCEDPROC gles3wDrawArraysInstanced;
PFNGLDRAWELEMENTSINSTANCEDPROC gles3wDrawElementsInstanced;
PFNGLFENCESYNCPROC gles3wFenceSync;
PFNGLISSYNCPROC gles3wIsSync;
PFNGLDELETESYNCPROC gles3wDeleteSync;
PFNGLCLIENTWAITSYNCPROC gles3wClientWaitSync;
PFNGLWAITSYNCPROC gles3wWaitSync;
PFNGLGETINTEGER64VPROC gles3wGetInteger64v;
PFNGLGETSYNCIVPROC gles3wGetSynciv;
PFNGLGETINTEGER64I_VPROC gles3wGetInteger64i_v;
PFNGLGETBUFFERPARAMETERI64VPROC gles3wGetBufferParameteri64v;
PFNGLGENSAMPLERSPROC gles3wGenSamplers;
PFNGLDELETESAMPLERSPROC gles3wDeleteSamplers;
PFNGLISSAMPLERPROC gles3wIsSampler;
PFNGLBINDSAMPLERPROC gles3wBindSampler;
PFNGLSAMPLERPARAMETERIPROC gles3wSamplerParameteri;
PFNGLSAMPLERPARAMETERIVPROC gles3wSamplerParameteriv;
PFNGLSAMPLERPARAMETERFPROC gles3wSamplerParameterf;
PFNGLSAMPLERPARAMETERFVPROC gles3wSamplerParameterfv;
PFNGLGETSAMPLERPARAMETERIVPROC gles3wGetSamplerParameteriv;
PFNGLGETSAMPLERPARAMETERFVPROC gles3wGetSamplerParameterfv;
PFNGLVERTEXATTRIBDIVISORPROC gles3wVertexAttribDivisor;
PFNGLBINDTRANSFORMFEEDBACKPROC gles3wBindTransformFeedback;
PFNGLDELETETRANSFORMFEEDBACKSPROC gles3wDeleteTransformFeedbacks;
PFNGLGENTRANSFORMFEEDBACKSPROC gles3wGenTransformFeedbacks;
PFNGLISTRANSFORMFEEDBACKPROC gles3wIsTransformFeedback;
PFNGLPAUSETRANSFORMFEEDBACKPROC gles3wPauseTransformFeedback;
PFNGLRESUMETRANSFORMFEEDBACKPROC gles3wResumeTransformFeedback;
PFNGLGETPROGRAMBINARYPROC gles3wGetProgramBinary;
PFNGLPROGRAMBINARYPROC gles3wProgramBinary;
PFNGLPROGRAMPARAMETERIPROC gles3wProgramParameteri;
PFNGLINVALIDATEFRAMEBUFFERPROC gles3wInvalidateFramebuffer;
PFNGLINVALIDATESUBFRAMEBUFFERPROC gles3wInvalidateSubFramebuffer;
PFNGLTEXSTORAGE2DPROC gles3wTexStorage2D;
PFNGLTEXSTORAGE3DPROC gles3wTexStorage3D;
PFNGLGETINTERNALFORMATIVPROC gles3wGetInternalformativ;
PFNGLUSEPROGRAMSTAGESEXTPROC gles3wUseProgramStagesEXT;
PFNGLACTIVESHADERPROGRAMEXTPROC gles3wActiveShaderProgramEXT;
PFNGLCREATESHADERPROGRAMVEXTPROC gles3wCreateShaderProgramvEXT;
PFNGLBINDPROGRAMPIPELINEEXTPROC gles3wBindProgramPipelineEXT;
PFNGLDELETEPROGRAMPIPELINESEXTPROC gles3wDeleteProgramPipelinesEXT;
PFNGLGENPROGRAMPIPELINESEXTPROC gles3wGenProgramPipelinesEXT;
PFNGLISPROGRAMPIPELINEEXTPROC gles3wIsProgramPipelineEXT;
PFNGLPROGRAMPARAMETERIEXTPROC gles3wProgramParameteriEXT;
PFNGLGETPROGRAMPIPELINEIVEXTPROC gles3wGetProgramPipelineivEXT;
PFNGLPROGRAMUNIFORM1IEXTPROC gles3wProgramUniform1iEXT;
PFNGLPROGRAMUNIFORM2IEXTPROC gles3wProgramUniform2iEXT;
PFNGLPROGRAMUNIFORM3IEXTPROC gles3wProgramUniform3iEXT;
PFNGLPROGRAMUNIFORM4IEXTPROC gles3wProgramUniform4iEXT;
PFNGLPROGRAMUNIFORM1FEXTPROC gles3wProgramUniform1fEXT;
PFNGLPROGRAMUNIFORM2FEXTPROC gles3wProgramUniform2fEXT;
PFNGLPROGRAMUNIFORM3FEXTPROC gles3wProgramUniform3fEXT;
PFNGLPROGRAMUNIFORM4FEXTPROC gles3wProgramUniform4fEXT;
PFNGLPROGRAMUNIFORM1IVEXTPROC gles3wProgramUniform1ivEXT;
PFNGLPROGRAMUNIFORM2IVEXTPROC gles3wProgramUniform2ivEXT;
PFNGLPROGRAMUNIFORM3IVEXTPROC gles3wProgramUniform3ivEXT;
PFNGLPROGRAMUNIFORM4IVEXTPROC gles3wProgramUniform4ivEXT;
PFNGLPROGRAMUNIFORM1FVEXTPROC gles3wProgramUniform1fvEXT;
PFNGLPROGRAMUNIFORM2FVEXTPROC gles3wProgramUniform2fvEXT;
PFNGLPROGRAMUNIFORM3FVEXTPROC gles3wProgramUniform3fvEXT;
PFNGLPROGRAMUNIFORM4FVEXTPROC gles3wProgramUniform4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC gles3wProgramUniformMatrix2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC gles3wProgramUniformMatrix3fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC gles3wProgramUniformMatrix4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC gles3wProgramUniformMatrix2x3fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC gles3wProgramUniformMatrix3x2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC gles3wProgramUniformMatrix2x4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC gles3wProgramUniformMatrix4x2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC gles3wProgramUniformMatrix3x4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC gles3wProgramUniformMatrix4x3fvEXT;
PFNGLVALIDATEPROGRAMPIPELINEEXTPROC gles3wValidateProgramPipelineEXT;
PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC gles3wGetProgramPipelineInfoLogEXT;
PFNGLLABELOBJECTEXTPROC gles3wLabelObjectEXT;
PFNGLGETOBJECTLABELEXTPROC gles3wGetObjectLabelEXT;
PFNGLINSERTEVENTMARKEREXTPROC gles3wInsertEventMarkerEXT;
PFNGLPUSHGROUPMARKEREXTPROC gles3wPushGroupMarkerEXT;
PFNGLPOPGROUPMARKEREXTPROC gles3wPopGroupMarkerEXT;

PFNGLDEBUGMESSAGECONTROLKHRPROC gles3wDebugMessageControlKHR;
PFNGLDEBUGMESSAGECALLBACKKHRPROC gles3wDebugMessageCallbackKHR;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC gles3wFramebufferTexture2DMultisampleEXT;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC gles3wFramebufferTexture2DMultisampleIMG;

static void load_procs(void)
{
    gles3wActiveTexture = (PFNGLACTIVETEXTUREPROC) get_proc("glActiveTexture");
    gles3wAttachShader = (PFNGLATTACHSHADERPROC) get_proc("glAttachShader");
    gles3wBindAttribLocation = (PFNGLBINDATTRIBLOCATIONPROC) get_proc("glBindAttribLocation");
    gles3wBindBuffer = (PFNGLBINDBUFFERPROC) get_proc("glBindBuffer");
    gles3wBindFramebuffer = (PFNGLBINDFRAMEBUFFERPROC) get_proc("glBindFramebuffer");
    gles3wBindRenderbuffer = (PFNGLBINDRENDERBUFFERPROC) get_proc("glBindRenderbuffer");
    gles3wBindTexture = (PFNGLBINDTEXTUREPROC) get_proc("glBindTexture");
    gles3wBlendColor = (PFNGLBLENDCOLORPROC) get_proc("glBlendColor");
    gles3wBlendEquation = (PFNGLBLENDEQUATIONPROC) get_proc("glBlendEquation");
    gles3wBlendEquationSeparate = (PFNGLBLENDEQUATIONSEPARATEPROC) get_proc("glBlendEquationSeparate");
    gles3wBlendFunc = (PFNGLBLENDFUNCPROC) get_proc("glBlendFunc");
    gles3wBlendFuncSeparate = (PFNGLBLENDFUNCSEPARATEPROC) get_proc("glBlendFuncSeparate");
    gles3wBufferData = (PFNGLBUFFERDATAPROC) get_proc("glBufferData");
    gles3wBufferSubData = (PFNGLBUFFERSUBDATAPROC) get_proc("glBufferSubData");
    gles3wCheckFramebufferStatus = (PFNGLCHECKFRAMEBUFFERSTATUSPROC) get_proc("glCheckFramebufferStatus");
    gles3wClear = (PFNGLCLEARPROC) get_proc("glClear");
    gles3wClearColor = (PFNGLCLEARCOLORPROC) get_proc("glClearColor");
    gles3wClearDepthf = (PFNGLCLEARDEPTHFPROC) get_proc("glClearDepthf");
    gles3wClearStencil = (PFNGLCLEARSTENCILPROC) get_proc("glClearStencil");
    gles3wColorMask = (PFNGLCOLORMASKPROC) get_proc("glColorMask");
    gles3wCompileShader = (PFNGLCOMPILESHADERPROC) get_proc("glCompileShader");
    gles3wCompressedTexImage2D = (PFNGLCOMPRESSEDTEXIMAGE2DPROC) get_proc("glCompressedTexImage2D");
    gles3wCompressedTexSubImage2D = (PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC) get_proc("glCompressedTexSubImage2D");
    gles3wCopyTexImage2D = (PFNGLCOPYTEXIMAGE2DPROC) get_proc("glCopyTexImage2D");
    gles3wCopyTexSubImage2D = (PFNGLCOPYTEXSUBIMAGE2DPROC) get_proc("glCopyTexSubImage2D");
    gles3wCreateProgram = (PFNGLCREATEPROGRAMPROC) get_proc("glCreateProgram");
    gles3wCreateShader = (PFNGLCREATESHADERPROC) get_proc("glCreateShader");
    gles3wCullFace = (PFNGLCULLFACEPROC) get_proc("glCullFace");
    gles3wDeleteBuffers = (PFNGLDELETEBUFFERSPROC) get_proc("glDeleteBuffers");
    gles3wDeleteFramebuffers = (PFNGLDELETEFRAMEBUFFERSPROC) get_proc("glDeleteFramebuffers");
    gles3wDeleteProgram = (PFNGLDELETEPROGRAMPROC) get_proc("glDeleteProgram");
    gles3wDeleteRenderbuffers = (PFNGLDELETERENDERBUFFERSPROC) get_proc("glDeleteRenderbuffers");
    gles3wDeleteShader = (PFNGLDELETESHADERPROC) get_proc("glDeleteShader");
    gles3wDeleteTextures = (PFNGLDELETETEXTURESPROC) get_proc("glDeleteTextures");
    gles3wDepthFunc = (PFNGLDEPTHFUNCPROC) get_proc("glDepthFunc");
    gles3wDepthMask = (PFNGLDEPTHMASKPROC) get_proc("glDepthMask");
    gles3wDepthRangef = (PFNGLDEPTHRANGEFPROC) get_proc("glDepthRangef");
    gles3wDetachShader = (PFNGLDETACHSHADERPROC) get_proc("glDetachShader");
    gles3wDisable = (PFNGLDISABLEPROC) get_proc("glDisable");
    gles3wDisableVertexAttribArray = (PFNGLDISABLEVERTEXATTRIBARRAYPROC) get_proc("glDisableVertexAttribArray");
    gles3wDrawArrays = (PFNGLDRAWARRAYSPROC) get_proc("glDrawArrays");
    gles3wDrawElements = (PFNGLDRAWELEMENTSPROC) get_proc("glDrawElements");
    gles3wEnable = (PFNGLENABLEPROC) get_proc("glEnable");
    gles3wEnableVertexAttribArray = (PFNGLENABLEVERTEXATTRIBARRAYPROC) get_proc("glEnableVertexAttribArray");
    gles3wFinish = (PFNGLFINISHPROC) get_proc("glFinish");
    gles3wFlush = (PFNGLFLUSHPROC) get_proc("glFlush");
    gles3wFramebufferRenderbuffer = (PFNGLFRAMEBUFFERRENDERBUFFERPROC) get_proc("glFramebufferRenderbuffer");
    gles3wFramebufferTexture2D = (PFNGLFRAMEBUFFERTEXTURE2DPROC) get_proc("glFramebufferTexture2D");
    gles3wFrontFace = (PFNGLFRONTFACEPROC) get_proc("glFrontFace");
    gles3wGenBuffers = (PFNGLGENBUFFERSPROC) get_proc("glGenBuffers");
    gles3wGenerateMipmap = (PFNGLGENERATEMIPMAPPROC) get_proc("glGenerateMipmap");
    gles3wGenFramebuffers = (PFNGLGENFRAMEBUFFERSPROC) get_proc("glGenFramebuffers");
    gles3wGenRenderbuffers = (PFNGLGENRENDERBUFFERSPROC) get_proc("glGenRenderbuffers");
    gles3wGenTextures = (PFNGLGENTEXTURESPROC) get_proc("glGenTextures");
    gles3wGetActiveAttrib = (PFNGLGETACTIVEATTRIBPROC) get_proc("glGetActiveAttrib");
    gles3wGetActiveUniform = (PFNGLGETACTIVEUNIFORMPROC) get_proc("glGetActiveUniform");
    gles3wGetAttachedShaders = (PFNGLGETATTACHEDSHADERSPROC) get_proc("glGetAttachedShaders");
    gles3wGetAttribLocation = (PFNGLGETATTRIBLOCATIONPROC) get_proc("glGetAttribLocation");
    gles3wGetBooleanv = (PFNGLGETBOOLEANVPROC) get_proc("glGetBooleanv");
    gles3wGetBufferParameteriv = (PFNGLGETBUFFERPARAMETERIVPROC) get_proc("glGetBufferParameteriv");
    gles3wGetError = (PFNGLGETERRORPROC) get_proc("glGetError");
    gles3wGetFloatv = (PFNGLGETFLOATVPROC) get_proc("glGetFloatv");
    gles3wGetFramebufferAttachmentParameteriv = (PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC) get_proc("glGetFramebufferAttachmentParameteriv");
    gles3wGetIntegerv = (PFNGLGETINTEGERVPROC) get_proc("glGetIntegerv");
    gles3wGetProgramiv = (PFNGLGETPROGRAMIVPROC) get_proc("glGetProgramiv");
    gles3wGetProgramInfoLog = (PFNGLGETPROGRAMINFOLOGPROC) get_proc("glGetProgramInfoLog");
    gles3wGetRenderbufferParameteriv = (PFNGLGETRENDERBUFFERPARAMETERIVPROC) get_proc("glGetRenderbufferParameteriv");
    gles3wGetShaderiv = (PFNGLGETSHADERIVPROC) get_proc("glGetShaderiv");
    gles3wGetShaderInfoLog = (PFNGLGETSHADERINFOLOGPROC) get_proc("glGetShaderInfoLog");
    gles3wGetShaderPrecisionFormat = (PFNGLGETSHADERPRECISIONFORMATPROC) get_proc("glGetShaderPrecisionFormat");
    gles3wGetShaderSource = (PFNGLGETSHADERSOURCEPROC) get_proc("glGetShaderSource");
    gles3wGetString = (PFNGLGETSTRINGPROC) get_proc("glGetString");
    gles3wGetTexParameterfv = (PFNGLGETTEXPARAMETERFVPROC) get_proc("glGetTexParameterfv");
    gles3wGetTexParameteriv = (PFNGLGETTEXPARAMETERIVPROC) get_proc("glGetTexParameteriv");
    gles3wGetUniformfv = (PFNGLGETUNIFORMFVPROC) get_proc("glGetUniformfv");
    gles3wGetUniformiv = (PFNGLGETUNIFORMIVPROC) get_proc("glGetUniformiv");
    gles3wGetUniformLocation = (PFNGLGETUNIFORMLOCATIONPROC) get_proc("glGetUniformLocation");
    gles3wGetVertexAttribfv = (PFNGLGETVERTEXATTRIBFVPROC) get_proc("glGetVertexAttribfv");
    gles3wGetVertexAttribiv = (PFNGLGETVERTEXATTRIBIVPROC) get_proc("glGetVertexAttribiv");
    gles3wGetVertexAttribPointerv = (PFNGLGETVERTEXATTRIBPOINTERVPROC) get_proc("glGetVertexAttribPointerv");
    gles3wHint = (PFNGLHINTPROC) get_proc("glHint");
    gles3wIsBuffer = (PFNGLISBUFFERPROC) get_proc("glIsBuffer");
    gles3wIsEnabled = (PFNGLISENABLEDPROC) get_proc("glIsEnabled");
    gles3wIsFramebuffer = (PFNGLISFRAMEBUFFERPROC) get_proc("glIsFramebuffer");
    gles3wIsProgram = (PFNGLISPROGRAMPROC) get_proc("glIsProgram");
    gles3wIsRenderbuffer = (PFNGLISRENDERBUFFERPROC) get_proc("glIsRenderbuffer");
    gles3wIsShader = (PFNGLISSHADERPROC) get_proc("glIsShader");
    gles3wIsTexture = (PFNGLISTEXTUREPROC) get_proc("glIsTexture");
    gles3wLineWidth = (PFNGLLINEWIDTHPROC) get_proc("glLineWidth");
    gles3wLinkProgram = (PFNGLLINKPROGRAMPROC) get_proc("glLinkProgram");
    gles3wPixelStorei = (PFNGLPIXELSTOREIPROC) get_proc("glPixelStorei");
    gles3wPolygonOffset = (PFNGLPOLYGONOFFSETPROC) get_proc("glPolygonOffset");
    gles3wReadPixels = (PFNGLREADPIXELSPROC) get_proc("glReadPixels");
    gles3wReleaseShaderCompiler = (PFNGLRELEASESHADERCOMPILERPROC) get_proc("glReleaseShaderCompiler");
    gles3wRenderbufferStorage = (PFNGLRENDERBUFFERSTORAGEPROC) get_proc("glRenderbufferStorage");
    gles3wSampleCoverage = (PFNGLSAMPLECOVERAGEPROC) get_proc("glSampleCoverage");
    gles3wScissor = (PFNGLSCISSORPROC) get_proc("glScissor");
    gles3wShaderBinary = (PFNGLSHADERBINARYPROC) get_proc("glShaderBinary");
    gles3wShaderSource = (PFNGLSHADERSOURCEPROC) get_proc("glShaderSource");
    gles3wStencilFunc = (PFNGLSTENCILFUNCPROC) get_proc("glStencilFunc");
    gles3wStencilFuncSeparate = (PFNGLSTENCILFUNCSEPARATEPROC) get_proc("glStencilFuncSeparate");
    gles3wStencilMask = (PFNGLSTENCILMASKPROC) get_proc("glStencilMask");
    gles3wStencilMaskSeparate = (PFNGLSTENCILMASKSEPARATEPROC) get_proc("glStencilMaskSeparate");
    gles3wStencilOp = (PFNGLSTENCILOPPROC) get_proc("glStencilOp");
    gles3wStencilOpSeparate = (PFNGLSTENCILOPSEPARATEPROC) get_proc("glStencilOpSeparate");
    gles3wTexImage2D = (PFNGLTEXIMAGE2DPROC) get_proc("glTexImage2D");
    gles3wTexParameterf = (PFNGLTEXPARAMETERFPROC) get_proc("glTexParameterf");
    gles3wTexParameterfv = (PFNGLTEXPARAMETERFVPROC) get_proc("glTexParameterfv");
    gles3wTexParameteri = (PFNGLTEXPARAMETERIPROC) get_proc("glTexParameteri");
    gles3wTexParameteriv = (PFNGLTEXPARAMETERIVPROC) get_proc("glTexParameteriv");
    gles3wTexSubImage2D = (PFNGLTEXSUBIMAGE2DPROC) get_proc("glTexSubImage2D");
    gles3wUniform1f = (PFNGLUNIFORM1FPROC) get_proc("glUniform1f");
    gles3wUniform1fv = (PFNGLUNIFORM1FVPROC) get_proc("glUniform1fv");
    gles3wUniform1i = (PFNGLUNIFORM1IPROC) get_proc("glUniform1i");
    gles3wUniform1iv = (PFNGLUNIFORM1IVPROC) get_proc("glUniform1iv");
    gles3wUniform2f = (PFNGLUNIFORM2FPROC) get_proc("glUniform2f");
    gles3wUniform2fv = (PFNGLUNIFORM2FVPROC) get_proc("glUniform2fv");
    gles3wUniform2i = (PFNGLUNIFORM2IPROC) get_proc("glUniform2i");
    gles3wUniform2iv = (PFNGLUNIFORM2IVPROC) get_proc("glUniform2iv");
    gles3wUniform3f = (PFNGLUNIFORM3FPROC) get_proc("glUniform3f");
    gles3wUniform3fv = (PFNGLUNIFORM3FVPROC) get_proc("glUniform3fv");
    gles3wUniform3i = (PFNGLUNIFORM3IPROC) get_proc("glUniform3i");
    gles3wUniform3iv = (PFNGLUNIFORM3IVPROC) get_proc("glUniform3iv");
    gles3wUniform4f = (PFNGLUNIFORM4FPROC) get_proc("glUniform4f");
    gles3wUniform4fv = (PFNGLUNIFORM4FVPROC) get_proc("glUniform4fv");
    gles3wUniform4i = (PFNGLUNIFORM4IPROC) get_proc("glUniform4i");
    gles3wUniform4iv = (PFNGLUNIFORM4IVPROC) get_proc("glUniform4iv");
    gles3wUniformMatrix2fv = (PFNGLUNIFORMMATRIX2FVPROC) get_proc("glUniformMatrix2fv");
    gles3wUniformMatrix3fv = (PFNGLUNIFORMMATRIX3FVPROC) get_proc("glUniformMatrix3fv");
    gles3wUniformMatrix4fv = (PFNGLUNIFORMMATRIX4FVPROC) get_proc("glUniformMatrix4fv");
    gles3wUseProgram = (PFNGLUSEPROGRAMPROC) get_proc("glUseProgram");
    gles3wValidateProgram = (PFNGLVALIDATEPROGRAMPROC) get_proc("glValidateProgram");
    gles3wVertexAttrib1f = (PFNGLVERTEXATTRIB1FPROC) get_proc("glVertexAttrib1f");
    gles3wVertexAttrib1fv = (PFNGLVERTEXATTRIB1FVPROC) get_proc("glVertexAttrib1fv");
    gles3wVertexAttrib2f = (PFNGLVERTEXATTRIB2FPROC) get_proc("glVertexAttrib2f");
    gles3wVertexAttrib2fv = (PFNGLVERTEXATTRIB2FVPROC) get_proc("glVertexAttrib2fv");
    gles3wVertexAttrib3f = (PFNGLVERTEXATTRIB3FPROC) get_proc("glVertexAttrib3f");
    gles3wVertexAttrib3fv = (PFNGLVERTEXATTRIB3FVPROC) get_proc("glVertexAttrib3fv");
    gles3wVertexAttrib4f = (PFNGLVERTEXATTRIB4FPROC) get_proc("glVertexAttrib4f");
    gles3wVertexAttrib4fv = (PFNGLVERTEXATTRIB4FVPROC) get_proc("glVertexAttrib4fv");
    gles3wVertexAttribPointer = (PFNGLVERTEXATTRIBPOINTERPROC) get_proc("glVertexAttribPointer");
    gles3wViewport = (PFNGLVIEWPORTPROC) get_proc("glViewport");
    gles3wReadBuffer = (PFNGLREADBUFFERPROC) get_proc("glReadBuffer");
    gles3wDrawRangeElements = (PFNGLDRAWRANGEELEMENTSPROC) get_proc("glDrawRangeElements");
    gles3wTexImage3D = (PFNGLTEXIMAGE3DPROC) get_proc("glTexImage3D");
    gles3wTexSubImage3D = (PFNGLTEXSUBIMAGE3DPROC) get_proc("glTexSubImage3D");
    gles3wCopyTexSubImage3D = (PFNGLCOPYTEXSUBIMAGE3DPROC) get_proc("glCopyTexSubImage3D");
    gles3wCompressedTexImage3D = (PFNGLCOMPRESSEDTEXIMAGE3DPROC) get_proc("glCompressedTexImage3D");
    gles3wCompressedTexSubImage3D = (PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC) get_proc("glCompressedTexSubImage3D");
    gles3wGenQueries = (PFNGLGENQUERIESPROC) get_proc("glGenQueries");
    gles3wDeleteQueries = (PFNGLDELETEQUERIESPROC) get_proc("glDeleteQueries");
    gles3wIsQuery = (PFNGLISQUERYPROC) get_proc("glIsQuery");
    gles3wBeginQuery = (PFNGLBEGINQUERYPROC) get_proc("glBeginQuery");
    gles3wEndQuery = (PFNGLENDQUERYPROC) get_proc("glEndQuery");
    gles3wGetQueryiv = (PFNGLGETQUERYIVPROC) get_proc("glGetQueryiv");
    gles3wGetQueryObjectuiv = (PFNGLGETQUERYOBJECTUIVPROC) get_proc("glGetQueryObjectuiv");
    gles3wUnmapBuffer = (PFNGLUNMAPBUFFERPROC) get_proc("glUnmapBuffer");
    gles3wGetBufferPointerv = (PFNGLGETBUFFERPOINTERVPROC) get_proc("glGetBufferPointerv");
    gles3wDrawBuffers = (PFNGLDRAWBUFFERSPROC) get_proc("glDrawBuffers");
    gles3wUniformMatrix2x3fv = (PFNGLUNIFORMMATRIX2X3FVPROC) get_proc("glUniformMatrix2x3fv");
    gles3wUniformMatrix3x2fv = (PFNGLUNIFORMMATRIX3X2FVPROC) get_proc("glUniformMatrix3x2fv");
    gles3wUniformMatrix2x4fv = (PFNGLUNIFORMMATRIX2X4FVPROC) get_proc("glUniformMatrix2x4fv");
    gles3wUniformMatrix4x2fv = (PFNGLUNIFORMMATRIX4X2FVPROC) get_proc("glUniformMatrix4x2fv");
    gles3wUniformMatrix3x4fv = (PFNGLUNIFORMMATRIX3X4FVPROC) get_proc("glUniformMatrix3x4fv");
    gles3wUniformMatrix4x3fv = (PFNGLUNIFORMMATRIX4X3FVPROC) get_proc("glUniformMatrix4x3fv");
    gles3wBlitFramebuffer = (PFNGLBLITFRAMEBUFFERPROC) get_proc("glBlitFramebuffer");
    gles3wRenderbufferStorageMultisample = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC) get_proc("glRenderbufferStorageMultisample");
    gles3wFramebufferTextureLayer = (PFNGLFRAMEBUFFERTEXTURELAYERPROC) get_proc("glFramebufferTextureLayer");
    gles3wMapBufferRange = (PFNGLMAPBUFFERRANGEPROC) get_proc("glMapBufferRange");
    gles3wFlushMappedBufferRange = (PFNGLFLUSHMAPPEDBUFFERRANGEPROC) get_proc("glFlushMappedBufferRange");
    gles3wBindVertexArray = (PFNGLBINDVERTEXARRAYPROC) get_proc("glBindVertexArray");
    gles3wDeleteVertexArrays = (PFNGLDELETEVERTEXARRAYSPROC) get_proc("glDeleteVertexArrays");
    gles3wGenVertexArrays = (PFNGLGENVERTEXARRAYSPROC) get_proc("glGenVertexArrays");
    gles3wIsVertexArray = (PFNGLISVERTEXARRAYPROC) get_proc("glIsVertexArray");
    gles3wGetIntegeri_v = (PFNGLGETINTEGERI_VPROC) get_proc("glGetIntegeri_v");
    gles3wBeginTransformFeedback = (PFNGLBEGINTRANSFORMFEEDBACKPROC) get_proc("glBeginTransformFeedback");
    gles3wEndTransformFeedback = (PFNGLENDTRANSFORMFEEDBACKPROC) get_proc("glEndTransformFeedback");
    gles3wBindBufferRange = (PFNGLBINDBUFFERRANGEPROC) get_proc("glBindBufferRange");
    gles3wBindBufferBase = (PFNGLBINDBUFFERBASEPROC) get_proc("glBindBufferBase");
    gles3wTransformFeedbackVaryings = (PFNGLTRANSFORMFEEDBACKVARYINGSPROC) get_proc("glTransformFeedbackVaryings");
    gles3wGetTransformFeedbackVarying = (PFNGLGETTRANSFORMFEEDBACKVARYINGPROC) get_proc("glGetTransformFeedbackVarying");
    gles3wVertexAttribIPointer = (PFNGLVERTEXATTRIBIPOINTERPROC) get_proc("glVertexAttribIPointer");
    gles3wGetVertexAttribIiv = (PFNGLGETVERTEXATTRIBIIVPROC) get_proc("glGetVertexAttribIiv");
    gles3wGetVertexAttribIuiv = (PFNGLGETVERTEXATTRIBIUIVPROC) get_proc("glGetVertexAttribIuiv");
    gles3wVertexAttribI4i = (PFNGLVERTEXATTRIBI4IPROC) get_proc("glVertexAttribI4i");
    gles3wVertexAttribI4ui = (PFNGLVERTEXATTRIBI4UIPROC) get_proc("glVertexAttribI4ui");
    gles3wVertexAttribI4iv = (PFNGLVERTEXATTRIBI4IVPROC) get_proc("glVertexAttribI4iv");
    gles3wVertexAttribI4uiv = (PFNGLVERTEXATTRIBI4UIVPROC) get_proc("glVertexAttribI4uiv");
    gles3wGetUniformuiv = (PFNGLGETUNIFORMUIVPROC) get_proc("glGetUniformuiv");
    gles3wGetFragDataLocation = (PFNGLGETFRAGDATALOCATIONPROC) get_proc("glGetFragDataLocation");
    gles3wUniform1ui = (PFNGLUNIFORM1UIPROC) get_proc("glUniform1ui");
    gles3wUniform2ui = (PFNGLUNIFORM2UIPROC) get_proc("glUniform2ui");
    gles3wUniform3ui = (PFNGLUNIFORM3UIPROC) get_proc("glUniform3ui");
    gles3wUniform4ui = (PFNGLUNIFORM4UIPROC) get_proc("glUniform4ui");
    gles3wUniform1uiv = (PFNGLUNIFORM1UIVPROC) get_proc("glUniform1uiv");
    gles3wUniform2uiv = (PFNGLUNIFORM2UIVPROC) get_proc("glUniform2uiv");
    gles3wUniform3uiv = (PFNGLUNIFORM3UIVPROC) get_proc("glUniform3uiv");
    gles3wUniform4uiv = (PFNGLUNIFORM4UIVPROC) get_proc("glUniform4uiv");
    gles3wClearBufferiv = (PFNGLCLEARBUFFERIVPROC) get_proc("glClearBufferiv");
    gles3wClearBufferuiv = (PFNGLCLEARBUFFERUIVPROC) get_proc("glClearBufferuiv");
    gles3wClearBufferfv = (PFNGLCLEARBUFFERFVPROC) get_proc("glClearBufferfv");
    gles3wClearBufferfi = (PFNGLCLEARBUFFERFIPROC) get_proc("glClearBufferfi");
    gles3wGetStringi = (PFNGLGETSTRINGIPROC) get_proc("glGetStringi");
    gles3wCopyBufferSubData = (PFNGLCOPYBUFFERSUBDATAPROC) get_proc("glCopyBufferSubData");
    gles3wGetUniformIndices = (PFNGLGETUNIFORMINDICESPROC) get_proc("glGetUniformIndices");
    gles3wGetActiveUniformsiv = (PFNGLGETACTIVEUNIFORMSIVPROC) get_proc("glGetActiveUniformsiv");
    gles3wGetUniformBlockIndex = (PFNGLGETUNIFORMBLOCKINDEXPROC) get_proc("glGetUniformBlockIndex");
    gles3wGetActiveUniformBlockiv = (PFNGLGETACTIVEUNIFORMBLOCKIVPROC) get_proc("glGetActiveUniformBlockiv");
    gles3wGetActiveUniformBlockName = (PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC) get_proc("glGetActiveUniformBlockName");
    gles3wUniformBlockBinding = (PFNGLUNIFORMBLOCKBINDINGPROC) get_proc("glUniformBlockBinding");
    gles3wDrawArraysInstanced = (PFNGLDRAWARRAYSINSTANCEDPROC) get_proc("glDrawArraysInstanced");
    gles3wDrawElementsInstanced = (PFNGLDRAWELEMENTSINSTANCEDPROC) get_proc("glDrawElementsInstanced");
    gles3wFenceSync = (PFNGLFENCESYNCPROC) get_proc("glFenceSync");
    gles3wIsSync = (PFNGLISSYNCPROC) get_proc("glIsSync");
    gles3wDeleteSync = (PFNGLDELETESYNCPROC) get_proc("glDeleteSync");
    gles3wClientWaitSync = (PFNGLCLIENTWAITSYNCPROC) get_proc("glClientWaitSync");
    gles3wWaitSync = (PFNGLWAITSYNCPROC) get_proc("glWaitSync");
    gles3wGetInteger64v = (PFNGLGETINTEGER64VPROC) get_proc("glGetInteger64v");
    gles3wGetSynciv = (PFNGLGETSYNCIVPROC) get_proc("glGetSynciv");
    gles3wGetInteger64i_v = (PFNGLGETINTEGER64I_VPROC) get_proc("glGetInteger64i_v");
    gles3wGetBufferParameteri64v = (PFNGLGETBUFFERPARAMETERI64VPROC) get_proc("glGetBufferParameteri64v");
    gles3wGenSamplers = (PFNGLGENSAMPLERSPROC) get_proc("glGenSamplers");
    gles3wDeleteSamplers = (PFNGLDELETESAMPLERSPROC) get_proc("glDeleteSamplers");
    gles3wIsSampler = (PFNGLISSAMPLERPROC) get_proc("glIsSampler");
    gles3wBindSampler = (PFNGLBINDSAMPLERPROC) get_proc("glBindSampler");
    gles3wSamplerParameteri = (PFNGLSAMPLERPARAMETERIPROC) get_proc("glSamplerParameteri");
    gles3wSamplerParameteriv = (PFNGLSAMPLERPARAMETERIVPROC) get_proc("glSamplerParameteriv");
    gles3wSamplerParameterf = (PFNGLSAMPLERPARAMETERFPROC) get_proc("glSamplerParameterf");
    gles3wSamplerParameterfv = (PFNGLSAMPLERPARAMETERFVPROC) get_proc("glSamplerParameterfv");
    gles3wGetSamplerParameteriv = (PFNGLGETSAMPLERPARAMETERIVPROC) get_proc("glGetSamplerParameteriv");
    gles3wGetSamplerParameterfv = (PFNGLGETSAMPLERPARAMETERFVPROC) get_proc("glGetSamplerParameterfv");
    gles3wVertexAttribDivisor = (PFNGLVERTEXATTRIBDIVISORPROC) get_proc("glVertexAttribDivisor");
    gles3wBindTransformFeedback = (PFNGLBINDTRANSFORMFEEDBACKPROC) get_proc("glBindTransformFeedback");
    gles3wDeleteTransformFeedbacks = (PFNGLDELETETRANSFORMFEEDBACKSPROC) get_proc("glDeleteTransformFeedbacks");
    gles3wGenTransformFeedbacks = (PFNGLGENTRANSFORMFEEDBACKSPROC) get_proc("glGenTransformFeedbacks");
    gles3wIsTransformFeedback = (PFNGLISTRANSFORMFEEDBACKPROC) get_proc("glIsTransformFeedback");
    gles3wPauseTransformFeedback = (PFNGLPAUSETRANSFORMFEEDBACKPROC) get_proc("glPauseTransformFeedback");
    gles3wResumeTransformFeedback = (PFNGLRESUMETRANSFORMFEEDBACKPROC) get_proc("glResumeTransformFeedback");
    gles3wGetProgramBinary = (PFNGLGETPROGRAMBINARYPROC) get_proc("glGetProgramBinary");
    gles3wProgramBinary = (PFNGLPROGRAMBINARYPROC) get_proc("glProgramBinary");
    gles3wProgramParameteri = (PFNGLPROGRAMPARAMETERIPROC) get_proc("glProgramParameteri");
    gles3wInvalidateFramebuffer = (PFNGLINVALIDATEFRAMEBUFFERPROC) get_proc("glInvalidateFramebuffer");
    gles3wInvalidateSubFramebuffer = (PFNGLINVALIDATESUBFRAMEBUFFERPROC) get_proc("glInvalidateSubFramebuffer");
    gles3wTexStorage2D = (PFNGLTEXSTORAGE2DPROC) get_proc("glTexStorage2D");
    gles3wTexStorage3D = (PFNGLTEXSTORAGE3DPROC) get_proc("glTexStorage3D");
    gles3wGetInternalformativ = (PFNGLGETINTERNALFORMATIVPROC) get_proc("glGetInternalformativ");
    gles3wLabelObjectEXT = (PFNGLLABELOBJECTEXTPROC) get_proc("glLabelObjectEXT");
    gles3wGetObjectLabelEXT = (PFNGLGETOBJECTLABELEXTPROC) get_proc("glGetObjectLabelEXT");
    gles3wInsertEventMarkerEXT = (PFNGLINSERTEVENTMARKEREXTPROC) get_proc("glInsertEventMarkerEXT");
    gles3wPushGroupMarkerEXT = (PFNGLPUSHGROUPMARKEREXTPROC) get_proc("glPushGroupMarkerEXT");
    gles3wPopGroupMarkerEXT = (PFNGLPOPGROUPMARKEREXTPROC) get_proc("glPopGroupMarkerEXT");
    gles3wUseProgramStagesEXT = (PFNGLUSEPROGRAMSTAGESEXTPROC) get_proc("glUseProgramStagesEXT");
    gles3wActiveShaderProgramEXT = (PFNGLACTIVESHADERPROGRAMEXTPROC) get_proc("glActiveShaderProgramEXT");
    gles3wCreateShaderProgramvEXT = (PFNGLCREATESHADERPROGRAMVEXTPROC) get_proc("glCreateShaderProgramvEXT");
    gles3wBindProgramPipelineEXT = (PFNGLBINDPROGRAMPIPELINEEXTPROC) get_proc("glBindProgramPipelineEXT");
    gles3wDeleteProgramPipelinesEXT = (PFNGLDELETEPROGRAMPIPELINESEXTPROC) get_proc("glDeleteProgramPipelinesEXT");
    gles3wGenProgramPipelinesEXT = (PFNGLGENPROGRAMPIPELINESEXTPROC) get_proc("glGenProgramPipelinesEXT");
    gles3wIsProgramPipelineEXT = (PFNGLISPROGRAMPIPELINEEXTPROC) get_proc("glIsProgramPipelineEXT");
    gles3wProgramParameteriEXT = (PFNGLPROGRAMPARAMETERIEXTPROC) get_proc("glProgramParameteriEXT");
    gles3wGetProgramPipelineivEXT = (PFNGLGETPROGRAMPIPELINEIVEXTPROC) get_proc("glGetProgramPipelineivEXT");
    gles3wProgramUniform1iEXT = (PFNGLPROGRAMUNIFORM1IEXTPROC) get_proc("glProgramUniform1iEXT");
    gles3wProgramUniform2iEXT = (PFNGLPROGRAMUNIFORM2IEXTPROC) get_proc("glProgramUniform2iEXT");
    gles3wProgramUniform3iEXT = (PFNGLPROGRAMUNIFORM3IEXTPROC) get_proc("glProgramUniform3iEXT");
    gles3wProgramUniform4iEXT = (PFNGLPROGRAMUNIFORM4IEXTPROC) get_proc("glProgramUniform4iEXT");
    gles3wProgramUniform1fEXT = (PFNGLPROGRAMUNIFORM1FEXTPROC) get_proc("glProgramUniform1fEXT");
    gles3wProgramUniform2fEXT = (PFNGLPROGRAMUNIFORM2FEXTPROC) get_proc("glProgramUniform2fEXT");
    gles3wProgramUniform3fEXT = (PFNGLPROGRAMUNIFORM3FEXTPROC) get_proc("glProgramUniform3fEXT");
    gles3wProgramUniform4fEXT = (PFNGLPROGRAMUNIFORM4FEXTPROC) get_proc("glProgramUniform4fEXT");
    gles3wProgramUniform1ivEXT = (PFNGLPROGRAMUNIFORM1IVEXTPROC) get_proc("glProgramUniform1ivEXT");
    gles3wProgramUniform2ivEXT = (PFNGLPROGRAMUNIFORM2IVEXTPROC) get_proc("glProgramUniform2ivEXT");
    gles3wProgramUniform3ivEXT = (PFNGLPROGRAMUNIFORM3IVEXTPROC) get_proc("glProgramUniform3ivEXT");
    gles3wProgramUniform4ivEXT = (PFNGLPROGRAMUNIFORM4IVEXTPROC) get_proc("glProgramUniform4ivEXT");
    gles3wProgramUniform1fvEXT = (PFNGLPROGRAMUNIFORM1FVEXTPROC) get_proc("glProgramUniform1fvEXT");
    gles3wProgramUniform2fvEXT = (PFNGLPROGRAMUNIFORM2FVEXTPROC) get_proc("glProgramUniform2fvEXT");
    gles3wProgramUniform3fvEXT = (PFNGLPROGRAMUNIFORM3FVEXTPROC) get_proc("glProgramUniform3fvEXT");
    gles3wProgramUniform4fvEXT = (PFNGLPROGRAMUNIFORM4FVEXTPROC) get_proc("glProgramUniform4fvEXT");
    gles3wProgramUniformMatrix2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC) get_proc("glProgramUniformMatrix2fvEXT");
    gles3wProgramUniformMatrix3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC) get_proc("glProgramUniformMatrix3fvEXT");
    gles3wProgramUniformMatrix4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC) get_proc("glProgramUniformMatrix4fvEXT");
    gles3wProgramUniformMatrix2x3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC) get_proc("glProgramUniformMatrix2x3fvEXT");
    gles3wProgramUniformMatrix4x2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC) get_proc("glProgramUniformMatrix3x2fvEXT");
    gles3wProgramUniformMatrix2x4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC) get_proc("glProgramUniformMatrix2x4fvEXT");
    gles3wProgramUniformMatrix4x2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC) get_proc("glProgramUniformMatrix4x2fvEXT");
    gles3wProgramUniformMatrix3x4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC) get_proc("glProgramUniformMatrix3x4fvEXT");
    gles3wProgramUniformMatrix4x3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC) get_proc("glProgramUniformMatrix4x3fvEXT");
    gles3wValidateProgramPipelineEXT = (PFNGLVALIDATEPROGRAMPIPELINEEXTPROC) get_proc("glValidateProgramPipelineEXT");
    gles3wGetProgramPipelineInfoLogEXT = (PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC) get_proc("glGetProgramPipelineInfoLogEXT");

	gles3wDebugMessageControlKHR = (PFNGLDEBUGMESSAGECONTROLKHRPROC)get_proc("glDebugMessageControlKHR");
	gles3wDebugMessageCallbackKHR = (PFNGLDEBUGMESSAGECALLBACKKHRPROC)get_proc("glDebugMessageCallbackKHR");
	gles3wFramebufferTexture2DMultisampleEXT = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC)get_proc("glFramebufferTexture2DMultisampleEXT");
	gles3wFramebufferTexture2DMultisampleIMG = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC)get_proc("glFramebufferTexture2DMultisampleIMG");
}
