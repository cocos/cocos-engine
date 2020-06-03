#pragma once

#if defined(__APPLE__) || defined(__APPLE_CC__)
    #include <TargetConditionals.h>
    #if TARGET_OS_IPHONE
        #include <OpenGLES/ES2/gl.h>
    // Prevent Apple's non-standard extension header from being included
        #define __gl_es20ext_h_
    #else
        #include <GLES2/gl2.h>
    #endif
#else
    #include <GLES2/gl2.h>
#endif

#include <KHR/khrplatform.h>
#include <GLES2/gl2platform.h>
#include <GLES2/gl2ext.h>

typedef khronos_int64_t GLint64EXT;
typedef khronos_uint64_t GLuint64EXT;

#ifndef __gl2_h_
    #define __gl2_h_
#endif

#ifdef __cplusplus
extern "C" {
#endif

#ifndef GL_EXT_texture_sRGB
    #define GL_EXT_texture_sRGB 1

    #define GL_SRGB_EXT                            0x8C40
    #define GL_SRGB8_EXT                           0x8C41
    #define GL_SRGB_ALPHA_EXT                      0x8C42
    #define GL_SRGB8_ALPHA8_EXT                    0x8C43
    #define GL_SLUMINANCE_ALPHA_EXT                0x8C44
    #define GL_SLUMINANCE8_ALPHA8_EXT              0x8C45
    #define GL_SLUMINANCE_EXT                      0x8C46
    #define GL_SLUMINANCE8_EXT                     0x8C47
    #define GL_COMPRESSED_SRGB_EXT                 0x8C48
    #define GL_COMPRESSED_SRGB_ALPHA_EXT           0x8C49
    #define GL_COMPRESSED_SLUMINANCE_EXT           0x8C4A
    #define GL_COMPRESSED_SLUMINANCE_ALPHA_EXT     0x8C4B
    #define GL_COMPRESSED_SRGB_S3TC_DXT1_EXT       0x8C4C
    #define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT 0x8C4D
    #define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT 0x8C4E
    #define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT 0x8C4F

#endif /* GL_EXT_texture_sRGB */

/* gles2w api */
int gles2wInit(void);
int gles2wIsSupported(int major, int minor);
void *gles2wGetProcAddress(const char *proc);

/* OpenGL functions */
typedef void(GL_APIENTRY *PFNGLACTIVETEXTUREPROC)(GLenum texture);
typedef void(GL_APIENTRY *PFNGLATTACHSHADERPROC)(GLuint program, GLuint shader);
typedef void(GL_APIENTRY *PFNGLBINDATTRIBLOCATIONPROC)(GLuint program, GLuint index, const GLchar *name);
typedef void(GL_APIENTRY *PFNGLBINDBUFFERPROC)(GLenum target, GLuint buffer);
typedef void(GL_APIENTRY *PFNGLBINDFRAMEBUFFERPROC)(GLenum target, GLuint framebuffer);
typedef void(GL_APIENTRY *PFNGLBINDRENDERBUFFERPROC)(GLenum target, GLuint renderbuffer);
typedef void(GL_APIENTRY *PFNGLBINDTEXTUREPROC)(GLenum target, GLuint texture);
typedef void(GL_APIENTRY *PFNGLBLENDCOLORPROC)(GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha);
typedef void(GL_APIENTRY *PFNGLBLENDEQUATIONPROC)(GLenum mode);
typedef void(GL_APIENTRY *PFNGLBLENDEQUATIONSEPARATEPROC)(GLenum modeRGB, GLenum modeAlpha);
typedef void(GL_APIENTRY *PFNGLBLENDFUNCPROC)(GLenum sfactor, GLenum dfactor);
typedef void(GL_APIENTRY *PFNGLBLENDFUNCSEPARATEPROC)(GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha);
typedef void(GL_APIENTRY *PFNGLBUFFERDATAPROC)(GLenum target, GLsizeiptr size, const GLvoid *data, GLenum usage);
typedef void(GL_APIENTRY *PFNGLBUFFERSUBDATAPROC)(GLenum target, GLintptr offset, GLsizeiptr size, const GLvoid *data);
typedef GLenum(GL_APIENTRY *PFNGLCHECKFRAMEBUFFERSTATUSPROC)(GLenum target);
typedef void(GL_APIENTRY *PFNGLCLEARPROC)(GLbitfield mask);
typedef void(GL_APIENTRY *PFNGLCLEARCOLORPROC)(GLclampf red, GLclampf green, GLclampf blue, GLclampf alpha);
typedef void(GL_APIENTRY *PFNGLCLEARDEPTHFPROC)(GLclampf depth);
typedef void(GL_APIENTRY *PFNGLCLEARSTENCILPROC)(GLint s);
typedef void(GL_APIENTRY *PFNGLCOLORMASKPROC)(GLboolean red, GLboolean green, GLboolean blue, GLboolean alpha);
typedef void(GL_APIENTRY *PFNGLCOMPILESHADERPROC)(GLuint shader);
typedef void(GL_APIENTRY *PFNGLCOMPRESSEDTEXIMAGE2DPROC)(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLsizei imageSize, const GLvoid *data);
typedef void(GL_APIENTRY *PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLsizei width, GLsizei height, GLenum format, GLsizei imageSize, const GLvoid *data);
typedef void(GL_APIENTRY *PFNGLCOPYTEXIMAGE2DPROC)(GLenum target, GLint level, GLenum internalformat, GLint x, GLint y, GLsizei width, GLsizei height, GLint border);
typedef void(GL_APIENTRY *PFNGLCOPYTEXSUBIMAGE2DPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint x, GLint y, GLsizei width, GLsizei height);
typedef GLuint(GL_APIENTRY *PFNGLCREATEPROGRAMPROC)(void);
typedef GLuint(GL_APIENTRY *PFNGLCREATESHADERPROC)(GLenum type);
typedef void(GL_APIENTRY *PFNGLCULLFACEPROC)(GLenum mode);
typedef void(GL_APIENTRY *PFNGLDELETEBUFFERSPROC)(GLsizei n, const GLuint *buffers);
typedef void(GL_APIENTRY *PFNGLDELETEFRAMEBUFFERSPROC)(GLsizei n, const GLuint *framebuffers);
typedef void(GL_APIENTRY *PFNGLDELETEPROGRAMPROC)(GLuint program);
typedef void(GL_APIENTRY *PFNGLDELETERENDERBUFFERSPROC)(GLsizei n, const GLuint *renderbuffers);
typedef void(GL_APIENTRY *PFNGLDELETESHADERPROC)(GLuint shader);
typedef void(GL_APIENTRY *PFNGLDELETETEXTURESPROC)(GLsizei n, const GLuint *textures);
typedef void(GL_APIENTRY *PFNGLDEPTHFUNCPROC)(GLenum func);
typedef void(GL_APIENTRY *PFNGLDEPTHMASKPROC)(GLboolean flag);
typedef void(GL_APIENTRY *PFNGLDEPTHRANGEFPROC)(GLclampf zNear, GLclampf zFar);
typedef void(GL_APIENTRY *PFNGLDETACHSHADERPROC)(GLuint program, GLuint shader);
typedef void(GL_APIENTRY *PFNGLDISABLEPROC)(GLenum cap);
typedef void(GL_APIENTRY *PFNGLDISABLEVERTEXATTRIBARRAYPROC)(GLuint index);
typedef void(GL_APIENTRY *PFNGLDRAWARRAYSPROC)(GLenum mode, GLint first, GLsizei count);
typedef void(GL_APIENTRY *PFNGLDRAWELEMENTSPROC)(GLenum mode, GLsizei count, GLenum type, const GLvoid *indices);
typedef void(GL_APIENTRY *PFNGLENABLEPROC)(GLenum cap);
typedef void(GL_APIENTRY *PFNGLENABLEVERTEXATTRIBARRAYPROC)(GLuint index);
typedef void(GL_APIENTRY *PFNGLFINISHPROC)(void);
typedef void(GL_APIENTRY *PFNGLFLUSHPROC)(void);
typedef void(GL_APIENTRY *PFNGLFRAMEBUFFERRENDERBUFFERPROC)(GLenum target, GLenum attachment, GLenum renderbuffertarget, GLuint renderbuffer);
typedef void(GL_APIENTRY *PFNGLFRAMEBUFFERTEXTURE2DPROC)(GLenum target, GLenum attachment, GLenum textarget, GLuint texture, GLint level);
typedef void(GL_APIENTRY *PFNGLFRONTFACEPROC)(GLenum mode);
typedef void(GL_APIENTRY *PFNGLGENBUFFERSPROC)(GLsizei n, GLuint *buffers);
typedef void(GL_APIENTRY *PFNGLGENERATEMIPMAPPROC)(GLenum target);
typedef void(GL_APIENTRY *PFNGLGENFRAMEBUFFERSPROC)(GLsizei n, GLuint *framebuffers);
typedef void(GL_APIENTRY *PFNGLGENRENDERBUFFERSPROC)(GLsizei n, GLuint *renderbuffers);
typedef void(GL_APIENTRY *PFNGLGENTEXTURESPROC)(GLsizei n, GLuint *textures);
typedef void(GL_APIENTRY *PFNGLGETACTIVEATTRIBPROC)(GLuint program, GLuint index, GLsizei bufsize, GLsizei *length, GLint *size, GLenum *type, GLchar *name);
typedef void(GL_APIENTRY *PFNGLGETACTIVEUNIFORMPROC)(GLuint program, GLuint index, GLsizei bufsize, GLsizei *length, GLint *size, GLenum *type, GLchar *name);
typedef void(GL_APIENTRY *PFNGLGETATTACHEDSHADERSPROC)(GLuint program, GLsizei maxcount, GLsizei *count, GLuint *shaders);
typedef GLint(GL_APIENTRY *PFNGLGETATTRIBLOCATIONPROC)(GLuint program, const GLchar *name);
typedef void(GL_APIENTRY *PFNGLGETBOOLEANVPROC)(GLenum pname, GLboolean *params);
typedef void(GL_APIENTRY *PFNGLGETBUFFERPARAMETERIVPROC)(GLenum target, GLenum pname, GLint *params);
typedef GLenum(GL_APIENTRY *PFNGLGETERRORPROC)(void);
typedef void(GL_APIENTRY *PFNGLGETFLOATVPROC)(GLenum pname, GLfloat *params);
typedef void(GL_APIENTRY *PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC)(GLenum target, GLenum attachment, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETINTEGERVPROC)(GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETPROGRAMIVPROC)(GLuint program, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETPROGRAMINFOLOGPROC)(GLuint program, GLsizei bufsize, GLsizei *length, GLchar *infolog);
typedef void(GL_APIENTRY *PFNGLGETRENDERBUFFERPARAMETERIVPROC)(GLenum target, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETSHADERIVPROC)(GLuint shader, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETSHADERINFOLOGPROC)(GLuint shader, GLsizei bufsize, GLsizei *length, GLchar *infolog);
typedef void(GL_APIENTRY *PFNGLGETSHADERPRECISIONFORMATPROC)(GLenum shadertype, GLenum precisiontype, GLint *range, GLint *precision);
typedef void(GL_APIENTRY *PFNGLGETSHADERSOURCEPROC)(GLuint shader, GLsizei bufsize, GLsizei *length, GLchar *source);
typedef const GLubyte *(GL_APIENTRY *PFNGLGETSTRINGPROC)(GLenum name);
typedef void(GL_APIENTRY *PFNGLGETTEXPARAMETERFVPROC)(GLenum target, GLenum pname, GLfloat *params);
typedef void(GL_APIENTRY *PFNGLGETTEXPARAMETERIVPROC)(GLenum target, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETUNIFORMFVPROC)(GLuint program, GLint location, GLfloat *params);
typedef void(GL_APIENTRY *PFNGLGETUNIFORMIVPROC)(GLuint program, GLint location, GLint *params);
typedef GLint(GL_APIENTRY *PFNGLGETUNIFORMLOCATIONPROC)(GLuint program, const GLchar *name);
typedef void(GL_APIENTRY *PFNGLGETVERTEXATTRIBFVPROC)(GLuint index, GLenum pname, GLfloat *params);
typedef void(GL_APIENTRY *PFNGLGETVERTEXATTRIBIVPROC)(GLuint index, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETVERTEXATTRIBPOINTERVPROC)(GLuint index, GLenum pname, GLvoid **pointer);
typedef void(GL_APIENTRY *PFNGLHINTPROC)(GLenum target, GLenum mode);
typedef GLboolean(GL_APIENTRY *PFNGLISBUFFERPROC)(GLuint buffer);
typedef GLboolean(GL_APIENTRY *PFNGLISENABLEDPROC)(GLenum cap);
typedef GLboolean(GL_APIENTRY *PFNGLISFRAMEBUFFERPROC)(GLuint framebuffer);
typedef GLboolean(GL_APIENTRY *PFNGLISPROGRAMPROC)(GLuint program);
typedef GLboolean(GL_APIENTRY *PFNGLISRENDERBUFFERPROC)(GLuint renderbuffer);
typedef GLboolean(GL_APIENTRY *PFNGLISSHADERPROC)(GLuint shader);
typedef GLboolean(GL_APIENTRY *PFNGLISTEXTUREPROC)(GLuint texture);
typedef void(GL_APIENTRY *PFNGLLINEWIDTHPROC)(GLfloat width);
typedef void(GL_APIENTRY *PFNGLLINKPROGRAMPROC)(GLuint program);
typedef void(GL_APIENTRY *PFNGLPIXELSTOREIPROC)(GLenum pname, GLint param);
typedef void(GL_APIENTRY *PFNGLPOLYGONOFFSETPROC)(GLfloat factor, GLfloat units);
typedef void(GL_APIENTRY *PFNGLREADPIXELSPROC)(GLint x, GLint y, GLsizei width, GLsizei height, GLenum format, GLenum type, GLvoid *pixels);
typedef void(GL_APIENTRY *PFNGLRELEASESHADERCOMPILERPROC)(void);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEPROC)(GLenum target, GLenum internalformat, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLSAMPLECOVERAGEPROC)(GLclampf value, GLboolean invert);
typedef void(GL_APIENTRY *PFNGLSCISSORPROC)(GLint x, GLint y, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLSHADERBINARYPROC)(GLsizei n, const GLuint *shaders, GLenum binaryformat, const GLvoid *binary, GLsizei length);
typedef void(GL_APIENTRY *PFNGLSHADERSOURCEPROC)(GLuint shader, GLsizei count, const GLchar *const *string, const GLint *length);
typedef void(GL_APIENTRY *PFNGLSTENCILFUNCPROC)(GLenum func, GLint ref, GLuint mask);
typedef void(GL_APIENTRY *PFNGLSTENCILFUNCSEPARATEPROC)(GLenum face, GLenum func, GLint ref, GLuint mask);
typedef void(GL_APIENTRY *PFNGLSTENCILMASKPROC)(GLuint mask);
typedef void(GL_APIENTRY *PFNGLSTENCILMASKSEPARATEPROC)(GLenum face, GLuint mask);
typedef void(GL_APIENTRY *PFNGLSTENCILOPPROC)(GLenum fail, GLenum zfail, GLenum zpass);
typedef void(GL_APIENTRY *PFNGLSTENCILOPSEPARATEPROC)(GLenum face, GLenum fail, GLenum zfail, GLenum zpass);
typedef void(GL_APIENTRY *PFNGLTEXIMAGE2DPROC)(GLenum target, GLint level, GLint internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, const GLvoid *pixels);
typedef void(GL_APIENTRY *PFNGLTEXPARAMETERFPROC)(GLenum target, GLenum pname, GLfloat param);
typedef void(GL_APIENTRY *PFNGLTEXPARAMETERFVPROC)(GLenum target, GLenum pname, const GLfloat *params);
typedef void(GL_APIENTRY *PFNGLTEXPARAMETERIPROC)(GLenum target, GLenum pname, GLint param);
typedef void(GL_APIENTRY *PFNGLTEXPARAMETERIVPROC)(GLenum target, GLenum pname, const GLint *params);
typedef void(GL_APIENTRY *PFNGLTEXSUBIMAGE2DPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLsizei width, GLsizei height, GLenum format, GLenum type, const GLvoid *pixels);
typedef void(GL_APIENTRY *PFNGLUNIFORM1FPROC)(GLint location, GLfloat x);
typedef void(GL_APIENTRY *PFNGLUNIFORM1FVPROC)(GLint location, GLsizei count, const GLfloat *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM1IPROC)(GLint location, GLint x);
typedef void(GL_APIENTRY *PFNGLUNIFORM1IVPROC)(GLint location, GLsizei count, const GLint *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM2FPROC)(GLint location, GLfloat x, GLfloat y);
typedef void(GL_APIENTRY *PFNGLUNIFORM2FVPROC)(GLint location, GLsizei count, const GLfloat *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM2IPROC)(GLint location, GLint x, GLint y);
typedef void(GL_APIENTRY *PFNGLUNIFORM2IVPROC)(GLint location, GLsizei count, const GLint *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM3FPROC)(GLint location, GLfloat x, GLfloat y, GLfloat z);
typedef void(GL_APIENTRY *PFNGLUNIFORM3FVPROC)(GLint location, GLsizei count, const GLfloat *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM3IPROC)(GLint location, GLint x, GLint y, GLint z);
typedef void(GL_APIENTRY *PFNGLUNIFORM3IVPROC)(GLint location, GLsizei count, const GLint *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM4FPROC)(GLint location, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void(GL_APIENTRY *PFNGLUNIFORM4FVPROC)(GLint location, GLsizei count, const GLfloat *v);
typedef void(GL_APIENTRY *PFNGLUNIFORM4IPROC)(GLint location, GLint x, GLint y, GLint z, GLint w);
typedef void(GL_APIENTRY *PFNGLUNIFORM4IVPROC)(GLint location, GLsizei count, const GLint *v);
typedef void(GL_APIENTRY *PFNGLUNIFORMMATRIX2FVPROC)(GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLUNIFORMMATRIX3FVPROC)(GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLUNIFORMMATRIX4FVPROC)(GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLUSEPROGRAMPROC)(GLuint program);
typedef void(GL_APIENTRY *PFNGLVALIDATEPROGRAMPROC)(GLuint program);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB1FPROC)(GLuint indx, GLfloat x);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB1FVPROC)(GLuint indx, const GLfloat *values);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB2FPROC)(GLuint indx, GLfloat x, GLfloat y);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB2FVPROC)(GLuint indx, const GLfloat *values);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB3FPROC)(GLuint indx, GLfloat x, GLfloat y, GLfloat z);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB3FVPROC)(GLuint indx, const GLfloat *values);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB4FPROC)(GLuint indx, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIB4FVPROC)(GLuint indx, const GLfloat *values);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIBPOINTERPROC)(GLuint indx, GLint size, GLenum type, GLboolean normalized, GLsizei stride, const GLvoid *ptr);
typedef void(GL_APIENTRY *PFNGLVIEWPORTPROC)(GLint x, GLint y, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLEGLIMAGETARGETTEXTURE2DOESPROC)(GLenum target, GLeglImageOES image);
typedef void(GL_APIENTRY *PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC)(GLenum target, GLeglImageOES image);
typedef void(GL_APIENTRY *PFNGLGETPROGRAMBINARYOESPROC)(GLuint program, GLsizei bufSize, GLsizei *length, GLenum *binaryFormat, GLvoid *binary);
typedef void(GL_APIENTRY *PFNGLPROGRAMBINARYOESPROC)(GLuint program, GLenum binaryFormat, const GLvoid *binary, GLint length);
typedef void *(GL_APIENTRY *PFNGLMAPBUFFEROESPROC)(GLenum target, GLenum access);
typedef GLboolean(GL_APIENTRY *PFNGLUNMAPBUFFEROESPROC)(GLenum target);
typedef void(GL_APIENTRY *PFNGLGETBUFFERPOINTERVOESPROC)(GLenum target, GLenum pname, GLvoid **params);
typedef void(GL_APIENTRY *PFNGLTEXIMAGE3DOESPROC)(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth, GLint border, GLenum format, GLenum type, const GLvoid *pixels);
typedef void(GL_APIENTRY *PFNGLTEXSUBIMAGE3DOESPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLsizei width, GLsizei height, GLsizei depth, GLenum format, GLenum type, const GLvoid *pixels);
typedef void(GL_APIENTRY *PFNGLCOPYTEXSUBIMAGE3DOESPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLint x, GLint y, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLCOMPRESSEDTEXIMAGE3DOESPROC)(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth, GLint border, GLsizei imageSize, const GLvoid *data);
typedef void(GL_APIENTRY *PFNGLCOMPRESSEDTEXSUBIMAGE3DOESPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLsizei width, GLsizei height, GLsizei depth, GLenum format, GLsizei imageSize, const GLvoid *data);
typedef void(GL_APIENTRY *PFNGLFRAMEBUFFERTEXTURE3DOESPROC)(GLenum target, GLenum attachment, GLenum textarget, GLuint texture, GLint level, GLint zoffset);
typedef void(GL_APIENTRY *PFNGLBINDVERTEXARRAYOESPROC)(GLuint array);
typedef void(GL_APIENTRY *PFNGLDELETEVERTEXARRAYSOESPROC)(GLsizei n, const GLuint *arrays);
typedef void(GL_APIENTRY *PFNGLGENVERTEXARRAYSOESPROC)(GLsizei n, GLuint *arrays);
typedef GLboolean(GL_APIENTRY *PFNGLISVERTEXARRAYOESPROC)(GLuint array);
typedef void(GL_APIENTRY *PFNGLDEBUGMESSAGECONTROLKHRPROC)(GLenum source, GLenum type, GLenum severity, GLsizei count, const GLuint *ids, GLboolean enabled);
typedef void(GL_APIENTRY *PFNGLDEBUGMESSAGEINSERTKHRPROC)(GLenum source, GLenum type, GLuint id, GLenum severity, GLsizei length, const GLchar *buf);
typedef void(GL_APIENTRY *PFNGLDEBUGMESSAGECALLBACKKHRPROC)(GLDEBUGPROCKHR callback, const void *userParam);
typedef GLuint(GL_APIENTRY *PFNGLGETDEBUGMESSAGELOGKHRPROC)(GLuint count, GLsizei bufsize, GLenum *sources, GLenum *types, GLuint *ids, GLenum *severities, GLsizei *lengths, GLchar *messageLog);
typedef void(GL_APIENTRY *PFNGLPUSHDEBUGGROUPKHRPROC)(GLenum source, GLuint id, GLsizei length, const GLchar *message);
typedef void(GL_APIENTRY *PFNGLPOPDEBUGGROUPKHRPROC)(void);
typedef void(GL_APIENTRY *PFNGLOBJECTLABELKHRPROC)(GLenum identifier, GLuint name, GLsizei length, const GLchar *label);
typedef void(GL_APIENTRY *PFNGLGETOBJECTLABELKHRPROC)(GLenum identifier, GLuint name, GLsizei bufSize, GLsizei *length, GLchar *label);
typedef void(GL_APIENTRY *PFNGLOBJECTPTRLABELKHRPROC)(const void *ptr, GLsizei length, const GLchar *label);
typedef void(GL_APIENTRY *PFNGLGETOBJECTPTRLABELKHRPROC)(const void *ptr, GLsizei bufSize, GLsizei *length, GLchar *label);
typedef void(GL_APIENTRY *PFNGLGETPOINTERVKHRPROC)(GLenum pname, void **params);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORGROUPSAMDPROC)(GLint *numGroups, GLsizei groupsSize, GLuint *groups);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORCOUNTERSAMDPROC)(GLuint group, GLint *numCounters, GLint *maxActiveCounters, GLsizei counterSize, GLuint *counters);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORGROUPSTRINGAMDPROC)(GLuint group, GLsizei bufSize, GLsizei *length, GLchar *groupString);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC)(GLuint group, GLuint counter, GLsizei bufSize, GLsizei *length, GLchar *counterString);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORCOUNTERINFOAMDPROC)(GLuint group, GLuint counter, GLenum pname, GLvoid *data);
typedef void(GL_APIENTRY *PFNGLGENPERFMONITORSAMDPROC)(GLsizei n, GLuint *monitors);
typedef void(GL_APIENTRY *PFNGLDELETEPERFMONITORSAMDPROC)(GLsizei n, GLuint *monitors);
typedef void(GL_APIENTRY *PFNGLSELECTPERFMONITORCOUNTERSAMDPROC)(GLuint monitor, GLboolean enable, GLuint group, GLint numCounters, GLuint *countersList);
typedef void(GL_APIENTRY *PFNGLBEGINPERFMONITORAMDPROC)(GLuint monitor);
typedef void(GL_APIENTRY *PFNGLENDPERFMONITORAMDPROC)(GLuint monitor);
typedef void(GL_APIENTRY *PFNGLGETPERFMONITORCOUNTERDATAAMDPROC)(GLuint monitor, GLenum pname, GLsizei dataSize, GLuint *data, GLint *bytesWritten);
typedef void(GL_APIENTRY *PFNGLBLITFRAMEBUFFERANGLEPROC)(GLint srcX0, GLint srcY0, GLint srcX1, GLint srcY1, GLint dstX0, GLint dstY0, GLint dstX1, GLint dstY1, GLbitfield mask, GLenum filter);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEMULTISAMPLEANGLEPROC)(GLenum target, GLsizei samples, GLenum internalformat, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLDRAWARRAYSINSTANCEDANGLEPROC)(GLenum mode, GLint first, GLsizei count, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLDRAWELEMENTSINSTANCEDANGLEPROC)(GLenum mode, GLsizei count, GLenum type, const void *indices, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIBDIVISORANGLEPROC)(GLuint index, GLuint divisor);
typedef void(GL_APIENTRY *PFNGLGETTRANSLATEDSHADERSOURCEANGLEPROC)(GLuint shader, GLsizei bufsize, GLsizei *length, GLchar *source);
typedef void(GL_APIENTRY *PFNGLDRAWARRAYSINSTANCEDEXTPROC)(GLenum mode, GLint first, GLsizei count, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLDRAWELEMENTSINSTANCEDEXTPROC)(GLenum mode, GLsizei count, GLenum type, const void *indices, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIBDIVISOREXTPROC)(GLuint index, GLuint divisor);
typedef void(GL_APIENTRY *PFNGLCOPYTEXTURELEVELSAPPLEPROC)(GLuint destinationTexture, GLuint sourceTexture, GLint sourceBaseLevel, GLsizei sourceLevelCount);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEMULTISAMPLEAPPLEPROC)(GLenum, GLsizei, GLenum, GLsizei, GLsizei);
typedef void(GL_APIENTRY *PFNGLRESOLVEMULTISAMPLEFRAMEBUFFERAPPLEPROC)(void);
typedef GLsync(GL_APIENTRY *PFNGLFENCESYNCAPPLEPROC)(GLenum condition, GLbitfield flags);
typedef GLboolean(GL_APIENTRY *PFNGLISSYNCAPPLEPROC)(GLsync sync);
typedef void(GL_APIENTRY *PFNGLDELETESYNCAPPLEPROC)(GLsync sync);
typedef GLenum(GL_APIENTRY *PFNGLCLIENTWAITSYNCAPPLEPROC)(GLsync sync, GLbitfield flags, GLuint64 timeout);
typedef void(GL_APIENTRY *PFNGLWAITSYNCAPPLEPROC)(GLsync sync, GLbitfield flags, GLuint64 timeout);
typedef void(GL_APIENTRY *PFNGLGETINTEGER64VAPPLEPROC)(GLenum pname, GLint64 *params);
typedef void(GL_APIENTRY *PFNGLGETSYNCIVAPPLEPROC)(GLsync sync, GLenum pname, GLsizei bufSize, GLsizei *length, GLint *values);
typedef void(GL_APIENTRY *PFNGLLABELOBJECTEXTPROC)(GLenum type, GLuint object, GLsizei length, const GLchar *label);
typedef void(GL_APIENTRY *PFNGLGETOBJECTLABELEXTPROC)(GLenum type, GLuint object, GLsizei bufSize, GLsizei *length, GLchar *label);
typedef void(GL_APIENTRY *PFNGLINSERTEVENTMARKEREXTPROC)(GLsizei length, const GLchar *marker);
typedef void(GL_APIENTRY *PFNGLPUSHGROUPMARKEREXTPROC)(GLsizei length, const GLchar *marker);
typedef void(GL_APIENTRY *PFNGLPOPGROUPMARKEREXTPROC)(void);
typedef void(GL_APIENTRY *PFNGLDISCARDFRAMEBUFFEREXTPROC)(GLenum target, GLsizei numAttachments, const GLenum *attachments);
typedef void(GL_APIENTRY *PFNGLGENQUERIESEXTPROC)(GLsizei n, GLuint *ids);
typedef void(GL_APIENTRY *PFNGLDELETEQUERIESEXTPROC)(GLsizei n, const GLuint *ids);
typedef GLboolean(GL_APIENTRY *PFNGLISQUERYEXTPROC)(GLuint id);
typedef void(GL_APIENTRY *PFNGLBEGINQUERYEXTPROC)(GLenum target, GLuint id);
typedef void(GL_APIENTRY *PFNGLENDQUERYEXTPROC)(GLenum target);
typedef void(GL_APIENTRY *PFNGLQUERYCOUNTEREXTPROC)(GLuint id, GLenum target);
typedef void(GL_APIENTRY *PFNGLGETQUERYIVEXTPROC)(GLenum target, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETQUERYOBJECTIVEXTPROC)(GLuint id, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLGETQUERYOBJECTUIVEXTPROC)(GLuint id, GLenum pname, GLuint *params);
typedef void(GL_APIENTRY *PFNGLGETQUERYOBJECTI64VEXTPROC)(GLuint id, GLenum pname, GLint64EXT *params);
typedef void(GL_APIENTRY *PFNGLGETQUERYOBJECTUI64VEXTPROC)(GLuint id, GLenum pname, GLuint64EXT *params);
typedef void *(GL_APIENTRY *PFNGLMAPBUFFERRANGEEXTPROC)(GLenum target, GLintptr offset, GLsizeiptr length, GLbitfield access);
typedef void(GL_APIENTRY *PFNGLFLUSHMAPPEDBUFFERRANGEEXTPROC)(GLenum target, GLintptr offset, GLsizeiptr length);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC)(GLenum, GLsizei, GLenum, GLsizei, GLsizei);
typedef void(GL_APIENTRY *PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC)(GLenum, GLenum, GLenum, GLuint, GLint, GLsizei);
typedef void(GL_APIENTRY *PFNGLREADBUFFERINDEXEDEXTPROC)(GLenum src, GLint index);
typedef void(GL_APIENTRY *PFNGLDRAWBUFFERSINDEXEDEXTPROC)(GLint n, const GLenum *location, const GLint *indices);
typedef void(GL_APIENTRY *PFNGLGETINTEGERI_VEXTPROC)(GLenum target, GLuint index, GLint *data);
typedef void(GL_APIENTRY *PFNGLMULTIDRAWARRAYSEXTPROC)(GLenum, const GLint *, const GLsizei *, GLsizei);
//typedef void (GL_APIENTRY* PFNGLMULTIDRAWELEMENTSEXTPROC) (GLenum, const GLsizei *, GLenum, const GLvoid* *, GLsizei);
typedef GLenum(GL_APIENTRY *PFNGLGETGRAPHICSRESETSTATUSEXTPROC)(void);
typedef void(GL_APIENTRY *PFNGLREADNPIXELSEXTPROC)(GLint x, GLint y, GLsizei width, GLsizei height, GLenum format, GLenum type, GLsizei bufSize, void *data);
typedef void(GL_APIENTRY *PFNGLGETNUNIFORMFVEXTPROC)(GLuint program, GLint location, GLsizei bufSize, float *params);
typedef void(GL_APIENTRY *PFNGLGETNUNIFORMIVEXTPROC)(GLuint program, GLint location, GLsizei bufSize, GLint *params);
typedef void(GL_APIENTRY *PFNGLUSEPROGRAMSTAGESEXTPROC)(GLuint pipeline, GLbitfield stages, GLuint program);
typedef void(GL_APIENTRY *PFNGLACTIVESHADERPROGRAMEXTPROC)(GLuint pipeline, GLuint program);
typedef GLuint(GL_APIENTRY *PFNGLCREATESHADERPROGRAMVEXTPROC)(GLenum type, GLsizei count, const GLchar **strings);
typedef void(GL_APIENTRY *PFNGLBINDPROGRAMPIPELINEEXTPROC)(GLuint pipeline);
typedef void(GL_APIENTRY *PFNGLDELETEPROGRAMPIPELINESEXTPROC)(GLsizei n, const GLuint *pipelines);
typedef void(GL_APIENTRY *PFNGLGENPROGRAMPIPELINESEXTPROC)(GLsizei n, GLuint *pipelines);
typedef GLboolean(GL_APIENTRY *PFNGLISPROGRAMPIPELINEEXTPROC)(GLuint pipeline);
typedef void(GL_APIENTRY *PFNGLPROGRAMPARAMETERIEXTPROC)(GLuint program, GLenum pname, GLint value);
typedef void(GL_APIENTRY *PFNGLGETPROGRAMPIPELINEIVEXTPROC)(GLuint pipeline, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM1IEXTPROC)(GLuint program, GLint location, GLint x);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM2IEXTPROC)(GLuint program, GLint location, GLint x, GLint y);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM3IEXTPROC)(GLuint program, GLint location, GLint x, GLint y, GLint z);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM4IEXTPROC)(GLuint program, GLint location, GLint x, GLint y, GLint z, GLint w);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM1FEXTPROC)(GLuint program, GLint location, GLfloat x);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM2FEXTPROC)(GLuint program, GLint location, GLfloat x, GLfloat y);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM3FEXTPROC)(GLuint program, GLint location, GLfloat x, GLfloat y, GLfloat z);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM4FEXTPROC)(GLuint program, GLint location, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM1IVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM2IVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM3IVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM4IVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM1FVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM2FVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM3FVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORM4FVEXTPROC)(GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC)(GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC)(GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC)(GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void(GL_APIENTRY *PFNGLVALIDATEPROGRAMPIPELINEEXTPROC)(GLuint pipeline);
typedef void(GL_APIENTRY *PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC)(GLuint pipeline, GLsizei bufSize, GLsizei *length, GLchar *infoLog);
typedef void(GL_APIENTRY *PFNGLTEXSTORAGE1DEXTPROC)(GLenum target, GLsizei levels, GLenum internalformat, GLsizei width);
typedef void(GL_APIENTRY *PFNGLTEXSTORAGE2DEXTPROC)(GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLTEXSTORAGE3DEXTPROC)(GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth);
typedef void(GL_APIENTRY *PFNGLTEXTURESTORAGE1DEXTPROC)(GLuint texture, GLenum target, GLsizei levels, GLenum internalformat, GLsizei width);
typedef void(GL_APIENTRY *PFNGLTEXTURESTORAGE2DEXTPROC)(GLuint texture, GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLTEXTURESTORAGE3DEXTPROC)(GLuint texture, GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEMULTISAMPLEIMGPROC)(GLenum, GLsizei, GLenum, GLsizei, GLsizei);
typedef void(GL_APIENTRY *PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC)(GLenum, GLenum, GLenum, GLuint, GLint, GLsizei);
typedef void(GL_APIENTRY *PFNGLCOVERAGEMASKNVPROC)(GLboolean mask);
typedef void(GL_APIENTRY *PFNGLCOVERAGEOPERATIONNVPROC)(GLenum operation);
typedef void(GL_APIENTRY *PFNGLDRAWBUFFERSNVPROC)(GLsizei n, const GLenum *bufs);
typedef void(GL_APIENTRY *PFNGLDRAWARRAYSINSTANCEDNVPROC)(GLenum mode, GLint first, GLsizei count, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLDRAWELEMENTSINSTANCEDNVPROC)(GLenum mode, GLsizei count, GLenum type, const GLvoid *indices, GLsizei primcount);
typedef void(GL_APIENTRY *PFNGLDELETEFENCESNVPROC)(GLsizei, const GLuint *);
typedef void(GL_APIENTRY *PFNGLGENFENCESNVPROC)(GLsizei, GLuint *);
typedef GLboolean(GL_APIENTRY *PFNGLISFENCENVPROC)(GLuint);
typedef GLboolean(GL_APIENTRY *PFNGLTESTFENCENVPROC)(GLuint);
typedef void(GL_APIENTRY *PFNGLGETFENCEIVNVPROC)(GLuint, GLenum, GLint *);
typedef void(GL_APIENTRY *PFNGLFINISHFENCENVPROC)(GLuint);
typedef void(GL_APIENTRY *PFNGLSETFENCENVPROC)(GLuint, GLenum);
typedef void(GL_APIENTRY *PFNGLBLITFRAMEBUFFERNVPROC)(int srcX0, GLint srcY0, GLint srcX1, GLint srcY1, GLint dstX0, GLint dstY0, GLint dstX1, GLint dstY1, GLbitfield mask, GLenum filter);
typedef void(GL_APIENTRY *PFNGLRENDERBUFFERSTORAGEMULTISAMPLENVPROC)(GLenum target, GLsizei samples, GLenum internalformat, GLsizei width, GLsizei height);
typedef void(GL_APIENTRY *PFNGLVERTEXATTRIBDIVISORNVPROC)(GLuint index, GLuint divisor);
typedef void(GL_APIENTRY *PFNGLREADBUFFERNVPROC)(GLenum mode);
typedef void(GL_APIENTRY *PFNGLALPHAFUNCQCOMPROC)(GLenum func, GLclampf ref);
typedef void(GL_APIENTRY *PFNGLGETDRIVERCONTROLSQCOMPROC)(GLint *num, GLsizei size, GLuint *driverControls);
typedef void(GL_APIENTRY *PFNGLGETDRIVERCONTROLSTRINGQCOMPROC)(GLuint driverControl, GLsizei bufSize, GLsizei *length, GLchar *driverControlString);
typedef void(GL_APIENTRY *PFNGLENABLEDRIVERCONTROLQCOMPROC)(GLuint driverControl);
typedef void(GL_APIENTRY *PFNGLDISABLEDRIVERCONTROLQCOMPROC)(GLuint driverControl);
typedef void(GL_APIENTRY *PFNGLEXTGETTEXTURESQCOMPROC)(GLuint *textures, GLint maxTextures, GLint *numTextures);
typedef void(GL_APIENTRY *PFNGLEXTGETBUFFERSQCOMPROC)(GLuint *buffers, GLint maxBuffers, GLint *numBuffers);
typedef void(GL_APIENTRY *PFNGLEXTGETRENDERBUFFERSQCOMPROC)(GLuint *renderbuffers, GLint maxRenderbuffers, GLint *numRenderbuffers);
typedef void(GL_APIENTRY *PFNGLEXTGETFRAMEBUFFERSQCOMPROC)(GLuint *framebuffers, GLint maxFramebuffers, GLint *numFramebuffers);
typedef void(GL_APIENTRY *PFNGLEXTGETTEXLEVELPARAMETERIVQCOMPROC)(GLuint texture, GLenum face, GLint level, GLenum pname, GLint *params);
typedef void(GL_APIENTRY *PFNGLEXTTEXOBJECTSTATEOVERRIDEIQCOMPROC)(GLenum target, GLenum pname, GLint param);
typedef void(GL_APIENTRY *PFNGLEXTGETTEXSUBIMAGEQCOMPROC)(GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLsizei width, GLsizei height, GLsizei depth, GLenum format, GLenum type, GLvoid *texels);
typedef void(GL_APIENTRY *PFNGLEXTGETBUFFERPOINTERVQCOMPROC)(GLenum target, GLvoid **params);
typedef void(GL_APIENTRY *PFNGLEXTGETSHADERSQCOMPROC)(GLuint *shaders, GLint maxShaders, GLint *numShaders);
typedef void(GL_APIENTRY *PFNGLEXTGETPROGRAMSQCOMPROC)(GLuint *programs, GLint maxPrograms, GLint *numPrograms);
typedef GLboolean(GL_APIENTRY *PFNGLEXTISPROGRAMBINARYQCOMPROC)(GLuint program);
typedef void(GL_APIENTRY *PFNGLEXTGETPROGRAMBINARYSOURCEQCOMPROC)(GLuint program, GLenum shadertype, GLchar *source, GLint *length);
typedef void(GL_APIENTRY *PFNGLSTARTTILINGQCOMPROC)(GLuint x, GLuint y, GLuint width, GLuint height, GLbitfield preserveMask);
typedef void(GL_APIENTRY *PFNGLENDTILINGQCOMPROC)(GLbitfield preserveMask);

extern PFNGLACTIVETEXTUREPROC gles2wActiveTexture;
extern PFNGLATTACHSHADERPROC gles2wAttachShader;
extern PFNGLBINDATTRIBLOCATIONPROC gles2wBindAttribLocation;
extern PFNGLBINDBUFFERPROC gles2wBindBuffer;
extern PFNGLBINDFRAMEBUFFERPROC gles2wBindFramebuffer;
extern PFNGLBINDRENDERBUFFERPROC gles2wBindRenderbuffer;
extern PFNGLBINDTEXTUREPROC gles2wBindTexture;
extern PFNGLBLENDCOLORPROC gles2wBlendColor;
extern PFNGLBLENDEQUATIONPROC gles2wBlendEquation;
extern PFNGLBLENDEQUATIONSEPARATEPROC gles2wBlendEquationSeparate;
extern PFNGLBLENDFUNCPROC gles2wBlendFunc;
extern PFNGLBLENDFUNCSEPARATEPROC gles2wBlendFuncSeparate;
extern PFNGLBUFFERDATAPROC gles2wBufferData;
extern PFNGLBUFFERSUBDATAPROC gles2wBufferSubData;
extern PFNGLCHECKFRAMEBUFFERSTATUSPROC gles2wCheckFramebufferStatus;
extern PFNGLCLEARPROC gles2wClear;
extern PFNGLCLEARCOLORPROC gles2wClearColor;
extern PFNGLCLEARDEPTHFPROC gles2wClearDepthf;
extern PFNGLCLEARSTENCILPROC gles2wClearStencil;
extern PFNGLCOLORMASKPROC gles2wColorMask;
extern PFNGLCOMPILESHADERPROC gles2wCompileShader;
extern PFNGLCOMPRESSEDTEXIMAGE2DPROC gles2wCompressedTexImage2D;
extern PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC gles2wCompressedTexSubImage2D;
extern PFNGLCOPYTEXIMAGE2DPROC gles2wCopyTexImage2D;
extern PFNGLCOPYTEXSUBIMAGE2DPROC gles2wCopyTexSubImage2D;
extern PFNGLCREATEPROGRAMPROC gles2wCreateProgram;
extern PFNGLCREATESHADERPROC gles2wCreateShader;
extern PFNGLCULLFACEPROC gles2wCullFace;
extern PFNGLDELETEBUFFERSPROC gles2wDeleteBuffers;
extern PFNGLDELETEFRAMEBUFFERSPROC gles2wDeleteFramebuffers;
extern PFNGLDELETEPROGRAMPROC gles2wDeleteProgram;
extern PFNGLDELETERENDERBUFFERSPROC gles2wDeleteRenderbuffers;
extern PFNGLDELETESHADERPROC gles2wDeleteShader;
extern PFNGLDELETETEXTURESPROC gles2wDeleteTextures;
extern PFNGLDEPTHFUNCPROC gles2wDepthFunc;
extern PFNGLDEPTHMASKPROC gles2wDepthMask;
extern PFNGLDEPTHRANGEFPROC gles2wDepthRangef;
extern PFNGLDETACHSHADERPROC gles2wDetachShader;
extern PFNGLDISABLEPROC gles2wDisable;
extern PFNGLDISABLEVERTEXATTRIBARRAYPROC gles2wDisableVertexAttribArray;
extern PFNGLDRAWARRAYSPROC gles2wDrawArrays;
extern PFNGLDRAWELEMENTSPROC gles2wDrawElements;
extern PFNGLENABLEPROC gles2wEnable;
extern PFNGLENABLEVERTEXATTRIBARRAYPROC gles2wEnableVertexAttribArray;
extern PFNGLFINISHPROC gles2wFinish;
extern PFNGLFLUSHPROC gles2wFlush;
extern PFNGLFRAMEBUFFERRENDERBUFFERPROC gles2wFramebufferRenderbuffer;
extern PFNGLFRAMEBUFFERTEXTURE2DPROC gles2wFramebufferTexture2D;
extern PFNGLFRONTFACEPROC gles2wFrontFace;
extern PFNGLGENBUFFERSPROC gles2wGenBuffers;
extern PFNGLGENERATEMIPMAPPROC gles2wGenerateMipmap;
extern PFNGLGENFRAMEBUFFERSPROC gles2wGenFramebuffers;
extern PFNGLGENRENDERBUFFERSPROC gles2wGenRenderbuffers;
extern PFNGLGENTEXTURESPROC gles2wGenTextures;
extern PFNGLGETACTIVEATTRIBPROC gles2wGetActiveAttrib;
extern PFNGLGETACTIVEUNIFORMPROC gles2wGetActiveUniform;
extern PFNGLGETATTACHEDSHADERSPROC gles2wGetAttachedShaders;
extern PFNGLGETATTRIBLOCATIONPROC gles2wGetAttribLocation;
extern PFNGLGETBOOLEANVPROC gles2wGetBooleanv;
extern PFNGLGETBUFFERPARAMETERIVPROC gles2wGetBufferParameteriv;
extern PFNGLGETERRORPROC gles2wGetError;
extern PFNGLGETFLOATVPROC gles2wGetFloatv;
extern PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC gles2wGetFramebufferAttachmentParameteriv;
extern PFNGLGETINTEGERVPROC gles2wGetIntegerv;
extern PFNGLGETPROGRAMIVPROC gles2wGetProgramiv;
extern PFNGLGETPROGRAMINFOLOGPROC gles2wGetProgramInfoLog;
extern PFNGLGETRENDERBUFFERPARAMETERIVPROC gles2wGetRenderbufferParameteriv;
extern PFNGLGETSHADERIVPROC gles2wGetShaderiv;
extern PFNGLGETSHADERINFOLOGPROC gles2wGetShaderInfoLog;
extern PFNGLGETSHADERPRECISIONFORMATPROC gles2wGetShaderPrecisionFormat;
extern PFNGLGETSHADERSOURCEPROC gles2wGetShaderSource;
extern PFNGLGETSTRINGPROC gles2wGetString;
extern PFNGLGETTEXPARAMETERFVPROC gles2wGetTexParameterfv;
extern PFNGLGETTEXPARAMETERIVPROC gles2wGetTexParameteriv;
extern PFNGLGETUNIFORMFVPROC gles2wGetUniformfv;
extern PFNGLGETUNIFORMIVPROC gles2wGetUniformiv;
extern PFNGLGETUNIFORMLOCATIONPROC gles2wGetUniformLocation;
extern PFNGLGETVERTEXATTRIBFVPROC gles2wGetVertexAttribfv;
extern PFNGLGETVERTEXATTRIBIVPROC gles2wGetVertexAttribiv;
extern PFNGLGETVERTEXATTRIBPOINTERVPROC gles2wGetVertexAttribPointerv;
extern PFNGLHINTPROC gles2wHint;
extern PFNGLISBUFFERPROC gles2wIsBuffer;
extern PFNGLISENABLEDPROC gles2wIsEnabled;
extern PFNGLISFRAMEBUFFERPROC gles2wIsFramebuffer;
extern PFNGLISPROGRAMPROC gles2wIsProgram;
extern PFNGLISRENDERBUFFERPROC gles2wIsRenderbuffer;
extern PFNGLISSHADERPROC gles2wIsShader;
extern PFNGLISTEXTUREPROC gles2wIsTexture;
extern PFNGLLINEWIDTHPROC gles2wLineWidth;
extern PFNGLLINKPROGRAMPROC gles2wLinkProgram;
extern PFNGLPIXELSTOREIPROC gles2wPixelStorei;
extern PFNGLPOLYGONOFFSETPROC gles2wPolygonOffset;
extern PFNGLREADPIXELSPROC gles2wReadPixels;
extern PFNGLRELEASESHADERCOMPILERPROC gles2wReleaseShaderCompiler;
extern PFNGLRENDERBUFFERSTORAGEPROC gles2wRenderbufferStorage;
extern PFNGLSAMPLECOVERAGEPROC gles2wSampleCoverage;
extern PFNGLSCISSORPROC gles2wScissor;
extern PFNGLSHADERBINARYPROC gles2wShaderBinary;
extern PFNGLSHADERSOURCEPROC gles2wShaderSource;
extern PFNGLSTENCILFUNCPROC gles2wStencilFunc;
extern PFNGLSTENCILFUNCSEPARATEPROC gles2wStencilFuncSeparate;
extern PFNGLSTENCILMASKPROC gles2wStencilMask;
extern PFNGLSTENCILMASKSEPARATEPROC gles2wStencilMaskSeparate;
extern PFNGLSTENCILOPPROC gles2wStencilOp;
extern PFNGLSTENCILOPSEPARATEPROC gles2wStencilOpSeparate;
extern PFNGLTEXIMAGE2DPROC gles2wTexImage2D;
extern PFNGLTEXPARAMETERFPROC gles2wTexParameterf;
extern PFNGLTEXPARAMETERFVPROC gles2wTexParameterfv;
extern PFNGLTEXPARAMETERIPROC gles2wTexParameteri;
extern PFNGLTEXPARAMETERIVPROC gles2wTexParameteriv;
extern PFNGLTEXSUBIMAGE2DPROC gles2wTexSubImage2D;
extern PFNGLUNIFORM1FPROC gles2wUniform1f;
extern PFNGLUNIFORM1FVPROC gles2wUniform1fv;
extern PFNGLUNIFORM1IPROC gles2wUniform1i;
extern PFNGLUNIFORM1IVPROC gles2wUniform1iv;
extern PFNGLUNIFORM2FPROC gles2wUniform2f;
extern PFNGLUNIFORM2FVPROC gles2wUniform2fv;
extern PFNGLUNIFORM2IPROC gles2wUniform2i;
extern PFNGLUNIFORM2IVPROC gles2wUniform2iv;
extern PFNGLUNIFORM3FPROC gles2wUniform3f;
extern PFNGLUNIFORM3FVPROC gles2wUniform3fv;
extern PFNGLUNIFORM3IPROC gles2wUniform3i;
extern PFNGLUNIFORM3IVPROC gles2wUniform3iv;
extern PFNGLUNIFORM4FPROC gles2wUniform4f;
extern PFNGLUNIFORM4FVPROC gles2wUniform4fv;
extern PFNGLUNIFORM4IPROC gles2wUniform4i;
extern PFNGLUNIFORM4IVPROC gles2wUniform4iv;
extern PFNGLUNIFORMMATRIX2FVPROC gles2wUniformMatrix2fv;
extern PFNGLUNIFORMMATRIX3FVPROC gles2wUniformMatrix3fv;
extern PFNGLUNIFORMMATRIX4FVPROC gles2wUniformMatrix4fv;
extern PFNGLUSEPROGRAMPROC gles2wUseProgram;
extern PFNGLVALIDATEPROGRAMPROC gles2wValidateProgram;
extern PFNGLVERTEXATTRIB1FPROC gles2wVertexAttrib1f;
extern PFNGLVERTEXATTRIB1FVPROC gles2wVertexAttrib1fv;
extern PFNGLVERTEXATTRIB2FPROC gles2wVertexAttrib2f;
extern PFNGLVERTEXATTRIB2FVPROC gles2wVertexAttrib2fv;
extern PFNGLVERTEXATTRIB3FPROC gles2wVertexAttrib3f;
extern PFNGLVERTEXATTRIB3FVPROC gles2wVertexAttrib3fv;
extern PFNGLVERTEXATTRIB4FPROC gles2wVertexAttrib4f;
extern PFNGLVERTEXATTRIB4FVPROC gles2wVertexAttrib4fv;
extern PFNGLVERTEXATTRIBPOINTERPROC gles2wVertexAttribPointer;
extern PFNGLVIEWPORTPROC gles2wViewport;
extern PFNGLEGLIMAGETARGETTEXTURE2DOESPROC gles2wEGLImageTargetTexture2DOES;
extern PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC gles2wEGLImageTargetRenderbufferStorageOES;
extern PFNGLGETPROGRAMBINARYOESPROC gles2wGetProgramBinaryOES;
extern PFNGLPROGRAMBINARYOESPROC gles2wProgramBinaryOES;
extern PFNGLMAPBUFFEROESPROC gles2wMapBufferOES;
extern PFNGLUNMAPBUFFEROESPROC gles2wUnmapBufferOES;
extern PFNGLGETBUFFERPOINTERVOESPROC gles2wGetBufferPointervOES;
extern PFNGLTEXIMAGE3DOESPROC gles2wTexImage3DOES;
extern PFNGLTEXSUBIMAGE3DOESPROC gles2wTexSubImage3DOES;
extern PFNGLCOPYTEXSUBIMAGE3DOESPROC gles2wCopyTexSubImage3DOES;
extern PFNGLCOMPRESSEDTEXIMAGE3DOESPROC gles2wCompressedTexImage3DOES;
extern PFNGLCOMPRESSEDTEXSUBIMAGE3DOESPROC gles2wCompressedTexSubImage3DOES;
extern PFNGLFRAMEBUFFERTEXTURE3DOESPROC gles2wFramebufferTexture3DOES;
extern PFNGLBINDVERTEXARRAYOESPROC gles2wBindVertexArrayOES;
extern PFNGLDELETEVERTEXARRAYSOESPROC gles2wDeleteVertexArraysOES;
extern PFNGLGENVERTEXARRAYSOESPROC gles2wGenVertexArraysOES;
extern PFNGLISVERTEXARRAYOESPROC gles2wIsVertexArrayOES;
extern PFNGLDEBUGMESSAGECONTROLKHRPROC gles2wDebugMessageControlKHR;
extern PFNGLDEBUGMESSAGEINSERTKHRPROC gles2wDebugMessageInsertKHR;
extern PFNGLDEBUGMESSAGECALLBACKKHRPROC gles2wDebugMessageCallbackKHR;
extern PFNGLGETDEBUGMESSAGELOGKHRPROC gles2wGetDebugMessageLogKHR;
extern PFNGLPUSHDEBUGGROUPKHRPROC gles2wPushDebugGroupKHR;
extern PFNGLPOPDEBUGGROUPKHRPROC gles2wPopDebugGroupKHR;
extern PFNGLOBJECTLABELKHRPROC gles2wObjectLabelKHR;
extern PFNGLGETOBJECTLABELKHRPROC gles2wGetObjectLabelKHR;
extern PFNGLOBJECTPTRLABELKHRPROC gles2wObjectPtrLabelKHR;
extern PFNGLGETOBJECTPTRLABELKHRPROC gles2wGetObjectPtrLabelKHR;
extern PFNGLGETPOINTERVKHRPROC gles2wGetPointervKHR;
extern PFNGLGETPERFMONITORGROUPSAMDPROC gles2wGetPerfMonitorGroupsAMD;
extern PFNGLGETPERFMONITORCOUNTERSAMDPROC gles2wGetPerfMonitorCountersAMD;
extern PFNGLGETPERFMONITORGROUPSTRINGAMDPROC gles2wGetPerfMonitorGroupStringAMD;
extern PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC gles2wGetPerfMonitorCounterStringAMD;
extern PFNGLGETPERFMONITORCOUNTERINFOAMDPROC gles2wGetPerfMonitorCounterInfoAMD;
extern PFNGLGENPERFMONITORSAMDPROC gles2wGenPerfMonitorsAMD;
extern PFNGLDELETEPERFMONITORSAMDPROC gles2wDeletePerfMonitorsAMD;
extern PFNGLSELECTPERFMONITORCOUNTERSAMDPROC gles2wSelectPerfMonitorCountersAMD;
extern PFNGLBEGINPERFMONITORAMDPROC gles2wBeginPerfMonitorAMD;
extern PFNGLENDPERFMONITORAMDPROC gles2wEndPerfMonitorAMD;
extern PFNGLGETPERFMONITORCOUNTERDATAAMDPROC gles2wGetPerfMonitorCounterDataAMD;
extern PFNGLBLITFRAMEBUFFERANGLEPROC gles2wBlitFramebufferANGLE;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEANGLEPROC gles2wRenderbufferStorageMultisampleANGLE;
extern PFNGLDRAWARRAYSINSTANCEDANGLEPROC gles2wDrawArraysInstancedANGLE;
extern PFNGLDRAWELEMENTSINSTANCEDANGLEPROC gles2wDrawElementsInstancedANGLE;
extern PFNGLVERTEXATTRIBDIVISORANGLEPROC gles2wVertexAttribDivisorANGLE;
extern PFNGLGETTRANSLATEDSHADERSOURCEANGLEPROC gles2wGetTranslatedShaderSourceANGLE;
extern PFNGLDRAWARRAYSINSTANCEDEXTPROC gles2wDrawArraysInstancedEXT;
extern PFNGLDRAWELEMENTSINSTANCEDEXTPROC gles2wDrawElementsInstancedEXT;
extern PFNGLVERTEXATTRIBDIVISOREXTPROC gles2wVertexAttribDivisorEXT;
extern PFNGLCOPYTEXTURELEVELSAPPLEPROC gles2wCopyTextureLevelsAPPLE;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEAPPLEPROC gles2wRenderbufferStorageMultisampleAPPLE;
extern PFNGLRESOLVEMULTISAMPLEFRAMEBUFFERAPPLEPROC gles2wResolveMultisampleFramebufferAPPLE;
extern PFNGLFENCESYNCAPPLEPROC gles2wFenceSyncAPPLE;
extern PFNGLISSYNCAPPLEPROC gles2wIsSyncAPPLE;
extern PFNGLDELETESYNCAPPLEPROC gles2wDeleteSyncAPPLE;
extern PFNGLCLIENTWAITSYNCAPPLEPROC gles2wClientWaitSyncAPPLE;
extern PFNGLWAITSYNCAPPLEPROC gles2wWaitSyncAPPLE;
extern PFNGLGETINTEGER64VAPPLEPROC gles2wGetInteger64vAPPLE;
extern PFNGLGETSYNCIVAPPLEPROC gles2wGetSyncivAPPLE;
extern PFNGLLABELOBJECTEXTPROC gles2wLabelObjectEXT;
extern PFNGLGETOBJECTLABELEXTPROC gles2wGetObjectLabelEXT;
extern PFNGLINSERTEVENTMARKEREXTPROC gles2wInsertEventMarkerEXT;
extern PFNGLPUSHGROUPMARKEREXTPROC gles2wPushGroupMarkerEXT;
extern PFNGLPOPGROUPMARKEREXTPROC gles2wPopGroupMarkerEXT;
extern PFNGLDISCARDFRAMEBUFFEREXTPROC gles2wDiscardFramebufferEXT;
extern PFNGLGENQUERIESEXTPROC gles2wGenQueriesEXT;
extern PFNGLDELETEQUERIESEXTPROC gles2wDeleteQueriesEXT;
extern PFNGLISQUERYEXTPROC gles2wIsQueryEXT;
extern PFNGLBEGINQUERYEXTPROC gles2wBeginQueryEXT;
extern PFNGLENDQUERYEXTPROC gles2wEndQueryEXT;
extern PFNGLQUERYCOUNTEREXTPROC gles2wQueryCounterEXT;
extern PFNGLGETQUERYIVEXTPROC gles2wGetQueryivEXT;
extern PFNGLGETQUERYOBJECTIVEXTPROC gles2wGetQueryObjectivEXT;
extern PFNGLGETQUERYOBJECTUIVEXTPROC gles2wGetQueryObjectuivEXT;
extern PFNGLGETQUERYOBJECTI64VEXTPROC gles2wGetQueryObjecti64vEXT;
extern PFNGLGETQUERYOBJECTUI64VEXTPROC gles2wGetQueryObjectui64vEXT;
extern PFNGLMAPBUFFERRANGEEXTPROC gles2wMapBufferRangeEXT;
extern PFNGLFLUSHMAPPEDBUFFERRANGEEXTPROC gles2wFlushMappedBufferRangeEXT;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC gles2wRenderbufferStorageMultisampleEXT;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC gles2wFramebufferTexture2DMultisampleEXT;
extern PFNGLREADBUFFERINDEXEDEXTPROC gles2wReadBufferIndexedEXT;
extern PFNGLDRAWBUFFERSINDEXEDEXTPROC gles2wDrawBuffersIndexedEXT;
extern PFNGLGETINTEGERI_VEXTPROC gles2wGetIntegeri_vEXT;
extern PFNGLMULTIDRAWARRAYSEXTPROC gles2wMultiDrawArraysEXT;
extern PFNGLMULTIDRAWELEMENTSEXTPROC gles2wMultiDrawElementsEXT;
extern PFNGLGETGRAPHICSRESETSTATUSEXTPROC gles2wGetGraphicsResetStatusEXT;
extern PFNGLREADNPIXELSEXTPROC gles2wReadnPixelsEXT;
extern PFNGLGETNUNIFORMFVEXTPROC gles2wGetnUniformfvEXT;
extern PFNGLGETNUNIFORMIVEXTPROC gles2wGetnUniformivEXT;
extern PFNGLUSEPROGRAMSTAGESEXTPROC gles2wUseProgramStagesEXT;
extern PFNGLACTIVESHADERPROGRAMEXTPROC gles2wActiveShaderProgramEXT;
extern PFNGLCREATESHADERPROGRAMVEXTPROC gles2wCreateShaderProgramvEXT;
extern PFNGLBINDPROGRAMPIPELINEEXTPROC gles2wBindProgramPipelineEXT;
extern PFNGLDELETEPROGRAMPIPELINESEXTPROC gles2wDeleteProgramPipelinesEXT;
extern PFNGLGENPROGRAMPIPELINESEXTPROC gles2wGenProgramPipelinesEXT;
extern PFNGLISPROGRAMPIPELINEEXTPROC gles2wIsProgramPipelineEXT;
extern PFNGLPROGRAMPARAMETERIEXTPROC gles2wProgramParameteriEXT;
extern PFNGLGETPROGRAMPIPELINEIVEXTPROC gles2wGetProgramPipelineivEXT;
extern PFNGLPROGRAMUNIFORM1IEXTPROC gles2wProgramUniform1iEXT;
extern PFNGLPROGRAMUNIFORM2IEXTPROC gles2wProgramUniform2iEXT;
extern PFNGLPROGRAMUNIFORM3IEXTPROC gles2wProgramUniform3iEXT;
extern PFNGLPROGRAMUNIFORM4IEXTPROC gles2wProgramUniform4iEXT;
extern PFNGLPROGRAMUNIFORM1FEXTPROC gles2wProgramUniform1fEXT;
extern PFNGLPROGRAMUNIFORM2FEXTPROC gles2wProgramUniform2fEXT;
extern PFNGLPROGRAMUNIFORM3FEXTPROC gles2wProgramUniform3fEXT;
extern PFNGLPROGRAMUNIFORM4FEXTPROC gles2wProgramUniform4fEXT;
extern PFNGLPROGRAMUNIFORM1IVEXTPROC gles2wProgramUniform1ivEXT;
extern PFNGLPROGRAMUNIFORM2IVEXTPROC gles2wProgramUniform2ivEXT;
extern PFNGLPROGRAMUNIFORM3IVEXTPROC gles2wProgramUniform3ivEXT;
extern PFNGLPROGRAMUNIFORM4IVEXTPROC gles2wProgramUniform4ivEXT;
extern PFNGLPROGRAMUNIFORM1FVEXTPROC gles2wProgramUniform1fvEXT;
extern PFNGLPROGRAMUNIFORM2FVEXTPROC gles2wProgramUniform2fvEXT;
extern PFNGLPROGRAMUNIFORM3FVEXTPROC gles2wProgramUniform3fvEXT;
extern PFNGLPROGRAMUNIFORM4FVEXTPROC gles2wProgramUniform4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC gles2wProgramUniformMatrix2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC gles2wProgramUniformMatrix3fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC gles2wProgramUniformMatrix4fvEXT;
extern PFNGLVALIDATEPROGRAMPIPELINEEXTPROC gles2wValidateProgramPipelineEXT;
extern PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC gles2wGetProgramPipelineInfoLogEXT;
extern PFNGLTEXSTORAGE1DEXTPROC gles2wTexStorage1DEXT;
extern PFNGLTEXSTORAGE2DEXTPROC gles2wTexStorage2DEXT;
extern PFNGLTEXSTORAGE3DEXTPROC gles2wTexStorage3DEXT;
extern PFNGLTEXTURESTORAGE1DEXTPROC gles2wTextureStorage1DEXT;
extern PFNGLTEXTURESTORAGE2DEXTPROC gles2wTextureStorage2DEXT;
extern PFNGLTEXTURESTORAGE3DEXTPROC gles2wTextureStorage3DEXT;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEIMGPROC gles2wRenderbufferStorageMultisampleIMG;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC gles2wFramebufferTexture2DMultisampleIMG;
extern PFNGLCOVERAGEMASKNVPROC gles2wCoverageMaskNV;
extern PFNGLCOVERAGEOPERATIONNVPROC gles2wCoverageOperationNV;
extern PFNGLDRAWBUFFERSNVPROC gles2wDrawBuffersNV;
extern PFNGLDRAWARRAYSINSTANCEDNVPROC gles2wDrawArraysInstancedNV;
extern PFNGLDRAWELEMENTSINSTANCEDNVPROC gles2wDrawElementsInstancedNV;
extern PFNGLDELETEFENCESNVPROC gles2wDeleteFencesNV;
extern PFNGLGENFENCESNVPROC gles2wGenFencesNV;
extern PFNGLISFENCENVPROC gles2wIsFenceNV;
extern PFNGLTESTFENCENVPROC gles2wTestFenceNV;
extern PFNGLGETFENCEIVNVPROC gles2wGetFenceivNV;
extern PFNGLFINISHFENCENVPROC gles2wFinishFenceNV;
extern PFNGLSETFENCENVPROC gles2wSetFenceNV;
extern PFNGLBLITFRAMEBUFFERNVPROC gles2wBlitFramebufferNV;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLENVPROC gles2wRenderbufferStorageMultisampleNV;
extern PFNGLVERTEXATTRIBDIVISORNVPROC gles2wVertexAttribDivisorNV;
extern PFNGLREADBUFFERNVPROC gles2wReadBufferNV;
extern PFNGLALPHAFUNCQCOMPROC gles2wAlphaFuncQCOM;
extern PFNGLGETDRIVERCONTROLSQCOMPROC gles2wGetDriverControlsQCOM;
extern PFNGLGETDRIVERCONTROLSTRINGQCOMPROC gles2wGetDriverControlStringQCOM;
extern PFNGLENABLEDRIVERCONTROLQCOMPROC gles2wEnableDriverControlQCOM;
extern PFNGLDISABLEDRIVERCONTROLQCOMPROC gles2wDisableDriverControlQCOM;
extern PFNGLEXTGETTEXTURESQCOMPROC gles2wExtGetTexturesQCOM;
extern PFNGLEXTGETBUFFERSQCOMPROC gles2wExtGetBuffersQCOM;
extern PFNGLEXTGETRENDERBUFFERSQCOMPROC gles2wExtGetRenderbuffersQCOM;
extern PFNGLEXTGETFRAMEBUFFERSQCOMPROC gles2wExtGetFramebuffersQCOM;
extern PFNGLEXTGETTEXLEVELPARAMETERIVQCOMPROC gles2wExtGetTexLevelParameterivQCOM;
extern PFNGLEXTTEXOBJECTSTATEOVERRIDEIQCOMPROC gles2wExtTexObjectStateOverrideiQCOM;
extern PFNGLEXTGETTEXSUBIMAGEQCOMPROC gles2wExtGetTexSubImageQCOM;
extern PFNGLEXTGETBUFFERPOINTERVQCOMPROC gles2wExtGetBufferPointervQCOM;
extern PFNGLEXTGETSHADERSQCOMPROC gles2wExtGetShadersQCOM;
extern PFNGLEXTGETPROGRAMSQCOMPROC gles2wExtGetProgramsQCOM;
extern PFNGLEXTISPROGRAMBINARYQCOMPROC gles2wExtIsProgramBinaryQCOM;
extern PFNGLEXTGETPROGRAMBINARYSOURCEQCOMPROC gles2wExtGetProgramBinarySourceQCOM;
extern PFNGLSTARTTILINGQCOMPROC gles2wStartTilingQCOM;
extern PFNGLENDTILINGQCOMPROC gles2wEndTilingQCOM;

#define glActiveTexture                        gles2wActiveTexture
#define glAttachShader                         gles2wAttachShader
#define glBindAttribLocation                   gles2wBindAttribLocation
#define glBindBuffer                           gles2wBindBuffer
#define glBindFramebuffer                      gles2wBindFramebuffer
#define glBindRenderbuffer                     gles2wBindRenderbuffer
#define glBindTexture                          gles2wBindTexture
#define glBlendColor                           gles2wBlendColor
#define glBlendEquation                        gles2wBlendEquation
#define glBlendEquationSeparate                gles2wBlendEquationSeparate
#define glBlendFunc                            gles2wBlendFunc
#define glBlendFuncSeparate                    gles2wBlendFuncSeparate
#define glBufferData                           gles2wBufferData
#define glBufferSubData                        gles2wBufferSubData
#define glCheckFramebufferStatus               gles2wCheckFramebufferStatus
#define glClear                                gles2wClear
#define glClearColor                           gles2wClearColor
#define glClearDepthf                          gles2wClearDepthf
#define glClearStencil                         gles2wClearStencil
#define glColorMask                            gles2wColorMask
#define glCompileShader                        gles2wCompileShader
#define glCompressedTexImage2D                 gles2wCompressedTexImage2D
#define glCompressedTexSubImage2D              gles2wCompressedTexSubImage2D
#define glCopyTexImage2D                       gles2wCopyTexImage2D
#define glCopyTexSubImage2D                    gles2wCopyTexSubImage2D
#define glCreateProgram                        gles2wCreateProgram
#define glCreateShader                         gles2wCreateShader
#define glCullFace                             gles2wCullFace
#define glDeleteBuffers                        gles2wDeleteBuffers
#define glDeleteFramebuffers                   gles2wDeleteFramebuffers
#define glDeleteProgram                        gles2wDeleteProgram
#define glDeleteRenderbuffers                  gles2wDeleteRenderbuffers
#define glDeleteShader                         gles2wDeleteShader
#define glDeleteTextures                       gles2wDeleteTextures
#define glDepthFunc                            gles2wDepthFunc
#define glDepthMask                            gles2wDepthMask
#define glDepthRangef                          gles2wDepthRangef
#define glDetachShader                         gles2wDetachShader
#define glDisable                              gles2wDisable
#define glDisableVertexAttribArray             gles2wDisableVertexAttribArray
#define glDrawArrays                           gles2wDrawArrays
#define glDrawElements                         gles2wDrawElements
#define glEnable                               gles2wEnable
#define glEnableVertexAttribArray              gles2wEnableVertexAttribArray
#define glFinish                               gles2wFinish
#define glFlush                                gles2wFlush
#define glFramebufferRenderbuffer              gles2wFramebufferRenderbuffer
#define glFramebufferTexture2D                 gles2wFramebufferTexture2D
#define glFrontFace                            gles2wFrontFace
#define glGenBuffers                           gles2wGenBuffers
#define glGenerateMipmap                       gles2wGenerateMipmap
#define glGenFramebuffers                      gles2wGenFramebuffers
#define glGenRenderbuffers                     gles2wGenRenderbuffers
#define glGenTextures                          gles2wGenTextures
#define glGetActiveAttrib                      gles2wGetActiveAttrib
#define glGetActiveUniform                     gles2wGetActiveUniform
#define glGetAttachedShaders                   gles2wGetAttachedShaders
#define glGetAttribLocation                    gles2wGetAttribLocation
#define glGetBooleanv                          gles2wGetBooleanv
#define glGetBufferParameteriv                 gles2wGetBufferParameteriv
#define glGetError                             gles2wGetError
#define glGetFloatv                            gles2wGetFloatv
#define glGetFramebufferAttachmentParameteriv  gles2wGetFramebufferAttachmentParameteriv
#define glGetIntegerv                          gles2wGetIntegerv
#define glGetProgramiv                         gles2wGetProgramiv
#define glGetProgramInfoLog                    gles2wGetProgramInfoLog
#define glGetRenderbufferParameteriv           gles2wGetRenderbufferParameteriv
#define glGetShaderiv                          gles2wGetShaderiv
#define glGetShaderInfoLog                     gles2wGetShaderInfoLog
#define glGetShaderPrecisionFormat             gles2wGetShaderPrecisionFormat
#define glGetShaderSource                      gles2wGetShaderSource
#define glGetString                            gles2wGetString
#define glGetTexParameterfv                    gles2wGetTexParameterfv
#define glGetTexParameteriv                    gles2wGetTexParameteriv
#define glGetUniformfv                         gles2wGetUniformfv
#define glGetUniformiv                         gles2wGetUniformiv
#define glGetUniformLocation                   gles2wGetUniformLocation
#define glGetVertexAttribfv                    gles2wGetVertexAttribfv
#define glGetVertexAttribiv                    gles2wGetVertexAttribiv
#define glGetVertexAttribPointerv              gles2wGetVertexAttribPointerv
#define glHint                                 gles2wHint
#define glIsBuffer                             gles2wIsBuffer
#define glIsEnabled                            gles2wIsEnabled
#define glIsFramebuffer                        gles2wIsFramebuffer
#define glIsProgram                            gles2wIsProgram
#define glIsRenderbuffer                       gles2wIsRenderbuffer
#define glIsShader                             gles2wIsShader
#define glIsTexture                            gles2wIsTexture
#define glLineWidth                            gles2wLineWidth
#define glLinkProgram                          gles2wLinkProgram
#define glPixelStorei                          gles2wPixelStorei
#define glPolygonOffset                        gles2wPolygonOffset
#define glReadPixels                           gles2wReadPixels
#define glReleaseShaderCompiler                gles2wReleaseShaderCompiler
#define glRenderbufferStorage                  gles2wRenderbufferStorage
#define glSampleCoverage                       gles2wSampleCoverage
#define glScissor                              gles2wScissor
#define glShaderBinary                         gles2wShaderBinary
#define glShaderSource                         gles2wShaderSource
#define glStencilFunc                          gles2wStencilFunc
#define glStencilFuncSeparate                  gles2wStencilFuncSeparate
#define glStencilMask                          gles2wStencilMask
#define glStencilMaskSeparate                  gles2wStencilMaskSeparate
#define glStencilOp                            gles2wStencilOp
#define glStencilOpSeparate                    gles2wStencilOpSeparate
#define glTexImage2D                           gles2wTexImage2D
#define glTexParameterf                        gles2wTexParameterf
#define glTexParameterfv                       gles2wTexParameterfv
#define glTexParameteri                        gles2wTexParameteri
#define glTexParameteriv                       gles2wTexParameteriv
#define glTexSubImage2D                        gles2wTexSubImage2D
#define glUniform1f                            gles2wUniform1f
#define glUniform1fv                           gles2wUniform1fv
#define glUniform1i                            gles2wUniform1i
#define glUniform1iv                           gles2wUniform1iv
#define glUniform2f                            gles2wUniform2f
#define glUniform2fv                           gles2wUniform2fv
#define glUniform2i                            gles2wUniform2i
#define glUniform2iv                           gles2wUniform2iv
#define glUniform3f                            gles2wUniform3f
#define glUniform3fv                           gles2wUniform3fv
#define glUniform3i                            gles2wUniform3i
#define glUniform3iv                           gles2wUniform3iv
#define glUniform4f                            gles2wUniform4f
#define glUniform4fv                           gles2wUniform4fv
#define glUniform4i                            gles2wUniform4i
#define glUniform4iv                           gles2wUniform4iv
#define glUniformMatrix2fv                     gles2wUniformMatrix2fv
#define glUniformMatrix3fv                     gles2wUniformMatrix3fv
#define glUniformMatrix4fv                     gles2wUniformMatrix4fv
#define glUseProgram                           gles2wUseProgram
#define glValidateProgram                      gles2wValidateProgram
#define glVertexAttrib1f                       gles2wVertexAttrib1f
#define glVertexAttrib1fv                      gles2wVertexAttrib1fv
#define glVertexAttrib2f                       gles2wVertexAttrib2f
#define glVertexAttrib2fv                      gles2wVertexAttrib2fv
#define glVertexAttrib3f                       gles2wVertexAttrib3f
#define glVertexAttrib3fv                      gles2wVertexAttrib3fv
#define glVertexAttrib4f                       gles2wVertexAttrib4f
#define glVertexAttrib4fv                      gles2wVertexAttrib4fv
#define glVertexAttribPointer                  gles2wVertexAttribPointer
#define glViewport                             gles2wViewport
#define glEGLImageTargetTexture2DOES           gles2wEGLImageTargetTexture2DOES
#define glEGLImageTargetRenderbufferStorageOES gles2wEGLImageTargetRenderbufferStorageOES
#define glGetProgramBinaryOES                  gles2wGetProgramBinaryOES
#define glProgramBinaryOES                     gles2wProgramBinaryOES
#define glMapBufferOES                         gles2wMapBufferOES
#define glUnmapBufferOES                       gles2wUnmapBufferOES
#define glGetBufferPointervOES                 gles2wGetBufferPointervOES
#define glTexImage3DOES                        gles2wTexImage3DOES
#define glTexSubImage3DOES                     gles2wTexSubImage3DOES
#define glCopyTexSubImage3DOES                 gles2wCopyTexSubImage3DOES
#define glCompressedTexImage3DOES              gles2wCompressedTexImage3DOES
#define glCompressedTexSubImage3DOES           gles2wCompressedTexSubImage3DOES
#define glFramebufferTexture3DOES              gles2wFramebufferTexture3DOES
#define glBindVertexArrayOES                   gles2wBindVertexArrayOES
#define glDeleteVertexArraysOES                gles2wDeleteVertexArraysOES
#define glGenVertexArraysOES                   gles2wGenVertexArraysOES
#define glIsVertexArrayOES                     gles2wIsVertexArrayOES
#define glDebugMessageControlKHR               gles2wDebugMessageControlKHR
#define glDebugMessageInsertKHR                gles2wDebugMessageInsertKHR
#define glDebugMessageCallbackKHR              gles2wDebugMessageCallbackKHR
#define glGetDebugMessageLogKHR                gles2wGetDebugMessageLogKHR
#define glPushDebugGroupKHR                    gles2wPushDebugGroupKHR
#define glPopDebugGroupKHR                     gles2wPopDebugGroupKHR
#define glObjectLabelKHR                       gles2wObjectLabelKHR
#define glGetObjectLabelKHR                    gles2wGetObjectLabelKHR
#define glObjectPtrLabelKHR                    gles2wObjectPtrLabelKHR
#define glGetObjectPtrLabelKHR                 gles2wGetObjectPtrLabelKHR
#define glGetPointervKHR                       gles2wGetPointervKHR
#define glGetPerfMonitorGroupsAMD              gles2wGetPerfMonitorGroupsAMD
#define glGetPerfMonitorCountersAMD            gles2wGetPerfMonitorCountersAMD
#define glGetPerfMonitorGroupStringAMD         gles2wGetPerfMonitorGroupStringAMD
#define glGetPerfMonitorCounterStringAMD       gles2wGetPerfMonitorCounterStringAMD
#define glGetPerfMonitorCounterInfoAMD         gles2wGetPerfMonitorCounterInfoAMD
#define glGenPerfMonitorsAMD                   gles2wGenPerfMonitorsAMD
#define glDeletePerfMonitorsAMD                gles2wDeletePerfMonitorsAMD
#define glSelectPerfMonitorCountersAMD         gles2wSelectPerfMonitorCountersAMD
#define glBeginPerfMonitorAMD                  gles2wBeginPerfMonitorAMD
#define glEndPerfMonitorAMD                    gles2wEndPerfMonitorAMD
#define glGetPerfMonitorCounterDataAMD         gles2wGetPerfMonitorCounterDataAMD
#define glBlitFramebufferANGLE                 gles2wBlitFramebufferANGLE
#define glRenderbufferStorageMultisampleANGLE  gles2wRenderbufferStorageMultisampleANGLE
#define glDrawArraysInstancedANGLE             gles2wDrawArraysInstancedANGLE
#define glDrawElementsInstancedANGLE           gles2wDrawElementsInstancedANGLE
#define glVertexAttribDivisorANGLE             gles2wVertexAttribDivisorANGLE
#define glGetTranslatedShaderSourceANGLE       gles2wGetTranslatedShaderSourceANGLE
#define glDrawArraysInstancedEXT               gles2wDrawArraysInstancedEXT
#define glDrawElementsInstancedEXT             gles2wDrawElementsInstancedEXT
#define glVertexAttribDivisorEXT               gles2wVertexAttribDivisorEXT
#define glCopyTextureLevelsAPPLE               gles2wCopyTextureLevelsAPPLE
#define glRenderbufferStorageMultisampleAPPLE  gles2wRenderbufferStorageMultisampleAPPLE
#define glResolveMultisampleFramebufferAPPLE   gles2wResolveMultisampleFramebufferAPPLE
#define glFenceSyncAPPLE                       gles2wFenceSyncAPPLE
#define glIsSyncAPPLE                          gles2wIsSyncAPPLE
#define glDeleteSyncAPPLE                      gles2wDeleteSyncAPPLE
#define glClientWaitSyncAPPLE                  gles2wClientWaitSyncAPPLE
#define glWaitSyncAPPLE                        gles2wWaitSyncAPPLE
#define glGetInteger64vAPPLE                   gles2wGetInteger64vAPPLE
#define glGetSyncivAPPLE                       gles2wGetSyncivAPPLE
#define glLabelObjectEXT                       gles2wLabelObjectEXT
#define glGetObjectLabelEXT                    gles2wGetObjectLabelEXT
#define glInsertEventMarkerEXT                 gles2wInsertEventMarkerEXT
#define glPushGroupMarkerEXT                   gles2wPushGroupMarkerEXT
#define glPopGroupMarkerEXT                    gles2wPopGroupMarkerEXT
#define glDiscardFramebufferEXT                gles2wDiscardFramebufferEXT
#define glGenQueriesEXT                        gles2wGenQueriesEXT
#define glDeleteQueriesEXT                     gles2wDeleteQueriesEXT
#define glIsQueryEXT                           gles2wIsQueryEXT
#define glBeginQueryEXT                        gles2wBeginQueryEXT
#define glEndQueryEXT                          gles2wEndQueryEXT
#define glQueryCounterEXT                      gles2wQueryCounterEXT
#define glGetQueryivEXT                        gles2wGetQueryivEXT
#define glGetQueryObjectivEXT                  gles2wGetQueryObjectivEXT
#define glGetQueryObjectuivEXT                 gles2wGetQueryObjectuivEXT
#define glGetQueryObjecti64vEXT                gles2wGetQueryObjecti64vEXT
#define glGetQueryObjectui64vEXT               gles2wGetQueryObjectui64vEXT
#define glMapBufferRangeEXT                    gles2wMapBufferRangeEXT
#define glFlushMappedBufferRangeEXT            gles2wFlushMappedBufferRangeEXT
#define glRenderbufferStorageMultisampleEXT    gles2wRenderbufferStorageMultisampleEXT
#define glFramebufferTexture2DMultisampleEXT   gles2wFramebufferTexture2DMultisampleEXT
#define glReadBufferIndexedEXT                 gles2wReadBufferIndexedEXT
#define glDrawBuffersIndexedEXT                gles2wDrawBuffersIndexedEXT
#define glGetIntegeri_vEXT                     gles2wGetIntegeri_vEXT
#define glMultiDrawArraysEXT                   gles2wMultiDrawArraysEXT
#define glMultiDrawElementsEXT                 gles2wMultiDrawElementsEXT
#define glGetGraphicsResetStatusEXT            gles2wGetGraphicsResetStatusEXT
#define glReadnPixelsEXT                       gles2wReadnPixelsEXT
#define glGetnUniformfvEXT                     gles2wGetnUniformfvEXT
#define glGetnUniformivEXT                     gles2wGetnUniformivEXT
#define glUseProgramStagesEXT                  gles2wUseProgramStagesEXT
#define glActiveShaderProgramEXT               gles2wActiveShaderProgramEXT
#define glCreateShaderProgramvEXT              gles2wCreateShaderProgramvEXT
#define glBindProgramPipelineEXT               gles2wBindProgramPipelineEXT
#define glDeleteProgramPipelinesEXT            gles2wDeleteProgramPipelinesEXT
#define glGenProgramPipelinesEXT               gles2wGenProgramPipelinesEXT
#define glIsProgramPipelineEXT                 gles2wIsProgramPipelineEXT
#define glProgramParameteriEXT                 gles2wProgramParameteriEXT
#define glGetProgramPipelineivEXT              gles2wGetProgramPipelineivEXT
#define glProgramUniform1iEXT                  gles2wProgramUniform1iEXT
#define glProgramUniform2iEXT                  gles2wProgramUniform2iEXT
#define glProgramUniform3iEXT                  gles2wProgramUniform3iEXT
#define glProgramUniform4iEXT                  gles2wProgramUniform4iEXT
#define glProgramUniform1fEXT                  gles2wProgramUniform1fEXT
#define glProgramUniform2fEXT                  gles2wProgramUniform2fEXT
#define glProgramUniform3fEXT                  gles2wProgramUniform3fEXT
#define glProgramUniform4fEXT                  gles2wProgramUniform4fEXT
#define glProgramUniform1ivEXT                 gles2wProgramUniform1ivEXT
#define glProgramUniform2ivEXT                 gles2wProgramUniform2ivEXT
#define glProgramUniform3ivEXT                 gles2wProgramUniform3ivEXT
#define glProgramUniform4ivEXT                 gles2wProgramUniform4ivEXT
#define glProgramUniform1fvEXT                 gles2wProgramUniform1fvEXT
#define glProgramUniform2fvEXT                 gles2wProgramUniform2fvEXT
#define glProgramUniform3fvEXT                 gles2wProgramUniform3fvEXT
#define glProgramUniform4fvEXT                 gles2wProgramUniform4fvEXT
#define glProgramUniformMatrix2fvEXT           gles2wProgramUniformMatrix2fvEXT
#define glProgramUniformMatrix3fvEXT           gles2wProgramUniformMatrix3fvEXT
#define glProgramUniformMatrix4fvEXT           gles2wProgramUniformMatrix4fvEXT
#define glValidateProgramPipelineEXT           gles2wValidateProgramPipelineEXT
#define glGetProgramPipelineInfoLogEXT         gles2wGetProgramPipelineInfoLogEXT
#define glTexStorage1DEXT                      gles2wTexStorage1DEXT
#define glTexStorage2DEXT                      gles2wTexStorage2DEXT
#define glTexStorage3DEXT                      gles2wTexStorage3DEXT
#define glTextureStorage1DEXT                  gles2wTextureStorage1DEXT
#define glTextureStorage2DEXT                  gles2wTextureStorage2DEXT
#define glTextureStorage3DEXT                  gles2wTextureStorage3DEXT
#define glRenderbufferStorageMultisampleIMG    gles2wRenderbufferStorageMultisampleIMG
#define glFramebufferTexture2DMultisampleIMG   gles2wFramebufferTexture2DMultisampleIMG
#define glCoverageMaskNV                       gles2wCoverageMaskNV
#define glCoverageOperationNV                  gles2wCoverageOperationNV
#define glDrawBuffersNV                        gles2wDrawBuffersNV
#define glDrawArraysInstancedNV                gles2wDrawArraysInstancedNV
#define glDrawElementsInstancedNV              gles2wDrawElementsInstancedNV
#define glDeleteFencesNV                       gles2wDeleteFencesNV
#define glGenFencesNV                          gles2wGenFencesNV
#define glIsFenceNV                            gles2wIsFenceNV
#define glTestFenceNV                          gles2wTestFenceNV
#define glGetFenceivNV                         gles2wGetFenceivNV
#define glFinishFenceNV                        gles2wFinishFenceNV
#define glSetFenceNV                           gles2wSetFenceNV
#define glBlitFramebufferNV                    gles2wBlitFramebufferNV
#define glRenderbufferStorageMultisampleNV     gles2wRenderbufferStorageMultisampleNV
#define glVertexAttribDivisorNV                gles2wVertexAttribDivisorNV
#define glReadBufferNV                         gles2wReadBufferNV
#define glAlphaFuncQCOM                        gles2wAlphaFuncQCOM
#define glGetDriverControlsQCOM                gles2wGetDriverControlsQCOM
#define glGetDriverControlStringQCOM           gles2wGetDriverControlStringQCOM
#define glEnableDriverControlQCOM              gles2wEnableDriverControlQCOM
#define glDisableDriverControlQCOM             gles2wDisableDriverControlQCOM
#define glExtGetTexturesQCOM                   gles2wExtGetTexturesQCOM
#define glExtGetBuffersQCOM                    gles2wExtGetBuffersQCOM
#define glExtGetRenderbuffersQCOM              gles2wExtGetRenderbuffersQCOM
#define glExtGetFramebuffersQCOM               gles2wExtGetFramebuffersQCOM
#define glExtGetTexLevelParameterivQCOM        gles2wExtGetTexLevelParameterivQCOM
#define glExtTexObjectStateOverrideiQCOM       gles2wExtTexObjectStateOverrideiQCOM
#define glExtGetTexSubImageQCOM                gles2wExtGetTexSubImageQCOM
#define glExtGetBufferPointervQCOM             gles2wExtGetBufferPointervQCOM
#define glExtGetShadersQCOM                    gles2wExtGetShadersQCOM
#define glExtGetProgramsQCOM                   gles2wExtGetProgramsQCOM
#define glExtIsProgramBinaryQCOM               gles2wExtIsProgramBinaryQCOM
#define glExtGetProgramBinarySourceQCOM        gles2wExtGetProgramBinarySourceQCOM
#define glStartTilingQCOM                      gles2wStartTilingQCOM
#define glEndTilingQCOM                        gles2wEndTilingQCOM

#ifdef __cplusplus
}
#endif
