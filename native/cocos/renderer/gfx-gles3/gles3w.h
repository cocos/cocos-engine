#pragma once

#if defined(__APPLE__) || defined(__APPLE_CC__)
    #include <TargetConditionals.h>
    #if TARGET_OS_IPHONE
        #   include <OpenGLES/ES3/gl.h>
            // Prevent Apple's non-standard extension header from being included
        #   define __gl_es30ext_h_
    #endif
#else
    #   include <GLES3/gl3.h>
#endif

#include <KHR/khrplatform.h>
#include <GLES3/gl3platform.h>
#include <GLES2/gl2ext.h>
#include <GLES3/gl3ext.h>

#ifndef __gl3_h_
#define __gl3_h_
#endif

#ifdef __cplusplus
extern "C" {
#endif
  
#ifndef GL_EXT_texture_sRGB
#define GL_EXT_texture_sRGB 1
  
#define GL_SRGB_EXT 0x8C40
#define GL_SRGB8_EXT 0x8C41
#define GL_SRGB_ALPHA_EXT 0x8C42
#define GL_SRGB8_ALPHA8_EXT 0x8C43
#define GL_SLUMINANCE_ALPHA_EXT 0x8C44
#define GL_SLUMINANCE8_ALPHA8_EXT 0x8C45
#define GL_SLUMINANCE_EXT 0x8C46
#define GL_SLUMINANCE8_EXT 0x8C47
#define GL_COMPRESSED_SRGB_EXT 0x8C48
#define GL_COMPRESSED_SRGB_ALPHA_EXT 0x8C49
#define GL_COMPRESSED_SLUMINANCE_EXT 0x8C4A
#define GL_COMPRESSED_SLUMINANCE_ALPHA_EXT 0x8C4B
#define GL_COMPRESSED_SRGB_S3TC_DXT1_EXT 0x8C4C
#define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT 0x8C4D
#define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT 0x8C4E
#define GL_COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT 0x8C4F
  
#endif /* GL_EXT_texture_sRGB */

/* gles3w api */
int gles3wInit();
int gles3wIsSupported(int major, int minor);
void *gles3wGetProcAddress(const char *proc);

/* OpenGL functions */
typedef void           (GL_APIENTRY* PFNGLACTIVETEXTUREPROC) (GLenum texture);
typedef void           (GL_APIENTRY* PFNGLATTACHSHADERPROC) (GLuint program, GLuint shader);
typedef void           (GL_APIENTRY* PFNGLBINDATTRIBLOCATIONPROC) (GLuint program, GLuint index, const GLchar* name);
typedef void           (GL_APIENTRY* PFNGLBINDBUFFERPROC) (GLenum target, GLuint buffer);
typedef void           (GL_APIENTRY* PFNGLBINDFRAMEBUFFERPROC) (GLenum target, GLuint framebuffer);
typedef void           (GL_APIENTRY* PFNGLBINDRENDERBUFFERPROC) (GLenum target, GLuint renderbuffer);
typedef void           (GL_APIENTRY* PFNGLBINDTEXTUREPROC) (GLenum target, GLuint texture);
typedef void           (GL_APIENTRY* PFNGLBLENDCOLORPROC) (GLfloat red, GLfloat green, GLfloat blue, GLfloat alpha);
typedef void           (GL_APIENTRY* PFNGLBLENDEQUATIONPROC) (GLenum mode);
typedef void           (GL_APIENTRY* PFNGLBLENDEQUATIONSEPARATEPROC) (GLenum modeRGB, GLenum modeAlpha);
typedef void           (GL_APIENTRY* PFNGLBLENDFUNCPROC) (GLenum sfactor, GLenum dfactor);
typedef void           (GL_APIENTRY* PFNGLBLENDFUNCSEPARATEPROC) (GLenum srcRGB, GLenum dstRGB, GLenum srcAlpha, GLenum dstAlpha);
typedef void           (GL_APIENTRY* PFNGLBUFFERDATAPROC) (GLenum target, GLsizeiptr size, const GLvoid* data, GLenum usage);
typedef void           (GL_APIENTRY* PFNGLBUFFERSUBDATAPROC) (GLenum target, GLintptr offset, GLsizeiptr size, const GLvoid* data);
typedef GLenum         (GL_APIENTRY* PFNGLCHECKFRAMEBUFFERSTATUSPROC) (GLenum target);
typedef void           (GL_APIENTRY* PFNGLCLEARPROC) (GLbitfield mask);
typedef void           (GL_APIENTRY* PFNGLCLEARCOLORPROC) (GLfloat red, GLfloat green, GLfloat blue, GLfloat alpha);
typedef void           (GL_APIENTRY* PFNGLCLEARDEPTHFPROC) (GLfloat depth);
typedef void           (GL_APIENTRY* PFNGLCLEARSTENCILPROC) (GLint s);
typedef void           (GL_APIENTRY* PFNGLCOLORMASKPROC) (GLboolean red, GLboolean green, GLboolean blue, GLboolean alpha);
typedef void           (GL_APIENTRY* PFNGLCOMPILESHADERPROC) (GLuint shader);
typedef void           (GL_APIENTRY* PFNGLCOMPRESSEDTEXIMAGE2DPROC) (GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLsizei imageSize, const GLvoid* data);
typedef void           (GL_APIENTRY* PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLsizei width, GLsizei height, GLenum format, GLsizei imageSize, const GLvoid* data);
typedef void           (GL_APIENTRY* PFNGLCOPYTEXIMAGE2DPROC) (GLenum target, GLint level, GLenum internalformat, GLint x, GLint y, GLsizei width, GLsizei height, GLint border);
typedef void           (GL_APIENTRY* PFNGLCOPYTEXSUBIMAGE2DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint x, GLint y, GLsizei width, GLsizei height);
typedef GLuint         (GL_APIENTRY* PFNGLCREATEPROGRAMPROC) (void);
typedef GLuint         (GL_APIENTRY* PFNGLCREATESHADERPROC) (GLenum type);
typedef void           (GL_APIENTRY* PFNGLCULLFACEPROC) (GLenum mode);
typedef void           (GL_APIENTRY* PFNGLDELETEBUFFERSPROC) (GLsizei n, const GLuint* buffers);
typedef void           (GL_APIENTRY* PFNGLDELETEFRAMEBUFFERSPROC) (GLsizei n, const GLuint* framebuffers);
typedef void           (GL_APIENTRY* PFNGLDELETEPROGRAMPROC) (GLuint program);
typedef void           (GL_APIENTRY* PFNGLDELETERENDERBUFFERSPROC) (GLsizei n, const GLuint* renderbuffers);
typedef void           (GL_APIENTRY* PFNGLDELETESHADERPROC) (GLuint shader);
typedef void           (GL_APIENTRY* PFNGLDELETETEXTURESPROC) (GLsizei n, const GLuint* textures);
typedef void           (GL_APIENTRY* PFNGLDEPTHFUNCPROC) (GLenum func);
typedef void           (GL_APIENTRY* PFNGLDEPTHMASKPROC) (GLboolean flag);
typedef void           (GL_APIENTRY* PFNGLDEPTHRANGEFPROC) (GLfloat n, GLfloat f);
typedef void           (GL_APIENTRY* PFNGLDETACHSHADERPROC) (GLuint program, GLuint shader);
typedef void           (GL_APIENTRY* PFNGLDISABLEPROC) (GLenum cap);
typedef void           (GL_APIENTRY* PFNGLDISABLEVERTEXATTRIBARRAYPROC) (GLuint index);
typedef void           (GL_APIENTRY* PFNGLDRAWARRAYSPROC) (GLenum mode, GLint first, GLsizei count);
typedef void           (GL_APIENTRY* PFNGLDRAWELEMENTSPROC) (GLenum mode, GLsizei count, GLenum type, const GLvoid* indices);
typedef void           (GL_APIENTRY* PFNGLENABLEPROC) (GLenum cap);
typedef void           (GL_APIENTRY* PFNGLENABLEVERTEXATTRIBARRAYPROC) (GLuint index);
typedef void           (GL_APIENTRY* PFNGLFINISHPROC) (void);
typedef void           (GL_APIENTRY* PFNGLFLUSHPROC) (void);
typedef void           (GL_APIENTRY* PFNGLFRAMEBUFFERRENDERBUFFERPROC) (GLenum target, GLenum attachment, GLenum renderbuffertarget, GLuint renderbuffer);
typedef void           (GL_APIENTRY* PFNGLFRAMEBUFFERTEXTURE2DPROC) (GLenum target, GLenum attachment, GLenum textarget, GLuint texture, GLint level);
typedef void           (GL_APIENTRY* PFNGLFRONTFACEPROC) (GLenum mode);
typedef void           (GL_APIENTRY* PFNGLGENBUFFERSPROC) (GLsizei n, GLuint* buffers);
typedef void           (GL_APIENTRY* PFNGLGENERATEMIPMAPPROC) (GLenum target);
typedef void           (GL_APIENTRY* PFNGLGENFRAMEBUFFERSPROC) (GLsizei n, GLuint* framebuffers);
typedef void           (GL_APIENTRY* PFNGLGENRENDERBUFFERSPROC) (GLsizei n, GLuint* renderbuffers);
typedef void           (GL_APIENTRY* PFNGLGENTEXTURESPROC) (GLsizei n, GLuint* textures);
typedef void           (GL_APIENTRY* PFNGLGETACTIVEATTRIBPROC) (GLuint program, GLuint index, GLsizei bufsize, GLsizei* length, GLint* size, GLenum* type, GLchar* name);
typedef void           (GL_APIENTRY* PFNGLGETACTIVEUNIFORMPROC) (GLuint program, GLuint index, GLsizei bufsize, GLsizei* length, GLint* size, GLenum* type, GLchar* name);
typedef void           (GL_APIENTRY* PFNGLGETATTACHEDSHADERSPROC) (GLuint program, GLsizei maxcount, GLsizei* count, GLuint* shaders);
typedef GLint          (GL_APIENTRY* PFNGLGETATTRIBLOCATIONPROC) (GLuint program, const GLchar* name);
typedef void           (GL_APIENTRY* PFNGLGETBOOLEANVPROC) (GLenum pname, GLboolean* params);
typedef void           (GL_APIENTRY* PFNGLGETBUFFERPARAMETERIVPROC) (GLenum target, GLenum pname, GLint* params);
typedef GLenum         (GL_APIENTRY* PFNGLGETERRORPROC) (void);
typedef void           (GL_APIENTRY* PFNGLGETFLOATVPROC) (GLenum pname, GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC) (GLenum target, GLenum attachment, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETINTEGERVPROC) (GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETPROGRAMIVPROC) (GLuint program, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETPROGRAMINFOLOGPROC) (GLuint program, GLsizei bufsize, GLsizei* length, GLchar* infolog);
typedef void           (GL_APIENTRY* PFNGLGETRENDERBUFFERPARAMETERIVPROC) (GLenum target, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETSHADERIVPROC) (GLuint shader, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETSHADERINFOLOGPROC) (GLuint shader, GLsizei bufsize, GLsizei* length, GLchar* infolog);
typedef void           (GL_APIENTRY* PFNGLGETSHADERPRECISIONFORMATPROC) (GLenum shadertype, GLenum precisiontype, GLint* range, GLint* precision);
typedef void           (GL_APIENTRY* PFNGLGETSHADERSOURCEPROC) (GLuint shader, GLsizei bufsize, GLsizei* length, GLchar* source);
typedef const GLubyte* (GL_APIENTRY* PFNGLGETSTRINGPROC) (GLenum name);
typedef void           (GL_APIENTRY* PFNGLGETTEXPARAMETERFVPROC) (GLenum target, GLenum pname, GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLGETTEXPARAMETERIVPROC) (GLenum target, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETUNIFORMFVPROC) (GLuint program, GLint location, GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLGETUNIFORMIVPROC) (GLuint program, GLint location, GLint* params);
typedef GLint          (GL_APIENTRY* PFNGLGETUNIFORMLOCATIONPROC) (GLuint program, const GLchar* name);
typedef void           (GL_APIENTRY* PFNGLGETVERTEXATTRIBFVPROC) (GLuint index, GLenum pname, GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLGETVERTEXATTRIBIVPROC) (GLuint index, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETVERTEXATTRIBPOINTERVPROC) (GLuint index, GLenum pname, GLvoid** pointer);
typedef void           (GL_APIENTRY* PFNGLHINTPROC) (GLenum target, GLenum mode);
typedef GLboolean      (GL_APIENTRY* PFNGLISBUFFERPROC) (GLuint buffer);
typedef GLboolean      (GL_APIENTRY* PFNGLISENABLEDPROC) (GLenum cap);
typedef GLboolean      (GL_APIENTRY* PFNGLISFRAMEBUFFERPROC) (GLuint framebuffer);
typedef GLboolean      (GL_APIENTRY* PFNGLISPROGRAMPROC) (GLuint program);
typedef GLboolean      (GL_APIENTRY* PFNGLISRENDERBUFFERPROC) (GLuint renderbuffer);
typedef GLboolean      (GL_APIENTRY* PFNGLISSHADERPROC) (GLuint shader);
typedef GLboolean      (GL_APIENTRY* PFNGLISTEXTUREPROC) (GLuint texture);
typedef void           (GL_APIENTRY* PFNGLLINEWIDTHPROC) (GLfloat width);
typedef void           (GL_APIENTRY* PFNGLLINKPROGRAMPROC) (GLuint program);
typedef void           (GL_APIENTRY* PFNGLPIXELSTOREIPROC) (GLenum pname, GLint param);
typedef void           (GL_APIENTRY* PFNGLPOLYGONOFFSETPROC) (GLfloat factor, GLfloat units);
typedef void           (GL_APIENTRY* PFNGLREADPIXELSPROC) (GLint x, GLint y, GLsizei width, GLsizei height, GLenum format, GLenum type, GLvoid* pixels);
typedef void           (GL_APIENTRY* PFNGLRELEASESHADERCOMPILERPROC) (void);
typedef void           (GL_APIENTRY* PFNGLRENDERBUFFERSTORAGEPROC) (GLenum target, GLenum internalformat, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLSAMPLECOVERAGEPROC) (GLfloat value, GLboolean invert);
typedef void           (GL_APIENTRY* PFNGLSCISSORPROC) (GLint x, GLint y, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLSHADERBINARYPROC) (GLsizei n, const GLuint* shaders, GLenum binaryformat, const GLvoid* binary, GLsizei length);
typedef void           (GL_APIENTRY* PFNGLSHADERSOURCEPROC) (GLuint shader, GLsizei count, const GLchar* const* string, const GLint* length);
typedef void           (GL_APIENTRY* PFNGLSTENCILFUNCPROC) (GLenum func, GLint ref, GLuint mask);
typedef void           (GL_APIENTRY* PFNGLSTENCILFUNCSEPARATEPROC) (GLenum face, GLenum func, GLint ref, GLuint mask);
typedef void           (GL_APIENTRY* PFNGLSTENCILMASKPROC) (GLuint mask);
typedef void           (GL_APIENTRY* PFNGLSTENCILMASKSEPARATEPROC) (GLenum face, GLuint mask);
typedef void           (GL_APIENTRY* PFNGLSTENCILOPPROC) (GLenum fail, GLenum zfail, GLenum zpass);
typedef void           (GL_APIENTRY* PFNGLSTENCILOPSEPARATEPROC) (GLenum face, GLenum fail, GLenum zfail, GLenum zpass);
typedef void           (GL_APIENTRY* PFNGLTEXIMAGE2DPROC) (GLenum target, GLint level, GLint internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, const GLvoid* pixels);
typedef void           (GL_APIENTRY* PFNGLTEXPARAMETERFPROC) (GLenum target, GLenum pname, GLfloat param);
typedef void           (GL_APIENTRY* PFNGLTEXPARAMETERFVPROC) (GLenum target, GLenum pname, const GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLTEXPARAMETERIPROC) (GLenum target, GLenum pname, GLint param);
typedef void           (GL_APIENTRY* PFNGLTEXPARAMETERIVPROC) (GLenum target, GLenum pname, const GLint* params);
typedef void           (GL_APIENTRY* PFNGLTEXSUBIMAGE2DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLsizei width, GLsizei height, GLenum format, GLenum type, const GLvoid* pixels);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1FPROC) (GLint location, GLfloat x);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1FVPROC) (GLint location, GLsizei count, const GLfloat* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1IPROC) (GLint location, GLint x);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1IVPROC) (GLint location, GLsizei count, const GLint* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2FPROC) (GLint location, GLfloat x, GLfloat y);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2FVPROC) (GLint location, GLsizei count, const GLfloat* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2IPROC) (GLint location, GLint x, GLint y);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2IVPROC) (GLint location, GLsizei count, const GLint* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3FPROC) (GLint location, GLfloat x, GLfloat y, GLfloat z);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3FVPROC) (GLint location, GLsizei count, const GLfloat* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3IPROC) (GLint location, GLint x, GLint y, GLint z);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3IVPROC) (GLint location, GLsizei count, const GLint* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4FPROC) (GLint location, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4FVPROC) (GLint location, GLsizei count, const GLfloat* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4IPROC) (GLint location, GLint x, GLint y, GLint z, GLint w);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4IVPROC) (GLint location, GLsizei count, const GLint* v);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX2FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX3FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX4FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUSEPROGRAMPROC) (GLuint program);
typedef void           (GL_APIENTRY* PFNGLVALIDATEPROGRAMPROC) (GLuint program);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB1FPROC) (GLuint indx, GLfloat x);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB1FVPROC) (GLuint indx, const GLfloat* values);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB2FPROC) (GLuint indx, GLfloat x, GLfloat y);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB2FVPROC) (GLuint indx, const GLfloat* values);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB3FPROC) (GLuint indx, GLfloat x, GLfloat y, GLfloat z);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB3FVPROC) (GLuint indx, const GLfloat* values);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB4FPROC) (GLuint indx, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIB4FVPROC) (GLuint indx, const GLfloat* values);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBPOINTERPROC) (GLuint indx, GLint size, GLenum type, GLboolean normalized, GLsizei stride, const GLvoid* ptr);
typedef void           (GL_APIENTRY* PFNGLVIEWPORTPROC) (GLint x, GLint y, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLREADBUFFERPROC) (GLenum mode);
typedef void           (GL_APIENTRY* PFNGLDRAWRANGEELEMENTSPROC) (GLenum mode, GLuint start, GLuint end, GLsizei count, GLenum type, const GLvoid* indices);
typedef void           (GL_APIENTRY* PFNGLTEXIMAGE3DPROC) (GLenum target, GLint level, GLint internalformat, GLsizei width, GLsizei height, GLsizei depth, GLint border, GLenum format, GLenum type, const GLvoid* pixels);
typedef void           (GL_APIENTRY* PFNGLTEXSUBIMAGE3DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLsizei width, GLsizei height, GLsizei depth, GLenum format, GLenum type, const GLvoid* pixels);
typedef void           (GL_APIENTRY* PFNGLCOPYTEXSUBIMAGE3DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLint x, GLint y, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLCOMPRESSEDTEXIMAGE3DPROC) (GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth, GLint border, GLsizei imageSize, const GLvoid* data);
typedef void           (GL_APIENTRY* PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC) (GLenum target, GLint level, GLint xoffset, GLint yoffset, GLint zoffset, GLsizei width, GLsizei height, GLsizei depth, GLenum format, GLsizei imageSize, const GLvoid* data);
typedef void           (GL_APIENTRY* PFNGLGENQUERIESPROC) (GLsizei n, GLuint* ids);
typedef void           (GL_APIENTRY* PFNGLDELETEQUERIESPROC) (GLsizei n, const GLuint* ids);
typedef GLboolean      (GL_APIENTRY* PFNGLISQUERYPROC) (GLuint id);
typedef void           (GL_APIENTRY* PFNGLBEGINQUERYPROC) (GLenum target, GLuint id);
typedef void           (GL_APIENTRY* PFNGLENDQUERYPROC) (GLenum target);
typedef void           (GL_APIENTRY* PFNGLGETQUERYIVPROC) (GLenum target, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETQUERYOBJECTUIVPROC) (GLuint id, GLenum pname, GLuint* params);
typedef GLboolean      (GL_APIENTRY* PFNGLUNMAPBUFFERPROC) (GLenum target);
typedef void           (GL_APIENTRY* PFNGLGETBUFFERPOINTERVPROC) (GLenum target, GLenum pname, GLvoid** params);
typedef void           (GL_APIENTRY* PFNGLDRAWBUFFERSPROC) (GLsizei n, const GLenum* bufs);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX2X3FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX3X2FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX2X4FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX4X2FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX3X4FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORMMATRIX4X3FVPROC) (GLint location, GLsizei count, GLboolean transpose, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLBLITFRAMEBUFFERPROC) (GLint srcX0, GLint srcY0, GLint srcX1, GLint srcY1, GLint dstX0, GLint dstY0, GLint dstX1, GLint dstY1, GLbitfield mask, GLenum filter);
typedef void           (GL_APIENTRY* PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC) (GLenum target, GLsizei samples, GLenum internalformat, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLFRAMEBUFFERTEXTURELAYERPROC) (GLenum target, GLenum attachment, GLuint texture, GLint level, GLint layer);
typedef GLvoid*        (GL_APIENTRY* PFNGLMAPBUFFERRANGEPROC) (GLenum target, GLintptr offset, GLsizeiptr length, GLbitfield access);
typedef void           (GL_APIENTRY* PFNGLFLUSHMAPPEDBUFFERRANGEPROC) (GLenum target, GLintptr offset, GLsizeiptr length);
typedef void           (GL_APIENTRY* PFNGLBINDVERTEXARRAYPROC) (GLuint array);
typedef void           (GL_APIENTRY* PFNGLDELETEVERTEXARRAYSPROC) (GLsizei n, const GLuint* arrays);
typedef void           (GL_APIENTRY* PFNGLGENVERTEXARRAYSPROC) (GLsizei n, GLuint* arrays);
typedef GLboolean      (GL_APIENTRY* PFNGLISVERTEXARRAYPROC) (GLuint array);
typedef void           (GL_APIENTRY* PFNGLGETINTEGERI_VPROC) (GLenum target, GLuint index, GLint* data);
typedef void           (GL_APIENTRY* PFNGLBEGINTRANSFORMFEEDBACKPROC) (GLenum primitiveMode);
typedef void           (GL_APIENTRY* PFNGLENDTRANSFORMFEEDBACKPROC) (void);
typedef void           (GL_APIENTRY* PFNGLBINDBUFFERRANGEPROC) (GLenum target, GLuint index, GLuint buffer, GLintptr offset, GLsizeiptr size);
typedef void           (GL_APIENTRY* PFNGLBINDBUFFERBASEPROC) (GLenum target, GLuint index, GLuint buffer);
typedef void           (GL_APIENTRY* PFNGLTRANSFORMFEEDBACKVARYINGSPROC) (GLuint program, GLsizei count, const GLchar* const* varyings, GLenum bufferMode);
typedef void           (GL_APIENTRY* PFNGLGETTRANSFORMFEEDBACKVARYINGPROC) (GLuint program, GLuint index, GLsizei bufSize, GLsizei* length, GLsizei* size, GLenum* type, GLchar* name);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBIPOINTERPROC) (GLuint index, GLint size, GLenum type, GLsizei stride, const GLvoid* pointer);
typedef void           (GL_APIENTRY* PFNGLGETVERTEXATTRIBIIVPROC) (GLuint index, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETVERTEXATTRIBIUIVPROC) (GLuint index, GLenum pname, GLuint* params);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBI4IPROC) (GLuint index, GLint x, GLint y, GLint z, GLint w);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBI4UIPROC) (GLuint index, GLuint x, GLuint y, GLuint z, GLuint w);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBI4IVPROC) (GLuint index, const GLint* v);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBI4UIVPROC) (GLuint index, const GLuint* v);
typedef void           (GL_APIENTRY* PFNGLGETUNIFORMUIVPROC) (GLuint program, GLint location, GLuint* params);
typedef GLint          (GL_APIENTRY* PFNGLGETFRAGDATALOCATIONPROC) (GLuint program, const GLchar *name);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1UIPROC) (GLint location, GLuint v0);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2UIPROC) (GLint location, GLuint v0, GLuint v1);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3UIPROC) (GLint location, GLuint v0, GLuint v1, GLuint v2);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4UIPROC) (GLint location, GLuint v0, GLuint v1, GLuint v2, GLuint v3);
typedef void           (GL_APIENTRY* PFNGLUNIFORM1UIVPROC) (GLint location, GLsizei count, const GLuint* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORM2UIVPROC) (GLint location, GLsizei count, const GLuint* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORM3UIVPROC) (GLint location, GLsizei count, const GLuint* value);
typedef void           (GL_APIENTRY* PFNGLUNIFORM4UIVPROC) (GLint location, GLsizei count, const GLuint* value);
typedef void           (GL_APIENTRY* PFNGLCLEARBUFFERIVPROC) (GLenum buffer, GLint drawbuffer, const GLint* value);
typedef void           (GL_APIENTRY* PFNGLCLEARBUFFERUIVPROC) (GLenum buffer, GLint drawbuffer, const GLuint* value);
typedef void           (GL_APIENTRY* PFNGLCLEARBUFFERFVPROC) (GLenum buffer, GLint drawbuffer, const GLfloat* value);
typedef void           (GL_APIENTRY* PFNGLCLEARBUFFERFIPROC) (GLenum buffer, GLint drawbuffer, GLfloat depth, GLint stencil);
typedef const GLubyte* (GL_APIENTRY* PFNGLGETSTRINGIPROC) (GLenum name, GLuint index);
typedef void           (GL_APIENTRY* PFNGLCOPYBUFFERSUBDATAPROC) (GLenum readTarget, GLenum writeTarget, GLintptr readOffset, GLintptr writeOffset, GLsizeiptr size);
typedef void           (GL_APIENTRY* PFNGLGETUNIFORMINDICESPROC) (GLuint program, GLsizei uniformCount, const GLchar* const* uniformNames, GLuint* uniformIndices);
typedef void           (GL_APIENTRY* PFNGLGETACTIVEUNIFORMSIVPROC) (GLuint program, GLsizei uniformCount, const GLuint* uniformIndices, GLenum pname, GLint* params);
typedef GLuint         (GL_APIENTRY* PFNGLGETUNIFORMBLOCKINDEXPROC) (GLuint program, const GLchar* uniformBlockName);
typedef void           (GL_APIENTRY* PFNGLGETACTIVEUNIFORMBLOCKIVPROC) (GLuint program, GLuint uniformBlockIndex, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC) (GLuint program, GLuint uniformBlockIndex, GLsizei bufSize, GLsizei* length, GLchar* uniformBlockName);
typedef void           (GL_APIENTRY* PFNGLUNIFORMBLOCKBINDINGPROC) (GLuint program, GLuint uniformBlockIndex, GLuint uniformBlockBinding);
typedef void           (GL_APIENTRY* PFNGLDRAWARRAYSINSTANCEDPROC) (GLenum mode, GLint first, GLsizei count, GLsizei instanceCount);
typedef void           (GL_APIENTRY* PFNGLDRAWELEMENTSINSTANCEDPROC) (GLenum mode, GLsizei count, GLenum type, const GLvoid* indices, GLsizei instanceCount);
typedef GLsync         (GL_APIENTRY* PFNGLFENCESYNCPROC) (GLenum condition, GLbitfield flags);
typedef GLboolean      (GL_APIENTRY* PFNGLISSYNCPROC) (GLsync sync);
typedef void           (GL_APIENTRY* PFNGLDELETESYNCPROC) (GLsync sync);
typedef GLenum         (GL_APIENTRY* PFNGLCLIENTWAITSYNCPROC) (GLsync sync, GLbitfield flags, GLuint64 timeout);
typedef void           (GL_APIENTRY* PFNGLWAITSYNCPROC) (GLsync sync, GLbitfield flags, GLuint64 timeout);
typedef void           (GL_APIENTRY* PFNGLGETINTEGER64VPROC) (GLenum pname, GLint64* params);
typedef void           (GL_APIENTRY* PFNGLGETSYNCIVPROC) (GLsync sync, GLenum pname, GLsizei bufSize, GLsizei* length, GLint* values);
typedef void           (GL_APIENTRY* PFNGLGETINTEGER64I_VPROC) (GLenum target, GLuint index, GLint64* data);
typedef void           (GL_APIENTRY* PFNGLGETBUFFERPARAMETERI64VPROC) (GLenum target, GLenum pname, GLint64* params);
typedef void           (GL_APIENTRY* PFNGLGENSAMPLERSPROC) (GLsizei count, GLuint* samplers);
typedef void           (GL_APIENTRY* PFNGLDELETESAMPLERSPROC) (GLsizei count, const GLuint* samplers);
typedef GLboolean      (GL_APIENTRY* PFNGLISSAMPLERPROC) (GLuint sampler);
typedef void           (GL_APIENTRY* PFNGLBINDSAMPLERPROC) (GLuint unit, GLuint sampler);
typedef void           (GL_APIENTRY* PFNGLSAMPLERPARAMETERIPROC) (GLuint sampler, GLenum pname, GLint param);
typedef void           (GL_APIENTRY* PFNGLSAMPLERPARAMETERIVPROC) (GLuint sampler, GLenum pname, const GLint* param);
typedef void           (GL_APIENTRY* PFNGLSAMPLERPARAMETERFPROC) (GLuint sampler, GLenum pname, GLfloat param);
typedef void           (GL_APIENTRY* PFNGLSAMPLERPARAMETERFVPROC) (GLuint sampler, GLenum pname, const GLfloat* param);
typedef void           (GL_APIENTRY* PFNGLGETSAMPLERPARAMETERIVPROC) (GLuint sampler, GLenum pname, GLint* params);
typedef void           (GL_APIENTRY* PFNGLGETSAMPLERPARAMETERFVPROC) (GLuint sampler, GLenum pname, GLfloat* params);
typedef void           (GL_APIENTRY* PFNGLVERTEXATTRIBDIVISORPROC) (GLuint index, GLuint divisor);
typedef void           (GL_APIENTRY* PFNGLBINDTRANSFORMFEEDBACKPROC) (GLenum target, GLuint id);
typedef void           (GL_APIENTRY* PFNGLDELETETRANSFORMFEEDBACKSPROC) (GLsizei n, const GLuint* ids);
typedef void           (GL_APIENTRY* PFNGLGENTRANSFORMFEEDBACKSPROC) (GLsizei n, GLuint* ids);
typedef GLboolean      (GL_APIENTRY* PFNGLISTRANSFORMFEEDBACKPROC) (GLuint id);
typedef void           (GL_APIENTRY* PFNGLPAUSETRANSFORMFEEDBACKPROC) (void);
typedef void           (GL_APIENTRY* PFNGLRESUMETRANSFORMFEEDBACKPROC) (void);
typedef void           (GL_APIENTRY* PFNGLGETPROGRAMBINARYPROC) (GLuint program, GLsizei bufSize, GLsizei* length, GLenum* binaryFormat, GLvoid* binary);
typedef void           (GL_APIENTRY* PFNGLPROGRAMBINARYPROC) (GLuint program, GLenum binaryFormat, const GLvoid* binary, GLsizei length);
typedef void           (GL_APIENTRY* PFNGLPROGRAMPARAMETERIPROC) (GLuint program, GLenum pname, GLint value);
typedef void           (GL_APIENTRY* PFNGLINVALIDATEFRAMEBUFFERPROC) (GLenum target, GLsizei numAttachments, const GLenum* attachments);
typedef void           (GL_APIENTRY* PFNGLINVALIDATESUBFRAMEBUFFERPROC) (GLenum target, GLsizei numAttachments, const GLenum* attachments, GLint x, GLint y, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLTEXSTORAGE2DPROC) (GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height);
typedef void           (GL_APIENTRY* PFNGLTEXSTORAGE3DPROC) (GLenum target, GLsizei levels, GLenum internalformat, GLsizei width, GLsizei height, GLsizei depth);
typedef void           (GL_APIENTRY* PFNGLGETINTERNALFORMATIVPROC) (GLenum target, GLenum internalformat, GLenum pname, GLsizei bufSize, GLint* params);
typedef void (GL_APIENTRY* PFNGLLABELOBJECTEXTPROC) (GLenum type, GLuint object, GLsizei length, const GLchar *label);
typedef void (GL_APIENTRY* PFNGLGETOBJECTLABELEXTPROC) (GLenum type, GLuint object, GLsizei bufSize, GLsizei *length, GLchar *label);
typedef void (GL_APIENTRY* PFNGLINSERTEVENTMARKEREXTPROC) (GLsizei length, const GLchar *marker);
typedef void (GL_APIENTRY* PFNGLPUSHGROUPMARKEREXTPROC) (GLsizei length, const GLchar *marker);
typedef void (GL_APIENTRY* PFNGLPOPGROUPMARKEREXTPROC) (void);
typedef void (GL_APIENTRY* PFNGLUSEPROGRAMSTAGESEXTPROC) (GLuint pipeline, GLbitfield stages, GLuint program);
typedef void (GL_APIENTRY* PFNGLACTIVESHADERPROGRAMEXTPROC) (GLuint pipeline, GLuint program);
typedef GLuint (GL_APIENTRY* PFNGLCREATESHADERPROGRAMVEXTPROC) (GLenum type, GLsizei count, const GLchar **strings);
typedef void (GL_APIENTRY* PFNGLBINDPROGRAMPIPELINEEXTPROC) (GLuint pipeline);
typedef void (GL_APIENTRY* PFNGLDELETEPROGRAMPIPELINESEXTPROC) (GLsizei n, const GLuint *pipelines);
typedef void (GL_APIENTRY* PFNGLGENPROGRAMPIPELINESEXTPROC) (GLsizei n, GLuint *pipelines);
typedef GLboolean (GL_APIENTRY* PFNGLISPROGRAMPIPELINEEXTPROC) (GLuint pipeline);
typedef void (GL_APIENTRY* PFNGLPROGRAMPARAMETERIEXTPROC) (GLuint program, GLenum pname, GLint value);
typedef void (GL_APIENTRY* PFNGLGETPROGRAMPIPELINEIVEXTPROC) (GLuint pipeline, GLenum pname, GLint *params);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM1IEXTPROC) (GLuint program, GLint location, GLint x);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM2IEXTPROC) (GLuint program, GLint location, GLint x, GLint y);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM3IEXTPROC) (GLuint program, GLint location, GLint x, GLint y, GLint z);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM4IEXTPROC) (GLuint program, GLint location, GLint x, GLint y, GLint z, GLint w);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM1FEXTPROC) (GLuint program, GLint location, GLfloat x);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM2FEXTPROC) (GLuint program, GLint location, GLfloat x, GLfloat y);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM3FEXTPROC) (GLuint program, GLint location, GLfloat x, GLfloat y, GLfloat z);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM4FEXTPROC) (GLuint program, GLint location, GLfloat x, GLfloat y, GLfloat z, GLfloat w);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM1IVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM2IVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM3IVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM4IVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLint *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM1FVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM2FVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM3FVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORM4FVEXTPROC) (GLuint program, GLint location, GLsizei count, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC) (GLuint program, GLint location, GLsizei count, GLboolean transpose, const GLfloat *value);
typedef void (GL_APIENTRY* PFNGLVALIDATEPROGRAMPIPELINEEXTPROC) (GLuint pipeline);
typedef void (GL_APIENTRY* PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC) (GLuint pipeline, GLsizei bufSize, GLsizei *length, GLchar *infoLog);

typedef void (GL_APIENTRY* PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC) (GLenum, GLenum, GLenum, GLuint, GLint, GLsizei);

extern PFNGLACTIVETEXTUREPROC gles3wActiveTexture;
extern PFNGLATTACHSHADERPROC gles3wAttachShader;
extern PFNGLBINDATTRIBLOCATIONPROC gles3wBindAttribLocation;
extern PFNGLBINDBUFFERPROC gles3wBindBuffer;
extern PFNGLBINDFRAMEBUFFERPROC gles3wBindFramebuffer;
extern PFNGLBINDRENDERBUFFERPROC gles3wBindRenderbuffer;
extern PFNGLBINDTEXTUREPROC gles3wBindTexture;
extern PFNGLBLENDCOLORPROC gles3wBlendColor;
extern PFNGLBLENDEQUATIONPROC gles3wBlendEquation;
extern PFNGLBLENDEQUATIONSEPARATEPROC gles3wBlendEquationSeparate;
extern PFNGLBLENDFUNCPROC gles3wBlendFunc;
extern PFNGLBLENDFUNCSEPARATEPROC gles3wBlendFuncSeparate;
extern PFNGLBUFFERDATAPROC gles3wBufferData;
extern PFNGLBUFFERSUBDATAPROC gles3wBufferSubData;
extern PFNGLCHECKFRAMEBUFFERSTATUSPROC gles3wCheckFramebufferStatus;
extern PFNGLCLEARPROC gles3wClear;
extern PFNGLCLEARCOLORPROC gles3wClearColor;
extern PFNGLCLEARDEPTHFPROC gles3wClearDepthf;
extern PFNGLCLEARSTENCILPROC gles3wClearStencil;
extern PFNGLCOLORMASKPROC gles3wColorMask;
extern PFNGLCOMPILESHADERPROC gles3wCompileShader;
extern PFNGLCOMPRESSEDTEXIMAGE2DPROC gles3wCompressedTexImage2D;
extern PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC gles3wCompressedTexSubImage2D;
extern PFNGLCOPYTEXIMAGE2DPROC gles3wCopyTexImage2D;
extern PFNGLCOPYTEXSUBIMAGE2DPROC gles3wCopyTexSubImage2D;
extern PFNGLCREATEPROGRAMPROC gles3wCreateProgram;
extern PFNGLCREATESHADERPROC gles3wCreateShader;
extern PFNGLCULLFACEPROC gles3wCullFace;
extern PFNGLDELETEBUFFERSPROC gles3wDeleteBuffers;
extern PFNGLDELETEFRAMEBUFFERSPROC gles3wDeleteFramebuffers;
extern PFNGLDELETEPROGRAMPROC gles3wDeleteProgram;
extern PFNGLDELETERENDERBUFFERSPROC gles3wDeleteRenderbuffers;
extern PFNGLDELETESHADERPROC gles3wDeleteShader;
extern PFNGLDELETETEXTURESPROC gles3wDeleteTextures;
extern PFNGLDEPTHFUNCPROC gles3wDepthFunc;
extern PFNGLDEPTHMASKPROC gles3wDepthMask;
extern PFNGLDEPTHRANGEFPROC gles3wDepthRangef;
extern PFNGLDETACHSHADERPROC gles3wDetachShader;
extern PFNGLDISABLEPROC gles3wDisable;
extern PFNGLDISABLEVERTEXATTRIBARRAYPROC gles3wDisableVertexAttribArray;
extern PFNGLDRAWARRAYSPROC gles3wDrawArrays;
extern PFNGLDRAWELEMENTSPROC gles3wDrawElements;
extern PFNGLENABLEPROC gles3wEnable;
extern PFNGLENABLEVERTEXATTRIBARRAYPROC gles3wEnableVertexAttribArray;
extern PFNGLFINISHPROC gles3wFinish;
extern PFNGLFLUSHPROC gles3wFlush;
extern PFNGLFRAMEBUFFERRENDERBUFFERPROC gles3wFramebufferRenderbuffer;
extern PFNGLFRAMEBUFFERTEXTURE2DPROC gles3wFramebufferTexture2D;
extern PFNGLFRONTFACEPROC gles3wFrontFace;
extern PFNGLGENBUFFERSPROC gles3wGenBuffers;
extern PFNGLGENERATEMIPMAPPROC gles3wGenerateMipmap;
extern PFNGLGENFRAMEBUFFERSPROC gles3wGenFramebuffers;
extern PFNGLGENRENDERBUFFERSPROC gles3wGenRenderbuffers;
extern PFNGLGENTEXTURESPROC gles3wGenTextures;
extern PFNGLGETACTIVEATTRIBPROC gles3wGetActiveAttrib;
extern PFNGLGETACTIVEUNIFORMPROC gles3wGetActiveUniform;
extern PFNGLGETATTACHEDSHADERSPROC gles3wGetAttachedShaders;
extern PFNGLGETATTRIBLOCATIONPROC gles3wGetAttribLocation;
extern PFNGLGETBOOLEANVPROC gles3wGetBooleanv;
extern PFNGLGETBUFFERPARAMETERIVPROC gles3wGetBufferParameteriv;
extern PFNGLGETERRORPROC gles3wGetError;
extern PFNGLGETFLOATVPROC gles3wGetFloatv;
extern PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC gles3wGetFramebufferAttachmentParameteriv;
extern PFNGLGETINTEGERVPROC gles3wGetIntegerv;
extern PFNGLGETPROGRAMIVPROC gles3wGetProgramiv;
extern PFNGLGETPROGRAMINFOLOGPROC gles3wGetProgramInfoLog;
extern PFNGLGETRENDERBUFFERPARAMETERIVPROC gles3wGetRenderbufferParameteriv;
extern PFNGLGETSHADERIVPROC gles3wGetShaderiv;
extern PFNGLGETSHADERINFOLOGPROC gles3wGetShaderInfoLog;
extern PFNGLGETSHADERPRECISIONFORMATPROC gles3wGetShaderPrecisionFormat;
extern PFNGLGETSHADERSOURCEPROC gles3wGetShaderSource;
extern PFNGLGETSTRINGPROC gles3wGetString;
extern PFNGLGETTEXPARAMETERFVPROC gles3wGetTexParameterfv;
extern PFNGLGETTEXPARAMETERIVPROC gles3wGetTexParameteriv;
extern PFNGLGETUNIFORMFVPROC gles3wGetUniformfv;
extern PFNGLGETUNIFORMIVPROC gles3wGetUniformiv;
extern PFNGLGETUNIFORMLOCATIONPROC gles3wGetUniformLocation;
extern PFNGLGETVERTEXATTRIBFVPROC gles3wGetVertexAttribfv;
extern PFNGLGETVERTEXATTRIBIVPROC gles3wGetVertexAttribiv;
extern PFNGLGETVERTEXATTRIBPOINTERVPROC gles3wGetVertexAttribPointerv;
extern PFNGLHINTPROC gles3wHint;
extern PFNGLISBUFFERPROC gles3wIsBuffer;
extern PFNGLISENABLEDPROC gles3wIsEnabled;
extern PFNGLISFRAMEBUFFERPROC gles3wIsFramebuffer;
extern PFNGLISPROGRAMPROC gles3wIsProgram;
extern PFNGLISRENDERBUFFERPROC gles3wIsRenderbuffer;
extern PFNGLISSHADERPROC gles3wIsShader;
extern PFNGLISTEXTUREPROC gles3wIsTexture;
extern PFNGLLINEWIDTHPROC gles3wLineWidth;
extern PFNGLLINKPROGRAMPROC gles3wLinkProgram;
extern PFNGLPIXELSTOREIPROC gles3wPixelStorei;
extern PFNGLPOLYGONOFFSETPROC gles3wPolygonOffset;
extern PFNGLREADPIXELSPROC gles3wReadPixels;
extern PFNGLRELEASESHADERCOMPILERPROC gles3wReleaseShaderCompiler;
extern PFNGLRENDERBUFFERSTORAGEPROC gles3wRenderbufferStorage;
extern PFNGLSAMPLECOVERAGEPROC gles3wSampleCoverage;
extern PFNGLSCISSORPROC gles3wScissor;
extern PFNGLSHADERBINARYPROC gles3wShaderBinary;
extern PFNGLSHADERSOURCEPROC gles3wShaderSource;
extern PFNGLSTENCILFUNCPROC gles3wStencilFunc;
extern PFNGLSTENCILFUNCSEPARATEPROC gles3wStencilFuncSeparate;
extern PFNGLSTENCILMASKPROC gles3wStencilMask;
extern PFNGLSTENCILMASKSEPARATEPROC gles3wStencilMaskSeparate;
extern PFNGLSTENCILOPPROC gles3wStencilOp;
extern PFNGLSTENCILOPSEPARATEPROC gles3wStencilOpSeparate;
extern PFNGLTEXIMAGE2DPROC gles3wTexImage2D;
extern PFNGLTEXPARAMETERFPROC gles3wTexParameterf;
extern PFNGLTEXPARAMETERFVPROC gles3wTexParameterfv;
extern PFNGLTEXPARAMETERIPROC gles3wTexParameteri;
extern PFNGLTEXPARAMETERIVPROC gles3wTexParameteriv;
extern PFNGLTEXSUBIMAGE2DPROC gles3wTexSubImage2D;
extern PFNGLUNIFORM1FPROC gles3wUniform1f;
extern PFNGLUNIFORM1FVPROC gles3wUniform1fv;
extern PFNGLUNIFORM1IPROC gles3wUniform1i;
extern PFNGLUNIFORM1IVPROC gles3wUniform1iv;
extern PFNGLUNIFORM2FPROC gles3wUniform2f;
extern PFNGLUNIFORM2FVPROC gles3wUniform2fv;
extern PFNGLUNIFORM2IPROC gles3wUniform2i;
extern PFNGLUNIFORM2IVPROC gles3wUniform2iv;
extern PFNGLUNIFORM3FPROC gles3wUniform3f;
extern PFNGLUNIFORM3FVPROC gles3wUniform3fv;
extern PFNGLUNIFORM3IPROC gles3wUniform3i;
extern PFNGLUNIFORM3IVPROC gles3wUniform3iv;
extern PFNGLUNIFORM4FPROC gles3wUniform4f;
extern PFNGLUNIFORM4FVPROC gles3wUniform4fv;
extern PFNGLUNIFORM4IPROC gles3wUniform4i;
extern PFNGLUNIFORM4IVPROC gles3wUniform4iv;
extern PFNGLUNIFORMMATRIX2FVPROC gles3wUniformMatrix2fv;
extern PFNGLUNIFORMMATRIX3FVPROC gles3wUniformMatrix3fv;
extern PFNGLUNIFORMMATRIX4FVPROC gles3wUniformMatrix4fv;
extern PFNGLUSEPROGRAMPROC gles3wUseProgram;
extern PFNGLVALIDATEPROGRAMPROC gles3wValidateProgram;
extern PFNGLVERTEXATTRIB1FPROC gles3wVertexAttrib1f;
extern PFNGLVERTEXATTRIB1FVPROC gles3wVertexAttrib1fv;
extern PFNGLVERTEXATTRIB2FPROC gles3wVertexAttrib2f;
extern PFNGLVERTEXATTRIB2FVPROC gles3wVertexAttrib2fv;
extern PFNGLVERTEXATTRIB3FPROC gles3wVertexAttrib3f;
extern PFNGLVERTEXATTRIB3FVPROC gles3wVertexAttrib3fv;
extern PFNGLVERTEXATTRIB4FPROC gles3wVertexAttrib4f;
extern PFNGLVERTEXATTRIB4FVPROC gles3wVertexAttrib4fv;
extern PFNGLVERTEXATTRIBPOINTERPROC gles3wVertexAttribPointer;
extern PFNGLVIEWPORTPROC gles3wViewport;
extern PFNGLREADBUFFERPROC gles3wReadBuffer;
extern PFNGLDRAWRANGEELEMENTSPROC gles3wDrawRangeElements;
extern PFNGLTEXIMAGE3DPROC gles3wTexImage3D;
extern PFNGLTEXSUBIMAGE3DPROC gles3wTexSubImage3D;
extern PFNGLCOPYTEXSUBIMAGE3DPROC gles3wCopyTexSubImage3D;
extern PFNGLCOMPRESSEDTEXIMAGE3DPROC gles3wCompressedTexImage3D;
extern PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC gles3wCompressedTexSubImage3D;
extern PFNGLGENQUERIESPROC gles3wGenQueries;
extern PFNGLDELETEQUERIESPROC gles3wDeleteQueries;
extern PFNGLISQUERYPROC gles3wIsQuery;
extern PFNGLBEGINQUERYPROC gles3wBeginQuery;
extern PFNGLENDQUERYPROC gles3wEndQuery;
extern PFNGLGETQUERYIVPROC gles3wGetQueryiv;
extern PFNGLGETQUERYOBJECTUIVPROC gles3wGetQueryObjectuiv;
extern PFNGLUNMAPBUFFERPROC gles3wUnmapBuffer;
extern PFNGLGETBUFFERPOINTERVPROC gles3wGetBufferPointerv;
extern PFNGLDRAWBUFFERSPROC gles3wDrawBuffers;
extern PFNGLUNIFORMMATRIX2X3FVPROC gles3wUniformMatrix2x3fv;
extern PFNGLUNIFORMMATRIX3X2FVPROC gles3wUniformMatrix3x2fv;
extern PFNGLUNIFORMMATRIX2X4FVPROC gles3wUniformMatrix2x4fv;
extern PFNGLUNIFORMMATRIX4X2FVPROC gles3wUniformMatrix4x2fv;
extern PFNGLUNIFORMMATRIX3X4FVPROC gles3wUniformMatrix3x4fv;
extern PFNGLUNIFORMMATRIX4X3FVPROC gles3wUniformMatrix4x3fv;
extern PFNGLBLITFRAMEBUFFERPROC gles3wBlitFramebuffer;
extern PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC gles3wRenderbufferStorageMultisample;
extern PFNGLFRAMEBUFFERTEXTURELAYERPROC gles3wFramebufferTextureLayer;
extern PFNGLMAPBUFFERRANGEPROC gles3wMapBufferRange;
extern PFNGLFLUSHMAPPEDBUFFERRANGEPROC gles3wFlushMappedBufferRange;
extern PFNGLBINDVERTEXARRAYPROC gles3wBindVertexArray;
extern PFNGLDELETEVERTEXARRAYSPROC gles3wDeleteVertexArrays;
extern PFNGLGENVERTEXARRAYSPROC gles3wGenVertexArrays;
extern PFNGLISVERTEXARRAYPROC gles3wIsVertexArray;
extern PFNGLGETINTEGERI_VPROC gles3wGetIntegeri_v;
extern PFNGLBEGINTRANSFORMFEEDBACKPROC gles3wBeginTransformFeedback;
extern PFNGLENDTRANSFORMFEEDBACKPROC gles3wEndTransformFeedback;
extern PFNGLBINDBUFFERRANGEPROC gles3wBindBufferRange;
extern PFNGLBINDBUFFERBASEPROC gles3wBindBufferBase;
extern PFNGLTRANSFORMFEEDBACKVARYINGSPROC gles3wTransformFeedbackVaryings;
extern PFNGLGETTRANSFORMFEEDBACKVARYINGPROC gles3wGetTransformFeedbackVarying;
extern PFNGLVERTEXATTRIBIPOINTERPROC gles3wVertexAttribIPointer;
extern PFNGLGETVERTEXATTRIBIIVPROC gles3wGetVertexAttribIiv;
extern PFNGLGETVERTEXATTRIBIUIVPROC gles3wGetVertexAttribIuiv;
extern PFNGLVERTEXATTRIBI4IPROC gles3wVertexAttribI4i;
extern PFNGLVERTEXATTRIBI4UIPROC gles3wVertexAttribI4ui;
extern PFNGLVERTEXATTRIBI4IVPROC gles3wVertexAttribI4iv;
extern PFNGLVERTEXATTRIBI4UIVPROC gles3wVertexAttribI4uiv;
extern PFNGLGETUNIFORMUIVPROC gles3wGetUniformuiv;
extern PFNGLGETFRAGDATALOCATIONPROC gles3wGetFragDataLocation;
extern PFNGLUNIFORM1UIPROC gles3wUniform1ui;
extern PFNGLUNIFORM2UIPROC gles3wUniform2ui;
extern PFNGLUNIFORM3UIPROC gles3wUniform3ui;
extern PFNGLUNIFORM4UIPROC gles3wUniform4ui;
extern PFNGLUNIFORM1UIVPROC gles3wUniform1uiv;
extern PFNGLUNIFORM2UIVPROC gles3wUniform2uiv;
extern PFNGLUNIFORM3UIVPROC gles3wUniform3uiv;
extern PFNGLUNIFORM4UIVPROC gles3wUniform4uiv;
extern PFNGLCLEARBUFFERIVPROC gles3wClearBufferiv;
extern PFNGLCLEARBUFFERUIVPROC gles3wClearBufferuiv;
extern PFNGLCLEARBUFFERFVPROC gles3wClearBufferfv;
extern PFNGLCLEARBUFFERFIPROC gles3wClearBufferfi;
extern PFNGLGETSTRINGIPROC gles3wGetStringi;
extern PFNGLCOPYBUFFERSUBDATAPROC gles3wCopyBufferSubData;
extern PFNGLGETUNIFORMINDICESPROC gles3wGetUniformIndices;
extern PFNGLGETACTIVEUNIFORMSIVPROC gles3wGetActiveUniformsiv;
extern PFNGLGETUNIFORMBLOCKINDEXPROC gles3wGetUniformBlockIndex;
extern PFNGLGETACTIVEUNIFORMBLOCKIVPROC gles3wGetActiveUniformBlockiv;
extern PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC gles3wGetActiveUniformBlockName;
extern PFNGLUNIFORMBLOCKBINDINGPROC gles3wUniformBlockBinding;
extern PFNGLDRAWARRAYSINSTANCEDPROC gles3wDrawArraysInstanced;
extern PFNGLDRAWELEMENTSINSTANCEDPROC gles3wDrawElementsInstanced;
extern PFNGLFENCESYNCPROC gles3wFenceSync;
extern PFNGLISSYNCPROC gles3wIsSync;
extern PFNGLDELETESYNCPROC gles3wDeleteSync;
extern PFNGLCLIENTWAITSYNCPROC gles3wClientWaitSync;
extern PFNGLWAITSYNCPROC gles3wWaitSync;
extern PFNGLGETINTEGER64VPROC gles3wGetInteger64v;
extern PFNGLGETSYNCIVPROC gles3wGetSynciv;
extern PFNGLGETINTEGER64I_VPROC gles3wGetInteger64i_v;
extern PFNGLGETBUFFERPARAMETERI64VPROC gles3wGetBufferParameteri64v;
extern PFNGLGENSAMPLERSPROC gles3wGenSamplers;
extern PFNGLDELETESAMPLERSPROC gles3wDeleteSamplers;
extern PFNGLISSAMPLERPROC gles3wIsSampler;
extern PFNGLBINDSAMPLERPROC gles3wBindSampler;
extern PFNGLSAMPLERPARAMETERIPROC gles3wSamplerParameteri;
extern PFNGLSAMPLERPARAMETERIVPROC gles3wSamplerParameteriv;
extern PFNGLSAMPLERPARAMETERFPROC gles3wSamplerParameterf;
extern PFNGLSAMPLERPARAMETERFVPROC gles3wSamplerParameterfv;
extern PFNGLGETSAMPLERPARAMETERIVPROC gles3wGetSamplerParameteriv;
extern PFNGLGETSAMPLERPARAMETERFVPROC gles3wGetSamplerParameterfv;
extern PFNGLVERTEXATTRIBDIVISORPROC gles3wVertexAttribDivisor;
extern PFNGLBINDTRANSFORMFEEDBACKPROC gles3wBindTransformFeedback;
extern PFNGLDELETETRANSFORMFEEDBACKSPROC gles3wDeleteTransformFeedbacks;
extern PFNGLGENTRANSFORMFEEDBACKSPROC gles3wGenTransformFeedbacks;
extern PFNGLISTRANSFORMFEEDBACKPROC gles3wIsTransformFeedback;
extern PFNGLPAUSETRANSFORMFEEDBACKPROC gles3wPauseTransformFeedback;
extern PFNGLRESUMETRANSFORMFEEDBACKPROC gles3wResumeTransformFeedback;
extern PFNGLGETPROGRAMBINARYPROC gles3wGetProgramBinary;
extern PFNGLPROGRAMBINARYPROC gles3wProgramBinary;
extern PFNGLPROGRAMPARAMETERIPROC gles3wProgramParameteri;
extern PFNGLINVALIDATEFRAMEBUFFERPROC gles3wInvalidateFramebuffer;
extern PFNGLINVALIDATESUBFRAMEBUFFERPROC gles3wInvalidateSubFramebuffer;
extern PFNGLTEXSTORAGE2DPROC gles3wTexStorage2D;
extern PFNGLTEXSTORAGE3DPROC gles3wTexStorage3D;
extern PFNGLGETINTERNALFORMATIVPROC gles3wGetInternalformativ;
extern PFNGLLABELOBJECTEXTPROC gles3wLabelObjectEXT;
extern PFNGLGETOBJECTLABELEXTPROC gles3wGetObjectLabelEXT;
extern PFNGLINSERTEVENTMARKEREXTPROC gles3wInsertEventMarkerEXT;
extern PFNGLPUSHGROUPMARKEREXTPROC gles3wPushGroupMarkerEXT;
extern PFNGLPOPGROUPMARKEREXTPROC gles3wPopGroupMarkerEXT;
extern PFNGLUSEPROGRAMSTAGESEXTPROC gles3wUseProgramStagesEXT;
extern PFNGLACTIVESHADERPROGRAMEXTPROC gles3wActiveShaderProgramEXT;
extern PFNGLCREATESHADERPROGRAMVEXTPROC gles3wCreateShaderProgramvEXT;
extern PFNGLBINDPROGRAMPIPELINEEXTPROC gles3wBindProgramPipelineEXT;
extern PFNGLDELETEPROGRAMPIPELINESEXTPROC gles3wDeleteProgramPipelinesEXT;
extern PFNGLGENPROGRAMPIPELINESEXTPROC gles3wGenProgramPipelinesEXT;
extern PFNGLISPROGRAMPIPELINEEXTPROC gles3wIsProgramPipelineEXT;
extern PFNGLPROGRAMPARAMETERIEXTPROC gles3wProgramParameteriEXT;
extern PFNGLGETPROGRAMPIPELINEIVEXTPROC gles3wGetProgramPipelineivEXT;
extern PFNGLPROGRAMUNIFORM1IEXTPROC gles3wProgramUniform1iEXT;
extern PFNGLPROGRAMUNIFORM2IEXTPROC gles3wProgramUniform2iEXT;
extern PFNGLPROGRAMUNIFORM3IEXTPROC gles3wProgramUniform3iEXT;
extern PFNGLPROGRAMUNIFORM4IEXTPROC gles3wProgramUniform4iEXT;
extern PFNGLPROGRAMUNIFORM1FEXTPROC gles3wProgramUniform1fEXT;
extern PFNGLPROGRAMUNIFORM2FEXTPROC gles3wProgramUniform2fEXT;
extern PFNGLPROGRAMUNIFORM3FEXTPROC gles3wProgramUniform3fEXT;
extern PFNGLPROGRAMUNIFORM4FEXTPROC gles3wProgramUniform4fEXT;
extern PFNGLPROGRAMUNIFORM1IVEXTPROC gles3wProgramUniform1ivEXT;
extern PFNGLPROGRAMUNIFORM2IVEXTPROC gles3wProgramUniform2ivEXT;
extern PFNGLPROGRAMUNIFORM3IVEXTPROC gles3wProgramUniform3ivEXT;
extern PFNGLPROGRAMUNIFORM4IVEXTPROC gles3wProgramUniform4ivEXT;
extern PFNGLPROGRAMUNIFORM1FVEXTPROC gles3wProgramUniform1fvEXT;
extern PFNGLPROGRAMUNIFORM2FVEXTPROC gles3wProgramUniform2fvEXT;
extern PFNGLPROGRAMUNIFORM3FVEXTPROC gles3wProgramUniform3fvEXT;
extern PFNGLPROGRAMUNIFORM4FVEXTPROC gles3wProgramUniform4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC gles3wProgramUniformMatrix2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC gles3wProgramUniformMatrix3fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC gles3wProgramUniformMatrix4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC gles3wProgramUniformMatrix2x3fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC gles3wProgramUniformMatrix3x2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC gles3wProgramUniformMatrix2x4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC gles3wProgramUniformMatrix4x2fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC gles3wProgramUniformMatrix3x4fvEXT;
extern PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC gles3wProgramUniformMatrix4x3fvEXT;
extern PFNGLVALIDATEPROGRAMPIPELINEEXTPROC gles3wValidateProgramPipelineEXT;
extern PFNGLGETPROGRAMPIPELINEINFOLOGEXTPROC gles3wGetProgramPipelineInfoLogEXT;

extern PFNGLDEBUGMESSAGECONTROLKHRPROC gles3wDebugMessageControlKHR;
extern PFNGLDEBUGMESSAGECALLBACKKHRPROC gles3wDebugMessageCallbackKHR;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEEXTPROC gles3wFramebufferTexture2DMultisampleEXT;
extern PFNGLFRAMEBUFFERTEXTURE2DMULTISAMPLEIMGPROC gles3wFramebufferTexture2DMultisampleIMG;

#define glActiveTexture     gles3wActiveTexture
#define glAttachShader      gles3wAttachShader
#define glBindAttribLocation        gles3wBindAttribLocation
#define glBindBuffer        gles3wBindBuffer
#define glBindFramebuffer       gles3wBindFramebuffer
#define glBindRenderbuffer      gles3wBindRenderbuffer
#define glBindTexture       gles3wBindTexture
#define glBlendColor        gles3wBlendColor
#define glBlendEquation     gles3wBlendEquation
#define glBlendEquationSeparate     gles3wBlendEquationSeparate
#define glBlendFunc     gles3wBlendFunc
#define glBlendFuncSeparate     gles3wBlendFuncSeparate
#define glBufferData        gles3wBufferData
#define glBufferSubData     gles3wBufferSubData
#define glCheckFramebufferStatus        gles3wCheckFramebufferStatus
#define glClear     gles3wClear
#define glClearColor        gles3wClearColor
#define glClearDepthf       gles3wClearDepthf
#define glClearStencil      gles3wClearStencil
#define glColorMask     gles3wColorMask
#define glCompileShader     gles3wCompileShader
#define glCompressedTexImage2D      gles3wCompressedTexImage2D
#define glCompressedTexSubImage2D       gles3wCompressedTexSubImage2D
#define glCopyTexImage2D        gles3wCopyTexImage2D
#define glCopyTexSubImage2D     gles3wCopyTexSubImage2D
#define glCreateProgram     gles3wCreateProgram
#define glCreateShader      gles3wCreateShader
#define glCullFace      gles3wCullFace
#define glDeleteBuffers     gles3wDeleteBuffers
#define glDeleteFramebuffers        gles3wDeleteFramebuffers
#define glDeleteProgram     gles3wDeleteProgram
#define glDeleteRenderbuffers       gles3wDeleteRenderbuffers
#define glDeleteShader      gles3wDeleteShader
#define glDeleteTextures        gles3wDeleteTextures
#define glDepthFunc     gles3wDepthFunc
#define glDepthMask     gles3wDepthMask
#define glDepthRangef       gles3wDepthRangef
#define glDetachShader      gles3wDetachShader
#define glDisable       gles3wDisable
#define glDisableVertexAttribArray      gles3wDisableVertexAttribArray
#define glDrawArrays        gles3wDrawArrays
#define glDrawElements      gles3wDrawElements
#define glEnable        gles3wEnable
#define glEnableVertexAttribArray       gles3wEnableVertexAttribArray
#define glFinish        gles3wFinish
#define glFlush     gles3wFlush
#define glFramebufferRenderbuffer       gles3wFramebufferRenderbuffer
#define glFramebufferTexture2D      gles3wFramebufferTexture2D
#define glFrontFace     gles3wFrontFace
#define glGenBuffers        gles3wGenBuffers
#define glGenerateMipmap        gles3wGenerateMipmap
#define glGenFramebuffers       gles3wGenFramebuffers
#define glGenRenderbuffers      gles3wGenRenderbuffers
#define glGenTextures       gles3wGenTextures
#define glGetActiveAttrib       gles3wGetActiveAttrib
#define glGetActiveUniform      gles3wGetActiveUniform
#define glGetAttachedShaders        gles3wGetAttachedShaders
#define glGetAttribLocation     gles3wGetAttribLocation
#define glGetBooleanv       gles3wGetBooleanv
#define glGetBufferParameteriv      gles3wGetBufferParameteriv
#define glGetError      gles3wGetError
#define glGetFloatv     gles3wGetFloatv
#define glGetFramebufferAttachmentParameteriv       gles3wGetFramebufferAttachmentParameteriv
#define glGetIntegerv       gles3wGetIntegerv
#define glGetProgramiv      gles3wGetProgramiv
#define glGetProgramInfoLog     gles3wGetProgramInfoLog
#define glGetRenderbufferParameteriv        gles3wGetRenderbufferParameteriv
#define glGetShaderiv       gles3wGetShaderiv
#define glGetShaderInfoLog      gles3wGetShaderInfoLog
#define glGetShaderPrecisionFormat      gles3wGetShaderPrecisionFormat
#define glGetShaderSource       gles3wGetShaderSource
#define glGetString     gles3wGetString
#define glGetTexParameterfv     gles3wGetTexParameterfv
#define glGetTexParameteriv     gles3wGetTexParameteriv
#define glGetUniformfv      gles3wGetUniformfv
#define glGetUniformiv      gles3wGetUniformiv
#define glGetUniformLocation        gles3wGetUniformLocation
#define glGetVertexAttribfv     gles3wGetVertexAttribfv
#define glGetVertexAttribiv     gles3wGetVertexAttribiv
#define glGetVertexAttribPointerv       gles3wGetVertexAttribPointerv
#define glHint      gles3wHint
#define glIsBuffer      gles3wIsBuffer
#define glIsEnabled     gles3wIsEnabled
#define glIsFramebuffer     gles3wIsFramebuffer
#define glIsProgram     gles3wIsProgram
#define glIsRenderbuffer        gles3wIsRenderbuffer
#define glIsShader      gles3wIsShader
#define glIsTexture     gles3wIsTexture
#define glLineWidth     gles3wLineWidth
#define glLinkProgram       gles3wLinkProgram
#define glPixelStorei       gles3wPixelStorei
#define glPolygonOffset     gles3wPolygonOffset
#define glReadPixels        gles3wReadPixels
#define glReleaseShaderCompiler     gles3wReleaseShaderCompiler
#define glRenderbufferStorage       gles3wRenderbufferStorage
#define glSampleCoverage        gles3wSampleCoverage
#define glScissor       gles3wScissor
#define glShaderBinary      gles3wShaderBinary
#define glShaderSource      gles3wShaderSource
#define glStencilFunc       gles3wStencilFunc
#define glStencilFuncSeparate       gles3wStencilFuncSeparate
#define glStencilMask       gles3wStencilMask
#define glStencilMaskSeparate       gles3wStencilMaskSeparate
#define glStencilOp     gles3wStencilOp
#define glStencilOpSeparate     gles3wStencilOpSeparate
#define glTexImage2D        gles3wTexImage2D
#define glTexParameterf     gles3wTexParameterf
#define glTexParameterfv        gles3wTexParameterfv
#define glTexParameteri     gles3wTexParameteri
#define glTexParameteriv        gles3wTexParameteriv
#define glTexSubImage2D     gles3wTexSubImage2D
#define glUniform1f     gles3wUniform1f
#define glUniform1fv        gles3wUniform1fv
#define glUniform1i     gles3wUniform1i
#define glUniform1iv        gles3wUniform1iv
#define glUniform2f     gles3wUniform2f
#define glUniform2fv        gles3wUniform2fv
#define glUniform2i     gles3wUniform2i
#define glUniform2iv        gles3wUniform2iv
#define glUniform3f     gles3wUniform3f
#define glUniform3fv        gles3wUniform3fv
#define glUniform3i     gles3wUniform3i
#define glUniform3iv        gles3wUniform3iv
#define glUniform4f     gles3wUniform4f
#define glUniform4fv        gles3wUniform4fv
#define glUniform4i     gles3wUniform4i
#define glUniform4iv        gles3wUniform4iv
#define glUniformMatrix2fv      gles3wUniformMatrix2fv
#define glUniformMatrix3fv      gles3wUniformMatrix3fv
#define glUniformMatrix4fv      gles3wUniformMatrix4fv
#define glUseProgram        gles3wUseProgram
#define glValidateProgram       gles3wValidateProgram
#define glVertexAttrib1f        gles3wVertexAttrib1f
#define glVertexAttrib1fv       gles3wVertexAttrib1fv
#define glVertexAttrib2f        gles3wVertexAttrib2f
#define glVertexAttrib2fv       gles3wVertexAttrib2fv
#define glVertexAttrib3f        gles3wVertexAttrib3f
#define glVertexAttrib3fv       gles3wVertexAttrib3fv
#define glVertexAttrib4f        gles3wVertexAttrib4f
#define glVertexAttrib4fv       gles3wVertexAttrib4fv
#define glVertexAttribPointer       gles3wVertexAttribPointer
#define glViewport      gles3wViewport
#define glReadBuffer        gles3wReadBuffer
#define glDrawRangeElements     gles3wDrawRangeElements
#define glTexImage3D        gles3wTexImage3D
#define glTexSubImage3D     gles3wTexSubImage3D
#define glCopyTexSubImage3D     gles3wCopyTexSubImage3D
#define glCompressedTexImage3D      gles3wCompressedTexImage3D
#define glCompressedTexSubImage3D       gles3wCompressedTexSubImage3D
#define glGenQueries        gles3wGenQueries
#define glDeleteQueries     gles3wDeleteQueries
#define glIsQuery       gles3wIsQuery
#define glBeginQuery        gles3wBeginQuery
#define glEndQuery      gles3wEndQuery
#define glGetQueryiv        gles3wGetQueryiv
#define glGetQueryObjectuiv     gles3wGetQueryObjectuiv
#define glUnmapBuffer       gles3wUnmapBuffer
#define glGetBufferPointerv     gles3wGetBufferPointerv
#define glDrawBuffers       gles3wDrawBuffers
#define glUniformMatrix2x3fv        gles3wUniformMatrix2x3fv
#define glUniformMatrix3x2fv        gles3wUniformMatrix3x2fv
#define glUniformMatrix2x4fv        gles3wUniformMatrix2x4fv
#define glUniformMatrix4x2fv        gles3wUniformMatrix4x2fv
#define glUniformMatrix3x4fv        gles3wUniformMatrix3x4fv
#define glUniformMatrix4x3fv        gles3wUniformMatrix4x3fv
#define glBlitFramebuffer       gles3wBlitFramebuffer
#define glRenderbufferStorageMultisample        gles3wRenderbufferStorageMultisample
#define glFramebufferTextureLayer       gles3wFramebufferTextureLayer
#define glMapBufferRange        gles3wMapBufferRange
#define glFlushMappedBufferRange        gles3wFlushMappedBufferRange
#define glBindVertexArray       gles3wBindVertexArray
#define glDeleteVertexArrays        gles3wDeleteVertexArrays
#define glGenVertexArrays       gles3wGenVertexArrays
#define glIsVertexArray     gles3wIsVertexArray
#define glGetIntegeri_v     gles3wGetIntegeri_v
#define glBeginTransformFeedback        gles3wBeginTransformFeedback
#define glEndTransformFeedback      gles3wEndTransformFeedback
#define glBindBufferRange       gles3wBindBufferRange
#define glBindBufferBase        gles3wBindBufferBase
#define glTransformFeedbackVaryings     gles3wTransformFeedbackVaryings
#define glGetTransformFeedbackVarying       gles3wGetTransformFeedbackVarying
#define glVertexAttribIPointer      gles3wVertexAttribIPointer
#define glGetVertexAttribIiv        gles3wGetVertexAttribIiv
#define glGetVertexAttribIuiv       gles3wGetVertexAttribIuiv
#define glVertexAttribI4i       gles3wVertexAttribI4i
#define glVertexAttribI4ui      gles3wVertexAttribI4ui
#define glVertexAttribI4iv      gles3wVertexAttribI4iv
#define glVertexAttribI4uiv     gles3wVertexAttribI4uiv
#define glGetUniformuiv     gles3wGetUniformuiv
#define glGetFragDataLocation       gles3wGetFragDataLocation
#define glUniform1ui        gles3wUniform1ui
#define glUniform2ui        gles3wUniform2ui
#define glUniform3ui        gles3wUniform3ui
#define glUniform4ui        gles3wUniform4ui
#define glUniform1uiv       gles3wUniform1uiv
#define glUniform2uiv       gles3wUniform2uiv
#define glUniform3uiv       gles3wUniform3uiv
#define glUniform4uiv       gles3wUniform4uiv
#define glClearBufferiv     gles3wClearBufferiv
#define glClearBufferuiv        gles3wClearBufferuiv
#define glClearBufferfv     gles3wClearBufferfv
#define glClearBufferfi     gles3wClearBufferfi
#define glGetStringi        gles3wGetStringi
#define glCopyBufferSubData     gles3wCopyBufferSubData
#define glGetUniformIndices     gles3wGetUniformIndices
#define glGetActiveUniformsiv       gles3wGetActiveUniformsiv
#define glGetUniformBlockIndex      gles3wGetUniformBlockIndex
#define glGetActiveUniformBlockiv       gles3wGetActiveUniformBlockiv
#define glGetActiveUniformBlockName     gles3wGetActiveUniformBlockName
#define glUniformBlockBinding       gles3wUniformBlockBinding
#define glDrawArraysInstanced       gles3wDrawArraysInstanced
#define glDrawElementsInstanced     gles3wDrawElementsInstanced
#define glFenceSync     gles3wFenceSync
#define glIsSync        gles3wIsSync
#define glDeleteSync        gles3wDeleteSync
#define glClientWaitSync        gles3wClientWaitSync
#define glWaitSync      gles3wWaitSync
#define glGetInteger64v     gles3wGetInteger64v
#define glGetSynciv     gles3wGetSynciv
#define glGetInteger64i_v       gles3wGetInteger64i_v
#define glGetBufferParameteri64v        gles3wGetBufferParameteri64v
#define glGenSamplers       gles3wGenSamplers
#define glDeleteSamplers        gles3wDeleteSamplers
#define glIsSampler     gles3wIsSampler
#define glBindSampler       gles3wBindSampler
#define glSamplerParameteri     gles3wSamplerParameteri
#define glSamplerParameteriv        gles3wSamplerParameteriv
#define glSamplerParameterf     gles3wSamplerParameterf
#define glSamplerParameterfv        gles3wSamplerParameterfv
#define glGetSamplerParameteriv     gles3wGetSamplerParameteriv
#define glGetSamplerParameterfv     gles3wGetSamplerParameterfv
#define glVertexAttribDivisor       gles3wVertexAttribDivisor
#define glBindTransformFeedback     gles3wBindTransformFeedback
#define glDeleteTransformFeedbacks      gles3wDeleteTransformFeedbacks
#define glGenTransformFeedbacks     gles3wGenTransformFeedbacks
#define glIsTransformFeedback       gles3wIsTransformFeedback
#define glPauseTransformFeedback        gles3wPauseTransformFeedback
#define glResumeTransformFeedback       gles3wResumeTransformFeedback
#define glGetProgramBinary      gles3wGetProgramBinary
#define glProgramBinary     gles3wProgramBinary
#define glProgramParameteri     gles3wProgramParameteri
#define glInvalidateFramebuffer     gles3wInvalidateFramebuffer
#define glInvalidateSubFramebuffer      gles3wInvalidateSubFramebuffer
#define glTexStorage2D      gles3wTexStorage2D
#define glTexStorage3D      gles3wTexStorage3D
#define glGetInternalformativ       gles3wGetInternalformativ
#define glLabelObjectEXT        gles3wLabelObjectEXT
#define glGetObjectLabelEXT     gles3wGetObjectLabelEXT
#define glInsertEventMarkerEXT      gles3wInsertEventMarkerEXT
#define glPushGroupMarkerEXT        gles3wPushGroupMarkerEXT
#define glPopGroupMarkerEXT     gles3wPopGroupMarkerEXT
#define glUseProgramStagesEXT       gles3wUseProgramStagesEXT
#define glActiveShaderProgramEXT        gles3wActiveShaderProgramEXT
#define glCreateShaderProgramvEXT       gles3wCreateShaderProgramvEXT
#define glBindProgramPipelineEXT        gles3wBindProgramPipelineEXT
#define glDeleteProgramPipelinesEXT     gles3wDeleteProgramPipelinesEXT
#define glGenProgramPipelinesEXT        gles3wGenProgramPipelinesEXT
#define glIsProgramPipelineEXT      gles3wIsProgramPipelineEXT
#define glProgramParameteriEXT      gles3wProgramParameteriEXT
#define glGetProgramPipelineivEXT       gles3wGetProgramPipelineivEXT
#define glProgramUniform1iEXT       gles3wProgramUniform1iEXT
#define glProgramUniform2iEXT       gles3wProgramUniform2iEXT
#define glProgramUniform3iEXT       gles3wProgramUniform3iEXT
#define glProgramUniform4iEXT       gles3wProgramUniform4iEXT
#define glProgramUniform1fEXT       gles3wProgramUniform1fEXT
#define glProgramUniform2fEXT       gles3wProgramUniform2fEXT
#define glProgramUniform3fEXT       gles3wProgramUniform3fEXT
#define glProgramUniform4fEXT       gles3wProgramUniform4fEXT
#define glProgramUniform1ivEXT      gles3wProgramUniform1ivEXT
#define glProgramUniform2ivEXT      gles3wProgramUniform2ivEXT
#define glProgramUniform3ivEXT      gles3wProgramUniform3ivEXT
#define glProgramUniform4ivEXT      gles3wProgramUniform4ivEXT
#define glProgramUniform1fvEXT      gles3wProgramUniform1fvEXT
#define glProgramUniform2fvEXT      gles3wProgramUniform2fvEXT
#define glProgramUniform3fvEXT      gles3wProgramUniform3fvEXT
#define glProgramUniform4fvEXT      gles3wProgramUniform4fvEXT
#define glProgramUniformMatrix2fvEXT        gles3wProgramUniformMatrix2fvEXT
#define glProgramUniformMatrix3fvEXT        gles3wProgramUniformMatrix3fvEXT
#define glProgramUniformMatrix4fvEXT        gles3wProgramUniformMatrix4fvEXT
#define glProgramUniformMatrix2x3fvEXT      gles3wProgramUniformMatrix2x3fvEXT
#define glProgramUniformMatrix3x2fvEXT      gles3wProgramUniformMatrix3x2fvEXT
#define glProgramUniformMatrix2x4fvEXT      gles3wProgramUniformMatrix2x4fvEXT
#define glProgramUniformMatrix4x2fvEXT      gles3wProgramUniformMatrix4x2fvEXT
#define glProgramUniformMatrix3x4fvEXT      gles3wProgramUniformMatrix3x4fvEXT
#define glProgramUniformMatrix4x3fvEXT      gles3wProgramUniformMatrix4x3fvEXT
#define glValidateProgramPipelineEXT        gles3wValidateProgramPipelineEXT
#define glGetProgramPipelineInfoLogEXT      gles3wGetProgramPipelineInfoLogEXT

#define glDebugMessageControlKHR	gles3wDebugMessageControlKHR
#define glDebugMessageCallbackKHR	gles3wDebugMessageCallbackKHR
#define glFramebufferTexture2DMultisampleEXT	gles3wFramebufferTexture2DMultisampleEXT
#define glFramebufferTexture2DMultisampleIMG	gles3wFramebufferTexture2DMultisampleIMG

#ifdef __cplusplus
}
#endif
