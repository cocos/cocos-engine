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
#ifndef CC_GFXGLES2_RENDER_PASS_H_
#define CC_GFXGLES2_RENDER_PASS_H_

namespace cc {
namespace gfx {

class GLES2GPURenderPass;

class CC_GLES2_API GLES2RenderPass final : public RenderPass {
public:
    GLES2RenderPass(Device *device);
    ~GLES2RenderPass();

public:
    virtual bool initialize(const RenderPassInfo &info) override;
    virtual void destroy() override;

    CC_INLINE GLES2GPURenderPass *gpuRenderPass() const { return _gpuRenderPass; }

private:
    GLES2GPURenderPass *_gpuRenderPass = nullptr;
};

} // namespace gfx
} // namespace cc

#endif
