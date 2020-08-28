/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
Copyright (c) 2013-2016 Chukong Technologies Inc.
Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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

#ifndef __CCCONFIG_H__
#define __CCCONFIG_H__



/**
 * @file
 * cocos2d (cc) configuration file.
*/

// disable module if you didn't need it, this will reduce package size

#ifndef USE_VIDEO
#define USE_VIDEO 1
#endif

#ifndef USE_AUDIO
#define USE_AUDIO 1
#endif

#ifndef USE_SOCKET
#define USE_SOCKET 1
#endif

/** @def CC_FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX
 * If enabled, the texture coordinates will be calculated by using this formula:
 * - texCoord.left = (rect.origin.x*2+1) / (texture.wide*2);
 * - texCoord.right = texCoord.left + (rect.size.width*2-2)/(texture.wide*2);

 * The same for bottom and top.

 * This formula prevents artifacts by using 99% of the texture.
 * The "correct" way to prevent artifacts is by using the spritesheet-artifact-fixer.py or a similar tool.

 * Affected nodes:
 * - TMXLayer

 * To enabled set it to 1. Enabled by default.

 * @since Cocos Creator v1.7
 */
#ifndef CC_FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX
#define CC_FIX_ARTIFACTS_BY_STRECHING_TEXEL_TMX 1
#endif

/** Support PNG or not. If your application don't use png format picture, you can undefine this macro to save package size.
*/
#ifndef CC_USE_PNG
#define CC_USE_PNG  1
#endif // CC_USE_PNG

/** Support JPEG or not. If your application don't use jpeg format picture, you can undefine this macro to save package size.
 */
#ifndef CC_USE_JPEG
#define CC_USE_JPEG  1
#endif // CC_USE_JPEG

/** Support webp or not. If your application don't use webp format picture, you can undefine this macro to save package size.
 */
#ifndef CC_USE_WEBP
#define CC_USE_WEBP  1
#endif // CC_USE_WEBP

/** Support EditBox 
 */
#ifndef CC_USE_EDITBOX
#define CC_USE_EDITBOX 1
#endif

#ifndef CC_FILEUTILS_APPLE_ENABLE_OBJC
#define CC_FILEUTILS_APPLE_ENABLE_OBJC  1
#endif

/** @def CC_ENABLE_PREMULTIPLIED_ALPHA
 * If enabled, all textures will be preprocessed to multiply its rgb components
 * by its alpha component.
 */
#ifndef CC_ENABLE_PREMULTIPLIED_ALPHA
# define CC_ENABLE_PREMULTIPLIED_ALPHA 1
#endif

#endif // __CCCONFIG_H__
