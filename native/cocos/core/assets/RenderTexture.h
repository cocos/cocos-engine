/****************************************************************************
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

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

#pragma once

#include "core/assets/TextureBase.h"
#include "renderer/gfx-base/GFXDef.h"

namespace cc {

struct IRenderTextureCreateInfo {
    ccstd::optional<ccstd::string> name;
    uint32_t width;
    uint32_t height;
    ccstd::optional<gfx::RenderPassInfo> passInfo;
    ccstd::optional<uint32_t> externalResLow;        // for vulkan vkImage/opengl es texture created from external
    ccstd::optional<uint32_t> externalResHigh;       // for vulkan vkImage created from external
    ccstd::optional<gfx::TextureFlags> externalFlag; // external texture type normal or oes
};
namespace scene {
class RenderWindow;
}

namespace gfx {
class Texture;
class Sampler;
} // namespace gfx

/**
 * @en Render texture is a render target for [[Camera]] or [[Canvas]] component,
 * the render pipeline will use its [[RenderWindow]] as the target of the rendering process.
 * @zh 渲染贴图是 [[Camera]] 或 [[Canvas]] 组件的渲染目标对象，渲染管线会使用它的 [[RenderWindow]] 作为渲染的目标窗口。
 */
class RenderTexture final : public TextureBase {
public:
    using Super = TextureBase;

    RenderTexture();
    ~RenderTexture() override;

    /**
     * @en The render window for the render pipeline, it's created internally and cannot be modified.
     * @zh 渲染管线所使用的渲染窗口，内部逻辑创建，无法被修改。
     */
    inline scene::RenderWindow *getWindow() const { return _window; }

    void initialize(const IRenderTextureCreateInfo &info);
    void reset(const IRenderTextureCreateInfo &info); // to be consistent with other assets

    bool destroy() override;

    /**
     * @en Resize the render texture
     * @zh 修改渲染贴图的尺寸
     * @param width The pixel width, the range is from 1 to 2048
     * @param height The pixel height, the range is from 1 to 2048
     */
    void resize(uint32_t width, uint32_t height);

    // TODO(minggo): migration with TextureBase data
    // @ts-expect-error Hack
    //    get _serialize () { return null; }
    // @ts-expect-error Hack
    //    get _deserialize () { return null; }

    // To be compatible with material property interface
    /**
     * @en Gets the related [[Texture]] resource, it's also the color attachment for the render window
     * @zh 获取渲染贴图的 GFX 资源，同时也是渲染窗口所指向的颜色缓冲贴图资源
     */
    gfx::Texture *getGFXTexture() const override;

    void onLoaded() override;

    void initWindow();
    void initWindow(const IRenderTextureCreateInfo &info);

    void initDefault(const ccstd::optional<ccstd::string> &uuid) override;

    bool validate() const override;

    /**
     * @en Read pixel buffer from render texture
     * @param x The location on x axis
     * @param y The location on y axis
     * @param width The pixel width
     * @param height The pixel height
     * @zh 从 render texture 读取像素数据
     * @param x 起始位置X轴坐标
     * @param y 起始位置Y轴坐标
     * @param width 像素宽度
     * @param height 像素高度
     */
    ccstd::vector<uint8_t> readPixels(uint32_t x, uint32_t y, uint32_t width, uint32_t height) const;

private:
    scene::RenderWindow *_window{nullptr};

    CC_DISALLOW_COPY_MOVE_ASSIGN(RenderTexture);
};

} // namespace cc
