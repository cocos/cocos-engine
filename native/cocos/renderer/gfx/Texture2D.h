/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "../Macro.h"
#include "../Types.h"

#include "Texture.h"

RENDERER_BEGIN

/**
 * @addtogroup gfx
 * @{
 */

/**
 * The 2d texture class\n
 * JS API: gfx.Texture2D
 @code
 let texture = new gfx.Texture2D(cc.renderer.device, {
     images: [],
     width: 128,
     height: 128,
     wrapS: renderEngine.gfx.WRAP_REPEAT,
     wrapT: renderEngine.gfx.WRAP_REPEAT,
     format: renderEngine.gfx.TEXTURE_FMT_RGB8,
     mipmap: false,
 });
 @endcode
 */
class Texture2D : public Texture
{
public:
    Texture2D();
    ~Texture2D();

    /*
     * Init the texture with device and options
     * @see Texture::Options
     */
    bool init(DeviceGraphics* device, Options& options);
    /**
     * Update the texture with new options
     * @see Texture::Options
     */
    void update(const Options& options);
    /**
     * Update a sub area of the texture with sub image option
     * @see Texture::SubImageOption
     */
    void updateSubImage(const SubImageOption& option);
    /**
     * Update the image of a given level mipmap specified in image option
     * @see Texture::ImageOption
     */
    void updateImage(const ImageOption& option);

private:
    void setSubImage(const SubImageOption& options);
    void setImage(const ImageOption& options);
    void setMipmap(const std::vector<Image>& images, bool isFlipY, bool isPremultiplyAlpha);
    void setTexInfo();

};

// end of gfx group
/// @}

RENDERER_END
