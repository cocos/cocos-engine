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
#pragma once

#include "core/CoreStd.h"

namespace cc {
namespace gfx {
class InputAssembler;
class PipelineState;
class RenderPass;
}; // namespace gfx

namespace pipeline {
struct PassView;

class CC_DLL PipelineStateManager {
public:
    static gfx::PipelineState *getOrCreatePipelineState(const PassView *pass,
                                                        gfx::Shader *shader,
                                                        gfx::InputAssembler *inputAssembler,
                                                        gfx::RenderPass *renderPass);
    static gfx::PipelineState *getOrCreatePipelineStateByJS(uint32_t passHandle,
                                                            gfx::Shader *shader,
                                                            gfx::InputAssembler *inputAssembler,
                                                            gfx::RenderPass *renderPass);

private:
    static map<uint, gfx::PipelineState *> _PSOHashMap;
};

} // namespace pipeline
} // namespace cc
