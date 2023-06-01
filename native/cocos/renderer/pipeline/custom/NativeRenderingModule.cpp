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

#include "LayoutGraphGraphs.h"
#include "NativePipelineTypes.h"
#include "details/GslUtils.h"

namespace cc {

namespace render {

uint32_t NativeRenderingModule::getPassID(const ccstd::string &name) const {
    CC_EXPECTS(programLibrary);
    CC_EXPECTS(!name.empty());
    return locate(LayoutGraphData::null_vertex(), name, programLibrary->layoutGraph);
}

uint32_t NativeRenderingModule::getSubpassID(uint32_t passID, const ccstd::string &name) const {
    CC_EXPECTS(programLibrary);
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(passID != LayoutGraphData::null_vertex());
    return locate(passID, name, programLibrary->layoutGraph);
}

uint32_t NativeRenderingModule::getPhaseID(uint32_t subpassOrPassID, const ccstd::string &name) const {
    CC_EXPECTS(programLibrary);
    CC_EXPECTS(!name.empty());
    CC_EXPECTS(subpassOrPassID != LayoutGraphData::null_vertex());
    return locate(subpassOrPassID, name, programLibrary->layoutGraph);
}

} // namespace render

} // namespace cc
