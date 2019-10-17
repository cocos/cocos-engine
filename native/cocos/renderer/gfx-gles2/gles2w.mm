#include "gles2w.h"

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
#import <CoreFoundation/CoreFoundation.h>
#import <UIKit/UIDevice.h>
#import <string>
#import <iostream>
#import <stdio.h>

// Routine to run a system command and retrieve the output.
// From http://stackoverflow.com/questions/478898/how-to-execute-a-command-and-get-output-of-command-within-c
std::string ES2_EXEC(const char* cmd) {
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

static CFBundleRef g_es2Bundle;
static CFURLRef g_es2BundleURL;

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

    g_es2BundleURL = CFURLCreateWithFileSystemPath(kCFAllocatorDefault,
                                              frameworkPath,
                                              kCFURLPOSIXPathStyle, true);

    CFRelease(frameworkPath);

    g_es2Bundle = CFBundleCreate(kCFAllocatorDefault, g_es2BundleURL);

    return (g_es2Bundle != NULL);
}

static void close_libgl(void)
{
    CFRelease(g_es2Bundle);
    CFRelease(g_es2BundleURL);
}

static void *get_proc(const char *proc)
{
    void *res;

    CFStringRef procname = CFStringCreateWithCString(kCFAllocatorDefault, proc,
                                                     kCFStringEncodingASCII);
    res = CFBundleGetFunctionPointerForName(g_es2Bundle, procname);
    CFRelease(procname);
    return res;
}
#elif defined(__EMSCRIPTEN__)
#include <EGL/egl.h>
static void open_libgl() {}
static void close_libgl() {}
static void *get_proc(const char *proc)
{
    return (void*)eglGetProcAddress(proc);
}
#else
#include <dlfcn.h>
#include <EGL/egl.h>

static void *libgl;

static int open_libgl(void)
{
    libgl = dlopen("libGLESv2.so", RTLD_LAZY | RTLD_GLOBAL);
	return libgl != NULL;
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
    version.major = 2;
    version.minor = 0;

    return 0;
}

static void load_procs(void);

int gles2wInit(void)
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

int gles2wIsSupported(int major, int minor)
{
    if (major < 2)
        return 0;
    if (version.major == major)
        return version.minor >= minor;
    return version.major >= major;
}

void *gles2wGetProcAddress(const char *proc)
{
    return get_proc(proc);
}

PFNGLACTIVETEXTUREPROC gles2wActiveTexture;
PFNGLATTACHSHADERPROC gles2wAttachShader;
PFNGLBINDATTRIBLOCATIONPROC gles2wBindAttribLocation;
PFNGLBINDBUFFERPROC gles2wBindBuffer;
PFNGLBINDFRAMEBUFFERPROC gles2wBindFramebuffer;
PFNGLBINDRENDERBUFFERPROC gles2wBindRenderbuffer;
PFNGLBINDTEXTUREPROC gles2wBindTexture;
PFNGLBLENDCOLORPROC gles2wBlendColor;
PFNGLBLENDEQUATIONPROC gles2wBlendEquation;
PFNGLBLENDEQUATIONSEPARATEPROC gles2wBlendEquationSeparate;
PFNGLBLENDFUNCPROC gles2wBlendFunc;
PFNGLBLENDFUNCSEPARATEPROC gles2wBlendFuncSeparate;
PFNGLBUFFERDATAPROC gles2wBufferData;
PFNGLBUFFERSUBDATAPROC gles2wBufferSubData;
PFNGLCHECKFRAMEBUFFERSTATUSPROC gles2wCheckFramebufferStatus;
PFNGLCLEARPROC gles2wClear;
PFNGLCLEARCOLORPROC gles2wClearColor;
PFNGLCLEARDEPTHFPROC gles2wClearDepthf;
PFNGLCLEARSTENCILPROC gles2wClearStencil;
PFNGLCOLORMASKPROC gles2wColorMask;
PFNGLCOMPILESHADERPROC gles2wCompileShader;
PFNGLCOMPRESSEDTEXIMAGE2DPROC gles2wCompressedTexImage2D;
PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC gles2wCompressedTexSubImage2D;
PFNGLCOPYTEXIMAGE2DPROC gles2wCopyTexImage2D;
PFNGLCOPYTEXSUBIMAGE2DPROC gles2wCopyTexSubImage2D;
PFNGLCREATEPROGRAMPROC gles2wCreateProgram;
PFNGLCREATESHADERPROC gles2wCreateShader;
PFNGLCULLFACEPROC gles2wCullFace;
PFNGLDELETEBUFFERSPROC gles2wDeleteBuffers;
PFNGLDELETEFRAMEBUFFERSPROC gles2wDeleteFramebuffers;
PFNGLDELETEPROGRAMPROC gles2wDeleteProgram;
PFNGLDELETERENDERBUFFERSPROC gles2wDeleteRenderbuffers;
PFNGLDELETESHADERPROC gles2wDeleteShader;
PFNGLDELETETEXTURESPROC gles2wDeleteTextures;
PFNGLDEPTHFUNCPROC gles2wDepthFunc;
PFNGLDEPTHMASKPROC gles2wDepthMask;
PFNGLDEPTHRANGEFPROC gles2wDepthRangef;
PFNGLDETACHSHADERPROC gles2wDetachShader;
PFNGLDISABLEPROC gles2wDisable;
PFNGLDISABLEVERTEXATTRIBARRAYPROC gles2wDisableVertexAttribArray;
PFNGLDRAWARRAYSPROC gles2wDrawArrays;
PFNGLDRAWELEMENTSPROC gles2wDrawElements;
PFNGLENABLEPROC gles2wEnable;
PFNGLENABLEVERTEXATTRIBARRAYPROC gles2wEnableVertexAttribArray;
PFNGLFINISHPROC gles2wFinish;
PFNGLFLUSHPROC gles2wFlush;
PFNGLFRAMEBUFFERRENDERBUFFERPROC gles2wFramebufferRenderbuffer;
PFNGLFRAMEBUFFERTEXTURE2DPROC gles2wFramebufferTexture2D;
PFNGLFRONTFACEPROC gles2wFrontFace;
PFNGLGENBUFFERSPROC gles2wGenBuffers;
PFNGLGENERATEMIPMAPPROC gles2wGenerateMipmap;
PFNGLGENFRAMEBUFFERSPROC gles2wGenFramebuffers;
PFNGLGENRENDERBUFFERSPROC gles2wGenRenderbuffers;
PFNGLGENTEXTURESPROC gles2wGenTextures;
PFNGLGETACTIVEATTRIBPROC gles2wGetActiveAttrib;
PFNGLGETACTIVEUNIFORMPROC gles2wGetActiveUniform;
PFNGLGETATTACHEDSHADERSPROC gles2wGetAttachedShaders;
PFNGLGETATTRIBLOCATIONPROC gles2wGetAttribLocation;
PFNGLGETBOOLEANVPROC gles2wGetBooleanv;
PFNGLGETBUFFERPARAMETERIVPROC gles2wGetBufferParameteriv;
PFNGLGETERRORPROC gles2wGetError;
PFNGLGETFLOATVPROC gles2wGetFloatv;
PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC gles2wGetFramebufferAttachmentParameteriv;
PFNGLGETINTEGERVPROC gles2wGetIntegerv;
PFNGLGETPROGRAMIVPROC gles2wGetProgramiv;
PFNGLGETPROGRAMINFOLOGPROC gles2wGetProgramInfoLog;
PFNGLGETRENDERBUFFERPARAMETERIVPROC gles2wGetRenderbufferParameteriv;
PFNGLGETSHADERIVPROC gles2wGetShaderiv;
PFNGLGETSHADERINFOLOGPROC gles2wGetShaderInfoLog;
PFNGLGETSHADERPRECISIONFORMATPROC gles2wGetShaderPrecisionFormat;
PFNGLGETSHADERSOURCEPROC gles2wGetShaderSource;
PFNGLGETSTRINGPROC gles2wGetString;
PFNGLGETTEXPARAMETERFVPROC gles2wGetTexParameterfv;
PFNGLGETTEXPARAMETERIVPROC gles2wGetTexParameteriv;
PFNGLGETUNIFORMFVPROC gles2wGetUniformfv;
PFNGLGETUNIFORMIVPROC gles2wGetUniformiv;
PFNGLGETUNIFORMLOCATIONPROC gles2wGetUniformLocation;
PFNGLGETVERTEXATTRIBFVPROC gles2wGetVertexAttribfv;
PFNGLGETVERTEXATTRIBIVPROC gles2wGetVertexAttribiv;
PFNGLGETVERTEXATTRIBPOINTERVPROC gles2wGetVertexAttribPointerv;
PFNGLHINTPROC gles2wHint;
PFNGLISBUFFERPROC gles2wIsBuffer;
PFNGLISENABLEDPROC gles2wIsEnabled;
PFNGLISFRAMEBUFFERPROC gles2wIsFramebuffer;
PFNGLISPROGRAMPROC gles2wIsProgram;
PFNGLISRENDERBUFFERPROC gles2wIsRenderbuffer;
PFNGLISSHADERPROC gles2wIsShader;
PFNGLISTEXTUREPROC gles2wIsTexture;
PFNGLLINEWIDTHPROC gles2wLineWidth;
PFNGLLINKPROGRAMPROC gles2wLinkProgram;
PFNGLPIXELSTOREIPROC gles2wPixelStorei;
PFNGLPOLYGONOFFSETPROC gles2wPolygonOffset;
PFNGLREADPIXELSPROC gles2wReadPixels;
PFNGLRELEASESHADERCOMPILERPROC gles2wReleaseShaderCompiler;
PFNGLRENDERBUFFERSTORAGEPROC gles2wRenderbufferStorage;
PFNGLSAMPLECOVERAGEPROC gles2wSampleCoverage;
PFNGLSCISSORPROC gles2wScissor;
PFNGLSHADERBINARYPROC gles2wShaderBinary;
PFNGLSHADERSOURCEPROC gles2wShaderSource;
PFNGLSTENCILFUNCPROC gles2wStencilFunc;
PFNGLSTENCILFUNCSEPARATEPROC gles2wStencilFuncSeparate;
PFNGLSTENCILMASKPROC gles2wStencilMask;
PFNGLSTENCILMASKSEPARATEPROC gles2wStencilMaskSeparate;
PFNGLSTENCILOPPROC gles2wStencilOp;
PFNGLSTENCILOPSEPARATEPROC gles2wStencilOpSeparate;
PFNGLTEXIMAGE2DPROC gles2wTexImage2D;
PFNGLTEXPARAMETERFPROC gles2wTexParameterf;
PFNGLTEXPARAMETERFVPROC gles2wTexParameterfv;
PFNGLTEXPARAMETERIPROC gles2wTexParameteri;
PFNGLTEXPARAMETERIVPROC gles2wTexParameteriv;
PFNGLTEXSUBIMAGE2DPROC gles2wTexSubImage2D;
PFNGLUNIFORM1FPROC gles2wUniform1f;
PFNGLUNIFORM1FVPROC gles2wUniform1fv;
PFNGLUNIFORM1IPROC gles2wUniform1i;
PFNGLUNIFORM1IVPROC gles2wUniform1iv;
PFNGLUNIFORM2FPROC gles2wUniform2f;
PFNGLUNIFORM2FVPROC gles2wUniform2fv;
PFNGLUNIFORM2IPROC gles2wUniform2i;
PFNGLUNIFORM2IVPROC gles2wUniform2iv;
PFNGLUNIFORM3FPROC gles2wUniform3f;
PFNGLUNIFORM3FVPROC gles2wUniform3fv;
PFNGLUNIFORM3IPROC gles2wUniform3i;
PFNGLUNIFORM3IVPROC gles2wUniform3iv;
PFNGLUNIFORM4FPROC gles2wUniform4f;
PFNGLUNIFORM4FVPROC gles2wUniform4fv;
PFNGLUNIFORM4IPROC gles2wUniform4i;
PFNGLUNIFORM4IVPROC gles2wUniform4iv;
PFNGLUNIFORMMATRIX2FVPROC gles2wUniformMatrix2fv;
PFNGLUNIFORMMATRIX3FVPROC gles2wUniformMatrix3fv;
PFNGLUNIFORMMATRIX4FVPROC gles2wUniformMatrix4fv;
PFNGLUSEPROGRAMPROC gles2wUseProgram;
PFNGLVALIDATEPROGRAMPROC gles2wValidateProgram;
PFNGLVERTEXATTRIB1FPROC gles2wVertexAttrib1f;
PFNGLVERTEXATTRIB1FVPROC gles2wVertexAttrib1fv;
PFNGLVERTEXATTRIB2FPROC gles2wVertexAttrib2f;
PFNGLVERTEXATTRIB2FVPROC gles2wVertexAttrib2fv;
PFNGLVERTEXATTRIB3FPROC gles2wVertexAttrib3f;
PFNGLVERTEXATTRIB3FVPROC gles2wVertexAttrib3fv;
PFNGLVERTEXATTRIB4FPROC gles2wVertexAttrib4f;
PFNGLVERTEXATTRIB4FVPROC gles2wVertexAttrib4fv;
PFNGLVERTEXATTRIBPOINTERPROC gles2wVertexAttribPointer;
PFNGLVIEWPORTPROC gles2wViewport;
PFNGLEGLIMAGETARGETTEXTURE2DOESPROC gles2wEGLImageTargetTexture2DOES;
PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC gles2wEGLImageTargetRenderbufferStorageOES;
PFNGLGETPROGRAMBINARYOESPROC gles2wGetProgramBinaryOES;
PFNGLPROGRAMBINARYOESPROC gles2wProgramBinaryOES;
PFNGLMAPBUFFEROESPROC gles2wMapBufferOES;
PFNGLUNMAPBUFFEROESPROC gles2wUnmapBufferOES;
PFNGLGETBUFFERPOINTERVOESPROC gles2wGetBufferPointervOES;
PFNGLTEXIMAGE3DOESPROC gles2wTexImage3DOES;
PFNGLTEXSUBIMAGE3DOESPROC gles2wTexSubImage3DOES;
PFNGLCOPYTEXSUBIMAGE3DOESPROC gles2wCopyTexSubImage3DOES;
PFNGLCOMPRESSEDTEXIMAGE3DOESPROC gles2wCompressedTexImage3DOES;
PFNGLCOMPRESSEDTEXSUBIMAGE3DOESPROC gles2wCompressedTexSubImage3DOES;
PFNGLFRAMEBUFFERTEXTURE3DOESPROC gles2wFramebufferTexture3DOES;
PFNGLBINDVERTEXARRAYOESPROC gles2wBindVertexArrayOES;
PFNGLDELETEVERTEXARRAYSOESPROC gles2wDeleteVertexArraysOES;
PFNGLGENVERTEXARRAYSOESPROC gles2wGenVertexArraysOES;
PFNGLISVERTEXARRAYOESPROC gles2wIsVertexArrayOES;
PFNGLDEBUGMESSAGECONTROLKHRPROC gles2wDebugMessageControlKHR;
PFNGLDEBUGMESSAGEINSERTKHRPROC gles2wDebugMessageInsertKHR;
PFNGLDEBUGMESSAGECALLBACKKHRPROC gles2wDebugMessageCallbackKHR;
PFNGLGETDEBUGMESSAGELOGKHRPROC gles2wGetDebugMessageLogKHR;
PFNGLPUSHDEBUGGROUPKHRPROC gles2wPushDebugGroupKHR;
PFNGLPOPDEBUGGROUPKHRPROC gles2wPopDebugGroupKHR;
PFNGLOBJECTLABELKHRPROC gles2wObjectLabelKHR;
PFNGLGETOBJECTLABELKHRPROC gles2wGetObjectLabelKHR;
PFNGLOBJECTPTRLABELKHRPROC gles2wObjectPtrLabelKHR;
PFNGLGETOBJECTPTRLABELKHRPROC gles2wGetObjectPtrLabelKHR;
PFNGLGETPOINTERVKHRPROC gles2wGetPointervKHR;
PFNGLGETPERFMONITORGROUPSAMDPROC gles2wGetPerfMonitorGroupsAMD;
PFNGLGETPERFMONITORCOUNTERSAMDPROC gles2wGetPerfMonitorCountersAMD;
PFNGLGETPERFMONITORGROUPSTRINGAMDPROC gles2wGetPerfMonitorGroupStringAMD;
PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC gles2wGetPerfMonitorCounterStringAMD;
PFNGLGETPERFMONITORCOUNTERINFOAMDPROC gles2wGetPerfMonitorCounterInfoAMD;
PFNGLGENPERFMONITORSAMDPROC gles2wGenPerfMonitorsAMD;
PFNGLDELETEPERFMONITORSAMDPROC gles2wDeletePerfMonitorsAMD;
PFNGLSELECTPERFMONITORCOUNTERSAMDPROC gles2wSelectPerfMonitorCountersAMD;
PFNGLBEGINPERFMONITORAMDPROC gles2wBeginPerfMonitorAMD;
PFNGLENDPERFMONITORAMDPROC gles2wEndPerfMonitorAMD;
PFNGLGETPERFMONITORCOUNTERDATAAMDPROC gles2wGetPerfMonitorCounterDataAMD;
PFNGLBLITFRAMEBUFFERANGLEPROC gles2wBlitFramebufferANGLE;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEANGLEPROC gles2wRenderbufferStorageMultisampleANGLE;
PFNGLDRAWARRAYSINSTANCEDANGLEPROC gles2wDrawArraysInstancedANGLE;
PFNGLDRAWELEMENTSINSTANCEDANGLEPROC gles2wDrawElementsInstancedANGLE;
PFNGLVERTEXATTRIBDIVISORANGLEPROC gles2wVertexAttribDivisorANGLE;
PFNGLGETTRANSLATEDSHADERSOURCEANGLEPROC gles2wGetTranslatedShaderSourceANGLE;
PFNGLDRAWARRAYSINSTANCEDEXTPROC gles2wDrawArraysInstancedEXT;
PFNGLDRAWELEMENTSINSTANCEDEXTPROC gles2wDrawElementsInstancedEXT;
PFNGLVERTEXATTRIBDIVISOREXTPROC gles2wVertexAttribDivisorEXT;
PFNGLCOPYTEXTURELEVELSAPPLEPROC gles2wCopyTextureLevelsAPPLE;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEAPPLEPROC gles2wRenderbufferStorageMultisampleAPPLE;
PFNGLRESOLVEMULTISAMPLEFRAMEBUFFERAPPLEPROC gles2wResolveMultisampleFramebufferAPPLE;
PFNGLFENCESYNCAPPLEPROC gles2wFenceSyncAPPLE;
PFNGLISSYNCAPPLEPROC gles2wIsSyncAPPLE;
PFNGLDELETESYNCAPPLEPROC gles2wDeleteSyncAPPLE;
PFNGLCLIENTWAITSYNCAPPLEPROC gles2wClientWaitSyncAPPLE;
PFNGLWAITSYNCAPPLEPROC gles2wWaitSyncAPPLE;
PFNGLGETINTEGER64VAPPLEPROC gles2wGetInteger64vAPPLE;
PFNGLGETSYNCIVAPPLEPROC gles2wGetSyncivAPPLE;
PFNGLLABELOBJECTEXTPROC gles2wLabelObjectEXT;
PFNGLGETOBJECTLABELEXTPROC gles2wGetObjectLabelEXT;
PFNGLINSERTEVENTMARKEREXTPROC gles2wInsertEventMarkerEXT;
PFNGLPUSHGROUPMARKEREXTPROC gles2wPushGroupMarkerEXT;
PFNGLPOPGROUPMARKEREXTPROC gles2wPopGroupMarkerEXT;
PFNGLDISCARDFRAMEBUFFEREXTPROC gles2wDiscardFramebufferEXT;
PFNGLGENQUERIESEXTPROC gles2wGenQueriesEXT;
PFNGLDELETEQUERIESEXTPROC gles2wDeleteQueriesEXT;
PFNGLISQUERYEXTPROC gles2wIsQueryEXT;
PFNGLBEGINQUERYEXTPROC gles2wBeginQueryEXT;
PFNGLENDQUERYEXTPROC gles2wEndQueryEXT;
PFNGLQUERYCOUNTEREXTPROC gles2wQueryCounterEXT;
PFNGLGETQUERYIVEXTPROC gles2wGetQueryivEXT;
PFNGLGETQUERYOBJECTIVEXTPROC gles2wGetQueryObjectivEXT;
PFNGLGETQUERYOBJECTUIVEXTPROC gles2wGetQueryObjectuivEXT;
PFNGLGETQUERYOBJECTI64VEXTPROC gles2wGetQueryObjecti64vEXT;
PFNGLGETQUERYOBJECTUI64VEXTPROC gles2wGetQueryObjectui64vEXT;
PFNGLMAPBUFFERRANGEEXTPROC gles2wMapBufferRangeEXT;
PFNGLFLUSHMAPPEDBUFFERRANGEEXTPROC gles2wFlushMappedBufferRangeEXT;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC gles2wRenderbufferStorageMultisampleEXT;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC gles2wFramebufferTexture2DMultisampleEXT;
PFNGLREADBUFFERINDEXEDEXTPROC gles2wReadBufferIndexedEXT;
PFNGLDRAWBUFFERSINDEXEDEXTPROC gles2wDrawBuffersIndexedEXT;
PFNGLGETINTEGERI_VEXTPROC gles2wGetIntegeri_vEXT;
PFNGLMULTIDRAWARRAYSEXTPROC gles2wMultiDrawArraysEXT;
PFNGLMULTIDRAWELEMENTSEXTPROC gles2wMultiDrawElementsEXT;
PFNGLGETGRAPHICSRESETSTATUSEXTPROC gles2wGetGraphicsResetStatusEXT;
PFNGLREADNPIXELSEXTPROC gles2wReadnPixelsEXT;
PFNGLGETNUNIFORMFVEXTPROC gles2wGetnUniformfvEXT;
PFNGLGETNUNIFORMIVEXTPROC gles2wGetnUniformivEXT;
PFNGLUSEPROGRAMSTAGESEXTPROC gles2wUseProgramStagesEXT;
PFNGLACTIVESHADERPROGRAMEXTPROC gles2wActiveShaderProgramEXT;
PFNGLCREATESHADERPROGRAMVEXTPROC gles2wCreateShaderProgramvEXT;
PFNGLBINDPROGRAMPIPELINEEXTPROC gles2wBindProgramPipelineEXT;
PFNGLDELETEPROGRAMPIPELINESEXTPROC gles2wDeleteProgramPipelinesEXT;
PFNGLGENPROGRAMPIPELINESEXTPROC gles2wGenProgramPipelinesEXT;
PFNGLISPROGRAMPIPELINEEXTPROC gles2wIsProgramPipelineEXT;
PFNGLPROGRAMPARAMETERIEXTPROC gles2wProgramParameteriEXT;
PFNGLGETPROGRAMPIPELINEIVEXTPROC gles2wGetProgramPipelineivEXT;
PFNGLPROGRAMUNIFORM1IEXTPROC gles2wProgramUniform1iEXT;
PFNGLPROGRAMUNIFORM2IEXTPROC gles2wProgramUniform2iEXT;
PFNGLPROGRAMUNIFORM3IEXTPROC gles2wProgramUniform3iEXT;
PFNGLPROGRAMUNIFORM4IEXTPROC gles2wProgramUniform4iEXT;
PFNGLPROGRAMUNIFORM1FEXTPROC gles2wProgramUniform1fEXT;
PFNGLPROGRAMUNIFORM2FEXTPROC gles2wProgramUniform2fEXT;
PFNGLPROGRAMUNIFORM3FEXTPROC gles2wProgramUniform3fEXT;
PFNGLPROGRAMUNIFORM4FEXTPROC gles2wProgramUniform4fEXT;
PFNGLPROGRAMUNIFORM1IVEXTPROC gles2wProgramUniform1ivEXT;
PFNGLPROGRAMUNIFORM2IVEXTPROC gles2wProgramUniform2ivEXT;
PFNGLPROGRAMUNIFORM3IVEXTPROC gles2wProgramUniform3ivEXT;
PFNGLPROGRAMUNIFORM4IVEXTPROC gles2wProgramUniform4ivEXT;
PFNGLPROGRAMUNIFORM1FVEXTPROC gles2wProgramUniform1fvEXT;
PFNGLPROGRAMUNIFORM2FVEXTPROC gles2wProgramUniform2fvEXT;
PFNGLPROGRAMUNIFORM3FVEXTPROC gles2wProgramUniform3fvEXT;
PFNGLPROGRAMUNIFORM4FVEXTPROC gles2wProgramUniform4fvEXT;
PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC gles2wProgramUniformMatrix2fvEXT;
PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC gles2wProgramUniformMatrix3fvEXT;
PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC gles2wProgramUniformMatrix4fvEXT;
PFNGLVALIDATEPROGRAMPIPELINEEXTPROC gles2wValidateProgramPipelineEXT;
PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC gles2wGetProgramPipelineInfoLogEXT;
PFNGLTEXSTORAGE1DEXTPROC gles2wTexStorage1DEXT;
PFNGLTEXSTORAGE2DEXTPROC gles2wTexStorage2DEXT;
PFNGLTEXSTORAGE3DEXTPROC gles2wTexStorage3DEXT;
PFNGLTEXTURESTORAGE1DEXTPROC gles2wTextureStorage1DEXT;
PFNGLTEXTURESTORAGE2DEXTPROC gles2wTextureStorage2DEXT;
PFNGLTEXTURESTORAGE3DEXTPROC gles2wTextureStorage3DEXT;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLEIMGPROC gles2wRenderbufferStorageMultisampleIMG;
PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC gles2wFramebufferTexture2DMultisampleIMG;
PFNGLCOVERAGEMASKNVPROC gles2wCoverageMaskNV;
PFNGLCOVERAGEOPERATIONNVPROC gles2wCoverageOperationNV;
PFNGLDRAWBUFFERSNVPROC gles2wDrawBuffersNV;
PFNGLDRAWARRAYSINSTANCEDNVPROC gles2wDrawArraysInstancedNV;
PFNGLDRAWELEMENTSINSTANCEDNVPROC gles2wDrawElementsInstancedNV;
PFNGLDELETEFENCESNVPROC gles2wDeleteFencesNV;
PFNGLGENFENCESNVPROC gles2wGenFencesNV;
PFNGLISFENCENVPROC gles2wIsFenceNV;
PFNGLTESTFENCENVPROC gles2wTestFenceNV;
PFNGLGETFENCEIVNVPROC gles2wGetFenceivNV;
PFNGLFINISHFENCENVPROC gles2wFinishFenceNV;
PFNGLSETFENCENVPROC gles2wSetFenceNV;
PFNGLBLITFRAMEBUFFERNVPROC gles2wBlitFramebufferNV;
PFNGLRENDERBUFFERSTORAGEMULTISAMPLENVPROC gles2wRenderbufferStorageMultisampleNV;
PFNGLVERTEXATTRIBDIVISORNVPROC gles2wVertexAttribDivisorNV;
PFNGLREADBUFFERNVPROC gles2wReadBufferNV;
PFNGLALPHAFUNCQCOMPROC gles2wAlphaFuncQCOM;
PFNGLGETDRIVERCONTROLSQCOMPROC gles2wGetDriverControlsQCOM;
PFNGLGETDRIVERCONTROLSTRINGQCOMPROC gles2wGetDriverControlStringQCOM;
PFNGLENABLEDRIVERCONTROLQCOMPROC gles2wEnableDriverControlQCOM;
PFNGLDISABLEDRIVERCONTROLQCOMPROC gles2wDisableDriverControlQCOM;
PFNGLEXTGETTEXTURESQCOMPROC gles2wExtGetTexturesQCOM;
PFNGLEXTGETBUFFERSQCOMPROC gles2wExtGetBuffersQCOM;
PFNGLEXTGETRENDERBUFFERSQCOMPROC gles2wExtGetRenderbuffersQCOM;
PFNGLEXTGETFRAMEBUFFERSQCOMPROC gles2wExtGetFramebuffersQCOM;
PFNGLEXTGETTEXLEVELPARAMETERIVQCOMPROC gles2wExtGetTexLevelParameterivQCOM;
PFNGLEXTTEXOBJECTSTATEOVERRIDEIQCOMPROC gles2wExtTexObjectStateOverrideiQCOM;
PFNGLEXTGETTEXSUBIMAGEQCOMPROC gles2wExtGetTexSubImageQCOM;
PFNGLEXTGETBUFFERPOINTERVQCOMPROC gles2wExtGetBufferPointervQCOM;
PFNGLEXTGETSHADERSQCOMPROC gles2wExtGetShadersQCOM;
PFNGLEXTGETPROGRAMSQCOMPROC gles2wExtGetProgramsQCOM;
PFNGLEXTISPROGRAMBINARYQCOMPROC gles2wExtIsProgramBinaryQCOM;
PFNGLEXTGETPROGRAMBINARYSOURCEQCOMPROC gles2wExtGetProgramBinarySourceQCOM;
PFNGLSTARTTILINGQCOMPROC gles2wStartTilingQCOM;
PFNGLENDTILINGQCOMPROC gles2wEndTilingQCOM;

static void load_procs(void)
{
    gles2wActiveTexture = (PFNGLACTIVETEXTUREPROC) get_proc("glActiveTexture");
    gles2wAttachShader = (PFNGLATTACHSHADERPROC) get_proc("glAttachShader");
    gles2wBindAttribLocation = (PFNGLBINDATTRIBLOCATIONPROC) get_proc("glBindAttribLocation");
    gles2wBindBuffer = (PFNGLBINDBUFFERPROC) get_proc("glBindBuffer");
    gles2wBindFramebuffer = (PFNGLBINDFRAMEBUFFERPROC) get_proc("glBindFramebuffer");
    gles2wBindRenderbuffer = (PFNGLBINDRENDERBUFFERPROC) get_proc("glBindRenderbuffer");
    gles2wBindTexture = (PFNGLBINDTEXTUREPROC) get_proc("glBindTexture");
    gles2wBlendColor = (PFNGLBLENDCOLORPROC) get_proc("glBlendColor");
    gles2wBlendEquation = (PFNGLBLENDEQUATIONPROC) get_proc("glBlendEquation");
    gles2wBlendEquationSeparate = (PFNGLBLENDEQUATIONSEPARATEPROC) get_proc("glBlendEquationSeparate");
    gles2wBlendFunc = (PFNGLBLENDFUNCPROC) get_proc("glBlendFunc");
    gles2wBlendFuncSeparate = (PFNGLBLENDFUNCSEPARATEPROC) get_proc("glBlendFuncSeparate");
    gles2wBufferData = (PFNGLBUFFERDATAPROC) get_proc("glBufferData");
    gles2wBufferSubData = (PFNGLBUFFERSUBDATAPROC) get_proc("glBufferSubData");
    gles2wCheckFramebufferStatus = (PFNGLCHECKFRAMEBUFFERSTATUSPROC) get_proc("glCheckFramebufferStatus");
    gles2wClear = (PFNGLCLEARPROC) get_proc("glClear");
    gles2wClearColor = (PFNGLCLEARCOLORPROC) get_proc("glClearColor");
    gles2wClearDepthf = (PFNGLCLEARDEPTHFPROC) get_proc("glClearDepthf");
    gles2wClearStencil = (PFNGLCLEARSTENCILPROC) get_proc("glClearStencil");
    gles2wColorMask = (PFNGLCOLORMASKPROC) get_proc("glColorMask");
    gles2wCompileShader = (PFNGLCOMPILESHADERPROC) get_proc("glCompileShader");
    gles2wCompressedTexImage2D = (PFNGLCOMPRESSEDTEXIMAGE2DPROC) get_proc("glCompressedTexImage2D");
    gles2wCompressedTexSubImage2D = (PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC) get_proc("glCompressedTexSubImage2D");
    gles2wCopyTexImage2D = (PFNGLCOPYTEXIMAGE2DPROC) get_proc("glCopyTexImage2D");
    gles2wCopyTexSubImage2D = (PFNGLCOPYTEXSUBIMAGE2DPROC) get_proc("glCopyTexSubImage2D");
    gles2wCreateProgram = (PFNGLCREATEPROGRAMPROC) get_proc("glCreateProgram");
    gles2wCreateShader = (PFNGLCREATESHADERPROC) get_proc("glCreateShader");
    gles2wCullFace = (PFNGLCULLFACEPROC) get_proc("glCullFace");
    gles2wDeleteBuffers = (PFNGLDELETEBUFFERSPROC) get_proc("glDeleteBuffers");
    gles2wDeleteFramebuffers = (PFNGLDELETEFRAMEBUFFERSPROC) get_proc("glDeleteFramebuffers");
    gles2wDeleteProgram = (PFNGLDELETEPROGRAMPROC) get_proc("glDeleteProgram");
    gles2wDeleteRenderbuffers = (PFNGLDELETERENDERBUFFERSPROC) get_proc("glDeleteRenderbuffers");
    gles2wDeleteShader = (PFNGLDELETESHADERPROC) get_proc("glDeleteShader");
    gles2wDeleteTextures = (PFNGLDELETETEXTURESPROC) get_proc("glDeleteTextures");
    gles2wDepthFunc = (PFNGLDEPTHFUNCPROC) get_proc("glDepthFunc");
    gles2wDepthMask = (PFNGLDEPTHMASKPROC) get_proc("glDepthMask");
    gles2wDepthRangef = (PFNGLDEPTHRANGEFPROC) get_proc("glDepthRangef");
    gles2wDetachShader = (PFNGLDETACHSHADERPROC) get_proc("glDetachShader");
    gles2wDisable = (PFNGLDISABLEPROC) get_proc("glDisable");
    gles2wDisableVertexAttribArray = (PFNGLDISABLEVERTEXATTRIBARRAYPROC) get_proc("glDisableVertexAttribArray");
    gles2wDrawArrays = (PFNGLDRAWARRAYSPROC) get_proc("glDrawArrays");
    gles2wDrawElements = (PFNGLDRAWELEMENTSPROC) get_proc("glDrawElements");
    gles2wEnable = (PFNGLENABLEPROC) get_proc("glEnable");
    gles2wEnableVertexAttribArray = (PFNGLENABLEVERTEXATTRIBARRAYPROC) get_proc("glEnableVertexAttribArray");
    gles2wFinish = (PFNGLFINISHPROC) get_proc("glFinish");
    gles2wFlush = (PFNGLFLUSHPROC) get_proc("glFlush");
    gles2wFramebufferRenderbuffer = (PFNGLFRAMEBUFFERRENDERBUFFERPROC) get_proc("glFramebufferRenderbuffer");
    gles2wFramebufferTexture2D = (PFNGLFRAMEBUFFERTEXTURE2DPROC) get_proc("glFramebufferTexture2D");
    gles2wFrontFace = (PFNGLFRONTFACEPROC) get_proc("glFrontFace");
    gles2wGenBuffers = (PFNGLGENBUFFERSPROC) get_proc("glGenBuffers");
    gles2wGenerateMipmap = (PFNGLGENERATEMIPMAPPROC) get_proc("glGenerateMipmap");
    gles2wGenFramebuffers = (PFNGLGENFRAMEBUFFERSPROC) get_proc("glGenFramebuffers");
    gles2wGenRenderbuffers = (PFNGLGENRENDERBUFFERSPROC) get_proc("glGenRenderbuffers");
    gles2wGenTextures = (PFNGLGENTEXTURESPROC) get_proc("glGenTextures");
    gles2wGetActiveAttrib = (PFNGLGETACTIVEATTRIBPROC) get_proc("glGetActiveAttrib");
    gles2wGetActiveUniform = (PFNGLGETACTIVEUNIFORMPROC) get_proc("glGetActiveUniform");
    gles2wGetAttachedShaders = (PFNGLGETATTACHEDSHADERSPROC) get_proc("glGetAttachedShaders");
    gles2wGetAttribLocation = (PFNGLGETATTRIBLOCATIONPROC) get_proc("glGetAttribLocation");
    gles2wGetBooleanv = (PFNGLGETBOOLEANVPROC) get_proc("glGetBooleanv");
    gles2wGetBufferParameteriv = (PFNGLGETBUFFERPARAMETERIVPROC) get_proc("glGetBufferParameteriv");
    gles2wGetError = (PFNGLGETERRORPROC) get_proc("glGetError");
    gles2wGetFloatv = (PFNGLGETFLOATVPROC) get_proc("glGetFloatv");
    gles2wGetFramebufferAttachmentParameteriv = (PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC) get_proc("glGetFramebufferAttachmentParameteriv");
    gles2wGetIntegerv = (PFNGLGETINTEGERVPROC) get_proc("glGetIntegerv");
    gles2wGetProgramiv = (PFNGLGETPROGRAMIVPROC) get_proc("glGetProgramiv");
    gles2wGetProgramInfoLog = (PFNGLGETPROGRAMINFOLOGPROC) get_proc("glGetProgramInfoLog");
    gles2wGetRenderbufferParameteriv = (PFNGLGETRENDERBUFFERPARAMETERIVPROC) get_proc("glGetRenderbufferParameteriv");
    gles2wGetShaderiv = (PFNGLGETSHADERIVPROC) get_proc("glGetShaderiv");
    gles2wGetShaderInfoLog = (PFNGLGETSHADERINFOLOGPROC) get_proc("glGetShaderInfoLog");
    gles2wGetShaderPrecisionFormat = (PFNGLGETSHADERPRECISIONFORMATPROC) get_proc("glGetShaderPrecisionFormat");
    gles2wGetShaderSource = (PFNGLGETSHADERSOURCEPROC) get_proc("glGetShaderSource");
    gles2wGetString = (PFNGLGETSTRINGPROC) get_proc("glGetString");
    gles2wGetTexParameterfv = (PFNGLGETTEXPARAMETERFVPROC) get_proc("glGetTexParameterfv");
    gles2wGetTexParameteriv = (PFNGLGETTEXPARAMETERIVPROC) get_proc("glGetTexParameteriv");
    gles2wGetUniformfv = (PFNGLGETUNIFORMFVPROC) get_proc("glGetUniformfv");
    gles2wGetUniformiv = (PFNGLGETUNIFORMIVPROC) get_proc("glGetUniformiv");
    gles2wGetUniformLocation = (PFNGLGETUNIFORMLOCATIONPROC) get_proc("glGetUniformLocation");
    gles2wGetVertexAttribfv = (PFNGLGETVERTEXATTRIBFVPROC) get_proc("glGetVertexAttribfv");
    gles2wGetVertexAttribiv = (PFNGLGETVERTEXATTRIBIVPROC) get_proc("glGetVertexAttribiv");
    gles2wGetVertexAttribPointerv = (PFNGLGETVERTEXATTRIBPOINTERVPROC) get_proc("glGetVertexAttribPointerv");
    gles2wHint = (PFNGLHINTPROC) get_proc("glHint");
    gles2wIsBuffer = (PFNGLISBUFFERPROC) get_proc("glIsBuffer");
    gles2wIsEnabled = (PFNGLISENABLEDPROC) get_proc("glIsEnabled");
    gles2wIsFramebuffer = (PFNGLISFRAMEBUFFERPROC) get_proc("glIsFramebuffer");
    gles2wIsProgram = (PFNGLISPROGRAMPROC) get_proc("glIsProgram");
    gles2wIsRenderbuffer = (PFNGLISRENDERBUFFERPROC) get_proc("glIsRenderbuffer");
    gles2wIsShader = (PFNGLISSHADERPROC) get_proc("glIsShader");
    gles2wIsTexture = (PFNGLISTEXTUREPROC) get_proc("glIsTexture");
    gles2wLineWidth = (PFNGLLINEWIDTHPROC) get_proc("glLineWidth");
    gles2wLinkProgram = (PFNGLLINKPROGRAMPROC) get_proc("glLinkProgram");
    gles2wPixelStorei = (PFNGLPIXELSTOREIPROC) get_proc("glPixelStorei");
    gles2wPolygonOffset = (PFNGLPOLYGONOFFSETPROC) get_proc("glPolygonOffset");
    gles2wReadPixels = (PFNGLREADPIXELSPROC) get_proc("glReadPixels");
    gles2wReleaseShaderCompiler = (PFNGLRELEASESHADERCOMPILERPROC) get_proc("glReleaseShaderCompiler");
    gles2wRenderbufferStorage = (PFNGLRENDERBUFFERSTORAGEPROC) get_proc("glRenderbufferStorage");
    gles2wSampleCoverage = (PFNGLSAMPLECOVERAGEPROC) get_proc("glSampleCoverage");
    gles2wScissor = (PFNGLSCISSORPROC) get_proc("glScissor");
    gles2wShaderBinary = (PFNGLSHADERBINARYPROC) get_proc("glShaderBinary");
    gles2wShaderSource = (PFNGLSHADERSOURCEPROC) get_proc("glShaderSource");
    gles2wStencilFunc = (PFNGLSTENCILFUNCPROC) get_proc("glStencilFunc");
    gles2wStencilFuncSeparate = (PFNGLSTENCILFUNCSEPARATEPROC) get_proc("glStencilFuncSeparate");
    gles2wStencilMask = (PFNGLSTENCILMASKPROC) get_proc("glStencilMask");
    gles2wStencilMaskSeparate = (PFNGLSTENCILMASKSEPARATEPROC) get_proc("glStencilMaskSeparate");
    gles2wStencilOp = (PFNGLSTENCILOPPROC) get_proc("glStencilOp");
    gles2wStencilOpSeparate = (PFNGLSTENCILOPSEPARATEPROC) get_proc("glStencilOpSeparate");
    gles2wTexImage2D = (PFNGLTEXIMAGE2DPROC) get_proc("glTexImage2D");
    gles2wTexParameterf = (PFNGLTEXPARAMETERFPROC) get_proc("glTexParameterf");
    gles2wTexParameterfv = (PFNGLTEXPARAMETERFVPROC) get_proc("glTexParameterfv");
    gles2wTexParameteri = (PFNGLTEXPARAMETERIPROC) get_proc("glTexParameteri");
    gles2wTexParameteriv = (PFNGLTEXPARAMETERIVPROC) get_proc("glTexParameteriv");
    gles2wTexSubImage2D = (PFNGLTEXSUBIMAGE2DPROC) get_proc("glTexSubImage2D");
    gles2wUniform1f = (PFNGLUNIFORM1FPROC) get_proc("glUniform1f");
    gles2wUniform1fv = (PFNGLUNIFORM1FVPROC) get_proc("glUniform1fv");
    gles2wUniform1i = (PFNGLUNIFORM1IPROC) get_proc("glUniform1i");
    gles2wUniform1iv = (PFNGLUNIFORM1IVPROC) get_proc("glUniform1iv");
    gles2wUniform2f = (PFNGLUNIFORM2FPROC) get_proc("glUniform2f");
    gles2wUniform2fv = (PFNGLUNIFORM2FVPROC) get_proc("glUniform2fv");
    gles2wUniform2i = (PFNGLUNIFORM2IPROC) get_proc("glUniform2i");
    gles2wUniform2iv = (PFNGLUNIFORM2IVPROC) get_proc("glUniform2iv");
    gles2wUniform3f = (PFNGLUNIFORM3FPROC) get_proc("glUniform3f");
    gles2wUniform3fv = (PFNGLUNIFORM3FVPROC) get_proc("glUniform3fv");
    gles2wUniform3i = (PFNGLUNIFORM3IPROC) get_proc("glUniform3i");
    gles2wUniform3iv = (PFNGLUNIFORM3IVPROC) get_proc("glUniform3iv");
    gles2wUniform4f = (PFNGLUNIFORM4FPROC) get_proc("glUniform4f");
    gles2wUniform4fv = (PFNGLUNIFORM4FVPROC) get_proc("glUniform4fv");
    gles2wUniform4i = (PFNGLUNIFORM4IPROC) get_proc("glUniform4i");
    gles2wUniform4iv = (PFNGLUNIFORM4IVPROC) get_proc("glUniform4iv");
    gles2wUniformMatrix2fv = (PFNGLUNIFORMMATRIX2FVPROC) get_proc("glUniformMatrix2fv");
    gles2wUniformMatrix3fv = (PFNGLUNIFORMMATRIX3FVPROC) get_proc("glUniformMatrix3fv");
    gles2wUniformMatrix4fv = (PFNGLUNIFORMMATRIX4FVPROC) get_proc("glUniformMatrix4fv");
    gles2wUseProgram = (PFNGLUSEPROGRAMPROC) get_proc("glUseProgram");
    gles2wValidateProgram = (PFNGLVALIDATEPROGRAMPROC) get_proc("glValidateProgram");
    gles2wVertexAttrib1f = (PFNGLVERTEXATTRIB1FPROC) get_proc("glVertexAttrib1f");
    gles2wVertexAttrib1fv = (PFNGLVERTEXATTRIB1FVPROC) get_proc("glVertexAttrib1fv");
    gles2wVertexAttrib2f = (PFNGLVERTEXATTRIB2FPROC) get_proc("glVertexAttrib2f");
    gles2wVertexAttrib2fv = (PFNGLVERTEXATTRIB2FVPROC) get_proc("glVertexAttrib2fv");
    gles2wVertexAttrib3f = (PFNGLVERTEXATTRIB3FPROC) get_proc("glVertexAttrib3f");
    gles2wVertexAttrib3fv = (PFNGLVERTEXATTRIB3FVPROC) get_proc("glVertexAttrib3fv");
    gles2wVertexAttrib4f = (PFNGLVERTEXATTRIB4FPROC) get_proc("glVertexAttrib4f");
    gles2wVertexAttrib4fv = (PFNGLVERTEXATTRIB4FVPROC) get_proc("glVertexAttrib4fv");
    gles2wVertexAttribPointer = (PFNGLVERTEXATTRIBPOINTERPROC) get_proc("glVertexAttribPointer");
    gles2wViewport = (PFNGLVIEWPORTPROC) get_proc("glViewport");
    gles2wEGLImageTargetTexture2DOES = (PFNGLEGLIMAGETARGETTEXTURE2DOESPROC) get_proc("glEGLImageTargetTexture2DOES");
    gles2wEGLImageTargetRenderbufferStorageOES = (PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC) get_proc("glEGLImageTargetRenderbufferStorageOES");
    gles2wGetProgramBinaryOES = (PFNGLGETPROGRAMBINARYOESPROC) get_proc("glGetProgramBinaryOES");
    gles2wProgramBinaryOES = (PFNGLPROGRAMBINARYOESPROC) get_proc("glProgramBinaryOES");
    gles2wMapBufferOES = (PFNGLMAPBUFFEROESPROC) get_proc("glMapBufferOES");
    gles2wUnmapBufferOES = (PFNGLUNMAPBUFFEROESPROC) get_proc("glUnmapBufferOES");
    gles2wGetBufferPointervOES = (PFNGLGETBUFFERPOINTERVOESPROC) get_proc("glGetBufferPointervOES");
    gles2wTexImage3DOES = (PFNGLTEXIMAGE3DOESPROC) get_proc("glTexImage3DOES");
    gles2wTexSubImage3DOES = (PFNGLTEXSUBIMAGE3DOESPROC) get_proc("glTexSubImage3DOES");
    gles2wCopyTexSubImage3DOES = (PFNGLCOPYTEXSUBIMAGE3DOESPROC) get_proc("glCopyTexSubImage3DOES");
    gles2wCompressedTexImage3DOES = (PFNGLCOMPRESSEDTEXIMAGE3DOESPROC) get_proc("glCompressedTexImage3DOES");
    gles2wCompressedTexSubImage3DOES = (PFNGLCOMPRESSEDTEXSUBIMAGE3DOESPROC) get_proc("glCompressedTexSubImage3DOES");
    gles2wFramebufferTexture3DOES = (PFNGLFRAMEBUFFERTEXTURE3DOESPROC) get_proc("glFramebufferTexture3DOES");
    gles2wBindVertexArrayOES = (PFNGLBINDVERTEXARRAYOESPROC) get_proc("glBindVertexArrayOES");
    gles2wDeleteVertexArraysOES = (PFNGLDELETEVERTEXARRAYSOESPROC) get_proc("glDeleteVertexArraysOES");
    gles2wGenVertexArraysOES = (PFNGLGENVERTEXARRAYSOESPROC) get_proc("glGenVertexArraysOES");
    gles2wIsVertexArrayOES = (PFNGLISVERTEXARRAYOESPROC) get_proc("glIsVertexArrayOES");
    gles2wDebugMessageControlKHR = (PFNGLDEBUGMESSAGECONTROLKHRPROC) get_proc("glDebugMessageControlKHR");
    gles2wDebugMessageInsertKHR = (PFNGLDEBUGMESSAGEINSERTKHRPROC) get_proc("glDebugMessageInsertKHR");
    gles2wDebugMessageCallbackKHR = (PFNGLDEBUGMESSAGECALLBACKKHRPROC) get_proc("glDebugMessageCallbackKHR");
    gles2wGetDebugMessageLogKHR = (PFNGLGETDEBUGMESSAGELOGKHRPROC) get_proc("glGetDebugMessageLogKHR");
    gles2wPushDebugGroupKHR = (PFNGLPUSHDEBUGGROUPKHRPROC) get_proc("glPushDebugGroupKHR");
    gles2wPopDebugGroupKHR = (PFNGLPOPDEBUGGROUPKHRPROC) get_proc("glPopDebugGroupKHR");
    gles2wObjectLabelKHR = (PFNGLOBJECTLABELKHRPROC) get_proc("glObjectLabelKHR");
    gles2wGetObjectLabelKHR = (PFNGLGETOBJECTLABELKHRPROC) get_proc("glGetObjectLabelKHR");
    gles2wObjectPtrLabelKHR = (PFNGLOBJECTPTRLABELKHRPROC) get_proc("glObjectPtrLabelKHR");
    gles2wGetObjectPtrLabelKHR = (PFNGLGETOBJECTPTRLABELKHRPROC) get_proc("glGetObjectPtrLabelKHR");
    gles2wGetPointervKHR = (PFNGLGETPOINTERVKHRPROC) get_proc("glGetPointervKHR");
    gles2wGetPerfMonitorGroupsAMD = (PFNGLGETPERFMONITORGROUPSAMDPROC) get_proc("glGetPerfMonitorGroupsAMD");
    gles2wGetPerfMonitorCountersAMD = (PFNGLGETPERFMONITORCOUNTERSAMDPROC) get_proc("glGetPerfMonitorCountersAMD");
    gles2wGetPerfMonitorGroupStringAMD = (PFNGLGETPERFMONITORGROUPSTRINGAMDPROC) get_proc("glGetPerfMonitorGroupStringAMD");
    gles2wGetPerfMonitorCounterStringAMD = (PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC) get_proc("glGetPerfMonitorCounterStringAMD");
    gles2wGetPerfMonitorCounterInfoAMD = (PFNGLGETPERFMONITORCOUNTERINFOAMDPROC) get_proc("glGetPerfMonitorCounterInfoAMD");
    gles2wGenPerfMonitorsAMD = (PFNGLGENPERFMONITORSAMDPROC) get_proc("glGenPerfMonitorsAMD");
    gles2wDeletePerfMonitorsAMD = (PFNGLDELETEPERFMONITORSAMDPROC) get_proc("glDeletePerfMonitorsAMD");
    gles2wSelectPerfMonitorCountersAMD = (PFNGLSELECTPERFMONITORCOUNTERSAMDPROC) get_proc("glSelectPerfMonitorCountersAMD");
    gles2wBeginPerfMonitorAMD = (PFNGLBEGINPERFMONITORAMDPROC) get_proc("glBeginPerfMonitorAMD");
    gles2wEndPerfMonitorAMD = (PFNGLENDPERFMONITORAMDPROC) get_proc("glEndPerfMonitorAMD");
    gles2wGetPerfMonitorCounterDataAMD = (PFNGLGETPERFMONITORCOUNTERDATAAMDPROC) get_proc("glGetPerfMonitorCounterDataAMD");
    gles2wBlitFramebufferANGLE = (PFNGLBLITFRAMEBUFFERANGLEPROC) get_proc("glBlitFramebufferANGLE");
    gles2wRenderbufferStorageMultisampleANGLE = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEANGLEPROC) get_proc("glRenderbufferStorageMultisampleANGLE");
    gles2wDrawArraysInstancedANGLE = (PFNGLDRAWARRAYSINSTANCEDANGLEPROC) get_proc("glDrawArraysInstancedANGLE");
    gles2wDrawElementsInstancedANGLE = (PFNGLDRAWELEMENTSINSTANCEDANGLEPROC) get_proc("glDrawElementsInstancedANGLE");
    gles2wVertexAttribDivisorANGLE = (PFNGLVERTEXATTRIBDIVISORANGLEPROC) get_proc("glVertexAttribDivisorANGLE");
    gles2wGetTranslatedShaderSourceANGLE = (PFNGLGETTRANSLATEDSHADERSOURCEANGLEPROC) get_proc("glGetTranslatedShaderSourceANGLE");
    gles2wDrawArraysInstancedEXT = (PFNGLDRAWARRAYSINSTANCEDEXTPROC) get_proc("glDrawArraysInstancedEXT");
    gles2wDrawElementsInstancedEXT = (PFNGLDRAWELEMENTSINSTANCEDEXTPROC) get_proc("glDrawElementsInstancedEXT");
    gles2wVertexAttribDivisorEXT = (PFNGLVERTEXATTRIBDIVISOREXTPROC) get_proc("glVertexAttribDivisorEXT");
    gles2wCopyTextureLevelsAPPLE = (PFNGLCOPYTEXTURELEVELSAPPLEPROC) get_proc("glCopyTextureLevelsAPPLE");
    gles2wRenderbufferStorageMultisampleAPPLE = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEAPPLEPROC) get_proc("glRenderbufferStorageMultisampleAPPLE");
    gles2wResolveMultisampleFramebufferAPPLE = (PFNGLRESOLVEMULTISAMPLEFRAMEBUFFERAPPLEPROC) get_proc("glResolveMultisampleFramebufferAPPLE");
    gles2wFenceSyncAPPLE = (PFNGLFENCESYNCAPPLEPROC) get_proc("glFenceSyncAPPLE");
    gles2wIsSyncAPPLE = (PFNGLISSYNCAPPLEPROC) get_proc("glIsSyncAPPLE");
    gles2wDeleteSyncAPPLE = (PFNGLDELETESYNCAPPLEPROC) get_proc("glDeleteSyncAPPLE");
    gles2wClientWaitSyncAPPLE = (PFNGLCLIENTWAITSYNCAPPLEPROC) get_proc("glClientWaitSyncAPPLE");
    gles2wWaitSyncAPPLE = (PFNGLWAITSYNCAPPLEPROC) get_proc("glWaitSyncAPPLE");
    gles2wGetInteger64vAPPLE = (PFNGLGETINTEGER64VAPPLEPROC) get_proc("glGetInteger64vAPPLE");
    gles2wGetSyncivAPPLE = (PFNGLGETSYNCIVAPPLEPROC) get_proc("glGetSyncivAPPLE");
    gles2wLabelObjectEXT = (PFNGLLABELOBJECTEXTPROC) get_proc("glLabelObjectEXT");
    gles2wGetObjectLabelEXT = (PFNGLGETOBJECTLABELEXTPROC) get_proc("glGetObjectLabelEXT");
    gles2wInsertEventMarkerEXT = (PFNGLINSERTEVENTMARKEREXTPROC) get_proc("glInsertEventMarkerEXT");
    gles2wPushGroupMarkerEXT = (PFNGLPUSHGROUPMARKEREXTPROC) get_proc("glPushGroupMarkerEXT");
    gles2wPopGroupMarkerEXT = (PFNGLPOPGROUPMARKEREXTPROC) get_proc("glPopGroupMarkerEXT");
    gles2wDiscardFramebufferEXT = (PFNGLDISCARDFRAMEBUFFEREXTPROC) get_proc("glDiscardFramebufferEXT");
    gles2wGenQueriesEXT = (PFNGLGENQUERIESEXTPROC) get_proc("glGenQueriesEXT");
    gles2wDeleteQueriesEXT = (PFNGLDELETEQUERIESEXTPROC) get_proc("glDeleteQueriesEXT");
    gles2wIsQueryEXT = (PFNGLISQUERYEXTPROC) get_proc("glIsQueryEXT");
    gles2wBeginQueryEXT = (PFNGLBEGINQUERYEXTPROC) get_proc("glBeginQueryEXT");
    gles2wEndQueryEXT = (PFNGLENDQUERYEXTPROC) get_proc("glEndQueryEXT");
    gles2wQueryCounterEXT = (PFNGLQUERYCOUNTEREXTPROC) get_proc("glQueryCounterEXT");
    gles2wGetQueryivEXT = (PFNGLGETQUERYIVEXTPROC) get_proc("glGetQueryivEXT");
    gles2wGetQueryObjectivEXT = (PFNGLGETQUERYOBJECTIVEXTPROC) get_proc("glGetQueryObjectivEXT");
    gles2wGetQueryObjectuivEXT = (PFNGLGETQUERYOBJECTUIVEXTPROC) get_proc("glGetQueryObjectuivEXT");
    gles2wGetQueryObjecti64vEXT = (PFNGLGETQUERYOBJECTI64VEXTPROC) get_proc("glGetQueryObjecti64vEXT");
    gles2wGetQueryObjectui64vEXT = (PFNGLGETQUERYOBJECTUI64VEXTPROC) get_proc("glGetQueryObjectui64vEXT");
    gles2wMapBufferRangeEXT = (PFNGLMAPBUFFERRANGEEXTPROC) get_proc("glMapBufferRangeEXT");
    gles2wFlushMappedBufferRangeEXT = (PFNGLFLUSHMAPPEDBUFFERRANGEEXTPROC) get_proc("glFlushMappedBufferRangeEXT");
    gles2wRenderbufferStorageMultisampleEXT = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC) get_proc("glRenderbufferStorageMultisampleEXT");
    gles2wFramebufferTexture2DMultisampleEXT = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC) get_proc("glFramebufferTexture2DMultisampleEXT");
    gles2wReadBufferIndexedEXT = (PFNGLREADBUFFERINDEXEDEXTPROC) get_proc("glReadBufferIndexedEXT");
    gles2wDrawBuffersIndexedEXT = (PFNGLDRAWBUFFERSINDEXEDEXTPROC) get_proc("glDrawBuffersIndexedEXT");
    gles2wGetIntegeri_vEXT = (PFNGLGETINTEGERI_VEXTPROC) get_proc("glGetIntegeri_vEXT");
    gles2wMultiDrawArraysEXT = (PFNGLMULTIDRAWARRAYSEXTPROC) get_proc("glMultiDrawArraysEXT");
    gles2wMultiDrawElementsEXT = (PFNGLMULTIDRAWELEMENTSEXTPROC) get_proc("glMultiDrawElementsEXT");
    gles2wGetGraphicsResetStatusEXT = (PFNGLGETGRAPHICSRESETSTATUSEXTPROC) get_proc("glGetGraphicsResetStatusEXT");
    gles2wReadnPixelsEXT = (PFNGLREADNPIXELSEXTPROC) get_proc("glReadnPixelsEXT");
    gles2wGetnUniformfvEXT = (PFNGLGETNUNIFORMFVEXTPROC) get_proc("glGetnUniformfvEXT");
    gles2wGetnUniformivEXT = (PFNGLGETNUNIFORMIVEXTPROC) get_proc("glGetnUniformivEXT");
    gles2wUseProgramStagesEXT = (PFNGLUSEPROGRAMSTAGESEXTPROC) get_proc("glUseProgramStagesEXT");
    gles2wActiveShaderProgramEXT = (PFNGLACTIVESHADERPROGRAMEXTPROC) get_proc("glActiveShaderProgramEXT");
    gles2wCreateShaderProgramvEXT = (PFNGLCREATESHADERPROGRAMVEXTPROC) get_proc("glCreateShaderProgramvEXT");
    gles2wBindProgramPipelineEXT = (PFNGLBINDPROGRAMPIPELINEEXTPROC) get_proc("glBindProgramPipelineEXT");
    gles2wDeleteProgramPipelinesEXT = (PFNGLDELETEPROGRAMPIPELINESEXTPROC) get_proc("glDeleteProgramPipelinesEXT");
    gles2wGenProgramPipelinesEXT = (PFNGLGENPROGRAMPIPELINESEXTPROC) get_proc("glGenProgramPipelinesEXT");
    gles2wIsProgramPipelineEXT = (PFNGLISPROGRAMPIPELINEEXTPROC) get_proc("glIsProgramPipelineEXT");
    gles2wProgramParameteriEXT = (PFNGLPROGRAMPARAMETERIEXTPROC) get_proc("glProgramParameteriEXT");
    gles2wGetProgramPipelineivEXT = (PFNGLGETPROGRAMPIPELINEIVEXTPROC) get_proc("glGetProgramPipelineivEXT");
    gles2wProgramUniform1iEXT = (PFNGLPROGRAMUNIFORM1IEXTPROC) get_proc("glProgramUniform1iEXT");
    gles2wProgramUniform2iEXT = (PFNGLPROGRAMUNIFORM2IEXTPROC) get_proc("glProgramUniform2iEXT");
    gles2wProgramUniform3iEXT = (PFNGLPROGRAMUNIFORM3IEXTPROC) get_proc("glProgramUniform3iEXT");
    gles2wProgramUniform4iEXT = (PFNGLPROGRAMUNIFORM4IEXTPROC) get_proc("glProgramUniform4iEXT");
    gles2wProgramUniform1fEXT = (PFNGLPROGRAMUNIFORM1FEXTPROC) get_proc("glProgramUniform1fEXT");
    gles2wProgramUniform2fEXT = (PFNGLPROGRAMUNIFORM2FEXTPROC) get_proc("glProgramUniform2fEXT");
    gles2wProgramUniform3fEXT = (PFNGLPROGRAMUNIFORM3FEXTPROC) get_proc("glProgramUniform3fEXT");
    gles2wProgramUniform4fEXT = (PFNGLPROGRAMUNIFORM4FEXTPROC) get_proc("glProgramUniform4fEXT");
    gles2wProgramUniform1ivEXT = (PFNGLPROGRAMUNIFORM1IVEXTPROC) get_proc("glProgramUniform1ivEXT");
    gles2wProgramUniform2ivEXT = (PFNGLPROGRAMUNIFORM2IVEXTPROC) get_proc("glProgramUniform2ivEXT");
    gles2wProgramUniform3ivEXT = (PFNGLPROGRAMUNIFORM3IVEXTPROC) get_proc("glProgramUniform3ivEXT");
    gles2wProgramUniform4ivEXT = (PFNGLPROGRAMUNIFORM4IVEXTPROC) get_proc("glProgramUniform4ivEXT");
    gles2wProgramUniform1fvEXT = (PFNGLPROGRAMUNIFORM1FVEXTPROC) get_proc("glProgramUniform1fvEXT");
    gles2wProgramUniform2fvEXT = (PFNGLPROGRAMUNIFORM2FVEXTPROC) get_proc("glProgramUniform2fvEXT");
    gles2wProgramUniform3fvEXT = (PFNGLPROGRAMUNIFORM3FVEXTPROC) get_proc("glProgramUniform3fvEXT");
    gles2wProgramUniform4fvEXT = (PFNGLPROGRAMUNIFORM4FVEXTPROC) get_proc("glProgramUniform4fvEXT");
    gles2wProgramUniformMatrix2fvEXT = (PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC) get_proc("glProgramUniformMatrix2fvEXT");
    gles2wProgramUniformMatrix3fvEXT = (PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC) get_proc("glProgramUniformMatrix3fvEXT");
    gles2wProgramUniformMatrix4fvEXT = (PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC) get_proc("glProgramUniformMatrix4fvEXT");
    gles2wValidateProgramPipelineEXT = (PFNGLVALIDATEPROGRAMPIPELINEEXTPROC) get_proc("glValidateProgramPipelineEXT");
    gles2wGetProgramPipelineInfoLogEXT = (PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC) get_proc("glGetProgramPipelineInfoLogEXT");
    gles2wTexStorage1DEXT = (PFNGLTEXSTORAGE1DEXTPROC) get_proc("glTexStorage1DEXT");
    gles2wTexStorage2DEXT = (PFNGLTEXSTORAGE2DEXTPROC) get_proc("glTexStorage2DEXT");
    gles2wTexStorage3DEXT = (PFNGLTEXSTORAGE3DEXTPROC) get_proc("glTexStorage3DEXT");
    gles2wTextureStorage1DEXT = (PFNGLTEXTURESTORAGE1DEXTPROC) get_proc("glTextureStorage1DEXT");
    gles2wTextureStorage2DEXT = (PFNGLTEXTURESTORAGE2DEXTPROC) get_proc("glTextureStorage2DEXT");
    gles2wTextureStorage3DEXT = (PFNGLTEXTURESTORAGE3DEXTPROC) get_proc("glTextureStorage3DEXT");
    gles2wRenderbufferStorageMultisampleIMG = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLEIMGPROC) get_proc("glRenderbufferStorageMultisampleIMG");
    gles2wFramebufferTexture2DMultisampleIMG = (PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC) get_proc("glFramebufferTexture2DMultisampleIMG");
    gles2wCoverageMaskNV = (PFNGLCOVERAGEMASKNVPROC) get_proc("glCoverageMaskNV");
    gles2wCoverageOperationNV = (PFNGLCOVERAGEOPERATIONNVPROC) get_proc("glCoverageOperationNV");
    gles2wDrawBuffersNV = (PFNGLDRAWBUFFERSNVPROC) get_proc("glDrawBuffersNV");
    gles2wDrawArraysInstancedNV = (PFNGLDRAWARRAYSINSTANCEDNVPROC) get_proc("glDrawArraysInstancedNV");
    gles2wDrawElementsInstancedNV = (PFNGLDRAWELEMENTSINSTANCEDNVPROC) get_proc("glDrawElementsInstancedNV");
    gles2wDeleteFencesNV = (PFNGLDELETEFENCESNVPROC) get_proc("glDeleteFencesNV");
    gles2wGenFencesNV = (PFNGLGENFENCESNVPROC) get_proc("glGenFencesNV");
    gles2wIsFenceNV = (PFNGLISFENCENVPROC) get_proc("glIsFenceNV");
    gles2wTestFenceNV = (PFNGLTESTFENCENVPROC) get_proc("glTestFenceNV");
    gles2wGetFenceivNV = (PFNGLGETFENCEIVNVPROC) get_proc("glGetFenceivNV");
    gles2wFinishFenceNV = (PFNGLFINISHFENCENVPROC) get_proc("glFinishFenceNV");
    gles2wSetFenceNV = (PFNGLSETFENCENVPROC) get_proc("glSetFenceNV");
    gles2wBlitFramebufferNV = (PFNGLBLITFRAMEBUFFERNVPROC) get_proc("glBlitFramebufferNV");
    gles2wRenderbufferStorageMultisampleNV = (PFNGLRENDERBUFFERSTORAGEMULTISAMPLENVPROC) get_proc("glRenderbufferStorageMultisampleNV");
    gles2wVertexAttribDivisorNV = (PFNGLVERTEXATTRIBDIVISORNVPROC) get_proc("glVertexAttribDivisorNV");
    gles2wReadBufferNV = (PFNGLREADBUFFERNVPROC) get_proc("glReadBufferNV");
    gles2wAlphaFuncQCOM = (PFNGLALPHAFUNCQCOMPROC) get_proc("glAlphaFuncQCOM");
    gles2wGetDriverControlsQCOM = (PFNGLGETDRIVERCONTROLSQCOMPROC) get_proc("glGetDriverControlsQCOM");
    gles2wGetDriverControlStringQCOM = (PFNGLGETDRIVERCONTROLSTRINGQCOMPROC) get_proc("glGetDriverControlStringQCOM");
    gles2wEnableDriverControlQCOM = (PFNGLENABLEDRIVERCONTROLQCOMPROC) get_proc("glEnableDriverControlQCOM");
    gles2wDisableDriverControlQCOM = (PFNGLDISABLEDRIVERCONTROLQCOMPROC) get_proc("glDisableDriverControlQCOM");
    gles2wExtGetTexturesQCOM = (PFNGLEXTGETTEXTURESQCOMPROC) get_proc("glExtGetTexturesQCOM");
    gles2wExtGetBuffersQCOM = (PFNGLEXTGETBUFFERSQCOMPROC) get_proc("glExtGetBuffersQCOM");
    gles2wExtGetRenderbuffersQCOM = (PFNGLEXTGETRENDERBUFFERSQCOMPROC) get_proc("glExtGetRenderbuffersQCOM");
    gles2wExtGetFramebuffersQCOM = (PFNGLEXTGETFRAMEBUFFERSQCOMPROC) get_proc("glExtGetFramebuffersQCOM");
    gles2wExtGetTexLevelParameterivQCOM = (PFNGLEXTGETTEXLEVELPARAMETERIVQCOMPROC) get_proc("glExtGetTexLevelParameterivQCOM");
    gles2wExtTexObjectStateOverrideiQCOM = (PFNGLEXTTEXOBJECTSTATEOVERRIDEIQCOMPROC) get_proc("glExtTexObjectStateOverrideiQCOM");
    gles2wExtGetTexSubImageQCOM = (PFNGLEXTGETTEXSUBIMAGEQCOMPROC) get_proc("glExtGetTexSubImageQCOM");
    gles2wExtGetBufferPointervQCOM = (PFNGLEXTGETBUFFERPOINTERVQCOMPROC) get_proc("glExtGetBufferPointervQCOM");
    gles2wExtGetShadersQCOM = (PFNGLEXTGETSHADERSQCOMPROC) get_proc("glExtGetShadersQCOM");
    gles2wExtGetProgramsQCOM = (PFNGLEXTGETPROGRAMSQCOMPROC) get_proc("glExtGetProgramsQCOM");
    gles2wExtIsProgramBinaryQCOM = (PFNGLEXTISPROGRAMBINARYQCOMPROC) get_proc("glExtIsProgramBinaryQCOM");
    gles2wExtGetProgramBinarySourceQCOM = (PFNGLEXTGETPROGRAMBINARYSOURCEQCOMPROC) get_proc("glExtGetProgramBinarySourceQCOM");
    gles2wStartTilingQCOM = (PFNGLSTARTTILINGQCOMPROC) get_proc("glStartTilingQCOM");
    gles2wEndTilingQCOM = (PFNGLENDTILINGQCOMPROC) get_proc("glEndTilingQCOM");
}
